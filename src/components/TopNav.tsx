"use client";

import { useState } from "react";
import { LogOut, ChevronDown, Building2, ShieldCheck, Menu } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import BengaliClock from "./BengaliClock";

export default function TopNav({
  onToggleMobileMenu,
}: {
  onToggleMobileMenu?: () => void;
}) {
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
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-3 sm:px-6 z-20 gap-2 sm:gap-3 relative shrink-0">
      {/* Left: Mobile Hamburger Button & Active Page Name */}
      <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer active:scale-95"
            title="মেনু খুলুন"
            aria-label="Toggle Menu"
          >
            <Menu size={20} />
          </button>
        )}
        <span className="text-sm sm:text-base font-bold text-gray-800 truncate max-w-[110px] xs:max-w-[140px] sm:max-w-none">
          {currentTitle.bn} <span className="text-xs font-normal text-gray-400 hidden lg:inline">({currentTitle.en})</span>
        </span>
      </div>

      {/* Center: Live Bengali Date & Digital Clock */}
      <div className="flex items-center justify-center shrink-0">
        <BengaliClock />
      </div>

      {/* Right: Clickable User Profile & Dropdown */}
      <div className="relative shrink-0">
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 py-1 sm:py-1.5 px-2 sm:px-3 rounded-xl transition-all cursor-pointer select-none active:scale-95"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-sm">
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
