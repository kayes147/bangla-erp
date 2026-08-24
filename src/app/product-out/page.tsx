import { getInvoices } from "@/actions/invoiceActions";
import { getClients } from "@/actions/clientActions";
import ProductOutClient from "./ProductOutClient";
import { auth } from "@/auth";

export default async function ProductOutPage() {
  const session = await auth();
  const mockRole = session?.user?.name || "owner";

  const { invoices } = await getInvoices("product_out");
  const { clients } = await getClients();
  
  // Filter for customers only (or allow all)
  const customers = (clients || []).filter(c => c.type === "customer");

  return (
    <ProductOutClient 
      initialInvoices={invoices || []} 
      clients={customers} 
      userRole={mockRole} 
    />
  );
}
