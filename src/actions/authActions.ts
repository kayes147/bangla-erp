"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { recordAuditLog } from "./auditLogActions";

export async function registerUser(data: {
  name: string;
  username: string;
  companyName: string;
  password: string;
  role?: "OWNER" | "MANAGER";
}) {
  try {
    const existing = await prisma.user.findUnique({
      where: { username: data.username.toLowerCase().trim() }
    });

    if (existing) {
      return { success: false, error: "এই ইউজারনেমটি ইতিমধ্যে ব্যবহৃত হয়েছে!" };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const role = data.role || "OWNER";

    const user = await prisma.user.create({
      data: {
        username: data.username.toLowerCase().trim(),
        password: hashedPassword,
        role: role,
      }
    });

    await recordAuditLog(
      user.id,
      "USER_REGISTERED",
      `New user registered: ${data.username} as ${role} for company "${data.companyName}"`
    );

    return { success: true, user: { id: user.id, username: user.username, role: user.role } };
  } catch (error: any) {
    console.error("Registration error:", error);
    return { success: false, error: error.message || "Failed to register account" };
  }
}
