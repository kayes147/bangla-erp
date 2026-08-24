import Link from 'next/link';
import { Users, Search, Plus, UserPlus } from "lucide-react";

export default function Clients() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">গ্রাহক ও মহাজন <span className="text-lg font-normal text-gray-500">(Clients & Suppliers)</span></h1>
            <p className="text-sm text-gray-500 mt-1">Manage profiles and login access for your partners.</p>
          </div>
        </div>
        <Link href="/clients/new" className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
          <UserPlus size={20} />
          <span>নতুন যোগ করুন <span className="text-xs font-normal opacity-80">(Add New)</span></span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="নাম বা মোবাইল নম্বর দিয়ে খুঁজুন (Search...)" 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <select className="ml-4 p-2 border border-gray-300 rounded-lg outline-none text-sm bg-white">
            <option value="all">সবাই (All)</option>
            <option value="due">যাদের বাকী আছে (Due Only)</option>
            <option value="supplier">মহাজন (Suppliers)</option>
            <option value="customer">গ্রাহক (Customers)</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="p-4 font-medium text-gray-700">নাম <span className="text-[10px] font-normal text-gray-400 block uppercase">(Name)</span></th>
                <th className="p-4 font-medium text-gray-700">মোবাইল <span className="text-[10px] font-normal text-gray-400 block uppercase">(Phone)</span></th>
                <th className="p-4 font-medium text-gray-700">ধরন <span className="text-[10px] font-normal text-gray-400 block uppercase">(Type)</span></th>
                <th className="p-4 font-medium text-gray-700">লগইন অ্যাক্সেস <span className="text-[10px] font-normal text-gray-400 block uppercase">(Login Access)</span></th>
                <th className="p-4 font-medium text-gray-700">বর্তমান বকেয়া <span className="text-[10px] font-normal text-gray-400 block uppercase">(Current Due)</span></th>
                <th className="p-4 font-medium text-gray-700 text-right">অ্যাকশন <span className="text-[10px] font-normal text-gray-400 block uppercase">(Action)</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <p className="font-semibold text-gray-800">Rahim Uddin</p>
                  <p className="text-xs text-gray-500">Dhaka</p>
                </td>
                <td className="p-4 font-medium">01711-123456</td>
                <td className="p-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Customer</span></td>
                <td className="p-4">
                  <span className="text-xs text-gray-400 italic">No access</span>
                </td>
                <td className="p-4 font-bold text-red-600">৳ 500</td>
                <td className="p-4 text-right">
                  <button className="text-indigo-600 hover:underline font-medium text-sm">View Profile</button>
                </td>
              </tr>
              
              <tr className="hover:bg-gray-50 transition-colors bg-indigo-50/20">
                <td className="p-4">
                  <p className="font-semibold text-gray-800">Karim Traders</p>
                  <p className="text-xs text-gray-500">Chittagong</p>
                </td>
                <td className="p-4 font-medium">01822-654321</td>
                <td className="p-4"><span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">Supplier</span></td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Has Access</span>
                  <p className="text-[10px] text-gray-400 mt-1">ID: karim_t</p>
                </td>
                <td className="p-4 font-bold text-red-600">৳ 1,500</td>
                <td className="p-4 text-right">
                  <button className="text-indigo-600 hover:underline font-medium text-sm">View Profile</button>
                </td>
              </tr>

              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <p className="font-semibold text-gray-800">Mina Akter</p>
                  <p className="text-xs text-gray-500">Sylhet</p>
                </td>
                <td className="p-4 font-medium">01933-987654</td>
                <td className="p-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">Customer</span></td>
                <td className="p-4">
                  <button className="text-xs text-indigo-600 hover:underline font-medium">+ Create Login</button>
                </td>
                <td className="p-4 font-bold text-green-600">৳ 0</td>
                <td className="p-4 text-right">
                  <button className="text-indigo-600 hover:underline font-medium text-sm">View Profile</button>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
