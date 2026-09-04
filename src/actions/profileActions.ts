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
  phone?: string | null;
  address?: string | null;
  logo?: string | null;
  ownerPhoto?: string | null;
}) {
  try {
    const profile = await prisma.businessProfile.upsert({
      where: { id: "default" },
      update: {
        ...(data.companyName !== undefined && { companyName: data.companyName }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.logo !== undefined && { logo: data.logo }),
        ...(data.ownerPhoto !== undefined && { ownerPhoto: data.ownerPhoto }),
      },
      create: {
        id: "default",
        companyName: data.companyName || "BOLAKA FACTORY",
        phone: data.phone || "01954223347",
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
