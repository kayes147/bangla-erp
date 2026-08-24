"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PackagePlus, PackageMinus, LogOut } from "lucide-react";

export default function ClientSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-full shadow-xl">
      <div className="p-4 border-b border-slate-700 sticky top-0 bg-slate-900 z-10 flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white truncate tracking-wide">BOLAKA FACTORY</h2>
          <span className="text-[9px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-300 font-normal uppercase tracking-wider">Client</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Powered by <span className="text-[13px] text-blue-400 font-bold">Bangla</span> <span className="text-[13px] font-medium text-slate-300">ERP</span></p>
      </div>
      <nav className="flex-1 p-4 space-y-1 text-sm font-bold">
        <Link href="/portal/dashboard" className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${pathname === '/portal/dashboard' ? 'bg-slate-800' : 'hover:bg-slate-800'}`}>
          <Home size={18} />
          <span>ড্যাশবোর্ড <span className="text-[10px] font-normal text-slate-400 block mt-0.5">(Dashboard)</span></span>
        </Link>
        <Link href="/portal/product-in" className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${pathname === '/portal/product-in' ? 'bg-slate-800' : 'hover:bg-slate-800'}`}>
          <PackagePlus size={18} />
          <span>পণ্য ইন <span className="text-[10px] font-normal text-slate-400 block mt-0.5">(Product In)</span></span>
        </Link>
        <Link href="/portal/product-out" className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${pathname === '/portal/product-out' ? 'bg-slate-800' : 'hover:bg-slate-800'}`}>
          <PackageMinus size={18} />
          <span>পণ্য আউট <span className="text-[10px] font-normal text-slate-400 block mt-0.5">(Product Out)</span></span>
        </Link>
      </nav>
      <div className="p-4 border-t border-slate-700">
        <Link href="/login" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-900/50 text-red-400 transition-colors">
          <LogOut size={18} />
          <span>লগআউট <span className="text-[10px] font-normal opacity-70 block mt-0.5">(Logout)</span></span>
        </Link>
      </div>
    </aside>
  );
}
