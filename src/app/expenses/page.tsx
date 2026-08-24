"use client";
import { useState } from "react";
import { Receipt, Plus, Search, Filter, Trash2, X, Save, UploadCloud, UserCircle } from "lucide-react";

export default function Expenses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("business"); // "business" | "personal"
  const [isPersonalExpense, setIsPersonalExpense] = useState(false); // Checkbox in Add form
  const [mockRole, setMockRole] = useState<"owner" | "manager">("owner"); // For demonstration

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative pt-4">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-100 text-red-600 rounded-lg">
            <Receipt size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">দৈনিক খরচ <span className="text-lg font-normal text-gray-500">(Daily Expenses)</span></h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-sm text-sm"
        >
          <Plus size={18} />
          <span>নতুন খরচ যোগ করুন <span className="text-[10px] font-normal opacity-80 uppercase">(Add Expense)</span></span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab("business")}
          className={`px-4 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === "business" ? "border-red-600 text-red-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          ব্যবসায়িক খরচ <span className="text-[10px] font-normal opacity-80 uppercase ml-1">(Business Expenses)</span>
        </button>
        {mockRole === "owner" && (
          <button 
            onClick={() => setActiveTab("personal")}
            className={`px-4 py-3 font-bold text-sm border-b-2 transition-colors flex items-center space-x-1 ${activeTab === "personal" ? "border-red-600 text-red-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            <UserCircle size={16} />
            <span>ওনারের ব্যক্তিগত খরচ <span className="text-[10px] font-normal opacity-80 uppercase ml-1">(Owner's Personal Expenses)</span></span>
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 shadow-md text-white">
          <p className="text-red-100 font-bold mb-1">আজকের খরচ <span className="text-[10px] font-normal uppercase opacity-80 block">(Today's Expenses)</span></p>
          <h2 className="text-4xl font-bold">৳ 1,250</h2>
          <p className="text-xs mt-2 text-red-200">Total spent today</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
          <p className="font-bold text-gray-800 mb-1">এই সপ্তাহে <span className="text-[10px] font-normal text-gray-400 uppercase block">(This Week)</span></p>
          <h2 className="text-2xl font-bold text-gray-900">৳ 4,500</h2>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
          <p className="font-bold text-gray-800 mb-1">এই মাসে <span className="text-[10px] font-normal text-gray-400 uppercase block">(This Month)</span></p>
          <h2 className="text-2xl font-bold text-gray-900">৳ 15,200</h2>
        </div>
      </div>

      {/* Expenses History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h2 className="font-bold text-gray-800">
            {activeTab === "business" ? "খরচের তালিকা " : "ব্যক্তিগত খরচের তালিকা "} 
            <span className="text-xs font-normal text-gray-500 ml-1">
              ({activeTab === "business" ? "Expense History" : "Personal Expenses"})
            </span>
          </h2>
          {activeTab === "personal" && (
             <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">Private View (Only Owner)</span>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="p-4 font-bold text-gray-700">তারিখ <span className="text-[10px] font-normal text-gray-400 block uppercase">(Date)</span></th>
                <th className="p-4 font-bold text-gray-700">ক্যাটাগরি <span className="text-[10px] font-normal text-gray-400 block uppercase">(Category)</span></th>
                <th className="p-4 font-bold text-gray-700">বিবরণ <span className="text-[10px] font-normal text-gray-400 block uppercase">(Description)</span></th>
                <th className="p-4 font-bold text-gray-700 text-right">টাকা <span className="text-[10px] font-normal text-gray-400 block uppercase">(Amount)</span></th>
                <th className="p-4 font-bold text-gray-700 text-center">অ্যাকশন <span className="text-[10px] font-normal text-gray-400 block uppercase">(Action)</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              
              {activeTab === "business" && (
                <>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-500 font-medium">24 Aug 2026, 11:30 AM</td>
                    <td className="p-4"><span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-bold">Utility Bills</span></td>
                    <td className="p-4 font-medium text-gray-800">Shop Electricity Bill (August)</td>
                    <td className="p-4 font-bold text-red-600 text-right">৳ 850</td>
                    <td className="p-4 text-center">
                      <button className="text-gray-400 hover:text-red-600 transition-colors" title="Delete"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-500 font-medium">23 Aug 2026, 09:15 AM</td>
                    <td className="p-4"><span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-bold">Tea & Snacks</span></td>
                    <td className="p-4 font-medium text-gray-800">Breakfast for workers</td>
                    <td className="p-4 font-bold text-red-600 text-right">৳ 400</td>
                    <td className="p-4 text-center">
                      <button className="text-gray-400 hover:text-red-600 transition-colors" title="Delete"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                </>
              )}

              {activeTab === "personal" && (
                <>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-500 font-medium">22 Aug 2026, 02:00 PM</td>
                    <td className="p-4"><span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-bold">Owner Personal</span></td>
                    <td className="p-4 font-medium text-gray-800">Grocery shopping for home</td>
                    <td className="p-4 font-bold text-red-600 text-right">৳ 5,000</td>
                    <td className="p-4 text-center">
                      <button className="text-gray-400 hover:text-red-600 transition-colors" title="Delete"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors bg-orange-50/40">
                    <td className="p-4 text-gray-500 font-medium">
                      24 Aug 2026, 10:00 AM
                      <span className="block text-[10px] text-orange-600 font-bold">Pending Manager Request</span>
                    </td>
                    <td className="p-4"><span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-bold">Owner Personal</span></td>
                    <td className="p-4 font-medium text-gray-800">Car fuel expense (Added by Hasibul Manager)</td>
                    <td className="p-4 font-bold text-red-600 text-right">৳ 2,000</td>
                    <td className="p-4 text-center">
                       <button className="text-xs font-bold text-indigo-600 hover:underline">Review Request</button>
                    </td>
                  </tr>
                </>
              )}

            </tbody>
          </table>
        </div>
      </div>

      {/* Overlay Modal for Detailed Add Expense */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-gray-500/20 transition-opacity">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-red-100 text-red-600 rounded-lg">
                  <Receipt size={20} />
                </div>
                <h2 className="text-lg font-bold text-gray-800">নতুন খরচ যোগ করুন <span className="text-sm font-normal text-gray-500">(Add Expense)</span></h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <form className="space-y-5">
                
                {/* Personal Expense Toggle */}
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-800 text-sm">এটি কি ওনারের ব্যক্তিগত খরচ?</p>
                    <p className="text-xs text-gray-500">Is this the owner&apos;s personal expense?</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={isPersonalExpense} onChange={() => setIsPersonalExpense(!isPersonalExpense)} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
                
                {isPersonalExpense && (
                  <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg">
                    <p className="text-xs text-orange-800 font-medium">
                      {mockRole === "manager" 
                        ? "ম্যানেজার হিসেবে আপনি এই খরচটি ওনারের ব্যক্তিগত হিসাবে যুক্ত করার জন্য রিকোয়েস্ট পাঠাচ্ছেন। ওনার অ্যাপ্রুভ করলে এটি মূল ক্যাশ থেকে কাটা হবে।" 
                        : "ওনার হিসেবে আপনি এটি সরাসরি নিজের ব্যক্তিগত খরচ হিসেবে সেভ করছেন। এটি অন্য কেউ দেখতে পাবে না।"}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">তারিখ <span className="text-[10px] font-normal text-gray-400 uppercase">(Date)</span> <span className="text-red-500">*</span></label>
                    <input type="date" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all font-medium" required />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="flex justify-between items-center text-sm font-bold text-gray-700 mb-1">
                      <span>ক্যাটাগরি <span className="text-[10px] font-normal text-gray-400 uppercase">(Category)</span> <span className="text-red-500">*</span></span>
                      {!isPersonalExpense && (
                        <button 
                          type="button" 
                          onClick={() => setIsCategoryModalOpen(true)}
                          className="text-red-600 hover:text-red-700 hover:underline text-xs font-normal"
                        >
                          + Add Category
                        </button>
                      )}
                    </label>
                    {isPersonalExpense ? (
                      <div className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 font-medium">Owner&apos;s Personal Account</div>
                    ) : (
                      <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all font-medium" required>
                        <option value="">নির্বাচন করুন (Select)</option>
                        <option value="entertainment">চা-নাস্তা (Tea & Snacks)</option>
                        <option value="transport">যাতায়াত (Transport)</option>
                        <option value="bills">বিদ্যুৎ/গ্যাস (Utility Bills)</option>
                        <option value="maintenance">মেরামত (Maintenance)</option>
                        <option value="other">অন্যান্য (Other)</option>
                      </select>
                    )}
                  </div>

                  {/* Paid To */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">যাকে দেওয়া হয়েছে <span className="text-[10px] font-normal text-gray-400 uppercase">(Paid To)</span></label>
                    <input type="text" placeholder="e.g. Rahim (Electrician)" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all" />
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">টাকার পরিমাণ <span className="text-[10px] font-normal text-gray-400 uppercase">(Amount)</span> <span className="text-red-500">*</span></label>
                    <input type="number" placeholder="৳ 0.00" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all font-bold text-gray-900" required />
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">বিস্তারিত বিবরণ <span className="text-[10px] font-normal text-gray-400 uppercase">(Description)</span> <span className="text-red-500">*</span></label>
                    <textarea rows={2} placeholder="Write the details of this expense..." className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all" required></textarea>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">পেমেন্টের মাধ্যম <span className="text-[10px] font-normal text-gray-400 uppercase">(Payment Method)</span></label>
                    <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all font-medium">
                      <option value="cash">মূল ক্যাশ থেকে (Main Cash)</option>
                      <option value="bkash">বিকাশ/নগদ (bKash/Nagad)</option>
                      <option value="bank">ব্যাংক (Bank)</option>
                    </select>
                  </div>

                  {/* Attachment/Voucher */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">ভাউচারের ছবি <span className="text-[10px] font-normal text-gray-400 uppercase">(Attach Voucher)</span></label>
                    <div className="w-full p-2.5 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors h-[46px]">
                      <div className="flex items-center space-x-2">
                        <UploadCloud size={18} />
                        <span className="text-sm font-bold">Upload photo</span>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3 rounded-b-xl">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-white transition-colors text-sm"
              >
                বাতিল <span className="font-normal opacity-80">(Cancel)</span>
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-bold transition-colors shadow-sm text-sm"
              >
                <Save size={18} />
                <span>{isPersonalExpense && mockRole === "manager" ? 'রিকোয়েস্ট পাঠান (Send Request)' : 'সেভ করুন (Save Expense)'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Overlay Modal for Adding a New Category */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 backdrop-blur-sm bg-gray-900/30 transition-opacity">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">নতুন ক্যাটাগরি <span className="text-xs font-normal text-gray-500">(New Category)</span></h2>
              <button 
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">ক্যাটাগরির নাম <span className="text-[10px] font-normal text-gray-400 uppercase">(Category Name)</span> <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="e.g. Shop Rent (দোকান ভাড়া)" 
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all font-medium" 
                    required 
                  />
                </div>
              </form>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
              <button 
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-white transition-colors text-sm"
              >
                বাতিল <span className="font-normal opacity-80">(Cancel)</span>
              </button>
              <button 
                onClick={() => setIsCategoryModalOpen(false)}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-sm text-sm"
              >
                <Save size={16} />
                <span>সেভ করুন <span className="font-normal opacity-80">(Save)</span></span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
