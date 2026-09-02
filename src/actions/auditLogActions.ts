"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function recordAuditLog(
  userNameOrId: string,
  action: string,
  details: string
) {
  try {
    // Find user by id or username
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: userNameOrId },
          { username: userNameOrId }
        ]
      }
    });

    if (!user) {
      // Fallback to the first user in database
      user = await prisma.user.findFirst();
    }

    if (!user) {
      return { success: false, error: "No user found" };
    }

    const log = await prisma.auditLog.create({
      data: {
        userId: user.id,
        action,
        details,
      }
    });

    revalidatePath("/audit-logs");
    return { success: true, log };
  } catch (error: any) {
    console.error("Failed to record audit log:", error);
    return { success: false, error: error.message };
  }
}

export async function getAuditLogs() {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            role: true,
          }
        }
      },
      take: 100,
    });

    return { success: true, logs };
  } catch (error: any) {
    console.error("Failed to fetch audit logs:", error);
    return { success: false, logs: [] };
  }
}
