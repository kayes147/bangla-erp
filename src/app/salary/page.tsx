import { Users, UserPlus, Banknote, History, Search } from "lucide-react";
import Link from "next/link";

export default function Salary() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-pink-100 text-pink-600 rounded-lg">
            <Users size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Salary & Wages (বেতন ও মজুরি)</h1>
        </div>
        <div className="flex space-x-3">
          <Link href="/salary/new" className="flex items-center space-x-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm">
            <UserPlus size={18} />
            <span>Add Employee (কর্মচারী যোগ করুন)</span>
          </Link>
          <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm">
            <Banknote size={18} />
            <span>Pay Salary/Wage (বেতন দিন)</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="Search employee by name..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all text-sm"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <select className="ml-4 p-2 border border-gray-300 rounded-lg outline-none text-sm bg-white">
            <option value="all">All Employees (সবাই)</option>
            <option value="permanent">Permanent (স্থায়ী কর্মচারী)</option>
            <option value="daily">Daily Worker (দিনমজুর / খণ্ডকালীন)</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="p-4 font-medium text-gray-700">Employee Name (নাম)</th>
                <th className="p-4 font-medium text-gray-700">Phone (মোবাইল)</th>
                <th className="p-4 font-medium text-gray-700">Type (কাজের ধরন)</th>
                <th className="p-4 font-medium text-gray-700">Salary/Wage Amount</th>
                <th className="p-4 font-medium text-gray-700">Last Paid (শেষ পেমেন্ট)</th>
                <th className="p-4 font-medium text-gray-700 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <p className="font-semibold text-gray-800">Hasibul Islam</p>
                  <p className="text-xs text-gray-500">Manager</p>
                </td>
                <td className="p-4">01711-XXXXXX</td>
                <td className="p-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Permanent (স্থায়ী)</span></td>
                <td className="p-4">৳ 15,000 / Month</td>
                <td className="p-4 text-green-600">Aug 01, 2026</td>
                <td className="p-4 text-right flex justify-end space-x-2">
                  <button className="text-gray-500 hover:text-indigo-600" title="History"><History size={18}/></button>
                  <button className="text-green-600 hover:underline font-medium text-sm">Pay Now</button>
                </td>
              </tr>

              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <p className="font-semibold text-gray-800">Raju Ahmed</p>
                  <p className="text-xs text-gray-500">Salesman</p>
                </td>
                <td className="p-4">01822-XXXXXX</td>
                <td className="p-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Permanent (স্থায়ী)</span></td>
                <td className="p-4">৳ 10,000 / Month</td>
                <td className="p-4 text-red-500">July 01, 2026 (Due)</td>
                <td className="p-4 text-right flex justify-end space-x-2">
                  <button className="text-gray-500 hover:text-indigo-600" title="History"><History size={18}/></button>
                  <button className="text-green-600 hover:underline font-medium text-sm">Pay Now</button>
                </td>
              </tr>
              
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <p className="font-semibold text-gray-800">Jobbar Ali</p>
                  <p className="text-xs text-gray-500">Loader</p>
                </td>
                <td className="p-4">01933-XXXXXX</td>
                <td className="p-4"><span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">Daily (দিনমজুর)</span></td>
                <td className="p-4">৳ 500 / Day</td>
                <td className="p-4 text-green-600">Yesterday</td>
                <td className="p-4 text-right flex justify-end space-x-2">
                  <button className="text-gray-500 hover:text-indigo-600" title="History"><History size={18}/></button>
                  <button className="text-green-600 hover:underline font-medium text-sm">Pay Now</button>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
