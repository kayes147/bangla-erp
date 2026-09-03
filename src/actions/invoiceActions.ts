"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { recordAuditLog } from "./auditLogActions";

export async function createInvoice(data: {
  type: "product_in" | "product_out";
  clientId: string;
  items: {
    productName: string;
    quantity: number;
    pricePerUnit: number;
  }[];
  paidAmount: number;
  requestedBy: string;
  status: string; // PENDING for manager/client, APPROVED for owner
  dueDate?: string; // Optional promised payment date for remaining dues
}) {
  try {
    let totalAmount = 0;
    
    // Create the invoice and items inside a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Process items and calculate total
      const processedItems = [];
      for (const item of data.items) {
        const itemTotal = item.quantity * item.pricePerUnit;
        totalAmount += itemTotal;
        
        // Find or create product
        let product = await tx.product.findFirst({
          where: { name: item.productName }
        });
        
        if (!product) {
          product = await tx.product.create({
            data: {
              name: item.productName,
              buyPrice: data.type === "product_in" ? item.pricePerUnit : 0,
              sellPrice: data.type === "product_out" ? item.pricePerUnit : 0,
              stock: 0 // Will update if approved
            }
          });
        }
        
        // If approved instantly, update stock
        if (data.status === "APPROVED") {
          await tx.product.update({
            where: { id: product.id },
            data: {
              stock: data.type === "product_in" 
                ? { increment: item.quantity }
                : { decrement: item.quantity }
            }
          });
        }
        
        processedItems.push({
          productId: product.id,
          quantity: item.quantity,
          pricePerUnit: item.pricePerUnit,
          total: itemTotal
        });
      }
      
      let paymentStatus = "due";
      if (data.paidAmount >= totalAmount) paymentStatus = "paid";
      else if (data.paidAmount > 0) paymentStatus = "partial";
      
      // 2. Create Invoice
      const invoice = await tx.invoice.create({
        data: {
          type: data.type,
          clientId: data.clientId,
          totalAmount,
          paidAmount: data.paidAmount,
          paymentStatus,
          status: data.status,
          requestedBy: data.requestedBy,
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
          items: {
            create: processedItems
          }
        }
      });
      
      // 3. If approved, update client balance & create transactions
      if (data.status === "APPROVED") {
        const dueAmount = totalAmount - data.paidAmount;
        
        if (dueAmount > 0) {
          // If product_in, we owe supplier (balance becomes negative)
          // If product_out, customer owes us (balance becomes positive)
          await tx.client.update({
            where: { id: data.clientId },
            data: {
              openingBalance: data.type === "product_in" 
                ? { decrement: dueAmount }
                : { increment: dueAmount }
            }
          });
        }
        
        // If money changed hands, record it in Main Cash
        if (data.paidAmount > 0) {
          const client = await tx.client.findUnique({ where: { id: data.clientId } });
          const clientName = client?.name || "Client";
          const typeLabel = data.type === "product_in" 
            ? `পণ্য ইন (মহাজন: ${clientName})` 
            : `পণ্য আউট (কাস্টমার: ${clientName})`;

          await tx.transaction.create({
            data: {
              type: data.type === "product_in" ? "out" : "in", // If we buy, cash goes out. If sell, cash comes in.
              amount: data.paidAmount,
              description: typeLabel,
              status: "APPROVED",
              clientId: data.clientId,
              invoiceId: invoice.id,
              requestedBy: data.requestedBy
            }
          });
        }
      }
      
      return invoice;
    });

    try {
      revalidatePath("/product-in");
      revalidatePath("/product-out");
      revalidatePath("/main-cash");
      revalidatePath("/clients");
      revalidatePath("/loan");
      revalidatePath("/");
    } catch (revalErr) {
      console.warn("Revalidate warning:", revalErr);
    }
    
    // Record audit log
    try {
      await recordAuditLog(
        data.requestedBy || "manager",
        data.type === "product_in" ? "CREATE_INVOICE_IN" : "CREATE_INVOICE_OUT",
        `Created ${data.type === "product_in" ? "Product In" : "Product Out"} Invoice #${result.id.slice(0, 8)} for ৳${result.totalAmount.toLocaleString()} (${data.status})`
      );
    } catch (auditErr) {
      console.warn("Audit log warning:", auditErr);
    }

    return { success: true, invoice: result };
  } catch (error: any) {
    console.error("Error creating invoice:", error);
    return { success: false, error: error?.message || "Failed to create invoice" };
  }
}

