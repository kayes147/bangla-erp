import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProductInClient from "./ProductInClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function ClientProductInListPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const clientId = (session.user as any)?.clientId;

  let client = null;
  if (clientId) {
    client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        invoices: {
          where: {
            type: "product_out", // Out from factory = In for Mahajon
          },
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

  // Fallback to first client if demo/fallback
  if (!client) {
    client = await prisma.client.findFirst({
      include: {
        invoices: {
          where: {
            type: "product_out",
          },
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
  const clientPhone = client?.phone || "";
  const invoices = client?.invoices || [];

  return (
    <ProductInClient
      clientName={clientName}
      clientPhone={clientPhone}
      invoices={invoices}
    />
  );
}
