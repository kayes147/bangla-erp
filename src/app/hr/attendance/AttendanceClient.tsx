"use client";
import { useState } from "react";
import { UserCheck, UserX, Clock4, CalendarX, Check, X, Clock, CalendarDays } from "lucide-react";
import { markAttendance, markBulkAttendance } from "@/actions/attendanceActions";
import { useRouter } from "next/navigation";

export default function AttendanceClient({ employees, attendances, initialDateString }: { employees: any[], attendances: any[], initialDateString: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(false);

  // Stats
  let presentCount = 0;
  let lateCount = 0;
  let absentCount = 0;
  let leaveCount = 0;

  attendances.forEach(a => {
    if (a.status === "PRESENT") presentCount++;
    if (a.status === "LATE") lateCount++;
    if (a.status === "ABSENT") absentCount++;
    if (a.status === "LEAVE") leaveCount++;
  });

  const handleMark = async (employeeId: string, status: string) => {
    setLoading(true);
    const res = await markAttendance(employeeId, initialDateString, status);
    setLoading(false);
    if (res.success) {
      router.refresh();
    } else {
      alert("Error: " + res.error);
    }
  };

  const handleMarkAll = async (status: string) => {
    if (!confirm(`Mark all un-marked employees as ${status}?`)) return;
    setLoading(true);
    
    const unMarked = employees.filter(emp => !attendances.find(a => a.employeeId === emp.id));
    const entries = unMarked.map(emp => ({ employeeId: emp.id, status }));
    
    if (entries.length > 0) {
      const res = await markBulkAttendance(initialDateString, entries);
      if (!res.success) alert("Error: " + res.error);
    }
    
    setLoading(false);
    router.refresh();
  };

  // Build unified list of employees and their attendance today
  const attendanceList = employees.map(emp => {
    const record = attendances.find(a => a.employeeId === emp.id);
    return {
      employee: emp,
      record: record || null
    };
  });

  const filteredList = attendanceList.filter(item => {
    if (activeTab === "All") return true;
    if (activeTab === "Present" && item.record?.status === "PRESENT") return true;
    if (activeTab === "Late" && item.record?.status === "LATE") return true;
    if (activeTab === "Absent" && item.record?.status === "ABSENT") return true;
    if (activeTab === "On Leave" && item.record?.status === "LEAVE") return true;
    if (activeTab === "Unmarked" && !item.record) return true;
    return false;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pt-4">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <UserCheck className="text-emerald-600" size={28} />
            <span>কর্মীদের হাজিরা <span className="text-sm font-normal text-gray-500">(Daily Attendance)</span></span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track daily attendance, mark absent/present for employees.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 bg-gray-100 p-2 rounded-lg">
          <CalendarDays size={20} className="text-gray-500" />
          <span className="font-bold text-gray-800">{new Date(initialDateString).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Present <span className="text-[10px] font-normal uppercase">(উপস্থিত)</span></p>
            <p className="text-xl font-bold text-gray-800">{presentCount}</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-orange-50 text-orange-500 rounded-lg">
            <Clock4 size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Late <span className="text-[10px] font-normal uppercase">(দেরি)</span></p>
            <p className="text-xl font-bold text-gray-800">{lateCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-red-50 text-red-500 rounded-lg">
            <UserX size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Absent <span className="text-[10px] font-normal uppercase">(অনুপস্থিত)</span></p>
            <p className="text-xl font-bold text-gray-800">{absentCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-500 rounded-lg">
            <CalendarX size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Leave <span className="text-[10px] font-normal uppercase">(ছুটি)</span></p>
            <p className="text-xl font-bold text-gray-800">{leaveCount}</p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Table Controls */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50">
          <div className="flex space-x-1 bg-gray-200/50 p-1 rounded-lg overflow-x-auto w-full sm:w-auto">
            {["All", "Present", "Late", "Absent", "On Leave", "Unmarked"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-bold whitespace-nowrap rounded-md transition-colors ${activeTab === tab ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => handleMarkAll('PRESENT')} 
              disabled={loading}
              className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
            >
              সবাইকে উপস্থিত দিন
            </button>
            <button 
              onClick={() => handleMarkAll('ABSENT')} 
              disabled={loading}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
            >
              সবাইকে অনুপস্থিত দিন
            </button>
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="p-4 font-bold text-gray-700">কর্মী <span className="text-[10px] font-normal text-gray-400 block uppercase">(Employee)</span></th>
                <th className="p-4 font-bold text-gray-700">কাজের ধরন <span className="text-[10px] font-normal text-gray-400 block uppercase">(Type)</span></th>
                <th className="p-4 font-bold text-gray-700">বর্তমান স্ট্যাটাস <span className="text-[10px] font-normal text-gray-400 block uppercase">(Status)</span></th>
                <th className="p-4 font-bold text-gray-700 text-right">হাজিরা দিন <span className="text-[10px] font-normal text-gray-400 block uppercase">(Mark Attendance)</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredList.map(({ employee, record }) => (
                <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-gray-800">{employee.name}</p>
                    <p className="text-xs text-gray-500 font-medium">{employee.designation || 'Worker'} • {employee.phone}</p>
                  </td>
                  <td className="p-4">
                    {employee.type === 'permanent' 
                      ? <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">স্থায়ী (Permanent)</span>
                      : <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-bold">দিনমজুর (Daily)</span>
                    }
                  </td>
                  <td className="p-4">
                    {!record && <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold border border-gray-200">দেওয়া হয়নি (Unmarked)</span>}
                    {record?.status === 'PRESENT' && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">উপস্থিত (Present)</span>}
                    {record?.status === 'LATE' && <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold border border-orange-200">দেরি (Late)</span>}
                    {record?.status === 'ABSENT' && <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold border border-red-200">অনুপস্থিত (Absent)</span>}
                    {record?.status === 'LEAVE' && <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold border border-blue-200">ছুটি (Leave)</span>}
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <button 
                      disabled={loading || record?.status === 'PRESENT'}
                      onClick={() => handleMark(employee.id, 'PRESENT')}
                      className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors disabled:opacity-50 border border-emerald-200"
                      title="Present"
                    >
                      <Check size={18} />
                    </button>
                    <button 
                      disabled={loading || record?.status === 'LATE'}
                      onClick={() => handleMark(employee.id, 'LATE')}
                      className="p-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg transition-colors disabled:opacity-50 border border-orange-200"
                      title="Late"
                    >
                      <Clock size={18} />
                    </button>
                    <button 
                      disabled={loading || record?.status === 'ABSENT'}
                      onClick={() => handleMark(employee.id, 'ABSENT')}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors disabled:opacity-50 border border-red-200"
                      title="Absent"
                    >
                      <X size={18} />
                    </button>
                    <button 
                      disabled={loading || record?.status === 'LEAVE'}
                      onClick={() => handleMark(employee.id, 'LEAVE')}
                      className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors disabled:opacity-50 border border-blue-200"
                      title="Leave"
                    >
                      <CalendarX size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredList.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-gray-500 font-medium">
                    No employees found matching the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
