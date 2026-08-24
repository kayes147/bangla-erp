import { UserPlus, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddNewEmployee() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
        <Link href="/salary" className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="p-2 bg-pink-100 text-pink-600 rounded-lg">
          <UserPlus size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Add New Employee (নতুন কর্মচারী যোগ করুন)</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form className="space-y-6">
          
          {/* Employee Type */}
          <div className="pb-6 border-b border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-3">Employment Type (কাজের ধরন)</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer p-3 border border-pink-200 bg-pink-50 rounded-lg text-pink-700 font-medium">
                <input type="radio" name="emp_type" value="permanent" defaultChecked className="text-pink-600 focus:ring-pink-500 w-4 h-4" />
                <span>Permanent (স্থায়ী - মাসিক বেতন)</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer p-3 border border-gray-200 hover:bg-gray-50 rounded-lg text-gray-700 font-medium transition-colors">
                <input type="radio" name="emp_type" value="daily" className="text-pink-600 focus:ring-pink-500 w-4 h-4" />
                <span>Daily Worker (দিনমজুর / খণ্ডকালীন)</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name (নাম) <span className="text-red-500">*</span></label>
              <input type="text" placeholder="e.g. Hasibul Islam" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all" required />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number (মোবাইল নম্বর) <span className="text-red-500">*</span></label>
              <input type="tel" placeholder="e.g. 01700000000" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all" required />
            </div>

            {/* Designation/Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Designation / Role (পদবী বা কাজ)</label>
              <input type="text" placeholder="e.g. Manager, Salesman, Loader" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all" />
            </div>

            {/* Joining Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Joining Date (যোগদানের তারিখ)</label>
              <input type="date" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all" />
            </div>

            {/* Salary Amount */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Salary / Wage Amount (বেতন বা মজুরির পরিমাণ) <span className="text-red-500">*</span></label>
              <div className="flex items-center space-x-3">
                <input type="number" placeholder="৳ 0.00" className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all" required />
                <span className="text-gray-500 font-medium">Per Month (মাসিক) / Per Day (দৈনিক)</span>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end space-x-3">
            <Link href="/salary" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Cancel (বাতিল)
            </Link>
            <button type="button" className="flex items-center space-x-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm">
              <Save size={20} />
              <span>Save Employee (সেভ করুন)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
