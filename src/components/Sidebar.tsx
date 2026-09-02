"use client";
import Link from 'next/link';
import { useState } from 'react';
import { Home, PackagePlus, PackageMinus, Wallet, Receipt, Landmark, Users, Settings, UserCog, ChevronDown, ChevronUp, LogOut, CalendarClock } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function Sidebar() {
  const [isHrOpen, setIsHrOpen] = useState(false);

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col overflow-y-auto overflow-x-hidden">
      <div className="p-4 border-b border-slate-700 sticky top-0 bg-slate-900 z-10 flex flex-col justify-center">
        <h2 className="text-xl font-bold text-white truncate tracking-wide">BOLAKA FACTORY</h2>
        <p className="text-[11px] text-slate-400 mt-1">Powered by <span className="text-[13px] text-blue-400 font-bold">Bangla</span> <span className="text-[13px] font-medium text-slate-300">ERP</span></p>
      </div>
      <nav className="flex-1 p-4 space-y-1 text-sm font-bold">
        <Link href="/" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors bg-slate-800">
          <Home size={18} />
          <span>ড্যাশবোর্ড <span className="text-[10px] font-normal text-slate-400 block mt-0.5">(Dashboard)</span></span>
        </Link>
        <Link href="/product-in" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
          <PackagePlus size={18} />
          <span>পণ্য ইন <span className="text-[10px] font-normal text-slate-400 block mt-0.5">(Product In)</span></span>
        </Link>
        <Link href="/product-out" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
          <PackageMinus size={18} />
          <span>পণ্য আউট <span className="text-[10px] font-normal text-slate-400 block mt-0.5">(Product Out)</span></span>
        </Link>
        <Link href="/main-cash" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
          <Wallet size={18} />
          <span>মূল ক্যাশ <span className="text-[10px] font-normal text-slate-400 block mt-0.5">(Main Cash)</span></span>
        </Link>
        <Link href="/expenses" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
          <Receipt size={18} />
          <span>দৈনিক খরচ <span className="text-[10px] font-normal text-slate-400 block mt-0.5">(Daily Expense)</span></span>
        </Link>
        <Link href="/clients" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
          <Users size={18} />
          <span>মহাজন ও কাস্টমার <span className="text-[10px] font-normal text-slate-400 block mt-0.5">(Suppliers & Customers)</span></span>
        </Link>
        <Link href="/loan" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
          <CalendarClock size={18} />
          <span>বকেয়া <span className="text-[10px] font-normal text-slate-400 block mt-0.5">(Due / বাকির হিসাব)</span></span>
        </Link>

        {/* --- OWNER ONLY SECTION (MOCK) --- */}
        <div className="pt-4 mt-4 border-t border-slate-700">
          <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">মালিকের নিয়ন্ত্রণ <span className="text-[8px] block mt-0.5">(Owner Controls)</span></p>
          <Link href="/approvals" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors text-orange-400">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
            </span>
            <span>অ্যাপ্রুভাল <span className="text-[10px] font-normal text-orange-300 block mt-0.5">(Approvals)</span></span>
          </Link>
          <Link href="/audit-logs" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors text-blue-400">
            <div className="w-3" /> {/* Spacer */}
            <span>কাজের হিস্ট্রি <span className="text-[10px] font-normal text-blue-300 block mt-0.5">(Audit Logs)</span></span>
          </Link>
        </div>
        {/* -------------------------------- */}
        
        {/* Employee Dropdown */}
        <div>
          <button 
            onClick={() => setIsHrOpen(!isHrOpen)} 
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <UserCog size={18} />
              <div className="text-left">
                <span>কর্মী <span className="text-[10px] font-normal text-slate-400 block mt-0.5">(Employees)</span></span>
              </div>
            </div>
            {isHrOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {isHrOpen && (
            <div className="ml-9 mt-1 space-y-1">
              <Link href="/salary" className="block p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                কর্মী তালিকা <span className="text-[10px] font-normal text-slate-500 block">(Employees)</span>
              </Link>
              <Link href="/hr/attendance" className="block p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                হাজিরা ও শিফট <span className="text-[10px] font-normal text-slate-500 block">(Attendance & Shift)</span>
              </Link>
              <Link href="/hr/payroll" className="block p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                বেতন ও পে-রোল <span className="text-[10px] font-normal text-slate-500 block">(Payroll Control)</span>
              </Link>
              <Link href="/hr/documents" className="block p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                নথিপত্র <span className="text-[10px] font-normal text-slate-500 block">(HR Documents)</span>
              </Link>
            </div>
          )}
        </div>
      </nav>
      <div className="p-4 border-t border-slate-700 sticky bottom-0 bg-slate-900 space-y-2">
        <Link href="/settings" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
          <Settings size={18} />
          <span>Settings (সেটিংস)</span>
        </Link>
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-900/50 text-red-400 transition-colors"
        >
          <LogOut size={18} />
          <span>Log Out (লগআউট)</span>
        </button>
      </div>
    </div>
  );
}
