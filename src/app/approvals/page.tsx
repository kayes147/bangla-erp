"use client";
import { useState } from "react";
import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";

export default function Approvals() {
  const [activeTab, setActiveTab] = useState("pending");

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pending Approvals (অ্যাপ্রুভাল রিকোয়েস্ট)</h1>
          <p className="text-sm text-gray-500 mt-1">Review and approve requests from managers and clients.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "pending" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Pending (3)
          </button>
          <button 
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "history" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Approval History
          </button>
        </div>
      </div>

      {activeTab === "pending" ? (
        <div className="space-y-4">
          
          {/* Request 1: Money Out by Manager */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-orange-200 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-orange-500">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-bold">Money Out</span>
                <span className="text-sm text-gray-500 flex items-center"><Clock size={14} className="mr-1"/> 10 mins ago</span>
              </div>
              <h3 className="font-semibold text-gray-800 text-lg">Expense Request: ৳ 5,000</h3>
              <p className="text-sm text-gray-600">Requested by: <span className="font-medium">Manager (Hasibul)</span></p>
              <p className="text-sm text-gray-500 mt-1">Reason: Shop repair and maintenance.</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-1 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium text-sm transition-colors">
                <XCircle size={18}/> <span>Reject</span>
              </button>
              <button className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-medium text-sm transition-colors shadow-sm">
                <CheckCircle2 size={18}/> <span>Approve</span>
              </button>
            </div>
          </div>

          {/* Request 2: Product In by Client */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-blue-200 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-blue-500">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-bold">Product In</span>
                <span className="text-sm text-gray-500 flex items-center"><Clock size={14} className="mr-1"/> 1 hour ago</span>
              </div>
              <h3 className="font-semibold text-gray-800 text-lg">Product Receive Request: 50 Pcs</h3>
              <p className="text-sm text-gray-600">Requested by: <span className="font-medium">Client (Karim Traders)</span></p>
              <p className="text-sm text-gray-500 mt-1">Details: 50 Pcs of Radhuni Masala. Needs price confirmation.</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium text-sm transition-colors">
                View Details
              </button>
              <button className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-medium text-sm transition-colors shadow-sm">
                <CheckCircle2 size={18}/> <span>Accept Stock</span>
              </button>
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
          <CheckCircle2 size={48} className="mx-auto text-gray-300 mb-3" />
          <p>No recent approval history found.</p>
        </div>
      )}

    </div>
  );
}
