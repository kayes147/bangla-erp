"use client";

import { useState } from "react";
import { LogOut, ChevronDown, Building2, ShieldCheck } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import BengaliClock from "./BengaliClock";

export default function TopNav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const userName = session?.user?.name || "Owner";
  const userRole = (session?.user as any)?.role || "OWNER";
  const userEmail = session?.user?.email || "bolaka@erp.com";

  const getPageTitle = () => {
    if (pathname === "/") return { bn: "ড্যাশবোর্ড ওভারভিউ", en: "Overview" };
    if (pathname.startsWith("/product-in")) return { bn: "পণ্য ইন", en: "Product In" };
    if (pathname.startsWith("/product-out")) return { bn: "পণ্য আউট", en: "Product Out" };
    if (pathname.startsWith("/main-cash")) return { bn: "মূল ক্যাশ", en: "Main Cash" };
    if (pathname.startsWith("/expenses")) return { bn: "দৈনিক খরচ", en: "Daily Expense" };
    if (pathname.startsWith("/loan")) return { bn: "বকেয়ার হিসাব", en: "Business Due" };
    if (pathname.startsWith("/clients")) return { bn: "মহাজন", en: "Mahajon" };
    if (pathname.startsWith("/salary") || pathname.startsWith("/hr")) return { bn: "কর্মী", en: "Employees" };
    if (pathname.startsWith("/approvals")) return { bn: "অনুমোদন তালিকা", en: "Approvals" };
    if (pathname.startsWith("/audit-logs")) return { bn: "অডিট লগ", en: "Audit Logs" };
    return { bn: "বাংলা ইআরপি", en: "Bangla ERP" };
  };

  const currentTitle = getPageTitle();

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 z-20 gap-3 relative">
      {/* Left: Active Section Name */}
      <div className="flex items-center space-x-2 shrink-0">
        <span className="text-base font-bold text-gray-800">
          {currentTitle.bn} <span className="text-xs font-normal text-gray-400 hidden sm:inline">({currentTitle.en})</span>
        </span>
      </div>

      {/* Center: Live Bengali Date & Digital Clock (Always visible across all pages) */}
      <div className="flex items-center justify-center">
        <BengaliClock />
      </div>

      {/* Right: Clickable User Profile & Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center space-x-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 py-1.5 px-3 rounded-xl transition-all cursor-pointer select-none"
        >
          <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-sm">
            {userName.charAt(0)}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-gray-900 capitalize leading-tight">
              {userName}
            </p>
            <span
              className={`inline-block text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                userRole === "OWNER"
                  ? "bg-amber-100 text-amber-800"
                  : userRole === "MANAGER"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {userRole}
            </span>
          </div>
          <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Profile Details & Logout Dropdown Menu */}
        {isProfileOpen && (
          <>
            {/* Backdrop to close on click outside */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsProfileOpen(false)}
            />

            <div className="absolute right-0 top-12 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* User Identity Header */}
              <div className="px-4 py-3 border-b border-gray-100 bg-slate-50/60">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm uppercase shadow-sm">
                    {userName.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
                    <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center space-x-1.5">
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
                    {userRole === "OWNER" ? "মালিক (Owner)" : "ম্যানেজার (Manager)"}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>সক্রিয়</span>
                  </span>
                </div>
              </div>

              {/* Organization Info */}
              <div className="px-4 py-2.5 text-xs text-gray-600 border-b border-gray-100 space-y-1">
                <div className="flex items-center space-x-2 text-gray-500">
                  <Building2 size={13} className="text-gray-400" />
                  <span className="font-bold text-gray-800">BOLAKA FACTORY</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <ShieldCheck size={13} className="text-emerald-500" />
                  <span>অ্যাডমিন কন্ট্রোল সক্রিয়</span>
                </div>
              </div>

              {/* Logout Option */}
              <div className="p-2">
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>লগআউট (Log Out)</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
