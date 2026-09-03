"use client";

import { LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import BengaliClock from "./BengaliClock";

export default function TopNav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const userName = session?.user?.name || "Owner";
  const userRole = (session?.user as any)?.role || "OWNER";

  const getPageTitle = () => {
    if (pathname === "/") return { bn: "ড্যাশবোর্ড ওভারভিউ", en: "Overview" };
    if (pathname.startsWith("/product-in")) return { bn: "পণ্য ইন", en: "Product In" };
    if (pathname.startsWith("/product-out")) return { bn: "পণ্য আউট", en: "Product Out" };
    if (pathname.startsWith("/main-cash")) return { bn: "মূল ক্যাশ", en: "Main Cash" };
    if (pathname.startsWith("/expenses")) return { bn: "দৈনিক খরচ", en: "Daily Expense" };
    if (pathname.startsWith("/loan")) return { bn: "বকেয়ার হিসাব", en: "Business Due" };
    if (pathname.startsWith("/clients")) return { bn: "মহাজন ও কাস্টমার", en: "Suppliers & Customers" };
    if (pathname.startsWith("/salary") || pathname.startsWith("/hr")) return { bn: "কর্মী", en: "Employees" };
    if (pathname.startsWith("/approvals")) return { bn: "অনুমোদন তালিকা", en: "Approvals" };
    if (pathname.startsWith("/audit-logs")) return { bn: "অডিট লগ", en: "Audit Logs" };
    return { bn: "বাংলা ইআরপি", en: "Bangla ERP" };
  };

  const currentTitle = getPageTitle();

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 z-20 gap-3">
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

      {/* Right: User Profile Card & Logout */}
      <div className="flex items-center space-x-3 shrink-0">
        <div className="flex items-center space-x-2.5 bg-gray-50 border border-gray-200 py-1.5 px-3 rounded-xl">
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

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-gray-400 hover:text-red-600 p-1 rounded-lg transition-colors ml-1"
            title="লগআউট"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
