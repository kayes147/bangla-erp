"use client";
import { useState } from "react";
import { UserPlus, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createEmployee } from "@/actions/employeeActions";

export default function AddNewEmployee() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("permanent");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");
  const [salaryAmount, setSalaryAmount] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !salaryAmount) return;

    if (phone.replace(/\D/g, "").length !== 11) {
      alert("মোবাইল নম্বর অবশ্যই ঠিক ১১ ডিজিটের হতে হবে (যেমন: 017XXXXXXXX)!");
      return;
    }

    setLoading(true);

    const res = await createEmployee({
      name,
      phone,
      type,
      designation,
      salaryAmount: parseFloat(salaryAmount) || 0
    });

    setLoading(false);
    if (res.success) {
      router.push("/salary");
    } else {
      alert("Error: " + res.error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-4">
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
        <Link href="/salary" className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="p-2 bg-pink-100 text-pink-600 rounded-lg">
          <UserPlus size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">নতুন কর্মী যোগ করুন <span className="text-sm font-normal text-gray-500">(Add New Employee)</span></h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Employee Type */}
          <div className="pb-6 border-b border-gray-100">
            <label className="block text-sm font-bold text-gray-700 mb-3">কাজের ধরন <span className="text-[10px] font-normal text-gray-400 uppercase">(Employment Type)</span></label>
            <div className="flex space-x-4">
              <label className={`flex items-center space-x-2 cursor-pointer p-3 border rounded-lg font-bold transition-colors ${type === 'permanent' ? 'border-pink-200 bg-pink-50 text-pink-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
                <input type="radio" name="emp_type" value="permanent" checked={type === 'permanent'} onChange={() => setType('permanent')} className="text-pink-600 focus:ring-pink-500 w-4 h-4" />
                <span>স্থায়ী কর্মী <span className="font-normal opacity-80">(Permanent)</span></span>
              </label>
              <label className={`flex items-center space-x-2 cursor-pointer p-3 border rounded-lg font-bold transition-colors ${type === 'daily' ? 'border-pink-200 bg-pink-50 text-pink-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
                <input type="radio" name="emp_type" value="daily" checked={type === 'daily'} onChange={() => setType('daily')} className="text-pink-600 focus:ring-pink-500 w-4 h-4" />
                <span>দিনমজুর <span className="font-normal opacity-80">(Daily Worker)</span></span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">নাম <span className="text-[10px] font-normal text-gray-400 uppercase">(Name)</span> <span className="text-red-500">*</span></label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Hasibul Islam" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all font-bold text-gray-800" required />
            </div>

            {/* Phone */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-gray-700">মোবাইল নম্বর <span className="text-[10px] font-normal text-gray-400 uppercase">(Phone)</span> <span className="text-red-500">*</span></label>
                <span className="text-xs font-mono font-bold text-gray-400">
                  {phone.length}/১১ ডিজিট
                </span>
              </div>
              <input 
                type="tel" 
                inputMode="numeric"
                maxLength={11}
                value={phone} 
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))} 
                placeholder="যেমন: 01700000000" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all font-bold text-gray-800 font-mono" 
                required 
              />
              <p className="text-[11px] text-gray-400 mt-1">শুধুমাত্র ১১টি ডিজিট (যেমন: 017XXXXXXXX)</p>
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">পদবি <span className="text-[10px] font-normal text-gray-400 uppercase">(Designation)</span></label>
              <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder={type === 'permanent' ? "e.g. Manager" : "e.g. Loader"} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all font-bold text-gray-800" />
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{type === 'permanent' ? 'মাসিক বেতন' : 'দৈনিক মজুরি'} <span className="text-[10px] font-normal text-gray-400 uppercase">({type === 'permanent' ? 'Monthly Salary' : 'Daily Wage'})</span> <span className="text-red-500">*</span></label>
              <input type="number" value={salaryAmount} onChange={(e) => setSalaryAmount(e.target.value)} placeholder="৳ 0.00" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all font-bold text-gray-900" required />
            </div>

          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end space-x-3">
            <Link href="/salary" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors text-sm">
              বাতিল <span className="font-normal opacity-80">(Cancel)</span>
            </Link>
            <button type="submit" disabled={loading} className="flex items-center space-x-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-sm text-sm">
              <Save size={20} />
              <span>{loading ? "Saving..." : "সেভ করুন (Save)"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
