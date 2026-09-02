"use client";
import { useState } from "react";
import { CheckCircle2, XCircle, Clock, Package, Receipt, Wallet, Loader2, AlertTriangle, FileEdit } from "lucide-react";
import { approveInvoice, rejectInvoice, approveExpense, rejectExpense, approveTransaction, rejectTransaction } from "@/actions/approvalActions";
import { handleCorrectionDecision } from "@/actions/correctionActions";

interface CorrectionItem {
  id: string;
  requesterId: string;
  responderId: string;
  targetType: string;
  targetId: string;
  details: string;
  status: string;
  createdAt: Date | string;
}

export default function ApprovalsClient({ 
  invoices, 
  expenses, 
  transactions,
  corrections = []
}: { 
  invoices: any[], 
  expenses: any[], 
  transactions: any[],
  corrections?: CorrectionItem[]
}) {
  const [activeTab, setActiveTab] = useState<"pending" | "corrections">("pending");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const totalPending = invoices.length + expenses.length + transactions.length;
  const pendingCorrections = corrections.filter(c => c.status === "PENDING");

  const handleApprove = async (id: string, type: 'invoice' | 'expense' | 'transaction') => {
    setProcessingId(id);
    let res;
    if (type === 'invoice') res = await approveInvoice(id);
    else if (type === 'expense') res = await approveExpense(id);
    else res = await approveTransaction(id);
    
    setProcessingId(null);
    if (!res.success) alert("Error: " + res.error);
  };

  const handleReject = async (id: string, type: 'invoice' | 'expense' | 'transaction') => {
    if (!confirm("Are you sure you want to reject this request?")) return;
    
    setProcessingId(id);
    let res;
    if (type === 'invoice') res = await rejectInvoice(id);
    else if (type === 'expense') res = await rejectExpense(id);
    else res = await rejectTransaction(id);
    
    setProcessingId(null);
    if (!res.success) alert("Error: " + res.error);
  };

  const handleCorrectionAction = async (id: string, decision: "APPROVED" | "REJECTED") => {
    if (decision === "REJECTED" && !confirm("সংশোধন রিকোয়েস্ট বাতিল করতে চান?")) return;
    
    setProcessingId(id);
    const res = await handleCorrectionDecision(id, decision);
    setProcessingId(null);
    if (!res.success) {
      alert("Error: " + res.error);
    } else {
      alert(`রিকোয়েস্ট ${decision === "APPROVED" ? "অনুমোদিত" : "বাতিল"} হয়েছে!`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            অ্যাপ্রুভাল ও সংশোধন বোর্ড <span className="text-sm font-normal text-gray-500">(Approvals & Corrections)</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Review pending operations and error correction requests.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === "pending" ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            নতুন কাজ ({totalPending})
          </button>
          <button 
            onClick={() => setActiveTab("corrections")}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === "corrections" ? "bg-white text-amber-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            ভুল সংশোধন ({pendingCorrections.length})
          </button>
        </div>
      </div>

      {activeTab === "pending" ? (
        <div className="space-y-4">
          {totalPending === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500 font-medium">
              <CheckCircle2 size={48} className="mx-auto text-green-300 mb-3" />
              <p>কোনো রিকোয়েস্ট পেন্ডিং নেই। (No pending requests found.)</p>
            </div>
          )}

          {/* Expenses */}
          {expenses.map((expense) => (
            <div key={expense.id} className="bg-white p-5 rounded-xl shadow-sm border border-orange-200 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-orange-500">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="flex items-center px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-bold"><Receipt size={12} className="mr-1"/> Expense Request</span>
                  <span className="text-xs text-gray-500 flex items-center font-bold"><Clock size={12} className="mr-1"/> {new Date(expense.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg">খরচ: ৳ {expense.amount.toLocaleString()}</h3>
                <p className="text-sm text-gray-600 font-medium">Requested by: <span className="font-bold">{expense.requestedBy || 'Unknown'}</span></p>
                <p className="text-sm text-gray-500 mt-1"><span className="font-bold">Reason:</span> {expense.description}</p>
                <p className="text-xs text-gray-400 mt-1 font-bold">Category: {expense.category?.name || 'N/A'}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={() => handleReject(expense.id, 'expense')} disabled={processingId === expense.id} className="flex items-center space-x-1 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-bold text-sm transition-colors disabled:opacity-50">
                  <XCircle size={18}/> <span>Reject</span>
                </button>
                <button onClick={() => handleApprove(expense.id, 'expense')} disabled={processingId === expense.id} className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-bold text-sm transition-colors shadow-sm disabled:opacity-50">
                  {processingId === expense.id ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18}/>}
                  <span>Approve</span>
                </button>
              </div>
            </div>
          ))}

          {/* Invoices */}
          {invoices.map((invoice) => (
            <div key={invoice.id} className="bg-white p-5 rounded-xl shadow-sm border border-blue-200 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-blue-500">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="flex items-center px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-bold"><Package size={12} className="mr-1"/> {invoice.type === 'product_in' ? 'Product In' : 'Product Out'}</span>
                  <span className="text-xs text-gray-500 flex items-center font-bold"><Clock size={12} className="mr-1"/> {new Date(invoice.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg">
                  {invoice.type === 'product_in' ? 'Buy Request: ' : 'Sell Request: '}
                  {invoice.items.reduce((acc: number, curr: any) => acc + curr.quantity, 0)} Pcs
                </h3>
                <p className="text-sm text-gray-600 font-medium">Requested by: <span className="font-bold">{invoice.requestedBy || 'Unknown'}</span></p>
                <p className="text-sm text-gray-500 mt-1"><span className="font-bold">Client:</span> {invoice.client.name}</p>
                <p className="text-sm text-gray-500"><span className="font-bold">Total:</span> ৳ {invoice.totalAmount.toLocaleString()} | <span className="font-bold">Paid:</span> ৳ {invoice.paidAmount.toLocaleString()}</p>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {invoice.items.map((item: any, idx: number) => (
                    <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-bold border border-gray-200">
                      {item.product.name} (x{item.quantity})
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                <button onClick={() => handleReject(invoice.id, 'invoice')} disabled={processingId === invoice.id} className="flex items-center space-x-1 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-bold text-sm transition-colors disabled:opacity-50">
                  <XCircle size={18}/> <span>Reject</span>
                </button>
                <button onClick={() => handleApprove(invoice.id, 'invoice')} disabled={processingId === invoice.id} className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-bold text-sm transition-colors shadow-sm disabled:opacity-50">
                  {processingId === invoice.id ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18}/>}
                  <span>Approve</span>
                </button>
              </div>
            </div>
          ))}

          {/* Transactions */}
          {transactions.map((transaction) => (
            <div key={transaction.id} className="bg-white p-5 rounded-xl shadow-sm border border-purple-200 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-purple-500">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="flex items-center px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-bold"><Wallet size={12} className="mr-1"/> Main Cash ({transaction.type === 'in' ? 'IN' : 'OUT'})</span>
                  <span className="text-xs text-gray-500 flex items-center font-bold"><Clock size={12} className="mr-1"/> {new Date(transaction.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg">Amount: ৳ {transaction.amount.toLocaleString()}</h3>
                <p className="text-sm text-gray-600 font-medium">Requested by: <span className="font-bold">{transaction.requestedBy || 'Unknown'}</span></p>
                <p className="text-sm text-gray-500 mt-1"><span className="font-bold">Description:</span> {transaction.description}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={() => handleReject(transaction.id, 'transaction')} disabled={processingId === transaction.id} className="flex items-center space-x-1 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-bold text-sm transition-colors disabled:opacity-50">
                  <XCircle size={18}/> <span>Reject</span>
                </button>
                <button onClick={() => handleApprove(transaction.id, 'transaction')} disabled={processingId === transaction.id} className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-bold text-sm transition-colors shadow-sm disabled:opacity-50">
                  {processingId === transaction.id ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18}/>}
                  <span>Approve</span>
                </button>
              </div>
            </div>
          ))}

        </div>
      ) : (
        /* Correction Requests Tab */
        <div className="space-y-4">
          {pendingCorrections.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500 font-medium">
              <CheckCircle2 size={48} className="mx-auto text-emerald-300 mb-3" />
              <p>কোনো পেন্ডিং ভুল সংশোধন রিকোয়েস্ট নেই। (No pending correction requests.)</p>
            </div>
          )}

          {pendingCorrections.map((corr) => (
            <div key={corr.id} className="bg-white p-5 rounded-xl shadow-sm border border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-amber-500">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="flex items-center px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-xs font-bold">
                    <FileEdit size={12} className="mr-1" /> {corr.targetType} Correction
                  </span>
                  <span className="text-xs text-gray-500 flex items-center font-bold">
                    <Clock size={12} className="mr-1" /> {new Date(corr.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-bold text-gray-800 text-base">
                  Target Record ID: <span className="font-mono text-sm bg-gray-100 px-1.5 py-0.5 rounded">{corr.targetId}</span>
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Requested by: <span className="font-bold text-gray-800 capitalize">{corr.requesterId}</span>
                </p>
                <div className="mt-2 bg-amber-50 border border-amber-100 p-3 rounded-lg text-sm text-amber-950 font-medium">
                  <p className="text-xs font-bold text-amber-800 uppercase mb-0.5">সংশোধনের বিবরণ ও কারণ:</p>
                  {corr.details}
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                <button
                  onClick={() => handleCorrectionAction(corr.id, "REJECTED")}
                  disabled={processingId === corr.id}
                  className="flex items-center space-x-1 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
                >
                  <XCircle size={18} />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => handleCorrectionAction(corr.id, "APPROVED")}
                  disabled={processingId === corr.id}
                  className="flex items-center space-x-1 px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-bold text-sm transition-colors shadow-sm disabled:opacity-50"
                >
                  {processingId === corr.id ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                  <span>Approve</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
