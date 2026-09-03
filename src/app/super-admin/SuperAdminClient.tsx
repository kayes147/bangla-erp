"use client";

import { useState } from "react";
import {
  Database,
  Users,
  Shield,
  Download,
  KeyRound,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Server,
  Layers,
  ArrowDownToLine,
  Search,
  Lock,
  X,
  Building2,
  Boxes,
  Receipt,
  Wallet,
} from "lucide-react";
import { resetUserPassword, createSystemUser } from "@/actions/superAdminActions";
import { useRouter } from "next/navigation";

interface Props {
  metrics: any;
  users: any[];
  auditLogs: any[];
}

export default function SuperAdminClient({ metrics, users, auditLogs }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "backup" | "logs">("overview");

  // User Search
  const [userSearch, setUserSearch] = useState("");

  // Password Reset Modal State
  const [resetModalUser, setResetModalUser] = useState<any | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Create User Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createUsername, setCreateUsername] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createRole, setCreateRole] = useState<"OWNER" | "MANAGER">("MANAGER");
  const [isCreating, setIsCreating] = useState(false);
  const [createMessage, setCreateMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase();
    return (
      u.username.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      (u.client?.name && u.client.name.toLowerCase().includes(q))
    );
  });

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalUser || !newPassword) return;

    setIsResetting(true);
    setResetMessage(null);

    const res = await resetUserPassword({
      userId: resetModalUser.id,
      newPassword,
    });

    setIsResetting(false);
    if (res.success) {
      setResetMessage({ type: "success", text: `'${resetModalUser.username}'-এর পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!` });
      setNewPassword("");
      setTimeout(() => {
        setResetModalUser(null);
        setResetMessage(null);
        router.refresh();
      }, 1500);
    } else {
      setResetMessage({ type: "error", text: res.error || "পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।" });
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createUsername || !createPassword) return;

    setIsCreating(true);
    setCreateMessage(null);

    const res = await createSystemUser({
      username: createUsername,
      password: createPassword,
      role: createRole,
    });

    setIsCreating(false);
    if (res.success) {
      setCreateMessage({ type: "success", text: `নতুন ${createRole} অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!` });
      setCreateUsername("");
      setCreatePassword("");
      setTimeout(() => {
        setIsCreateModalOpen(false);
        setCreateMessage(null);
        router.refresh();
      }, 1500);
    } else {
      setCreateMessage({ type: "error", text: res.error || "ইউজার তৈরি ব্যর্থ হয়েছে।" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-white">সুপার অ্যাডমিন ব্যাকএন্ড কন্ট্রোল প্যানেল</h1>
            <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
              Master Root
            </span>
          </div>
          <p className="text-xs text-slate-400">
            ডাটাবেজ ব্যাকআপ, ইউজার অ্যাক্সেস ও সিস্টেম অপারেশন সরাসরি নিয়ন্ত্রণ করুন।
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="/api/super-admin/backup"
            download
            className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 px-4 py-2.5 rounded-2xl text-xs font-black transition-all shadow-lg shadow-amber-500/10 active:scale-95 cursor-pointer"
          >
            <Download size={16} />
            <span>ডাটাবেজ ব্যাকআপ (.JSON)</span>
          </a>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-2xl text-xs font-black transition-all shadow-lg shadow-indigo-600/10 active:scale-95 cursor-pointer"
          >
            <UserPlus size={16} />
            <span>+ নতুন ইউজার</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-800 space-x-2 overflow-x-auto pb-1 text-sm font-bold">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-3 rounded-xl transition-all flex items-center space-x-2 ${
            activeTab === "overview"
              ? "bg-slate-800 text-amber-400 border border-slate-700"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <Layers size={16} />
          <span>📊 সিস্টেম ড্যাশবোর্ড</span>
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-3 rounded-xl transition-all flex items-center space-x-2 ${
            activeTab === "users"
              ? "bg-slate-800 text-amber-400 border border-slate-700"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <Users size={16} />
          <span>👥 ইউজার ও পাসওয়ার্ড ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("backup")}
          className={`px-4 py-3 rounded-xl transition-all flex items-center space-x-2 ${
            activeTab === "backup"
              ? "bg-slate-800 text-amber-400 border border-slate-700"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <Database size={16} />
          <span>💾 ডাটাবেজ ব্যাকআপ ও এক্সপোর্ট</span>
        </button>

        <button
          onClick={() => setActiveTab("logs")}
          className={`px-4 py-3 rounded-xl transition-all flex items-center space-x-2 ${
            activeTab === "logs"
              ? "bg-slate-800 text-amber-400 border border-slate-700"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <Clock size={16} />
          <span>📜 মাস্টার অডিট হিস্ট্রি ({auditLogs.length})</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Real Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <p className="text-[11px] font-bold text-slate-400 uppercase">মোট প্রতিষ্ঠান</p>
              <p className="text-2xl font-black text-white mt-1">{metrics.totalClients}</p>
              <span className="text-[10px] text-slate-500">Clients/Parties</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <p className="text-[11px] font-bold text-slate-400 uppercase">মোট চালান</p>
              <p className="text-2xl font-black text-white mt-1">{metrics.totalInvoices}</p>
              <span className="text-[10px] text-slate-500">Invoices</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <p className="text-[11px] font-bold text-slate-400 uppercase">মোট পণ্য আইটেম</p>
              <p className="text-2xl font-black text-white mt-1">{metrics.totalProducts}</p>
              <span className="text-[10px] text-slate-500">Products</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <p className="text-[11px] font-bold text-slate-400 uppercase">ক্যাশ লেনদেন</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">{metrics.totalTransactions}</p>
              <span className="text-[10px] text-slate-500">Transactions</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <p className="text-[11px] font-bold text-slate-400 uppercase">দৈনিক খরচ</p>
              <p className="text-2xl font-black text-red-400 mt-1">{metrics.totalExpenses}</p>
              <span className="text-[10px] text-slate-500">Expenses</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <p className="text-[11px] font-bold text-slate-400 uppercase">সিস্টেম ইউজার</p>
              <p className="text-2xl font-black text-indigo-400 mt-1">{metrics.totalUsers}</p>
              <span className="text-[10px] text-slate-500">Users/Accounts</span>
            </div>
          </div>

          {/* System & Database Health */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Server size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">ডাটাবেজ ও সার্ভার ইনফরমেশন</h3>
                  <p className="text-xs text-slate-400">রিয়েল-টাইম সিস্টেম কানেক্টিভিটি স্ট্যাটাস</p>
                </div>
              </div>

              <div className="divide-y divide-slate-800 text-xs font-medium text-slate-300">
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">ডাটাবেজ ইঞ্জিন:</span>
                  <span className="font-bold text-emerald-400">PostgreSQL (Neon Cloud DB)</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">কানেকশন স্ট্যাটাস:</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    সক্রিয় ও সংযুক্ত (Connected)
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">টাইমজোন (Timezone):</span>
                  <span className="font-mono text-slate-300">Asia/Dhaka (BST UTC+6)</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">এনভায়রনমেন্ট:</span>
                  <span className="font-mono text-amber-400">{metrics.nodeEnv}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">ক্যাশ ইন ফ্লো:</span>
                  <span className="font-bold text-emerald-400">৳ {metrics.totalCashIn?.toLocaleString() || 0}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">ক্যাশ আউট ফ্লো:</span>
                  <span className="font-bold text-red-400">৳ {metrics.totalCashOut?.toLocaleString() || 0}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">দ্রুত ব্যাকএন্ড অ্যাকশন</h3>
                  <p className="text-xs text-slate-400">জরুরি কন্ট্রোল ও ব্যাকআপ ডাউনলোড</p>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href="/api/super-admin/backup"
                  download
                  className="w-full flex items-center justify-between p-3.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/40 rounded-2xl text-xs font-bold transition-all text-slate-200"
                >
                  <div className="flex items-center space-x-3">
                    <Download size={18} className="text-amber-400" />
                    <div>
                      <p className="font-extrabold text-white">সম্পূর্ণ ডাটাবেজ ব্যাকআপ ডাউনলোড করুন</p>
                      <p className="text-[10px] text-slate-400">সকল প্রতিষ্ঠান, চালান, পণ্য ও ক্যাশ ডাটা এক ক্লিকে JSON ফাইলে সেভ করুন</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase bg-amber-400 text-slate-950 px-2 py-1 rounded-md">
                    Export
                  </span>
                </a>

                <button
                  onClick={() => {
                    setActiveTab("users");
                    setIsCreateModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/40 rounded-2xl text-xs font-bold transition-all text-slate-200 cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <UserPlus size={18} className="text-indigo-400" />
                    <div className="text-left">
                      <p className="font-extrabold text-white">নতুন অ্যাডমিন/ম্যানেজার ইউজার তৈরি করুন</p>
                      <p className="text-[10px] text-slate-400">নতুন স্টাফের জন্য ইউজারনেম ও পাসওয়ার্ড সেট করুন</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase bg-indigo-500 text-white px-2 py-1 rounded-md">
                    Create
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("users")}
                  className="w-full flex items-center justify-between p-3.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/40 rounded-2xl text-xs font-bold transition-all text-slate-200 cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <KeyRound size={18} className="text-emerald-400" />
                    <div className="text-left">
                      <p className="font-extrabold text-white">ইউজার পাসওয়ার্ড রিসেট করুন</p>
                      <p className="text-[10px] text-slate-400">ভুলে যাওয়া পাসওয়ার্ড পরিবর্তন করুন</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase bg-slate-700 text-slate-300 px-2 py-1 rounded-md">
                    Manage
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Users Management */}
      {activeTab === "users" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-white">সিস্টেম ইউজার ক্রেডেনশিয়াল ম্যানেজমেন্ট</h2>
              <p className="text-xs text-slate-400 mt-0.5">সকল লগইন অ্যাকাউন্ট পর্যবেক্ষণ ও পাসওয়ার্ড রিসেট করুন</p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative w-full sm:w-64">
                <Search size={15} className="absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="ইউজার বা প্রতিষ্ঠান খুঁজুন..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-all font-medium"
                />
              </div>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap cursor-pointer active:scale-95 transition-all"
              >
                <UserPlus size={14} />
                <span>+ নতুন ইউজার</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-4">ইউজারনেম (Username)</th>
                  <th className="p-4">রোল (Role)</th>
                  <th className="p-4">সম্পর্কিত পরিচয় (Identity)</th>
                  <th className="p-4">তৈরির তারিখ (Created)</th>
                  <th className="p-4 text-right">অ্যাকশন (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map((u) => {
                  let roleBadgeColor = "bg-slate-800 text-slate-300 border-slate-700";
                  if (u.role === "OWNER") roleBadgeColor = "bg-amber-400/10 text-amber-400 border-amber-400/30 font-black";
                  if (u.role === "MANAGER") roleBadgeColor = "bg-blue-400/10 text-blue-400 border-blue-400/30 font-black";
                  if (u.role === "CLIENT") roleBadgeColor = "bg-purple-400/10 text-purple-400 border-purple-400/30 font-black";

                  return (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="font-mono font-bold text-white text-sm">{u.username}</div>
                        <div className="text-[10px] text-slate-500">ID: {u.id.slice(0, 10)}...</div>
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] border uppercase ${roleBadgeColor}`}>
                          {u.role === "OWNER" ? "মালিক (Owner)" : u.role === "MANAGER" ? "ম্যানেজার (Manager)" : "প্রতিষ্ঠান (Company)"}
                        </span>
                      </td>

                      <td className="p-4 font-medium">
                        {u.client ? (
                          <div>
                            <p className="font-bold text-white">{u.client.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{u.client.phone}</p>
                          </div>
                        ) : u.employee ? (
                          <div>
                            <p className="font-bold text-white">{u.employee.name}</p>
                            <p className="text-[10px] text-slate-400">{u.employee.designation}</p>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">সিস্টেম অ্যাডমিন অ্যাকাউন্ট</span>
                        )}
                      </td>

                      <td className="p-4 text-slate-400 font-mono">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setResetModalUser(u);
                            setNewPassword("");
                            setResetMessage(null);
                          }}
                          className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-xl font-bold text-xs transition-all active:scale-95 cursor-pointer"
                        >
                          <KeyRound size={12} />
                          <span>পাসওয়ার্ড রিসেট</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      কোনো ইউজার পাওয়া যায়নি।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Database Backup */}
      {activeTab === "backup" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6 text-center max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <Database size={32} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">সম্পূর্ণ ডাটাবেজ ব্যাকআপ ও এক্সপোর্ট</h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                এক ক্লিকে আপনার সমস্ত ব্যবসায়িক তথ্য (প্রতিষ্ঠান, চালান, পণ্য, ক্যাশ খাতা, খরচ ও ইউজার) একটি নিরাপদ JSON ফাইলে ডাউনলোড করে সংরক্ষণ করুন।
              </p>
            </div>

            <div className="pt-2">
              <a
                href="/api/super-admin/backup"
                download
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Download size={18} />
                <span>এখনই সম্পূর্ণ ব্যাকআপ ডাউনলোড করুন (.JSON)</span>
              </a>
            </div>

            <div className="p-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl text-left text-xs space-y-2 text-slate-400">
              <p className="font-bold text-slate-200">📦 এই ব্যাকআপ ফাইলের ভেতরে যা যা সংরক্ষিত হবে:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex items-center gap-1.5">
                  <Building2 size={13} className="text-indigo-400" />
                  <span>প্রতিষ্ঠান: {metrics.totalClients} টি</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex items-center gap-1.5">
                  <Boxes size={13} className="text-amber-400" />
                  <span>পণ্য আইটেম: {metrics.totalProducts} টি</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex items-center gap-1.5">
                  <FileText size={13} className="text-blue-400" />
                  <span>চালান ও বিবরণ: {metrics.totalInvoices} টি</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex items-center gap-1.5">
                  <Wallet size={13} className="text-emerald-400" />
                  <span>ক্যাশ লেনদেন: {metrics.totalTransactions} টি</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex items-center gap-1.5">
                  <Receipt size={13} className="text-red-400" />
                  <span>দৈনিক খরচ: {metrics.totalExpenses} টি</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex items-center gap-1.5">
                  <Users size={13} className="text-purple-400" />
                  <span>লগইন ইউজার: {metrics.totalUsers} টি</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Logs */}
      {activeTab === "logs" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-black text-white">মাস্টার অডিট ট্রেইল ও কাজের হিস্ট্রি</h2>
              <p className="text-xs text-slate-400">সিস্টেমের সর্বশেষ ৫০টি গুরুত্বপূর্ণ অ্যাক্টিভিটি</p>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              সর্বশেষ ৫০টি রেকর্ড
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-4">সময় (Time)</th>
                  <th className="p-4">অ্যাকশন (Action)</th>
                  <th className="p-4">ইউজার (Performed By)</th>
                  <th className="p-4">বিস্তারিত বিবরণ (Details)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono text-slate-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-800 text-amber-400 border border-slate-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-white">
                      {log.user?.username || "সিস্টেম"}
                      {log.user?.role && (
                        <span className="block text-[9px] font-normal text-slate-400 uppercase">({log.user.role})</span>
                      )}
                    </td>
                    <td className="p-4 text-slate-300 font-medium">
                      {log.details}
                    </td>
                  </tr>
                ))}

                {auditLogs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">
                      কোনো অডিট লগ রেকর্ড নেই।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <KeyRound size={18} className="text-amber-400" />
                <h3 className="font-extrabold text-white text-base">পাসওয়ার্ড রিসেট করুন</h3>
              </div>
              <button
                onClick={() => setResetModalUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1">
              <p className="text-slate-400">ইউজারনেম: <span className="font-mono font-bold text-white">{resetModalUser.username}</span></p>
              <p className="text-slate-400">রোল: <span className="font-bold text-amber-400">{resetModalUser.role}</span></p>
              {resetModalUser.client && (
                <p className="text-slate-400">প্রতিষ্ঠান: <span className="font-bold text-indigo-400">{resetModalUser.client.name}</span></p>
              )}
            </div>

            {resetMessage && (
              <div className={`p-3 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                resetMessage.type === "success" ? "bg-emerald-950 border border-emerald-800 text-emerald-300" : "bg-red-950 border border-red-800 text-red-300"
              }`}>
                {resetMessage.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{resetMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  নতুন পাসওয়ার্ড লিখুন <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="ন্যূনতম ৪ অক্ষরের পাসওয়ার্ড..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-bold text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isResetting || !newPassword}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-amber-500/10"
                >
                  {isResetting ? "আপডেট হচ্ছে..." : "পাসওয়ার্ড সংরক্ষণ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <UserPlus size={18} className="text-indigo-400" />
                <h3 className="font-extrabold text-white text-base">নতুন সিস্টেম ইউজার তৈরি করুন</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {createMessage && (
              <div className={`p-3 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                createMessage.type === "success" ? "bg-emerald-950 border border-emerald-800 text-emerald-300" : "bg-red-950 border border-red-800 text-red-300"
              }`}>
                {createMessage.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{createMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  ইউজারনেম (Username) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: manager2 বা supervisor"
                  value={createUsername}
                  onChange={(e) => setCreateUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-bold text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  পাসওয়ার্ড (Password) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="পাসওয়ার্ড দিন..."
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-bold text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  রোল (Role) <span className="text-red-400">*</span>
                </label>
                <select
                  value={createRole}
                  onChange={(e) => setCreateRole(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-bold text-white outline-none focus:border-indigo-500 transition-all cursor-pointer"
                >
                  <option value="MANAGER">ম্যানেজার (Manager - সীমিত অ্যাক্সেস)</option>
                  <option value="OWNER">মালিক (Owner - পূর্ণ অ্যাক্সেস)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !createUsername || !createPassword}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-indigo-600/10"
                >
                  {isCreating ? "তৈরি হচ্ছে..." : "ইউজার অ্যাকাউন্ট তৈরি করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
