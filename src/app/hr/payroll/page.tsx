import { getMonthlyPayroll } from "@/actions/payrollActions";
import PayrollClient from "./PayrollClient";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PayrollPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const data = await getMonthlyPayroll();

  return (
    <PayrollClient
      initialMonth={data.currentMonth || "2026-08"}
      payrollList={data.payrollList || []}
      totalPayroll={data.totalPayroll || 0}
      totalPaid={data.totalPaid || 0}
      totalPending={data.totalPending || 0}
    />
  );
}
