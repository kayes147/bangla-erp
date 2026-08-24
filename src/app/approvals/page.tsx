import { getPendingApprovals } from "@/actions/approvalActions";
import ApprovalsClient from "./ApprovalsClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function ApprovalsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "OWNER") {
    redirect("/"); // Only OWNER can access approvals
  }

  const { success, invoices, expenses, transactions } = await getPendingApprovals();

  return (
    <ApprovalsClient 
      invoices={invoices || []} 
      expenses={expenses || []} 
      transactions={transactions || []} 
    />
  );
}
