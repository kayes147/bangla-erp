"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addTransaction(data: {
  type: "in" | "out";
  amount: number;
  description: string;
  requestedBy?: string;
  clientId?: string;
}) {
  try {
    const transaction = await prisma.transaction.create({
      data: {
        type: data.type,
        amount: data.amount,
        description: data.description,
        requestedBy: data.requestedBy,
        clientId: data.clientId,
        status: "APPROVED", // Assuming direct add is approved for Owner. We can handle pending logic later.
      },
    });

    // If client is involved, update their balance
    if (data.clientId) {
      await prisma.client.update({
        where: { id: data.clientId },
        data: {
          openingBalance:
            data.type === "in"
              ? { decrement: data.amount } // Receiving money decreases client debt
              : { increment: data.amount }, // Giving money increases client debt
        },
      });
    }

    revalidatePath("/main-cash");
    revalidatePath("/");
    return { success: true, transaction };
  } catch (error) {
    console.error("Error adding transaction:", error);
    return { success: false, error: "Failed to add transaction" };
  }
}

export async function getTransactions() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: "desc" },
      include: {
        client: true,
      }
    });
    return { success: true, transactions };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return { success: false, error: "Failed to fetch transactions" };
  }
}
