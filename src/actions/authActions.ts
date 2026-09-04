"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { recordAuditLog } from "./auditLogActions";

export async function registerUser(data: {
  name: string;
  username: string;
  password: string;
  ownerImage?: string | null;
  // Company details
  companyName: string;
  companyPhone?: string | null;
  companyAddress?: string | null;
  companyEmail?: string | null;
  companyLogo?: string | null;
  // Optional Manager details
  hasManager?: boolean;
  managerName?: string | null;
  managerUsername?: string | null;
  managerPassword?: string | null;
  managerImage?: string | null;
  role?: "OWNER" | "MANAGER";
}) {
  try {
    const ownerUsername = data.username.toLowerCase().trim();
    if (!ownerUsername) {
      return { success: false, error: "ইউজারনেম দিন!" };
    }

    const existingOwner = await prisma.user.findUnique({
      where: { username: ownerUsername },
    });

    if (existingOwner) {
      return { success: false, error: "এই ইউজারনেমটি ইতিমধ্যে ব্যবহৃত হয়েছে!" };
    }

    // Manager validation if selected
    let hashedManagerPassword = "";
    const managerUsername = data.managerUsername ? data.managerUsername.toLowerCase().trim() : "";

    if (data.hasManager) {
      if (!managerUsername) {
        return { success: false, error: "ম্যানেজারের জন্য ইউজারনেম দিন!" };
      }
      if (managerUsername === ownerUsername) {
        return { success: false, error: "ওনার এবং ম্যানেজারের ইউজারনেম এক হতে পারে না!" };
      }
      if (!data.managerPassword || data.managerPassword.trim().length < 3) {
        return { success: false, error: "ম্যানেজারের জন্য ন্যূনতম ৩ অক্ষরের পাসওয়ার্ড দিন!" };
      }

      const existingManager = await prisma.user.findUnique({
        where: { username: managerUsername },
      });
      if (existingManager) {
        return { success: false, error: `ম্যানেজার ইউজারনেম "${managerUsername}" ইতিমধ্যে ব্যবহৃত হয়েছে!` };
      }

      hashedManagerPassword = await bcrypt.hash(data.managerPassword.trim(), 10);
    }

    const hashedOwnerPassword = await bcrypt.hash(data.password, 10);
    const role = data.role || "OWNER";

    // 1. Create Owner User
    const user = await prisma.user.create({
      data: {
        username: ownerUsername,
        password: hashedOwnerPassword,
        role: role,
        image: data.ownerImage || null,
      },
    });

    // 2. Create Manager User if selected
    if (data.hasManager && managerUsername && hashedManagerPassword) {
      await prisma.user.create({
        data: {
          username: managerUsername,
          password: hashedManagerPassword,
          role: "MANAGER",
          image: data.managerImage || null,
        },
      });
    }

    // 3. Upsert Company Business Profile
    const finalCompanyName = data.companyName?.trim() || "BOLAKA FACTORY";
    await prisma.businessProfile.upsert({
      where: { id: "default" },
      update: {
        companyName: finalCompanyName,
        ...(data.companyPhone !== undefined && { phone: data.companyPhone }),
        ...(data.companyAddress !== undefined && { address: data.companyAddress }),
        ...(data.companyEmail !== undefined && { email: data.companyEmail }),
        ...(data.companyLogo !== undefined && { logo: data.companyLogo }),
        ...(data.ownerImage !== undefined && { ownerPhoto: data.ownerImage }),
      },
      create: {
        id: "default",
        companyName: finalCompanyName,
        phone: data.companyPhone || null,
        address: data.companyAddress || null,
        email: data.companyEmail || null,
        logo: data.companyLogo || null,
        ownerPhoto: data.ownerImage || null,
      },
    });

    await recordAuditLog(
      user.id,
      "USER_REGISTERED",
      `New user registered: ${data.username} as ${role} for company "${finalCompanyName}"${
        data.hasManager ? ` with manager "${managerUsername}"` : ""
      }`
    );

    return { success: true, user: { id: user.id, username: user.username, role: user.role } };
  } catch (error: any) {
    console.error("Registration error:", error);
    return { success: false, error: error.message || "Failed to register account" };
  }
}
