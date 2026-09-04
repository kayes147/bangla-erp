import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-full min-h-[60vh] flex flex-col justify-start space-y-6 animate-in fade-in duration-150">
      {/* Centered Loading Indicator Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center max-w-sm mx-auto my-6">
        <div className="relative mb-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={28} />
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-ping opacity-25" />
        </div>
        <h3 className="text-base font-bold text-gray-800">লোড হচ্ছে...</h3>
        <p className="text-xs text-gray-400 mt-1">
          অনুগ্রহ করে অপেক্ষা করুন, তথ্য প্রস্তুত করা হচ্ছে
        </p>
      </div>

      {/* Modern Pulse Skeleton Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-pulse">
        <div className="h-28 bg-white/80 rounded-2xl border border-gray-100 p-4 flex flex-col justify-between">
          <div className="h-4 bg-gray-200/80 rounded-md w-1/2"></div>
          <div className="h-7 bg-gray-200 rounded-md w-3/4"></div>
          <div className="h-3 bg-gray-100 rounded-md w-1/3"></div>
        </div>
        <div className="h-28 bg-white/80 rounded-2xl border border-gray-100 p-4 flex flex-col justify-between">
          <div className="h-4 bg-gray-200/80 rounded-md w-1/2"></div>
          <div className="h-7 bg-gray-200 rounded-md w-3/4"></div>
          <div className="h-3 bg-gray-100 rounded-md w-1/3"></div>
        </div>
        <div className="h-28 bg-white/80 rounded-2xl border border-gray-100 p-4 flex flex-col justify-between">
          <div className="h-4 bg-gray-200/80 rounded-md w-1/2"></div>
          <div className="h-7 bg-gray-200 rounded-md w-3/4"></div>
          <div className="h-3 bg-gray-100 rounded-md w-1/3"></div>
        </div>
      </div>

      {/* Skeleton Table / Content Block */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4 shadow-sm animate-pulse">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="h-5 bg-gray-200 rounded-md w-1/4"></div>
          <div className="h-8 bg-gray-100 rounded-lg w-24"></div>
        </div>
        <div className="space-y-3 pt-2">
          <div className="h-10 bg-gray-100/80 rounded-xl w-full"></div>
          <div className="h-10 bg-gray-100/60 rounded-xl w-full"></div>
          <div className="h-10 bg-gray-100/40 rounded-xl w-full"></div>
        </div>
      </div>
    </div>
  );
}
