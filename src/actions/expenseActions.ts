"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { recordAuditLog } from "./auditLogActions";

export async function addExpense(data: {
  category: string;
  amount: number;
  description: string;
  isPersonal: boolean;
  requestedBy: string; // the username (e.g., 'manager' or 'owner')
}) {
  try {
    // If the manager creates a personal expense, it's PENDING.
    // If the owner creates any expense, it's APPROVED.
    // If the manager creates a business expense, it's APPROVED (or PENDING depending on rules, let's assume APPROVED for now).
    const isOwner = data.requestedBy === "owner";
    const status = (data.isPersonal && !isOwner) ? "PENDING" : "APPROVED";

    const expense = await prisma.expense.create({
      data: {
        category: {
          connectOrCreate: {
            where: { name: data.category },
            create: { name: data.category }
          }
        },
        amount: data.amount,
        description: data.description,
        isPersonal: data.isPersonal,
        paymentMethod: "cash", // Added default to fix missing field
        requestedBy: data.requestedBy,
        status: status,
      },
    });

    // If it's APPROVED immediately, create a transaction for it (Cash Out)
    if (status === "APPROVED") {
      await prisma.transaction.create({
        data: {
          type: "out",
          amount: data.amount,
          description: `[Expense] ${data.category}: ${data.description}`,
          status: "APPROVED",
          requestedBy: data.requestedBy,
        },
      });
    }

    revalidatePath("/expenses");
    revalidatePath("/main-cash");
    revalidatePath("/");
    
    await recordAuditLog(
      data.requestedBy,
      "ADD_EXPENSE",
      `Added ${data.isPersonal ? "Personal" : "Business"} expense of ৳${data.amount.toLocaleString()} in '${data.category}' (${status})`
    );

    return { success: true, expense };
  } catch (error) {
    console.error("Error adding expense:", error);
    return { success: false, error: "Failed to add expense" };
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
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return { success: false, error: "Failed to fetch expenses", expenses: [] };
  }
}

export async function deleteExpense(id: string) {
  try {
    // Also delete the related transaction? This is tricky because we only linked them via description.
    // For simplicity in this mockup, we just delete the expense record.
    await prisma.expense.delete({
      where: { id },
    });
    revalidatePath("/expenses");
    return { success: true };
  } catch (error) {
    console.error("Error deleting expense:", error);
    return { success: false, error: "Failed to delete expense" };
  }
}
