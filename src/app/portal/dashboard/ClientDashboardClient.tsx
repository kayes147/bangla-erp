"use client";

import { Package, Wallet, CheckCircle2, Clock, AlertCircle, ArrowDownLeft, ArrowUpRight } from "lucide-react";

interface Props {
  clientName: string;
  totalPaid: number;
  currentDue: number;
  pendingCount: number;
  approvedCount: number;
  dailyIn: number;
  dailyOut: number;
  weeklyIn: number;
  weeklyOut: number;
  monthlyIn: number;
  monthlyOut: number;
  invoices: any[];
}

export default function ClientDashboardClient({
  clientName,
  totalPaid,
  currentDue,
  pendingCount,
  approvedCount,
  dailyIn,
  dailyOut,
  weeklyIn,
  weeklyOut,
  monthlyIn,
  monthlyOut,
  invoices,
}: Props) {
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            মহাজন ড্যাশবোর্ড <span className="text-base font-normal text-gray-500">(Dashboard)</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            স্বাগতম, <span className="font-bold text-gray-900">{clientName}</span> | BOLAKA FACTORY-এর সাথে আপনার লেনদেন ও স্টকের সারসংক্ষেপ:
          </p>
        </div>
      </div>

      {/* Top 4 Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Paid */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center">
          <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-700 mr-4 shadow-2xs">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-600">
              মোট জমা <span className="text-[10px] font-normal text-gray-400 block uppercase">(Total Paid)</span>
            </p>
            <p className="text-xl font-extrabold text-gray-900 mt-0.5">৳ {totalPaid.toLocaleString()}</p>
          </div>
        </div>

        {/* Current Due */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center">
          <div className={`p-3.5 rounded-2xl mr-4 shadow-2xs ${currentDue > 0 ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-600">
              বর্তমান বকেয়া <span className="text-[10px] font-normal text-gray-400 block uppercase">(Current Due)</span>
            </p>
            <p className={`text-xl font-extrabold mt-0.5 ${currentDue > 0 ? "text-red-600" : "text-emerald-600"}`}>
              ৳ {currentDue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center">
          <div className="p-3.5 rounded-2xl bg-amber-100 text-amber-700 mr-4 shadow-2xs">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-600">
              পেন্ডিং রিকোয়েস্ট <span className="text-[10px] font-normal text-gray-400 block uppercase">(Pending)</span>
            </p>
            <p className="text-xl font-extrabold text-gray-900 mt-0.5">
              {pendingCount} <span className="text-xs font-normal text-gray-400">(অপেক্ষমাণ)</span>
            </p>
          </div>
        </div>

        {/* Approved Invoices */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center">
          <div className="p-3.5 rounded-2xl bg-blue-100 text-blue-700 mr-4 shadow-2xs">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-600">
              অনুমোদিত চালান <span className="text-[10px] font-normal text-gray-400 block uppercase">(Approved)</span>
            </p>
            <p className="text-xl font-extrabold text-gray-900 mt-0.5">
              {approvedCount} <span className="text-xs font-normal text-gray-400">(অনুমোদিত)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Product In & Out Breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
            <Package size={20} />
          </div>
          <h2 className="text-lg font-extrabold text-gray-900">
            পণ্য লেনদেনের পরিমাণ <span className="text-xs font-normal text-gray-500">(Product In & Out Stats)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Daily */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100 text-center space-y-1">
            <p className="text-xs text-gray-500 font-bold">
              আজকের পণ্য লেনদেন <span className="text-[10px] block font-normal">(Daily)</span>
            </p>
            <p className="text-2xl font-black text-indigo-700">
              {dailyIn + dailyOut} <span className="text-xs font-bold text-gray-500">Pcs</span>
            </p>
            <div className="pt-2 flex justify-center items-center gap-3 text-[11px] font-semibold text-gray-600 border-t border-gray-200/60 mt-2">
              <span className="text-emerald-700 flex items-center gap-0.5">
                <ArrowDownLeft size={13} /> ইন: {dailyIn}
              </span>
              <span className="text-blue-700 flex items-center gap-0.5">
                <ArrowUpRight size={13} /> আউট: {dailyOut}
              </span>
            </div>
          </div>

          {/* Weekly */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100 text-center space-y-1">
            <p className="text-xs text-gray-500 font-bold">
              এই সপ্তাহের লেনদেন <span className="text-[10px] block font-normal">(Weekly)</span>
            </p>
            <p className="text-2xl font-black text-indigo-700">
              {weeklyIn + weeklyOut} <span className="text-xs font-bold text-gray-500">Pcs</span>
            </p>
            <div className="pt-2 flex justify-center items-center gap-3 text-[11px] font-semibold text-gray-600 border-t border-gray-200/60 mt-2">
              <span className="text-emerald-700 flex items-center gap-0.5">
                <ArrowDownLeft size={13} /> ইন: {weeklyIn}
              </span>
              <span className="text-blue-700 flex items-center gap-0.5">
                <ArrowUpRight size={13} /> আউট: {weeklyOut}
              </span>
            </div>
          </div>

          {/* Monthly */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100 text-center space-y-1">
            <p className="text-xs text-gray-500 font-bold">
              এই মাসের লেনদেন <span className="text-[10px] block font-normal">(Monthly)</span>
            </p>
            <p className="text-2xl font-black text-indigo-700">
              {monthlyIn + monthlyOut} <span className="text-xs font-bold text-gray-500">Pcs</span>
            </p>
            <div className="pt-2 flex justify-center items-center gap-3 text-[11px] font-semibold text-gray-600 border-t border-gray-200/60 mt-2">
              <span className="text-emerald-700 flex items-center gap-0.5">
                <ArrowDownLeft size={13} /> ইন: {monthlyIn}
              </span>
              <span className="text-blue-700 flex items-center gap-0.5">
                <ArrowUpRight size={13} /> আউট: {monthlyOut}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Invoice History Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
        <div className="p-4 border-b border-gray-100 bg-gray-50/70 flex justify-between items-center">
          <h2 className="font-extrabold text-gray-900 text-base">
            চালান ও লেনদেনের হিস্ট্রি <span className="text-xs font-normal text-gray-500">(Invoice History)</span>
          </h2>
          <span className="text-xs text-indigo-700 font-bold bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
            {invoices.length} টি চালান
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="p-4 font-bold text-gray-800">চালান নং <span className="text-[10px] font-normal text-gray-400 block uppercase">(Invoice)</span></th>
                <th className="p-4 font-bold text-gray-800">তারিখ <span className="text-[10px] font-normal text-gray-400 block uppercase">(Date)</span></th>
                <th className="p-4 font-bold text-gray-800">পণ্যের বিবরণ <span className="text-[10px] font-normal text-gray-400 block uppercase">(Product & Qty)</span></th>
                <th className="p-4 font-bold text-gray-800">ধরন <span className="text-[10px] font-normal text-gray-400 block uppercase">(Type)</span></th>
                <th className="p-4 font-bold text-gray-800">মোট টাকা <span className="text-[10px] font-normal text-gray-400 block uppercase">(Total)</span></th>
                <th className="p-4 font-bold text-gray-800">জমা <span className="text-[10px] font-normal text-gray-400 block uppercase">(Paid)</span></th>
                <th className="p-4 font-bold text-gray-800">বকেয়া <span className="text-[10px] font-normal text-gray-400 block uppercase">(Due)</span></th>
                <th className="p-4 font-bold text-gray-800">অবস্থা <span className="text-[10px] font-normal text-gray-400 block uppercase">(Status)</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map((inv) => {
                const due = Math.max(0, inv.totalAmount - inv.paidAmount);
                const displayId = `#${inv.id.slice(-6)}`;
                const itemsSummary = inv.items?.map((it: any) => {
                  const pName = it.product?.name || it.productName || "পণ্য";
                  return `${pName} (${it.quantity} Pcs)`;
                }).join(", ") || "পণ্য তালিকা";

                return (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-gray-950">{displayId}</td>
                    <td className="p-4 whitespace-nowrap text-gray-800 font-medium">
                      {new Date(inv.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-bold text-gray-950">
                      {itemsSummary}
                    </td>
                    <td className="p-4">
                      {inv.type === "product_in" ? (
                        <span className="px-2 py-0.5 text-emerald-800 bg-emerald-100 rounded text-xs font-bold">
                          পণ্য সরবরাহ
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-blue-800 bg-blue-100 rounded text-xs font-bold">
                          পণ্য গ্রহণ
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-extrabold text-gray-950">৳ {inv.totalAmount.toLocaleString()}</td>
                    <td className="p-4 font-bold text-emerald-700">৳ {inv.paidAmount.toLocaleString()}</td>
                    <td className="p-4 font-bold">
                      {due > 0 ? (
                        <span className="text-red-600 font-extrabold">৳ {due.toLocaleString()}</span>
                      ) : (
                        <span className="text-gray-400">৳ ০</span>
                      )}
                    </td>
                    <td className="p-4">
                      {inv.status === "APPROVED" ? (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold inline-flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          <span>অনুমোদিত</span>
                        </span>
                      ) : inv.status === "PENDING" ? (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold inline-flex items-center gap-1">
                          <Clock size={12} />
                          <span>অপেক্ষমাণ</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-lg text-xs font-bold">
                          বাতিল
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {invoices.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400 font-medium">
                    কোনো চালানের হিস্ট্রি পাওয়া যায়নি।
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
