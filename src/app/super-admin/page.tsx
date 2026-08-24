"use client";
import { useState } from "react";
import { Building2, Users, Activity, Ban, CheckCircle, Search, MoreVertical } from "lucide-react";

export default function SuperAdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock Data for Tenants (Companies)
  const [tenants, setTenants] = useState([
    {
      id: "T-001",
      name: "Bolaka Factory",
      owner: "Hasibul Islam",
      phone: "+880 1711-000000",
      plan: "Premium",
      usersCount: 12,
      joinedDate: "2026-01-15",
      status: "active", // active | banned
    },
    {
      id: "T-002",
      name: "Rahim Traders",
      owner: "Abdur Rahim",
      phone: "+880 1822-111111",
      plan: "Basic",
      usersCount: 3,
      joinedDate: "2026-03-22",
      status: "active",
    },
    {
      id: "T-003",
      name: "Bismillah Electronics",
      owner: "Tariqul Hasan",
      phone: "+880 1933-222222",
      plan: "Enterprise",
      usersCount: 25,
      joinedDate: "2025-11-05",
      status: "banned",
    }
  ]);

  const toggleStatus = (id: string) => {
    setTenants(tenants.map(t => {
      if (t.id === id) {
        return { ...t, status: t.status === "active" ? "banned" : "active" };
      }
      return t;
    }));
  };

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Companies</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{tenants.length}</h3>
            </div>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Building2 size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Active Users</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">40</h3>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Subscriptions</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">
                {tenants.filter(t => t.status === 'active').length}
              </h3>
            </div>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Activity size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Banned Accounts</p>
              <h3 className="text-3xl font-bold text-red-600 mt-1">
                {tenants.filter(t => t.status === 'banned').length}
              </h3>
            </div>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <Ban size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-900">Registered Companies</h2>
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search companies or owners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-bold text-gray-700">Company Name</th>
                <th className="p-4 font-bold text-gray-700">Owner</th>
                <th className="p-4 font-bold text-gray-700">Users</th>
                <th className="p-4 font-bold text-gray-700">Plan</th>
                <th className="p-4 font-bold text-gray-700">Joined</th>
                <th className="p-4 font-bold text-gray-700">Status</th>
                <th className="p-4 font-bold text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTenants.map((t) => (
                <tr key={t.id} className={`hover:bg-gray-50 transition-colors ${t.status === 'banned' ? 'bg-red-50/30' : ''}`}>
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-500">ID: {t.id}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-800">{t.owner}</div>
                    <div className="text-xs text-gray-500">{t.phone}</div>
                  </td>
                  <td className="p-4 font-medium">{t.usersCount} users</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-bold">
                      {t.plan}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 font-medium">{t.joinedDate}</td>
                  <td className="p-4">
                    {t.status === 'active' ? (
                      <span className="inline-flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-xs font-bold">
                        <CheckCircle size={14} />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs font-bold">
                        <Ban size={14} />
                        <span>Banned</span>
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => toggleStatus(t.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        t.status === 'active' 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      }`}
                    >
                      {t.status === 'active' ? 'Suspend Access' : 'Restore Access'}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTenants.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">No companies found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
