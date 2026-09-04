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
  Save
} from "lucide-react";
import { createClientLogin, deleteClient, updateClient } from "@/actions/clientActions";
import { useRouter } from "next/navigation";

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
              <th className="p-4 font-bold text-gray-700">নাম <span className="text-[10px] font-normal text-gray-400 block uppercase">(Name)</span></th>
              <th className="p-4 font-bold text-gray-700">মোবাইল <span className="text-[10px] font-normal text-gray-400 block uppercase">(Phone)</span></th>
              <th className="p-4 font-bold text-gray-700">ধরন <span className="text-[10px] font-normal text-gray-400 block uppercase">(Type)</span></th>
              <th className="p-4 font-bold text-gray-700">লগইন অ্যাক্সেস <span className="text-[10px] font-normal text-gray-400 block uppercase">(Login Access)</span></th>
              <th className="p-4 font-bold text-gray-700">বর্তমান বকেয়া <span className="text-[10px] font-normal text-gray-400 block uppercase">(Current Due)</span></th>
              <th className="p-4 font-bold text-gray-700 text-right">অ্যাকশন <span className="text-[10px] font-normal text-gray-400 block uppercase">(Action)</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                {/* Name and Address */}
                <td className="p-4">
                  <p className="font-bold text-gray-900">{client.name}</p>
                  <p className="text-xs text-gray-500 font-medium">{client.address || "ঠিকানা নেই"}</p>
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
                      <button
                        onClick={() => openLoginModal(client)}
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 hover:underline font-bold mt-0.5 block cursor-pointer"
                      >
                        পাসওয়ার্ড রিসেট / দেখুন
                      </button>
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
                  {client.openingBalance > 0 ? (
                    <span className="text-green-600">
                      ৳ {client.openingBalance.toLocaleString()}{" "}
                      <span className="text-[10px] text-gray-400 font-normal uppercase">(Receivable)</span>
                    </span>
                  ) : client.openingBalance < 0 ? (
                    <span className="text-red-600">
                      ৳ {Math.abs(client.openingBalance).toLocaleString()}{" "}
                      <span className="text-[10px] text-gray-400 font-normal uppercase">(Payable)</span>
                    </span>
                  ) : (
                    "৳ 0"
                  )}
                </td>

                {/* Action Column */}
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end space-x-1.5">
                    <button
                      onClick={() => setSelectedClientForProfile(client)}
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
                <td colSpan={6} className="p-8 text-center text-gray-400 font-medium">
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
                  <div className="pt-3 flex items-center justify-end space-x-3 border-t border-gray-100">
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
                      <span>{isSavingLogin ? "তৈরি হচ্ছে..." : "লগইন সক্রিয় করুন"}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW PROFILE MODAL */}
      {selectedClientForProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <UserCheck size={20} className="text-indigo-400" />
                <h3 className="font-bold text-base">প্রতিষ্ঠান প্রোফাইল বিবরণ</h3>
              </div>
              <button
                onClick={() => setSelectedClientForProfile(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Profile Content */}
            <div className="p-6 space-y-4">
              {/* Profile Card Header */}
              <div className="text-center pb-4 border-b border-gray-100">
                <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-2 shadow-2xs">
                  {selectedClientForProfile.name.charAt(0)}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{selectedClientForProfile.name}</h3>
                <span className="inline-block mt-1 px-2.5 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs font-bold">
                  প্রতিষ্ঠান (Company)
                </span>
              </div>

              {/* Information Grid */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-gray-500 flex items-center gap-1.5 font-medium">
                    <Phone size={14} className="text-gray-400" />
                    মোবাইল নম্বর:
                  </span>
                  <a
                    href={`tel:${selectedClientForProfile.phone}`}
                    className="font-bold text-gray-900 hover:text-indigo-600 hover:underline"
                  >
                    {selectedClientForProfile.phone}
                  </a>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-gray-500 flex items-center gap-1.5 font-medium">
                    <MapPin size={14} className="text-gray-400" />
                    ঠিকানা:
                  </span>
                  <span className="font-bold text-gray-900">
                    {selectedClientForProfile.address || "ঠিকানা দেওয়া নেই"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-gray-500 font-medium">বর্তমান বকেয়া:</span>
                  <span className="font-bold text-sm text-red-600">
                    ৳ {Math.abs(selectedClientForProfile.openingBalance || 0).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-gray-500 font-medium">লগইন অ্যাক্সেস:</span>
                  {selectedClientForProfile.user ? (
                    <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      সক্রিয় ({selectedClientForProfile.user.username})
                    </span>
                  ) : (
                    <span className="text-gray-400 font-medium">অ্যাক্সেস তৈরি করা হয়নি</span>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-3 flex gap-2">
                <a
                  href={`tel:${selectedClientForProfile.phone}`}
                  className="flex-1 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold text-center transition-colors flex items-center justify-center gap-1"
                >
                  <Phone size={14} />
                  <span>কল করুন</span>
                </a>
                <a
                  href={`https://wa.me/88${selectedClientForProfile.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold text-center transition-colors flex items-center justify-center gap-1"
                >
                  <MessageSquare size={14} />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Profile Modal Action Buttons */}
              <div className="pt-2 border-t border-gray-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const c = selectedClientForProfile;
                    setSelectedClientForProfile(null);
                    openEditModal(c);
                  }}
                  className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Pencil size={14} />
                  <span>তথ্য এডিট</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeleteError("");
                    setSelectedClientForDelete(selectedClientForProfile);
                  }}
                  className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>মুছে ফেলুন</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}
