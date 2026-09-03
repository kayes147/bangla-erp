import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

const SUPER_ADMIN_MASTER_PASS = "147570pmBD@147";

/**
 * Capture full database state and save to BackupVault (Cloud PostgreSQL + Local Disk)
 */
export async function createAutomatedBackupSnapshot(trigger: string, description: string) {
  try {
    const [
      clients,
      products,
      invoices,
      invoiceItems,
      transactions,
      expenses,
      users,
      auditLogs,
      loans,
      employees,
    ] = await Promise.all([
      prisma.client.findMany(),
      prisma.product.findMany(),
      prisma.invoice.findMany(),
      prisma.invoiceItem.findMany(),
      prisma.transaction.findMany(),
      prisma.expense.findMany(),
      prisma.user.findMany(),
      prisma.auditLog.findMany(),
      prisma.loan.findMany(),
      prisma.employee.findMany(),
    ]);

    const totalRecords =
      clients.length +
      products.length +
      invoices.length +
      transactions.length +
      expenses.length +
      users.length;

    const payload = JSON.stringify({
      snapshotDate: new Date().toISOString(),
      trigger,
      description,
      data: {
        clients,
        products,
        invoices,
        invoiceItems,
        transactions,
        expenses,
        users,
        auditLogs,
        loans,
        employees,
      },
    });

    // 1. Save to Cloud PostgreSQL BackupVault table (Permanent across deployments)
    const vaultEntry = await prisma.backupVault.create({
      data: {
        trigger,
        description,
        recordCount: totalRecords,
        payload,
      },
    });

    // 2. Also save to local disk if running in environment where disk is writable
    try {
      const backupDir = path.join(process.cwd(), "backups", "vault");
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      const filePath = path.join(backupDir, `vault_${vaultEntry.id}.json`);
      fs.writeFileSync(filePath, payload);
    } catch (diskErr) {
      // Disk write failure shouldn't fail cloud backup
      console.warn("Disk backup warning (normal on read-only serverless):", diskErr);
    }

    // Keep latest 100 snapshots to prevent database bloat
    try {
      const count = await prisma.backupVault.count();
      if (count > 100) {
        const oldest = await prisma.backupVault.findMany({
          orderBy: { createdAt: "asc" },
          take: count - 100,
          select: { id: true },
        });
        await prisma.backupVault.deleteMany({
          where: { id: { in: oldest.map((o) => o.id) } },
        });
      }
    } catch (cleanErr) {
      console.warn("Vault pruning warning:", cleanErr);
    }

    return { success: true, id: vaultEntry.id };
  } catch (error: any) {
    console.error("Automated backup vault snapshot failed:", error);
    return { success: false, error: error.message };
  }
}

/**
 * List all backup vault snapshots
 */
export async function getBackupVaultSnapshots() {
  try {
    const snapshots = await prisma.backupVault.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        trigger: true,
        description: true,
        recordCount: true,
        createdAt: true,
      },
    });
    return { success: true, snapshots };
  } catch (error: any) {
    console.error("Error fetching backup snapshots:", error);
    return { success: false, snapshots: [] };
  }
}

/**
 * Restore database from a specific snapshot (Protected by Super Admin Password)
 */
