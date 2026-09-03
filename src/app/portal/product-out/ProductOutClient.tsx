"use client";

import { useState } from "react";
import { PackageMinus, Send, CheckCircle2, Calendar, DollarSign, Layers } from "lucide-react";
import { submitClientProductOutRequest } from "@/actions/clientActions";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  clientId: string;
  clientName: string;
  clientPhone: string;
  availableProducts: string[];
}

export default function ProductOutClient({
  clientId,
  clientName,
  clientPhone,
  availableProducts,
}: Props) {
  const router = useRouter();

  const [selectedProduct, setSelectedProduct] = useState(
    availableProducts[0] || "Radhuni Masala 500g"
  );
  const [customProduct, setCustomProduct] = useState("");
  const [quantity, setQuantity] = useState<number | "">(50);
  const [unit, setUnit] = useState("পিস (Pieces)");
  const [pricePerUnit, setPricePerUnit] = useState<number | "">(100);
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const productName =
    selectedProduct === "অন্যান্য (Other)" ? customProduct : selectedProduct;

  const totalAmount =
    typeof quantity === "number" && typeof pricePerUnit === "number"
      ? quantity * pricePerUnit
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!productName.trim()) {
      setErrorMsg("অনুগ্রহ করে পণ্যের নাম নির্বাচন বা লিখুন");
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      setErrorMsg("সঠিক পরিমাণ দিন");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitClientProductOutRequest({
        clientId,
        productName: productName.trim(),
        quantity: Number(quantity),
        unit,
        pricePerUnit: Number(pricePerUnit) || 0,
        totalAmount,
        dueDate: dueDate || undefined,
        notes: notes.trim() || undefined,
      });

      if (res.success) {
        setSuccess(true);
      } else {
        setErrorMsg(res.error || "রিকোয়েস্ট পাঠাতে ব্যর্থ হয়েছে");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "একটি সমস্যা হয়েছে");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pt-4 pb-12">
      <div className="bg-white rounded-2xl shadow-md border border-blue-100 overflow-hidden">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-6 sm:p-8 text-white text-center shadow-inner">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-md shadow-md">
            <PackageMinus size={34} className="text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            পণ্য আউট ফর্ম <span className="text-lg sm:text-xl font-normal opacity-90">(Product Out Form)</span>
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-1.5 max-w-xl mx-auto">
            কোম্পানির কাছে আপনার পাঠানো পণ্যের বিবরণ ও চালানের রিকোয়েস্ট জমা দিন।
          </p>
        </div>

        <div className="p-6 sm:p-8">
          {success ? (
            /* Success confirmation screen */
            <div className="p-8 text-center space-y-5 bg-emerald-50 rounded-2xl border border-emerald-200">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 size={36} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-emerald-900">
                  পণ্য পাঠানোর রিকোয়েস্ট সফলভাবে গৃহীত হয়েছে!
                </h3>
                <p className="text-xs sm:text-sm text-emerald-700 mt-1">
                  আপনার পাঠানো চালানটি কোম্পানির মালিক/ম্যানেজারের অনুমোদনের বোর্ডে পাঠানো হয়েছে।
                </p>
              </div>

              <div className="max-w-md mx-auto p-4 bg-white rounded-xl border border-emerald-200 text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-gray-100 pb-1.5">
                  <span className="text-gray-500 font-medium">প্রতিষ্ঠান:</span>
                  <span className="font-bold text-gray-900">{clientName}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1.5">
                  <span className="text-gray-500 font-medium">পণ্য:</span>
                  <span className="font-bold text-gray-900">{productName}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1.5">
                  <span className="text-gray-500 font-medium">পরিমাণ:</span>
                  <span className="font-bold text-indigo-700">{quantity} {unit}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1.5">
                  <span className="text-gray-500 font-medium">মোট প্রস্তাবিত মূল্য:</span>
                  <span className="font-bold text-emerald-700">৳ {totalAmount.toLocaleString()}</span>
                </div>
                {dueDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">টাকা পরিশোধের সম্ভাব্য তারিখ:</span>
                    <span className="font-bold text-purple-700">{dueDate}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSuccess(false);
                    setCustomProduct("");
                    setNotes("");
                  }}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  আরেকটি পণ্য পাঠান
                </button>
                <Link
                  href="/portal/dashboard"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm text-center"
                >
                  ড্যাশবোর্ডে দেখুন
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Logged in Mahajon Identification Card */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                    লগইন করা আছেন <span className="font-normal">(Logged In As)</span>:
                  </p>
                  <p className="font-extrabold text-base text-gray-900 mt-0.5">
                    {clientName}{" "}
                    <span className="text-xs font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded ml-1">
                      প্রতিষ্ঠান
                    </span>
                  </p>
                </div>
                {clientPhone && (
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-gray-500 block font-medium">মোবাইল নম্বর</span>
                    <span className="font-mono font-bold text-sm text-gray-800">{clientPhone}</span>
                  </div>
                )}
              </div>

              {errorMsg && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Select Product */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">
                    কোন পণ্য পাঠাচ্ছেন? <span className="text-gray-400 font-normal">(Select Product)</span>{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm text-gray-950 bg-white shadow-2xs cursor-pointer"
                  >
                    {availableProducts.map((p) => (
                      <option key={p} value={p} className="text-gray-950 font-bold bg-white py-1">
                        {p}
                      </option>
                    ))}
                    <option value="অন্যান্য (Other)" className="text-gray-950 font-bold bg-white py-1">
                      + অন্যান্য (নতুন পণ্য লিখুন)
                    </option>
                  </select>
                </div>

                {/* Custom Product Name if Other */}
                {selectedProduct === "অন্যান্য (Other)" && (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-800 mb-1.5">
                      পণ্যের নাম লিখুন <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. চিনি ৫০ কেজি বস্তা"
                      value={customProduct}
                      onChange={(e) => setCustomProduct(e.target.value)}
                      required
                      className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm text-gray-950 bg-white shadow-2xs placeholder:text-gray-400"
                    />
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">
                    পরিমাণ <span className="text-gray-400 font-normal">(Quantity)</span>{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="যেমন: 50"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                    required
                    className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm text-gray-950 bg-white shadow-2xs placeholder:text-gray-400"
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">
                    একক <span className="text-gray-400 font-normal">(Unit Type)</span>
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm text-gray-950 bg-white shadow-2xs cursor-pointer"
                  >
                    <option value="পিস (Pieces)" className="text-gray-950 font-bold bg-white">পিস (Pieces)</option>
                    <option value="বস্তা (Bags)" className="text-gray-950 font-bold bg-white">বস্তা (Bags)</option>
                    <option value="বক্স (Boxes)" className="text-gray-950 font-bold bg-white">বক্স (Boxes)</option>
                    <option value="কেজি (Kg)" className="text-gray-950 font-bold bg-white">কেজি (Kg)</option>
                    <option value="লিটার (Litre)" className="text-gray-950 font-bold bg-white">লিটার (Litre)</option>
                    <option value="ডজন (Dozen)" className="text-gray-950 font-bold bg-white">ডজন (Dozen)</option>
                  </select>
                </div>

                {/* Price Per Unit */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">
                    প্রতি ইউনিটের প্রস্তাবিত দর (৳){" "}
                    <span className="text-gray-400 font-normal">(Rate per unit)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="যেমন: 100"
                    value={pricePerUnit}
                    onChange={(e) => setPricePerUnit(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm text-gray-950 bg-white shadow-2xs placeholder:text-gray-400"
                  />
                </div>

                {/* Total Calculated Price */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">
                    মোট প্রস্তাবিত মূল্য <span className="text-gray-400 font-normal">(Total Amount)</span>
                  </label>
                  <div className="w-full p-3 border border-blue-200 bg-blue-50/60 rounded-xl font-extrabold text-base text-blue-900 flex items-center justify-between">
                    <span>৳ {totalAmount.toLocaleString()}</span>
                    <span className="text-[11px] text-blue-600 font-medium">স্বয়ংক্রিয় হিসাব</span>
                  </div>
                </div>

                {/* Promised Payment Date */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">
                    টাকা পাওয়ার সম্ভাব্য তারিখ{" "}
                    <span className="text-gray-400 font-normal">(Expected Payment Date)</span>
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm text-gray-950 bg-white shadow-2xs cursor-pointer"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    বকেয়া টাকা কবে নাগাদ পাওয়ার কথা সেটির সম্ভাব্য তারিখ নির্ধারণ করতে পারেন।
                  </p>
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">
                    নোট বা বিশেষ বার্তা <span className="text-gray-400 font-normal">(Notes)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="ওনারের জন্য কোনো বিশেষ বার্তা বা গাড়ির বিবরণ..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm text-gray-950 bg-white shadow-2xs placeholder:text-gray-400"
                  ></textarea>
                </div>
              </div>

              {/* Submit Request Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center space-x-2 bg-blue-600 hover:bg-blue-700 active:scale-98 disabled:opacity-50 text-white p-4 rounded-xl font-extrabold text-base transition-all shadow-lg hover:shadow-blue-500/25 cursor-pointer"
              >
                <Send size={18} />
                <span>{isSubmitting ? "রিকোয়েস্ট পাঠানো হচ্ছে..." : "অনুরোধ পাঠান (Send Request)"}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
