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
            items: true,
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
          include: { items: true },
          orderBy: { date: "desc" },
        },
      },
    });
  }

  const clientName = client?.name || session.user.name || "মহাজন";
  const invoices = client?.invoices || [];

  // Calculations from real invoices
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalInvoiceAmount = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const currentDue = totalInvoiceAmount - totalPaid + (client?.openingBalance || 0);

  const pendingCount = invoices.filter((i) => i.status === "PENDING").length;
  const approvedCount = invoices.filter((i) => i.status === "APPROVED").length;

  // Daily, Weekly, Monthly quantity
  const now = new Date();
  const bstTime = new Date(now.getTime() + 6 * 3600 * 1000);
  const y = bstTime.getUTCFullYear();
  const m = bstTime.getUTCMonth();
  const d = bstTime.getUTCDate();
  const todayStart = new Date(Date.UTC(y, m, d, 0, 0, 0) - 6 * 3600 * 1000);
  const weekStart = new Date(todayStart.getTime() - 7 * 24 * 3600 * 1000);
  const monthStart = new Date(Date.UTC(y, m, 1, 0, 0, 0) - 6 * 3600 * 1000);

  let dailyPcs = 0;
  let weeklyPcs = 0;
  let monthlyPcs = 0;

  invoices.forEach((inv) => {
    const invDate = new Date(inv.date);
    const pcs = inv.items.reduce((sum, it) => sum + it.quantity, 0);
    if (invDate >= todayStart) dailyPcs += pcs;
    if (invDate >= weekStart) weeklyPcs += pcs;
    if (invDate >= monthStart) monthlyPcs += pcs;
  });

  return (
    <ClientDashboardClient
      clientName={clientName}
      totalPaid={totalPaid}
      currentDue={currentDue}
      pendingCount={pendingCount}
      approvedCount={approvedCount}
      dailyPcs={dailyPcs}
      weeklyPcs={weeklyPcs}
      monthlyPcs={monthlyPcs}
      invoices={invoices}
    />
  );
}
