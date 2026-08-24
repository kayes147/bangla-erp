import { DollarSign, ShoppingBag, TrendingUp, Wallet, Receipt, Landmark, PackagePlus, PackageMinus } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // 1. Calculate Main Cash
  const allTransactions = await prisma.transaction.findMany();
  const mainCash = allTransactions.reduce((acc, t) => {
    return t.type === 'in' ? acc + t.amount : acc - t.amount;
  }, 0);

  // 2. Calculate Today's Expenses
  const todaysExpenses = await prisma.expense.findMany({
    where: { date: { gte: today } }
  });
  const dailyExpenseTotal = todaysExpenses.reduce((sum, e) => sum + e.amount, 0);

  // 3. Today's Product Out (Sales)
  const todaysSales = await prisma.invoice.findMany({
    where: { type: 'product_out', date: { gte: today } },
    include: { items: true }
  });
  const salesTotal = todaysSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const salesReceived = todaysSales.reduce((sum, s) => sum + s.paidAmount, 0);
  const salesDue = salesTotal - salesReceived;
  const salesProductCount = todaysSales.reduce((sum, s) => sum + s.items.reduce((q, item) => q + item.quantity, 0), 0);

  // 4. Today's Product In (Purchases)
  const todaysPurchases = await prisma.invoice.findMany({
    where: { type: 'product_in', date: { gte: today } },
    include: { items: true }
  });
  const purchasesTotal = todaysPurchases.reduce((sum, p) => sum + p.totalAmount, 0);
  const purchasesPaid = todaysPurchases.reduce((sum, p) => sum + p.paidAmount, 0);
  const purchasesDue = purchasesTotal - purchasesPaid;
  const purchasesProductCount = todaysPurchases.reduce((sum, p) => sum + p.items.reduce((q, item) => q + item.quantity, 0), 0);

  // 5. Total Loan/Due (Receivable)
  const clients = await prisma.client.findMany();
  const totalDueReceivable = clients.reduce((sum, c) => c.openingBalance > 0 ? sum + c.openingBalance : sum, 0);

  // 6. Monthly Profit (Very basic: Sales - Purchases - Expenses this month)
  const monthlySales = await prisma.invoice.findMany({
    where: { type: 'product_out', date: { gte: startOfMonth } }
  });
  const monthlyPurchases = await prisma.invoice.findMany({
    where: { type: 'product_in', date: { gte: startOfMonth } }
  });
  const monthlyExpenses = await prisma.expense.findMany({
    where: { date: { gte: startOfMonth } }
  });
  
  const mSalesTotal = monthlySales.reduce((sum, s) => sum + s.totalAmount, 0);
  const mPurchasesTotal = monthlyPurchases.reduce((sum, p) => sum + p.totalAmount, 0);
  const mExpensesTotal = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  const monthlyProfit = mSalesTotal - mPurchasesTotal - mExpensesTotal;

  return (
    <div className="space-y-6">
      {/* 6 Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Product Out / Sales */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center mb-3">
            <div className="p-2.5 rounded-full bg-blue-100 text-blue-600 mr-3">
              <PackageMinus size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">আজকের বিক্রি <span className="text-[10px] font-normal text-gray-500 block uppercase tracking-wide">(Today&apos;s Product Out)</span></p>
              <p className="text-xl font-bold text-gray-900 mt-1">৳ {salesTotal.toLocaleString()}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-gray-100 text-xs">
            <div className="text-center">
              <span className="block text-gray-400">Products</span>
              <span className="font-semibold text-gray-700">{salesProductCount} Pcs</span>
            </div>
            <div className="text-center border-l border-gray-100">
              <span className="block text-gray-400">Received</span>
              <span className="font-semibold text-green-600">৳ {salesReceived.toLocaleString()}</span>
            </div>
            <div className="text-center border-l border-gray-100">
              <span className="block text-gray-400">Due</span>
              <span className="font-semibold text-red-500">৳ {salesDue.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        {/* Product In / Purchase */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center mb-3">
            <div className="p-2.5 rounded-full bg-green-100 text-green-600 mr-3">
              <PackagePlus size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">আজকের ক্রয় <span className="text-[10px] font-normal text-gray-500 block uppercase tracking-wide">(Today&apos;s Product In)</span></p>
              <p className="text-xl font-bold text-gray-900 mt-1">৳ {purchasesTotal.toLocaleString()}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-gray-100 text-xs">
            <div className="text-center">
              <span className="block text-gray-400">Products</span>
              <span className="font-semibold text-gray-700">{purchasesProductCount} Pcs</span>
            </div>
            <div className="text-center border-l border-gray-100">
              <span className="block text-gray-400">Paid</span>
              <span className="font-semibold text-orange-500">৳ {purchasesPaid.toLocaleString()}</span>
            </div>
            <div className="text-center border-l border-gray-100">
              <span className="block text-gray-400">Due</span>
              <span className="font-semibold text-red-500">৳ {purchasesDue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Main Cash */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">মূল ক্যাশ <span className="text-[10px] font-normal text-gray-500 block uppercase tracking-wide">(Main Cash)</span></p>
            <p className="text-2xl font-bold text-gray-900 mt-1">৳ {mainCash.toLocaleString()}</p>
          </div>
        </div>

        {/* Daily Expenses */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
            <Receipt size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">দৈনিক খরচ <span className="text-[10px] font-normal text-gray-500 block uppercase tracking-wide">(Daily Expenses)</span></p>
            <p className="text-2xl font-bold text-gray-900 mt-1">৳ {dailyExpenseTotal.toLocaleString()}</p>
          </div>
        </div>

        {/* Loan */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
            <Landmark size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">মোট ঋণ <span className="text-[10px] font-normal text-gray-500 block uppercase tracking-wide">(Total Loan/Due)</span></p>
            <p className="text-2xl font-bold text-gray-900 mt-1">৳ {totalDueReceivable.toLocaleString()}</p>
          </div>
        </div>

        {/* Monthly Profit */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">মাসিক লাভ <span className="text-[10px] font-normal text-gray-500 block uppercase tracking-wide">(Monthly Profit)</span></p>
            <p className={`text-2xl font-bold ${monthlyProfit < 0 ? 'text-red-600' : 'text-gray-900'} mt-1`}>
              ৳ {monthlyProfit.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">সাম্প্রতিক লেনদেন <span className="text-xs font-normal text-gray-500">(Recent Transactions)</span></h2>
            <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Details</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {/* Dynamically render recent transactions */}
                {allTransactions.slice(0, 5).reverse().map((t) => (
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${t.type === 'in' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {t.type === 'in' ? 'Cash In' : 'Cash Out'}
                      </span>
                    </td>
                    <td className="p-4">{t.description}</td>
                    <td className="p-4">{t.date.toLocaleDateString()}</td>
                    <td className="p-4 font-medium text-gray-800">৳ {t.amount}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Completed</span>
                    </td>
                  </tr>
                ))}
                {allTransactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">No transactions yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Low Stock Alert (কম স্টক)</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Radhuni Masala 500g</p>
                <p className="text-xs text-gray-500">SKU: RD-500</p>
              </div>
              <span className="text-red-600 font-bold text-sm">5 left</span>
            </div>
          </div>
        </div>
      </div>

      {/* Client Requests & Manager Approvals Split View */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        
        {/* Client Requests */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-orange-50/50 flex justify-between items-center">
            <h2 className="font-bold text-gray-800 flex items-center">
              <span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
              গ্রাহকের রিকোয়েস্ট <span className="text-xs font-normal text-gray-500 ml-1">(Client Requests)</span>
            </h2>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">2 Pending</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <tbody className="divide-y divide-gray-50">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-gray-800">Karim Traders <span className="text-xs font-normal text-gray-400">(Product In)</span></p>
                    <p className="text-xs text-gray-500 mt-1">Radhuni Masala 500g • 50 Box</p>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-xs font-bold text-indigo-600 hover:underline">Review & Approve &rarr;</button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-gray-800">Rahim Uddin <span className="text-xs font-normal text-gray-400">(Product Out)</span></p>
                    <p className="text-xs text-gray-500 mt-1">Fresh Atta 2kg • 10 Kg</p>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-xs font-bold text-indigo-600 hover:underline">Review & Approve &rarr;</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Manager / Internal Requests */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-red-50/50 flex justify-between items-center">
            <h2 className="font-bold text-gray-800 flex items-center">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
              ইন্টারনাল অ্যাপ্রুভাল <span className="text-xs font-normal text-gray-500 ml-1">(Manager Requests)</span>
            </h2>
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">1 Pending</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <tbody className="divide-y divide-gray-50">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-gray-800">Hasibul Manager <span className="text-xs font-normal text-gray-400">(Cash Withdrawal)</span></p>
                    <p className="text-xs text-gray-500 mt-1">Request to withdraw ৳ 5,000 for office maintenance.</p>
                  </td>
                  <td className="p-4 text-right">
                    <button className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded text-xs font-bold transition-colors">
                      Review <span className="text-[10px] font-normal block">(Approve)</span>
                    </button>
                  </td>
                </tr>
                <tr className="bg-gray-50 text-center opacity-50">
                  <td colSpan={2} className="p-6 text-xs font-medium">No other pending requests.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
