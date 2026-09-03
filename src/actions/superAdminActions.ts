"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { recordAuditLog } from "./auditLogActions";

export async function getSuperAdminMetrics() {
  try {
    const [
      totalUsers,
      totalClients,
      totalInvoices,
      totalProducts,
      totalTransactions,
      totalExpenses,
      totalAuditLogs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.client.count(),
      prisma.invoice.count(),
      prisma.product.count(),
      prisma.transaction.count(),
      prisma.expense.count(),
      prisma.auditLog.count(),
    ]);

    // Financial overview
    const transactions = await prisma.transaction.findMany({
      select: { type: true, amount: true },
    });

    const totalCashIn = transactions
      .filter((t) => t.type === "in")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalCashOut = transactions
      .filter((t) => t.type === "out")
      .reduce((sum, t) => sum + t.amount, 0);

    const netCashBalance = totalCashIn - totalCashOut;

    return {
      success: true,
      metrics: {
        totalUsers,
        totalClients,
        totalInvoices,
        totalProducts,
        totalTransactions,
        totalExpenses,
        totalAuditLogs,
        totalCashIn,
        totalCashOut,
        netCashBalance,
        serverTime: new Date().toISOString(),
        nodeEnv: process.env.NODE_ENV || "production",
      },
    };
  } catch (error: any) {
    console.error("Error fetching super admin metrics:", error);
    return { success: false, error: error.message };
  }
}

export async function getSuperAdminUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            phone: true,
            openingBalance: true,
          },
        },
        employee: {
          select: {
            id: true,
            name: true,
            designation: true,
          },
        },
      },
    });

    return { success: true, users };
  } catch (error: any) {
    console.error("Error fetching super admin users:", error);
    return { success: false, error: error.message, users: [] };
  }
}

export async function resetUserPassword(data: {
  userId: string;
  newPassword: string;
}) {
  try {
    if (!data.userId || !data.newPassword || data.newPassword.trim().length < 4) {
      return { success: false, error: "পাসওয়ার্ড ন্যূনতম ৪ অক্ষরের হতে হবে।" };
    }

    const updatedUser = await prisma.user.update({
      where: { id: data.userId },
      data: { password: data.newPassword.trim() },
    });

    await recordAuditLog(
      "SUPER_ADMIN",
      "RESET_USER_PASSWORD",
      `Password was reset for user '${updatedUser.username}' (${updatedUser.role})`
    );

    revalidatePath("/super-admin");
    return { success: true, username: updatedUser.username };
  } catch (error: any) {
    console.error("Error resetting user password:", error);
    return { success: false, error: error.message || "পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।" };
  }
}

export async function createSystemUser(data: {
  username: string;
  password: string;
  role: "OWNER" | "MANAGER";
}) {
  try {
    if (!data.username || !data.password) {
      return { success: false, error: "ইউজারনেম এবং পাসওয়ার্ড বাধ্যতামূলক।" };
    }

    const cleanUsername = data.username.trim();

    const existing = await prisma.user.findUnique({
      where: { username: cleanUsername },
    });

    if (existing) {
      return { success: false, error: "এই ইউজারনেমটি ইতিমধ্যে বিদ্যমান।" };
    }

    const newUser = await prisma.user.create({
      data: {
        username: cleanUsername,
        password: data.password.trim(),
        role: data.role,
      },
    });

    await recordAuditLog(
      "SUPER_ADMIN",
      "CREATE_SYSTEM_USER",
      `Created new ${data.role} user '${newUser.username}'`
    );

    revalidatePath("/super-admin");
    return { success: true, user: newUser };
  } catch (error: any) {
    console.error("Error creating system user:", error);
    return { success: false, error: error.message || "ইউজার তৈরি ব্যর্থ হয়েছে।" };
  }
}

export async function getSuperAdminAuditLogs() {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        user: {
          select: { username: true, role: true },
        },
      },
    });

    return { success: true, logs };
  } catch (error: any) {
    console.error("Error fetching audit logs:", error);
    return { success: false, logs: [] };
  }
}
