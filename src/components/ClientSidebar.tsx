"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  Home, 
  PackagePlus, 
  PackageMinus, 
  X, 
  Headset, 
  PhoneCall, 
  MessageSquare, 
  Mail 
} from "lucide-react";

export default function ClientSidebar({
  mobileOpen = false,
  onClose = () => {},
}: {
  mobileOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs md:hidden transition-opacity duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col h-full h-[100dvh] shadow-xl transition-transform duration-300 ease-in-out shrink-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-700 sticky top-0 bg-slate-900 z-10 flex items-center justify-between">
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white truncate tracking-wide">BOLAKA FACTORY</h2>
              <span className="text-[10px] bg-purple-900/80 text-purple-300 border border-purple-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                প্রতিষ্ঠান
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Powered by <span className="text-[13px] text-blue-400 font-bold">Bangla</span> <span className="text-[13px] font-medium text-slate-300">ERP</span></p>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="মেনু বন্ধ করুন"
          >
            <X size={20} />
          </button>
        </div>

        {/* Client Available Navigation Options */}
        <nav className="flex-1 p-4 space-y-1.5 text-sm font-bold">
          {/* 1. Dashboard */}
          <Link 
            href="/portal/dashboard" 
            prefetch={false}
            onClick={onClose}
            className={`flex items-center space-x-3 p-3 rounded-xl transition-colors ${
              pathname === '/portal/dashboard' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <Home size={18} />
            <span>ড্যাশবোর্ড <span className="text-[10px] font-normal text-slate-400 block mt-0.5">(Dashboard)</span></span>
          </Link>

          {/* 2. Received Products (Product In) */}
          <Link 
            href="/portal/product-in" 
            prefetch={false}
            onClick={onClose}
            className={`flex items-center space-x-3 p-3 rounded-xl transition-colors ${
              pathname.startsWith('/portal/product-in') ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <PackagePlus size={18} />
            <span>পণ্য ইন <span className="text-[10px] font-normal text-slate-400 block mt-0.5">(Received Products)</span></span>
          </Link>

          {/* 3. Send Products (Product Out) */}
          <Link 
            href="/portal/product-out" 
            prefetch={false}
            onClick={onClose}
            className={`flex items-center space-x-3 p-3 rounded-xl transition-colors ${
              pathname.startsWith('/portal/product-out') ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <PackageMinus size={18} />
            <span>পণ্য আউট <span className="text-[10px] font-normal text-slate-400 block mt-0.5">(Send Request)</span></span>
          </Link>
        </nav>

        {/* Customer Support at Bottom */}
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

            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-600 leading-relaxed">
                পণ্য গ্রহণ, চালান বা হিসাব সংক্রান্ত যেকোনো সহায়তার জন্য সরাসরি কোম্পানি কর্তৃপক্ষের সাথে যোগাযোগ করুন:
              </p>

              <div className="space-y-2.5">
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
                    <span className="block text-[11px] text-emerald-700 font-normal">সরাসরি চ্যাটে সহায়তা পান</span>
                  </div>
                </a>

                <a
                  href="tel:+8801700000000"
                  className="flex items-center space-x-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-950 transition-colors font-bold text-sm"
                >
                  <div className="p-2 bg-blue-600 text-white rounded-lg shrink-0">
                    <PhoneCall size={18} />
                  </div>
                  <div>
                    <span className="block text-sm">হটলাইন কল</span>
                    <span className="block text-[11px] text-blue-700 font-normal">+৮৮০ ১৭০০-০০০০০০</span>
                  </div>
                </a>

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
            </div>
          </div>
        </div>
      )}
    </>
  );
}
