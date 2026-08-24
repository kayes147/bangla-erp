"use client";
import Link from "next/link";
import { Plus, Building2, CloudUpload, ArrowRight } from "lucide-react";

export default function SelectCompany() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white border border-gray-200 rounded-xl p-8 lg:p-12 shadow-xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-gray-200 pb-8">
          <div>
            <p className="text-xs font-bold text-blue-600 tracking-widest uppercase mb-2">ধাপ ১ <span className="text-[10px] font-normal opacity-80">(Step 1)</span></p>
            <h1 className="text-3xl font-bold text-gray-900">
              কোম্পানি নির্বাচন করুন <span className="text-xl font-normal text-gray-500 block sm:inline mt-1 sm:mt-0">(Select Company)</span>
            </h1>
          </div>
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors whitespace-nowrap">
            <Plus size={16} />
            <span>নতুন কোম্পানি <span className="text-xs font-normal opacity-80">(New Company)</span></span>
          </button>
        </div>

        {/* Company Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Company 1 */}
          <div className="bg-slate-50 rounded-xl p-8 border border-gray-200 shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md hover:border-blue-300">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-blue-300 bg-blue-100 flex flex-col items-center justify-center mb-6 text-blue-700">
              <Building2 size={28} strokeWidth={1.5} />
              <span className="text-[10px] font-bold mt-1">BF</span>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              বলাকা ফার্নিচার <span className="text-sm font-medium text-gray-500 block mt-1">(BOLAKA FURNITURE)</span>
            </h2>
            <p className="text-sm font-bold text-gray-600 mt-4 mb-6">
              ২ টি ব্যবসায়িক বিভাগ <span className="text-[10px] text-gray-400 block uppercase mt-0.5">(2 BUSINESS DIVISIONS)</span>
            </p>
            
            <Link href="/" className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg text-sm font-bold transition-colors mb-4">
              <span>প্রবেশ করুন <span className="text-xs font-normal opacity-70">(Enter)</span></span>
              <ArrowRight size={16} />
            </Link>
            
            <button className="flex items-center justify-center space-x-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              <CloudUpload size={16} />
              <span>লোগো আপলোড <span className="text-xs font-normal text-gray-400">(Upload Logo)</span></span>
            </button>
          </div>

          {/* Company 2 */}
          <div className="bg-slate-50 rounded-xl p-8 border border-gray-200 shadow-sm flex flex-col items-center text-center transition-all hover:shadow-md hover:border-blue-300">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-blue-300 bg-blue-100 flex flex-col items-center justify-center mb-6 text-blue-700">
              <Building2 size={28} strokeWidth={1.5} />
              <span className="text-[10px] font-bold mt-1">FAC</span>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              বলাকা ফ্যাক্টরি <span className="text-sm font-medium text-gray-500 block mt-1">(BOLAKA FACTORY)</span>
            </h2>
            <p className="text-sm font-bold text-gray-600 mt-4 mb-6">
              ১ টি ব্যবসায়িক বিভাগ <span className="text-[10px] text-gray-400 block uppercase mt-0.5">(1 BUSINESS DIVISIONS)</span>
            </p>
            
            <Link href="/" className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg text-sm font-bold transition-colors mb-4">
              <span>প্রবেশ করুন <span className="text-xs font-normal opacity-70">(Enter)</span></span>
              <ArrowRight size={16} />
            </Link>
            
            <button className="flex items-center justify-center space-x-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              <CloudUpload size={16} />
              <span>লোগো আপলোড <span className="text-xs font-normal text-gray-400">(Upload Logo)</span></span>
            </button>
          </div>

        </div>

        {/* Footer Text */}
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-gray-500 font-medium">
            আপনি আজ যে প্রতিষ্ঠানে কাজ করতে চান তা বেছে নিন 
            <span className="text-sm text-gray-400 block mt-0.5">(Choose the business entity you want to operate in today)</span>
          </p>
        </div>

      </div>
    </div>
  );
}
