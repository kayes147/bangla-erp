"use client";
import { useState } from "react";
import { Search, History, Banknote, X, Save } from "lucide-react";
import { paySalary } from "@/actions/employeeActions";

export default function EmployeeList({ initialEmployees, userRole = "owner" }: { initialEmployees: any[], userRole?: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<any>(null);
  const [payAmount, setPayAmount] = useState("");
  const [payMonth, setPayMonth] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredEmployees = initialEmployees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.phone.includes(searchTerm);
    const matchesType = filterType === "all" || emp.type === filterType;
    return matchesSearch && matchesType;
  });

  const openPayModal = (emp: any) => {
    setSelectedEmp(emp);
    setPayAmount(emp.salaryAmount.toString());
    setPayMonth(new Date().toLocaleString('en-us', { month: 'short', year: 'numeric' }));
    setIsModalOpen(true);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp || !payAmount || !payMonth) return;

    setLoading(true);
    const status = userRole === "owner" ? "APPROVED" : "PENDING";
    
    const res = await paySalary(
      selectedEmp.id,
      parseFloat(payAmount),
      payMonth,
      userRole,
      status
    );

    setLoading(false);
    if (res.success) {
      setIsModalOpen(false);
      setSelectedEmp(null);
    } else {
      alert("Error: " + res.error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <div className="relative w-full max-w-md">
          <input 
            type="text" 
            placeholder="নাম বা মোবাইল নম্বর দিয়ে খুঁজুন..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all text-sm font-medium"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="ml-4 p-2 border border-gray-300 rounded-lg outline-none text-sm bg-white font-bold text-gray-700"
        >
          <option value="all">সবাই (All)</option>
          <option value="permanent">স্থায়ী (Permanent)</option>
          <option value="daily">দিনমজুর (Daily)</option>
        </select>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-white border-b border-gray-100">
            <tr>
              <th className="p-4 font-bold text-gray-700">নাম <span className="text-[10px] font-normal text-gray-400 block uppercase">(Name)</span></th>
              <th className="p-4 font-bold text-gray-700">মোবাইল <span className="text-[10px] font-normal text-gray-400 block uppercase">(Phone)</span></th>
              <th className="p-4 font-bold text-gray-700">কাজের ধরন <span className="text-[10px] font-normal text-gray-400 block uppercase">(Type)</span></th>
              <th className="p-4 font-bold text-gray-700">বেতন/মজুরি <span className="text-[10px] font-normal text-gray-400 block uppercase">(Salary Amount)</span></th>
              <th className="p-4 font-bold text-gray-700">শেষ পেমেন্ট <span className="text-[10px] font-normal text-gray-400 block uppercase">(Last Paid)</span></th>
              <th className="p-4 font-bold text-gray-700 text-right">অ্যাকশন <span className="text-[10px] font-normal text-gray-400 block uppercase">(Action)</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            
            {filteredEmployees.map((emp) => {
              const lastPaid = emp.salariesPaid?.[0];
              return (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-gray-800">{emp.name}</p>
                    <p className="text-xs text-gray-500 font-medium">{emp.designation || 'Worker'}</p>
                  </td>
                  <td className="p-4 font-bold text-gray-800">{emp.phone}</td>
                  <td className="p-4">
                    {emp.type === 'permanent' 
                      ? <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">স্থায়ী (Permanent)</span>
                      : <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-bold">দিনমজুর (Daily)</span>
                    }
                  </td>
                  <td className="p-4 font-bold text-gray-800">
                    ৳ {emp.salaryAmount.toLocaleString()} <span className="text-xs text-gray-500 font-normal">/{emp.type === 'permanent' ? 'Month' : 'Day'}</span>
                  </td>
                  <td className="p-4">
                    {lastPaid ? (
                      <div>
                        <p className="text-green-600 font-bold">{new Date(lastPaid.date).toLocaleDateString()}</p>
                        <p className="text-[10px] text-gray-500 uppercase">৳ {lastPaid.amount}</p>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Not paid yet</span>
                    )}
                  </td>
                  <td className="p-4 text-right flex justify-end items-center space-x-3">
                    <button className="text-gray-500 hover:text-indigo-600" title="History"><History size={18}/></button>
                    <button onClick={() => openPayModal(emp)} className="text-green-600 hover:underline font-bold text-sm">Pay Now</button>
                  </td>
                </tr>
              )
            })}
            
            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400 font-medium">No employees found.</td>
              </tr>
            )}

          </tbody>
        </table>
      </div>

      {/* Pay Modal */}
      {isModalOpen && selectedEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-gray-900/30">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-green-100 text-green-600 rounded-lg">
                  <Banknote size={20} />
                </div>
                <h2 className="text-lg font-bold text-gray-800">বেতন দিন <span className="text-sm font-normal text-gray-500">(Pay Salary)</span></h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
                <p className="text-sm text-gray-500">Paying to</p>
                <p className="text-xl font-bold text-gray-800">{selectedEmp.name}</p>
                <p className="text-xs text-gray-500 mt-1">{selectedEmp.type === 'permanent' ? 'Permanent Employee' : 'Daily Worker'}</p>
              </div>

              <form onSubmit={handlePay} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">পরিমাণ <span className="text-[10px] font-normal text-gray-400 uppercase">(Amount)</span></label>
                  <input 
                    type="number" 
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-bold text-gray-900" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">মাস বা তারিখ <span className="text-[10px] font-normal text-gray-400 uppercase">(Month/Date)</span></label>
                  <input 
                    type="text" 
                    value={payMonth}
                    onChange={(e) => setPayMonth(e.target.value)}
                    placeholder="e.g. August 2026"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all font-bold text-gray-900" 
                    required 
                  />
                </div>
                
                <div className="pt-4 flex justify-end space-x-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 text-sm">
                    বাতিল
                  </button>
                  <button type="submit" disabled={loading} className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-bold shadow-sm text-sm disabled:opacity-50">
                    <Save size={18} />
                    <span>{loading ? "Processing..." : "নিশ্চিত করুন (Confirm)"}</span>
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
