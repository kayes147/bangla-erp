"use client";
import { useState } from "react";
import { UserPlus, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/actions/clientActions";

export default function AddNewClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("customer");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("0");
  const [balanceType, setBalanceType] = useState("none");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      name,
      phone,
      address,
      openingBalance
    });

    setLoading(false);
    if (res.success) {
      router.push("/clients");
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
        <Link href="/clients" className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
          <UserPlus size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">নতুন গ্রাহক/মহাজন যোগ করুন <span className="text-sm font-normal text-gray-500">(Add New Client/Supplier)</span></h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Client Type */}
          <div className="pb-6 border-b border-gray-100">
            <label className="block text-sm font-bold text-gray-700 mb-3">ধরন <span className="text-[10px] font-normal text-gray-400 uppercase">(Type)</span></label>
            <div className="flex space-x-4">
              <label className={`flex items-center space-x-2 cursor-pointer p-3 border rounded-lg font-bold transition-colors ${type === 'customer' ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
                <input type="radio" name="client_type" value="customer" checked={type === 'customer'} onChange={() => setType('customer')} className="text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
                <span>গ্রাহক <span className="font-normal opacity-80">(Customer)</span></span>
              </label>
              <label className={`flex items-center space-x-2 cursor-pointer p-3 border rounded-lg font-bold transition-colors ${type === 'supplier' ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
                <input type="radio" name="client_type" value="supplier" checked={type === 'supplier'} onChange={() => setType('supplier')} className="text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
                <span>মহাজন <span className="font-normal opacity-80">(Supplier)</span></span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">নাম <span className="text-[10px] font-normal text-gray-400 uppercase">(Name)</span> <span className="text-red-500">*</span></label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rahim Uddin" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-bold text-gray-800" required />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">মোবাইল নম্বর <span className="text-[10px] font-normal text-gray-400 uppercase">(Phone)</span> <span className="text-red-500">*</span></label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 01700000000" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-bold text-gray-800" required />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">ঠিকানা <span className="text-[10px] font-normal text-gray-400 uppercase">(Address)</span></label>
              <textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full address..." className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium text-gray-800"></textarea>
            </div>

            {/* Opening Balance */}
            <div className={balanceType === 'none' ? 'opacity-50' : ''}>
              <label className="block text-sm font-bold text-gray-700 mb-2">আগের বাকী <span className="text-[10px] font-normal text-gray-400 uppercase">(Previous Due)</span></label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} disabled={balanceType === 'none'} placeholder="৳ 0.00" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-bold text-gray-900 disabled:bg-gray-100" />
              <p className="text-[10px] text-gray-500 mt-1 uppercase font-medium">If they already owe you money or you owe them.</p>
            </div>

            {/* Balance Type */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">টাকার ধরন <span className="text-[10px] font-normal text-gray-400 uppercase">(Balance Type)</span></label>
              <select value={balanceType} onChange={(e) => setBalanceType(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-bold text-gray-800">
                <option value="none">কোনো পূর্বের বকেয়া নেই (No Previous Due)</option>
                <option value="receivable">আমি টাকা পাবো (I will get money)</option>
                <option value="payable">আমাকে টাকা দিতে হবে (I have to pay)</option>
              </select>
            </div>

          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end space-x-3">
            <Link href="/clients" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors text-sm">
              বাতিল <span className="font-normal opacity-80">(Cancel)</span>
            </Link>
            <button type="submit" disabled={loading} className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-sm text-sm">
              <Save size={20} />
              <span>{loading ? "Saving..." : "সেভ করুন (Save Details)"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
