"use client";
import { useState } from "react";
import { Building2, Save, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/actions/clientActions";

export default function AddNewClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [type] = useState("supplier"); // Always standard company/institution
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("0");
  const [balanceType, setBalanceType] = useState("none");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("অনুগ্রহ করে প্রতিষ্ঠানের নাম লিখুন।");
      return;
    }

    if (!phone.trim()) {
      setErrorMessage("অনুগ্রহ করে মোবাইল নম্বর লিখুন।");
      return;
    }

    setLoading(true);

    let openingBalance = parseFloat(amount) || 0;
    if (balanceType === "none") {
      openingBalance = 0;
    } else if (balanceType === "payable") {
      openingBalance = -Math.abs(openingBalance);
    } else {
      openingBalance = Math.abs(openingBalance);
    }

    const res = await createClient({
      type,
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      openingBalance,
    });

    setLoading(false);
    if (res.success) {
      router.refresh();
      router.push("/clients");
    } else {
      setErrorMessage(res.error || "প্রতিষ্ঠান সংরক্ষণ করতে ব্যর্থ হয়েছে।");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
        <Link 
          href="/clients" 
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          title="তালিকায় ফিরে যান"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-xl shadow-2xs">
          <Building2 size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            নতুন প্রতিষ্ঠান যোগ করুন <span className="text-sm font-normal text-gray-500">(Add New Company)</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">নতুন প্রতিষ্ঠানের তথ্য ও পূর্বের বকেয়া হিসাব এন্ট্রি করুন।</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 text-red-700 text-sm font-bold">
            <AlertCircle size={20} className="shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Name */}
            <div>
              <label className="block text-sm font-extrabold text-gray-900 mb-2">
                প্রতিষ্ঠানের নাম <span className="text-[10px] font-normal text-gray-400 uppercase">(Company Name)</span> <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="যেমন: মেসার্স রহিম ট্রেডার্স" 
                className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-bold text-gray-950 bg-white" 
                required 
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-extrabold text-gray-900 mb-2">
                মোবাইল নম্বর <span className="text-[10px] font-normal text-gray-400 uppercase">(Phone)</span> <span className="text-red-500">*</span>
              </label>
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="যেমন: 01700000000" 
                className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-bold text-gray-950 bg-white" 
                required 
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-extrabold text-gray-900 mb-2">
                ঠিকানা <span className="text-[10px] font-normal text-gray-400 uppercase">(Address)</span>
              </label>
              <textarea 
                rows={2} 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                placeholder="প্রতিষ্ঠানের সম্পূর্ণ ঠিকানা লিখুন..." 
                className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium text-gray-950 bg-white"
              />
            </div>

            {/* Opening Balance */}
            <div className={balanceType === 'none' ? 'opacity-60' : ''}>
              <label className="block text-sm font-extrabold text-gray-900 mb-2">
                আগের বাকী <span className="text-[10px] font-normal text-gray-400 uppercase">(Previous Due)</span>
              </label>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                disabled={balanceType === 'none'} 
                placeholder="৳ 0.00" 
                className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-black text-gray-950 bg-white disabled:bg-gray-100 disabled:text-gray-400" 
              />
              <p className="text-xs text-gray-500 mt-1 font-medium">পূর্বের কোনো দেনা বা পাওনা বকেয়া থাকলে তা উল্লেখ করুন।</p>
            </div>

            {/* Balance Type */}
            <div>
              <label className="block text-sm font-extrabold text-gray-900 mb-2">
                টাকার ধরন <span className="text-[10px] font-normal text-gray-400 uppercase">(Balance Type)</span>
              </label>
              <select 
                value={balanceType} 
                onChange={(e) => setBalanceType(e.target.value)} 
                className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-bold text-gray-950 bg-white cursor-pointer"
              >
                <option value="none">কোনো পূর্বের বকেয়া নেই (No Previous Due)</option>
                <option value="receivable">আমি টাকা পাবো (পাওনা বকেয়া)</option>
                <option value="payable">আমাকে টাকা দিতে হবে (দেনা বকেয়া)</option>
              </select>
            </div>

          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end space-x-3">
            <Link 
              href="/clients" 
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors text-sm"
            >
              বাতিল <span className="font-normal opacity-80">(Cancel)</span>
            </Link>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-6 py-3 rounded-xl font-extrabold transition-all shadow-sm text-sm cursor-pointer"
            >
              <Save size={18} />
              <span>{loading ? "সংরক্ষণ করা হচ্ছে..." : "প্রতিষ্ঠান সংরক্ষণ করুন"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
