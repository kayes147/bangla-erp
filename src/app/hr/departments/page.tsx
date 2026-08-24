import { Network, Plus, Users } from "lucide-react";

export default function Departments() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
            <Network size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Departments & Roles (বিভাগ ও পদবি)</h1>
        </div>
        <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
          <Plus size={18} />
          <span>Add Department</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 bg-purple-50 border-b border-purple-100 flex justify-between items-center">
            <h3 className="font-bold text-purple-800">Sales & Marketing</h3>
            <span className="px-2 py-1 bg-white text-purple-600 rounded text-xs font-bold flex items-center gap-1"><Users size={12}/> 5 Staff</span>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700">Sales Manager</span>
              <span className="text-gray-400">1 Person</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700">Sales Executive</span>
              <span className="text-gray-400">4 People</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
            <h3 className="font-bold text-blue-800">Operations & Logistics</h3>
            <span className="px-2 py-1 bg-white text-blue-600 rounded text-xs font-bold flex items-center gap-1"><Users size={12}/> 3 Staff</span>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700">Store Keeper</span>
              <span className="text-gray-400">1 Person</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700">Delivery Man</span>
              <span className="text-gray-400">2 People</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
