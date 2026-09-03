import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [
      clients,
      products,
      invoices,
      transactions,
      expenses,
      employees,
      loans,
      users,
      auditLogs,
    ] = await Promise.all([
      prisma.client.findMany({
        orderBy: { createdAt: "asc" },
      }),
      prisma.product.findMany({
        orderBy: { createdAt: "asc" },
      }),
      prisma.invoice.findMany({
        include: {
          items: true,
        },
        orderBy: { createdAt: "asc" },
      }),
      prisma.transaction.findMany({
        orderBy: { createdAt: "asc" },
      }),
      prisma.expense.findMany({
        include: {
          category: true,
        },
        orderBy: { createdAt: "asc" },
      }),
      prisma.employee.findMany({
        orderBy: { createdAt: "asc" },
      }),
      prisma.loan.findMany({
        orderBy: { createdAt: "asc" },
      }),
      prisma.user.findMany({
        select: {
          id: true,
          username: true,
          role: true,
          clientId: true,
          employeeId: true,
          createdAt: true,
        },
        orderBy: { createdAt: "asc" },
      }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
      }),
    ]);

    const backupData = {
      meta: {
        system: "Bangla ERP - Super Admin Backup",
        version: "2.0.0",
        exportDate: new Date().toISOString(),
        databaseProvider: "PostgreSQL",
        totalEntities: {
          clients: clients.length,
          products: products.length,
          invoices: invoices.length,
          transactions: transactions.length,
          expenses: expenses.length,
          employees: employees.length,
          loans: loans.length,
          users: users.length,
          auditLogs: auditLogs.length,
        },
      },
      data: {
        clients,
        products,
        invoices,
        transactions,
        expenses,
        employees,
        loans,
        users,
        auditLogs,
      },
    };

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const timeStr = `${now.getHours()}-${now.getMinutes()}`;
    const filename = `bangla_erp_backup_${dateStr}_${timeStr}.json`;

    return new NextResponse(JSON.stringify(backupData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("Database backup generation failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate database backup" },
      { status: 500 }
    );
  }
}
