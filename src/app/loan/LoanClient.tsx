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
  BellRing,
  PhoneCall,
  MessageSquare,
  Copy
} from "lucide-react";
import { settleInvoiceDue, recordTagadaReminder } from "@/actions/invoiceActions";
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
  const [filterTab, setFilterTab] = useState<"all" | "overdue">("all");
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<any | null>(null);

  // Tagada / Reminder Modal State
  const [tagadaModalOpen, setTagadaModalOpen] = useState(false);
  const [selectedInvoiceForTagada, setSelectedInvoiceForTagada] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSettleSection, setShowSettleSection] = useState(false);
  const [settleAmount, setSettleAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // Today calculation for overdue checks
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const threeDaysFromNow = new Date(now);
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

  // Calculate stats
  let totalDue = 0;
  let pendingCount = 0;
  let overdueCount = 0;

  initialInvoices.forEach((inv) => {
    const due = Math.max(0, inv.totalAmount - inv.paidAmount);
    if (due > 0) {
      totalDue += due;
      pendingCount++;
      if (inv.dueDate && new Date(inv.dueDate) < now) {
        overdueCount++;
      }
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

    // Tab filter: only 'overdue' filters, 'all' shows all dues
    if (filterTab === "overdue") {
      return inv.dueDate && new Date(inv.dueDate) < now;
    }

    return true;
  });

  const handleOpenTagadaModal = (inv: any) => {
    const due = inv.totalAmount - inv.paidAmount;
    setSelectedInvoiceForTagada(inv);
    setSettleAmount(due.toString());
    setShowSettleSection(false);
    setCopied(false);
    setTagadaModalOpen(true);
  };

  const generateTagadaMessage = (inv: any) => {
    const due = inv.totalAmount - inv.paidAmount;
    const dueDateText = inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "শীঘ্রই";
    const partyName = inv.client?.name || "সম্মানিত গ্রাহক/প্রতিষ্ঠান";
    const invoiceShort = inv.id.slice(-8);

    return `আসসালামু আলাইকুম ${partyName}, বাংলা ইআরপি থেকে বকেয়া সংক্রান্ত তাগাদা: আপনার চালান #${invoiceShort} বাবদ অবশিষ্ট বকেয়া ৳${due.toLocaleString()} টাকা। পরিশোধের নির্ধারিত তারিখ ছিল: ${dueDateText}। অনুগ্রহপূর্বক দ্রুত বকেয়া পরিশোধের ব্যবস্থা করার বিনীত অনুরোধ রইলো। ধন্যবাদ।`;
  };

  const handleSendWhatsApp = async (inv: any) => {
    const phone = inv.client?.phone || "";
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.startsWith("880") ? cleanPhone : `880${cleanPhone.replace(/^0/, "")}`;
    const message = generateTagadaMessage(inv);

    // Record audit log
    await recordTagadaReminder({
      invoiceId: inv.id,
      clientName: inv.client?.name || "Client",
      amount: inv.totalAmount - inv.paidAmount,
      channel: "WhatsApp",
      requestedBy: "owner",
    });

    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleRecordCall = async (inv: any) => {
    await recordTagadaReminder({
      invoiceId: inv.id,
      clientName: inv.client?.name || "Client",
      amount: inv.totalAmount - inv.paidAmount,
      channel: "Phone Call",
      requestedBy: "owner",
    });
  };

  const handleCopyMessage = (inv: any) => {
    const message = generateTagadaMessage(inv);
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSettleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceForTagada || !settleAmount || Number(settleAmount) <= 0) return;

    setLoading(true);
    const res = await settleInvoiceDue({
      invoiceId: selectedInvoiceForTagada.id,
      amount: Number(settleAmount),
      requestedBy: "owner",
    });

    setLoading(false);
    if (res.success) {
      setTagadaModalOpen(false);
      setSelectedInvoiceForTagada(null);
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
              ব্যবসার কার কার কাছে কত টাকা বাকি আছে এবং পরিশোধের প্রতিশ্রুত তারিখ ও তাগাদার তালিকা।
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

        {/* মোট বকেয়া চালান */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <p className="font-bold text-gray-800">মোট বকেয়া চালান</p>
              <ArrowDownToLine size={20} className="text-gray-400" />
            </div>
            <p className="text-[10px] text-gray-400 uppercase mt-0.5">(Total Pending Invoices)</p>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-bold text-gray-900">{pendingCount} টি চালান</h2>
            <p className="text-xs text-gray-500 mt-1">যেসব চালানের টাকা এখনও বাকি আছে</p>
          </div>
        </div>

        {/* তারিখ পার হওয়া বকেয়া */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <p className="font-bold text-gray-800">তারিখ পার হওয়া বকেয়া</p>
              <AlertCircle size={20} className="text-red-500" />
            </div>
            <p className="text-[10px] text-gray-400 uppercase mt-0.5">(Overdue Invoices)</p>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-bold text-red-600">{overdueCount} টি চালান</h2>
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
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              filterTab === "all"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            সব বকেয়া ({initialInvoices.filter(i => i.totalAmount > i.paidAmount).length})
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
                <th className="p-4 font-bold text-gray-700">পার্টির নাম <span className="text-[10px] font-normal text-gray-400 block uppercase">(Party Name)</span></th>
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
                      <div className="text-xs text-gray-500">{inv.client?.phone || "ফোন নেই"}</div>
                    </td>

                    {/* Invoice Type */}
                    <td className="p-4">
                      {inv.type === "product_in" ? (
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

                    {/* Actions: Tagada (Reminder) button */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleOpenTagadaModal(inv)}
                          className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 active:scale-95"
                          title="বকেয়া তাগাদা পাঠান"
                        >
                          <BellRing size={13} />
                          <span>তাগাদা</span>
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

      {/* Tagada / Reminder Modal */}
      {tagadaModalOpen && selectedInvoiceForTagada && (
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
                    <h4 className="font-bold text-base text-gray-900">{selectedInvoiceForTagada.client?.name}</h4>
                    <p className="text-xs text-gray-500 font-medium">{selectedInvoiceForTagada.client?.phone || "ফোন নম্বর নেই"}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded text-xs font-mono font-bold">
                    #{selectedInvoiceForTagada.id.slice(-8)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-200/60 text-xs">
                  <div>
                    <span className="text-gray-500 block">বাকি শুরুর তারিখ:</span>
                    <span className="font-bold text-gray-800">{new Date(selectedInvoiceForTagada.date).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">পরিশোধের প্রতিশ্রুত তারিখ:</span>
                    <span className="font-bold text-gray-800">
                      {selectedInvoiceForTagada.dueDate ? new Date(selectedInvoiceForTagada.dueDate).toLocaleDateString() : "নির্ধারিত নেই"}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center border-t border-amber-200/60">
                  <span className="text-xs font-bold text-gray-700">বকেয়া টাকার পরিমাণ:</span>
                  <span className="text-xl font-bold text-red-600">
                    ৳ {(selectedInvoiceForTagada.totalAmount - selectedInvoiceForTagada.paidAmount).toLocaleString()}
                  </span>
                </div>

                {/* Overdue Alert Banner */}
                {selectedInvoiceForTagada.dueDate && new Date(selectedInvoiceForTagada.dueDate) < now && (
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
                  {generateTagadaMessage(selectedInvoiceForTagada)}
                </div>
              </div>

              {/* Action Channels */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-600">তাগাদা পাঠানোর মাধ্যম বেছে নিন:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* WhatsApp */}
                  <button
                    type="button"
                    onClick={() => handleSendWhatsApp(selectedInvoiceForTagada)}
                    className="flex items-center justify-center space-x-2 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                  >
                    <MessageSquare size={16} />
                    <span>WhatsApp তাগাদা</span>
                  </button>

                  {/* Phone Call */}
                  <a
                    href={`tel:${selectedInvoiceForTagada.client?.phone || ""}`}
                    onClick={() => handleRecordCall(selectedInvoiceForTagada)}
                    className="flex items-center justify-center space-x-2 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 text-center"
                  >
                    <PhoneCall size={16} />
                    <span>সরাসরি কল দিন</span>
                  </a>

                  {/* Copy Message */}
                  <button
                    type="button"
                    onClick={() => handleCopyMessage(selectedInvoiceForTagada)}
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
                      setSettleAmount((selectedInvoiceForTagada.totalAmount - selectedInvoiceForTagada.paidAmount).toString());
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
                      max={selectedInvoiceForTagada.totalAmount - selectedInvoiceForTagada.paidAmount}
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
