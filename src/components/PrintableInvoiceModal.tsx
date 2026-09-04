"use client";

import { useState, useEffect } from "react";
import { Printer, X } from "lucide-react";
import { getBusinessProfile } from "@/actions/profileActions";

interface InvoiceItem {
  product?: { name: string };
  productName?: string;
  quantity: number;
  pricePerUnit: number;
  total?: number;
}

interface InvoiceData {
  id: string;
  type: "product_in" | "product_out" | string;
  date: string | Date;
  totalAmount: number;
  paidAmount: number;
  paymentStatus?: string;
  status?: string;
  client?: {
    name: string;
    phone?: string;
    address?: string;
  };
  items: InvoiceItem[];
}

export default function PrintableInvoiceModal({
  isOpen,
  onClose,
  invoice,
}: {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceData | null;
}) {
  const [bizInfo, setBizInfo] = useState<{
    name: string;
    logo: string | null;
    phone: string | null;
    address: string | null;
  }>({
    name: "BOLAKA FACTORY",
    logo: null,
    phone: "+880 1711-000000",
    address: "ঢাকা, বাংলাদেশ",
  });

  useEffect(() => {
    if (!isOpen) return;
    try {
      const name = localStorage.getItem("erp_business_name");
      const logo = localStorage.getItem("erp_business_logo");
      const phone = localStorage.getItem("erp_business_phone");
      const address = localStorage.getItem("erp_business_address");

      if (name || logo) {
        setBizInfo({
          name: name || "BOLAKA FACTORY",
          logo: logo || null,
          phone: phone || "+880 1711-000000",
          address: address || "ঢাকা, বাংলাদেশ",
        });
      } else {
        getBusinessProfile().then((res) => {
          if (res.success && res.profile) {
            setBizInfo({
              name: res.profile.companyName || "BOLAKA FACTORY",
              logo: res.profile.logo || null,
              phone: res.profile.phone || "+880 1711-000000",
              address: res.profile.address || "ঢাকা, বাংলাদেশ",
            });
          }
        });
      }
    } catch (e) {}
  }, [isOpen]);

  if (!isOpen || !invoice) return null;

  const isSale = invoice.type === "product_out";
  const dueAmount = invoice.totalAmount - (invoice.paidAmount || 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
      {/* Container */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col my-8">
        {/* Modal Controls - Hidden when printing */}
        <div className="print:hidden p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Printer size={18} className="text-blue-400" />
            <span className="font-bold text-sm">ইনভয়েস ও চালান প্রিন্ট ভিউ</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors"
            >
              <Printer size={14} />
              <span>প্রিন্ট করুন (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div id="printable-voucher" className="p-8 sm:p-10 space-y-6 text-gray-900 bg-white">
          {/* Company Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {bizInfo.logo && (
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200 p-0.5 shrink-0">
                  <img src={bizInfo.logo} alt={bizInfo.name} className="w-full h-full object-contain" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-black tracking-wider text-slate-900">
                  {bizInfo.name}
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  উন্নত মানের পণ্য প্রস্তুত ও সরবরাহকারী
                </p>
                <p className="text-xs text-gray-500">
                  {bizInfo.phone ? `ফোন: ${bizInfo.phone}` : ""} {bizInfo.address ? `| ${bizInfo.address}` : ""}
                </p>
              </div>
            </div>
            <div className="sm:text-right">
              <span
                className={`inline-block px-3 py-1 text-xs font-bold uppercase rounded-md tracking-wider ${
                  isSale
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-blue-100 text-blue-800 border border-blue-300"
                }`}
              >
                {isSale ? "বিক্রয় চালান / ক্যাশ মেমো" : "ক্রয় ভাউচার (Product In)"}
              </span>
              <p className="text-xs font-mono font-bold text-gray-700 mt-1">
                ইনভয়েস নং: #INV-{invoice.id.slice(0, 8).toUpperCase()}
              </p>
              <p className="text-xs text-gray-500">
                তারিখ:{" "}
                {new Date(invoice.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Party Details */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
            <p className="font-bold text-gray-500 uppercase tracking-wider mb-1">
              প্রতিষ্ঠানের বিবরণ:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <p className="text-sm font-black text-gray-900">
                  {invoice.client?.name || "সাধারণ প্রতিষ্ঠান"}
                </p>
                {invoice.client?.address && (
                  <p className="text-gray-600">ঠিকানা: {invoice.client.address}</p>
                )}
              </div>
              <div className="sm:text-right">
                <p className="text-gray-700 font-medium">
                  ফোন: {invoice.client?.phone || "-"}
                </p>
                <p className="text-gray-500">
                  স্ট্যাটাস: <span className="font-bold capitalize">{invoice.status || "Approved"}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-gray-200">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="p-2.5 text-center w-12 border border-slate-700">নং</th>
                  <th className="p-2.5 border border-slate-700">পণ্যের বিবরণ (Description)</th>
                  <th className="p-2.5 text-center w-20 border border-slate-700">পরিমাণ</th>
                  <th className="p-2.5 text-right w-24 border border-slate-700">দর (৳)</th>
                  <th className="p-2.5 text-right w-28 border border-slate-700">মোট টাকা (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoice.items.map((item, idx) => {
                  const pName = item.product?.name || item.productName || "পণ্য";
                  const total = item.total || item.quantity * item.pricePerUnit;
                  return (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="p-2.5 text-center font-bold text-gray-600 border-r border-gray-200">
                        {idx + 1}
                      </td>
                      <td className="p-2.5 font-bold text-gray-900 border-r border-gray-200">
                        {pName}
                      </td>
                      <td className="p-2.5 text-center font-semibold text-gray-800 border-r border-gray-200">
                        {item.quantity}
                      </td>
                      <td className="p-2.5 text-right font-mono font-medium text-gray-700 border-r border-gray-200">
                        ৳ {item.pricePerUnit.toLocaleString()}
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-gray-900">
                        ৳ {total.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end">
            <div className="w-full sm:w-64 space-y-2 text-xs border-t border-gray-200 pt-3">
              <div className="flex justify-between font-bold text-gray-700">
                <span>সর্বমোট (Total):</span>
                <span className="font-mono">৳ {invoice.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-700">
                <span>পরিশোধ (Paid):</span>
                <span className="font-mono">৳ {(invoice.paidAmount || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-red-600 border-t border-gray-200 pt-1 text-sm">
                <span>অবশিষ্ট বাকি (Due):</span>
                <span className="font-mono">৳ {dueAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Signature Areas */}
          <div className="pt-12 grid grid-cols-2 gap-8 text-center text-xs text-gray-600">
            <div>
              <div className="border-t border-gray-400 w-36 mx-auto pt-1 font-bold">
                গ্রহীতার স্বাক্ষর
              </div>
            </div>
            <div>
              <div className="border-t border-gray-400 w-36 mx-auto pt-1 font-bold">
                কর্তৃপক্ষের স্বাক্ষর
              </div>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-gray-100 text-[10px] text-gray-400">
            Bangla ERP দ্বারা তৈরিকৃত কম্পিউটার প্রিন্ট কপি। কোনো স্বাক্ষরের প্রয়োজন নাও হতে পারে।
          </div>
        </div>
      </div>
    </div>
  );
}
