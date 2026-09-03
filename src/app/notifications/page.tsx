import { prisma } from "@/lib/prisma";
import { getPendingApprovals } from "@/actions/approvalActions";
import NotificationsClient, { NotificationItem } from "./NotificationsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function NotificationsPage() {
  const notifications: NotificationItem[] = [];

  try {
    const now = new Date();

    // 1. Pending Approvals
    const pending = await getPendingApprovals();

    // Invoices pending
    if (pending.invoices) {
      for (const inv of pending.invoices) {
        notifications.push({
          id: `approval-inv-${inv.id}`,
          type: "approval",
          title: `নতুন চালান অনুমোদনের অপেক্ষায় (#${inv.id.slice(-6)})`,
          message: `${inv.type === "product_in" ? "পণ্য ইন" : "পণ্য আউট"} চালানের মোট টাকা ৳ ${inv.totalAmount.toLocaleString()} মালিকের অনুমোদনের জন্য জমা রয়েছে।`,
          timestamp: inv.createdAt ? new Date(inv.createdAt).toISOString() : now.toISOString(),
          link: "/approvals",
          actionLabel: "অনুমোদন করুন",
          badge: {
            label: "পেন্ডিং চালান",
            bg: "bg-orange-100",
            text: "text-orange-800",
          },
        });
      }
    }

    // Expenses pending
    if (pending.expenses) {
      for (const exp of pending.expenses) {
        notifications.push({
          id: `approval-exp-${exp.id}`,
          type: "approval",
          title: `দৈনিক খরচ অনুমোদনের অপেক্ষায় (${exp.description || exp.category?.name || "দৈনিক খরচ"})`,
          message: `খরচের পরিমাণ: ৳ ${exp.amount.toLocaleString()}। ক্যাটাগরি: ${exp.category?.name || "সাধারণ খরচ"}।`,
          timestamp: exp.createdAt ? new Date(exp.createdAt).toISOString() : now.toISOString(),
          link: "/approvals",
          actionLabel: "অনুমোদন করুন",
          badge: {
            label: "পেন্ডিং খরচ",
            bg: "bg-red-100",
            text: "text-red-800",
          },
        });
      }
    }

    // Transactions pending
    if (pending.transactions) {
      for (const trx of pending.transactions) {
        notifications.push({
          id: `approval-trx-${trx.id}`,
          type: "approval",
          title: `ক্যাশ লেনদেন অনুমোদনের অপেক্ষায় (${trx.type === "in" ? "ক্যাশ ইন" : "ক্যাশ আউট"})`,
          message: `পরিমাণ: ৳ ${trx.amount.toLocaleString()}। বিবরণ: ${trx.description}।`,
          timestamp: trx.createdAt ? new Date(trx.createdAt).toISOString() : now.toISOString(),
          link: "/approvals",
          actionLabel: "অনুমোদন করুন",
          badge: {
            label: "পেন্ডিং ক্যাশ",
            bg: "bg-amber-100",
            text: "text-amber-800",
          },
        });
      }
    }

    // 2. Overdue Dues (তারিখ পার হওয়া বকেয়া)
    const overdueInvoices = await prisma.invoice.findMany({
      where: {
        dueDate: {
          lte: now,
        },
      },
      include: {
        client: true,
      },
      orderBy: {
        dueDate: "desc",
      },
    });

    for (const inv of overdueInvoices) {
      const remaining = inv.totalAmount - inv.paidAmount;
      if (remaining > 0) {
        const partyName = inv.client?.name || "প্রতিষ্ঠান";
        const dueDateFormatted = inv.dueDate ? new Date(inv.dueDate).toLocaleDateString("bn-BD") : "";
        notifications.push({
          id: `overdue-inv-${inv.id}`,
          type: "overdue",
          title: `বকেয়া পরিশোধের তারিখ পার হয়েছে (${partyName})`,
          message: `চালান #${inv.id.slice(-6)} এর বকেয়া ৳ ${remaining.toLocaleString()} পরিশোধের নির্ধারিত তারিখ (${dueDateFormatted}) অতিক্রান্ত হয়েছে। দ্রুত তাগাদা পাঠান।`,
          timestamp: inv.dueDate ? new Date(inv.dueDate).toISOString() : now.toISOString(),
          link: "/loan",
          actionLabel: "তাগাদা পাঠান",
          badge: {
            label: "তারিখ পার",
            bg: "bg-red-100",
            text: "text-red-800",
          },
        });
      }
    }

    // 3. Audit Logs (Recent system activities)
    const auditLogs = await prisma.auditLog.findMany({
      take: 25,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
    });

    for (const log of auditLogs) {
      const userName = log.user?.username || "ইউজার";
      notifications.push({
        id: `audit-${log.id}`,
        type: "activity",
        title: `${log.action} (${userName})`,
        message: log.details,
        timestamp: new Date(log.createdAt).toISOString(),
        link: "/audit-logs",
        actionLabel: "লগ দেখুন",
        badge: {
          label: "কার্যক্রম",
          bg: "bg-blue-100",
          text: "text-blue-800",
        },
      });
    }

    // 4. Sort all notifications by timestamp descending (newest first)
    notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }

  return <NotificationsClient initialNotifications={notifications} />;
}
