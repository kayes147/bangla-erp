"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { recordAuditLog } from "./auditLogActions";

export async function getPendingApprovals() {
  try {
    // 1. Pending Invoices (Product In/Out)
    const pendingInvoices = await prisma.invoice.findMany({
      where: { status: "PENDING" },
      include: {
        client: true,
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // 2. Pending Expenses
    const pendingExpenses = await prisma.expense.findMany({
      where: { status: "PENDING" },
      include: {
        category: true,
        employee: true,
      },
      orderBy: { createdAt: "desc" }
    });

    // 3. Pending Transactions (Main Cash)
    const pendingTransactions = await prisma.transaction.findMany({
      where: { 
        status: "PENDING",
        invoiceId: null, // Don't fetch transactions that are tied to pending invoices (they get approved when invoice does)
        expense: null    // Don't fetch transactions tied to pending expenses
      },
      include: {
        client: true,
      },
      orderBy: { createdAt: "desc" }
    });

    return { 
      success: true, 
      invoices: pendingInvoices,
      expenses: pendingExpenses,
      transactions: pendingTransactions
    };
  } catch (error) {
    console.error("Error fetching approvals:", error);
    return { success: false, invoices: [], expenses: [], transactions: [] };
  }
}

export async function approveInvoice(id: string) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!invoice || invoice.status === "APPROVED") {
      return { success: false, error: "Invoice not found or already approved." };
    }

    await prisma.$transaction(async (tx) => {
      // 1. Update invoice status
      await tx.invoice.update({
        where: { id },
        data: { status: "APPROVED" }
      });

      // 2. Update product stock
      for (const item of invoice.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: invoice.type === "product_in" 
              ? { increment: item.quantity }
              : { decrement: item.quantity }
          }
        });
      }

      // 3. Update client balance
      const dueAmount = invoice.totalAmount - invoice.paidAmount;
      if (dueAmount > 0) {
        await tx.client.update({
          where: { id: invoice.clientId },
          data: {
            openingBalance: invoice.type === "product_in" 
              ? { decrement: dueAmount }
              : { increment: dueAmount }
          }
        });
      }

      // 4. Create main cash transaction if paidAmount > 0
      if (invoice.paidAmount > 0) {
        const client = await tx.client.findUnique({ where: { id: invoice.clientId } });
        const clientName = client?.name || "Client";
        const typeLabel = invoice.type === "product_in" 
          ? `পণ্য ইন (মহাজন: ${clientName})` 
          : `পণ্য আউট (কাস্টমার: ${clientName})`;

        await tx.transaction.create({
          data: {
            type: invoice.type === "product_in" ? "out" : "in",
            amount: invoice.paidAmount,
            description: typeLabel,
            status: "APPROVED",
            clientId: invoice.clientId,
            invoiceId: invoice.id,
            requestedBy: invoice.requestedBy
          }
        });
      }
    });

    revalidatePath("/approvals");
    revalidatePath("/product-in");
    revalidatePath("/product-out");
    revalidatePath("/main-cash");
    revalidatePath("/clients");
    
    await recordAuditLog("owner", "APPROVE_INVOICE", `Approved ${invoice.type === "product_in" ? "Product In" : "Product Out"} Invoice #${id.substring(0, 8)} for ৳${invoice.totalAmount.toLocaleString()}`);

    return { success: true };
  } catch (error: any) {
    console.error("Error approving invoice:", error);
    return { success: false, error: error.message };
  }
}

export async function rejectInvoice(id: string) {
  try {
    await prisma.invoice.update({
      where: { id },
      data: { status: "REJECTED" }
    });
    revalidatePath("/approvals");
    await recordAuditLog("owner", "REJECT_INVOICE", `Rejected Invoice #${id.substring(0, 8)}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function approveExpense(id: string) {
  try {
    const expense = await prisma.expense.findUnique({
      where: { id }
    });

    if (!expense || expense.status === "APPROVED") {
      return { success: false, error: "Expense not found or already approved." };
    }

    await prisma.$transaction(async (tx) => {
      // 1. Update expense status
      await tx.expense.update({
        where: { id },
        data: { status: "APPROVED" }
      });

      // 2. Create transaction ONLY if business expense or personal expense from business cash
      if (!expense.isPersonal || expense.paymentMethod === "business_cash") {
        await tx.transaction.create({
          data: {
            type: "out",
            amount: expense.amount,
            description: `[Expense${expense.isPersonal ? " - ব্যক্তিগত" : ""}] ${expense.description}`,
            status: "APPROVED",
            expense: { connect: { id: expense.id } },
            requestedBy: expense.requestedBy
          }
        });
      }
    });

    revalidatePath("/approvals");
    revalidatePath("/expenses");
    revalidatePath("/main-cash");
    
    await recordAuditLog("owner", "APPROVE_EXPENSE", `Approved expense of ৳${expense.amount.toLocaleString()} (${expense.description})`);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function rejectExpense(id: string) {
  try {
    await prisma.expense.update({
      where: { id },
      data: { status: "REJECTED" }
    });
    revalidatePath("/approvals");
    await recordAuditLog("owner", "REJECT_EXPENSE", `Rejected expense #${id.substring(0, 8)}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function approveTransaction(id: string) {
  try {
    const tx = await prisma.transaction.update({
      where: { id },
      data: { status: "APPROVED" }
    });
    revalidatePath("/approvals");
    revalidatePath("/main-cash");
    await recordAuditLog("owner", "APPROVE_TRANSACTION", `Approved cash ${tx.type === "in" ? "In" : "Out"} of ৳${tx.amount.toLocaleString()} (${tx.description})`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function rejectTransaction(id: string) {
  try {
    await prisma.transaction.update({
      where: { id },
      data: { status: "REJECTED" }
    });
    revalidatePath("/approvals");
    await recordAuditLog("owner", "REJECT_TRANSACTION", `Rejected transaction #${id.substring(0, 8)}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
