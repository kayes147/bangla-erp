import { getInvoices } from "@/actions/invoiceActions";
import { getClients } from "@/actions/clientActions";
import ProductOutClient from "./ProductOutClient";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function ProductOutPage() {
  const session = await auth();
  const mockRole = session?.user?.name || "owner";

  const { invoices } = await getInvoices("product_out");
  const { clients } = await getClients();
  
  // Allow all registered parties (both customers and suppliers) so user can sell to any party
  const allClients = clients || [];

  return (
    <ProductOutClient 
      initialInvoices={invoices || []} 
      clients={allClients} 
      userRole={mockRole} 
    />
  );
}
