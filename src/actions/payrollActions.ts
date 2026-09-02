"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { recordAuditLog } from "./auditLogActions";

export async function getMonthlyPayroll(monthStr?: string) {
  try {
    const today = new Date();
    const currentMonth = monthStr || `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

    const employees = await prisma.employee.findMany({
      orderBy: { name: "asc" },
    });

    const [salaryCat] = await Promise.all([
      prisma.expenseCategory.findUnique({ where: { name: "Salary" } }),
    ]);

    const startOfMonth = new Date(`${currentMonth}-01`);
    const nextMonthYear = today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear();
    const nextMonthNum = today.getMonth() === 11 ? 1 : today.getMonth() + 2;
    const endOfMonth = new Date(`${nextMonthYear}-${String(nextMonthNum).padStart(2, "0")}-01`);

    const payrollList = [];
    let totalPayroll = 0;
    let totalPaid = 0;

    for (const emp of employees) {
      // 1. Fetch attendance records for this month
      const attendances = await prisma.attendance.findMany({
        where: {
          employeeId: emp.id,
          dateString: { startsWith: currentMonth },
        },
      });

      const presentCount = attendances.filter((a) => a.status === "PRESENT").length;
      const absentCount = attendances.filter((a) => a.status === "ABSENT").length;
      const leaveCount = attendances.filter((a) => a.status === "LEAVE").length;

      // Calculate daily rate based on 30 working days
      const dailyRate = Math.round(emp.salaryAmount / 30);
      const deductions = absentCount * dailyRate;
      const netPayable = Math.max(0, emp.salaryAmount - deductions);

      // Check if paid in this month
      const paidExpense = salaryCat
        ? await prisma.expense.findFirst({
            where: {
              employeeId: emp.id,
              categoryId: salaryCat.id,
              date: { gte: startOfMonth, lt: endOfMonth },
            },
          })
        : null;

      const isPaid = Boolean(paidExpense);
      totalPayroll += netPayable;
      if (isPaid) totalPaid += netPayable;

      payrollList.push({
        employeeId: emp.id,
        name: emp.name,
        phone: emp.phone,
        type: emp.type,
        designation: emp.designation || "কর্মী",
        basicSalary: emp.salaryAmount,
        presentDays: presentCount,
        absentDays: absentCount,
        leaveDays: leaveCount,
        deductions,
        netPayable,
        isPaid,
        paidDate: paidExpense?.date || null,
        paidAmount: paidExpense?.amount || 0,
      });
    }

    return {
      success: true,
      currentMonth,
      payrollList,
      totalPayroll,
      totalPaid,
      totalPending: totalPayroll - totalPaid,
    };
  } catch (error: any) {
    console.error("Error fetching payroll:", error);
    return {
      success: false,
      payrollList: [],
      totalPayroll: 0,
      totalPaid: 0,
      totalPending: 0,
      error: error.message,
    };
  }
}

export async function payEmployeeSalary(data: {
  employeeId: string;
  amount: number;
  month: string;
  paymentMethod?: string;
  requestedBy?: string;
  notes?: string;
}) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: data.employeeId },
    });

    if (!employee) {
      return { success: false, error: "Employee not found" };
    }

    const salaryCategory = await prisma.expenseCategory.upsert({
      where: { name: "Salary" },
      update: {},
      create: { name: "Salary" },
    });

    const paymentMethod = data.paymentMethod || "cash";
    const requestedBy = data.requestedBy || "owner";

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Expense
      const expense = await tx.expense.create({
        data: {
          categoryId: salaryCategory.id,
          employeeId: employee.id,
          paidTo: employee.name,
          amount: data.amount,
          description: `বেতন প্রদান (${data.month}) - ${employee.name} ${data.notes ? `(${data.notes})` : ""}`,
          paymentMethod: paymentMethod,
          isPersonal: false,
          status: "APPROVED",
          requestedBy: requestedBy,
        },
      });

      // 2. Create Transaction in Main Cash
      if (paymentMethod === "cash") {
        await tx.transaction.create({
          data: {
            type: "out",
            amount: data.amount,
            description: `[বেতন পরিশোধ] ${employee.name} (${data.month})`,
            status: "APPROVED",
            requestedBy: requestedBy,
            expense: { connect: { id: expense.id } },
          },
        });
      }

      return expense;
    });

    revalidatePath("/hr/payroll");
    revalidatePath("/expenses");
    revalidatePath("/main-cash");
    revalidatePath("/salary");
    revalidatePath("/");

    await recordAuditLog(
      requestedBy,
      "PAY_SALARY",
      `Paid salary of ৳${data.amount.toLocaleString()} to ${employee.name} for ${data.month}`
    );

    return { success: true, expense: result };
  } catch (error: any) {
    console.error("Error paying salary:", error);
    return { success: false, error: error.message || "Failed to pay salary" };
  }
}
