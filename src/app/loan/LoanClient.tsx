"use client";

import { useState } from "react";
import { 
  CalendarClock, 
  Search, 
  ArrowDownToLine, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Save, 
  Clock, 
  BellRing,
  PhoneCall,
  MessageSquare,
  Copy,
  Building2
} from "lucide-react";
import { settleInvoiceDue, settleClientOpeningDue, recordTagadaReminder } from "@/actions/invoiceActions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PrintableInvoiceModal from "@/components/PrintableInvoiceModal";

export interface DueEntry {
  id: string;
  sourceType: "invoice" | "company_opening";
  rawInvoice?: any;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientAddress?: string | null;
  type: string; // "product_in" | "product_out" | "opening_due"
  date: Date | string;
  dueDate: Date | string | null;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
}

export default function LoanClient({
  initialInvoices,
  clients,
}: {
  initialInvoices: any[];
  clients: any[];
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "overdue">("all");
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<any | null>(null);

  // Tagada / Reminder Modal State
  const [tagadaModalOpen, setTagadaModalOpen] = useState(false);
  const [selectedEntryForTagada, setSelectedEntryForTagada] = useState<DueEntry | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSettleSection, setShowSettleSection] = useState(false);
  const [settleAmount, setSettleAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // Today calculation for overdue checks
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const threeDaysFromNow = new Date(now);
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

  // 1. Build unified due entries from invoices and company opening balances
  const invoiceEntries: DueEntry[] = (initialInvoices || [])
    .filter((inv) => (inv.totalAmount || 0) - (inv.paidAmount || 0) > 0)
    .map((inv) => ({
      id: inv.id,
      sourceType: "invoice" as const,
      rawInvoice: inv,
      clientId: inv.client?.id || inv.clientId,
      clientName: inv.client?.name || "গ্রাহক/সরবরাহকারী",
      clientPhone: inv.client?.phone || "",
      clientAddress: inv.client?.address,
      type: inv.type,
      date: inv.date,
      dueDate: inv.dueDate,
      totalAmount: inv.totalAmount,
      paidAmount: inv.paidAmount,
      dueAmount: Math.max(0, inv.totalAmount - inv.paidAmount),
    }));

  const companyOpeningEntries: DueEntry[] = (clients || [])
    .filter((c) => (c.openingBalance || 0) > 0)
    .map((c) => ({
      id: `company-${c.id}`,
      sourceType: "company_opening" as const,
      clientId: c.id,
      clientName: c.name,
      clientPhone: c.phone || "",
      clientAddress: c.address,
      type: "opening_due",
      date: c.createdAt || new Date(),
      dueDate: null,
      totalAmount: c.openingBalance,
      paidAmount: 0,
      dueAmount: c.openingBalance,
    }));

  const allDueEntries: DueEntry[] = [...invoiceEntries, ...companyOpeningEntries];

  // Calculate stats
  let totalDue = 0;
  let pendingCount = allDueEntries.length;
  let overdueCount = 0;

  allDueEntries.forEach((entry) => {
    totalDue += entry.dueAmount;
    if (entry.dueDate && new Date(entry.dueDate) < now) {
      overdueCount++;
    }
  });

  // Filter dues
  const filteredEntries = allDueEntries.filter((item) => {
    // Search filter
    const clientName = item.clientName.toLowerCase();
    const clientPhone = item.clientPhone;
    const matchesSearch = clientName.includes(searchTerm.toLowerCase()) || clientPhone.includes(searchTerm);
    if (!matchesSearch) return false;

    // Tab filter: only 'overdue' filters, 'all' shows all dues
    if (filterTab === "overdue") {
      return item.dueDate && new Date(item.dueDate) < now;
    }

    return true;
  });

  const handleOpenTagadaModal = (entry: DueEntry) => {
    setSelectedEntryForTagada(entry);
    setSettleAmount(entry.dueAmount.toString());
    setShowSettleSection(false);
    setCopied(false);
    setTagadaModalOpen(true);
  };

  const generateTagadaMessage = (item: DueEntry) => {
    if (item.sourceType === "company_opening") {
      return `আসসালামু আলাইকুম ${item.clientName}, বাংলা ইআরপি থেকে বকেয়া সংক্রান্ত তাগাদা: আপনার প্রতিষ্ঠানের পূর্বের হিসাব বাবদ অবশিষ্ট বকেয়া ৳${item.dueAmount.toLocaleString()} টাকা। অনুগ্রহপূর্বক দ্রুত বকেয়া পরিশোধের ব্যবস্থা করার বিনীত অনুরোধ রইলো। ধন্যবাদ।`;
    }
    const dueDateText = item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "শীঘ্রই";
    const invoiceShort = item.id.slice(-8);
    return `আসসালামু আলাইকুম ${item.clientName}, বাংলা ইআরপি থেকে বকেয়া সংক্রান্ত তাগাদা: আপনার চালান #${invoiceShort} বাবদ অবশিষ্ট বকেয়া ৳${item.dueAmount.toLocaleString()} টাকা। পরিশোধের নির্ধারিত তারিখ ছিল: ${dueDateText}। অনুগ্রহপূর্বক দ্রুত বকেয়া পরিশোধের ব্যবস্থা করার বিনীত অনুরোধ রইলো। ধন্যবাদ।`;
  };

  const handleSendWhatsApp = async (item: DueEntry) => {
    const phone = item.clientPhone || "";
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.startsWith("880") ? cleanPhone : `880${cleanPhone.replace(/^0/, "")}`;
    const message = generateTagadaMessage(item);

    // Record audit log
    await recordTagadaReminder({
      invoiceId: item.sourceType === "invoice" ? item.id : undefined,
      clientId: item.clientId,
      clientName: item.clientName,
      amount: item.dueAmount,
      channel: "WhatsApp",
      requestedBy: "owner",
    });

    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleRecordCall = async (item: DueEntry) => {
    await recordTagadaReminder({
      invoiceId: item.sourceType === "invoice" ? item.id : undefined,
      clientId: item.clientId,
      clientName: item.clientName,
      amount: item.dueAmount,
      channel: "Phone Call",
      requestedBy: "owner",
    });
  };

  const handleCopyMessage = (item: DueEntry) => {
    const message = generateTagadaMessage(item);
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSettleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEntryForTagada || !settleAmount || Number(settleAmount) <= 0) return;

    setLoading(true);
    let res;
    if (selectedEntryForTagada.sourceType === "company_opening") {
      res = await settleClientOpeningDue({
        clientId: selectedEntryForTagada.clientId,
        amount: Number(settleAmount),
        requestedBy: "owner",
      });
    } else {
      res = await settleInvoiceDue({
        invoiceId: selectedEntryForTagada.id,
        amount: Number(settleAmount),
        requestedBy: "owner",
      });
    }

    setLoading(false);
    if (res.success) {
      setTagadaModalOpen(false);
      setSelectedEntryForTagada(null);
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
              কোম্পানি ও কাস্টমারদের কাছে কত টাকা বাকি আছে, পরিশোধের প্রতিশ্রুত তারিখ ও সরাসরি তাগাদার তালিকা।
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* মোট বকেয়া হিসাব */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-6 shadow-md text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-amber-100 font-bold">মোট বকেয়া হিসাব</p>
              <CalendarClock size={22} className="text-amber-200" />
            </div>
            <p className="text-[10px] text-amber-200 uppercase mt-0.5">(Total Due Calculation)</p>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-bold">৳ {totalDue.toLocaleString()}</h2>
            <p className="text-xs text-amber-100 mt-1">ব্যবসায়ের মোট অপরিশোধিত বকেয়া টাকার পরিমাণ</p>
          </div>
        </div>

        {/* মোট বকেয়া এন্ট্রি */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <p className="font-bold text-gray-800">মোট বকেয়া তালিকা</p>
              <ArrowDownToLine size={20} className="text-gray-400" />
            </div>
            <p className="text-[10px] text-gray-400 uppercase mt-0.5">(Total Pending Dues)</p>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-bold text-gray-900">{pendingCount} টি এন্ট্রি</h2>
            <p className="text-xs text-gray-500 mt-1">যেসব কোম্পানি ও চালানের টাকা এখনও বাকি আছে</p>
          </div>
        </div>

        {/* তারিখ পার হওয়া বকেয়া */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <p className="font-bold text-gray-800">তারিখ পার হওয়া বকেয়া</p>
              <AlertCircle size={20} className="text-red-500" />
            </div>
            <p className="text-[10px] text-gray-400 uppercase mt-0.5">(Overdue Dues)</p>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-bold text-red-600">{overdueCount} টি</h2>
            <p className="text-xs text-gray-500 mt-1">প্রতিশ্রুত পরিশোধের তারিখ পেরিয়ে গেছে</p>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setFilterTab("all")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              filterTab === "all"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            সব বকেয়া ({allDueEntries.length})
          </button>
          <button
            onClick={() => setFilterTab("overdue")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              filterTab === "overdue"
                ? "bg-red-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            তারিখ পার হয়েছে ({overdueCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="কোম্পানি বা ফোন নম্বর দিয়ে খুঁজুন..."
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
                <th className="p-4 font-bold text-gray-700 w-12 text-center"># <span className="text-[10px] font-normal text-gray-400 block uppercase">(SL)</span></th>
                <th className="p-4 font-bold text-gray-700">প্রতিষ্ঠানের নাম <span className="text-[10px] font-normal text-gray-400 block uppercase">(Company Name)</span></th>
                <th className="p-4 font-bold text-gray-700">বকেয়ার ধরন <span className="text-[10px] font-normal text-gray-400 block uppercase">(Due Type)</span></th>
                <th className="p-4 font-bold text-gray-700">বাকি শুরুর তারিখ <span className="text-[10px] font-normal text-gray-400 block uppercase">(Due Start Date)</span></th>
                <th className="p-4 font-bold text-gray-700">পরিশোধের তারিখ <span className="text-[10px] font-normal text-gray-400 block uppercase">(Promised Payment Date)</span></th>
                <th className="p-4 font-bold text-gray-700 text-right">মোট বিল <span className="text-[10px] font-normal text-gray-400 block uppercase">(Total Bill)</span></th>
                <th className="p-4 font-bold text-gray-700 text-right">জমা <span className="text-[10px] font-normal text-gray-400 block uppercase">(Paid)</span></th>
                <th className="p-4 font-bold text-gray-700 text-right">বকেয়া টাকা <span className="text-[10px] font-normal text-gray-400 block uppercase">(Due Amount)</span></th>
                <th className="p-4 font-bold text-gray-700 text-center">অ্যাকশন <span className="text-[10px] font-normal text-gray-400 block uppercase">(Action)</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredEntries.map((item, index) => {
                const isOverdue = item.dueDate && new Date(item.dueDate) < now;
                const isDueSoon = item.dueDate && !isOverdue && new Date(item.dueDate) <= threeDaysFromNow;

                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    {/* Count / SL */}
                    <td className="p-4 text-center font-extrabold text-gray-400 text-xs">
                      {index + 1}
                    </td>

                    {/* Party */}
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-black shrink-0">
                          {index + 1}
                        </span>
                        <span className="font-bold text-gray-900">{item.clientName}</span>
                      </div>
                      <div className="text-xs text-gray-500 pl-7">{item.clientPhone || "ফোন নেই"}</div>
                    </td>

                    {/* Due Type */}
                    <td className="p-4">
                      {item.sourceType === "company_opening" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 rounded text-xs font-bold">
                          🏛️ পূর্বের বকেয়া
                        </span>
                      ) : item.type === "product_in" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-bold">
                          পণ্য ইন (Product In)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-bold">
                          পণ্য আউট (Product Out)
                        </span>
                      )}
                    </td>

                    {/* Start Date */}
                    <td className="p-4 font-medium text-gray-700">
                      {new Date(item.date).toLocaleDateString()}
                    </td>

                    {/* Due / Promised Date */}
                    <td className="p-4">
                      {item.dueDate ? (
                        <div>
                          <div className="font-bold text-gray-900 flex items-center space-x-1">
                            <Clock size={14} className="text-gray-400" />
                            <span>{new Date(item.dueDate).toLocaleDateString()}</span>
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
                      ৳ {item.totalAmount.toLocaleString()}
                    </td>

                    {/* Paid */}
                    <td className="p-4 text-right font-medium text-emerald-600">
                      ৳ {item.paidAmount.toLocaleString()}
                    </td>

                    {/* Due */}
                    <td className="p-4 text-right">
                      <span className="font-bold text-base text-red-600">
                        ৳ {item.dueAmount.toLocaleString()}
                      </span>
                    </td>

                    {/* Actions: Tagada (Reminder) button */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleOpenTagadaModal(item)}
                          className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 active:scale-95"
                          title="বকেয়া তাগাদা পাঠান"
                        >
                          <BellRing size={13} />
                          <span>তাগাদা</span>
                        </button>
                        {item.sourceType === "invoice" ? (
                          <button
                            onClick={() => setSelectedInvoiceForPrint(item.rawInvoice)}
                            className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                            title="চালান প্রিন্ট"
                          >
                            <Printer size={15} />
                          </button>
                        ) : (
                          <Link
                            href="/clients"
                            className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                            title="প্রতিষ্ঠান তালিকা দেখুন"
                          >
                            <Building2 size={15} />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-gray-400">
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

      {/* Tagada / Reminder Modal */}
      {tagadaModalOpen && selectedEntryForTagada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-100 bg-amber-600 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <BellRing size={20} className="text-amber-200" />
                <h3 className="font-bold text-base">বকেয়া তাগাদা ও রিমাইন্ডার (Due Reminder)</h3>
              </div>
              <button
                onClick={() => setTagadaModalOpen(false)}
                className="text-amber-100 hover:text-white p-1 rounded-lg hover:bg-amber-700/50 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Due Details Card */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-base text-gray-900">{selectedEntryForTagada.clientName}</h4>
                    <p className="text-xs text-gray-500 font-medium">{selectedEntryForTagada.clientPhone || "ফোন নম্বর নেই"}</p>
                  </div>
                  {selectedEntryForTagada.sourceType === "company_opening" ? (
                    <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded text-xs font-bold">
                      🏛️ পূর্বের বকেয়া
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded text-xs font-mono font-bold">
                      #{selectedEntryForTagada.id.slice(-8)}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-200/60 text-xs">
                  <div>
                    <span className="text-gray-500 block">বাকি শুরুর তারিখ:</span>
                    <span className="font-bold text-gray-800">{new Date(selectedEntryForTagada.date).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">পরিশোধের প্রতিশ্রুত তারিখ:</span>
                    <span className="font-bold text-gray-800">
                      {selectedEntryForTagada.dueDate ? new Date(selectedEntryForTagada.dueDate).toLocaleDateString() : "নির্ধারিত নেই"}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center border-t border-amber-200/60">
                  <span className="text-xs font-bold text-gray-700">বকেয়া টাকার পরিমাণ:</span>
                  <span className="text-xl font-bold text-red-600">
                    ৳ {selectedEntryForTagada.dueAmount.toLocaleString()}
                  </span>
                </div>

                {/* Overdue Alert Banner */}
                {selectedEntryForTagada.dueDate && new Date(selectedEntryForTagada.dueDate) < now && (
                  <div className="mt-2 bg-red-100 border border-red-300 text-red-800 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5">
                    <AlertCircle size={15} className="shrink-0 text-red-600" />
                    <span>⚠️ সতর্কবার্তা: নির্ধারিত পরিশোধের তারিখ পেরিয়ে গেছে!</span>
                  </div>
                )}
              </div>

              {/* Tagada Message Preview */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                  তাগাদা বার্তার খসড়া (Message Preview)
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-800 leading-relaxed font-medium">
                  {generateTagadaMessage(selectedEntryForTagada)}
                </div>
              </div>

              {/* Action Channels */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-600">তাগাদা পাঠানোর মাধ্যম বেছে নিন:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* WhatsApp */}
                  <button
                    type="button"
                    onClick={() => handleSendWhatsApp(selectedEntryForTagada)}
                    className="flex items-center justify-center space-x-2 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                  >
                    <MessageSquare size={16} />
                    <span>WhatsApp তাগাদা</span>
                  </button>

                  {/* Phone Call */}
                  <a
                    href={`tel:${selectedEntryForTagada.clientPhone || ""}`}
                    onClick={() => handleRecordCall(selectedEntryForTagada)}
                    className="flex items-center justify-center space-x-2 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 text-center"
                  >
                    <PhoneCall size={16} />
                    <span>সরাসরি কল দিন</span>
                  </a>

                  {/* Copy Message */}
                  <button
                    type="button"
                    onClick={() => handleCopyMessage(selectedEntryForTagada)}
                    className="flex items-center justify-center space-x-2 py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-all border border-gray-200 active:scale-95"
                  >
                    {copied ? <CheckCircle2 size={16} className="text-emerald-600" /> : <Copy size={16} />}
                    <span>{copied ? "কপি হয়েছে!" : "মেসেজ কপি"}</span>
                  </button>
                </div>
              </div>

              {/* Settlement Option */}
              <div className="pt-3 border-t border-gray-100">
                {!showSettleSection ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowSettleSection(true);
                      setSettleAmount(selectedEntryForTagada.dueAmount.toString());
                    }}
                    className="w-full py-2 text-center text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200"
                  >
                    + টাকা আদায় / পরিশোধের এন্ট্রি করতে চান?
                  </button>
                ) : (
                  <form onSubmit={handleSettleSubmit} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-800">পরিশোধের পরিমাণ লিখুন:</span>
                      <button
                        type="button"
                        onClick={() => setShowSettleSection(false)}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        বন্ধ করুন
                      </button>
                    </div>
                    <input
                      type="number"
                      value={settleAmount}
                      onChange={(e) => setSettleAmount(e.target.value)}
                      max={selectedEntryForTagada.dueAmount}
                      min={1}
                      className="w-full p-2.5 border border-gray-300 rounded-lg text-base font-bold text-gray-900 bg-white outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center space-x-1"
                      >
                        <Save size={14} />
                        <span>{loading ? "Saving..." : "পরিশোধ নিশ্চিত করুন"}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
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
