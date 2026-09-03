"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  Home, 
  PackagePlus, 
  PackageMinus, 
  Wallet, 
  Receipt, 
  Users, 
  UserCog, 
  ChevronDown, 
  ChevronUp, 
  CalendarClock,
  Headset,
  PhoneCall,
  MessageSquare,
  Mail,
  X,
  Bell,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({
  mobileOpen = false,
  onClose = () => {},
  pendingApprovalsCount = 0,
}: {
  mobileOpen?: boolean;
  onClose?: () => void;
  pendingApprovalsCount?: number;
}) {
  const pathname = usePathname();
  const [isHrOpen, setIsHrOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs md:hidden transition-opacity duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col h-full h-[100dvh] overflow-y-auto overflow-x-hidden transition-transform duration-300 ease-in-out shrink-0 ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-700 sticky top-0 bg-slate-900 z-10 flex items-center justify-between">
          <div className="flex flex-col justify-center">
            <h2 className="text-xl font-bold text-white truncate tracking-wide">BOLAKA FACTORY</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Powered by <span className="text-[13px] text-blue-400 font-bold">Bangla</span> <span className="text-[13px] font-medium text-slate-300">ERP</span></p>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="মেনু বন্ধ করুন"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1 text-sm font-bold">
          <Link 
            href="/" 
            prefetch={false} 
            onClick={onClose}
            className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors ${pathname === '/' ? 'bg-slate-800 text-white' : 'text-slate-300'}`}
          >
            <Home size={18} />
            <span>ড্যাশবোর্ড <span className="text-[10px] font-normal text-slate-400 block mt-0.5">(Dashboard)</span></span>
          </Link>
          <Link 
            href="/product-in" 
            prefetch={false} 
            onClick={onClose}
            className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors ${pathname.startsWith('/product-in') ? 'bg-slate-800 text-white' : 'text-slate-300'}`}
          >
            <PackagePlus size={18} />
            <span>পণ্য ইন <span className="text-[10px] font-normal text-slate-400 block mt-0.5">(Product In)</span></span>
          </Link>
          <Link 
            href="/product-out" 
            prefetch={false} 
            onClick={onClose}
            className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors ${pathname.startsWith('/product-out') ? 'bg-slate-800 text-white' : 'text-slate-300'}`}
          >
            <PackageMinus size={18} />
            <span>পণ্য আউট <span className="text-[10px] font-normal text-slate-400 block mt-0.5">(Product Out)</span></span>
          </Link>
          <Link 
            href="/main-cash" 
            prefetch={false} 
            onClick={onClose}
            className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors ${pathname.startsWith('/main-cash') ? 'bg-slate-800 text-white' : 'text-slate-300'}`}
          >
            <Wallet size={18} />
            <span>মূল ক্যাশ <span className="text-[10px] font-normal text-slate-400 block mt-0.5">(Main Cash)</span></span>
          </Link>
          <Link 
            href="/expenses" 
            prefetch={false} 
            onClick={onClose}
            className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors ${pathname.startsWith('/expenses') ? 'bg-slate-800 text-white' : 'text-slate-300'}`}
          >
            <Receipt size={18} />
            <span>দৈনিক খরচ <span className="text-[10px] font-normal text-slate-400 block mt-0.5">(Daily Expense)</span></span>
          </Link>
          <Link 
            href="/clients" 
            prefetch={false} 
            onClick={onClose}
            className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors ${pathname.startsWith('/clients') ? 'bg-slate-800 text-white' : 'text-slate-300'}`}
          >
            <Users size={18} />
            <span>প্রতিষ্ঠান <span className="text-[10px] font-normal text-slate-400 block mt-0.5">(Company)</span></span>
          </Link>
          <Link 
            href="/loan" 
            prefetch={false} 
            onClick={onClose}
            className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors ${pathname.startsWith('/loan') ? 'bg-slate-800 text-white' : 'text-slate-300'}`}
          >
            <CalendarClock size={18} />
            <span>বকেয়া <span className="text-[10px] font-normal text-slate-400 block mt-0.5">(Due / বাকির হিসাব)</span></span>
          </Link>

          {/* --- OWNER ONLY SECTION --- */}
          <div className="pt-4 mt-4 border-t border-slate-700">
            <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">মালিকের নিয়ন্ত্রণ <span className="text-[8px] block mt-0.5">(Owner Controls)</span></p>
            {/* Approvals Link: Highlighted with ping animation if pending > 0, normal if 0 */}
            <Link 
              href="/approvals" 
              prefetch={false} 
              onClick={onClose}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                pendingApprovalsCount > 0
                  ? "bg-orange-950/40 text-orange-400 border border-orange-800/50 shadow-xs"
                  : pathname.startsWith('/approvals')
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {pendingApprovalsCount > 0 ? (
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                </span>
              ) : (
                <ShieldCheck size={18} className="text-slate-400 shrink-0" />
              )}
              <span>
                অ্যাপ্রুভাল{" "}
                <span className={`text-[10px] font-normal block mt-0.5 ${pendingApprovalsCount > 0 ? "text-orange-300" : "text-slate-400"}`}>
                  (Approvals)
                </span>
              </span>
              {pendingApprovalsCount > 0 && (
                <span className="ml-auto px-2 py-0.5 bg-orange-500 text-black text-[10px] font-black rounded-full shadow-xs">
                  {pendingApprovalsCount}
                </span>
              )}
            </Link>
            <Link 
              href="/audit-logs" 
              prefetch={false} 
              onClick={onClose}
              className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors ${
                pathname.startsWith('/audit-logs') ? 'bg-slate-800 text-white' : 'text-blue-400'
              }`}
            >
              <div className="w-3" />
              <span>কাজের হিস্ট্রি <span className="text-[10px] font-normal text-blue-300 block mt-0.5">(Audit Logs)</span></span>
            </Link>
            <Link 
              href="/notifications" 
              prefetch={false} 
              onClick={onClose}
              className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition-colors ${
                pathname.startsWith('/notifications') ? 'bg-slate-800 text-white' : 'text-purple-400'
              }`}
            >
              <Bell size={18} className="shrink-0" />
              <span>নোটিফিকেশন <span className="text-[10px] font-normal text-purple-300 block mt-0.5">(Notifications)</span></span>
            </Link>
          </div>
          
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
                <Link href="/salary" prefetch={false} onClick={onClose} className="block p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                  কর্মী তালিকা <span className="text-[10px] font-normal text-slate-500 block">(Employees)</span>
                </Link>
                <Link href="/hr/attendance" prefetch={false} onClick={onClose} className="block p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                  হাজিরা ও শিফট <span className="text-[10px] font-normal text-slate-500 block">(Attendance & Shift)</span>
                </Link>
                <Link href="/hr/payroll" prefetch={false} onClick={onClose} className="block p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                  বেতন ও পে-রোল <span className="text-[10px] font-normal text-slate-500 block">(Payroll Control)</span>
                </Link>
                <Link href="/hr/documents" prefetch={false} onClick={onClose} className="block p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                  নথিপত্র <span className="text-[10px] font-normal text-slate-500 block">(HR Documents)</span>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Customer Support Button at bottom */}
        <div className="p-4 border-t border-slate-700 sticky bottom-0 bg-slate-900">
          <button
            onClick={() => setIsSupportOpen(true)}
            className="w-full flex items-center space-x-3 p-3 rounded-xl bg-slate-800/80 hover:bg-emerald-950/40 text-emerald-400 hover:text-emerald-300 border border-slate-700 hover:border-emerald-700 transition-all font-bold text-sm cursor-pointer shadow-sm"
          >
            <Headset size={20} className="text-emerald-400 shrink-0" />
            <div className="text-left">
              <span>কাস্টমার সাপোর্ট</span>
              <span className="text-[10px] font-normal text-slate-400 block mt-0.5">(Customer Support)</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Customer Support Modal */}
      {isSupportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
          <div className="bg-white text-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-emerald-600 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Headset size={20} className="text-emerald-200" />
                <h3 className="font-bold text-base">কাস্টমার সাপোর্ট (Customer Support)</h3>
              </div>
              <button
                onClick={() => setIsSupportOpen(false)}
                className="text-emerald-100 hover:text-white p-1 rounded-lg hover:bg-emerald-700/50 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-600 leading-relaxed">
                বাংলা ইআরপি ব্যবহারে যেকোনো প্রশ্ন, সহায়তা বা কারিগরি সমস্যার জন্য সরাসরি আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন:
              </p>

              <div className="space-y-2.5">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/8801700000000?text=Hello%20Bangla%20ERP%20Support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 transition-colors font-bold text-sm"
                >
                  <div className="p-2 bg-emerald-600 text-white rounded-lg shrink-0">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <span className="block text-sm">WhatsApp সাপোর্ট</span>
                    <span className="block text-[11px] text-emerald-700 font-normal">সরাসরি হোয়াটসঅ্যাপে চ্যাট করুন</span>
                  </div>
                </a>

                {/* Phone Call */}
                <a
                  href="tel:+8801700000000"
                  className="flex items-center space-x-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-950 transition-colors font-bold text-sm"
                >
                  <div className="p-2 bg-blue-600 text-white rounded-lg shrink-0">
                    <PhoneCall size={18} />
                  </div>
                  <div>
                    <span className="block text-sm">হটলাইন সরাসরি কল</span>
                    <span className="block text-[11px] text-blue-700 font-normal">+৮৮০ ১৭০০-০০০০০০</span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:support@banglaerp.com"
                  className="flex items-center space-x-3 p-3 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-950 transition-colors font-bold text-sm"
                >
                  <div className="p-2 bg-purple-600 text-white rounded-lg shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="block text-sm">ইমেইল সাপোর্ট</span>
                    <span className="block text-[11px] text-purple-700 font-normal">support@banglaerp.com</span>
                  </div>
                </a>
              </div>

              <div className="pt-2 text-center text-[11px] text-gray-400 border-t border-gray-100">
                সহায়তার সময়: সকাল ৯:০০ টা হতে রাত ১০:০০ টা (প্রতিদিন)
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
