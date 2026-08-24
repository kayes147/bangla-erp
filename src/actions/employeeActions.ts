"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getEmployees() {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        salariesPaid: {
          orderBy: { date: "desc" },
          take: 1
        }
      }
    });
    return { success: true, employees };
  } catch (error) {
    console.error("Error fetching employees:", error);
    return { success: false, employees: [] };
  }
}

export async function createEmployee(data: {
  name: string;
  phone: string;
  type: string;
  designation?: string;
  salaryAmount: number;
}) {
  try {
    const employee = await prisma.employee.create({
      data: {
        name: data.name,
        phone: data.phone,
        type: data.type,
        designation: data.designation,
        salaryAmount: data.salaryAmount,
      }
    });
    revalidatePath("/salary");
    return { success: true, employee };
  } catch (error: any) {
    console.error("Error creating employee:", error);
    return { success: false, error: error.message };
  }
}
