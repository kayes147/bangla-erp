"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getBusinessProfile() {
  try {
    let profile = await prisma.businessProfile.findUnique({
      where: { id: "default" },
    });

    if (!profile) {
      profile = await prisma.businessProfile.create({
        data: {
          id: "default",
          companyName: "BOLAKA FACTORY",
          phone: "01954223347",
          address: "ঢাকা, বাংলাদেশ",
        },
      });
    }

    return { success: true, profile };
  } catch (error: any) {
    console.error("Error fetching business profile:", error);
    return {
      success: false,
      profile: {
        id: "default",
        companyName: "BOLAKA FACTORY",
        ownerName: "Hasibul Islam",
        phone: "01954223347",
        address: "ঢাকা, বাংলাদেশ",
        logo: null,
        ownerPhoto: null,
      },
    };
  }
}

export async function updateBusinessProfile(data: {
  companyName?: string;
  ownerName?: string | null;
  phone?: string | null;
  address?: string | null;
  logo?: string | null;
  ownerPhoto?: string | null;
}) {
  try {
    let cleanedPhone = data.phone;
    if (data.phone && data.phone.trim()) {
      const cleaned = data.phone.replace(/\D/g, "");
      if (cleaned.length !== 11) {
        return { success: false, error: "কোম্পানির মোবাইল নম্বর অবশ্যই ঠিক ১১ ডিজিটের হতে হবে (যেমন: 019XXXXXXXX)!" };
      }
      cleanedPhone = cleaned;
    }

    const profile = await prisma.businessProfile.upsert({
      where: { id: "default" },
      update: {
        ...(data.companyName !== undefined && { companyName: data.companyName }),
        ...(data.ownerName !== undefined && { ownerName: data.ownerName }),
        ...(cleanedPhone !== undefined && { phone: cleanedPhone }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.logo !== undefined && { logo: data.logo }),
        ...(data.ownerPhoto !== undefined && { ownerPhoto: data.ownerPhoto }),
      },
      create: {
        id: "default",
        companyName: data.companyName || "BOLAKA FACTORY",
        ownerName: data.ownerName || "Hasibul Islam",
        phone: cleanedPhone || "01954223347",
        address: data.address || "ঢাকা, বাংলাদেশ",
        logo: data.logo || null,
        ownerPhoto: data.ownerPhoto || null,
      },
    });

    try {
      revalidatePath("/");
      revalidatePath("/clients");
      revalidatePath("/loan");
      revalidatePath("/product-in");
      revalidatePath("/product-out");
    } catch (e) {
      // ignore
    }

    return { success: true, profile };
  } catch (error: any) {
    console.error("Error updating business profile:", error);
    return { success: false, error: error?.message || "কোম্পানি প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে" };
  }
}

export async function updateUserProfilePhoto(username: string, image: string | null) {
  try {
    const user = await prisma.user.update({
      where: { username: username.toLowerCase().trim() },
      data: { image },
    });

    try {
      revalidatePath("/");
      revalidatePath("/clients");
      revalidatePath("/loan");
    } catch (e) {
      // ignore
    }

    return { success: true, user: { id: user.id, username: user.username, image: user.image } };
  } catch (error: any) {
    console.error("Error updating user profile photo:", error);
    return { success: false, error: error?.message || "প্রোফাইল ছবি আপডেট করতে ব্যর্থ হয়েছে" };
  }
}

export async function getUserProfile(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase().trim() },
      select: {
        id: true,
        username: true,
        role: true,
        image: true,
        clientId: true,
      },
    });

    return { success: true, user };
  } catch (error: any) {
    console.error("Error getting user profile:", error);
    return { success: false, user: null };
  }
}

export async function getCompanyManagers() {
  try {
    const managers = await prisma.user.findMany({
      where: { role: "MANAGER" },
      select: {
        id: true,
        username: true,
        role: true,
        image: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, managers };
  } catch (error: any) {
    console.error("Error fetching managers:", error);
    return { success: false, managers: [] };
  }
}

export async function saveCompanyManager(data: {
  id?: string;
  username: string;
  password?: string;
  image?: string | null;
}) {
  try {
    const cleanUsername = data.username.toLowerCase().trim();
    if (!cleanUsername) {
      return { success: false, error: "ম্যানেজার ইউজারনেম আবশ্যক!" };
    }

    // Dynamic import of bcrypt to keep bundle light
    const bcrypt = await import("bcryptjs");

    if (data.id) {
      // Update existing manager
      const updateData: any = {};
      if (data.image !== undefined) updateData.image = data.image;
      if (data.password && data.password.trim().length >= 3) {
        updateData.password = await bcrypt.hash(data.password.trim(), 10);
      }

      const updated = await prisma.user.update({
        where: { id: data.id },
        data: updateData,
        select: { id: true, username: true, role: true, image: true },
      });

      return { success: true, manager: updated };
    } else {
      // Create new manager
      if (!data.password || data.password.trim().length < 3) {
        return { success: false, error: "ম্যানেজারের জন্য ন্যূনতম ৩ অক্ষরের পাসওয়ার্ড দিন!" };
      }

      const existing = await prisma.user.findUnique({
        where: { username: cleanUsername },
      });
      if (existing) {
        return { success: false, error: `ইউজারনেম "${cleanUsername}" ইতিমধ্যে ব্যবহৃত হয়েছে!` };
      }

      const hashedPassword = await bcrypt.hash(data.password.trim(), 10);
      const newManager = await prisma.user.create({
        data: {
          username: cleanUsername,
          password: hashedPassword,
          role: "MANAGER",
          image: data.image || null,
        },
        select: { id: true, username: true, role: true, image: true },
      });

      return { success: true, manager: newManager };
    }
  } catch (error: any) {
    console.error("Error saving company manager:", error);
    return { success: false, error: error?.message || "ম্যানেজার সংরক্ষণ করতে ব্যর্থ হয়েছে" };
  }
}

export async function updateManagerPhoto(managerIdOrUsername: string, image: string | null) {
  try {
    const clean = managerIdOrUsername.toLowerCase().trim();
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ id: managerIdOrUsername }, { username: clean }],
        role: "MANAGER",
      },
    });

    if (!user) {
      return { success: false, error: "ম্যানেজার পাওয়া যায়নি!" };
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { image },
      select: { id: true, username: true, role: true, image: true },
    });

    return { success: true, manager: updated };
  } catch (error: any) {
    console.error("Error updating manager photo:", error);
    return { success: false, error: error?.message || "ম্যানেজার ছবি আপডেট করতে ব্যর্থ হয়েছে" };
  }
}

export async function deleteCompanyManager(managerId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: managerId },
    });

    if (!user) {
      return { success: false, error: "ম্যানেজার পাওয়া যায়নি!" };
    }

    if (user.role !== "MANAGER") {
      return { success: false, error: "শুধুমাত্র ম্যানেজার অ্যাকাউন্ট মুছে ফেলা যাবে!" };
    }

    // Safely delete any audit logs linked to this manager
    await prisma.auditLog.deleteMany({
      where: { userId: managerId },
    });

    await prisma.user.delete({
      where: { id: managerId },
    });

    try {
      revalidatePath("/");
    } catch (e) {}

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting manager:", error);
    return { success: false, error: error?.message || "ম্যানেজার মুছে ফেলতে ব্যর্থ হয়েছে" };
  }
}
