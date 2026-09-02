import { getInvoices } from "@/actions/invoiceActions";
import { getClients } from "@/actions/clientActions";
import ProductInClient from "./ProductInClient";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function ProductInPage() {
  const session = await auth();
  const mockRole = session?.user?.name || "owner";

  const { invoices } = await getInvoices("product_in");
  const { clients } = await getClients();
  
  // Filter for suppliers only
  const suppliers = (clients || []).filter(c => c.type === "supplier");

  return (
    <ProductInClient 
      initialInvoices={invoices || []} 
      clients={suppliers} 
      userRole={mockRole} 
    />
  );
}
