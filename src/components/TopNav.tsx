"use client";

import { Bell, User, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function TopNav() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Owner";
  const userRole = (session?.user as any)?.role || "OWNER";

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 z-20">
      <div className="flex items-center space-x-3">
        <span className="text-base font-bold text-gray-800">
          ড্যাশবোর্ড ওভারভিউ <span className="text-xs font-normal text-gray-400">(Overview)</span>
        </span>
      </div>

      <div className="flex items-center space-x-4">
        {/* User Card */}
        <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200 py-1.5 px-3 rounded-xl">
          <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-sm">
            {userName.charAt(0)}
          </div>
          <div className="text-left">
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
