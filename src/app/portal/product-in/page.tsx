"use client";
import { PackagePlus, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ClientProductInList() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pt-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-6 rounded-xl text-white shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <PackagePlus size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">প্রাপ্ত প্রোডাক্টের তালিকা <span className="text-lg font-normal opacity-80">(Received Products)</span></h1>
            <p className="text-emerald-100 text-sm mt-1">কোম্পানির পাঠানো প্রোডাক্টগুলো রিসিভ করুন <span className="opacity-70">(Accept products sent by the owner)</span>.</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-emerald-100">লগইন করা আছে <span className="text-[10px] uppercase">(Logged in as)</span></p>
          <p className="font-bold">Karim Traders</p>
        </div>
      </div>

      {/* Pending Deliveries Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-emerald-50/50 flex justify-between items-center">
          <h2 className="font-bold text-gray-800">অপেক্ষমাণ রিকোয়েস্ট <span className="text-xs font-normal text-gray-500">(Pending Deliveries)</span></h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="p-4 font-bold text-gray-700">তারিখ <span className="text-[10px] font-normal text-gray-400 block uppercase">(Date)</span></th>
                <th className="p-4 font-bold text-gray-700">প্রোডাক্টের নাম <span className="text-[10px] font-normal text-gray-400 block uppercase">(Product Name)</span></th>
                <th className="p-4 font-bold text-gray-700">পরিমাণ <span className="text-[10px] font-normal text-gray-400 block uppercase">(Quantity)</span></th>
                <th className="p-4 font-bold text-gray-700">মোট দাম <span className="text-[10px] font-normal text-gray-400 block uppercase">(Total Price)</span></th>
                <th className="p-4 font-bold text-gray-700">নোট <span className="text-[10px] font-normal text-gray-400 block uppercase">(Notes)</span></th>
                <th className="p-4 font-bold text-right text-gray-700">অ্যাকশন <span className="text-[10px] font-normal text-gray-400 block uppercase">(Action)</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              
              <tr className="hover:bg-gray-50 transition-colors bg-orange-50/30">
                <td className="p-4">24 Aug 2026</td>
                <td className="p-4 font-bold text-gray-800">Pran Mustard Oil 1L</td>
                <td className="p-4">120 Box</td>
                <td className="p-4 font-bold text-gray-800">৳ 18,000</td>
                <td className="p-4 text-xs text-gray-500">Sent via truck.</td>
                <td className="p-4 text-right">
                  <button className="flex items-center justify-end space-x-1 ml-auto bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors">
                    <CheckCircle size={14} />
                    <span>বুঝে পেয়েছি <span className="text-[8px] font-normal opacity-80">(Accept)</span></span>
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-gray-50 transition-colors bg-orange-50/30">
                <td className="p-4">23 Aug 2026</td>
                <td className="p-4 font-bold text-gray-800">Radhuni Masala 500g</td>
                <td className="p-4">50 Box</td>
                <td className="p-4 font-bold text-gray-800">৳ 5,000</td>
                <td className="p-4 text-xs text-gray-500">-</td>
                <td className="p-4 text-right">
                  <button className="flex items-center justify-end space-x-1 ml-auto bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors">
                    <CheckCircle size={14} />
                    <span>বুঝে পেয়েছি <span className="text-[8px] font-normal opacity-80">(Accept)</span></span>
                  </button>
                </td>
              </tr>
              
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
