"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { recordAuditLog } from "./auditLogActions";

export async function addExpense(data: {
  category: string;
  amount: number;
  description: string;
  isPersonal: boolean;
  paymentMethod?: string; // "cash", "mobile_banking", "bank", or "other_source"
  requestedBy: string; // the username (e.g., 'manager' or 'owner')
}) {
  try {
    const isOwner = data.requestedBy === "owner";
    const status = (data.isPersonal && !isOwner) ? "PENDING" : "APPROVED";
    const paymentMethod = data.paymentMethod || "cash";

    const expense = await prisma.expense.create({
      data: {
        category: {
          connectOrCreate: {
            where: { name: data.category },
            create: { name: data.category }
          }
        },
        amount: Number(data.amount),
        description: data.description,
        isPersonal: data.isPersonal,
        paymentMethod: paymentMethod,
        requestedBy: data.requestedBy,
        status: status,
      },
    });

    // If it's APPROVED immediately:
    // User requirement: Main cash must calculate all business expenses regardless of payment method.
    if (status === "APPROVED") {
      const isOtherPersonalSource = data.isPersonal && paymentMethod === "other_source";

      // Deduct from Main Cash for ALL business expenses, and personal expenses from business cash
      if (!isOtherPersonalSource) {
        let methodText = "নগদ";
        if (paymentMethod === "mobile_banking") methodText = "মোবাইল ব্যাংকিং";
        else if (paymentMethod === "bank") methodText = "ব্যাংক";

        try {
          await prisma.transaction.create({
            data: {
              type: "out",
              amount: Number(data.amount),
              description: `[খরচ${data.isPersonal ? " (ব্যক্তিগত)" : ""} - ${methodText}] ${data.category}: ${data.description}`,
              status: "APPROVED",
              requestedBy: data.requestedBy,
              expense: { connect: { id: expense.id } },
            },
          });
        } catch (txErr) {
          console.warn("Main cash transaction creation warning:", txErr);
        }
      }
    }

    try {
      revalidatePath("/expenses");
      revalidatePath("/main-cash");
      revalidatePath("/");
    } catch (e) {
      console.warn("Revalidate path warning:", e);
    }
    
    try {
      await recordAuditLog(
        data.requestedBy,
        "ADD_EXPENSE",
        `Added ${data.isPersonal ? "Personal" : "Business"} expense of ৳${Number(data.amount).toLocaleString()} in '${data.category}' (${status}, Method: ${paymentMethod})`
      );
    } catch (e) {
      console.warn("Audit log recording warning:", e);
    }

    return { success: true, expense };
  } catch (error: any) {
    console.error("Error adding expense:", error);
    return { success: false, error: error?.message || "Failed to add expense" };
  }
}

export async function getExpenses() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { date: "desc" },
      include: { category: true }
    });
    
    const formattedExpenses = expenses.map(e => ({
      ...e,
      category: e.category.name
    }));

    return { success: true, expenses: formattedExpenses };
  } catch (error: any) {
    console.error("Error fetching expenses:", error);
    return { success: false, error: error?.message || "Failed to fetch expenses", expenses: [] };
  }
}

export async function deleteExpense(id: string) {
  try {
    await prisma.expense.delete({
      where: { id },
    });
    revalidatePath("/expenses");
    revalidatePath("/main-cash");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting expense:", error);
    return { success: false, error: error?.message || "Failed to delete expense" };
  }
}
