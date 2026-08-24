"use client";

import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, X } from "lucide-react";
import { addTransaction } from "@/actions/transactionActions";

export default function CashActionButtons() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<"in" | "out">("in");
  
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const openModal = (t: "in" | "out") => {
    setType(t);
    setAmount("");
    setDescription("");
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    setLoading(true);
    const res = await addTransaction({
      type,
      amount: Number(amount),
      description,
    });
    setLoading(false);

    if (res.success) {
      setIsOpen(false);
    } else {
      alert(res.error);
    }
  };

  return (
    <>
      <div className="flex space-x-3">
        <button
          onClick={() => openModal("in")}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm"
        >
          <ArrowDownRight size={18} />
          <span>Add Cash <span className="text-[10px] font-normal uppercase">(ক্যাশ ইন)</span></span>
        </button>
        <button
          onClick={() => openModal("out")}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm"
        >
          <ArrowUpRight size={18} />
          <span>Remove Cash <span className="text-[10px] font-normal uppercase">(ক্যাশ আউট)</span></span>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className={`p-4 text-white flex justify-between items-center ${type === "in" ? "bg-green-600" : "bg-red-600"}`}>
              <h3 className="font-bold text-lg">
                {type === "in" ? "Add Cash (ক্যাশ ইন)" : "Remove Cash (ক্যাশ আউট)"}
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (পরিমাণ)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500 font-bold">৳</span>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-800"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (বিবরণ)
                </label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-800"
                  placeholder="e.g. Sales Collection, Electricity Bill..."
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2.5 rounded-lg text-white font-bold transition-colors shadow-sm ${
                    type === "in" 
                      ? "bg-green-600 hover:bg-green-700" 
                      : "bg-red-600 hover:bg-red-700"
                  } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {loading ? "Processing..." : type === "in" ? "Add Cash" : "Remove Cash"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
