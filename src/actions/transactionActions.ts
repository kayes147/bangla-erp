"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { recordAuditLog } from "./auditLogActions";

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
        amount: Number(data.amount),
        description: data.description,
        requestedBy: data.requestedBy || "owner",
        clientId: data.clientId ? data.clientId : undefined,
        status: "APPROVED",
      },
    });

    // If client is involved, update their balance
    if (data.clientId) {
      try {
        await prisma.client.update({
          where: { id: data.clientId },
          data: {
            openingBalance:
              data.type === "in"
                ? { decrement: Number(data.amount) }
                : { increment: Number(data.amount) },
          },
        });
      } catch (err) {
        console.warn("Client balance update warning:", err);
      }
    }

    try {
      revalidatePath("/main-cash");
      revalidatePath("/");
    } catch (e) {
      console.warn("Revalidate path warning:", e);
    }

    try {
      await recordAuditLog(
        data.requestedBy || "owner",
        "ADD_TRANSACTION",
        `Added Cash ${data.type === "in" ? "In" : "Out"} of ৳${Number(data.amount).toLocaleString()} - "${data.description}"`
      );
    } catch (e) {
      console.warn("Audit log recording warning:", e);
    }

    return { success: true, transaction };
  } catch (error: any) {
    console.error("Error adding transaction:", error);
    return { success: false, error: error?.message || "Failed to add transaction" };
  }
}

export async function getTransactions() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: "desc" },
      include: {
        client: true,
        invoice: {
          include: {
            client: true,
          },
        },
      },
    });

    return { success: true, transactions };
  } catch (error: any) {
    console.error("Error fetching transactions:", error);
    return { success: false, transactions: [] };
  }
}
