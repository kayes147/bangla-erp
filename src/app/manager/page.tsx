"use client";
import { PackagePlus, PackageMinus, TrendingUp, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

export default function ManagerDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pt-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">ম্যানেজার ড্যাশবোর্ড <span className="text-lg font-normal text-gray-500">(Manager Dashboard)</span></h1>
          <p className="text-sm text-gray-500 mt-1">Welcome, Hasibul Islam. Here is your daily overview.</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-lg text-sm font-medium text-indigo-700 flex items-center">
          <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
          Manager View
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <PackageMinus size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">আজকের সেল <span className="text-[10px] font-normal text-gray-500 block uppercase">(Today's Sales)</span></p>
            <p className="text-xl font-bold text-gray-900 mt-1">৳ 45,000</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <PackagePlus size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">আজকের ক্রয় <span className="text-[10px] font-normal text-gray-500 block uppercase">(Today's Product In)</span></p>
            <p className="text-xl font-bold text-gray-900 mt-1">৳ 25,000</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">অপেক্ষমাণ কাজ <span className="text-[10px] font-normal text-gray-500 block uppercase">(Pending Tasks)</span></p>
            <p className="text-xl font-bold text-gray-900 mt-1">5 <span className="text-xs font-normal text-gray-500">requests</span></p>
          </div>
        </div>
      </div>

      {/* Split Layout for Requests */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        
        {/* 1. Client Requests (Manager CAN approve these) */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-orange-50/50 flex justify-between items-center">
            <div>
              <h2 className="font-bold text-gray-800">গ্রাহকের রিকোয়েস্ট <span className="text-xs font-normal text-gray-500 ml-1">(Client Requests)</span></h2>
              <p className="text-xs text-gray-500 mt-0.5">You can review and approve these.</p>
            </div>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">2 Pending</span>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm text-gray-600">
              <tbody className="divide-y divide-gray-50">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-gray-800">Karim Traders <span className="text-xs font-normal text-gray-400">(Product In)</span></p>
                    <p className="text-xs text-gray-500 mt-1">Radhuni Masala 500g • 50 Box</p>
                    <p className="text-[10px] text-orange-600 font-bold mt-1">Sent: 10 mins ago</p>
                  </td>
                  <td className="p-4 text-right align-middle">
                    <Link href="/product-in" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors">
                      Review & Approve &rarr;
                    </Link>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-gray-800">Rahim Uddin <span className="text-xs font-normal text-gray-400">(Product Out)</span></p>
                    <p className="text-xs text-gray-500 mt-1">Fresh Atta 2kg • 10 Kg</p>
                    <p className="text-[10px] text-orange-600 font-bold mt-1">Sent: 2 hours ago</p>
                  </td>
                  <td className="p-4 text-right align-middle">
                    <Link href="/product-out" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors">
                      Review & Approve &rarr;
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Manager's Own Requests sent to Owner (Manager CANNOT approve these) */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-blue-50/50 flex justify-between items-center">
            <div>
              <h2 className="font-bold text-gray-800">আমার পাঠানো রিকোয়েস্ট <span className="text-xs font-normal text-gray-500 ml-1">(My Requests to Owner)</span></h2>
              <p className="text-xs text-gray-500 mt-0.5">Track approvals from the company owner.</p>
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-white border-b border-gray-50">
                <tr>
                  <th className="px-4 py-2 font-medium text-gray-500 text-xs">Request Type</th>
                  <th className="px-4 py-2 font-medium text-gray-500 text-xs">Details</th>
                  <th className="px-4 py-2 font-medium text-gray-500 text-xs text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                
                {/* Pending Request */}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-800 text-xs">Cash Withdrawal</td>
                  <td className="p-4">
                    <p className="text-xs text-gray-600">৳ 5,000 for office maintenance.</p>
                    <p className="text-[10px] text-gray-400 mt-1">Sent: Today</p>
                  </td>
                  <td className="p-4 text-right">
                    <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-[10px] font-bold">
                      <Clock size={10} className="mr-1" /> Pending
                    </span>
                  </td>
                </tr>

                {/* Approved Request */}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-800 text-xs">Correction Edit</td>
                  <td className="p-4">
                    <p className="text-xs text-gray-600">Fixed typo in Invoice #1023</p>
                    <p className="text-[10px] text-gray-400 mt-1">Sent: Yesterday</p>
                  </td>
                  <td className="p-4 text-right">
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded text-[10px] font-bold">
                      <CheckCircle size={10} className="mr-1" /> Approved
                    </span>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
