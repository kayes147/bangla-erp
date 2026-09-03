import { getDueInvoices } from "@/actions/invoiceActions";
import { getClients } from "@/actions/clientActions";
import LoanClient from "./LoanClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function DuePage() {
  const [dueRes, clientRes] = await Promise.all([
    getDueInvoices(),
    getClients(),
  ]);

  return (
    <LoanClient
      initialInvoices={dueRes.invoices || []}
      clients={clientRes.clients || []}
    />
  );
}
