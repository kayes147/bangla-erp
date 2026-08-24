import { CalendarRange, Plus, Check, X } from "lucide-react";

export default function LeaveManagement() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-pink-100 text-pink-600 rounded-lg">
            <CalendarRange size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Leave Management (ছুটি ব্যবস্থাপনা)</h1>
        </div>
        <button className="flex items-center space-x-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
          <Plus size={18} />
          <span>Apply for Leave</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-700">Recent Leave Requests</h2>
        </div>
        
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-white border-b border-gray-100">
            <tr>
              <th className="p-4 font-medium text-gray-700">Employee</th>
              <th className="p-4 font-medium text-gray-700">Leave Type</th>
              <th className="p-4 font-medium text-gray-700">Duration</th>
              <th className="p-4 font-medium text-gray-700">Reason</th>
              <th className="p-4 font-medium text-gray-700 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <tr className="hover:bg-gray-50">
              <td className="p-4 font-medium text-gray-800">Jobbar Ali</td>
              <td className="p-4">Sick Leave</td>
              <td className="p-4">Aug 25 - Aug 26 (2 Days)</td>
              <td className="p-4 text-gray-500">Fever and cold</td>
              <td className="p-4 flex justify-center space-x-2">
                <button className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200" title="Approve"><Check size={16}/></button>
                <button className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200" title="Reject"><X size={16}/></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
