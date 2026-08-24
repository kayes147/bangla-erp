"use client";
import { useState } from "react";
import { Search } from "lucide-react";

export default function ClientsList({ initialClients }: { initialClients: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredClients = initialClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          client.phone.includes(searchTerm);
    const matchesType = filterType === "all" || client.type === filterType || (filterType === "due" && client.openingBalance !== 0);
    return matchesSearch && matchesType;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50">
        <div className="relative w-full max-w-md">
          <input 
            type="text" 
            placeholder="নাম বা মোবাইল নম্বর দিয়ে খুঁজুন (Search...)" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium text-gray-800"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg outline-none text-sm bg-white font-bold text-gray-700"
        >
          <option value="all">সবাই (All)</option>
          <option value="due">যাদের বাকী আছে (Due Only)</option>
          <option value="supplier">মহাজন (Suppliers)</option>
        </select>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-white border-b border-gray-100">
            <tr>
              <th className="p-4 font-bold text-gray-700">নাম <span className="text-[10px] font-normal text-gray-400 block uppercase">(Name)</span></th>
              <th className="p-4 font-bold text-gray-700">মোবাইল <span className="text-[10px] font-normal text-gray-400 block uppercase">(Phone)</span></th>
              <th className="p-4 font-bold text-gray-700">ধরন <span className="text-[10px] font-normal text-gray-400 block uppercase">(Type)</span></th>
              <th className="p-4 font-bold text-gray-700">লগইন অ্যাক্সেস <span className="text-[10px] font-normal text-gray-400 block uppercase">(Login Access)</span></th>
              <th className="p-4 font-bold text-gray-700">বর্তমান বকেয়া <span className="text-[10px] font-normal text-gray-400 block uppercase">(Current Due)</span></th>
              <th className="p-4 font-bold text-gray-700 text-right">অ্যাকশন <span className="text-[10px] font-normal text-gray-400 block uppercase">(Action)</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-gray-900">{client.name}</p>
                  <p className="text-xs text-gray-500 font-medium">{client.address || "No address provided"}</p>
                </td>
                <td className="p-4 font-bold text-gray-800">{client.phone}</td>
                <td className="p-4">
                  {client.type === 'supplier' 
                    ? <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-bold">Supplier</span>
                    : <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">Customer</span>
                  }
                </td>
                <td className="p-4">
                  {client.user ? (
                    <div>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Has Access</span>
                      <p className="text-[10px] text-gray-400 mt-1 font-bold">ID: {client.user.username}</p>
                    </div>
                  ) : (
                    <button className="text-xs text-indigo-600 hover:underline font-bold">+ Create Login</button>
                  )}
                </td>
                <td className="p-4 font-bold text-gray-900">
                  {client.openingBalance > 0 ? (
                    <span className="text-green-600">৳ {client.openingBalance.toLocaleString()} <span className="text-[10px] text-gray-400 font-normal uppercase">(Receivable)</span></span>
                  ) : client.openingBalance < 0 ? (
                    <span className="text-red-600">৳ {Math.abs(client.openingBalance).toLocaleString()} <span className="text-[10px] text-gray-400 font-normal uppercase">(Payable)</span></span>
                  ) : (
                    "৳ 0"
                  )}
                </td>
                <td className="p-4 text-right">
                  <button className="text-indigo-600 hover:underline font-bold text-sm">View Profile</button>
                </td>
              </tr>
            ))}
            {filteredClients.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400 font-medium">No clients found matching your criteria.</td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>
  );
}
