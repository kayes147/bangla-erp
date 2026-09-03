import { getPendingApprovals } from "@/actions/approvalActions";
import { getCorrectionRequests } from "@/actions/correctionActions";
import ApprovalsClient from "./ApprovalsClient";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function ApprovalsPage() {
  const session = await auth();
  
  if (!session || session.user?.role !== "OWNER") {
    redirect("/"); // Only OWNER can access approvals
  }

  const [{ invoices, expenses, transactions }, { requests: corrections }] = await Promise.all([
    getPendingApprovals(),
    getCorrectionRequests(),
  ]);

  return (
    <ApprovalsClient 
      invoices={invoices || []} 
      expenses={expenses || []} 
      transactions={transactions || []} 
      corrections={corrections || []}
    />
  );
}
