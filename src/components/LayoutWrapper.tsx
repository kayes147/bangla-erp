"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import ClientSidebar from "./ClientSidebar";
import TopNav from "./TopNav";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Automatically close mobile menu when user changes page/route
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Pages that should NOT have the Sidebar and TopNav
  const isAuthPage = 
    pathname === "/login" || 
    pathname === "/register" || 
    pathname === "/portal/login" || 
    pathname === "/select-company";
  
  const isSuperAdmin = pathname.startsWith("/super-admin");
  const isClientPortal = pathname.startsWith("/portal") && !isAuthPage;

  if (isAuthPage || isSuperAdmin) {
    return (
      <div className="w-full h-full overflow-auto bg-slate-900">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen h-[100dvh] w-full overflow-hidden bg-gray-50">
      {/* Sidebar: Fixed on desktop (md:), Slide-over off-canvas drawer on mobile */}
      {isClientPortal ? (
        <ClientSidebar />
      ) : (
        <Sidebar 
          mobileOpen={mobileMenuOpen} 
          onClose={() => setMobileMenuOpen(false)} 
        />
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <TopNav onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 px-3 sm:px-6 pt-3 sm:pt-6 pb-28 sm:pb-12 overscroll-contain">
          {children}
        </main>
      </div>
    </div>
  );
}
