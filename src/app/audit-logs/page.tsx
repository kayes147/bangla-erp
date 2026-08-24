import { ShieldAlert, Search, Filter } from "lucide-react";

export default function AuditLogs() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">System Audit Logs (কাজের হিস্ট্রি)</h1>
            <p className="text-sm text-gray-500 mt-1">Immutable record of all manager actions.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="relative w-72">
            <input type="text" placeholder="Search logs..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-800" />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50">
            <Filter size={16} /> <span>Filter</span>
          </button>
        </div>
        
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-white border-b border-gray-100">
            <tr>
              <th className="p-4 font-medium text-gray-700">Timestamp</th>
              <th className="p-4 font-medium text-gray-700">User / Manager</th>
              <th className="p-4 font-medium text-gray-700">Action</th>
              <th className="p-4 font-medium text-gray-700">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <tr className="hover:bg-gray-50">
              <td className="p-4 text-gray-500">Aug 24, 2026 - 10:30 AM</td>
              <td className="p-4 font-medium text-gray-800">Hasibul Islam</td>
              <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">CREATED_INVOICE</span></td>
              <td className="p-4 text-gray-600">Created Sales Invoice #INV-1002 for ৳ 12,000</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="p-4 text-gray-500">Aug 24, 2026 - 09:15 AM</td>
              <td className="p-4 font-medium text-gray-800">Hasibul Islam</td>
              <td className="p-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">UPDATED_STOCK</span></td>
              <td className="p-4 text-gray-600">Manually adjusted stock for "Radhuni Masala" (+10 Pcs)</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="p-4 text-gray-500">Aug 23, 2026 - 04:20 PM</td>
              <td className="p-4 font-medium text-gray-800">Hasibul Islam</td>
              <td className="p-4"><span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-bold">EXPENSE_REQUEST</span></td>
              <td className="p-4 text-gray-600">Requested ৳ 5,000 for Shop Repair</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
