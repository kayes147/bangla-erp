import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Wallet, 
  Receipt, 
  Landmark, 
  PackagePlus, 
  PackageMinus,
  Boxes,
  ArrowDownToLine,
  ArrowUpFromLine
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getPendingApprovals } from "@/actions/approvalActions";

// Enforce real-time dynamic rendering on every request with zero cache
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function Home() {
  // Calculate today start and month start in Bangladesh Standard Time (UTC+6)
  const now = new Date();
  const bstTime = new Date(now.getTime() + 6 * 3600 * 1000);
  const y = bstTime.getUTCFullYear();
  const m = bstTime.getUTCMonth();
  const d = bstTime.getUTCDate();

  // 00:00:00 BST = UTC date minus 6 hours
  const todayStart = new Date(Date.UTC(y, m, d, 0, 0, 0) - 6 * 3600 * 1000);
  const monthStart = new Date(Date.UTC(y, m, 1, 0, 0, 0) - 6 * 3600 * 1000);

  let allTransactions: any[] = [];
  let mainCash = 0;
  let todaysExpenses: any[] = [];
  let dailyExpenseTotal = 0;
  let salesTotal = 0;
  let salesReceived = 0;
  let salesDue = 0;
  let salesProductCount = 0;
  let purchasesTotal = 0;
  let purchasesPaid = 0;
  let purchasesDue = 0;
  let purchasesProductCount = 0;
  let totalDueReceivable = 0;
  let monthlyProfit = 0;
  let inventoryList: any[] = [];
  let overallTotalIn = 0;
  let overallTotalOut = 0;
  let overallCurrentStock = 0;
  let totalPending = 0;

  try {
    // 1. Calculate Main Cash and get all transactions sorted newest first
    allTransactions = await prisma.transaction.findMany({
      orderBy: { date: "desc" },
      include: {
        client: true,
        invoice: {
          include: {
            client: true
          }
        }
      }
    });

    mainCash = allTransactions.reduce((acc, t) => {
      return t.type === 'in' ? acc + t.amount : acc - t.amount;
    }, 0);

    // 2. Calculate Today's Expenses (from 00:00 BST today)
    todaysExpenses = await prisma.expense.findMany({
      where: { date: { gte: todayStart } }
    });
    dailyExpenseTotal = todaysExpenses.reduce((sum, e) => sum + e.amount, 0);

    // 3. Today's Product Out (Sales)
    const todaysSales = await prisma.invoice.findMany({
      where: { type: 'product_out', date: { gte: todayStart } },
      include: { items: true }
    });
    salesTotal = todaysSales.reduce((sum, s) => sum + s.totalAmount, 0);
    salesReceived = todaysSales.reduce((sum, s) => sum + s.paidAmount, 0);
    salesDue = salesTotal - salesReceived;
    salesProductCount = todaysSales.reduce((sum, s) => sum + s.items.reduce((q, item) => q + item.quantity, 0), 0);

    // 4. Today's Product In (Purchases)
    const todaysPurchases = await prisma.invoice.findMany({
      where: { type: 'product_in', date: { gte: todayStart } },
      include: { items: true }
    });
    purchasesTotal = todaysPurchases.reduce((sum, p) => sum + p.totalAmount, 0);
    purchasesPaid = todaysPurchases.reduce((sum, p) => sum + p.paidAmount, 0);
    purchasesDue = purchasesTotal - purchasesPaid;
    purchasesProductCount = todaysPurchases.reduce((sum, p) => sum + p.items.reduce((q, item) => q + item.quantity, 0), 0);

    // 5. Total Due (ব্যবসায়ের মোট অপরিশোধিত বকেয়া হিসাব - exactly matching /loan)
    const allInvoices = await prisma.invoice.findMany();
    totalDueReceivable = allInvoices.reduce((sum, inv) => {
      return sum + Math.max(0, inv.totalAmount - inv.paidAmount);
    }, 0);

    // 6. Monthly Profit (from 1st of month BST)
    const monthlySales = await prisma.invoice.findMany({
      where: { type: 'product_out', date: { gte: monthStart } }
    });
    const monthlyPurchases = await prisma.invoice.findMany({
      where: { type: 'product_in', date: { gte: monthStart } }
    });
    const monthlyExpenses = await prisma.expense.findMany({
      where: { date: { gte: monthStart } }
    });
    
    const mSalesTotal = monthlySales.reduce((sum, s) => sum + s.totalAmount, 0);
    const mPurchasesTotal = monthlyPurchases.reduce((sum, p) => sum + p.totalAmount, 0);
    const mExpensesTotal = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    monthlyProfit = mSalesTotal - mPurchasesTotal - mExpensesTotal;

    // 7. Inventory (পণ্যের ইন, আউট ও পরিমাপ)
    const allProducts = await prisma.product.findMany({
      include: {
        invoiceItems: {
          include: {
            invoice: true
          }
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    inventoryList = allProducts.map((p) => {
      let totalIn = 0;
      let totalOut = 0;

      p.invoiceItems.forEach((item) => {
        if (item.invoice?.type === "product_in") {
          totalIn += item.quantity;
        } else if (item.invoice?.type === "product_out") {
          totalOut += item.quantity;
        }
      });

      overallTotalIn += totalIn;
      overallTotalOut += totalOut;
      overallCurrentStock += p.stock;

      return {
        id: p.id,
        name: p.name,
        sku: p.sku,
        totalIn,
        totalOut,
        currentStock: p.stock
      };
    });

    // 8. Approvals
    const pending = await getPendingApprovals();
    totalPending = (pending.invoices?.length || 0) + (pending.expenses?.length || 0) + (pending.transactions?.length || 0);
  } catch (err) {
    console.error("Dashboard data fetch error:", err);
  }

  return (
    <div className="space-y-6">
      {/* 6 Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Product In */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center mb-3">
            <div className="p-2.5 rounded-full bg-green-100 text-green-600 mr-3">
              <PackagePlus size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">আজকের পণ্য ইন <span className="text-[10px] font-normal text-gray-500 block uppercase tracking-wide">(Product In)</span></p>
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

        {/* Product Out */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center mb-3">
            <div className="p-2.5 rounded-full bg-blue-100 text-blue-600 mr-3">
              <PackageMinus size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">আজকের পণ্য আউট <span className="text-[10px] font-normal text-gray-500 block uppercase tracking-wide">(Product Out)</span></p>
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
              <span className="font-semibold text-orange-500">৳ {salesDue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Main Cash */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center mb-3">
            <div className="p-2.5 rounded-full bg-emerald-100 text-emerald-600 mr-3">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">মূল ক্যাশ <span className="text-[10px] font-normal text-gray-500 block uppercase tracking-wide">(Main Cash)</span></p>
              <p className="text-xl font-bold text-gray-900 mt-1">৳ {mainCash.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2 pt-3 border-t border-gray-100 text-xs">
            <span className="text-gray-400">Available Business Funds</span>
            <span className="font-medium text-emerald-600">Active</span>
          </div>
        </div>

        {/* Daily Expenses */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center mb-3">
            <div className="p-2.5 rounded-full bg-red-100 text-red-600 mr-3">
              <Receipt size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">দৈনিক খরচ <span className="text-[10px] font-normal text-gray-500 block uppercase tracking-wide">(Today Expenses)</span></p>
              <p className="text-xl font-bold text-gray-900 mt-1">৳ {dailyExpenseTotal.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2 pt-3 border-t border-gray-100 text-xs">
            <span className="text-gray-400">Total spent today</span>
            <span className="font-medium text-red-600">{todaysExpenses?.length || 0} items</span>
          </div>
        </div>

        {/* Total Due */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center mb-3">
            <div className="p-2.5 rounded-full bg-purple-100 text-purple-600 mr-3">
              <Landmark size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">মোট বকেয়া <span className="text-[10px] font-normal text-gray-500 block uppercase tracking-wide">(Total Due)</span></p>
              <p className="text-xl font-bold text-gray-900 mt-1">৳ {totalDueReceivable.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2 pt-3 border-t border-gray-100 text-xs">
            <span className="text-gray-400">ব্যবসায়ের মোট বকেয়ার পরিমাণ</span>
            <span className="font-medium text-purple-600">Pending</span>
          </div>
        </div>

        {/* Estimated Profit */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center mb-3">
            <div className="p-2.5 rounded-full bg-indigo-100 text-indigo-600 mr-3">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">মাসিক প্রফিট (আনুমানিক) <span className="text-[10px] font-normal text-gray-500 block uppercase tracking-wide">(Monthly Profit)</span></p>
              <p className={`text-xl font-bold mt-1 ${monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ৳ {monthlyProfit.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2 pt-3 border-t border-gray-100 text-xs">
            <span className="text-gray-400">This Month Net Flow</span>
            <span className={`font-medium ${monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {monthlyProfit >= 0 ? '+ Profitable' : '- Loss'}
            </span>
          </div>
        </div>

      </div>

      {/* Grid: Recent Transactions & Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-800">সাম্প্রতিক লেনদেন (Recent Transactions)</h2>
              <p className="text-xs text-gray-500 mt-0.5">রিয়েল-টাইম সর্বশেষ ক্যাশ ইন, ক্যাশ আউট ও খরচের তালিকা</p>
            </div>
            <Link href="/main-cash" prefetch={false} className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              View All
            </Link>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">
                    <div className="flex items-center justify-between">
                      <span>Description (বিবরণ)</span>
                      <span>Invoice ID (চালান নং)</span>
                    </div>
                  </th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {/* 10 Most Recent Transactions (sorted newest first) */}
                {allTransactions.slice(0, 10).map((t) => {
                  const invoiceIdFromDesc = t.description?.match(/#([a-zA-Z0-9]+)/)?.[1];
                  const rawInvId = t.invoiceId || invoiceIdFromDesc;
                  const displayInvId = rawInvId ? `#${rawInvId.slice(-8)}` : null;

                  const clientName = (t as any).client?.name || (t as any).invoice?.client?.name;

                  let mainDesc = t.description
                    .replace(/পণ্য ক্রয়/g, "পণ্য ইন")
                    .replace(/পণ্য বিক্রয়/g, "পণ্য আউট");

                  if (t.description.startsWith("Payment for Invoice")) {
                    mainDesc = clientName 
                      ? (t.type === "out" ? `পণ্য ইন (মহাজন: ${clientName})` : `পণ্য আউট (কাস্টমার: ${clientName})`)
                      : (t.type === "out" ? "পণ্য ইন" : "পণ্য আউট");
                  }

                  return (
                    <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${t.type === 'in' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {t.type === 'in' ? 'Cash In' : 'Cash Out'}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-gray-800">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-bold text-gray-900">{mainDesc}</span>
                          {displayInvId && (
                            <span 
                              className="shrink-0 px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 text-xs font-mono font-bold rounded"
                              title={`Invoice ${displayInvId}`}
                            >
                              {displayInvId}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">{t.date.toLocaleDateString()}</td>
                      <td className="p-4 font-bold text-gray-800">৳ {t.amount.toLocaleString()}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">{t.status}</span>
                      </td>
                    </tr>
                  );
                })}
                {allTransactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500 font-medium">কোনো লেনদেন পাওয়া যায়নি।</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Section (ইনভেন্টরি - পণ্যের ইন, আউট ও পরিমাপ) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between overflow-hidden">
          <div>
            <div className="p-5 border-b border-gray-100 bg-slate-50 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2">
                  <Boxes size={20} className="text-indigo-600" />
                  <span>ইনভেন্টরি <span className="text-xs font-normal text-gray-500">(Inventory)</span></span>
                </h2>
                <p className="text-[11px] text-gray-500 mt-0.5">কতগুলি প্রোডাক্ট এসেছে, কতগুলি বের হয়েছে ও বর্তমান স্টক</p>
              </div>
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-bold rounded">
                {inventoryList.length} টি পণ্য
              </span>
            </div>

            {/* Quick Inventory Measurement Counters */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50/60 border-b border-gray-100 text-center">
              <div className="p-2.5 rounded-xl bg-white border border-emerald-200 shadow-2xs">
                <span className="block text-[10px] text-emerald-700 font-bold uppercase">মোট পণ্য ইন</span>
                <span className="text-base font-bold text-emerald-700">+{overallTotalIn.toLocaleString()}</span>
                <span className="block text-[9px] text-gray-400">এসেছে</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-blue-200 shadow-2xs">
                <span className="block text-[10px] text-blue-700 font-bold uppercase">মোট পণ্য আউট</span>
                <span className="text-base font-bold text-blue-700">-{overallTotalOut.toLocaleString()}</span>
                <span className="block text-[9px] text-gray-400">বের হয়েছে</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-purple-200 shadow-2xs">
                <span className="block text-[10px] text-purple-700 font-bold uppercase">বর্তমান স্টক</span>
                <span className="text-base font-bold text-purple-700">{overallCurrentStock.toLocaleString()}</span>
                <span className="block text-[9px] text-gray-400">অবশিষ্ট</span>
              </div>
            </div>

            {/* Product-wise Breakdown List */}
            <div className="p-4 divide-y divide-gray-100 max-h-[380px] overflow-y-auto space-y-2.5">
              {inventoryList.map((p) => (
                <div key={p.id} className="pt-2.5 first:pt-0 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{p.name}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mt-0.5">
                      <span className="text-emerald-600 font-medium">ইন: +{p.totalIn}</span>
                      <span>•</span>
                      <span className="text-blue-600 font-medium">আউট: -{p.totalOut}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${
                        p.currentStock > 0
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : p.currentStock === 0
                          ? "bg-gray-100 text-gray-600 border border-gray-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {p.currentStock} বাকি
                    </span>
                  </div>
                </div>
              ))}
              {inventoryList.length === 0 && (
                <p className="text-sm text-gray-400 italic text-center py-8">কোনো পণ্য পাওয়া যায়নি।</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Approvals Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mt-6">
        <div className="p-4 border-b border-gray-100 bg-orange-50/50 flex justify-between items-center">
          <h2 className="font-bold text-gray-800 flex items-center">
            <span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
            অ্যাপ্রুভাল রিকোয়েস্ট <span className="text-xs font-normal text-gray-500 ml-1">(Pending Approvals)</span>
          </h2>
          <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">{totalPending} Pending</span>
        </div>
        <div className="p-6">
          {totalPending > 0 ? (
            <div className="flex flex-col items-center justify-center space-y-3">
              <p className="text-sm text-gray-600 font-medium">You have <span className="font-bold text-orange-600">{totalPending}</span> requests waiting for your approval.</p>
              <Link href="/approvals" prefetch={false} className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-sm transition-colors">
                View & Approve Requests
              </Link>
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center italic">No pending requests at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}
