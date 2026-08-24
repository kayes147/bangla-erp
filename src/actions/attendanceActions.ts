"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAttendances(dateString?: string) {
  try {
    const whereClause = dateString ? { dateString } : {};
    
    const attendances = await prisma.attendance.findMany({
      where: whereClause,
      include: {
        employee: true
      },
      orderBy: { createdAt: "desc" }
    });

    return { success: true, attendances };
  } catch (error: any) {
    console.error("Error fetching attendances:", error);
    return { success: false, error: error.message, attendances: [] };
  }
}

export async function markAttendance(employeeId: string, dateString: string, status: string, note?: string) {
  try {
    // Upsert attendance for the employee on that day
    const attendance = await prisma.attendance.upsert({
      where: {
        dateString_employeeId: {
          dateString,
          employeeId
        }
      },
      update: {
        status,
        note
      },
      create: {
        employeeId,
        dateString,
        status,
        note
      }
    });

    revalidatePath("/hr/attendance");
    return { success: true, attendance };
  } catch (error: any) {
    console.error("Error marking attendance:", error);
    return { success: false, error: error.message };
  }
}

export async function markBulkAttendance(dateString: string, entries: { employeeId: string, status: string, note?: string }[]) {
  try {
    // Process sequentially or in a transaction
    await prisma.$transaction(
      entries.map(entry => 
        prisma.attendance.upsert({
          where: {
            dateString_employeeId: {
              dateString,
              employeeId: entry.employeeId
            }
          },
          update: {
            status: entry.status,
            note: entry.note
          },
          create: {
            employeeId: entry.employeeId,
            dateString,
            status: entry.status,
            note: entry.note
          }
        })
      )
    );

    revalidatePath("/hr/attendance");
    return { success: true };
  } catch (error: any) {
    console.error("Error bulk marking attendance:", error);
    return { success: false, error: error.message };
  }
}
