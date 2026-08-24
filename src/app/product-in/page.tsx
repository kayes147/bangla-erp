"use client";
import { PackagePlus, Search, Save, Calendar, CalendarDays } from "lucide-react";
import { useState } from "react";

export default function ProductInPage() {
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pt-4">
      
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
          <PackagePlus size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">পণ্য ইন <span className="text-lg font-normal text-gray-500">(Product In)</span></h1>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 relative z-20">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Date */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">তারিখ <span className="text-[10px] font-normal text-gray-400 uppercase">(Date)</span></label>
              <div className="relative">
                <input 
                  type="date" 
                  className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-gray-700" 
                />
              </div>
            </div>

            {/* Supplier / Client */}
            <div className="relative">
              <label className="block text-sm font-bold text-gray-700 mb-2">মহাজন / সাপ্লায়ার <span className="text-[10px] font-normal text-gray-400 uppercase">(Supplier / Client)</span></label>
              <input 
                type="text" 
                placeholder="নাম বা মোবাইল নম্বর লিখুন..." 
                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" 
                onFocus={() => setShowSupplierDropdown(true)}
                onBlur={() => setTimeout(() => setShowSupplierDropdown(false), 200)}
                defaultValue="Karim"
              />
              
              {/* Dropdown UI Mockup */}
              {showSupplierDropdown && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                  <div className="p-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center border-b border-gray-100">
                    <div>
                      <p className="font-bold text-gray-800">Karim Traders</p>
                      <p className="text-xs text-gray-500">01822-XXXXXX</p>
                    </div>
                    <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded font-bold">Previous Due: ৳ 1,500</span>
                  </div>
                  <div className="p-3 hover:bg-emerald-50 cursor-pointer text-emerald-600 font-medium text-sm flex items-center">
                    + Add New Supplier &quot;Karim&quot;
                  </div>
                </div>
              )}
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">পণ্যের নাম <span className="text-[10px] font-normal text-gray-400 uppercase">(Product Name)</span></label>
              <input 
                type="text" 
                placeholder="Search or enter product name..." 
                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">পরিমাণ <span className="text-[10px] font-normal text-gray-400 uppercase">(Quantity)</span></label>
              <div className="flex space-x-2">
                <input 
                  type="number" 
                  placeholder="0" 
                  className="flex-1 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" 
                />
                <select className="w-24 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50">
                  <option>Pcs</option>
                  <option>Kg</option>
                  <option>Box</option>
                </select>
              </div>
            </div>

            {/* Buy Price Per Unit */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">কেনা দাম (প্রতি একক) <span className="text-[10px] font-normal text-gray-400 uppercase">(Buy Price Per Unit)</span></label>
              <input 
                type="number" 
                placeholder="৳ 0.00" 
                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>

            {/* Total Amount */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">মোট টাকা <span className="text-[10px] font-normal text-gray-400 uppercase">(Total Amount)</span></label>
              <input 
                type="number" 
                placeholder="৳ 0.00" 
                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 font-bold" 
                readOnly
              />
            </div>

            {/* Payment Status */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">পেমেন্ট স্ট্যাটাস <span className="text-[10px] font-normal text-gray-400 uppercase">(Payment Status)</span></label>
              <select className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500">
                <option>Paid (নগদ পরিশোধ)</option>
                <option>Due (বকেয়া)</option>
                <option>Partial (আংশিক পরিশোধ)</option>
              </select>
            </div>

            {/* Paid Amount */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">জমা দেওয়া টাকা <span className="text-[10px] font-normal text-gray-400 uppercase">(Paid Amount)</span></label>
              <input 
                type="number" 
                placeholder="৳ 0.00" 
                className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" 
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="button" className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-bold text-lg transition-colors shadow-sm">
              <Save size={20} />
              <span>সেভ করুন <span className="text-sm font-normal opacity-90">(Save Entry)</span></span>
            </button>
          </div>
        </form>
      </div>

      {/* History List Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative z-10">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="font-bold text-gray-800">পণ্য ক্রয়ের তালিকা <span className="text-xs font-normal text-gray-500">(Product In History)</span></h2>
          <div className="flex space-x-2">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search products..." 
                className="pl-8 pr-3 py-1.5 border border-gray-300 rounded text-sm outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <Search className="absolute left-2.5 top-2 text-gray-400" size={14} />
            </div>
            <button className="flex items-center space-x-1 px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">
              <CalendarDays size={14} />
              <span>Filter Date</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="p-4 font-bold text-gray-700">তারিখ <span className="text-[10px] font-normal text-gray-400 block uppercase">(Date)</span></th>
                <th className="p-4 font-bold text-gray-700">মহাজন <span className="text-[10px] font-normal text-gray-400 block uppercase">(Supplier)</span></th>
                <th className="p-4 font-bold text-gray-700">প্রোডাক্ট <span className="text-[10px] font-normal text-gray-400 block uppercase">(Product Name)</span></th>
                <th className="p-4 font-bold text-gray-700 text-center">পরিমাণ <span className="text-[10px] font-normal text-gray-400 block uppercase">(Qty)</span></th>
                <th className="p-4 font-bold text-gray-700 text-right">মোট টাকা <span className="text-[10px] font-normal text-gray-400 block uppercase">(Total Amount)</span></th>
                <th className="p-4 font-bold text-gray-700 text-right">স্ট্যাটাস / অ্যাকশন <span className="text-[10px] font-normal text-gray-400 block uppercase">(Status / Action)</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              
              <tr className="hover:bg-gray-50 transition-colors bg-orange-50/40">
                <td className="p-4 text-gray-500">
                  24 Aug 2026
                  <span className="block text-[10px] text-orange-600 font-bold">New Request</span>
                </td>
                <td className="p-4 font-bold text-gray-800">
                  Karim Traders <span className="text-xs font-normal text-gray-500 block">(Supplier)</span>
                </td>
                <td className="p-4 font-medium text-gray-800">Radhuni Masala 500g</td>
                <td className="p-4 text-center font-bold text-gray-800">50 Box</td>
                <td className="p-4 text-right font-medium">৳ 5,000</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-1 rounded text-xs font-bold transition-colors">
                      অ্যাপ্রুভ <span className="text-[8px] block font-normal">(Approve)</span>
                    </button>
                    <button className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-xs font-bold transition-colors">
                      বাতিল <span className="text-[8px] block font-normal">(Reject)</span>
                    </button>
                  </div>
                </td>
              </tr>
              
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-500">23 Aug 2026</td>
                <td className="p-4 font-medium text-gray-800">Mina Akter</td>
                <td className="p-4">Pran Mustard Oil 1L</td>
                <td className="p-4 text-center font-bold">120 Box</td>
                <td className="p-4 text-right font-medium">৳ 18,000</td>
                <td className="p-4 text-right">
                   <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Approved</span>
                </td>
              </tr>
              
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-500">21 Aug 2026</td>
                <td className="p-4 font-medium text-gray-800">Karim Traders</td>
                <td className="p-4">Fresh Atta 2kg</td>
                <td className="p-4 text-center font-bold">200 Kg</td>
                <td className="p-4 text-right font-medium">৳ 12,000</td>
                <td className="p-4 text-right">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Approved</span>
                </td>
              </tr>
              
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
