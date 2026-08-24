import { PackageMinus, Send } from "lucide-react";
import Link from "next/link";

export default function ClientProductOutRequest() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-8">
      <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
        
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
            <PackageMinus size={32} />
          </div>
          <h1 className="text-2xl font-bold">প্রোডাক্ট পাঠানোর ফর্ম <span className="text-lg font-normal opacity-80">(Product Out Form)</span></h1>
          <p className="text-blue-100 text-sm mt-1">কোম্পানির কাছে প্রোডাক্ট পাঠানোর রিকোয়েস্ট করুন <span className="opacity-70">(Send a product stock request to the company owner)</span>.</p>
        </div>

        <div className="p-8">
          <form className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">লগইন করা আছে <span className="text-[10px] uppercase">(Logged in as)</span>:</p>
                <p className="font-bold text-blue-900">Karim Traders <span className="text-xs font-normal opacity-80">(Supplier)</span></p>
              </div>
              <Link href="/login" className="text-sm font-medium text-blue-600 hover:underline">লগআউট <span className="text-[10px] font-normal">(Logout)</span></Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">কোন প্রোডাক্ট পাঠাচ্ছেন? <span className="text-[10px] font-normal text-gray-400 uppercase">(Select Product)</span></label>
                <select className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium">
                  <option>Radhuni Masala 500g</option>
                  <option>Pran Mustard Oil 1L</option>
                  <option>Fresh Atta 2kg</option>
                  <option>অন্যান্য (Other - Write Below)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">পরিমাণ <span className="text-[10px] font-normal text-gray-400 uppercase">(Quantity)</span> <span className="text-red-500">*</span></label>
                <input type="number" placeholder="e.g. 50" className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">একক <span className="text-[10px] font-normal text-gray-400 uppercase">(Unit Type)</span></label>
                <select className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
                  <option>পিস (Pieces)</option>
                  <option>বক্স (Box)</option>
                  <option>কেজি (Kg)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">প্রস্তাবিত দাম <span className="text-[10px] font-normal text-gray-400 uppercase">(Proposed Price)</span></label>
                <p className="text-xs text-gray-400 mb-2">ফাঁকা রাখলে কোম্পানি ওনার দাম নির্ধারণ করবেন (If you leave this blank, the company owner will set the price).</p>
                <input type="number" placeholder="মোট টাকা (Total Amount ৳)" className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">নোট <span className="text-[10px] font-normal text-gray-400 uppercase">(Additional Notes)</span></label>
                <textarea rows={3} placeholder="ওনারের জন্য কোনো মেসেজ... (Any message for the owner...)" className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
            </div>

            <button type="button" className="w-full flex justify-center items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg font-bold text-lg transition-colors shadow-md">
              <Send size={20} />
              <span>অনুরোধ পাঠান <span className="text-sm font-normal opacity-80">(Send Request)</span></span>
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
}
