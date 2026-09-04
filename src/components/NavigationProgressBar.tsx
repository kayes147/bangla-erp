"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function NavigationProgressBar() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Complete progress and hide bar when route/pathname changes
  useEffect(() => {
    if (isNavigating) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Global click listener to intercept internal link clicks
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      // Ignore modified clicks (new tab, ctrl, shift, meta, right click)
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey ||
        e.shiftKey
      ) {
        return;
      }

      // Traverse up to find the closest anchor element
      let target = e.target as HTMLElement | null;
      while (target && target.tagName !== "A") {
        target = target.parentElement;
      }

      if (!target || target.tagName !== "A") return;

      const anchor = target as HTMLAnchorElement;
      const href = anchor.getAttribute("href");
      const targetAttr = anchor.getAttribute("target");

      // Ignore external links, mailto, tel, hashes, downloads, or target="_blank"
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        targetAttr === "_blank" ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      // Check if it's the same origin
      try {
        const url = new URL(anchor.href, window.location.origin);
        if (url.origin !== window.location.origin) return;

        // If clicking the current page with no search param changes, don't trigger
        const isCurrentPage =
          url.pathname === window.location.pathname &&
          url.search === window.location.search;

        if (isCurrentPage) return;

        // Trigger loading state immediately!
        setIsNavigating(true);
        setProgress(25);
      } catch (err) {
        // invalid URL, ignore
      }
    };

    document.addEventListener("click", handleLinkClick, true);
    return () => {
      document.removeEventListener("click", handleLinkClick, true);
    };
  }, []);

  // Animate progress incrementally while waiting for route to render
  useEffect(() => {
    if (!isNavigating) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 60) return prev + 15;
        if (prev < 85) return prev + 6;
        if (prev < 95) return prev + 2;
        return prev;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isNavigating]);

  if (!isNavigating && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none">
      {/* Top Gradient Progress Bar */}
      <div className="h-1 w-full bg-slate-200/40 overflow-hidden backdrop-blur-xs">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400 transition-all duration-200 ease-out shadow-[0_0_12px_rgba(59,130,246,0.9)]"
          style={{
            width: `${progress}%`,
            transition: progress === 100 ? "width 150ms ease-out" : "width 250ms ease-out",
          }}
        />
      </div>

      {/* Floating Top-Right Loading Pill */}
      <div className="absolute top-2.5 right-4 flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 text-white border border-slate-700/80 rounded-full shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150">
        <Loader2 className="animate-spin text-blue-400" size={14} />
        <span className="text-xs font-bold tracking-wide">লোড হচ্ছে...</span>
      </div>
    </div>
  );
}
