import { getDueInvoices } from "@/actions/invoiceActions";
import { getClientsSummary } from "@/actions/clientActions";
import LoanClient from "./LoanClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function DuePage() {
  const [dueRes, clientRes] = await Promise.all([
    getDueInvoices(),
    getClientsSummary(),
  ]);

  return (
    <LoanClient
      initialInvoices={dueRes.invoices || []}
      clients={clientRes.clients || []}
    />
  );
}
