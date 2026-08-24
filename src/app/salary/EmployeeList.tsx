"use client";
import { useState } from "react";
import { Search, History } from "lucide-react";

export default function EmployeeList({ initialEmployees }: { initialEmployees: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredEmployees = initialEmployees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.phone.includes(searchTerm);
    const matchesType = filterType === "all" || emp.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                  <td className="p-4 text-right flex justify-end space-x-2">
                    <button className="text-gray-500 hover:text-indigo-600" title="History"><History size={18}/></button>
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
    </div>
  );
}
