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
    const cleanedPhone = data.phone?.replace(/\D/g, "");
    if (!cleanedPhone || cleanedPhone.length !== 11) {
      return { success: false, error: "মোবাইল নম্বর অবশ্যই ঠিক ১১ ডিজিটের হতে হবে (যেমন: 017XXXXXXXX)!" };
    }

    const employee = await prisma.employee.create({
      data: {
        name: data.name.trim(),
        phone: cleanedPhone,
        type: data.type,
        designation: data.designation?.trim() || null,
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

export async function paySalary(employeeId: string, amount: number, monthOrDate: string, requestedBy: string, status: string) {
  try {
    let category = await prisma.expenseCategory.findUnique({ where: { name: 'Salary' } });
    if (!category) {
      category = await prisma.expenseCategory.create({ data: { name: 'Salary' } });
    }

    const expense = await prisma.expense.create({
      data: {
        categoryId: category.id,
        employeeId: employeeId,
        amount: amount,
        description: `Salary/Wage payment for ${monthOrDate}`,
        paymentMethod: 'cash',
        isPersonal: false,
        status: status,
        requestedBy: requestedBy
      }
    });

    if (status === "APPROVED") {
      await prisma.transaction.create({
        data: {
          type: "out",
          amount: amount,
          description: `Salary/Wage payment for ${monthOrDate}`,
          status: "APPROVED",
          expense: { connect: { id: expense.id } },
          requestedBy: requestedBy
        }
      });
    }

    revalidatePath("/salary");
    revalidatePath("/expenses");
    revalidatePath("/main-cash");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error paying salary:", error);
    return { success: false, error: error.message };
  }
}
