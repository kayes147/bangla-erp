import { getDueInvoices } from "@/actions/invoiceActions";
import { getClientsSummary } from "@/actions/clientActions";
import LoanClient from "./LoanClient";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function DuePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

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
