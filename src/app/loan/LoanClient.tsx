"use client";

import { useState } from "react";
import { Landmark, Plus, Search, ArrowDownToLine, ArrowUpFromLine, User, X, Save, RefreshCw } from "lucide-react";
import { createLoan, recordLoanRepayment } from "@/actions/loanActions";

interface ProfileItem {
  name: string;
  personType: string;
  phone: string;
  netBalance: number;
  lastDate: Date | string;
}

interface ClientOption {
  id: string;
  name: string;
  phone: string;
  type: string;
}

interface EmployeeOption {
  id: string;
  name: string;
  phone: string;
}

export default function LoanClient({
  initialProfiles,
  totalGiven,
  totalTaken,
  clients,
  employees,
}: {
  initialProfiles: ProfileItem[];
  totalGiven: number;
  totalTaken: number;
  clients: ClientOption[];
  employees: EmployeeOption[];
}) {
  const [isGiveLoanModalOpen, setIsGiveLoanModalOpen] = useState(false);
  const [isReceiveLoanModalOpen, setIsReceiveLoanModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(false);

  // Give Loan Form State
  const [giveType, setGiveType] = useState<"GIVE" | "TAKE">("GIVE");
  const [givePersonType, setGivePersonType] = useState<"CLIENT" | "EMPLOYEE" | "OTHER">("CLIENT");
  const [selectedPersonId, setSelectedPersonId] = useState("");
  const [customName, setCustomName] = useState("");
  const [customPhone, setCustomPhone] = useState("");
  const [giveAmount, setGiveAmount] = useState("");
  const [giveDate, setGiveDate] = useState(new Date().toISOString().split("T")[0]);
  const [giveNotes, setGiveNotes] = useState("");
  const [giveMethod, setGiveMethod] = useState("cash");

  // Receive Loan Form State
  const [receiveDirection, setReceiveDirection] = useState<"RECEIVE_BACK" | "PAY_BACK">("RECEIVE_BACK");
  const [receivePersonType, setReceivePersonType] = useState<"CLIENT" | "EMPLOYEE" | "OTHER">("CLIENT");
  const [receivePersonId, setReceivePersonId] = useState("");
  const [receiveCustomName, setReceiveCustomName] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [receiveDate, setReceiveDate] = useState(new Date().toISOString().split("T")[0]);
  const [receiveMethod, setReceiveMethod] = useState("cash");
  const [receiveNotes, setReceiveNotes] = useState("");

  const handleGiveLoanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!giveAmount || Number(giveAmount) <= 0) {
      alert("সঠিক টাকার পরিমাণ দিন!");
      return;
    }

    let personName = customName;
    let phone = customPhone;
    let clientId = undefined;
    let employeeId = undefined;

    if (givePersonType === "CLIENT") {
      const found = clients.find((c) => c.id === selectedPersonId);
      if (!found && !customName) {
        alert("অনুগ্রহ করে ক্লায়েন্ট বা মহাজন নির্বাচন করুন!");
        return;
      }
      if (found) {
        personName = found.name;
        phone = found.phone;
        clientId = found.id;
      }
    } else if (givePersonType === "EMPLOYEE") {
      const found = employees.find((em) => em.id === selectedPersonId);
      if (!found && !customName) {
        alert("অনুগ্রহ করে কর্মচারী নির্বাচন করুন!");
        return;
      }
      if (found) {
        personName = found.name;
        phone = found.phone;
        employeeId = found.id;
      }
    }

    if (!personName) {
      alert("নাম প্রদান করুন!");
      return;
    }

    setLoading(true);
    const res = await createLoan({
      type: giveType,
      personType: givePersonType,
      personName,
      phone,
      amount: Number(giveAmount),
      notes: giveNotes,
      paymentMethod: giveMethod,
      date: giveDate,
      clientId,
      employeeId,
      requestedBy: "owner",
    });
    setLoading(false);

    if (res.success) {
      alert("লেনদেন সফলভাবে সংরক্ষিত হয়েছে!");
      setIsGiveLoanModalOpen(false);
      setGiveAmount("");
      setGiveNotes("");
      setCustomName("");
      setCustomPhone("");
    } else {
      alert(res.error || "ব্যর্থ হয়েছে");
    }
  };

  const handleReceivePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiveAmount || Number(receiveAmount) <= 0) {
      alert("সঠিক টাকার পরিমাণ দিন!");
      return;
    }

    let personName = receiveCustomName;
    let phone = "";
    let clientId = undefined;
    let employeeId = undefined;

    if (receivePersonType === "CLIENT") {
      const found = clients.find((c) => c.id === receivePersonId);
      if (found) {
        personName = found.name;
        phone = found.phone;
        clientId = found.id;
      }
    } else if (receivePersonType === "EMPLOYEE") {
      const found = employees.find((em) => em.id === receivePersonId);
      if (found) {
        personName = found.name;
        phone = found.phone;
        employeeId = found.id;
      }
    }

    if (!personName) {
      alert("নাম প্রদান করুন!");
      return;
    }

    setLoading(true);
    const res = await recordLoanRepayment({
      direction: receiveDirection,
      personType: receivePersonType,
      personName,
      phone,
      amount: Number(receiveAmount),
      notes: receiveNotes,
      paymentMethod: receiveMethod,
      date: receiveDate,
      clientId,
      employeeId,
      requestedBy: "owner",
    });
    setLoading(false);

    if (res.success) {
      alert("ধারের টাকা ফেরত গ্রহণ সফলভাবে সংরক্ষিত হয়েছে!");
      setIsReceiveLoanModalOpen(false);
      setReceiveAmount("");
      setReceiveNotes("");
      setReceiveCustomName("");
    } else {
      alert(res.error || "ব্যর্থ হয়েছে");
    }
  };

  const filteredProfiles = initialProfiles.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm);

    const matchesFilter =
      filterType === "all" ||
      (filterType === "client" && p.personType === "CLIENT") ||
      (filterType === "employee" && p.personType === "EMPLOYEE") ||
      (filterType === "other" && p.personType === "OTHER");

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
            <Landmark size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Loans & Advances <span className="text-lg font-normal text-gray-500">(লোন ও ধার)</span>
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              ব্যবসায়িক গ্রাহক, কর্মচারী ও পরিচিতদের সাথে ধার ও ঋণ লেনদেনের পূর্ণ হিসাব
            </p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => {
              setGiveType("GIVE");
              setIsGiveLoanModalOpen(true);
            }}
            className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-lg font-bold transition-colors shadow-sm text-sm"
          >
            <ArrowUpFromLine size={18} />
            <span>Give Loan (ধার দিন)</span>
          </button>
          <button
            onClick={() => {
              setReceiveDirection("RECEIVE_BACK");
              setIsReceiveLoanModalOpen(true);
            }}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-bold transition-colors shadow-sm text-sm"
          >
            <ArrowDownToLine size={18} />
            <span>Receive Payment (ফেরত নিন)</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 shadow-md text-white">
          <p className="text-orange-100 font-medium mb-1">
            Total Loan Given (আমি মোট টাকা পাবো)
          </p>
          <h2 className="text-4xl font-bold">৳ {totalGiven.toLocaleString()}</h2>
          <p className="text-xs mt-2 text-orange-200">
            গ্রাহক, মহাজন বা কর্মচারীদের প্রদানকৃত মোট ধারের বাকি
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col justify-center">
          <p className="font-medium text-gray-500 mb-1">
            Total Loan Taken (আমাকে মোট দিতে হবে)
          </p>
          <h2 className="text-3xl font-bold text-red-600">
            ৳ {totalTaken.toLocaleString()}
          </h2>
          <p className="text-xs mt-2 text-gray-400">
            অন্যের কাছ থেকে ধার বা ঋণ নেওয়া মোট ব্যালেন্স
          </p>
        </div>
      </div>

      {/* Loan Profile Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/70">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="নাম বা ফোন দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm bg-white"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg outline-none text-sm bg-white font-medium text-gray-700"
          >
            <option value="all">সব প্রোফাইল (All Profiles)</option>
            <option value="client">গ্রাহক ও মহাজন (Clients)</option>
            <option value="employee">কর্মচারী (Employees)</option>
            <option value="other">অন্যান্য (Others)</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-bold text-gray-700">নাম (Name)</th>
                <th className="p-4 font-bold text-gray-700">প্রোফাইল টাইপ</th>
                <th className="p-4 font-bold text-gray-700">ফোন নম্বর</th>
                <th className="p-4 font-bold text-gray-700">সর্বশেষ তারিখ</th>
                <th className="p-4 font-bold text-right text-gray-700">
                  বর্তমান হিসাব (Balance)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProfiles.map((p, idx) => {
                const isReceivable = p.netBalance >= 0;
                return (
                  <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4 flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                        <User size={16} />
                      </div>
                      <span className="font-bold text-gray-900">{p.name}</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded text-xs font-bold ${
                          p.personType === "CLIENT"
                            ? "bg-blue-100 text-blue-700"
                            : p.personType === "EMPLOYEE"
                            ? "bg-pink-100 text-pink-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {p.personType}
                      </span>
                    </td>
                    <td className="p-4 font-medium">{p.phone}</td>
                    <td className="p-4 text-gray-500">
                      {new Date(p.lastDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4 text-right">
                      {isReceivable ? (
                        <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">
                          আমি পাবো: ৳ {p.netBalance.toLocaleString()}
                        </span>
                      ) : (
                        <span className="font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded">
                          দিতে হবে: ৳ {Math.abs(p.netBalance).toLocaleString()}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredProfiles.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-400">
                    <Landmark size={36} className="mx-auto mb-2 text-gray-300" />
                    <p className="font-semibold text-gray-600">কোনো লোন বা ধারের রেকর্ড পাওয়া যায়নি</p>
                    <p className="text-xs text-gray-400 mt-1">
                      উপরের বাটনে ক্লিক করে নতুন লোন যোগ করুন।
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Give / Take Loan */}
      {isGiveLoanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-gray-900/40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">
                {giveType === "GIVE" ? "Give Loan / Advance (ধার দিন)" : "Take Loan (ধার নিন)"}
              </h2>
              <button
                onClick={() => setIsGiveLoanModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleGiveLoanSubmit}>
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setGiveType("GIVE")}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold border ${
                      giveType === "GIVE"
                        ? "bg-orange-600 text-white border-orange-600"
                        : "bg-gray-50 text-gray-700 border-gray-300"
                    }`}
                  >
                    ধার দিচ্ছি (Give Loan)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGiveType("TAKE")}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold border ${
                      giveType === "TAKE"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-50 text-gray-700 border-gray-300"
                    }`}
                  >
                    ধার নিচ্ছি (Take Loan)
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    কার সাথে লেনদেন? (Person Type)
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(["CLIENT", "EMPLOYEE", "OTHER"] as const).map((pt) => (
                      <button
                        key={pt}
                        type="button"
                        onClick={() => {
                          setGivePersonType(pt);
                          setSelectedPersonId("");
                        }}
                        className={`py-2 rounded-lg font-bold border text-center ${
                          givePersonType === pt
                            ? "bg-slate-800 text-white border-slate-800"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pt === "CLIENT" ? "গ্রাহক/মহাজন" : pt === "EMPLOYEE" ? "কর্মচারী" : "অন্যান্য"}
                      </button>
                    ))}
                  </div>
                </div>

                {givePersonType === "CLIENT" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ক্লায়েন্ট / মহাজন নির্বাচন করুন
                    </label>
                    <select
                      value={selectedPersonId}
                      onChange={(e) => setSelectedPersonId(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg outline-none text-sm bg-white"
                      required
                    >
                      <option value="">নির্বাচন করুন...</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.type}) - {c.phone}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {givePersonType === "EMPLOYEE" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      কর্মচারী নির্বাচন করুন
                    </label>
                    <select
                      value={selectedPersonId}
                      onChange={(e) => setSelectedPersonId(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg outline-none text-sm bg-white"
                      required
                    >
                      <option value="">নির্বাচন করুন...</option>
                      {employees.map((em) => (
                        <option key={em.id} value={em.id}>
                          {em.name} - {em.phone}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {givePersonType === "OTHER" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ব্যক্তির নাম <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Rahim Khan"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-lg outline-none text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ফোন নম্বর
                      </label>
                      <input
                        type="text"
                        placeholder="017XXXXXXXX"
                        value={customPhone}
                        onChange={(e) => setCustomPhone(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-lg outline-none text-sm"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    টাকার পরিমাণ (Amount ৳) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="৳ 0.00"
                    value={giveAmount}
                    onChange={(e) => setGiveAmount(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none font-bold text-gray-900 text-lg"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">তারিখ</label>
                    <input
                      type="date"
                      value={giveDate}
                      onChange={(e) => setGiveDate(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">পেমেন্ট মাধ্যম</label>
                    <select
                      value={giveMethod}
                      onChange={(e) => setGiveMethod(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg outline-none text-sm bg-white"
                    >
                      <option value="cash">Main Cash (ক্যাশবক্স)</option>
                      <option value="bank">Bank / Mobile Banking</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">বিবরণ (Notes)</label>
                  <textarea
                    rows={2}
                    placeholder="লোন দেওয়ার কারণ বা বিবরণ..."
                    value={giveNotes}
                    onChange={(e) => setGiveNotes(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg outline-none text-sm"
                  ></textarea>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsGiveLoanModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-white text-sm"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg font-bold text-sm shadow-sm"
                >
                  <Save size={16} />
                  <span>{loading ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Receive Loan Payment */}
      {isReceiveLoanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-gray-900/40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">
                Receive Payment (ধারের টাকা ফেরত গ্রহণ)
              </h2>
              <button
                onClick={() => setIsReceiveLoanModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleReceivePaymentSubmit}>
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    কার থেকে ফেরত পাচ্ছেন? (Profile Type)
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(["CLIENT", "EMPLOYEE", "OTHER"] as const).map((pt) => (
                      <button
                        key={pt}
                        type="button"
                        onClick={() => {
                          setReceivePersonType(pt);
                          setReceivePersonId("");
                        }}
                        className={`py-2 rounded-lg font-bold border text-center ${
                          receivePersonType === pt
                            ? "bg-slate-800 text-white border-slate-800"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pt === "CLIENT" ? "গ্রাহক/মহাজন" : pt === "EMPLOYEE" ? "কর্মচারী" : "অন্যান্য"}
                      </button>
                    ))}
                  </div>
                </div>

                {receivePersonType === "CLIENT" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      গ্রাহক / মহাজন নির্বাচন করুন
                    </label>
                    <select
                      value={receivePersonId}
                      onChange={(e) => setReceivePersonId(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg outline-none text-sm bg-white"
                      required
                    >
                      <option value="">নির্বাচন করুন...</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.type}) - {c.phone}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {receivePersonType === "EMPLOYEE" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      কর্মচারী নির্বাচন করুন
                    </label>
                    <select
                      value={receivePersonId}
                      onChange={(e) => setReceivePersonId(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg outline-none text-sm bg-white"
                      required
                    >
                      <option value="">নির্বাচন করুন...</option>
                      {employees.map((em) => (
                        <option key={em.id} value={em.id}>
                          {em.name} - {em.phone}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {receivePersonType === "OTHER" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ব্যক্তির নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahim Khan"
                      value={receiveCustomName}
                      onChange={(e) => setReceiveCustomName(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg outline-none text-sm"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    ফেরত পাওয়া টাকার পরিমাণ (৳) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="৳ 0.00"
                    value={receiveAmount}
                    onChange={(e) => setReceiveAmount(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-gray-900 text-lg"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">তারিখ</label>
                    <input
                      type="date"
                      value={receiveDate}
                      onChange={(e) => setReceiveDate(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">কোথায় জমা হলো</label>
                    <select
                      value={receiveMethod}
                      onChange={(e) => setReceiveMethod(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg outline-none text-sm bg-white"
                    >
                      <option value="cash">Main Cash (ক্যাশবক্স)</option>
                      <option value="bank">Bank / Mobile Banking</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">বিবরণ (Notes)</label>
                  <textarea
                    rows={2}
                    placeholder="বিবরণ..."
                    value={receiveNotes}
                    onChange={(e) => setReceiveNotes(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg outline-none text-sm"
                  ></textarea>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsReceiveLoanModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-white text-sm"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-bold text-sm shadow-sm"
                >
                  <Save size={16} />
                  <span>{loading ? "সংরক্ষণ হচ্ছে..." : "জমা সংরক্ষণ"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
