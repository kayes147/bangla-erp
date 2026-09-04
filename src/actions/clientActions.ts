"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { recordAuditLog } from "./auditLogActions";

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

    try {
      revalidatePath("/clients");
      revalidatePath("/product-in");
      revalidatePath("/product-out");
      revalidatePath("/loan");
      revalidatePath("/main-cash");
      revalidatePath("/");
    } catch (e) {
      console.warn("Revalidate path warning:", e);
    }

    try {
      await recordAuditLog(
        "owner",
        "CREATE_COMPANY",
        `Created Company '${client.name}' (${client.phone}) with initial balance ৳${client.openingBalance}`
      );
    } catch (aErr) {
      console.warn("Audit log warning:", aErr);
    }

    // Auto-trigger 2nd Backup Vault snapshot (non-blocking to prevent serverless timeout)
    try {
      import("@/lib/backupVault")
        .then(({ createAutomatedBackupSnapshot }) => {
          createAutomatedBackupSnapshot(
            "AUTO_COMPANY_CREATED",
            `Created Company '${client.name}' (${client.phone}) with initial balance ৳${client.openingBalance}`
          ).catch((bErr) => console.warn("Auto backup warning:", bErr));
        })
        .catch((e) => console.warn("Backup import warning:", e));
    } catch (bErr) {
      console.warn("Auto backup warning:", bErr);
    }

    return { success: true, client };
  } catch (error: any) {
    console.error("Error creating client:", error);
    return { success: false, error: error?.message || "প্রতিষ্ঠান সংরক্ষণ করতে ব্যর্থ হয়েছে।" };
  }
}

export async function deleteClient(clientId: string) {
  try {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        invoices: {
          select: { id: true },
        },
      },
    });

    if (!client) {
      return { success: false, error: "প্রতিষ্ঠানটি খুঁজে পাওয়া যায়নি।" };
    }

    const invoiceIds = client.invoices.map((inv) => inv.id);

    await prisma.$transaction(async (tx) => {
      // 1. Delete associated user login for this client
      await tx.user.deleteMany({
        where: { clientId },
      });

      // 2. Delete invoice items for all invoices of this client
      if (invoiceIds.length > 0) {
        await tx.invoiceItem.deleteMany({
          where: { invoiceId: { in: invoiceIds } },
        });
      }

      // 3. Delete transactions related to this client or invoices
      await tx.transaction.deleteMany({
        where: {
          OR: [
            { clientId },
            ...(invoiceIds.length > 0 ? [{ invoiceId: { in: invoiceIds } }] : []),
          ],
        },
      });

      // 4. Delete loans associated with this client
      await tx.loan.deleteMany({
        where: { clientId },
      });

      // 5. Delete invoices of this client
      if (invoiceIds.length > 0) {
        await tx.invoice.deleteMany({
          where: { id: { in: invoiceIds } },
        });
      }

      // 6. Delete client
      await tx.client.delete({
        where: { id: clientId },
      });
    });

    try {
      revalidatePath("/clients");
      revalidatePath("/product-in");
      revalidatePath("/product-out");
      revalidatePath("/loan");
      revalidatePath("/main-cash");
      revalidatePath("/");
    } catch (e) {
      console.warn("Revalidate path warning:", e);
    }

    // Record audit log
    try {
      await recordAuditLog(
        "owner",
        "DELETE_COMPANY",
        `Deleted Company '${client.name}' (${client.phone}) with balance ৳${client.openingBalance}`
      );
    } catch (aErr) {
      console.warn("Audit log warning:", aErr);
    }

    // Auto backup snapshot
    try {
      const { createAutomatedBackupSnapshot } = await import("@/lib/backupVault");
      await createAutomatedBackupSnapshot(
        "AUTO_COMPANY_DELETED",
        `Deleted Company '${client.name}' (${client.phone})`
      );
    } catch (bErr) {
      console.warn("Auto backup warning:", bErr);
    }

    return { success: true, message: "প্রতিষ্ঠান সফলভাবে মুছে ফেলা হয়েছে!" };
  } catch (error: any) {
    console.error("Error deleting client:", error);
    return { success: false, error: error?.message || "প্রতিষ্ঠান মুছতে ব্যর্থ হয়েছে।" };
  }
}

