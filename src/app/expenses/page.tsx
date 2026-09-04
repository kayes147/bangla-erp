import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getExpenses } from "@/actions/expenseActions";
import { getEmployees } from "@/actions/employeeActions";
import ExpensesClient from "./ExpensesClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function ExpensesPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const [{ expenses }, { employees }] = await Promise.all([
    getExpenses(),
    getEmployees(),
  ]);

  return (
    <ExpensesClient 
      initialExpenses={expenses || []} 
      employees={employees || []} 
      userRole={session.user?.name || "manager"} 
    />
  );
}