export async function restoreFromBackupSnapshot(snapshotId: string, passwordInput: string) {
  try {
    if (passwordInput !== SUPER_ADMIN_MASTER_PASS) {
      return {
        success: false,
        error: "ভুল সুপার অ্যাডমিন পাসওয়ার্ড! ডাটা রিস্টোর করার অনুমতি নেই।",
      };
    }

    const snapshot = await prisma.backupVault.findUnique({
      where: { id: snapshotId },
    });

    if (!snapshot) {
      return { success: false, error: "ব্যাকআপ স্ন্যাপশট খুঁজে পাওয়া যায়নি।" };
    }

    const parsed = JSON.parse(snapshot.payload);
    const {
      clients = [],
      products = [],
      invoices = [],
      invoiceItems = [],
      transactions = [],
      expenses = [],
      users = [],
      auditLogs = [],
      loans = [],
      employees = [],
    } = parsed.data || {};

    // Restore inside transaction using upsert
    await prisma.$transaction(async (tx) => {
      // 1. Clients
      for (const c of clients) {
        await tx.client.upsert({
          where: { id: c.id },
          update: {
            name: c.name,
            phone: c.phone,
            address: c.address,
            openingBalance: c.openingBalance,
            type: c.type,
          },
          create: c,
        });
      }

      // 2. Products
      for (const p of products) {
        await tx.product.upsert({
          where: { id: p.id },
          update: {
            name: p.name,
            stock: p.stock,
            buyPrice: p.buyPrice,
            sellPrice: p.sellPrice,
          },
          create: p,
        });
      }

      // 3. Invoices
      for (const inv of invoices) {
        await tx.invoice.upsert({
          where: { id: inv.id },
          update: {
            clientId: inv.clientId,
            type: inv.type,
            totalAmount: inv.totalAmount,
            paidAmount: inv.paidAmount,
            paymentStatus: inv.paymentStatus,
            status: inv.status,
            dueDate: inv.dueDate ? new Date(inv.dueDate) : null,
          },
          create: {
            ...inv,
            date: new Date(inv.date),
            createdAt: new Date(inv.createdAt),
            dueDate: inv.dueDate ? new Date(inv.dueDate) : null,
          },
        });
      }

      // 4. Invoice Items
      for (const item of invoiceItems) {
        await tx.invoiceItem.upsert({
          where: { id: item.id },
          update: {
            invoiceId: item.invoiceId,
            productId: item.productId,
            quantity: item.quantity,
            pricePerUnit: item.pricePerUnit,
            total: item.total ?? (item.quantity * item.pricePerUnit),
          },
          create: item,
        });
      }

      // 5. Transactions
      for (const tr of transactions) {
        await tx.transaction.upsert({
          where: { id: tr.id },
          update: {
            type: tr.type,
            amount: tr.amount,
            description: tr.description,
            status: tr.status,
          },
          create: {
            ...tr,
            date: new Date(tr.date),
            createdAt: new Date(tr.createdAt),
          },
        });
      }

      // 6. Expenses
      for (const exp of expenses) {
        await tx.expense.upsert({
          where: { id: exp.id },
          update: {
            amount: exp.amount,
            description: exp.description,
            status: exp.status,
          },
          create: {
            ...exp,
            date: new Date(exp.date),
            createdAt: new Date(exp.createdAt),
          },
        });
      }

      // 7. Users
      for (const u of users) {
        await tx.user.upsert({
          where: { id: u.id },
          update: {
            username: u.username,
            password: u.password,
            role: u.role,
            clientId: u.clientId,
            employeeId: u.employeeId,
          },
          create: u,
        });
      }
    });

    return {
      success: true,
      message: `সফলভাবে ${snapshot.recordCount}টি রেকর্ড রিস্টোর করা হয়েছে!`,
    };
  } catch (error: any) {
    console.error("Restore from backup snapshot failed:", error);
    return { success: false, error: error.message || "রিস্টোর ব্যর্থ হয়েছে।" };
  }
}

/**
 * Delete a specific backup snapshot (STRICTLY Protected by Super Admin Password)
 */
export async function deleteBackupSnapshot(snapshotId: string, passwordInput: string) {
  try {
    if (passwordInput !== SUPER_ADMIN_MASTER_PASS) {
      return {
        success: false,
        error: "ভুল সুপার অ্যাডমিন পাসওয়ার্ড! ব্যাকআপ ডিলিট করার অনুমতি নেই।",
      };
    }

    await prisma.backupVault.delete({
      where: { id: snapshotId },
    });

    return { success: true, message: "ব্যাকআপ স্ন্যাপশট মুছে ফেলা হয়েছে।" };
  } catch (error: any) {
    console.error("Delete backup snapshot failed:", error);
    return { success: false, error: error.message };
  }
}
