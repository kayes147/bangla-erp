"use client";
import { Package, Wallet, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function ClientDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">ড্যাশবোর্ড <span className="text-lg font-normal text-gray-500">(Dashboard)</span></h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, Karim Traders. Here is your business summary.</p>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Paid */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">মোট জমা <span className="text-[10px] font-normal text-gray-500 block uppercase">(Total Paid)</span></p>
            <p className="text-xl font-bold text-gray-900 mt-1">৳ 1,20,500</p>
          </div>
        </div>

        {/* Total Due to pay */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">বর্তমান বকেয়া <span className="text-[10px] font-normal text-gray-500 block uppercase">(Current Due)</span></p>
            <p className="text-xl font-bold text-gray-900 mt-1">৳ 15,200</p>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">পেন্ডিং রিকোয়েস্ট <span className="text-[10px] font-normal text-gray-500 block uppercase">(Pending Requests)</span></p>
            <p className="text-xl font-bold text-gray-900 mt-1">3 <span className="text-xs font-normal text-gray-500">(Pending)</span></p>
          </div>
        </div>

        {/* Accepted Approvals */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">গৃহীত রিকোয়েস্ট <span className="text-[10px] font-normal text-gray-500 block uppercase">(Approved Requests)</span></p>
            <p className="text-xl font-bold text-gray-900 mt-1">24 <span className="text-xs font-normal text-gray-500">(Approved)</span></p>
          </div>
        </div>
      </div>

      {/* Product Transactions Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <Package size={20} />
          </div>
          <h2 className="text-lg font-bold text-gray-800">প্রোডাক্ট লেনদেনের হিসাব <span className="text-sm font-normal text-gray-500">(Product Transactions)</span></h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
            <p className="text-gray-500 font-bold mb-2">আজকের লেনদেন <span className="text-[10px] block font-normal">(Daily)</span></p>
            <p className="text-2xl font-bold text-indigo-600">45 <span className="text-sm text-gray-500">Pcs</span></p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
            <p className="text-gray-500 font-bold mb-2">এই সপ্তাহের লেনদেন <span className="text-[10px] block font-normal">(Weekly)</span></p>
            <p className="text-2xl font-bold text-indigo-600">320 <span className="text-sm text-gray-500">Pcs</span></p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
            <p className="text-gray-500 font-bold mb-2">এই মাসের লেনদেন <span className="text-[10px] block font-normal">(Monthly)</span></p>
            <p className="text-2xl font-bold text-indigo-600">1,250 <span className="text-sm text-gray-500">Pcs</span></p>
          </div>
        </div>
      </div>

      {/* Transaction History & Correction Requests */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="font-bold text-gray-800">লেনদেনের হিস্ট্রি <span className="text-xs font-normal text-gray-500">(Transaction History)</span></h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="p-4 font-medium text-gray-700">তারিখ <span className="text-[10px] font-normal text-gray-400 block uppercase">(Date)</span></th>
                <th className="p-4 font-medium text-gray-700">প্রোডাক্ট <span className="text-[10px] font-normal text-gray-400 block uppercase">(Product)</span></th>
                <th className="p-4 font-medium text-gray-700">পরিমাণ <span className="text-[10px] font-normal text-gray-400 block uppercase">(Quantity)</span></th>
                <th className="p-4 font-medium text-gray-700">মোট টাকা <span className="text-[10px] font-normal text-gray-400 block uppercase">(Total Amount)</span></th>
                <th className="p-4 font-medium text-gray-700">অবস্থা <span className="text-[10px] font-normal text-gray-400 block uppercase">(Status)</span></th>
                <th className="p-4 font-medium text-right text-gray-700">অ্যাকশন <span className="text-[10px] font-normal text-gray-400 block uppercase">(Action)</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4">12 Oct 2026</td>
                <td className="p-4 font-medium text-gray-800">PR-A Grade Quality</td>
                <td className="p-4">50 Pcs</td>
                <td className="p-4 font-bold text-gray-800">৳ 25,000</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Approved</span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded text-xs font-bold transition-colors border border-orange-200">
                    ভুল সংশোধন রিকোয়েস্ট <span className="block text-[8px] font-normal">(Request Correction)</span>
                  </button>
                </td>
              </tr>
              
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4">15 Oct 2026</td>
                <td className="p-4 font-medium text-gray-800">PR-B Regular</td>
                <td className="p-4">100 Pcs</td>
                <td className="p-4 font-bold text-gray-800">৳ 30,000</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">Pending Approval</span>
                </td>
                <td className="p-4 text-right">
                  <span className="text-gray-400 text-xs italic">Pending...</span>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
