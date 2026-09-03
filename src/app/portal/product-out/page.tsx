import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProductOutClient from "./ProductOutClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function ClientProductOutRequestPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const clientId = (session.user as any)?.clientId;

  let client = null;
  if (clientId) {
    client = await prisma.client.findUnique({
      where: { id: clientId },
    });
  }

  // Fallback to first client if demo/fallback
  if (!client) {
    client = await prisma.client.findFirst();
  }

  const clientName = client?.name || session.user.name || "প্রতিষ্ঠান";
  const clientPhone = client?.phone || "";

  // Fetch product names from existing products or invoice items in the system
  const products = await prisma.product.findMany({
    select: { name: true },
    take: 20,
    orderBy: { createdAt: "desc" },
  });

  const availableProducts = Array.from(
    new Set([
      ...products.map((p) => p.name),
      "Radhuni Masala 500g",
      "Pran Mustard Oil 1L",
      "Fresh Atta 2kg",
      "Teer Soyabean Oil 5L",
    ])
  );

  return (
    <ProductOutClient
      clientId={client?.id || clientId || ""}
      clientName={clientName}
      clientPhone={clientPhone}
      availableProducts={availableProducts}
    />
  );
}
