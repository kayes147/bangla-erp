"use client";

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

  // Pages that should NOT have the Sidebar and TopNav
  const isAuthPage = pathname === "/login" || pathname === "/portal/login" || pathname === "/select-company";
  
  const isClientPortal = pathname.startsWith("/portal") && !isAuthPage;

  if (isAuthPage) {
    return (
      <div className="w-full h-full overflow-auto bg-slate-900">
        {children}
      </div>
    );
  }

  return (
    <>
      {isClientPortal ? <ClientSidebar /> : <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </>
  );
}
