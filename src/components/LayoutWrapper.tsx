"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Sidebar from "./Sidebar";
import ClientSidebar from "./ClientSidebar";
import TopNav from "./TopNav";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic notification & approval status
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0);
  const [hasNotifications, setHasNotifications] = useState(false);

  // Automatically close mobile menu when user changes page/route
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const checkNotificationCounts = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications/count", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setPendingApprovalsCount(data.pendingApprovalsCount || 0);
        setHasNotifications(!!data.hasNotifications);
      }
    } catch (e) {
      // ignore transient fetch error
    }
  }, []);

  // Fetch count on mount, on route change, and every 10 seconds for live updates
  useEffect(() => {
    checkNotificationCounts();
    const interval = setInterval(checkNotificationCounts, 10000);
    return () => clearInterval(interval);
  }, [checkNotificationCounts, pathname]);

  // Pages that should NOT have the Sidebar and TopNav
  const isAuthPage = 
    pathname === "/login" || 
    pathname === "/register" || 
    pathname === "/portal/login" || 
    pathname === "/select-company";
  
  const isSuperAdmin = pathname.startsWith("/super-admin");
  const userRole = (session?.user as any)?.role;
  const isClient = userRole === "CLIENT";

  // If logged in as client and visiting an owner page, redirect to portal dashboard
  useEffect(() => {
    if (isClient && !pathname.startsWith("/portal") && !isAuthPage && !isSuperAdmin) {
      router.push("/portal/dashboard");
    }
  }, [isClient, pathname, isAuthPage, isSuperAdmin, router]);

  const isClientPortal = (isClient || pathname.startsWith("/portal")) && !isAuthPage;

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
        <ClientSidebar 
          mobileOpen={mobileMenuOpen} 
          onClose={() => setMobileMenuOpen(false)} 
        />
      ) : (
        <Sidebar 
          mobileOpen={mobileMenuOpen} 
          onClose={() => setMobileMenuOpen(false)} 
          pendingApprovalsCount={pendingApprovalsCount}
        />
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <TopNav 
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} 
          hasNotifications={hasNotifications}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 px-3 sm:px-6 pt-3 sm:pt-6 pb-28 sm:pb-12 overscroll-contain">
          {children}
        </main>
      </div>
    </div>
  );
}
