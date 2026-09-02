"use client";

import { useState } from "react";
import { X, Send, FileEdit } from "lucide-react";
import { createCorrectionRequest } from "@/actions/correctionActions";

export default function CorrectionRequestModal({
  isOpen,
  onClose,
  targetType,
  targetId,
  requesterRole = "manager",
}: {
  isOpen: boolean;
  onClose: () => void;
  targetType: "INVOICE" | "TRANSACTION" | "EXPENSE" | "LOAN" | "STOCK";
  targetId: string;
  requesterRole?: string;
}) {
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) {
      alert("সংশোধনের বিবরণ লিখুন!");
      return;
    }

    setLoading(true);
    const res = await createCorrectionRequest({
      targetType,
      targetId,
      details,
      requesterId: requesterRole,
    });
    setLoading(false);

    if (res.success) {
      alert("সংশোধনের অনুরোধ মালিকের কাছে পাঠানো হয়েছে!");
      setDetails("");
      onClose();
    } else {
      alert(res.error || "ব্যর্থ হয়েছে");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-gray-900/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-amber-50">
          <div className="flex items-center space-x-2 text-amber-900 font-bold">
            <FileEdit size={18} className="text-amber-600" />
            <span>ভুল সংশোধন রিকোয়েস্ট</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-amber-100/50 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs space-y-1">
            <p className="text-gray-500">
              রেকর্ড টাইপ: <span className="font-bold text-gray-800">{targetType}</span>
            </p>
            <p className="text-gray-500">
              রেকর্ড আইডি: <span className="font-mono text-gray-700 font-bold">{targetId}</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              কী পরিবর্তন বা সংশোধন করতে চান? <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="উদাহরণ: ভুলবশত পণ্যের পরিমাণ ২০ এর জায়গায় ২৫ এন্ট্রি হয়েছিল, এটি সংশোধন করে ২০ করা হোক।"
              className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
              required
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-bold shadow-sm"
            >
              <Send size={16} />
              <span>{loading ? "পাঠানো হচ্ছে..." : "অনুরোধ পাঠান"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
