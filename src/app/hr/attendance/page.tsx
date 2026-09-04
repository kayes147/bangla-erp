import { getEmployees } from "@/actions/employeeActions";
import { getAttendances } from "@/actions/attendanceActions";
import AttendanceClient from "./AttendanceClient";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AttendancePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { employees } = await getEmployees();
  
  // By default, get today's date string in YYYY-MM-DD
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;

  const { attendances } = await getAttendances(dateString);

  return (
    <AttendanceClient 
      employees={employees || []} 
      attendances={attendances || []} 
      initialDateString={dateString} 
    />
  );
}
