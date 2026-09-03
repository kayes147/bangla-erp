import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ClientDashboardClient from "./ClientDashboardClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function ClientDashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const clientId = (session.user as any)?.clientId;

  // Find the logged-in client record
  let client = null;
  if (clientId) {
    client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        invoices: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
          orderBy: {
            date: "desc",
          },
        },
      },
    });
  }

  // Fallback if testing without linked clientId
  if (!client) {
    client = await prisma.client.findFirst({
      include: {
        invoices: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
          orderBy: { date: "desc" },
        },
      },
    });
  }

  const clientName = client?.name || session.user.name || "প্রতিষ্ঠান";
  const invoices = client?.invoices || [];

  // Calculations:
  // 1. Total Paid: sum of paid amounts across all client invoices
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);

  // 2. Current Due: total unpaid invoice balances for this Mahajon (matches /loan and table rows)
  const currentDue = invoices.reduce(
    (sum, inv) => sum + Math.max(0, inv.totalAmount - inv.paidAmount),
    0
  );

  const pendingCount = invoices.filter((i) => i.status === "PENDING").length;
  const approvedCount = invoices.filter((i) => i.status === "APPROVED").length;

  // Daily, Weekly, Monthly quantity calculations (BST UTC+6)
  const now = new Date();
  const bstTime = new Date(now.getTime() + 6 * 3600 * 1000);
  const y = bstTime.getUTCFullYear();
  const m = bstTime.getUTCMonth();
  const d = bstTime.getUTCDate();
  const todayStart = new Date(Date.UTC(y, m, d, 0, 0, 0) - 6 * 3600 * 1000);
  const weekStart = new Date(todayStart.getTime() - 7 * 24 * 3600 * 1000);
  const monthStart = new Date(Date.UTC(y, m, 1, 0, 0, 0) - 6 * 3600 * 1000);

  let dailyIn = 0;
  let dailyOut = 0;
  let weeklyIn = 0;
  let weeklyOut = 0;
  let monthlyIn = 0;
  let monthlyOut = 0;

  invoices.forEach((inv) => {
    const invDate = new Date(inv.date);
    const pcs = inv.items.reduce((sum, it) => sum + it.quantity, 0);
    if (invDate >= todayStart) {
      if (inv.type === "product_in") dailyIn += pcs;
      else dailyOut += pcs;
    }
    if (invDate >= weekStart) {
      if (inv.type === "product_in") weeklyIn += pcs;
      else weeklyOut += pcs;
    }
    if (invDate >= monthStart) {
      if (inv.type === "product_in") monthlyIn += pcs;
      else monthlyOut += pcs;
    }
  });

  return (
    <ClientDashboardClient
      clientName={clientName}
      totalPaid={totalPaid}
      currentDue={currentDue}
      pendingCount={pendingCount}
      approvedCount={approvedCount}
      dailyIn={dailyIn}
      dailyOut={dailyOut}
      weeklyIn={weeklyIn}
      weeklyOut={weeklyOut}
      monthlyIn={monthlyIn}
      monthlyOut={monthlyOut}
      invoices={invoices}
    />
  );
}
