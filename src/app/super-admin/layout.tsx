import Link from "next/link";
import { ShieldAlert, ArrowLeft, Database, Terminal } from "lucide-react";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Super Admin Top Navigation */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Left Brand */}
            <div className="flex items-center space-x-3">
              <div className="bg-amber-500/10 border border-amber-500/30 p-2 rounded-xl text-amber-400">
                <ShieldAlert size={22} />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-black text-lg tracking-wide text-white">Bangla<span className="text-amber-400">ERP</span></span>
                  <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
                    Super Admin
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">ব্যাকএন্ড ও ডাটাবেজ কন্ট্রোল সেন্টার</p>
              </div>
            </div>
            
            {/* Right Controls */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <Database size={13} />
                <span>PostgreSQL লাইভ</span>
              </div>

              <Link
                href="/"
                className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border border-slate-700 active:scale-95"
                title="মূল ব্যবসায়িক ড্যাশবোর্ডে ফিরে যান"
              >
                <ArrowLeft size={14} />
                <span>ERP ড্যাশবোর্ড</span>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        Bangla ERP Master Control Center • Designed for Mission Critical Operations
      </footer>
    </div>
  );
}
