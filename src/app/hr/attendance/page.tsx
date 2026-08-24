"use client";
import { useState } from "react";
import { Download, UploadCloud, Clock, Plus, Search, UserCheck, UserX, CalendarX, Clock4 } from "lucide-react";

export default function AttendanceTracker() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Attendance & Shift Tracker</h1>
          <p className="text-sm text-gray-500 mt-1">
            Log workforce clock-in/out records, assign operational shifts, and upload bulk logs.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <UploadCloud size={16} />
            <span>Bulk Upload Sheet</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Clock size={16} />
            <span>Shift Assignment</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors">
            <Plus size={16} />
            <span>Manual Attendance</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Present Logs</p>
            <p className="text-xl font-bold text-gray-800">0 <span className="text-sm font-normal text-gray-500">entries</span></p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-orange-50 text-orange-500 rounded-lg">
            <Clock4 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Late Check-Ins</p>
            <p className="text-xl font-bold text-gray-800">0 <span className="text-sm font-normal text-gray-500">entries</span></p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-red-50 text-red-500 rounded-lg">
            <UserX size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Absent Logs</p>
            <p className="text-xl font-bold text-gray-800">0 <span className="text-sm font-normal text-gray-500">entries</span></p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-500 rounded-lg">
            <CalendarX size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">On Leave logs</p>
            <p className="text-xl font-bold text-gray-800">0 <span className="text-sm font-normal text-gray-500">entries</span></p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Table Controls */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <div className="flex space-x-1 bg-gray-100/50 p-1 rounded-lg">
            {["All", "Present", "Late", "Absent", "On Leave"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? "bg-slate-800 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="relative w-full sm:w-72">
            <input 
              type="text" 
              placeholder="Search logs by employee..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-800 transition-all" 
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="p-4 font-medium text-gray-500">Employee</th>
                <th className="p-4 font-medium text-gray-500">Department</th>
                <th className="p-4 font-medium text-gray-500">Date</th>
                <th className="p-4 font-medium text-gray-500">Shift Type</th>
                <th className="p-4 font-medium text-gray-500">Check-in</th>
                <th className="p-4 font-medium text-gray-500">Check-out</th>
                <th className="p-4 font-medium text-gray-500">Working Hours</th>
                <th className="p-4 font-medium text-gray-500">Attendance Status</th>
                <th className="p-4 font-medium text-gray-500 text-right">Manual Adjust</th>
              </tr>
            </thead>
            <tbody>
              {/* Empty State */}
              <tr>
                <td colSpan={9} className="p-12 text-center text-gray-500">
                  No attendance logs found matching filters.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
