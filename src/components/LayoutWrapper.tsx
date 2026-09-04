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
  const { data: session } = useSession();
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

  const checkNotificationCounts = useCallback(async () => {
    if (isAuthPage) return;
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
  }, [isAuthPage]);

  // Fetch count on mount and every 60 seconds (with instant revalidation on tab focus)
  useEffect(() => {
    if (isAuthPage) return;

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
  }, [checkNotificationCounts, isAuthPage]);
  
  const isSuperAdmin = pathname.startsWith("/super-admin");
  const userRole = (session?.user as any)?.role;
  const isClient = userRole === "CLIENT";

  // Session Persistence & Remember Me Enforcement
  useEffect(() => {
    if (isAuthPage || isSuperAdmin || !session) return;

    try {
      const isRemembered = localStorage.getItem("erp_remember_me") === "true";
      const hasSessionStorage = sessionStorage.getItem("erp_session_active") === "true";
      const hasSessionCookie = document.cookie
        .split("; ")
        .some((row) => row.startsWith("erp_session_active="));

      // If user did NOT check "Remember Me" and quit/closed the browser:
      // Both sessionStorage and session cookie are purged by the browser.
      if (!isRemembered && !hasSessionStorage && !hasSessionCookie) {
        signOut({ callbackUrl: "/login" });
      } else {
        // Active session confirmed: ensure session indicators are present
        if (!hasSessionStorage) {
          sessionStorage.setItem("erp_session_active", "true");
        }
        if (!hasSessionCookie) {
          if (isRemembered) {
            document.cookie = "erp_session_active=1; path=/; max-age=2592000; SameSite=Lax";
          } else {
            document.cookie = "erp_session_active=1; path=/; SameSite=Lax";
          }
        }
      }
    } catch (e) {
      console.warn("Session persistence validation error:", e);
    }
  }, [session, isAuthPage, isSuperAdmin]);

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
        <main className="flex-1 min-h-0 overflow-x-hidden overflow-y-auto bg-gray-50 px-3 sm:px-6 pt-3 sm:pt-6 pb-36 sm:pb-24 overscroll-contain">
          {children}
        </main>
      </div>
    </div>
  );
}
