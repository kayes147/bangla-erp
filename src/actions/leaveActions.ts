"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { recordAuditLog } from "./auditLogActions";

export async function applyLeave(data: {
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  requestedBy?: string;
}) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: data.employeeId },
    });

    if (!employee) {
      return { success: false, error: "Employee not found" };
    }

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    const dateList: string[] = [];
    let curr = new Date(start);
    while (curr <= end) {
      dateList.push(curr.toISOString().split("T")[0]);
      curr.setDate(curr.getDate() + 1);
    }

    const requestedBy = data.requestedBy || "manager";

    // Mark attendance records as LEAVE for each date
    await prisma.$transaction(
      dateList.map((dateStr) =>
        prisma.attendance.upsert({
          where: {
            dateString_employeeId: {
              dateString: dateStr,
              employeeId: employee.id,
            },
          },
          update: {
            status: "LEAVE",
            note: `[${data.leaveType}] ${data.reason}`,
          },
          create: {
            employeeId: employee.id,
            dateString: dateStr,
            status: "LEAVE",
            note: `[${data.leaveType}] ${data.reason}`,
          },
        })
      )
    );

    revalidatePath("/hr/leave");
    revalidatePath("/hr/attendance");
    revalidatePath("/hr/payroll");

    await recordAuditLog(
      requestedBy,
      "LEAVE_APPROVED",
      `Approved ${data.leaveType} for ${employee.name} (${dateList.length} days: ${data.startDate} to ${data.endDate})`
    );

    return { success: true, count: dateList.length };
  } catch (error: any) {
    console.error("Error applying leave:", error);
    return { success: false, error: error.message || "Failed to apply leave" };
  }
}

export async function getLeaveRecords() {
  try {
    const leaves = await prisma.attendance.findMany({
      where: { status: "LEAVE" },
      include: { employee: true },
      orderBy: { date: "desc" },
      take: 50,
    });

    return { success: true, leaves };
  } catch (error: any) {
    console.error("Error fetching leaves:", error);
    return { success: false, leaves: [] };
  }
}
