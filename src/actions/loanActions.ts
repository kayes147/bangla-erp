"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { recordAuditLog } from "./auditLogActions";

export async function createLoan(data: {
  type: "GIVE" | "TAKE";
  personType: "CLIENT" | "EMPLOYEE" | "OTHER";
  personName: string;
  phone?: string;
  amount: number;
  notes?: string;
  paymentMethod?: string;
  clientId?: string;
  employeeId?: string;
  requestedBy?: string;
  date?: string;
}) {
  try {
    const loanDate = data.date ? new Date(data.date) : new Date();
    const paymentMethod = data.paymentMethod || "cash";
    const requestedBy = data.requestedBy || "owner";

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Transaction in Main Cash if paid via Cash
      // GIVE loan = Cash goes OUT; TAKE loan = Cash comes IN
      let transaction = null;
      if (paymentMethod === "cash") {
        transaction = await tx.transaction.create({
          data: {
            type: data.type === "GIVE" ? "out" : "in",
            amount: data.amount,
            description: `[${data.type === "GIVE" ? "ধার দেওয়া" : "ধার নেওয়া"}] ${data.personName} (${data.notes || "Loan"})`,
            status: "APPROVED",
            requestedBy: requestedBy,
            clientId: data.clientId || null,
          }
        });
      }

      // 2. If client is involved, adjust their balance
      if (data.clientId) {
        await tx.client.update({
          where: { id: data.clientId },
          data: {
            openingBalance: data.type === "GIVE"
              ? { increment: data.amount } // They owe us more
              : { decrement: data.amount } // We owe them more
          }
        });
      }

      // 3. Create the Loan Record
      const loan = await tx.loan.create({
        data: {
          type: data.type,
          personType: data.personType,
          personName: data.personName,
          phone: data.phone || null,
          amount: data.amount,
          notes: data.notes || null,
          paymentMethod: paymentMethod,
          status: "APPROVED",
          date: loanDate,
          clientId: data.clientId || null,
          employeeId: data.employeeId || null,
          transactionId: transaction?.id || null,
        }
      });

      return loan;
    });

    revalidatePath("/loan");
    revalidatePath("/main-cash");
    revalidatePath("/clients");
    revalidatePath("/");

    await recordAuditLog(
      requestedBy,
      data.type === "GIVE" ? "GIVE_LOAN" : "TAKE_LOAN",
      `${data.type === "GIVE" ? "Gave Loan" : "Took Loan"} of ৳${data.amount.toLocaleString()} to/from ${data.personName} (${data.personType})`
    );

    return { success: true, loan: result };
  } catch (error: any) {
    console.error("Error creating loan:", error);
    return { success: false, error: error.message || "Failed to create loan" };
  }
}

export async function recordLoanRepayment(data: {
  direction: "RECEIVE_BACK" | "PAY_BACK"; // RECEIVE_BACK = money returned to us (Cash In); PAY_BACK = we returned borrowed money (Cash Out)
  personType: "CLIENT" | "EMPLOYEE" | "OTHER";
  personName: string;
  phone?: string;
  amount: number;
  notes?: string;
  paymentMethod?: string;
  clientId?: string;
  employeeId?: string;
  requestedBy?: string;
  date?: string;
}) {
  try {
    const loanDate = data.date ? new Date(data.date) : new Date();
    const paymentMethod = data.paymentMethod || "cash";
    const requestedBy = data.requestedBy || "owner";

    const result = await prisma.$transaction(async (tx) => {
      let transaction = null;
      if (paymentMethod === "cash") {
        transaction = await tx.transaction.create({
          data: {
            type: data.direction === "RECEIVE_BACK" ? "in" : "out",
            amount: data.amount,
            description: `[${data.direction === "RECEIVE_BACK" ? "ধারের টাকা ফেরত গ্রহণ" : "ধার পরিশোধ"}] ${data.personName} (${data.notes || "Repayment"})`,
            status: "APPROVED",
            requestedBy: requestedBy,
            clientId: data.clientId || null,
          }
        });
      }

      // If client is involved, adjust balance
      if (data.clientId) {
        await tx.client.update({
          where: { id: data.clientId },
          data: {
            openingBalance: data.direction === "RECEIVE_BACK"
              ? { decrement: data.amount } // Due is reduced
              : { increment: data.amount } // Payable is reduced
          }
        });
      }

      // Record as loan entry with inverted type
      const loan = await tx.loan.create({
        data: {
          type: data.direction === "RECEIVE_BACK" ? "TAKE" : "GIVE", // Balance offset
          personType: data.personType,
          personName: data.personName,
          phone: data.phone || null,
          amount: -Math.abs(data.amount), // negative to represent repayment
          notes: data.notes || (data.direction === "RECEIVE_BACK" ? "ফেরত গ্রহণ" : "পরিশোধ"),
          paymentMethod: paymentMethod,
          status: "APPROVED",
          date: loanDate,
          clientId: data.clientId || null,
          employeeId: data.employeeId || null,
          transactionId: transaction?.id || null,
        }
      });

      return loan;
    });

    revalidatePath("/loan");
    revalidatePath("/main-cash");
    revalidatePath("/clients");
    revalidatePath("/");

    await recordAuditLog(
      requestedBy,
      data.direction === "RECEIVE_BACK" ? "RECEIVE_LOAN_PAYMENT" : "REPAY_LOAN",
      `${data.direction === "RECEIVE_BACK" ? "Received loan return" : "Repaid loan"} of ৳${data.amount.toLocaleString()} from/to ${data.personName}`
    );

    return { success: true, loan: result };
  } catch (error: any) {
    console.error("Error recording repayment:", error);
    return { success: false, error: error.message || "Failed to record repayment" };
  }
}

export async function getLoans() {
  try {
    const loans = await prisma.loan.findMany({
      orderBy: { date: "desc" },
      include: {
        client: true,
        employee: true,
      }
    });

    // Calculate aggregations
    // "GIVE" with positive amount = lent out
    // "TAKE" with positive amount = borrowed
    let totalGiven = 0;
    let totalTaken = 0;

    // Aggregate by personName
    const profileMap: Record<
      string,
      {
        name: string;
        personType: string;
        phone: string;
        netBalance: number; // positive = they owe us, negative = we owe them
        lastDate: Date;
      }
    > = {};

    for (const l of loans) {
      if (!profileMap[l.personName]) {
        profileMap[l.personName] = {
          name: l.personName,
          personType: l.personType,
          phone: l.phone || l.client?.phone || l.employee?.phone || "-",
          netBalance: 0,
          lastDate: l.date,
        };
      }

      if (l.type === "GIVE") {
        profileMap[l.personName].netBalance += l.amount;
        if (l.amount > 0) totalGiven += l.amount;
        else totalTaken += Math.abs(l.amount);
      } else {
        profileMap[l.personName].netBalance -= l.amount;
        if (l.amount > 0) totalTaken += l.amount;
        else totalGiven += Math.abs(l.amount);
      }
    }

    const profiles = Object.values(profileMap);

    return {
      success: true,
      loans,
      profiles,
      totalGiven,
      totalTaken,
    };
  } catch (error: any) {
    console.error("Error fetching loans:", error);
    return {
      success: false,
      loans: [],
      profiles: [],
      totalGiven: 0,
      totalTaken: 0,
      error: error.message,
    };
  }
}
