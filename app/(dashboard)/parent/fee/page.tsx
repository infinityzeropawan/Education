'use client';
import { useState } from 'react';
import { feeRecords, studentsList } from '@/lib/mock-data';
import { Dialog, DialogHeader, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CreditCard, CheckCircle, Clock, AlertTriangle, Receipt, X, Printer, IndianRupee } from 'lucide-react';

const METHODS = ['UPI', 'Net Banking', 'Credit Card', 'Debit Card'];

export default function ParentFeePage() {
  const student = studentsList[0];
  const [payDialog, setPayDialog] = useState<typeof feeRecords[0] | null>(null);
  const [receiptDialog, setReceiptDialog] = useState<typeof feeRecords[0] | null>(null);
  const [method, setMethod] = useState(METHODS[0]);
  const [success, setSuccess] = useState(false);
  const [records, setRecords] = useState(feeRecords);

  const paid    = records.filter(f => f.status === 'paid');
  const pending = records.filter(f => f.status !== 'paid');
  const totalPaid = paid.reduce((a, f) => a + f.amount, 0);
  const totalDue  = pending.reduce((a, f) => a + f.amount, 0);

  function handlePay() {
    if (!payDialog) return;
    setSuccess(true);
    setTimeout(() => {
      setRecords(prev => prev.map(f =>
        f.id === payDialog.id
          ? { ...f, status: 'paid' as const, paidDate: new Date().toISOString().slice(0, 10), receiptNo: `RCP-${Date.now()}`, paymentMode: method }
          : f
      ));
      setSuccess(false);
      setPayDialog(null);
    }, 1600);
  }

  const statusBadge = (s: string) =>
    s === 'paid'    ? <Badge variant="success">Paid</Badge>
    : s === 'overdue' ? <Badge variant="danger">Overdue</Badge>
    : <Badge variant="warning">Pending</Badge>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-rose-600" />Fee Management
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">{student.name} · {student.class} · {student.section}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Paid',    value: `₹${totalPaid.toLocaleString()}`,  color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200' },
          { label: 'Total Due',     value: `₹${totalDue.toLocaleString()}`,   color: totalDue > 0 ? 'text-red-600' : 'text-gray-400', bg: totalDue > 0 ? 'bg-red-50' : 'bg-gray-50', border: totalDue > 0 ? 'border-red-200' : 'border-gray-200' },
          { label: 'Paid Records',  value: paid.length,                        color: 'text-teal-600',   bg: 'bg-teal-50',   border: 'border-teal-200' },
          { label: 'Pending',       value: pending.length,                     color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200' },
        ].map((s, i) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 card-hover animate-fade-in-up`} style={{ animationDelay: `${i * 70}ms` }}>
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={`text-xl font-bold ${s.color} mt-1`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Due / Overdue alert */}
      {totalDue > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 animate-slide-right">
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-700">₹{totalDue.toLocaleString()} pending</p>
            <p className="text-xs text-amber-600 mt-0.5">Clear dues on time to avoid late fee charges.</p>
          </div>
        </div>
      )}

      {/* Fee table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up delay-200">
        <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
          <IndianRupee className="h-4 w-4 text-rose-600" />
          <h3 className="text-sm font-semibold text-gray-800">All Fee Records</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {records.map((f, i) => (
            <div key={f.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors animate-fade-in-up" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{f.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Due: {f.dueDate}
                  {f.paidDate && <span className="ml-2 text-green-600">· Paid: {f.paidDate}</span>}
                  {f.paymentMode && <span className="ml-2 text-gray-400">· {f.paymentMode}</span>}
                </p>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <p className="text-sm font-bold text-gray-800">₹{f.amount.toLocaleString()}</p>
                {statusBadge(f.status)}
                {f.status === 'paid' ? (
                  <button onClick={() => setReceiptDialog(f)} className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-teal-50 transition-colors">
                    <Receipt className="h-3.5 w-3.5" />Receipt
                  </button>
                ) : (
                  <button onClick={() => { setPayDialog(f); setSuccess(false); }} className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-medium px-3 py-1.5 rounded-lg transition-colors">
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pay Dialog */}
      <Dialog open={!!payDialog} onOpenChange={() => !success && setPayDialog(null)}>
        <DialogHeader>
          {success ? 'Payment Successful!' : 'Pay Fee'}
        </DialogHeader>
        <DialogBody>
          {success ? (
            <div className="text-center py-6 animate-bounce-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-sm font-semibold text-gray-800">Payment of ₹{payDialog?.amount.toLocaleString()} received!</p>
              <p className="text-xs text-gray-500 mt-1">Receipt will be generated shortly.</p>
            </div>
          ) : payDialog && (
            <div className="space-y-4">
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-900">{payDialog.title}</p>
                <p className="text-2xl font-bold text-rose-600 mt-1">₹{payDialog.amount.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-0.5">Due: {payDialog.dueDate}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">Payment Method</p>
                <div className="grid grid-cols-2 gap-2">
                  {METHODS.map(m => (
                    <button key={m} onClick={() => setMethod(m)}
                      className={`text-sm py-2.5 px-3 rounded-xl border font-medium transition-all ${method === m ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-gray-700 border-gray-200 hover:border-rose-300'}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500">
                <p>Student: <span className="font-semibold text-gray-700">{student.name}</span></p>
                <p className="mt-0.5">Roll No: <span className="font-semibold text-gray-700">{student.rollNo}</span></p>
              </div>
            </div>
          )}
        </DialogBody>
        {!success && (
          <DialogFooter>
            <button onClick={() => setPayDialog(null)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium">Cancel</button>
            <button onClick={handlePay} className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl transition-colors">
              Pay ₹{payDialog?.amount.toLocaleString()}
            </button>
          </DialogFooter>
        )}
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={!!receiptDialog} onOpenChange={() => setReceiptDialog(null)}>
        <DialogHeader>Fee Receipt</DialogHeader>
        <DialogBody>
          {receiptDialog && (
            <div className="space-y-4">
              <div className="text-center border-b border-dashed border-gray-200 pb-4">
                <p className="text-lg font-bold text-gray-900">Buildroonix Institute</p>
                <p className="text-xs text-gray-500">Official Fee Receipt</p>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  ['Receipt No', receiptDialog.receiptNo],
                  ['Student Name', student.name],
                  ['Roll No', student.rollNo],
                  ['Class', `${student.class} · ${student.section}`],
                  ['Fee Type', receiptDialog.title],
                  ['Amount Paid', `₹${receiptDialog.amount.toLocaleString()}`],
                  ['Payment Date', receiptDialog.paidDate],
                  ['Payment Mode', receiptDialog.paymentMode],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1.5 border-b border-gray-50">
                    <span className="text-gray-500">{k}</span>
                    <span className="font-semibold text-gray-900">{v}</span>
                  </div>
                ))}
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <p className="text-xs font-semibold text-green-700">Payment Verified & Confirmed</p>
              </div>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <button onClick={() => setReceiptDialog(null)} className="px-4 py-2 text-sm text-gray-600 font-medium">Close</button>
          <button onClick={() => window.print()} className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors">
            <Printer className="h-4 w-4" />Print Receipt
          </button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
