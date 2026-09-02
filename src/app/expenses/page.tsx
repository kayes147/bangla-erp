import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getExpenses } from "@/actions/expenseActions";
import ExpensesClient from "./ExpensesClient";

export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const { expenses } = await getExpenses();

  return <ExpensesClient initialExpenses={expenses || []} userRole={session.user?.name || "manager"} />;
}
