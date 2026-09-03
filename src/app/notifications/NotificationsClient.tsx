"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Bell, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ArrowUpRight, 
  CalendarClock, 
  Search,
  CheckCheck,
  Filter
} from "lucide-react";

export interface NotificationItem {
  id: string;
  type: "approval" | "overdue" | "activity";
  title: string;
  message: string;
  timestamp: string; // ISO string
  link?: string;
  actionLabel?: string;
  badge: {
    label: string;
    bg: string;
    text: string;
  };
}

export default function NotificationsClient({
  initialNotifications,
}: {
  initialNotifications: NotificationItem[];
}) {
  const [filterType, setFilterType] = useState<"all" | "approval" | "overdue" | "activity">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNotifications = initialNotifications.filter((n) => {
    const matchesFilter = filterType === "all" || n.type === filterType;
    const matchesSearch = 
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "approval":
        return <Clock size={20} className="text-orange-600" />;
      case "overdue":
        return <AlertTriangle size={20} className="text-red-600" />;
      case "activity":
      default:
        return <FileText size={20} className="text-blue-600" />;
    }
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMinutes < 1) return "এইমাত্র";
      if (diffMinutes < 60) return `${diffMinutes} মিনিট আগে`;
      if (diffHours < 24) return `${diffHours} ঘণ্টা আগে`;
      if (diffDays === 1) return "গতকাল";
      if (diffDays < 7) return `${diffDays} দিন আগে`;
      return date.toLocaleDateString("bn-BD");
    } catch {
      return "";
    }
  };

  const countByType = {
    all: initialNotifications.length,
    approval: initialNotifications.filter((n) => n.type === "approval").length,
    overdue: initialNotifications.filter((n) => n.type === "overdue").length,
    activity: initialNotifications.filter((n) => n.type === "activity").length,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pt-2">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl shadow-2xs">
            <Bell size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <span>নোটিফিকেশন</span>
              <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                {initialNotifications.length} টি নোটিশ
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              ব্যবসায়ের সকল জরুরি অনুমোদন, তারিখ পার হওয়া বকেয়া অ্যালার্ট ও কার্যক্রমের তালিকা।
            </p>
          </div>
        </div>

        {countByType.approval > 0 && (
          <Link
            href="/approvals"
            className="inline-flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all"
          >
            <span>{countByType.approval} টি রিকোয়েস্ট পেন্ডিং</span>
            <ArrowUpRight size={16} />
          </Link>
        )}
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              filterType === "all"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            সব ({countByType.all})
          </button>
          <button
            onClick={() => setFilterType("approval")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
              filterType === "approval"
                ? "bg-orange-600 text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <span>অ্যাপ্রুভাল</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
              {countByType.approval}
            </span>
          </button>
          <button
            onClick={() => setFilterType("overdue")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
              filterType === "overdue"
                ? "bg-red-600 text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <span>বকেয়া অ্যালার্ট</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
              {countByType.overdue}
            </span>
          </button>
          <button
            onClick={() => setFilterType("activity")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
              filterType === "activity"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <span>কার্যক্রম</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
              {countByType.activity}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="নোটিফিকেশন খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 font-medium text-gray-800"
          />
          <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Notifications List Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
        {filteredNotifications.map((n) => (
          <div
            key={n.id}
            className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-gray-900">{n.title}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${n.badge.bg} ${n.badge.text}`}
                  >
                    {n.badge.label}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{n.message}</p>
                <div className="flex items-center space-x-2 text-[11px] text-gray-400 mt-1.5">
                  <Clock size={12} />
                  <span>{formatRelativeTime(n.timestamp)}</span>
                  <span>•</span>
                  <span>{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>

            {n.link && (
              <div className="shrink-0 self-end sm:self-center">
                <Link
                  href={n.link}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <span>{n.actionLabel || "বিস্তারিত দেখুন"}</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            )}
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
              <CheckCheck size={24} />
            </div>
            <h3 className="text-sm font-bold text-gray-700">কোনো নোটিফিকেশন নেই</h3>
            <p className="text-xs text-gray-400 mt-1">সব কার্যক্রম ঠিকঠাক রয়েছে।</p>
          </div>
        )}
      </div>
    </div>
  );
}
