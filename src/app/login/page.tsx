"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Lock, User, Building2, Eye, EyeOff, ShieldCheck, ArrowRight, UserCheck } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMsg("ভুল ইউজারনেম বা পাসওয়ার্ড! আবার চেষ্টা করুন।");
      } else {
        // Save Remember Me preference
        try {
          if (rememberMe) {
            localStorage.setItem("erp_remember_me", "true");
            sessionStorage.setItem("erp_session_active", "true");
            document.cookie = "erp_session_active=1; path=/; max-age=2592000; SameSite=Lax";
          } else {
            localStorage.removeItem("erp_remember_me");
            sessionStorage.setItem("erp_session_active", "true");
            document.cookie = "erp_session_active=1; path=/; SameSite=Lax";
          }
        } catch (storageErr) {
          console.warn("Storage write error:", storageErr);
        }

        const cleanUser = username.toLowerCase().trim();
        if (cleanUser === "kayes147@") {
          window.location.href = "/super-admin";
        } else {
          try {
            const sessionRes = await fetch("/api/auth/session");
            const sessionData = await sessionRes.json();
            if (sessionData?.user?.role === "CLIENT") {
              window.location.href = "/portal/dashboard";
            } else if (sessionData?.user?.role === "SUPER_ADMIN") {
              window.location.href = "/super-admin";
            } else {
              window.location.href = "/";
            }
          } catch {
            window.location.href = "/";
          }
        }
      }
    } catch (err: any) {
      setErrorMsg("লগইন করতে সমস্যা হচ্ছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-8 text-center bg-slate-50 border-b border-gray-100">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 size={32} />
          </div>
          <h1 className="text-2xl font-black text-gray-900">
            লগইন করুন <span className="text-blue-600">Bangla</span> ERP
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            আপনার ব্যবসার অ্যাকাউন্টে প্রবেশ করতে তথ্য দিন
          </p>
        </div>

        <div className="p-8 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-bold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                ইউজারনেম (Username)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. owner or manager"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 font-medium"
                  required
                />
                <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                পাসওয়ার্ড (Password)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 font-medium"
                  required
                />
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1 pb-1">
              <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer accent-blue-600"
                />
                <span className="text-xs sm:text-sm font-bold text-gray-700">
                  আমাকে মনে রাখুন (Remember Me)
                </span>
              </label>
              <span className="text-[11px] text-gray-400">
                {rememberMe ? "ডিভাইসে লগইন থাকবে" : "ব্রাউজার বন্ধ করলে লগআউট হবে"}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-md mt-2"
            >
              <span>{loading ? "প্রবেশ হচ্ছে..." : "প্রবেশ করুন (Sign In)"}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="text-center pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              নতুন প্রতিষ্ঠান নিবন্ধন করতে চান?{" "}
              <Link href="/register" className="font-bold text-blue-600 hover:underline">
                অ্যাকাউন্ট তৈরি করুন
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
