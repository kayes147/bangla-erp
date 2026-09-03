"use client";

import { useState } from "react";
import { PackagePlus, CheckCircle2, AlertCircle } from "lucide-react";
import { acceptClientDelivery } from "@/actions/clientActions";
import { useRouter } from "next/navigation";

interface Props {
  clientName: string;
  clientPhone: string;
  invoices: any[];
}

export default function ProductInClient({
  clientName,
  clientPhone,
  invoices,
}: Props) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAccept = async (invoiceId: string) => {
    setLoadingId(invoiceId);
    try {
      await acceptClientDelivery(invoiceId);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pt-4 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-900 p-6 sm:p-8 rounded-2xl text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shrink-0 shadow-md">
            <PackagePlus size={34} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              প্রাপ্ত পণ্যের তালিকা <span className="text-lg font-normal opacity-85">(Received Products)</span>
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl">
              কোম্পানির কারখানা থেকে পাঠানো পণ্য বুঝে পেয়ে ডেলিভারি কনফার্ম করুন।
            </p>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20 text-left sm:text-right">
          <p className="text-[11px] text-emerald-200 font-bold uppercase tracking-wider">
            লগইন করা আছেন
          </p>
          <p className="font-extrabold text-base text-white">{clientName}</p>
          {clientPhone && <p className="text-xs text-emerald-200 font-mono font-bold">{clientPhone}</p>}
        </div>
      </div>

      {/* Received Deliveries Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-emerald-50/60 flex justify-between items-center">
          <h2 className="font-extrabold text-gray-900 text-base">
            ডেলিভারি চালানের তালিকা <span className="text-xs font-normal text-gray-500">(Deliveries from Factory)</span>
          </h2>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
            {invoices.length} টি চালান
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="p-4 font-bold text-gray-800">চালান নং <span className="text-[10px] font-normal text-gray-400 block uppercase">(Invoice)</span></th>
                <th className="p-4 font-bold text-gray-800">তারিখ <span className="text-[10px] font-normal text-gray-400 block uppercase">(Date)</span></th>
                <th className="p-4 font-bold text-gray-800">পণ্যের বিবরণ <span className="text-[10px] font-normal text-gray-400 block uppercase">(Items)</span></th>
                <th className="p-4 font-bold text-gray-800">মোট টাকা <span className="text-[10px] font-normal text-gray-400 block uppercase">(Total Price)</span></th>
                <th className="p-4 font-bold text-gray-800">স্ট্যাটাস <span className="text-[10px] font-normal text-gray-400 block uppercase">(Status)</span></th>
                <th className="p-4 font-bold text-right text-gray-800">অ্যাকশন <span className="text-[10px] font-normal text-gray-400 block uppercase">(Action)</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map((inv) => {
                const isAccepted = inv.notes?.includes("গ্রহণ নিশ্চিত করেছেন");
                const displayId = `#${inv.id.slice(-6)}`;
                const itemsSummary = inv.items?.map((it: any) => `${it.productName} (${it.quantity} টি)`).join(", ") || "পণ্য তালিকা";

                return (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-gray-950">{displayId}</td>
                    <td className="p-4 font-medium text-gray-800 whitespace-nowrap">
                      {new Date(inv.date).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-gray-950">{itemsSummary}</p>
                      {inv.notes && (
                        <p className="text-[11px] text-gray-500 font-medium mt-0.5">{inv.notes}</p>
                      )}
                    </td>
                    <td className="p-4 font-extrabold text-gray-950">৳ {inv.totalAmount.toLocaleString()}</td>
                    <td className="p-4">
                      {isAccepted ? (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold inline-flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          <span>বুঝে পেয়েছি</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold">
                          পেন্ডিং রিসিভ
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {!isAccepted ? (
                        <button
                          onClick={() => handleAccept(inv.id)}
                          disabled={loadingId === inv.id}
                          className="inline-flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-50 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                        >
                          <CheckCircle2 size={14} />
                          <span>{loadingId === inv.id ? "আপডেট হচ্ছে..." : "বুঝে পেয়েছি"}</span>
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 font-bold">সম্পন্ন ✓</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {invoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400 font-medium">
                    কারখানা থেকে প্রেরিত কোনো পণ্যের চালান এখনো পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
