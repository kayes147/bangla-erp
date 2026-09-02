"use client";

import { useState } from "react";
import { ShieldAlert, Search, Filter, History, User } from "lucide-react";

interface AuditLogItem {
  id: string;
  action: string;
  details: string;
  createdAt: string | Date;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

export default function AuditLogsClient({ initialLogs }: { initialLogs: AuditLogItem[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState("ALL");

  const actionColors: Record<string, string> = {
    CREATE_INVOICE_IN: "bg-blue-100 text-blue-800 border-blue-200",
    CREATE_INVOICE_OUT: "bg-green-100 text-green-800 border-green-200",
    APPROVE_INVOICE: "bg-emerald-100 text-emerald-800 border-emerald-200",
    REJECT_INVOICE: "bg-red-100 text-red-800 border-red-200",
    ADD_EXPENSE: "bg-amber-100 text-amber-800 border-amber-200",
    APPROVE_EXPENSE: "bg-teal-100 text-teal-800 border-teal-200",
    REJECT_EXPENSE: "bg-rose-100 text-rose-800 border-rose-200",
    ADD_TRANSACTION: "bg-purple-100 text-purple-800 border-purple-200",
    APPROVE_TRANSACTION: "bg-indigo-100 text-indigo-800 border-indigo-200",
    REJECT_TRANSACTION: "bg-red-100 text-red-800 border-red-200",
  };

  const filteredLogs = initialLogs.filter((log) => {
    const matchesSearch =
      log.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = selectedAction === "ALL" || log.action === selectedAction;

    return matchesSearch && matchesAction;
  });

  const uniqueActions = Array.from(new Set(initialLogs.map((l) => l.action)));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-sm">
            <ShieldAlert size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              System Audit Logs <span className="text-lg font-normal text-gray-500">(কাজের হিস্ট্রি)</span>
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              ম্যানেজার ও ওনারের প্রতিটি কাজের অপরিবর্তনযোগ্য ডিজিটাল রেকর্ড
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
          <History size={16} />
          <span>মোট এন্ট্রি: {initialLogs.length} টি</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-gray-50/70">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="লগ খুঁজুন (ইউজার, অ্যাকশন বা বিবরণ)..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-800 bg-white"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>

          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="border border-gray-300 rounded-lg text-sm py-2 px-3 bg-white outline-none focus:ring-2 focus:ring-slate-800 font-medium text-gray-700"
            >
              <option value="ALL">সব ধরনের অ্যাকশন (All Actions)</option>
              {uniqueActions.map((act) => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-bold text-gray-700">তারিখ ও সময় (Timestamp)</th>
                <th className="p-4 font-bold text-gray-700">ব্যবহারকারী (User / Role)</th>
                <th className="p-4 font-bold text-gray-700">অ্যাকশন (Action)</th>
                <th className="p-4 font-bold text-gray-700">বিস্তারিত বিবরণ (Details)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.map((log) => {
                const dateObj = new Date(log.createdAt);
                const dateStr = dateObj.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
                const timeStr = dateObj.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                });

                const badgeColor = actionColors[log.action] || "bg-gray-100 text-gray-800 border-gray-200";

                return (
                  <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4 text-xs font-medium text-gray-600 whitespace-nowrap">
                      <div>{dateStr}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{timeStr}</div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs uppercase">
                          <User size={14} />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 capitalize">{log.user.username}</div>
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                            {log.user.role}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${badgeColor}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-gray-800 font-medium">
                      {log.details}
                    </td>
                  </tr>
                );
              })}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-gray-400">
                    <ShieldAlert size={36} className="mx-auto mb-2 text-gray-300" />
                    <p className="font-semibold text-gray-600">কোনো কাজের হিস্ট্রি পাওয়া যায়নি</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {searchTerm || selectedAction !== "ALL"
                        ? "অনুসন্ধানের শর্ত পরিবর্তন করে দেখুন।"
                        : "ইনভয়েস বা খরচ এন্ট্রি করার সাথে সাথে এখানে লগ তৈরি হবে।"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
