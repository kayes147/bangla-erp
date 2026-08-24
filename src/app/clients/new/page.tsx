import { UserPlus, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddNewClient() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
        <Link href="/clients" className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
          <UserPlus size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Add New Client/Supplier (নতুন গ্রাহক/মহাজন)</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form className="space-y-6">
          
          {/* Client Type */}
          <div className="pb-6 border-b border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-3">Type (ধরন)</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer p-3 border border-indigo-200 bg-indigo-50 rounded-lg text-indigo-700 font-medium">
                <input type="radio" name="client_type" value="customer" defaultChecked className="text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
                <span>Customer (গ্রাহক)</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer p-3 border border-gray-200 hover:bg-gray-50 rounded-lg text-gray-700 font-medium transition-colors">
                <input type="radio" name="client_type" value="supplier" className="text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
                <span>Supplier (মহাজন/সাপ্লায়ার)</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name (নাম) <span className="text-red-500">*</span></label>
              <input type="text" placeholder="e.g. Rahim Uddin" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" required />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number (মোবাইল নম্বর) <span className="text-red-500">*</span></label>
              <input type="tel" placeholder="e.g. 01700000000" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" required />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address (ঠিকানা)</label>
              <textarea rows={2} placeholder="Full address..." className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"></textarea>
            </div>

            {/* Opening Balance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Previous Due/Balance (আগের বাকী)</label>
              <input type="number" placeholder="৳ 0.00" defaultValue="0" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
              <p className="text-xs text-gray-500 mt-1">If they already owe you money or you owe them.</p>
            </div>

            {/* Balance Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Balance Type (টাকার ধরন)</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
                <option value="receivable">I will get money (আমি টাকা পাবো)</option>
                <option value="payable">I have to pay (আমাকে টাকা দিতে হবে)</option>
              </select>
            </div>

          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end space-x-3">
            <Link href="/clients" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Cancel (বাতিল)
            </Link>
            <button type="button" className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm">
              <Save size={20} />
              <span>Save Details (সেভ করুন)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
