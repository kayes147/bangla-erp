"use client";
import { useState } from "react";
import { Receipt, Plus, Search, Filter, Trash2, X, Save, UploadCloud, UserCircle } from "lucide-react";
import { addExpense, deleteExpense } from "@/actions/expenseActions";
import { useRouter } from "next/navigation";

export default function ExpensesClient({ initialExpenses, userRole }: { initialExpenses: any[], userRole: string }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("business"); // "business" | "personal"
  const [isPersonalExpense, setIsPersonalExpense] = useState(false);
  const [mockRole, setMockRole] = useState(userRole); 
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [sourceOfFund, setSourceOfFund] = useState<"business_cash" | "other_source">("business_cash");

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;
    
    setLoading(true);
    const finalCategory = isPersonalExpense ? "Owner Personal" : category;
    
    const res = await addExpense({
      category: finalCategory || "Other",
      amount: Number(amount),
      description,
      isPersonal: isPersonalExpense,
      paymentMethod: isPersonalExpense ? sourceOfFund : "business_cash",
      requestedBy: mockRole,
    });
    
    setLoading(false);
    if (res.success) {
      setIsModalOpen(false);
      setCategory("");
      setAmount("");
      setDescription("");
      setIsPersonalExpense(false);
      setSourceOfFund("business_cash");
      router.refresh();
    } else {
      alert(res.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      await deleteExpense(id);
      router.refresh();
    }
  };

  const businessExpenses = initialExpenses.filter(e => !e.isPersonal);
  const personalExpenses = initialExpenses.filter(e => e.isPersonal);

  // Calculate totals
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let businessToday = 0;
  let personalToday = 0;
  let personalCashOutToday = 0;
  let personalOtherToday = 0;

  initialExpenses.forEach(e => {
    if (new Date(e.date) >= today && e.status !== "REJECTED") {
      if (!e.isPersonal) {
        businessToday += e.amount;
      } else {
        personalToday += e.amount;
        if (e.paymentMethod === "other_source") {
          personalOtherToday += e.amount;
        } else {
          personalCashOutToday += e.amount;
        }
      }
    }
  });

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
          <p className="text-red-100 font-bold mb-1">
            {activeTab === "business" ? "আজকের ব্যবসায়িক খরচ" : "আজকের ব্যক্তিগত খরচ"}
            <span className="text-[10px] font-normal uppercase opacity-80 block">
              {activeTab === "business" ? "(Today's Business Expense)" : "(Today's Personal Expense)"}
            </span>
          </p>
          <h2 className="text-4xl font-bold">
            ৳ {(activeTab === "business" ? businessToday : personalToday).toLocaleString()}
          </h2>
          <p className="text-xs mt-2 text-red-200">
            {activeTab === "business" ? "Total business spent today" : "Total personal spent today"}
          </p>
        </div>

        {activeTab === "personal" ? (
          <>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
              <p className="font-bold text-red-700 mb-1">ব্যবসার ক্যাশ থেকে (-) <span className="text-[10px] font-normal text-gray-400 uppercase block">(From Business Cash)</span></p>
              <h2 className="text-2xl font-bold text-red-600">৳ {personalCashOutToday.toLocaleString()}</h2>
              <p className="text-xs text-gray-400 mt-1">মূল ক্যাশ থেকে মাইনাস হয়েছে</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
              <p className="font-bold text-blue-700 mb-1">ব্যক্তিগত / অন্যান্য তহবিল <span className="text-[10px] font-normal text-gray-400 uppercase block">(Personal / Other Source)</span></p>
              <h2 className="text-2xl font-bold text-blue-600">৳ {personalOtherToday.toLocaleString()}</h2>
              <p className="text-xs text-gray-400 mt-1">ক্যাশে প্রভাব পড়েনি (শুধু হিসাব)</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
              <p className="font-bold text-gray-800 mb-1">এই সপ্তাহে <span className="text-[10px] font-normal text-gray-400 uppercase block">(This Week)</span></p>
              <h2 className="text-2xl font-bold text-gray-900">৳ -</h2>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
              <p className="font-bold text-gray-800 mb-1">এই মাসে <span className="text-[10px] font-normal text-gray-400 uppercase block">(This Month)</span></p>
              <h2 className="text-2xl font-bold text-gray-900">৳ -</h2>
            </div>
          </>
        )}
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
                <th className="p-4 font-bold text-gray-700">ক্যাটাগরি ও উৎস <span className="text-[10px] font-normal text-gray-400 block uppercase">(Category & Source)</span></th>
                <th className="p-4 font-bold text-gray-700">বিবরণ <span className="text-[10px] font-normal text-gray-400 block uppercase">(Description)</span></th>
                <th className="p-4 font-bold text-gray-700 text-right">টাকা <span className="text-[10px] font-normal text-gray-400 block uppercase">(Amount)</span></th>
                <th className="p-4 font-bold text-gray-700 text-center">অ্যাকশন <span className="text-[10px] font-normal text-gray-400 block uppercase">(Action)</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              
              {activeTab === "business" && businessExpenses.map(e => (
                  <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-500 font-medium">{new Date(e.date).toLocaleDateString()}</td>
                    <td className="p-4"><span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-bold">{e.category}</span></td>
                    <td className="p-4 font-medium text-gray-800">{e.description}</td>
                    <td className="p-4 font-bold text-red-600 text-right">৳ {e.amount.toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleDelete(e.id)} className="text-gray-400 hover:text-red-600 transition-colors" title="Delete"><Trash2 size={16} /></button>
                    </td>
                  </tr>
              ))}
              {activeTab === "business" && businessExpenses.length === 0 && (
                 <tr><td colSpan={5} className="p-8 text-center text-gray-400">No business expenses found.</td></tr>
              )}

              {activeTab === "personal" && personalExpenses.map(e => (
                  <tr key={e.id} className={`hover:bg-gray-50 transition-colors ${e.status === 'PENDING' ? 'bg-orange-50/40' : ''}`}>
                    <td className="p-4 text-gray-500 font-medium">
                      {new Date(e.date).toLocaleDateString()}
                      {e.status === 'PENDING' && <span className="block text-[10px] text-orange-600 font-bold">Pending Manager Request</span>}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-bold">
                          {e.category}
                        </span>
                        {e.paymentMethod === "other_source" ? (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] font-bold">
                            ব্যক্তিগত তহবিল
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded text-[10px] font-bold">
                            ব্যবসার ক্যাশ (-)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-gray-800">{e.description} <span className="text-xs text-gray-400">({e.requestedBy})</span></td>
                    <td className="p-4 font-bold text-red-600 text-right">৳ {e.amount.toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleDelete(e.id)} className="text-gray-400 hover:text-red-600 transition-colors" title="Delete"><Trash2 size={16} /></button>
                    </td>
                  </tr>
              ))}
              {activeTab === "personal" && personalExpenses.length === 0 && (
                 <tr><td colSpan={5} className="p-8 text-center text-gray-400">No personal expenses found.</td></tr>
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

            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleAddExpense} className="space-y-5">
                
                {/* Personal Expense Toggle */}
                {mockRole === "owner" && (
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
                )}
                
                {isPersonalExpense && (
                  <div className="bg-amber-50/90 border border-amber-200 p-4 rounded-xl space-y-3">
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        টাকা খরচের উৎস নির্বাচন করুন (Source of Funds) <span className="text-red-500">*</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        টাকা কোথা থেকে খরচ হয়েছে তা বেছে নিন
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label
                        onClick={() => setSourceOfFund("business_cash")}
                        className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          sourceOfFund === "business_cash"
                            ? "border-red-500 bg-white text-red-950 ring-2 ring-red-200 shadow-sm"
                            : "border-gray-200 bg-white/70 text-gray-700 hover:bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="source_of_fund"
                          checked={sourceOfFund === "business_cash"}
                          onChange={() => setSourceOfFund("business_cash")}
                          className="mt-1 text-red-600 focus:ring-red-500"
                        />
                        <div>
                          <span className="font-bold text-sm block text-gray-900">ব্যবসার ক্যাশ থেকে</span>
                          <span className="text-xs text-red-600 block mt-0.5 font-medium">
                            মূল ক্যাশবক্স থেকে টাকা মাইনাস (-) হবে
                          </span>
                        </div>
                      </label>

                      <label
                        onClick={() => setSourceOfFund("other_source")}
                        className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          sourceOfFund === "other_source"
                            ? "border-blue-500 bg-white text-blue-950 ring-2 ring-blue-200 shadow-sm"
                            : "border-gray-200 bg-white/70 text-gray-700 hover:bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="source_of_fund"
                          checked={sourceOfFund === "other_source"}
                          onChange={() => setSourceOfFund("other_source")}
                          className="mt-1 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <span className="font-bold text-sm block text-gray-900">ব্যক্তিগত / অন্যান্য তহবিল</span>
                          <span className="text-xs text-blue-600 block mt-0.5 font-medium">
                            শুধু হিসাব থাকবে, ক্যাশে কোনো প্রভাব নেই
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Category */}
                  <div>
                    <label className="flex justify-between items-center text-sm font-bold text-gray-700 mb-1">
                      <span>ক্যাটাগরি <span className="text-[10px] font-normal text-gray-400 uppercase">(Category)</span> <span className="text-red-500">*</span></span>
                    </label>
                    {isPersonalExpense ? (
                      <div className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-900 font-bold">Owner&apos;s Personal Account</div>
                    ) : (
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all font-bold text-gray-900 bg-white" 
                        required
                      >
                        <option value="" className="text-gray-500">নির্বাচন করুন (Select)</option>
                        <option value="Tea & Snacks" className="text-gray-900">চা-নাস্তা (Tea & Snacks)</option>
                        <option value="Transport" className="text-gray-900">যাতায়াত (Transport)</option>
                        <option value="Utility Bills" className="text-gray-900">বিদ্যুৎ/গ্যাস (Utility Bills)</option>
                        <option value="Maintenance" className="text-gray-900">মেরামত (Maintenance)</option>
                        <option value="Other" className="text-gray-900">অন্যান্য (Other)</option>
                      </select>
                    )}
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">টাকার পরিমাণ <span className="text-[10px] font-normal text-gray-400 uppercase">(Amount)</span> <span className="text-red-500">*</span></label>
                    <input 
                      type="number" 
                      placeholder="৳ 0.00" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all font-bold text-gray-900 bg-white placeholder-gray-400" 
                      required 
                    />
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">বিস্তারিত বিবরণ <span className="text-[10px] font-normal text-gray-400 uppercase">(Description)</span> <span className="text-red-500">*</span></label>
                    <textarea 
                      rows={2} 
                      placeholder="খরচের বিস্তারিত বিবরণ লিখুন..." 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all font-medium text-gray-900 bg-white placeholder-gray-400" 
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end space-x-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-white transition-colors text-sm"
                  >
                    বাতিল <span className="font-normal opacity-80">(Cancel)</span>
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-bold transition-colors shadow-sm text-sm"
                  >
                    <Save size={18} />
                    <span>{loading ? "Saving..." : (isPersonalExpense && mockRole === "manager" ? 'রিকোয়েস্ট পাঠান' : 'সেভ করুন')}</span>
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
