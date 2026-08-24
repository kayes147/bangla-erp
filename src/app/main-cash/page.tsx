import { Wallet, ArrowDownRight, ArrowUpRight, Plus, Download } from "lucide-react";

export default function MainCash() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <Wallet size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Main Cash (মূল ক্যাশ / ক্যাশ বুক)</h1>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm">
            <ArrowDownRight size={18} />
            <span>Add Cash (ক্যাশ ইন)</span>
          </button>
          <button className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm">
            <ArrowUpRight size={18} />
            <span>Remove Cash (ক্যাশ আউট)</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 shadow-md text-white">
          <p className="text-indigo-100 font-medium mb-1">Current Balance (বর্তমান ক্যাশ)</p>
          <h2 className="text-4xl font-bold">৳ 45,000</h2>
          <p className="text-xs mt-2 text-indigo-200">Total cash available in drawer/bank</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center space-x-2 text-green-600 mb-1">
            <ArrowDownRight size={20} />
            <p className="font-medium">Today's Cash In (আজকের জমা)</p>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">৳ 12,500</h2>
          <p className="text-xs text-gray-500 mt-1">From Sales & Due Collections</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center space-x-2 text-red-600 mb-1">
            <ArrowUpRight size={20} />
            <p className="font-medium">Today's Cash Out (আজকের খরচ)</p>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">৳ 3,200</h2>
          <p className="text-xs text-gray-500 mt-1">Expenses, Purchases & Salary</p>
        </div>
      </div>

      {/* Cash Ledger / History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 gap-4">
          <h2 className="text-lg font-semibold text-gray-800">Cash History (লেনদেনের বিবরণ)</h2>
          <div className="flex space-x-3">
            <input type="date" className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
            <button className="flex items-center space-x-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-sm transition-colors">
              <Download size={16} />
              <span>Report</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-white border-b border-gray-200">
              <tr>
                <th className="p-4 font-medium text-gray-700">Date & Time</th>
                <th className="p-4 font-medium text-gray-700">Description (বিবরণ)</th>
                <th className="p-4 font-medium text-gray-700">Category</th>
                <th className="p-4 font-medium text-green-600 text-right">In (জমা)</th>
                <th className="p-4 font-medium text-red-600 text-right">Out (খরচ)</th>
                <th className="p-4 font-medium text-indigo-700 text-right border-l border-gray-100">Balance (অবশিষ্ট)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              
              <tr className="hover:bg-gray-50">
                <td className="p-4 text-xs text-gray-500">Today, 11:45 AM</td>
                <td className="p-4 text-gray-800">Shop Electricity Bill</td>
                <td className="p-4"><span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">Expense</span></td>
                <td className="p-4 text-right">-</td>
                <td className="p-4 text-right font-medium text-red-600">৳ 850</td>
                <td className="p-4 text-right font-bold text-gray-800 border-l border-gray-100">৳ 45,000</td>
              </tr>
              
              <tr className="hover:bg-gray-50">
                <td className="p-4 text-xs text-gray-500">Today, 10:23 AM</td>
                <td className="p-4 text-gray-800">Sale: Invoice #INV-001 (Rahim Uddin)</td>
                <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Sales</span></td>
                <td className="p-4 text-right font-medium text-green-600">৳ 1,200</td>
                <td className="p-4 text-right">-</td>
                <td className="p-4 text-right font-bold text-gray-800 border-l border-gray-100">৳ 45,850</td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="p-4 text-xs text-gray-500">Yesterday, 5:00 PM</td>
                <td className="p-4 text-gray-800">Due Collection from Mina Akter</td>
                <td className="p-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Collection</span></td>
                <td className="p-4 text-right font-medium text-green-600">৳ 2,500</td>
                <td className="p-4 text-right">-</td>
                <td className="p-4 text-right font-bold text-gray-800 border-l border-gray-100">৳ 44,650</td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="p-4 text-xs text-gray-500">Yesterday, 4:30 PM</td>
                <td className="p-4 text-gray-800">Purchase: Rice (50kg) from Karim Traders</td>
                <td className="p-4"><span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">Purchase</span></td>
                <td className="p-4 text-right">-</td>
                <td className="p-4 text-right font-medium text-red-600">৳ 3,200</td>
                <td className="p-4 text-right font-bold text-gray-800 border-l border-gray-100">৳ 42,150</td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
