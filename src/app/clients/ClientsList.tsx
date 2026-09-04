"use client";

import { useState } from "react";
import { 
  Search, 
  KeyRound, 
  X, 
  CheckCircle2, 
  Copy, 
  MessageSquare, 
  Phone, 
  Eye, 
  EyeOff, 
  UserCheck, 
  ShieldCheck, 
  ExternalLink,
  MapPin,
  Calendar,
  Trash2,
  AlertTriangle,
  Pencil,
  Save,
  UserX,
  Package,
  Receipt,
  Building2,
  Printer
} from "lucide-react";
import { createClientLogin, deleteClient, updateClient, revokeClientLogin } from "@/actions/clientActions";
import { useRouter } from "next/navigation";
import PrintableInvoiceModal from "@/components/PrintableInvoiceModal";

export default function ClientsList({ initialClients }: { initialClients: any[] }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Create / Edit Login Modal State
  const [selectedClientForLogin, setSelectedClientForLogin] = useState<any | null>(null);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [isSavingLogin, setIsSavingLogin] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [copied, setCopied] = useState(false);

  // View Profile Modal State
  const [selectedClientForProfile, setSelectedClientForProfile] = useState<any | null>(null);
  const [profileActiveTab, setProfileActiveTab] = useState<"invoices" | "transactions" | "info">("invoices");
  const [profileInvoiceFilter, setProfileInvoiceFilter] = useState<"all" | "product_in" | "product_out">("all");
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<any | null>(null);

  // Delete Company Modal State
  const [selectedClientForDelete, setSelectedClientForDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDeleteCompany = async () => {
    if (!selectedClientForDelete) return;
    setIsDeleting(true);
    setDeleteError("");
    try {
      const res = await deleteClient(selectedClientForDelete.id);
      if (res.success) {
        setSelectedClientForDelete(null);
        if (selectedClientForProfile?.id === selectedClientForDelete.id) {
          setSelectedClientForProfile(null);
        }
        router.refresh();
      } else {
        setDeleteError(res.error || "প্রতিষ্ঠান মুছতে সমস্যা হয়েছে");
      }
    } catch (err: any) {
      setDeleteError(err.message || "একটি ত্রুটি ঘটেছে");
    } finally {
      setIsDeleting(false);
    }
  };

  // Edit Company Modal State
  const [selectedClientForEdit, setSelectedClientForEdit] = useState<any | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editAmount, setEditAmount] = useState("0");
  const [editBalanceType, setEditBalanceType] = useState<"none" | "receivable" | "payable">("none");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");

  const openEditModal = (client: any) => {
    setSelectedClientForEdit(client);
    setEditName(client.name);
    setEditPhone(client.phone);
    setEditAddress(client.address || "");
    const bal = client.openingBalance || 0;
    if (bal > 0) {
      setEditBalanceType("receivable");
      setEditAmount(bal.toString());
    } else if (bal < 0) {
      setEditBalanceType("payable");
      setEditAmount(Math.abs(bal).toString());
    } else {
      setEditBalanceType("none");
      setEditAmount("0");
    }
    setEditError("");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientForEdit) return;
    if (!editName.trim()) {
      setEditError("অনুগ্রহ করে প্রতিষ্ঠানের নাম লিখুন।");
      return;
    }
    if (!editPhone.trim()) {
      setEditError("অনুগ্রহ করে মোবাইল নম্বর লিখুন।");
      return;
    }

    setIsSavingEdit(true);
    setEditError("");

    let openingBalance = parseFloat(editAmount) || 0;
    if (editBalanceType === "none") {
      openingBalance = 0;
    } else if (editBalanceType === "payable") {
      openingBalance = -Math.abs(openingBalance);
    } else {
      openingBalance = Math.abs(openingBalance);
    }

    try {
      const res = await updateClient({
        id: selectedClientForEdit.id,
        name: editName.trim(),
        phone: editPhone.trim(),
        address: editAddress.trim(),
        openingBalance,
      });

      if (res.success) {
        setSelectedClientForEdit(null);
        if (selectedClientForProfile?.id === selectedClientForEdit.id) {
          setSelectedClientForProfile({
            ...selectedClientForProfile,
            name: editName.trim(),
            phone: editPhone.trim(),
            address: editAddress.trim(),
            openingBalance,
          });
        }
        router.refresh();
      } else {
        setEditError(res.error || "প্রতিষ্ঠান আপডেট করতে ব্যর্থ হয়েছে");
      }
    } catch (err: any) {
      setEditError(err.message || "একটি ত্রুটি ঘটেছে");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Revoke Login Modal State
  const [clientToRevoke, setClientToRevoke] = useState<any | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);
  const [revokeError, setRevokeError] = useState("");

  const handleRevokeLogin = async () => {
    if (!clientToRevoke) return;
    setIsRevoking(true);
    setRevokeError("");
    try {
      const res = await revokeClientLogin(clientToRevoke.id);
      if (res.success) {
        setClientToRevoke(null);
        if (selectedClientForLogin?.id === clientToRevoke.id) {
          setSelectedClientForLogin(null);
        }
        if (selectedClientForProfile?.id === clientToRevoke.id) {
          setSelectedClientForProfile({
            ...selectedClientForProfile,
            user: null,
          });
        }
        router.refresh();
      } else {
        setRevokeError(res.error || "লগইন অ্যাক্সেস বাতিল করতে ব্যর্থ হয়েছে");
      }
    } catch (err: any) {
      setRevokeError(err.message || "একটি ত্রুটি ঘটেছে");
    } finally {
      setIsRevoking(false);
    }
  };

  const filteredClients = initialClients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm);
    const matchesType =
      filterType === "all" ||
      (filterType === "due" && client.openingBalance !== 0) ||
      (filterType === "has_login" && !!client.user);
    return matchesSearch && matchesType;
  });

  const openLoginModal = (client: any) => {
    setSelectedClientForLogin(client);
    setLoginUsername(client.user?.username || client.phone.trim().replace(/[^0-9a-zA-Z]/g, ""));
    setLoginPassword("123456");
    setLoginSuccess(false);
    setLoginError("");
    setCopied(false);
  };

  const handleSaveLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientForLogin) return;

    setIsSavingLogin(true);
    setLoginError("");

    try {
      const res = await createClientLogin({
        clientId: selectedClientForLogin.id,
        username: loginUsername,
        password: loginPassword,
      });

      if (res.success) {
        setLoginSuccess(true);
        router.refresh();
      } else {
        setLoginError(res.error || "লগইন তৈরি করতে ব্যর্থ হয়েছে");
      }
    } catch (err: any) {
      setLoginError(err.message || "একটি ত্রুটি ঘটেছে");
    } finally {
      setIsSavingLogin(false);
    }
  };

  const getWhatsAppShareUrl = () => {
    if (!selectedClientForLogin) return "#";
    const phone = selectedClientForLogin.phone.replace(/[^0-9]/g, "");
    const formattedPhone = phone.startsWith("88") ? phone : `88${phone}`;
    const text = encodeURIComponent(
      `আসসালামু আলাইকুম ${selectedClientForLogin.name},\nBOLAKA FACTORY এর বাংলা ইআরপি পোর্টালে আপনার লগইন অ্যাক্সেস সক্রিয় করা হয়েছে।\n\n📌 ইউজারনেম: ${loginUsername}\n🔑 পাসওয়ার্ড: ${loginPassword}\n🔗 লগইন করুন: ${typeof window !== "undefined" ? window.location.origin : ""}/login\n\nধন্যবাদ!`
    );
    return `https://wa.me/${formattedPhone}?text=${text}`;
  };

  const handleCopyCredentials = () => {
    if (!selectedClientForLogin) return;
    const text = `প্রতিষ্ঠান: ${selectedClientForLogin.name}\nইউজারনেম: ${loginUsername}\nপাসওয়ার্ড: ${loginPassword}\nওয়েবসাইট: ${window.location.origin}/login`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Filters and Search Bar */}
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="নাম বা মোবাইল নম্বর দিয়ে খুঁজুন (Search...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium text-gray-800"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg outline-none text-sm bg-white font-bold text-gray-700"
        >
          <option value="all">সবাই (All)</option>
          <option value="due">যাদের বাকী আছে (Due Only)</option>
          <option value="has_login">লগইন অ্যাক্সেস আছে (With Login)</option>
        </select>
      </div>

      {/* Clients Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-white border-b border-gray-100">
            <tr>
              <th className="p-4 font-bold text-gray-700 w-12 text-center"># <span className="text-[10px] font-normal text-gray-400 block uppercase">(SL)</span></th>
              <th className="p-4 font-bold text-gray-700">প্রতিষ্ঠানের নাম <span className="text-[10px] font-normal text-gray-400 block uppercase">(Company Name)</span></th>
              <th className="p-4 font-bold text-gray-700">মোবাইল <span className="text-[10px] font-normal text-gray-400 block uppercase">(Phone)</span></th>
              <th className="p-4 font-bold text-gray-700">ধরন <span className="text-[10px] font-normal text-gray-400 block uppercase">(Type)</span></th>
              <th className="p-4 font-bold text-gray-700">লগইন অ্যাক্সেস <span className="text-[10px] font-normal text-gray-400 block uppercase">(Login Access)</span></th>
              <th className="p-4 font-bold text-gray-700">বর্তমান বকেয়া <span className="text-[10px] font-normal text-gray-400 block uppercase">(Current Due)</span></th>
              <th className="p-4 font-bold text-gray-700 text-right">অ্যাকশন <span className="text-[10px] font-normal text-gray-400 block uppercase">(Action)</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredClients.map((client, index) => (
              <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                {/* Count / SL */}
                <td className="p-4 text-center font-extrabold text-gray-400 text-xs">
                  {index + 1}
                </td>

                {/* Name and Address */}
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-black border border-indigo-200 shrink-0">
                      {index + 1}
                    </span>
                    <p className="font-bold text-gray-900">{client.name}</p>
                  </div>
                  <p className="text-xs text-gray-500 font-medium pl-7">{client.address || "ঠিকানা নেই"}</p>
                </td>

                {/* Phone */}
                <td className="p-4 font-bold text-gray-800">{client.phone}</td>

                {/* Type: Mahajon */}
                <td className="p-4">
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-md text-xs font-bold">
                    প্রতিষ্ঠান
                  </span>
                </td>

                {/* Login Access Column */}
                <td className="p-4">
                  {client.user ? (
                    <div>
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-xs font-bold">
                        <CheckCircle2 size={12} className="text-emerald-600" />
                        <span>সক্রিয় অ্যাক্সেস</span>
                      </span>
                      <p className="text-[11px] text-gray-500 mt-1 font-mono font-bold">ID: {client.user.username}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <button
                          onClick={() => openLoginModal(client)}
                          className="text-[11px] text-indigo-600 hover:text-indigo-800 hover:underline font-bold cursor-pointer"
                        >
                          রিসেট / দেখুন
                        </button>
                        <span className="text-gray-300">•</span>
                        <button
                          onClick={() => {
                            setRevokeError("");
                            setClientToRevoke(client);
                          }}
                          className="text-[11px] text-red-600 hover:text-red-800 hover:underline font-bold cursor-pointer"
                          title="লগইন অ্যাক্সেস বাতিল করুন (Revoke Login Access)"
                        >
                          বাতিল (Revoke)
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => openLoginModal(client)}
                      className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer active:scale-95 shadow-2xs"
                    >
                      <KeyRound size={12} />
                      <span>+ Create Login</span>
                    </button>
                  )}
                </td>

                {/* Current Due */}
                <td className="p-4 font-bold text-gray-900">
                  {(() => {
                    const invs = client.invoices || [];
                    const invDue = invs.reduce((sum: number, i: any) => sum + Math.max(0, (i.totalAmount || 0) - (i.paidAmount || 0)), 0);
                    const totalClientDue = (client.openingBalance || 0) + invDue;
                    if (totalClientDue > 0) {
                      return (
                        <span className="text-red-600 font-extrabold">
                          ৳ {totalClientDue.toLocaleString()}{" "}
                          <span className="text-[10px] text-gray-400 font-normal uppercase">(Receivable)</span>
                        </span>
                      );
                    } else if (totalClientDue < 0) {
                      return (
                        <span className="text-blue-600 font-extrabold">
                          ৳ {Math.abs(totalClientDue).toLocaleString()}{" "}
                          <span className="text-[10px] text-gray-400 font-normal uppercase">(Payable)</span>
                        </span>
                      );
                    } else {
                      return <span className="text-gray-400">৳ 0</span>;
                    }
                  })()}
                </td>

                {/* Action Column */}
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end space-x-1.5">
                    <button
                      onClick={() => {
                        setSelectedClientForProfile(client);
                        setProfileActiveTab("invoices");
                        setProfileInvoiceFilter("all");
                      }}
                      className="text-indigo-600 hover:text-indigo-800 hover:underline font-bold text-sm cursor-pointer mr-1"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => openEditModal(client)}
                      className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                      title="প্রতিষ্ঠান এডিট করুন (Edit Company)"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteError("");
                        setSelectedClientForDelete(client);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="প্রতিষ্ঠান মুছে ফেলুন (Delete Company)"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredClients.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-400 font-medium">
                  কোনো প্রতিষ্ঠান পাওয়া যায়নি।
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE / EDIT LOGIN MODAL */}
      {selectedClientForLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <ShieldCheck size={20} className="text-indigo-200" />
                <h3 className="font-bold text-base">প্রতিষ্ঠানের লগইন অ্যাক্সেস</h3>
              </div>
              <button
                onClick={() => setSelectedClientForLogin(null)}
                className="text-indigo-200 hover:text-white p-1 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {loginSuccess ? (
                /* Success View with Copy and WhatsApp Buttons */
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2 text-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 size={24} />
                    </div>
                    <h4 className="font-bold text-base text-emerald-900">লগইন সফলভাবে প্রস্তুত!</h4>
                    <p className="text-xs text-emerald-700">
                      প্রতিষ্ঠান এখন তার ইউজারনেম ও পাসওয়ার্ড দিয়ে বাংলা ইআরপিতে লগইন করতে পারবেন।
                    </p>

                    <div className="mt-3 p-3 bg-white rounded-lg border border-emerald-200 text-left text-xs font-mono space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">প্রতিষ্ঠান:</span>
                        <span className="font-bold text-gray-800">{selectedClientForLogin.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">ইউজারনেম:</span>
                        <span className="font-bold text-indigo-700">{loginUsername}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">পাসওয়ার্ড:</span>
                        <span className="font-bold text-indigo-700">{loginPassword}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {/* Share via WhatsApp */}
                    <a
                      href={getWhatsAppShareUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
                    >
                      <MessageSquare size={16} />
                      <span>WhatsApp-এ লগইন তথ্য পাঠান</span>
                    </a>

                    {/* Copy to Clipboard */}
                    <button
                      type="button"
                      onClick={handleCopyCredentials}
                      className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Copy size={15} />
                      <span>{copied ? "কপি করা হয়েছে! ✓" : "তথ্য কপি করুন"}</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <button
                      onClick={() => setSelectedClientForLogin(null)}
                      className="w-full py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      সম্পন্ন (Done)
                    </button>
                  </div>
                </div>
              ) : (
                /* Form to Create/Update Credentials */
                <form onSubmit={handleSaveLogin} className="space-y-4">
                  {loginError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700">
                      {loginError}
                    </div>
                  )}

                  {/* Mahajon details header */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">প্রতিষ্ঠান</span>
                      <span className="font-bold text-sm text-gray-900">{selectedClientForLogin.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-mono font-bold bg-white px-2 py-1 rounded border border-gray-200">
                      {selectedClientForLogin.phone}
                    </span>
                  </div>

                  {/* Username Input */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      ইউজারনেম (Username) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      placeholder="e.g. 01701830968"
                      className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm text-gray-800 font-mono"
                      required
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      প্রতিষ্ঠান এই ইউজারনেম দিয়ে সিস্টেমে লগইন করবেন (যেমন: মোবাইল নম্বর)।
                    </p>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      পাসওয়ার্ড (Password) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="পাসওয়ার্ড দিন"
                        className="w-full p-2.5 pr-10 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm text-gray-800 font-mono"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">
                      ডিফল্ট পাসওয়ার্ড হিসেবে <span className="font-bold text-gray-600">123456</span> রাখা হয়েছে।
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 flex items-center justify-between border-t border-gray-100">
                    {selectedClientForLogin.user ? (
                      <button
                        type="button"
                        onClick={() => {
                          const c = selectedClientForLogin;
                          setSelectedClientForLogin(null);
                          setRevokeError("");
                          setClientToRevoke(c);
                        }}
                        className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center space-x-1 cursor-pointer"
                        title="লগইন অ্যাক্সেস বাতিল করুন"
                      >
                        <UserX size={14} />
                        <span>অ্যাক্সেস বাতিল (Revoke)</span>
                      </button>
                    ) : (
                      <div />
                    )}

                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => setSelectedClientForLogin(null)}
                        className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                      >
                        বাতিল
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingLogin}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer"
                      >
                        <UserCheck size={16} />
                        <span>{isSavingLogin ? "তৈরি হচ্ছে..." : selectedClientForLogin.user ? "পাসওয়ার্ড আপডেট করুন" : "লগইন সক্রিয় করুন"}</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW PROFILE & 360 LEDGER MODAL */}
      {selectedClientForProfile && (() => {
        const profileInvoices = selectedClientForProfile.invoices || [];
        const profileTransactions = selectedClientForProfile.transactions || [];

        const totalInvoicedAmount = profileInvoices.reduce(
          (sum: number, inv: any) => sum + (inv.totalAmount || 0),
          0
        );
        const totalPaidOnInvoices = profileInvoices.reduce(
          (sum: number, inv: any) => sum + (inv.paidAmount || 0),
          0
        );
        const totalInvoiceDue = totalInvoicedAmount - totalPaidOnInvoices;
        const openingDue = selectedClientForProfile.openingBalance || 0;
        const netDue = openingDue + totalInvoiceDue;

        const totalCashIn = profileTransactions
          .filter((t: any) => t.type === "in")
          .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
        const totalCashOut = profileTransactions
          .filter((t: any) => t.type === "out")
          .reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

        const filteredProfileInvoices = profileInvoices.filter((inv: any) => {
          if (profileInvoiceFilter === "product_in") return inv.type === "product_in";
          if (profileInvoiceFilter === "product_out") return inv.type === "product_out";
          return true;
        });

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gray-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
              {/* Modal Header */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex justify-between items-center shrink-0 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 bg-indigo-600/40 text-indigo-300 border border-indigo-400/30 rounded-xl flex items-center justify-center font-bold text-xl shadow-inner">
                    {selectedClientForProfile.name?.charAt(0) || "C"}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-lg text-white">{selectedClientForProfile.name}</h3>
                      <span className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-[10px] font-bold rounded-full">
                        প্রতিষ্ঠান প্রোফাইল
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Phone size={12} className="text-slate-400" />
                        {selectedClientForProfile.phone}
                      </span>
                      {selectedClientForProfile.address && (
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-slate-400" />
                          {selectedClientForProfile.address}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedClientForProfile(null)}
                  className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Top Financial Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-50 border-b border-gray-200 shrink-0">
                {/* 1. Opening Balance */}
                <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">পূর্বের বকেয়া</span>
                  <span className="text-base font-extrabold text-gray-900 block mt-0.5">
                    ৳ {openingDue.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-400">হিসাব শুরুর বকেয়া</span>
                </div>

                {/* 2. Total Invoiced Amount */}
                <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">মোট চালান বিল</span>
                  <span className="text-base font-extrabold text-indigo-700 block mt-0.5">
                    ৳ {totalInvoicedAmount.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-400">{profileInvoices.length} টি চালান (ইন/আউট)</span>
                </div>

                {/* 3. Total Cash Transactions */}
                <div className="bg-white p-3 rounded-xl border border-gray-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">মোট নগদ লেনদেন</span>
                  <span className="text-base font-extrabold text-emerald-700 block mt-0.5">
                    ৳ {totalCashIn.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-400">{profileTransactions.length} টি ক্যাশ এন্ট্রি</span>
                </div>

                {/* 4. Total Outstanding Due */}
                <div className="bg-white p-3 rounded-xl border border-red-200/80 shadow-2xs bg-red-50/30">
                  <span className="text-[10px] font-bold text-red-600 uppercase block">বর্তমান মোট বকেয়া</span>
                  <span className="text-lg font-black text-red-600 block mt-0.5">
                    ৳ {netDue.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-red-500 font-bold">
                    {netDue > 0 ? "পাওয়া যাবে (Receivable)" : netDue < 0 ? "দিতে হবে (Payable)" : "কোনো বাকি নেই"}
                  </span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-gray-200 px-4 pt-2 bg-white shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => setProfileActiveTab("invoices")}
                  className={`pb-2.5 px-3.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                    profileActiveTab === "invoices"
                      ? "border-indigo-600 text-indigo-700"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <Package size={15} />
                  <span>পণ্য ইন ও আউট চালান ({profileInvoices.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProfileActiveTab("transactions")}
                  className={`pb-2.5 px-3.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                    profileActiveTab === "transactions"
                      ? "border-indigo-600 text-indigo-700"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <Receipt size={15} />
                  <span>নগদ লেনদেন খতিয়ান ({profileTransactions.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProfileActiveTab("info")}
                  className={`pb-2.5 px-3.5 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                    profileActiveTab === "info"
                      ? "border-indigo-600 text-indigo-700"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <Building2 size={15} />
                  <span>প্রতিষ্ঠান তথ্য ও অ্যাকশন</span>
                </button>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-gray-50/50">
                {/* TAB 1: INVOICES (PRODUCT IN / OUT) */}
                {profileActiveTab === "invoices" && (
                  <div className="space-y-4">
                    {/* Filter Pills */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setProfileInvoiceFilter("all")}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            profileInvoiceFilter === "all"
                              ? "bg-indigo-600 text-white shadow-2xs"
                              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          সব ({profileInvoices.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setProfileInvoiceFilter("product_in")}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            profileInvoiceFilter === "product_in"
                              ? "bg-blue-600 text-white shadow-2xs"
                              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          📥 পণ্য ইন ({profileInvoices.filter((i: any) => i.type === "product_in").length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setProfileInvoiceFilter("product_out")}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            profileInvoiceFilter === "product_out"
                              ? "bg-emerald-600 text-white shadow-2xs"
                              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          📤 পণ্য আউট ({profileInvoices.filter((i: any) => i.type === "product_out").length})
                        </button>
                      </div>

                      <span className="text-xs text-gray-400 hidden sm:inline">
                        মাল কেনা ও বিক্রির সকল চালান
                      </span>
                    </div>

                    {filteredProfileInvoices.length === 0 ? (
                      <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-gray-300">
                        <Package className="mx-auto text-gray-400 mb-2" size={36} />
                        <p className="font-bold text-gray-700 text-sm">কোনো পণ্য ইন বা আউট চালান পাওয়া যায়নি</p>
                        <p className="text-xs text-gray-400 mt-1">
                          এই প্রতিষ্ঠানের সাথে এখনও কোনো কেনাবেচা বা পণ্য ডেলিভারি চালান এন্ট্রি করা হয়নি।
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredProfileInvoices.map((inv: any) => {
                          const isSale = inv.type === "product_out";
                          const due = inv.totalAmount - (inv.paidAmount || 0);

                          return (
                            <div
                              key={inv.id}
                              className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs space-y-3"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100">
                                <div className="flex items-center space-x-2">
                                  <span className="font-mono text-xs font-extrabold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                                    #{inv.id.slice(-8)}
                                  </span>
                                  {isSale ? (
                                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-md">
                                      📤 পণ্য আউট (Sale)
                                    </span>
                                  ) : (
                                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold rounded-md">
                                      📥 পণ্য ইন (Purchase)
                                    </span>
                                  )}
                                  <span className="text-xs text-gray-500 font-medium">
                                    {new Date(inv.date).toLocaleDateString()}
                                  </span>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                      inv.paymentStatus === "paid"
                                        ? "bg-emerald-100 text-emerald-800"
                                        : inv.paymentStatus === "partial"
                                        ? "bg-amber-100 text-amber-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {inv.paymentStatus === "paid"
                                      ? "পরিশোধিত"
                                      : inv.paymentStatus === "partial"
                                      ? "আংশিক জমা"
                                      : "বকেয়া"}
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setSelectedInvoiceForPrint({
                                        ...inv,
                                        client: selectedClientForProfile,
                                      })
                                    }
                                    className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                                    title="চালান প্রিন্ট"
                                  >
                                    <Printer size={13} />
                                    <span>প্রিন্ট</span>
                                  </button>
                                </div>
                              </div>

                              {/* Items Table */}
                              {inv.items && inv.items.length > 0 && (
                                <div className="overflow-x-auto">
                                  <table className="w-full text-xs text-left">
                                    <thead className="bg-gray-50 text-gray-500 border-y border-gray-100 font-bold">
                                      <tr>
                                        <th className="py-1.5 px-3">পণ্যের বিবরণ</th>
                                        <th className="py-1.5 px-3 text-right">পরিমাণ (Qty)</th>
                                        <th className="py-1.5 px-3 text-right">দর (Rate)</th>
                                        <th className="py-1.5 px-3 text-right">মোট (Total)</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                      {inv.items.map((item: any) => (
                                        <tr key={item.id} className="text-gray-800">
                                          <td className="py-1.5 px-3 font-medium">
                                            {item.product?.name || item.productName || "পণ্য"}
                                          </td>
                                          <td className="py-1.5 px-3 text-right font-bold">
                                            {item.quantity}
                                          </td>
                                          <td className="py-1.5 px-3 text-right">
                                            ৳ {item.pricePerUnit?.toLocaleString()}
                                          </td>
                                          <td className="py-1.5 px-3 text-right font-bold">
                                            ৳ {item.total?.toLocaleString()}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}

                              {/* Financial totals */}
                              <div className="flex flex-wrap items-center justify-end gap-4 text-xs font-bold pt-2 border-t border-gray-100">
                                <span className="text-gray-600">
                                  মোট বিল: ৳ {inv.totalAmount.toLocaleString()}
                                </span>
                                <span className="text-emerald-600">
                                  জমা: ৳ {inv.paidAmount.toLocaleString()}
                                </span>
                                <span className="text-red-600">
                                  বকেয়া: ৳ {due.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: TRANSACTIONS (CASH IN / OUT LEDGER) */}
                {profileActiveTab === "transactions" && (
                  <div className="space-y-4">
                    {profileTransactions.length === 0 ? (
                      <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-gray-300">
                        <Receipt className="mx-auto text-gray-400 mb-2" size={36} />
                        <p className="font-bold text-gray-700 text-sm">কোনো ক্যাশ লেনদেনের এন্ট্রি পাওয়া যায়নি</p>
                        <p className="text-xs text-gray-400 mt-1">
                          বকেয়া আদায় বা ক্যাশ লেনদেন সম্পন্ন হলে এখানে স্বয়ংক্রিয়ভাবে বিস্তারিত খতিয়ান দেখা যাবে।
                        </p>
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs">
                        <table className="w-full text-left text-xs text-gray-600">
                          <thead className="bg-gray-50 border-b border-gray-100 font-bold text-gray-700">
                            <tr>
                              <th className="p-3">তারিখ ও সময়</th>
                              <th className="p-3">বিবরণ (Description)</th>
                              <th className="p-3">ধরন (Type)</th>
                              <th className="p-3 text-right">টাকার পরিমাণ (Amount)</th>
                              <th className="p-3 text-center">স্ট্যাটাস</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {profileTransactions.map((t: any) => (
                              <tr key={t.id} className="hover:bg-gray-50">
                                <td className="p-3 font-medium text-gray-700">
                                  {new Date(t.date).toLocaleDateString()}{" "}
                                  <span className="text-[10px] text-gray-400 block">
                                    {new Date(t.date).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </td>
                                <td className="p-3 font-bold text-gray-900">
                                  {t.description}
                                </td>
                                <td className="p-3">
                                  {t.type === "in" ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      + নগদ জমা (Cash In)
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                      - নগদ প্রদান (Cash Out)
                                    </span>
                                  )}
                                </td>
                                <td className="p-3 text-right font-bold text-sm">
                                  <span className={t.type === "in" ? "text-emerald-600" : "text-blue-600"}>
                                    {t.type === "in" ? "+" : "-"} ৳ {t.amount.toLocaleString()}
                                  </span>
                                </td>
                                <td className="p-3 text-center">
                                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px] font-bold">
                                    {t.status || "APPROVED"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: COMPANY INFO & ACTIONS */}
                {profileActiveTab === "info" && (
                  <div className="space-y-4">
                    {/* Contact Information */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 shadow-2xs">
                      <h4 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">
                        প্রতিষ্ঠানের সাধারণ তথ্য (General Details)
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <span className="text-gray-400 block mb-1">প্রতিষ্ঠানের নাম</span>
                          <span className="font-bold text-gray-900 text-sm">
                            {selectedClientForProfile.name}
                          </span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <span className="text-gray-400 block mb-1">মোবাইল নম্বর</span>
                          <span className="font-bold text-gray-900 text-sm">
                            {selectedClientForProfile.phone}
                          </span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl sm:col-span-2">
                          <span className="text-gray-400 block mb-1">ঠিকানা</span>
                          <span className="font-bold text-gray-900">
                            {selectedClientForProfile.address || "ঠিকানা দেওয়া নেই"}
                          </span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <span className="text-gray-400 block mb-1">যুক্ত হওয়ার তারিখ</span>
                          <span className="font-bold text-gray-900">
                            {new Date(selectedClientForProfile.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <span className="text-gray-400 block mb-1">হিসাবের ধরন</span>
                          <span className="font-bold text-indigo-700">
                            প্রতিষ্ঠান (Company / Supplier / Customer)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Direct Contact Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <a
                        href={`tel:${selectedClientForProfile.phone}`}
                        className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold text-center transition-colors flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Phone size={15} />
                        <span>সরাসরি কল দিন ({selectedClientForProfile.phone})</span>
                      </a>
                      <a
                        href={`https://wa.me/88${selectedClientForProfile.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold text-center transition-colors flex items-center justify-center gap-2 shadow-sm"
                      >
                        <MessageSquare size={15} />
                        <span>WhatsApp-এ যোগাযোগ করুন</span>
                      </a>
                    </div>

                    {/* Login Portal Access Card */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <h4 className="font-bold text-sm text-gray-900">
                          অনলাইন পোর্টাল লগইন অ্যাক্সেস
                        </h4>
                        {selectedClientForProfile.user ? (
                          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                            ✓ সক্রিয়
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs font-bold">
                            তৈরি করা হয়নি
                          </span>
                        )}
                      </div>

                      {selectedClientForProfile.user ? (
                        <div className="space-y-3 text-xs">
                          <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1">
                            <p className="text-emerald-900 font-medium">
                              প্রতিষ্ঠান তার ইউজারনেম দিয়ে বাংলা ইআরপিতে লগইন করতে পারবেন।
                            </p>
                            <p className="font-mono font-bold text-gray-800">
                              ইউজারনেম (User ID):{" "}
                              <span className="text-indigo-700">
                                {selectedClientForProfile.user.username}
                              </span>
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const c = selectedClientForProfile;
                                setSelectedClientForProfile(null);
                                openLoginModal(c);
                              }}
                              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <KeyRound size={14} />
                              <span>পাসওয়ার্ড পরিবর্তন</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const c = selectedClientForProfile;
                                setSelectedClientForProfile(null);
                                setRevokeError("");
                                setClientToRevoke(c);
                              }}
                              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <UserX size={14} />
                              <span>লগইন অ্যাক্সেস বাতিল (Revoke)</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-xs text-gray-500">
                            এই কোম্পানিকে তাদের চালান ও হিসাব নিজে দেখার জন্য পোর্টাল লগইন দিতে নিচের বাটনে ক্লিক করুন।
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              const c = selectedClientForProfile;
                              setSelectedClientForProfile(null);
                              openLoginModal(c);
                            }}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <ShieldCheck size={14} />
                            <span>লগইন অ্যাক্সেস তৈরি করুন</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Actions Section */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 shadow-2xs">
                      <h4 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2">
                        কোম্পানি অ্যাকশন (Actions)
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            const c = selectedClientForProfile;
                            setSelectedClientForProfile(null);
                            openEditModal(c);
                          }}
                          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Pencil size={14} />
                          <span>কোম্পানি এডিট করুন</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteError("");
                            setSelectedClientForDelete(selectedClientForProfile);
                          }}
                          className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 size={14} />
                          <span>কোম্পানি মুছে ফেলুন</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-3 sm:p-4 bg-gray-100 border-t border-gray-200 flex justify-between items-center shrink-0">
                <span className="text-xs text-gray-500 font-medium hidden sm:inline">
                  বাংলা ইআরপি • কোম্পানি পূর্ণাঙ্গ খতিয়ান ও বিস্তারিত ভিউ
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedClientForProfile(null)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer ml-auto"
                >
                  বন্ধ করুন (Close)
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* DELETE CONFIRMATION MODAL */}
      {selectedClientForDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-red-600 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <AlertTriangle size={20} className="text-red-200" />
                <h3 className="font-bold text-base">প্রতিষ্ঠান মুছে ফেলার নিশ্চিতকরণ</h3>
              </div>
              <button
                onClick={() => setSelectedClientForDelete(null)}
                disabled={isDeleting}
                className="text-red-200 hover:text-white p-1 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {deleteError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700">
                  {deleteError}
                </div>
              )}

              <div className="text-center py-2">
                <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <Trash2 size={28} />
                </div>
                <h4 className="font-extrabold text-lg text-gray-900">
                  {selectedClientForDelete.name}
                </h4>
                <p className="text-xs text-gray-500 mt-1 font-mono">
                  {selectedClientForDelete.phone}
                </p>
              </div>

              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1.5 font-medium">
                <p className="font-bold text-amber-950 flex items-center gap-1.5">
                  <AlertTriangle size={14} className="text-amber-600 shrink-0" />
                  <span>সতর্কবার্তা:</span>
                </p>
                <p>
                  আপনি কি নিশ্চিতভাবে এই প্রতিষ্ঠানটি মুছে ফেলতে চান?
                </p>
                {selectedClientForDelete.openingBalance !== 0 && (
                  <p className="text-red-700 font-bold">
                    বর্তমান বকেয়া: ৳{Math.abs(selectedClientForDelete.openingBalance).toLocaleString()}
                  </p>
                )}
                <p className="text-[11px] text-amber-700">
                  এটি মুছে ফেললে এই প্রতিষ্ঠানের সাথে যুক্ত সকল তথ্য, চালান ও লগইন অ্যাক্সেস স্থায়ীভাবে মুছে যাবে।
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setSelectedClientForDelete(null)}
                  className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  বাতিল (Cancel)
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDeleteCompany}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer"
                >
                  <Trash2 size={16} />
                  <span>{isDeleting ? "মুছে ফেলা হচ্ছে..." : "হ্যাঁ, মুছে ফেলুন"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT COMPANY MODAL */}
      {selectedClientForEdit && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Pencil size={18} className="text-indigo-400" />
                <h3 className="font-bold text-base">প্রতিষ্ঠানের তথ্য এডিট করুন (Edit Company)</h3>
              </div>
              <button
                onClick={() => setSelectedClientForEdit(null)}
                disabled={isSavingEdit}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              {editError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700">
                  {editError}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  প্রতিষ্ঠানের নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="যেমন: মেসার্স রহিম ট্রেডার্স"
                  className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm text-gray-900"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  মোবাইল নম্বর <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="যেমন: 01700000000"
                  className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm text-gray-900 font-mono"
                  required
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ঠিকানা
                </label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  placeholder="প্রতিষ্ঠানের সম্পূর্ণ ঠিকানা লিখুন..."
                  className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm text-gray-900"
                />
              </div>

              {/* Opening Balance / Balance Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    বকেয়া টাকার পরিমাণ
                  </label>
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    disabled={editBalanceType === "none"}
                    placeholder="৳ 0.00"
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    টাকার ধরন
                  </label>
                  <select
                    value={editBalanceType}
                    onChange={(e: any) => setEditBalanceType(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-xs text-gray-900 bg-white cursor-pointer"
                  >
                    <option value="none">কোনো বকেয়া নেই</option>
                    <option value="receivable">আমি টাকা পাবো (পাওনা)</option>
                    <option value="payable">আমাকে দিতে হবে (দেনা)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-gray-100">
                <button
                  type="button"
                  disabled={isSavingEdit}
                  onClick={() => setSelectedClientForEdit(null)}
                  className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  বাতিল (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer"
                >
                  <Save size={16} />
                  <span>{isSavingEdit ? "সংরক্ষণ হচ্ছে..." : "আপডেট সংরক্ষণ করুন"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVOKE ACCESS CONFIRMATION MODAL */}
      {clientToRevoke && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-amber-600 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <UserX size={20} className="text-amber-200" />
                <h3 className="font-bold text-base">লগইন অ্যাক্সেস বাতিল (Revoke)</h3>
              </div>
              <button
                onClick={() => setClientToRevoke(null)}
                disabled={isRevoking}
                className="text-amber-200 hover:text-white p-1 rounded-lg hover:bg-amber-700 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {revokeError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700">
                  {revokeError}
                </div>
              )}

              <div className="text-center py-2">
                <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <UserX size={28} />
                </div>
                <h4 className="font-extrabold text-lg text-gray-900">
                  {clientToRevoke.name}
                </h4>
                <p className="text-xs text-gray-500 mt-1 font-mono">
                  ইউজারনেম: <span className="font-bold text-indigo-700">{clientToRevoke.user?.username || clientToRevoke.phone}</span>
                </p>
              </div>

              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1.5 font-medium">
                <p className="font-bold text-amber-950 flex items-center gap-1.5">
                  <AlertTriangle size={14} className="text-amber-600 shrink-0" />
                  <span>সতর্কবার্তা:</span>
                </p>
                <p>
                  আপনি কি নিশ্চিতভাবে এই প্রতিষ্ঠানের পোর্টাল লগইন অ্যাক্সেস বাতিল করতে চান?
                </p>
                <p className="text-[11px] text-amber-700">
                  লগইন বাতিল করলে এই প্রতিষ্ঠান আর সিস্টেমে লগইন করতে পারবে না। প্রতিষ্ঠানের আগের সমস্ত লেনদেন ও চালান অপরিবর্তিত থাকবে। প্রয়োজনে পরবর্তীতে যেকোনো সময় পুনরায় নতুন লগইন দেওয়া যাবে।
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  disabled={isRevoking}
                  onClick={() => setClientToRevoke(null)}
                  className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  না, রাখুন (Cancel)
                </button>
                <button
                  type="button"
                  disabled={isRevoking}
                  onClick={handleRevokeLogin}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-95 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer"
                >
                  <UserX size={16} />
                  <span>{isRevoking ? "বাতিল করা হচ্ছে..." : "হ্যাঁ, অ্যাক্সেস বাতিল করুন"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable Invoice Slip Modal */}
      <PrintableInvoiceModal
        isOpen={Boolean(selectedInvoiceForPrint)}
        invoice={selectedInvoiceForPrint}
        onClose={() => setSelectedInvoiceForPrint(null)}
      />
    </div>
  );
}
