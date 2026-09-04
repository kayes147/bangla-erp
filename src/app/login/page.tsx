"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Lock, User, Building2, Eye, EyeOff, ShieldCheck, ArrowRight, UserCheck, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  // Load remembered username if Remember Me was previously active
  useEffect(() => {
    try {
      const isRemembered = localStorage.getItem("erp_remember_me") === "true";
      const savedUser = localStorage.getItem("erp_saved_username");
      if (isRemembered && savedUser) {
        setUsername(savedUser);
        setRememberMe(true);
      }
    } catch (e) {
      console.warn("Storage read error:", e);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        username: username.trim(),
        password: password.trim(),
        redirect: false,
      });

      if (res?.error) {
        setErrorMsg("ভুল ইউজারনেম বা পাসওয়ার্ড! আবার চেষ্টা করুন।");
        setLoading(false);
      } else {
        // Login Successful: Show prominent redirecting loader
        setIsRedirecting(true);

        // Save Remember Me preference
        try {
          if (rememberMe) {
            localStorage.setItem("erp_remember_me", "true");
            localStorage.setItem("erp_saved_username", username.trim());
            document.cookie = "erp_remember_me=1; path=/; max-age=2592000; SameSite=Lax";
          } else {
            localStorage.removeItem("erp_remember_me");
            localStorage.removeItem("erp_saved_username");
            document.cookie = "erp_remember_me=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          }
        } catch (storageErr) {
          console.warn("Storage write error:", storageErr);
        }

        const cleanUser = username.toLowerCase().trim();
        if (cleanUser === "kayes147@") {
          router.replace("/super-admin");
          router.refresh();
        } else if (cleanUser === "owner" || cleanUser === "manager") {
          router.replace("/");
          router.refresh();
        } else {
          try {
            const sessionRes = await fetch("/api/auth/session");
            const sessionData = await sessionRes.json();
            if (sessionData?.user?.role === "CLIENT") {
              router.replace("/portal/dashboard");
            } else if (sessionData?.user?.role === "SUPER_ADMIN") {
              router.replace("/super-admin");
            } else {
              router.replace("/");
            }
          } catch {
            router.replace("/");
          }
          router.refresh();
        }
      }
    } catch (err: any) {
      setErrorMsg("লগইন করতে সমস্যা হচ্ছে। সার্ভার বা নেটওয়ার্ক সংযোগ যাচাই করুন।");
      setLoading(false);
      setIsRedirecting(false);
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
                  disabled={loading || isRedirecting}
                  placeholder="e.g. owner or manager"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 font-medium disabled:bg-gray-100 disabled:text-gray-500"
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
                  disabled={loading || isRedirecting}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 font-medium disabled:bg-gray-100 disabled:text-gray-500"
                  required
                />
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading || isRedirecting}
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
                  disabled={loading || isRedirecting}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer accent-blue-600"
                />
                <span className="text-xs sm:text-sm font-bold text-gray-700">
                  আমাকে মনে রাখুন (Remember Me)
                </span>
              </label>
              <span className="text-[11px] text-gray-400">
                {rememberMe ? "ডিভাইসে তথ্য মনে থাকবে" : "স্বাভাবিক লগইন"}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || isRedirecting}
              className="w-full flex items-center justify-center space-x-2.5 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold rounded-lg transition-all shadow-md mt-2 text-base cursor-pointer disabled:cursor-not-allowed"
            >
              {loading || isRedirecting ? (
                <>
                  <Loader2 className="animate-spin text-white" size={20} />
                  <span>যাচাই ও প্রবেশ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <span>প্রবেশ করুন (Sign In)</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Full-Screen Loading Overlay on Successful Login */}
          {isRedirecting && (
            <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-slate-900 border-2 border-blue-500/40 rounded-2xl p-8 shadow-2xl flex flex-col items-center space-y-4 max-w-sm w-full text-center">
                <div className="relative flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
                  <UserCheck className="absolute text-emerald-400" size={28} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-white font-black text-lg">লগইন সফল হয়েছে!</h3>
                  <p className="text-blue-200 text-xs">ড্যাশবোর্ডে প্রবেশ করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</p>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full w-full animate-pulse" />
                </div>
              </div>
            </div>
          )}

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
