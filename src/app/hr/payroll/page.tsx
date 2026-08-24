import { Banknote, FileText, Download } from "lucide-react";

export default function PayrollControl() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
            <Banknote size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Payroll Control (বেতন ও পে-রোল)</h1>
        </div>
        <button className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
          <FileText size={18} />
          <span>Generate Payslips</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium mb-1">Total Payroll (This Month)</h3>
          <p className="text-3xl font-bold text-gray-800">৳ 1,45,000</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium mb-1">Next Pay Date</h3>
          <p className="text-3xl font-bold text-gray-800">01 Sep, 2026</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between">
          <h2 className="font-semibold text-gray-700">Salary Statement - August 2026</h2>
          <button className="text-emerald-600 flex items-center space-x-1 text-sm font-medium hover:underline">
            <Download size={16} /> <span>Download PDF</span>
          </button>
        </div>
        
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-white border-b border-gray-100">
            <tr>
              <th className="p-4 font-medium text-gray-700">Employee</th>
              <th className="p-4 font-medium text-gray-700">Basic Salary</th>
              <th className="p-4 font-medium text-gray-700">Allowances</th>
              <th className="p-4 font-medium text-gray-700">Deductions</th>
              <th className="p-4 font-medium text-right text-gray-700">Net Payable</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <tr className="hover:bg-gray-50">
              <td className="p-4 font-medium text-gray-800">Hasibul Islam</td>
              <td className="p-4">৳ 15,000</td>
              <td className="p-4 text-green-600">+ ৳ 2,000</td>
              <td className="p-4 text-red-500">- ৳ 500</td>
              <td className="p-4 font-bold text-gray-800 text-right">৳ 16,500</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
