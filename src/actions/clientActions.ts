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
      }
    });

    // Also calculate current due by checking transactions or invoices later.
    // For now, we'll return openingBalance as current due if we haven't implemented transactions yet.
    
    return { success: true, clients };
  } catch (error) {
    console.error("Error fetching clients:", error);
    return { success: false, error: "Failed to fetch clients", clients: [] };
  }
}
