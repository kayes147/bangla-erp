import { getInvoices } from "@/actions/invoiceActions";
import { getClientsSummary } from "@/actions/clientActions";
import ProductInClient from "./ProductInClient";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function ProductInPage() {
  const [session, { invoices }, { clients }] = await Promise.all([
    auth(),
    getInvoices("product_in"),
    getClientsSummary(),
  ]);

  const mockRole = session?.user?.name || "owner";
  const allClients = clients || [];

  return (
    <ProductInClient 
      initialInvoices={invoices || []} 
      clients={allClients} 
      userRole={mockRole} 
    />
  );
}
