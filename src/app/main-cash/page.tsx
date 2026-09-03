import { Wallet, ArrowDownRight, ArrowUpRight, Plus, Download } from "lucide-react";
import { getTransactions } from "@/actions/transactionActions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import CashActionButtons from "./CashActionButtons";

export const dynamic = "force-dynamic";

export default async function MainCash() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const { transactions } = await getTransactions();

  // Calculate Balances
  let currentBalance = 0;
  let todayIn = 0;
  let todayOut = 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formattedTransactions = transactions?.map((t) => {
    const isToday = t.date >= today;
    if (t.type === "in") {
      currentBalance += t.amount;
      if (isToday) todayIn += t.amount;
    } else {
      currentBalance -= t.amount;
      if (isToday) todayOut += t.amount;
    }
    return t;
  }) || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <Wallet size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Main Cash <span className="text-lg font-normal text-gray-500">(মূল ক্যাশ)</span></h1>
        </div>
        <CashActionButtons />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 shadow-md text-white">
          <p className="text-indigo-100 font-medium mb-1">Current Balance <span className="text-[10px] uppercase block">(বর্তমান ক্যাশ)</span></p>
          <h2 className="text-4xl font-bold">৳ {currentBalance.toLocaleString()}</h2>
          <p className="text-xs mt-2 text-indigo-200">Total cash available</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center space-x-2 text-green-600 mb-1">
            <ArrowDownRight size={20} />
            <p className="font-bold">Today's Cash In <span className="text-[10px] text-gray-400 font-normal uppercase block">(আজকের জমা)</span></p>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">৳ {todayIn.toLocaleString()}</h2>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center space-x-2 text-red-600 mb-1">
            <ArrowUpRight size={20} />
            <p className="font-bold">Today's Cash Out <span className="text-[10px] text-gray-400 font-normal uppercase block">(আজকের খরচ)</span></p>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">৳ {todayOut.toLocaleString()}</h2>
        </div>
      </div>

      {/* Cash Ledger / History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 gap-4">
          <h2 className="text-lg font-bold text-gray-800">Cash History <span className="text-sm font-normal text-gray-500">(লেনদেনের বিবরণ)</span></h2>
          <div className="flex space-x-3">
            <input type="date" className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
            <button className="flex items-center space-x-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-sm transition-colors font-bold">
              <Download size={16} />
              <span>Report</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-white border-b border-gray-200">
              <tr>
                <th className="p-4 font-bold text-gray-700">Date <span className="text-[10px] font-normal text-gray-400 block uppercase">(তারিখ)</span></th>
                <th className="p-4 font-bold text-gray-700">
                  <div className="flex items-center justify-between">
                    <div>Description <span className="text-[10px] font-normal text-gray-400 block uppercase">(বিবরণ)</span></div>
                    <div className="text-right">Invoice ID <span className="text-[10px] font-normal text-gray-400 block uppercase">(চালান নং)</span></div>
                  </div>
                </th>
                <th className="p-4 font-bold text-green-600 text-right">In <span className="text-[10px] font-normal text-gray-400 block uppercase">(জমা)</span></th>
                <th className="p-4 font-bold text-red-600 text-right">Out <span className="text-[10px] font-normal text-gray-400 block uppercase">(খরচ)</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {formattedTransactions.map((t) => {
                // Extract invoice ID
                const invoiceIdFromDesc = t.description?.match(/#([a-zA-Z0-9]+)/)?.[1];
                const rawInvId = t.invoiceId || invoiceIdFromDesc;
                const displayInvId = rawInvId ? `#${rawInvId.slice(-8)}` : null;

                // Client / Mahajon name
                const clientName = t.client?.name || (t as any).invoice?.client?.name;

                // Format clean description
                let mainDesc = t.description
                  .replace(/পণ্য ক্রয়/g, "পণ্য ইন")
                  .replace(/পণ্য বিক্রয়/g, "পণ্য আউট");

                if (t.description.startsWith("Payment for Invoice")) {
                  mainDesc = clientName 
                    ? (t.type === "out" ? `পণ্য ইন (প্রতিষ্ঠান: ${clientName})` : `পণ্য আউট (প্রতিষ্ঠান: ${clientName})`)
                    : (t.type === "out" ? "পণ্য ইন" : "পণ্য আউট");
                }

                return (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="p-4 text-xs text-gray-500 font-medium whitespace-nowrap">
                      {new Date(t.date).toLocaleDateString()} {new Date(t.date).toLocaleTimeString()}
                    </td>
                    <td className="p-4 text-gray-800 font-medium">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <span className="font-bold text-gray-900">
                            {mainDesc}
                          </span>
                          {t.status === "PENDING" && (
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded">
                              Pending Request
                            </span>
                          )}
                        </div>
                        {displayInvId && (
                          <span 
                            className="shrink-0 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-mono font-bold rounded-md shadow-xs transition-colors"
                            title={`Invoice ${displayInvId}`}
                          >
                            {displayInvId}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right font-bold text-green-600 whitespace-nowrap">
                      {t.type === "in" ? `৳ ${t.amount.toLocaleString()}` : "-"}
                    </td>
                    <td className="p-4 text-right font-bold text-red-600 whitespace-nowrap">
                      {t.type === "out" ? `৳ ${t.amount.toLocaleString()}` : "-"}
                    </td>
                  </tr>
                );
              })}
              {formattedTransactions.length === 0 && (
                 <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-400 font-medium">No transactions found.</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
