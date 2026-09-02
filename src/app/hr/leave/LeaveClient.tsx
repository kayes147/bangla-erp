"use client";

import { useState } from "react";
import { CalendarRange, Plus, Check, X, User, Save } from "lucide-react";
import { applyLeave } from "@/actions/leaveActions";

interface LeaveItem {
  id: string;
  dateString: string;
  status: string;
  note: string | null;
  employee: {
    id: string;
    name: string;
    phone: string;
    designation: string | null;
  };
}

interface EmployeeItem {
  id: string;
  name: string;
  phone: string;
  designation?: string | null;
}

export default function LeaveClient({
  initialLeaves,
  employees,
}: {
  initialLeaves: LeaveItem[];
  employees: EmployeeItem[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [leaveType, setLeaveType] = useState("অসুস্থতাজনিত ছুটি (Sick Leave)");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !startDate || !endDate) {
      alert("সকল প্রয়োজনীয় তথ্য দিন!");
      return;
    }

    setLoading(true);
    const res = await applyLeave({
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason,
      requestedBy: "manager",
    });
    setLoading(false);

    if (res.success) {
      alert("ছুটি সফলভাবে অনুমোদন ও সংরক্ষিত হয়েছে!");
      setIsModalOpen(false);
      setReason("");
      setEmployeeId("");
    } else {
      alert(res.error || "ব্যর্থ হয়েছে");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-pink-100 text-pink-600 rounded-xl">
            <CalendarRange size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Leave Management <span className="text-lg font-normal text-gray-500">(ছুটি ব্যবস্থাপনা)</span>
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              কর্মচারীদের ছুটি অনুমোদন ও হাজিরার সাথে স্বয়ংক্রিয় সমন্বয়
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2.5 rounded-lg font-bold transition-colors text-sm shadow-sm"
        >
          <Plus size={18} />
          <span>ছুটি এন্ট্রি করুন (Apply Leave)</span>
        </button>
      </div>

      {/* Leaves Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/70 flex justify-between items-center">
          <h2 className="font-bold text-gray-800">অনুমোদিত ছুটির রেকর্ড</h2>
          <span className="text-xs text-gray-500 font-medium">মোট এন্ট্রি: {initialLeaves.length} টি</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-bold text-gray-700">তারিখ (Date)</th>
                <th className="p-4 font-bold text-gray-700">কর্মী (Employee)</th>
                <th className="p-4 font-bold text-gray-700">ছুটির বিবরণ ও কারণ (Reason)</th>
                <th className="p-4 font-bold text-center text-gray-700">অবস্থা (Status)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {initialLeaves.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-4 font-medium text-gray-800 whitespace-nowrap">
                    {l.dateString}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="font-bold text-gray-900">{l.employee.name}</div>
                    <div className="text-xs text-gray-400">
                      {l.employee.designation || "কর্মী"} • {l.employee.phone}
                    </div>
                  </td>
                  <td className="p-4 text-gray-700 font-medium">
                    {l.note || "সাধারণ ছুটি"}
                  </td>
                  <td className="p-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-pink-100 text-pink-700 rounded-md text-xs font-bold">
                      <Check size={13} />
                      <span>অনুমোদিত</span>
                    </span>
                  </td>
                </tr>
              ))}

              {initialLeaves.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-gray-400">
                    <CalendarRange size={36} className="mx-auto mb-2 text-gray-300" />
                    <p className="font-semibold text-gray-600">কোনো ছুটির রেকর্ড পাওয়া যায়নি</p>
                    <p className="text-xs text-gray-400 mt-1">
                      উপরের বাটনে ক্লিক করে ছুটির আবেদন এন্ট্রি করুন।
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-gray-900/40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-pink-50">
              <h2 className="text-base font-bold text-pink-900">
                ছুটি প্রদান ও অনুমোদন (Apply Leave)
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  কর্মী নির্বাচন করুন <span className="text-red-500">*</span>
                </label>
                <select
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg outline-none text-sm bg-white font-medium"
                  required
                >
                  <option value="">নির্বাচন করুন...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.designation || "কর্মী"}) - {emp.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  ছুটির ধরন (Leave Type)
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg outline-none text-sm bg-white font-medium"
                >
                  <option value="অসুস্থতাজনিত ছুটি (Sick Leave)">অসুস্থতাজনিত ছুটি (Sick Leave)</option>
                  <option value="নৈমিত্তিক ছুটি (Casual Leave)">নৈমিত্তিক ছুটি (Casual Leave)</option>
                  <option value="উৎসব বা পারবারিক ছুটি (Festival / Personal)">উৎসব বা পারিবারিক ছুটি</option>
                  <option value="অন্যান্য (Other)">অন্যান্য</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    শুরুর তারিখ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg outline-none text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    শেষ তারিখ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg outline-none text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ছুটির কারণ (Reason)
                </label>
                <textarea
                  rows={2}
                  placeholder="ছুটি নেওয়ার সুনির্দিষ্ট কারণ..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg outline-none text-sm"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-1.5 px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-bold shadow-sm"
                >
                  <Save size={16} />
                  <span>{loading ? "সংরক্ষণ হচ্ছে..." : "ছুটি অনুমোদন করুন"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
