"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
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
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic notification & approval status
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0);
  const [hasNotifications, setHasNotifications] = useState(false);

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

  // Immediate redirect for unauthenticated users accessing protected pages
  useEffect(() => {
    if (!isAuthPage && status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, isAuthPage, router]);

  const checkNotificationCounts = useCallback(async () => {
    if (isAuthPage || status !== "authenticated") return;
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
  }, [isAuthPage, status]);

  // Fetch count on mount and every 60 seconds (with instant revalidation on tab focus)
  useEffect(() => {
    if (isAuthPage || status !== "authenticated") return;

    checkNotificationCounts();
    const interval = setInterval(checkNotificationCounts, 60000);

    const onFocus = () => {
      checkNotificationCounts();
    };
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [checkNotificationCounts, isAuthPage, status]);
  
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

  // 1. Auth pages (Login, Register, etc.) render directly
  if (isAuthPage) {
    return (
      <div className="w-full h-full overflow-auto bg-slate-900">
        {children}
      </div>
    );
  }

  // 2. Gatekeeper: If unauthenticated or loading on a protected route, never reveal ERP UI
  if (status === "loading" || status === "unauthenticated" || !session) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center space-y-4 p-8 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-2xl backdrop-blur-md">
          <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
          <div className="text-center space-y-1">
            <h2 className="text-base font-bold text-white tracking-wide">নিরাপত্তা ও সেশন যাচাই হচ্ছে...</h2>
            <p className="text-xs text-slate-400">অননুমোদিত প্রবেশ রোধ করা হচ্ছে</p>
          </div>
        </div>
      </div>
    );
  }

  // 3. Super admin layout
  if (isSuperAdmin) {
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
        <main className="flex-1 min-h-0 overflow-x-hidden overflow-y-auto bg-gray-50 px-3 sm:px-6 pt-3 sm:pt-6 pb-36 sm:pb-24 overscroll-contain">
          {children}
        </main>
      </div>
    </div>
  );
}
