"use client";

import { Package, Wallet, CheckCircle, Clock, AlertCircle, Eye } from "lucide-react";
import Link from "next/link";

interface Props {
  clientName: string;
  totalPaid: number;
  currentDue: number;
  pendingCount: number;
  approvedCount: number;
  dailyPcs: number;
  weeklyPcs: number;
  monthlyPcs: number;
  invoices: any[];
}

export default function ClientDashboardClient({
  clientName,
  totalPaid,
  currentDue,
  pendingCount,
  approvedCount,
  dailyPcs,
  weeklyPcs,
  monthlyPcs,
  invoices,
}: Props) {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            মহাজন ড্যাশবোর্ড <span className="text-lg font-normal text-gray-500">(Dashboard)</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            স্বাগতম, <span className="font-bold text-gray-800">{clientName}</span>। BOLAKA FACTORY-এর সাথে আপনার লেনদেন ও স্টকের সারসংক্ষেপ:
          </p>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Paid */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">
              মোট জমা <span className="text-[10px] font-normal text-gray-500 block uppercase">(Total Paid)</span>
            </p>
            <p className="text-xl font-bold text-gray-900 mt-1">৳ {totalPaid.toLocaleString()}</p>
          </div>
        </div>

        {/* Current Due */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">
              বর্তমান বকেয়া <span className="text-[10px] font-normal text-gray-500 block uppercase">(Current Due)</span>
            </p>
            <p className={`text-xl font-bold mt-1 ${currentDue > 0 ? "text-red-600" : "text-green-600"}`}>
              ৳ {Math.abs(currentDue).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">
              পেন্ডিং রিকোয়েস্ট <span className="text-[10px] font-normal text-gray-500 block uppercase">(Pending)</span>
            </p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {pendingCount} <span className="text-xs font-normal text-gray-500">(অপেক্ষমাণ)</span>
            </p>
          </div>
        </div>

        {/* Approved */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">
              অনুমোদিত চালান <span className="text-[10px] font-normal text-gray-500 block uppercase">(Approved)</span>
            </p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {approvedCount} <span className="text-xs font-normal text-gray-500">(অনুমোদিত)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Product Transactions Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <Package size={20} />
          </div>
          <h2 className="text-lg font-bold text-gray-800">
            প্রোডাক্ট লেনদেনের পরিমাণ <span className="text-sm font-normal text-gray-500">(Product Quantity Stats)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
            <p className="text-gray-500 font-bold mb-2">
              আজকের লেনদেন <span className="text-[10px] block font-normal">(Daily)</span>
            </p>
            <p className="text-2xl font-bold text-indigo-600">
              {dailyPcs} <span className="text-sm text-gray-500">Pcs</span>
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
            <p className="text-gray-500 font-bold mb-2">
              এই সপ্তাহের লেনদেন <span className="text-[10px] block font-normal">(Weekly)</span>
            </p>
            <p className="text-2xl font-bold text-indigo-600">
              {weeklyPcs} <span className="text-sm text-gray-500">Pcs</span>
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
            <p className="text-gray-500 font-bold mb-2">
              এই মাসের লেনদেন <span className="text-[10px] block font-normal">(Monthly)</span>
            </p>
            <p className="text-2xl font-bold text-indigo-600">
              {monthlyPcs} <span className="text-sm text-gray-500">Pcs</span>
            </p>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="font-bold text-gray-800">
            চালান ও লেনদেনের হিস্ট্রি <span className="text-xs font-normal text-gray-500">(Invoice History)</span>
          </h2>
          <span className="text-xs text-gray-500 font-bold">{invoices.length} টি চালান</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="p-4 font-medium text-gray-700">চালান নং <span className="text-[10px] font-normal text-gray-400 block uppercase">(Invoice)</span></th>
                <th className="p-4 font-medium text-gray-700">তারিখ <span className="text-[10px] font-normal text-gray-400 block uppercase">(Date)</span></th>
                <th className="p-4 font-medium text-gray-700">ধরন <span className="text-[10px] font-normal text-gray-400 block uppercase">(Type)</span></th>
                <th className="p-4 font-medium text-gray-700">মোট টাকা <span className="text-[10px] font-normal text-gray-400 block uppercase">(Total Amount)</span></th>
                <th className="p-4 font-medium text-gray-700">জমা <span className="text-[10px] font-normal text-gray-400 block uppercase">(Paid)</span></th>
                <th className="p-4 font-medium text-gray-700">বকেয়া <span className="text-[10px] font-normal text-gray-400 block uppercase">(Due)</span></th>
                <th className="p-4 font-medium text-gray-700">অবস্থা <span className="text-[10px] font-normal text-gray-400 block uppercase">(Status)</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map((inv) => {
                const due = inv.totalAmount - inv.paidAmount;
                const displayId = `#${inv.id.slice(-6)}`;
                return (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-gray-900">{displayId}</td>
                    <td className="p-4 whitespace-nowrap">{new Date(inv.date).toLocaleDateString()}</td>
                    <td className="p-4 font-bold text-xs">
                      {inv.type === "product_in" ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">পণ্য সরবরাহ</span>
                      ) : (
                        <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded">পণ্য গ্রহণ</span>
                      )}
                    </td>
                    <td className="p-4 font-bold text-gray-800">৳ {inv.totalAmount.toLocaleString()}</td>
                    <td className="p-4 font-semibold text-emerald-600">৳ {inv.paidAmount.toLocaleString()}</td>
                    <td className="p-4 font-semibold text-red-600">৳ {due.toLocaleString()}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          inv.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : inv.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {invoices.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400 font-medium">
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