export async function getInvoices(type: string) {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { type },
      orderBy: { date: "desc" },
      include: {
        client: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });
    return { success: true, invoices };
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return { success: false, invoices: [] };
  }
}

export async function getDueInvoices() {
  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        paymentStatus: { in: ["due", "partial"] },
        status: "APPROVED",
      },
      orderBy: { date: "desc" },
      include: {
        client: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    return { success: true, invoices };
  } catch (error) {
    console.error("Error fetching due invoices:", error);
    return { success: false, invoices: [] };
  }
}

export async function settleInvoiceDue(data: {
  invoiceId: string;
  amount: number;
  paymentMethod?: string;
  requestedBy?: string;
}) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: data.invoiceId },
      include: { client: true },
    });

    if (!invoice) return { success: false, error: "Invoice not found" };

    const remainingDue = invoice.totalAmount - invoice.paidAmount;
    if (data.amount <= 0 || data.amount > remainingDue) {
      return { success: false, error: "সঠিক টাকার পরিমাণ দিন (বকেয়ার চেয়ে বেশি দেওয়া যাবে না)" };
    }

    const newPaidAmount = invoice.paidAmount + Number(data.amount);
    const newPaymentStatus = newPaidAmount >= invoice.totalAmount ? "paid" : "partial";

    await prisma.$transaction(async (tx) => {
      // 1. Update invoice
      await tx.invoice.update({
        where: { id: data.invoiceId },
        data: {
          paidAmount: newPaidAmount,
          paymentStatus: newPaymentStatus,
        },
      });

      // 2. Update client balance
      await tx.client.update({
        where: { id: invoice.clientId },
        data: {
          openingBalance: invoice.type === "product_in"
            ? { increment: Number(data.amount) }
            : { decrement: Number(data.amount) },
        },
      });

      // 3. Record in Main Cash
      await tx.transaction.create({
        data: {
          type: invoice.type === "product_in" ? "out" : "in",
          amount: Number(data.amount),
          description: `[বকেয়া পরিশোধ] Invoice #${invoice.id.substring(0, 8)} (${invoice.client.name})`,
          status: "APPROVED",
          clientId: invoice.clientId,
          invoiceId: invoice.id,
          requestedBy: data.requestedBy || "owner",
        },
      });
    });

    try {
      revalidatePath("/loan");
      revalidatePath("/due");
      revalidatePath("/main-cash");
      revalidatePath("/clients");
      revalidatePath("/product-in");
      revalidatePath("/product-out");
      revalidatePath("/");
    } catch (e) {
      console.warn("Revalidate warning:", e);
    }

    try {
      await recordAuditLog(
        data.requestedBy || "owner",
        "SETTLE_DUE",
        `Settled due of ৳${Number(data.amount).toLocaleString()} for Invoice #${invoice.id.substring(0, 8)} (${invoice.client.name})`
      );
    } catch (e) {
      console.warn("Audit log warning:", e);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error settling invoice due:", error);
    return { success: false, error: error?.message || "Failed to settle due" };
  }
}

export async function recordTagadaReminder(data: {
  invoiceId: string;
  clientName: string;
  amount: number;
  channel: string;
  requestedBy?: string;
}) {
  try {
    await recordAuditLog(
      data.requestedBy || "owner",
      "TAGADA_REMINDER",
      `বকেয়া তাগাদা পাঠানো হয়েছে: ${data.clientName}-কে ৳${Number(data.amount).toLocaleString()} বকেয়ার জন্য (${data.channel}, Invoice #${data.invoiceId.substring(0, 8)})`
    );
    revalidatePath("/loan");
    revalidatePath("/audit-logs");
    return { success: true };
  } catch (error: any) {
    console.error("Error recording tagada reminder:", error);
    return { success: false, error: error?.message || "Failed to record reminder" };
  }
}
