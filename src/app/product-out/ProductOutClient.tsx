"use client";
import { useState } from "react";
import { PackageMinus, Search, Save, CalendarDays, Printer, FileEdit, Plus, Trash2, Check, Sparkles } from "lucide-react";
import { createInvoice } from "@/actions/invoiceActions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PrintableInvoiceModal from "@/components/PrintableInvoiceModal";
import CorrectionRequestModal from "@/components/CorrectionRequestModal";

const PRESET_PRODUCTS = [
  "MDF",
  "Supper-A",
  "Supper-B",
  "Akij-A",
  "Akij-B",
  "Maya-A",
  "Maya-B",
  "Woodland-A",
  "Woodland-B",
  "Gupta-A",
  "Gupta-B",
];

interface InvoiceItemRow {
  id: string;
  productName: string;
  quantity: string;
  pricePerUnit: string;
}

export default function ProductOutClient({ initialInvoices, clients, userRole }: { initialInvoices: any[], clients: any[], userRole: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [clientId, setClientId] = useState("");
  const [items, setItems] = useState<InvoiceItemRow[]>([
    { id: "1", productName: "MDF", quantity: "", pricePerUnit: "" }
  ]);
  const [masterPrice, setMasterPrice] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "mobile_banking" | "bank">("cash");
  const [dueDate, setDueDate] = useState("");
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<any | null>(null);
  const [correctionInvoiceId, setCorrectionInvoiceId] = useState<string | null>(null);

  // Apply master price to all existing items
  const handleApplyMasterPrice = (val: string) => {
    setMasterPrice(val);
    setItems((prev) =>
      prev.map((it) => ({
        ...it,
        pricePerUnit: val,
      }))
    );
  };

  // Toggle or add a preset product into items list
  const handleToggleOrAddPreset = (pName: string) => {
    const existingIndex = items.findIndex(
      (it) => it.productName.trim().toLowerCase() === pName.toLowerCase()
    );

    if (existingIndex !== -1) {
      // Focus existing item's quantity input
      const existingId = items[existingIndex].id;
      const el = document.getElementById(`qty-input-${existingId}`) as HTMLInputElement;
      el?.focus();
      el?.select();
      return;
    }

    // If only 1 item exists and it's completely empty, replace its name
    if (items.length === 1 && !items[0].productName.trim() && !items[0].quantity && !items[0].pricePerUnit) {
      setItems([{ ...items[0], productName: pName, pricePerUnit: masterPrice || items[0].pricePerUnit }]);
      setTimeout(() => {
        const el = document.getElementById(`qty-input-${items[0].id}`) as HTMLInputElement;
        el?.focus();
      }, 50);
      return;
    }

    // Append new item
    const newId = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setItems((prev) => [
      ...prev,
      { id: newId, productName: pName, quantity: "", pricePerUnit: masterPrice || "" },
    ]);
    setTimeout(() => {
      const el = document.getElementById(`qty-input-${newId}`) as HTMLInputElement;
      el?.focus();
    }, 50);
  };

  const handleUpdateItem = (
    id: string,
    field: "productName" | "quantity" | "pricePerUnit",
    value: string
  ) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    );
  };

  const handleAddItem = () => {
    const newId = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setItems((prev) => [
      ...prev,
      { id: newId, productName: "", quantity: "", pricePerUnit: masterPrice || "" },
    ]);
    setTimeout(() => {
      const el = document.getElementById(`name-input-${newId}`) as HTMLInputElement;
      el?.focus();
    }, 50);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      setItems([{ id: Date.now().toString(), productName: "", quantity: "", pricePerUnit: "" }]);
      return;
    }
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Main Total Calculations
  const totalQuantity = items.reduce(
    (sum, it) => sum + (parseInt(it.quantity) || 0),
    0
  );
  const totalAmount = items.reduce(
    (sum, it) =>
      sum + (parseInt(it.quantity) || 0) * (parseFloat(it.pricePerUnit) || 0),
    0
  );
  const calculatedPaid = parseFloat(paidAmount) || 0;
  const dueAmount = Math.max(0, totalAmount - calculatedPaid);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      alert("অনুগ্রহ করে প্রতিষ্ঠান নির্বাচন করুন!");
      return;
    }

    const validItems = items.filter(
      (it) => it.productName.trim() && (parseInt(it.quantity) || 0) > 0
    );

    if (validItems.length === 0) {
      alert("অনুগ্রহ করে অন্তত একটি পণ্যের নাম ও পরিমাণ দিন!");
      return;
    }

    for (const it of validItems) {
      if (!it.pricePerUnit || parseFloat(it.pricePerUnit) < 0) {
        alert(`"${it.productName}" পণ্যের বিক্রি দর দিন!`);
        return;
      }
    }

    setLoading(true);
    const status = userRole === "owner" ? "APPROVED" : "PENDING";
    
    const res = await createInvoice({
      type: "product_out",
      clientId,
      items: validItems.map((it) => ({
        productName: it.productName.trim(),
        quantity: parseInt(it.quantity),
        pricePerUnit: parseFloat(it.pricePerUnit),
      })),
      paidAmount: calculatedPaid,
      requestedBy: userRole,
      status,
      dueDate: dueAmount > 0 && dueDate ? dueDate : undefined,
      paymentMethod: calculatedPaid > 0 ? paymentMethod : undefined,
    });

    setLoading(false);
    if (res.success) {
      setItems([{ id: Date.now().toString(), productName: "MDF", quantity: "", pricePerUnit: "" }]);
      setMasterPrice("");
      setPaidAmount("");
      setPaymentMethod("cash");
      setDueDate("");
      router.refresh();
    } else {
      alert("Error: " + res.error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pt-4 pb-24">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <PackageMinus size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-800">পণ্য আউট <span className="text-lg font-normal text-gray-500">(Product Out / Sales)</span></h1>
          <p className="text-xs text-gray-500 mt-0.5">একই চালানে একাধিক পণ্য সিলেক্ট ও অটোমেটিক মোট হিসাব</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 relative">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Customer / Client */}
          <div className="max-w-md">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-gray-700">
                প্রতিষ্ঠান <span className="text-[10px] font-normal text-gray-400 uppercase">(Company / Customer)</span> <span className="text-red-500">*</span>
              </label>
              <Link href="/clients/new" className="text-xs font-bold text-blue-600 hover:underline">
                + নতুন প্রতিষ্ঠান
              </Link>
            </div>
            <select 
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full p-3 border text-gray-900 placeholder-gray-400 border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold bg-white"
              required
            >
              <option value="">প্রতিষ্ঠান নির্বাচন করুন...</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.phone ? `(${c.phone})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Preset Buttons Bar (11 Products) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} className="text-blue-600" />
                  দ্রুত পণ্য নির্বাচন (Quick Select)
                </span>
                <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                  (বাটনে ক্লিক করলে নিচে সেই পণ্যের জন্য আলাদা পরিমাণ অপশন অন হবে)
                </span>
              </div>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md self-start sm:self-auto">
                সিলেক্টেড আইটেম: {items.filter(i => i.productName.trim()).length} টি
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {PRESET_PRODUCTS.map((p) => {
                const matched = items.find(
                  (it) => it.productName.trim().toLowerCase() === p.toLowerCase()
                );
                const isSelected = Boolean(matched);
                const qty = matched ? parseInt(matched.quantity) || 0 : 0;

                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleToggleOrAddPreset(p)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none active:scale-95 shadow-2xs ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-xs ring-2 ring-blue-400 font-extrabold"
                        : "bg-white border border-slate-300 text-slate-700 hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50/60"
                    }`}
                  >
                    {isSelected ? <Check size={13} className="text-white" /> : <Plus size={13} className="text-slate-400" />}
                    <span>{p}</span>
                    {isSelected && qty > 0 && (
                      <span className="ml-0.5 px-1.5 py-0.2 bg-blue-800/70 rounded-full text-[10px] text-white font-mono">
                        {qty} টি
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Multi-Item Table */}
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-200">
              <div>
                <label className="block text-sm font-black text-gray-800">
                  চালানের পণ্য তালিকা ও পরিমাণ (Invoice Products & Quantity) <span className="text-red-500">*</span>
                </label>
                <p className="text-[11px] text-gray-500">
                  নিচে প্রতি পণ্যের পরিমাণ লিখুন এবং দর আলাদা বা একবারে নির্ধারণ করুন
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Master Rate per piece Section */}
                <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 px-3 py-1.5 rounded-xl shadow-2xs">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1 select-none whitespace-nowrap">
                    🎯 সব পণ্যের এক দর (Master Rate):
                  </span>
                  <div className="relative flex items-center">
                    <span className="absolute left-2.5 text-xs font-bold text-gray-400">৳</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={masterPrice}
                      onChange={(e) => handleApplyMasterPrice(e.target.value)}
                      placeholder="একক দর"
                      className="w-24 sm:w-28 pl-6 pr-2 py-1 text-xs sm:text-sm font-bold border border-amber-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 font-mono text-gray-950 shadow-2xs"
                      title="এখানে একক দর লিখলে নিচের সবগুলো পণ্যের দর একসাথে স্বয়ংক্রিয়ভাবে বসে যাবে"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-xs font-bold text-blue-700 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-300 transition-colors shadow-2xs"
                >
                  <Plus size={13} />
                  <span>+ অন্য পণ্য যোগ করুন</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-2xs">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="p-3 w-10 text-center">#</th>
                    <th className="p-3 min-w-[170px]">পণ্যের নাম (Product Name)</th>
                    <th className="p-3 w-36">পরিমাণ (Quantity) <span className="text-red-400">*</span></th>
                    <th className="p-3 w-40">
                      <div className="flex flex-col">
                        <span>বিক্রি দর / প্রতি একক (৳) <span className="text-red-400">*</span></span>
                        {masterPrice ? (
                          <span className="text-[10px] text-amber-300 font-mono font-normal">
                            (এক দর: ৳ {masterPrice})
                          </span>
                        ) : null}
                      </div>
                    </th>
                    <th className="p-3 w-36 text-right">মোট টাকা (৳)</th>
                    <th className="p-3 w-12 text-center">মুছুন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {items.map((item, index) => {
                    const rowQty = parseInt(item.quantity) || 0;
                    const rowPrice = parseFloat(item.pricePerUnit) || 0;
                    const rowTotal = rowQty * rowPrice;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3 text-center font-bold text-gray-400">
                          {index + 1}
                        </td>
                        <td className="p-2.5">
                          <input
                            id={`name-input-${item.id}`}
                            type="text"
                            value={item.productName}
                            onChange={(e) => handleUpdateItem(item.id, "productName", e.target.value)}
                            placeholder="যেমন: MDF"
                            className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-900 bg-white text-xs sm:text-sm"
                            required
                          />
                        </td>
                        <td className="p-2.5">
                          <input
                            id={`qty-input-${item.id}`}
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateItem(item.id, "quantity", e.target.value)}
                            placeholder="0 টি"
                            className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-950 bg-white text-xs sm:text-sm font-mono"
                            required
                          />
                        </td>
                        <td className="p-2.5">
                          <input
                            id={`price-input-${item.id}`}
                            type="number"
                            min="0"
                            step="any"
                            value={item.pricePerUnit}
                            onChange={(e) => handleUpdateItem(item.id, "pricePerUnit", e.target.value)}
                            placeholder="৳ 0.00"
                            className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-950 bg-white text-xs sm:text-sm font-mono"
                            required
                          />
                        </td>
                        <td className="p-3 text-right font-bold text-blue-700 font-mono text-sm">
                          ৳ {rowTotal.toLocaleString()}
                        </td>
                        <td className="p-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* MAIN AUTOMATIC TOTALS SUMMARY CARD */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-gradient-to-r from-blue-50 via-indigo-50/60 to-blue-50 border border-blue-200 rounded-2xl shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm text-2xl font-bold">
                📦
              </div>
              <div>
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block">
                  সর্বমোট পণ্যের পরিমাণ (Total Quantity)
                </span>
                <p className="text-2xl sm:text-3xl font-black text-blue-950 font-mono">
                  {totalQuantity} <span className="text-sm font-bold text-blue-700">টি</span>
                </p>
                <p className="text-[11px] text-blue-700 font-medium">
                  (সবগুলো পণ্যের পরিমাণ স্বয়ংক্রিয়ভাবে মোট হয়েছে)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 sm:border-l sm:border-blue-200 sm:pl-6">
              <div className="w-13 h-13 rounded-2xl bg-blue-800 text-white flex items-center justify-center shrink-0 shadow-sm text-2xl font-bold">
                💰
              </div>
              <div>
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block">
                  সর্বমোট ইনভয়েস মূল্য (Total Amount)
                </span>
                <p className="text-2xl sm:text-3xl font-black text-blue-950 font-mono">
                  ৳ {totalAmount.toLocaleString()}
                </p>
                <p className="text-[11px] text-blue-700 font-medium">
                  {items.filter(i => (parseInt(i.quantity) || 0) > 0).length} টি পণ্যের সম্মিলিত দর ও মোট মূল্য
                </p>
              </div>
            </div>
          </div>

          {/* Paid Amount */}
          <div className="max-w-md">
            <label className="block text-sm font-bold text-gray-700 mb-1">
              প্রতিষ্ঠান জমা দিয়েছে <span className="text-[10px] font-normal text-gray-400 uppercase">(Paid Amount)</span>
            </label>
            <input 
              type="number" 
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              placeholder="৳ 0.00" 
              className="w-full p-3 border text-gray-900 placeholder-gray-400 border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" 
            />
          </div>

          {/* Payment Method Selector (Only when calculatedPaid > 0) */}
          {calculatedPaid > 0 && (
            <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 space-y-2 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block">
                    টাকা পরিশোধের মাধ্যম (Payment Method) <span className="text-red-500">*</span>
                  </span>
                  <span className="text-xs text-blue-700">
                    জমা দেওয়া ৳ {calculatedPaid.toLocaleString()} টাকা কীভাবে গৃহীত হয়েছে তা বেছে নিন
                  </span>
                </div>
                <span className="self-start sm:self-auto px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-md border border-blue-300">
                  জমা: ৳ {calculatedPaid.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <label 
                  onClick={() => setPaymentMethod("cash")}
                  className={`flex items-center space-x-2.5 p-3 border rounded-xl cursor-pointer transition-all ${
                    paymentMethod === "cash" 
                      ? "border-blue-500 bg-white text-blue-950 ring-2 ring-blue-300 font-bold shadow-xs" 
                      : "border-gray-200 bg-white/70 text-gray-700 hover:bg-white font-medium"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === "cash"}
                    onChange={() => setPaymentMethod("cash")}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm block">💵 নগদ ক্যাশ</span>
                    <span className="text-[10px] text-gray-500 block font-normal">ক্যাশবক্সে জমা</span>
                  </div>
                </label>

                <label 
                  onClick={() => setPaymentMethod("mobile_banking")}
                  className={`flex items-center space-x-2.5 p-3 border rounded-xl cursor-pointer transition-all ${
                    paymentMethod === "mobile_banking" 
                      ? "border-purple-500 bg-white text-purple-950 ring-2 ring-purple-300 font-bold shadow-xs" 
                      : "border-gray-200 bg-white/70 text-gray-700 hover:bg-white font-medium"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === "mobile_banking"}
                    onChange={() => setPaymentMethod("mobile_banking")}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <div>
                    <span className="text-sm block">📱 মোবাইল ব্যাংকিং</span>
                    <span className="text-[10px] text-gray-500 block font-normal">বিকাশ / নগদ / রকেট</span>
                  </div>
                </label>

                <label 
                  onClick={() => setPaymentMethod("bank")}
                  className={`flex items-center space-x-2.5 p-3 border rounded-xl cursor-pointer transition-all ${
                    paymentMethod === "bank" 
                      ? "border-indigo-500 bg-white text-indigo-950 ring-2 ring-indigo-300 font-bold shadow-xs" 
                      : "border-gray-200 bg-white/70 text-gray-700 hover:bg-white font-medium"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === "bank"}
                    onChange={() => setPaymentMethod("bank")}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-sm block">🏦 সরাসরি ব্যাংক</span>
                    <span className="text-[10px] text-gray-500 block font-normal">ব্যাংক ট্রান্সফার / চেক</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Due Info & Payment Due Date Field (Only if there is due) */}
          {dueAmount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                  বকেয়া হিসাব (Due Amount)
                </span>
                <span className="text-2xl font-bold text-amber-900">
                  ৳ {dueAmount.toLocaleString()}
                </span>
                <span className="text-xs text-amber-700 block mt-0.5">
                  প্রতিষ্ঠান থেকে এই বাকি টাকা পরবর্তীতে আদায় করা হবে।
                </span>
              </div>
              <div className="w-full sm:w-80">
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  বকেয়া আদায়ের সম্ভাব্য তারিখ (ঐচ্ছিক)
                  <span className="text-[10px] font-normal text-gray-500 block uppercase">(Promised Collection Date)</span>
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2.5 border border-amber-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-900 bg-white"
                />
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <button type="submit" disabled={loading} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-lg transition-colors shadow-sm cursor-pointer active:scale-98">
              <Save size={20} />
              <span>{loading ? "Saving..." : "ইনভয়েস তৈরি করুন (Create Invoice)"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* History List Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative z-10">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="font-bold text-gray-800">পণ্য আউট তালিকা <span className="text-xs font-normal text-gray-500">(Product Out History)</span></h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="p-4 font-bold text-gray-700">তারিখ <span className="text-[10px] font-normal text-gray-400 block uppercase">(Date)</span></th>
                <th className="p-4 font-bold text-gray-700">প্রতিষ্ঠান <span className="text-[10px] font-normal text-gray-400 block uppercase">(Company)</span></th>
                <th className="p-4 font-bold text-gray-700">পণ্যের নাম <span className="text-[10px] font-normal text-gray-400 block uppercase">(Product Name)</span></th>
                <th className="p-4 font-bold text-gray-700 text-center">পরিমাণ <span className="text-[10px] font-normal text-gray-400 block uppercase">(Qty)</span></th>
                <th className="p-4 font-bold text-gray-700 text-right">মোট টাকা <span className="text-[10px] font-normal text-gray-400 block uppercase">(Total)</span></th>
                <th className="p-4 font-bold text-gray-700 text-right">স্ট্যাটাস <span className="text-[10px] font-normal text-gray-400 block uppercase">(Status)</span></th>
                <th className="p-4 font-bold text-gray-700 text-right">অ্যাকশন <span className="text-[10px] font-normal text-gray-400 block uppercase">(Action)</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {initialInvoices.map((inv) => (
                <tr key={inv.id} className={`hover:bg-gray-50 transition-colors ${inv.status === 'PENDING' ? 'bg-orange-50/40' : ''}`}>
                  <td className="p-4 text-gray-500 font-medium">
                    {new Date(inv.date).toLocaleDateString()}
                    {inv.status === 'PENDING' && <span className="block text-[10px] text-orange-600 font-bold">New Request</span>}
                  </td>
                  <td className="p-4 font-bold text-gray-800">{inv.client.name}</td>
                  <td className="p-4 font-medium text-gray-800">
                    {inv.items.map((item: any) => item.product.name).join(", ")}
                  </td>
                  <td className="p-4 text-center font-bold text-gray-800">
                    {inv.items.reduce((acc: number, curr: any) => acc + curr.quantity, 0)}
                  </td>
                  <td className="p-4 text-right font-bold text-blue-600">৳ {inv.totalAmount.toLocaleString()}</td>
                  <td className="p-4 text-right">
                    {inv.status === 'APPROVED' ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Approved</span>
                    ) : (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-bold">Pending</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedInvoiceForPrint(inv)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors inline-flex items-center"
                      title="চালান প্রিন্ট করুন"
                    >
                      <Printer size={15} />
                    </button>
                    <button
                      onClick={() => setCorrectionInvoiceId(inv.id)}
                      className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition-colors inline-flex items-center"
                      title="ভুল সংশোধনের রিকোয়েস্ট পাঠান"
                    >
                      <FileEdit size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {initialInvoices.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">No invoices found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <PrintableInvoiceModal
        isOpen={Boolean(selectedInvoiceForPrint)}
        onClose={() => setSelectedInvoiceForPrint(null)}
        invoice={selectedInvoiceForPrint}
      />

      <CorrectionRequestModal
        isOpen={Boolean(correctionInvoiceId)}
        onClose={() => setCorrectionInvoiceId(null)}
        targetType="INVOICE"
        targetId={correctionInvoiceId || ""}
        requesterRole={userRole}
      />
    </div>
  );
}
