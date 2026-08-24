"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
          await tx.transaction.create({
            data: {
              type: data.type === "product_in" ? "out" : "in", // If we buy, cash goes out. If sell, cash comes in.
              amount: data.paidAmount,
              description: `Payment for Invoice #${invoice.id.substring(0, 8)}`,
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

    revalidatePath("/product-in");
    revalidatePath("/product-out");
    revalidatePath("/main-cash");
    revalidatePath("/clients");
    
    return { success: true, invoice: result };
  } catch (error) {
    console.error("Error creating invoice:", error);
    return { success: false, error: "Failed to create invoice" };
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
