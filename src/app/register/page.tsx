"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Lock, 
  User, 
  Building2, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Phone, 
  MapPin, 
  Camera, 
  X, 
  UserCheck, 
  ChevronDown, 
  ChevronUp,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { registerUser } from "@/actions/authActions";
import { compressImageFile } from "@/lib/imageUtils";

export default function Register() {
  // Owner info
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [ownerImage, setOwnerImage] = useState<string | null>(null);

  // Company info
  const [companyName, setCompanyName] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [showMoreCompanyDetails, setShowMoreCompanyDetails] = useState(false);

  // Optional Manager info
  const [hasManager, setHasManager] = useState(false);
  const [managerUsername, setManagerUsername] = useState("");
  const [managerPassword, setManagerPassword] = useState("");
  const [showManagerPassword, setShowManagerPassword] = useState(false);
  const [managerImage, setManagerImage] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImageUpload = async (
    file: File,
    setter: (val: string | null) => void
  ) => {
    try {
      const compressed = await compressImageFile(file, 400, 400, 0.82);
      setter(compressed);
    } catch (err: any) {
      alert(err.message || "ছবি আপলোড করতে ব্যর্থ হয়েছে");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      alert("প্রতিষ্ঠানের নাম দিন!");
      return;
    }

    if (companyPhone.trim() && companyPhone.trim().length !== 11) {
      alert("কোম্পানির মোবাইল নম্বর অবশ্যই ঠিক ১১ ডিজিটের হতে হবে (যেমন: 019XXXXXXXX)!");
      return;
    }

    if (hasManager) {
      if (!managerUsername.trim()) {
        alert("ম্যানেজারের জন্য ইউজারনেম দিন!");
        return;
      }
      if (!managerPassword || managerPassword.length < 3) {
        alert("ম্যানেজারের জন্য ন্যূনতম ৩ অক্ষরের পাসওয়ার্ড দিন!");
        return;
      }
    }

    setLoading(true);

    try {
      const res = await registerUser({
        name,
        username,
        password,
        ownerImage,
        companyName,
        companyPhone: companyPhone.trim() || null,
        companyAddress: companyAddress.trim() || null,
        companyLogo,
        hasManager,
        managerUsername: hasManager ? managerUsername : null,
        managerPassword: hasManager ? managerPassword : null,
        managerImage: hasManager ? managerImage : null,
        role: "OWNER",
      });

      if (res.success) {
        // Cache initial company logo & name if available
        try {
          if (companyLogo) localStorage.setItem("erp_business_logo", companyLogo);
          localStorage.setItem("erp_business_name", companyName.trim() || "BOLAKA FACTORY");
          if (companyPhone) localStorage.setItem("erp_business_phone", companyPhone.trim());
          if (companyAddress) localStorage.setItem("erp_business_address", companyAddress.trim());
        } catch (e) {}

        alert("অ্যাকাউন্ট ও কোম্পানি প্রোফাইল সফলভাবে তৈরি হয়েছে! এখন লগইন করুন।");
        router.push("/login");
      } else {
        alert(res.error || "রেজিস্ট্রেশন ব্যর্থ হয়েছে");
      }
    } catch (err: any) {
      alert(err.message || "একটি ত্রুটি ঘটেছে!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:py-10">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-800">
        
        {/* Header */}
        <div className="p-6 sm:p-8 text-center bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative">
          <div className="w-16 h-16 bg-blue-600/30 border border-blue-500/40 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Building2 size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Create Account & Company</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            মালিক ও ব্যবসা প্রতিষ্ঠানের পূর্ণাঙ্গ প্রোফাইল সেটআপ — <span className="text-blue-400 font-bold">Bangla ERP</span>
          </p>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8 space-y-6">
          <form onSubmit={handleRegister} className="space-y-6">

            {/* SECTION 1: OWNER INFORMATION */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">১</span>
                  <h3 className="font-bold text-slate-800 text-base">মালিকের অ্যাকাউন্ট তথ্য (Owner Account)</h3>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">বাধ্যতামূলক</span>
              </div>

              {/* Owner Photo */}
              <div className="flex items-center gap-4 pt-1">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                    {ownerImage ? (
                      <img src={ownerImage} alt="Owner" className="w-full h-full object-cover" />
                    ) : (
                      <User size={28} className="text-slate-400" />
                    )}
                  </div>
                  {ownerImage && (
                    <button
                      type="button"
                      onClick={() => setOwnerImage(null)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors"
                      title="ছবি মুছুন"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
                <div>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-xs transition-colors">
                    <Camera size={14} className="text-blue-600" />
                    <span>{ownerImage ? "ছবি পরিবর্তন" : "মালিকের ছবি যোগ করুন"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, setOwnerImage);
                      }}
                    />
                  </label>
                  <p className="text-[11px] text-slate-500 mt-1">ঐচ্ছিক (পরবর্তীতেও যোগ বা পরিবর্তন করা যাবে)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">পূর্ণ নাম (Full Name)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="যেমন: হাসিবুল ইসলাম"
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 font-medium" 
                      required
                    />
                    <User className="absolute left-3 top-3 text-slate-400" size={16} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ইউজারনেম (Username)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="যেমন: owner123"
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 font-medium" 
                      required
                    />
                    <ShieldCheck className="absolute left-3 top-3 text-slate-400" size={16} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">পাসওয়ার্ড (Password)</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="পাসওয়ার্ড লিখুন"
                    className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 font-medium" 
                    required
                  />
                  <Lock className="absolute left-3 top-3 text-slate-400" size={16} />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 2: COMPANY PROFILE INFORMATION */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">২</span>
                  <h3 className="font-bold text-slate-800 text-base">প্রতিষ্ঠানের তথ্য (Company Profile)</h3>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  নাম বাদে বাকি তথ্য ঐচ্ছিক
                </span>
              </div>

              {/* Company Logo & Name */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-white border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0 shadow-sm p-1">
                    {companyLogo ? (
                      <img src={companyLogo} alt="Company Logo" className="w-full h-full object-contain rounded-xl" />
                    ) : (
                      <Building2 size={26} className="text-slate-400" />
                    )}
                  </div>
                  {companyLogo && (
                    <button
                      type="button"
                      onClick={() => setCompanyLogo(null)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors"
                      title="লোগো মুছুন"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    কোম্পানি / কারখানার নাম <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="যেমন: BOLAKA FACTORY"
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800 font-bold" 
                      required
                    />
                    <Building2 className="absolute left-3 top-3 text-slate-400" size={16} />
                  </div>
                </div>
              </div>

              {/* Company Logo Upload Button */}
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-xs transition-colors">
                  <Camera size={14} className="text-indigo-600" />
                  <span>{companyLogo ? "লোগো পরিবর্তন" : "কোম্পানি লোগো আপলোড"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, setCompanyLogo);
                    }}
                  />
                </label>
                <span className="text-[11px] text-slate-500">
                  লোগো না দিলেও হবে (পরে দেওয়া যাবে)
                </span>
              </div>

              {/* Expandable/Optional Company Details */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowMoreCompanyDetails(!showMoreCompanyDetails)}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 focus:outline-none"
                >
                  <span>{showMoreCompanyDetails ? "ফোন ও ঠিকানা লুকাতে ক্লিক করুন" : "+ কোম্পানির ফোন ও ঠিকানা যোগ করুন (ঐচ্ছিক)"}</span>
                  {showMoreCompanyDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {showMoreCompanyDetails && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-200">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-700">কোম্পানির মোবাইল নম্বর</label>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {companyPhone.length}/১১ ডিজিট
                        </span>
                      </div>
                      <div className="relative">
                        <input 
                          type="tel" 
                          inputMode="numeric"
                          maxLength={11}
                          value={companyPhone}
                          onChange={(e) => setCompanyPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                          placeholder="যেমন: 01954223347"
                          className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800 font-medium font-mono" 
                        />
                        <Phone className="absolute left-3 top-3 text-slate-400" size={16} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">কোম্পানির ঠিকানা</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={companyAddress}
                          onChange={(e) => setCompanyAddress(e.target.value)}
                          placeholder="যেমন: ঢাকা, বাংলাদেশ"
                          className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-800 font-medium" 
                        />
                        <MapPin className="absolute left-3 top-3 text-slate-400" size={16} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-2.5 text-[11px] text-indigo-900 flex items-center gap-2">
                <Sparkles size={14} className="text-indigo-600 shrink-0" />
                <span>কোম্পানির ফুল ডিটেইলস এখন না দিলেও অ্যাকাউন্ট তৈরি হবে। পরবর্তীতে ড্যাশবোর্ড থেকে যেকোনো সময় এডিট করা যাবে।</span>
              </div>
            </div>

            {/* SECTION 3: MANAGER SETUP (OWNER DECISION) */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold">৩</span>
                  <h3 className="font-bold text-slate-800 text-base">ম্যানেজার অ্যাকাউন্ট (ওনারের সিদ্ধান্ত)</h3>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900">ঐচ্ছিক</span>
              </div>

              {/* Toggle switch for manager */}
              <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                <input 
                  type="checkbox"
                  checked={hasManager}
                  onChange={(e) => setHasManager(e.target.checked)}
                  className="w-5 h-5 text-amber-600 rounded border-gray-300 focus:ring-amber-500 cursor-pointer"
                />
                <div className="flex-1">
                  <span className="text-sm font-bold text-slate-800">আপনি কি এখনই একজন ম্যানেজার যোগ করতে চান?</span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    টিক না দিলেও চলবে, ওনার হিসেবে পরবর্তীতেও যেকোনো সময় কোম্পানি প্রোফাইল থেকে ম্যানেজার যোগ করতে পারবেন।
                  </p>
                </div>
              </label>

              {/* If Manager Toggle is ON */}
              {hasManager && (
                <div className="p-4 bg-white rounded-2xl border border-amber-200 space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-xs pb-1 border-b border-amber-100">
                    <UserCheck size={16} />
                    <span>ম্যানেজারের লগইন তথ্য ও প্রোফাইল ছবি</span>
                  </div>

                  {/* Manager Photo */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                        {managerImage ? (
                          <img src={managerImage} alt="Manager" className="w-full h-full object-cover" />
                        ) : (
                          <User size={24} className="text-slate-400" />
                        )}
                      </div>
                      {managerImage && (
                        <button
                          type="button"
                          onClick={() => setManagerImage(null)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors"
                          title="ছবি মুছুন"
                        >
                          <X size={10} />
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-xs transition-colors">
                        <Camera size={13} className="text-amber-600" />
                        <span>{managerImage ? "ছবি পরিবর্তন" : "ম্যানেজার ছবি আপলোড"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, setManagerImage);
                          }}
                        />
                      </label>
                      <p className="text-[11px] text-slate-500 mt-0.5">ম্যানেজারের প্রোফাইল ফটো (ঐচ্ছিক)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ম্যানেজার ইউজারনেম <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={managerUsername}
                          onChange={(e) => setManagerUsername(e.target.value)}
                          placeholder="যেমন: manager1"
                          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-800 font-medium" 
                          required={hasManager}
                        />
                        <ShieldCheck className="absolute left-3 top-2.5 text-slate-400" size={16} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ম্যানেজার পাসওয়ার্ড <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input 
                          type={showManagerPassword ? "text" : "password"} 
                          value={managerPassword}
                          onChange={(e) => setManagerPassword(e.target.value)}
                          placeholder="পাসওয়ার্ড লিখুন"
                          className="w-full pl-9 pr-10 py-2 text-sm border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-800 font-medium" 
                          required={hasManager}
                        />
                        <Lock className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <button 
                          type="button" 
                          onClick={() => setShowManagerPassword(!showManagerPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                          {showManagerPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black rounded-xl transition-all shadow-lg text-sm sm:text-base cursor-pointer disabled:opacity-50"
            >
              <Building2 size={20} />
              <span>{loading ? "প্রোফাইল তৈরি হচ্ছে..." : "অ্যাকাউন্ট ও কোম্পানি প্রোফাইল তৈরি করুন"}</span>
            </button>
          </form>
          
          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-sm text-slate-600">
              ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
              <Link href="/login" className="font-bold text-blue-600 hover:text-blue-800 transition-colors">
                লগইন করুন (Sign In)
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

