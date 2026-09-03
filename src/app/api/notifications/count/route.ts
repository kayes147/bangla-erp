import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    const now = new Date();

    // 1. Pending Approvals (Invoices, Expenses, Transactions)
    const [pendingInvoices, pendingExpenses, pendingTransactions, allDueInvoices] =
      await Promise.all([
        prisma.invoice.count({ where: { status: "PENDING" } }),
        prisma.expense.count({ where: { status: "PENDING" } }),
        prisma.transaction.count({
          where: {
            status: "PENDING",
            invoiceId: null,
            expense: null,
          },
        }),
        prisma.invoice.findMany({
          where: {
            dueDate: { lt: now },
            status: "APPROVED",
          },
          select: {
            totalAmount: true,
            paidAmount: true,
          },
        }),
      ]);

    const overdueCount = allDueInvoices.filter(
      (inv) => inv.totalAmount > inv.paidAmount
    ).length;

    const pendingApprovalsCount =
      pendingInvoices + pendingExpenses + pendingTransactions;

    // Notifications trigger on: pending product in/out, overdue due dates, pending cash/expense approvals
    const totalNotifications = pendingApprovalsCount + overdueCount;

    return NextResponse.json({
      success: true,
      pendingApprovalsCount,
      overdueCount,
      totalNotifications,
      hasPendingApprovals: pendingApprovalsCount > 0,
      hasNotifications: totalNotifications > 0,
    });
  } catch (error: any) {
    console.error("Error fetching notification counts:", error);
    return NextResponse.json({
      success: false,
      pendingApprovalsCount: 0,
      overdueCount: 0,
      totalNotifications: 0,
      hasPendingApprovals: false,
      hasNotifications: false,
    });
  }
}
