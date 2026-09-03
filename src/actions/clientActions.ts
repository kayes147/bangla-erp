"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createClient(data: {
  type: string;
  name: string;
  phone: string;
  address?: string;
  openingBalance: number;
}) {
  try {
    const client = await prisma.client.create({
      data: {
        type: data.type,
        name: data.name,
        phone: data.phone,
        address: data.address,
        openingBalance: data.openingBalance,
      },
    });

    revalidatePath("/clients");
    return { success: true, client };
  } catch (error) {
    console.error("Error creating client:", error);
    return { success: false, error: "Failed to create client" };
  }
}

export async function getClients() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true, // to check if they have login access
        invoices: true,
      }
    });

    return { success: true, clients };
  } catch (error) {
    console.error("Error fetching clients:", error);
    return { success: false, error: "Failed to fetch clients", clients: [] };
  }
}

export async function createClientLogin(data: {
  clientId: string;
  username: string;
  password?: string;
}) {
  try {
    const { clientId, username, password = "123" } = data;
    const cleanUsername = username.toLowerCase().trim();

    if (!cleanUsername) {
      return { success: false, error: "ইউজারনেম আবশ্যক" };
    }

    // Check if username is already taken by someone else
    const existing = await prisma.user.findUnique({
      where: { username: cleanUsername },
    });

    if (existing && existing.clientId !== clientId) {
      return {
        success: false,
        error: "এই ইউজারনেমটি ইতিমধ্যে ব্যবহৃত হচ্ছে। অনুগ্রহ করে অন্য ইউজারনেম দিন।",
      };
    }

    // Check if this client already has a user record
    const existingClientUser = await prisma.user.findFirst({
      where: { clientId },
    });

    let user;
    if (existingClientUser) {
      user = await prisma.user.update({
        where: { id: existingClientUser.id },
        data: {
          username: cleanUsername,
          password: password.trim(),
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          username: cleanUsername,
          password: password.trim(),
          role: "CLIENT",
          clientId,
        },
      });
    }

    revalidatePath("/clients");
    return {
      success: true,
      message: "মহাজনের লগইন অ্যাক্সেস সফলভাবে তৈরি ও সংরক্ষিত হয়েছে!",
      user,
    };
  } catch (error: any) {
    console.error("Error creating client login:", error);
    return { success: false, error: error.message || "লগইন তৈরি করতে সমস্যা হয়েছে" };
  }
}
