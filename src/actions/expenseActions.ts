"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { recordAuditLog } from "./auditLogActions";

export async function addExpense(data: {
  category: string;
  amount: number;
  description: string;
  isPersonal: boolean;
  paymentMethod?: string; // "business_cash" or "other_source"
  requestedBy: string; // the username (e.g., 'manager' or 'owner')
}) {
  try {
    const isOwner = data.requestedBy === "owner";
    const status = (data.isPersonal && !isOwner) ? "PENDING" : "APPROVED";
    const paymentMethod = data.paymentMethod || (data.isPersonal ? "business_cash" : "cash");

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

    // If it's APPROVED immediately, check whether to create Main Cash Transaction
    if (status === "APPROVED") {
      // Deduct from Main Cash only if it's a business expense OR personal expense from business cash
      const shouldDeductMainCash = !data.isPersonal || paymentMethod === "business_cash";

      if (shouldDeductMainCash) {
        try {
          await prisma.transaction.create({
            data: {
              type: "out",
              amount: Number(data.amount),
              description: `[খরচ${data.isPersonal ? " (ব্যক্তিগত)" : ""}] ${data.category}: ${data.description}`,
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
        `Added ${data.isPersonal ? "Personal" : "Business"} expense of ৳${Number(data.amount).toLocaleString()} in '${data.category}' (${status}, Source: ${paymentMethod === "other_source" ? "ব্যক্তিগত/অন্যান্য তহবিল" : "ব্যবসার ক্যাশ"})`
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
