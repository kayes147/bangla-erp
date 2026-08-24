import { getEmployees } from "@/actions/employeeActions";
import EmployeeList from "./EmployeeList";
import Link from "next/link";
import { Users, UserPlus, Banknote } from "lucide-react";

export default async function SalaryPage() {
  const { employees } = await getEmployees();

  return (
    <div className="max-w-6xl mx-auto space-y-6 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-pink-100 text-pink-600 rounded-lg">
            <Users size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">কর্মী তালিকা <span className="text-sm font-normal text-gray-500">(Employees & Salary)</span></h1>
        </div>
        <div className="flex space-x-3">
          <Link href="/salary/new" className="flex items-center space-x-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-sm text-sm">
            <UserPlus size={18} />
            <span>কর্মী যোগ করুন <span className="font-normal opacity-80 uppercase text-[10px]">(Add Employee)</span></span>
          </Link>
          <Link href="/expenses" className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-sm text-sm">
            <Banknote size={18} />
            <span>বেতন দিন <span className="font-normal opacity-80 uppercase text-[10px]">(Pay Salary)</span></span>
          </Link>
        </div>
      </div>

      <EmployeeList initialEmployees={employees || []} />
    </div>
  );
}
