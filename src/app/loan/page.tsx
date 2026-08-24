"use client";
import { useState } from "react";
import { Landmark, Plus, Search, ArrowDownToLine, ArrowUpFromLine, User, X, Save } from "lucide-react";
import Link from "next/link";

export default function Loan() {
  const [isGiveLoanModalOpen, setIsGiveLoanModalOpen] = useState(false);
  const [isReceiveLoanModalOpen, setIsReceiveLoanModalOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
            <Landmark size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Loans & Advances (লোন ও ধার)</h1>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsGiveLoanModalOpen(true)}
            className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm"
          >
            <ArrowUpFromLine size={18} />
            <span>Give Loan (ধার দিন)</span>
          </button>
          <button 
            onClick={() => setIsReceiveLoanModalOpen(true)}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm"
          >
            <ArrowDownToLine size={18} />
            <span>Receive Payment (ফেরত নিন)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 shadow-md text-white">
          <p className="text-orange-100 font-medium mb-1">Total Loan Given (আমি মোট টাকা পাবো)</p>
          <h2 className="text-4xl font-bold">৳ 15,500</h2>
          <p className="text-xs mt-2 text-orange-200">Amount lent to clients/employees</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
          <p className="font-medium text-gray-500 mb-1">Total Loan Taken (আমাকে মোট দিতে হবে)</p>
          <h2 className="text-2xl font-bold text-red-600">৳ 5,000</h2>
          <p className="text-xs mt-2 text-gray-400">Amount borrowed from others</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="Search by name..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <select className="ml-4 p-2 border border-gray-300 rounded-lg outline-none text-sm bg-white">
            <option value="all">All Profiles (সবাই)</option>
            <option value="client">Clients (গ্রাহক/মহাজন)</option>
            <option value="employee">Employees (কর্মচারী)</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="p-4 font-medium text-gray-700">Name (নাম)</th>
                <th className="p-4 font-medium text-gray-700">Profile Type</th>
                <th className="p-4 font-medium text-gray-700">Phone</th>
                <th className="p-4 font-medium text-gray-700">Last Transaction Date</th>
                <th className="p-4 font-medium text-right">Balance (বর্তমান হিসাব)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"><User size={16}/></div>
                  <span className="font-semibold text-gray-800">Rahim Uddin</span>
                </td>
                <td className="p-4"><span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">Customer</span></td>
                <td className="p-4">01711-XXXXXX</td>
                <td className="p-4 text-gray-500">Aug 20, 2026</td>
                <td className="p-4 font-bold text-green-600 text-right">আমি পাবো: ৳ 5,500</td>
              </tr>
              
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center"><User size={16}/></div>
                  <span className="font-semibold text-gray-800">Jobbar Ali</span>
                </td>
                <td className="p-4"><span className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs font-medium">Employee</span></td>
                <td className="p-4">01933-XXXXXX</td>
                <td className="p-4 text-gray-500">Aug 22, 2026</td>
                <td className="p-4 font-bold text-green-600 text-right">আমি পাবো: ৳ 10,000</td>
              </tr>

              <tr className="hover:bg-gray-50 transition-colors">
                <td className="p-4 flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center"><User size={16}/></div>
                  <span className="font-semibold text-gray-800">Karim Traders</span>
                </td>
                <td className="p-4"><span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">Supplier</span></td>
                <td className="p-4">01822-XXXXXX</td>
                <td className="p-4 text-gray-500">Aug 15, 2026</td>
                <td className="p-4 font-bold text-red-600 text-right">দিতে হবে: ৳ 5,000</td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Give Loan */}
      {isGiveLoanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-gray-900/30 transition-opacity">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">Give Loan / Advance (ধার দিন)</h2>
              <button onClick={() => setIsGiveLoanModalOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Profile (কাকে ধার দিচ্ছেন?)</label>
                <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
                  <option value="">Select Customer / Supplier / Employee</option>
                  <option value="c1">Rahim Uddin (Customer)</option>
                  <option value="e1">Jobbar Ali (Employee)</option>
                  <option value="new">+ Add New Profile</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (টাকার পরিমাণ) <span className="text-red-500">*</span></label>
                <input type="number" placeholder="৳ 0.00" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none font-bold text-gray-800" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date (তারিখ)</label>
                <input type="date" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (বিবরণ)</label>
                <textarea rows={2} placeholder="Reason for loan..." className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method (কীভাবে দিলেন)</label>
                <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
                  <option value="cash">Main Cash (ক্যাশ থেকে)</option>
                  <option value="bank">Bank / bKash (ব্যাংক/বিকাশ)</option>
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
              <button onClick={() => setIsGiveLoanModalOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-white text-sm">Cancel</button>
              <button onClick={() => setIsGiveLoanModalOpen(false)} className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium text-sm">
                <Save size={16} /><span>Save Loan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Receive Payment */}
      {isReceiveLoanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-gray-900/30 transition-opacity">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">Receive Payment (ধারের টাকা ফেরত)</h2>
              <button onClick={() => setIsReceiveLoanModalOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Profile (কার থেকে ফেরত পেলেন?)</label>
                <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
                  <option value="">Select Profile</option>
                  <option value="c1">Rahim Uddin (Due: ৳ 5,500)</option>
                  <option value="e1">Jobbar Ali (Due: ৳ 10,000)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount Received (কত টাকা পেলেন) <span className="text-red-500">*</span></label>
                <input type="number" placeholder="৳ 0.00" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-bold text-gray-800" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Receive In (কোথায় জমা হলো)</label>
                <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
                  <option value="cash">Main Cash (ক্যাশবক্সে)</option>
                  <option value="bank">Bank / bKash (ব্যাংক/বিকাশ)</option>
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
              <button onClick={() => setIsReceiveLoanModalOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-white text-sm">Cancel</button>
              <button onClick={() => setIsReceiveLoanModalOpen(false)} className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm">
                <Save size={16} /><span>Save Collection</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
