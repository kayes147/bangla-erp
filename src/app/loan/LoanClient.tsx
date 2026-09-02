"use client";

import { useState } from "react";
import { 
  CalendarClock, 
  Search, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Save, 
  Clock, 
  Filter 
} from "lucide-react";
import { settleInvoiceDue } from "@/actions/invoiceActions";
import { useRouter } from "next/navigation";
import PrintableInvoiceModal from "@/components/PrintableInvoiceModal";

export default function LoanClient({
  initialInvoices,
  clients,
}: {
  initialInvoices: any[];
  clients: any[];
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "product_in" | "product_out" | "overdue">("all");
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<any | null>(null);

  // Settle Due Modal State
  const [settleModalOpen, setSettleModalOpen] = useState(false);
  const [selectedInvoiceToSettle, setSelectedInvoiceToSettle] = useState<any | null>(null);
  const [settleAmount, setSettleAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // Today calculation for overdue checks
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const threeDaysFromNow = new Date(now);
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

  // Calculate stats
  let totalSupplierDue = 0; // We owe suppliers (Product In)
  let totalCustomerDue = 0; // Customers owe us (Product Out)
  let overdueCount = 0;

  initialInvoices.forEach((inv) => {
    const due = Math.max(0, inv.totalAmount - inv.paidAmount);
    if (inv.type === "product_in") {
      totalSupplierDue += due;
    } else {
      totalCustomerDue += due;
    }

    if (inv.dueDate && new Date(inv.dueDate) < now && due > 0) {
      overdueCount++;
    }
  });

  // Filter invoices
  const filteredInvoices = initialInvoices.filter((inv) => {
    const due = inv.totalAmount - inv.paidAmount;
    if (due <= 0) return false;

    // Search filter
    const clientName = inv.client?.name?.toLowerCase() || "";
    const clientPhone = inv.client?.phone || "";
    const matchesSearch = clientName.includes(searchTerm.toLowerCase()) || clientPhone.includes(searchTerm);
    if (!matchesSearch) return false;

    // Tab filter
    if (filterTab === "product_in") return inv.type === "product_in";
    if (filterTab === "product_out") return inv.type === "product_out";
    if (filterTab === "overdue") {
      return inv.dueDate && new Date(inv.dueDate) < now;
    }

    return true;
  });

  const handleOpenSettleModal = (inv: any) => {
    const due = inv.totalAmount - inv.paidAmount;
    setSelectedInvoiceToSettle(inv);
    setSettleAmount(due.toString());
    setSettleModalOpen(true);
  };

  const handleSettleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceToSettle || !settleAmount || Number(settleAmount) <= 0) return;

    setLoading(true);
    const res = await settleInvoiceDue({
      invoiceId: selectedInvoiceToSettle.id,
      amount: Number(settleAmount),
      requestedBy: "owner",
    });

    setLoading(false);
    if (res.success) {
      setSettleModalOpen(false);
      setSelectedInvoiceToSettle(null);
      setSettleAmount("");
      router.refresh();
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
            <CalendarClock size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              বকেয়ার হিসাব <span className="text-lg font-normal text-gray-500">(Business Due Management)</span>
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              ব্যবসার কার কার কাছে কত টাকা বাকি আছে এবং পরিশোধের প্রতিশ্রুত তারিখের তালিকা।
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 shadow-md text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-red-100 font-bold">মহাজনদের বকেয়া দেনা</p>
              <ArrowUpFromLine size={20} className="text-red-200" />
            </div>
            <p className="text-[10px] text-red-200 uppercase mt-0.5">(Total Due to Suppliers - Payables)</p>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-bold">৳ {totalSupplierDue.toLocaleString()}</h2>
            <p className="text-xs text-red-200 mt-1">পণ্য ক্রয়ের কারণে মহাজনদের বাকি দিতে হবে</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 shadow-md text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-emerald-100 font-bold">কাস্টমারদের বকেয়া পাওনা</p>
              <ArrowDownToLine size={20} className="text-emerald-200" />
            </div>
            <p className="text-[10px] text-emerald-200 uppercase mt-0.5">(Total Due from Customers - Receivables)</p>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-bold">৳ {totalCustomerDue.toLocaleString()}</h2>
            <p className="text-xs text-emerald-200 mt-1">পণ্য বিক্রির কারণে কাস্টমাররা জমা দেবে</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <p className="font-bold text-gray-800">তারিখ পার হওয়া বকেয়া</p>
              <AlertCircle size={20} className="text-amber-500" />
            </div>
            <p className="text-[10px] text-gray-400 uppercase mt-0.5">(Overdue Invoices)</p>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-bold text-amber-600">{overdueCount} টি চালান</h2>
            <p className="text-xs text-gray-500 mt-1">প্রতিশ্রুত তারিখ পেরিয়ে গেছে</p>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setFilterTab("all")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
              filterTab === "all"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            সব বকেয়া ({initialInvoices.filter(i => i.totalAmount > i.paidAmount).length})
          </button>
          <button
            onClick={() => setFilterTab("product_in")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
              filterTab === "product_in"
                ? "bg-red-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            মহাজনের বাকি দেনা (ক্রয়)
          </button>
          <button
            onClick={() => setFilterTab("product_out")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
              filterTab === "product_out"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            কাস্টমারের বাকি পাওনা (বিক্রি)
          </button>
          <button
            onClick={() => setFilterTab("overdue")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
              filterTab === "overdue"
                ? "bg-amber-700 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            তারিখ পার হয়েছে ({overdueCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="পার্টির নাম বা ফোন দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>
      </div>

      {/* Due Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-bold text-gray-700">পার্টি / মহাজন <span className="text-[10px] font-normal text-gray-400 block uppercase">(Party Name)</span></th>
                <th className="p-4 font-bold text-gray-700">চালানের ধরন <span className="text-[10px] font-normal text-gray-400 block uppercase">(Type)</span></th>
                <th className="p-4 font-bold text-gray-700">বাকি শুরুর তারিখ <span className="text-[10px] font-normal text-gray-400 block uppercase">(Due Start Date)</span></th>
                <th className="p-4 font-bold text-gray-700">পরিশোধের তারিখ <span className="text-[10px] font-normal text-gray-400 block uppercase">(Promised Payment Date)</span></th>
                <th className="p-4 font-bold text-gray-700 text-right">মোট বিল <span className="text-[10px] font-normal text-gray-400 block uppercase">(Total Bill)</span></th>
                <th className="p-4 font-bold text-gray-700 text-right">জমা <span className="text-[10px] font-normal text-gray-400 block uppercase">(Paid)</span></th>
                <th className="p-4 font-bold text-gray-700 text-right">বকেয়া টাকা <span className="text-[10px] font-normal text-gray-400 block uppercase">(Due Amount)</span></th>
                <th className="p-4 font-bold text-gray-700 text-center">অ্যাকশন <span className="text-[10px] font-normal text-gray-400 block uppercase">(Action)</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredInvoices.map((inv) => {
                const due = inv.totalAmount - inv.paidAmount;
                const isOverdue = inv.dueDate && new Date(inv.dueDate) < now;
                const isDueSoon = inv.dueDate && !isOverdue && new Date(inv.dueDate) <= threeDaysFromNow;

                return (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                    {/* Party */}
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{inv.client?.name}</div>
                      <div className="text-xs text-gray-500">{inv.client?.phone}</div>
                    </td>

                    {/* Invoice Type */}
                    <td className="p-4">
                      {inv.type === "product_in" ? (
                        <span className="inline-flex items-center px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded text-xs font-bold">
                          মহাজনের পাওনা (ক্রয়)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-bold">
                          কাস্টমারের দেনা (বিক্রি)
                        </span>
                      )}
                    </td>

                    {/* Start Date */}
                    <td className="p-4 font-medium text-gray-700">
                      {new Date(inv.date).toLocaleDateString()}
                    </td>

                    {/* Due / Promised Date */}
                    <td className="p-4">
                      {inv.dueDate ? (
                        <div>
                          <div className="font-bold text-gray-900 flex items-center space-x-1">
                            <Clock size={14} className="text-gray-400" />
                            <span>{new Date(inv.dueDate).toLocaleDateString()}</span>
                          </div>
                          {isOverdue && (
                            <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-red-100 text-red-700 font-bold text-[10px] rounded">
                              ⚠️ তারিখ পার হয়েছে
                            </span>
                          )}
                          {isDueSoon && (
                            <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-amber-100 text-amber-800 font-bold text-[10px] rounded">
                              ⏰ আসন্ন পরিশোধ
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">তারিখ নির্ধারিত নেই</span>
                      )}
                    </td>

                    {/* Total */}
                    <td className="p-4 text-right font-medium text-gray-700">
                      ৳ {inv.totalAmount.toLocaleString()}
                    </td>

                    {/* Paid */}
                    <td className="p-4 text-right font-medium text-emerald-600">
                      ৳ {inv.paidAmount.toLocaleString()}
                    </td>

                    {/* Due */}
                    <td className="p-4 text-right">
                      <span className="font-bold text-base text-red-600">
                        ৳ {due.toLocaleString()}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleOpenSettleModal(inv)}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                        >
                          {inv.type === "product_in" ? "পরিশোধ করুন" : "টাকা জমা নিন"}
                        </button>
                        <button
                          onClick={() => setSelectedInvoiceForPrint(inv)}
                          className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                          title="চালান প্রিন্ট"
                        >
                          <Printer size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-gray-400">
                    <CheckCircle2 size={36} className="mx-auto mb-2 text-emerald-400 opacity-80" />
                    <p className="font-bold text-gray-600">কোনো বকেয়া পাওয়া যায়নি!</p>
                    <p className="text-xs text-gray-400 mt-1">সব বকেয়া পরিশোধিত অথবা সার্চের সাথে মেলেনি।</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Settle Due Modal */}
      {settleModalOpen && selectedInvoiceToSettle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">
                {selectedInvoiceToSettle.type === "product_in" 
                  ? "মহাজনকে বকেয়া পরিশোধ করুন" 
                  : "কাস্টমারের কাছ থেকে বকেয়া আদায় করুন"}
              </h3>
              <button
                onClick={() => setSettleModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSettleSubmit} className="p-6 space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs space-y-1 text-amber-900">
                <p><span className="font-bold">পার্টি:</span> {selectedInvoiceToSettle.client?.name}</p>
                <p><span className="font-bold">চালানের মোট টাকা:</span> ৳ {selectedInvoiceToSettle.totalAmount.toLocaleString()}</p>
                <p><span className="font-bold">বর্তমান বকেয়া:</span> <span className="text-red-600 font-bold">৳ {(selectedInvoiceToSettle.totalAmount - selectedInvoiceToSettle.paidAmount).toLocaleString()}</span></p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  পরিশোধ / জমার পরিমাণ <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={settleAmount}
                  onChange={(e) => setSettleAmount(e.target.value)}
                  max={selectedInvoiceToSettle.totalAmount - selectedInvoiceToSettle.paidAmount}
                  min={1}
                  className="w-full p-3 border border-gray-300 rounded-lg text-lg font-bold text-gray-900 outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  টাকা পরিশোধ করলে মূল ক্যাশ ও পার্টির বাকি খাতা স্বয়ংক্রিয়ভাবে আপডেট হবে।
                </p>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSettleModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-bold text-sm hover:bg-gray-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-sm transition-colors flex items-center space-x-1 shadow-sm"
                >
                  <Save size={16} />
                  <span>{loading ? "Saving..." : "নিশ্চিত করুন"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Print Modal */}
      <PrintableInvoiceModal
        isOpen={Boolean(selectedInvoiceForPrint)}
        invoice={selectedInvoiceForPrint}
        onClose={() => setSelectedInvoiceForPrint(null)}
      />
    </div>
  );
}
