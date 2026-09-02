import { getLeaveRecords } from "@/actions/leaveActions";
import { getEmployees } from "@/actions/employeeActions";
import LeaveClient from "./LeaveClient";

export const dynamic = "force-dynamic";

export default async function LeavePage() {
  const [leaveRes, empRes] = await Promise.all([
    getLeaveRecords(),
    getEmployees(),
  ]);

  return (
    <LeaveClient
      initialLeaves={leaveRes.leaves || []}
      employees={empRes.employees || []}
    />
  );
}
