"use client";

import { useState } from "react";
import { Banknote, FileText, Download, CheckCircle2, AlertCircle, Printer, X, Save } from "lucide-react";
import { payEmployeeSalary } from "@/actions/payrollActions";

interface PayrollItem {
  employeeId: string;
  name: string;
  phone: string;
  type: string;
  designation: string;
  basicSalary: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  deductions: number;
  netPayable: number;
  isPaid: boolean;
  paidDate: Date | string | null;
  paidAmount: number;
}

export default function PayrollClient({
  initialMonth,
  payrollList,
  totalPayroll,
  totalPaid,
  totalPending,
}: {
  initialMonth: string;
  payrollList: PayrollItem[];
  totalPayroll: number;
  totalPaid: number;
  totalPending: number;
}) {
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [payModalItem, setPayModalItem] = useState<PayrollItem | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("cash");
  const [payNotes, setPayNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [printItem, setPrintItem] = useState<PayrollItem | null>(null);

  const handleOpenPayModal = (item: PayrollItem) => {
    setPayModalItem(item);
    setPayAmount(item.netPayable.toString());
    setPayMethod("cash");
    setPayNotes("");
  };

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payModalItem || !payAmount || Number(payAmount) <= 0) return;

    setLoading(true);
    const res = await payEmployeeSalary({
      employeeId: payModalItem.employeeId,
      amount: Number(payAmount),
      month: selectedMonth,
      paymentMethod: payMethod,
      requestedBy: "owner",
      notes: payNotes,
    });
    setLoading(false);

    if (res.success) {
      alert(`${payModalItem.name} এর বেতন সফলভাবে পরিশোধ করা হয়েছে!`);
      setPayModalItem(null);
    } else {
      alert(res.error || "ব্যর্থ হয়েছে");
    }
  };

  const handlePrintStatement = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 print:hidden">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
            <Banknote size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Payroll Control <span className="text-lg font-normal text-gray-500">(বেতন ও পে-রোল)</span>
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              হাজিরা অনুযায়ী অটোমেটিক বেতন হিসাব ও পরিশোধ
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handlePrintStatement}
            className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg font-bold transition-colors text-sm shadow-sm"
          >
            <Printer size={16} />
            <span>প্রিন্ট স্টেটমেন্ট (Print)</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
            মোট প্রদেয় বেতন (Total Payroll)
          </h3>
          <p className="text-3xl font-black text-gray-900">৳ {totalPayroll.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-2">চলতি মাসের মোট কর্মী পারিশ্রমিক</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
            পরিশোধিত বেতন (Paid)
          </h3>
          <p className="text-3xl font-black text-emerald-600">৳ {totalPaid.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 font-medium mt-2">ইতিমধ্যে প্রদান সম্পন্ন</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">
            বকেয়া বেতন (Pending)
          </h3>
          <p className="text-3xl font-black text-red-600">৳ {totalPending.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-2">এখনও বাকি রয়েছে</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/70 flex justify-between items-center">
          <h2 className="font-bold text-gray-800">
            বেতন বিবরণী - {selectedMonth}
          </h2>
          <span className="text-xs text-gray-500 font-medium">
            মোট কর্মী: {payrollList.length} জন
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-bold text-gray-700">কর্মী (Employee)</th>
                <th className="p-4 font-bold text-gray-700">মূল বেতন</th>
                <th className="p-4 font-bold text-gray-700 text-center">হাজিরা (উপস্থিত / অনুপস্থিত)</th>
                <th className="p-4 font-bold text-gray-700 text-right">কর্তন (Deduction)</th>
                <th className="p-4 font-bold text-right text-gray-700">প্রদেয় বেতন (Net)</th>
                <th className="p-4 font-bold text-center text-gray-700">অবস্থা</th>
                <th className="p-4 font-bold text-right text-gray-700 print:hidden">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payrollList.map((item) => (
                <tr key={item.employeeId} className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.designation} • {item.phone}</div>
                  </td>
                  <td className="p-4 font-mono font-medium text-gray-700">
                    ৳ {item.basicSalary.toLocaleString()}
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mr-1">
                      {item.presentDays} দিন
                    </span>
                    {item.absentDays > 0 && (
                      <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                        {item.absentDays} দিন অনুপস্থিত
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right font-mono text-red-600 font-medium">
                    {item.deductions > 0 ? `- ৳ ${item.deductions.toLocaleString()}` : "৳ 0"}
                  </td>
                  <td className="p-4 font-bold text-gray-900 font-mono text-right">
                    ৳ {item.netPayable.toLocaleString()}
                  </td>
                  <td className="p-4 text-center">
                    {item.isPaid ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md text-xs font-bold">
                        <CheckCircle2 size={13} />
                        <span>পরিশোধিত</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-md text-xs font-bold">
                        <AlertCircle size={13} />
                        <span>বকেয়া</span>
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right print:hidden whitespace-nowrap space-x-2">
                    {!item.isPaid ? (
                      <button
                        onClick={() => handleOpenPayModal(item)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                      >
                        বেতন দিন
                      </button>
                    ) : (
                      <button
                        onClick={() => setPrintItem(item)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium inline-flex items-center transition-colors"
                        title="পেইস্লিপ প্রিন্ট"
                      >
                        <Printer size={15} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {payrollList.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-gray-400">
                    কোনো কর্মচারীর তথ্য পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Pay Salary */}
      {payModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-gray-900/40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-emerald-50">
              <h2 className="text-base font-bold text-emerald-900">
                বেতন প্রদান - {payModalItem.name}
              </h2>
              <button
                onClick={() => setPayModalItem(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePaySubmit} className="p-6 space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">মূল বেতন:</span>
                  <span className="font-mono font-bold">৳ {payModalItem.basicSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>অনুপস্থিতি কর্তন ({payModalItem.absentDays} দিন):</span>
                  <span className="font-mono font-bold">- ৳ {payModalItem.deductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-1 text-sm">
                  <span>নিট প্রদেয়:</span>
                  <span className="font-mono text-emerald-600">৳ {payModalItem.netPayable.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  প্রদেয় টাকা (৳) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-lg text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  পেমেন্ট মেথড
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg outline-none text-sm bg-white"
                >
                  <option value="cash">Main Cash (ক্যাশবক্স থেকে)</option>
                  <option value="bank">Bank / bKash</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">বিবরণ</label>
                <input
                  type="text"
                  placeholder="e.g. আগস্ট মাসের পূর্ণ বেতন"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg outline-none text-sm"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPayModalItem(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm"
                >
                  <Save size={16} />
                  <span>{loading ? "পরিশোধ হচ্ছে..." : "পরিশোধ সম্পন্ন করুন"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Single Payslip View */}
      {printItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-gray-900/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center print:hidden">
              <span className="font-bold text-sm">বেতন স্লিপ (Payslip)</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs font-bold flex items-center space-x-1"
                >
                  <Printer size={14} /> <span>প্রিন্ট</span>
                </button>
                <button
                  onClick={() => setPrintItem(null)}
                  className="p-1 text-gray-300 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6 text-gray-800">
              <div className="text-center border-b border-gray-200 pb-4">
                <h2 className="text-xl font-black text-slate-900">BOLAKA FACTORY</h2>
                <p className="text-xs text-gray-500">বেতন ও পারিশ্রমিক রসিদ (Salary Payslip)</p>
                <p className="text-xs font-bold text-emerald-700 mt-1">মাস: {selectedMonth}</p>
              </div>

              <div className="space-y-2 text-xs border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between">
                  <span className="text-gray-500">কর্মীর নাম:</span>
                  <span className="font-bold text-gray-900">{printItem.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">পদবি:</span>
                  <span className="font-medium text-gray-800">{printItem.designation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">যোগাযোগ:</span>
                  <span className="font-medium text-gray-800">{printItem.phone}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="text-gray-500">মূল বেতন:</span>
                  <span className="font-mono font-bold">৳ {printItem.basicSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>অনুপস্থিতি কর্তন:</span>
                  <span className="font-mono font-bold">- ৳ {printItem.deductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2 text-sm">
                  <span>পরিশোধিত মোট টাকা:</span>
                  <span className="font-mono text-emerald-700">৳ {printItem.netPayable.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-8 grid grid-cols-2 gap-4 text-center text-xs">
                <div className="border-t border-gray-400 pt-1 font-medium">কর্মীর স্বাক্ষর</div>
                <div className="border-t border-gray-400 pt-1 font-medium">ম্যানেজার / ওনার স্বাক্ষর</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
