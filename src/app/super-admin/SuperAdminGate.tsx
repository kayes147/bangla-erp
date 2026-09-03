"use client";

import { useState } from "react";
import { ShieldAlert, Lock, User, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SuperAdminGate() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        username: username.trim(),
        password: password.trim(),
        redirect: false,
      });

      if (res?.error) {
        setError("ভুল সুপার অ্যাডমিন আইডি বা পাসওয়ার্ড! অনুগ্রহ করে সঠিক তথ্য দিন।");
      } else {
        window.location.href = "/super-admin";
      }
    } catch (err: any) {
      setError("লগইন করতে সমস্যা হচ্ছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
        {/* Header Icon */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">সুপার অ্যাডমিন সিকিউরিটি গেটওয়ে</h2>
            <p className="text-xs text-slate-400 mt-1">
              ব্যাকএন্ড কন্ট্রোল প্যানেলে প্রবেশ করতে আপনার মাস্টার অ্যাডমিন আইডি ও পাসওয়ার্ড প্রদান করুন
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-red-950/80 border border-red-800 text-red-300 rounded-2xl text-xs font-bold flex items-center space-x-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              সুপার অ্যাডমিন আইডি (Admin ID)
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-all font-mono"
                placeholder="আপনার অ্যাডমিন আইডি লিখুন..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              মাস্টার পাসওয়ার্ড (Master Password)
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-all"
                placeholder="পাসওয়ার্ড দিন..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 py-3 rounded-xl font-black text-sm transition-all shadow-lg shadow-amber-500/10 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? "ভেরিফাই হচ্ছে..." : "আনলক ও ব্যাকএন্ডে প্রবেশ করুন"}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            ← মূল ERP ড্যাশবোর্ডে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
