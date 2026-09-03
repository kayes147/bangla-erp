"use client";
import { useState } from "react";
import { PackageMinus, Search, Save, CalendarDays, Printer, FileEdit } from "lucide-react";
import { createInvoice } from "@/actions/invoiceActions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PrintableInvoiceModal from "@/components/PrintableInvoiceModal";
import CorrectionRequestModal from "@/components/CorrectionRequestModal";

export default function ProductOutClient({ initialInvoices, clients, userRole }: { initialInvoices: any[], clients: any[], userRole: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [clientId, setClientId] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<any | null>(null);
  const [correctionInvoiceId, setCorrectionInvoiceId] = useState<string | null>(null);

  const totalAmount = (parseFloat(quantity) || 0) * (parseFloat(price) || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !productName || !quantity || !price) return;

    setLoading(true);
    const status = userRole === "owner" ? "APPROVED" : "PENDING";
    
    const res = await createInvoice({
      type: "product_out",
      clientId,
      items: [{
        productName,
        quantity: parseInt(quantity),
        pricePerUnit: parseFloat(price)
      }],
      paidAmount: parseFloat(paidAmount) || 0,
      requestedBy: userRole,
      status
    });

    setLoading(false);
    if (res.success) {
      setProductName("");
      setQuantity("");
      setPrice("");
      setPaidAmount("");
      router.refresh();
    } else {
      alert("Error: " + res.error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pt-4">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <PackageMinus size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">পণ্য আউট <span className="text-lg font-normal text-gray-500">(Product Out)</span></h1>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 relative z-20">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Customer */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-700">
                  মহাজন <span className="text-[10px] font-normal text-gray-400 uppercase">(Mahajon)</span> <span className="text-red-500">*</span>
                </label>
                <Link href="/clients/new" className="text-xs font-bold text-blue-600 hover:underline">
                  + নতুন মহাজন
                </Link>
              </div>
              <select 
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full p-3 border text-gray-900 placeholder-gray-400 border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                required
              >
                <option value="">মহাজন সিলেক্ট করুন...</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.phone ? `(${c.phone})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">পণ্যের নাম <span className="text-[10px] font-normal text-gray-400 uppercase">(Product Name)</span> <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Radhuni Masala 500g" 
                className="w-full p-3 border text-gray-900 placeholder-gray-400 border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold" 
                required
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">পরিমাণ <span className="text-[10px] font-normal text-gray-400 uppercase">(Quantity)</span> <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0" 
                className="w-full p-3 border text-gray-900 placeholder-gray-400 border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold" 
                required
              />
            </div>

            {/* Sell Price Per Unit */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">বিক্রি দাম (প্রতি একক) <span className="text-[10px] font-normal text-gray-400 uppercase">(Sell Price)</span> <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="৳ 0.00" 
                className="w-full p-3 border text-gray-900 placeholder-gray-400 border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold" 
                required
              />
            </div>

            {/* Total Amount */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">মোট টাকা <span className="text-[10px] font-normal text-gray-400 uppercase">(Total Amount)</span></label>
              <div className="w-full p-3 border text-gray-900 placeholder-gray-400 border-gray-300 rounded-lg bg-gray-50 font-bold text-blue-700">
                ৳ {totalAmount.toLocaleString()}
              </div>
            </div>

            {/* Paid Amount */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">কাস্টমার জমা দিয়েছে <span className="text-[10px] font-normal text-gray-400 uppercase">(Paid Amount)</span></label>
              <input 
                type="number" 
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                placeholder="৳ 0.00" 
                className="w-full p-3 border text-gray-900 placeholder-gray-400 border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold" 
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" disabled={loading} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold text-lg transition-colors shadow-sm">
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
                <th className="p-4 font-bold text-gray-700">কাস্টমার <span className="text-[10px] font-normal text-gray-400 block uppercase">(Customer)</span></th>
                <th className="p-4 font-bold text-gray-700">প্রোডাক্ট <span className="text-[10px] font-normal text-gray-400 block uppercase">(Product Name)</span></th>
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