export async function updateClient(data: {
  id: string;
  name: string;
  phone: string;
  address?: string;
  openingBalance?: number;
}) {
  try {
    const existing = await prisma.client.findUnique({
      where: { id: data.id },
    });

    if (!existing) {
      return { success: false, error: "প্রতিষ্ঠানটি খুঁজে পাওয়া যায়নি।" };
    }

    const updated = await prisma.client.update({
      where: { id: data.id },
      data: {
        name: data.name.trim(),
        phone: data.phone.trim(),
        address: data.address?.trim() || null,
        ...(data.openingBalance !== undefined ? { openingBalance: data.openingBalance } : {}),
      },
    });

    try {
      revalidatePath("/clients");
      revalidatePath("/product-in");
      revalidatePath("/product-out");
      revalidatePath("/loan");
      revalidatePath("/main-cash");
      revalidatePath("/");
    } catch (e) {
      console.warn("Revalidate path warning:", e);
    }

    try {
      await recordAuditLog(
        "owner",
        "UPDATE_COMPANY",
        `Updated Company '${updated.name}' (${updated.phone})`
      );
    } catch (aErr) {
      console.warn("Audit log warning:", aErr);
    }

    return { success: true, client: updated, message: "প্রতিষ্ঠানের তথ্য সফলভাবে আপডেট করা হয়েছে!" };
  } catch (error: any) {
    console.error("Error updating client:", error);
    return { success: false, error: error?.message || "প্রতিষ্ঠান আপডেট করতে ব্যর্থ হয়েছে।" };
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
      message: "প্রতিষ্ঠানের লগইন অ্যাক্সেস সফলভাবে তৈরি ও সংরক্ষিত হয়েছে!",
      user,
    };
  } catch (error: any) {
    console.error("Error creating client login:", error);
    return { success: false, error: error.message || "লগইন তৈরি করতে সমস্যা হয়েছে" };
  }
}

import { createInvoice } from "./invoiceActions";

export async function submitClientProductOutRequest(data: {
  clientId: string;
  productName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalAmount: number;
  dueDate?: string;
  notes?: string;
}) {
  try {
    const client = await prisma.client.findUnique({
      where: { id: data.clientId },
    });

    if (!client) {
      return { success: false, error: "প্রতিষ্ঠান একাউন্ট খুঁজে পাওয়া যায়নি" };
    }

    const fullProductName = data.unit ? `${data.productName} (${data.unit})` : data.productName;

    const res = await createInvoice({
      type: "product_in",
      clientId: client.id,
      items: [
        {
          productName: fullProductName,
          quantity: data.quantity,
          pricePerUnit: data.pricePerUnit,
        },
      ],
      paidAmount: 0,
      requestedBy: client.name,
      status: "PENDING",
      dueDate: data.dueDate,
      paymentMethod: "cash",
    });

    if (!res.success) {
      return {
        success: false,
        error: res.error || "রিকোয়েস্ট জমা করতে সমস্যা হয়েছে",
      };
    }

    revalidatePath("/portal/product-out");
    revalidatePath("/portal/dashboard");
    revalidatePath("/approvals");
    revalidatePath("/notifications");

    return {
      success: true,
      message: "পণ্য পাঠানোর রিকোয়েস্ট সফলভাবে ওনারের কাছে পাঠানো হয়েছে!",
      invoice: res.invoice,
    };
  } catch (error: any) {
    console.error("Error submitting client product request:", error);
    return {
      success: false,
      error: error.message || "রিকোয়েস্ট জমা করতে সমস্যা হয়েছে",
    };
  }
}

export async function acceptClientDelivery(invoiceId: string) {
  try {
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        paymentStatus: "paid",
      },
    });

    revalidatePath("/portal/product-in");
    revalidatePath("/portal/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error accepting delivery:", error);
    return { success: false, error: error.message };
  }
}

