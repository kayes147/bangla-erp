import { FileArchive, Upload, FileText } from "lucide-react";

export default function HRDocuments() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <FileArchive size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">HR Documents (নথিপত্র)</h1>
        </div>
        <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
          <Upload size={18} />
          <span>Upload Document</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-300 transition-colors cursor-pointer flex flex-col items-center justify-center text-center space-y-2 h-40">
          <FileText size={32} className="text-gray-400" />
          <h3 className="font-semibold text-gray-800">Offer Letter Format.pdf</h3>
          <p className="text-xs text-gray-500">120 KB • Uploaded 2 days ago</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-300 transition-colors cursor-pointer flex flex-col items-center justify-center text-center space-y-2 h-40">
          <FileText size={32} className="text-gray-400" />
          <h3 className="font-semibold text-gray-800">Company Policies.pdf</h3>
          <p className="text-xs text-gray-500">1.2 MB • Uploaded 1 week ago</p>
        </div>
        <div className="bg-gray-50 p-5 rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors cursor-pointer flex flex-col items-center justify-center text-center space-y-2 h-40">
          <Upload size={32} className="text-indigo-400" />
          <h3 className="font-semibold text-indigo-600">Drag & Drop new files</h3>
        </div>
      </div>
    </div>
  );
}
