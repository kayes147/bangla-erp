import { getMonthlyPayroll } from "@/actions/payrollActions";
import PayrollClient from "./PayrollClient";

export const dynamic = "force-dynamic";

export default async function PayrollPage() {
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
