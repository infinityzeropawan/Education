'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { teacherPayrolls as initialTeacherPayrolls, supportStaffPayrolls as initialSupportPayrolls, supportStaffList } from '@/lib/mock-data';
import { type TeacherPayroll } from '@/lib/mock-data';
import { type StaffPayroll } from '@/lib/types';
import { IndianRupee, CheckCircle, Clock, Users, Filter, CheckCircle2, DollarSign, CreditCard } from 'lucide-react';

export default function AdminPayrollPage() {
  const [payrollType, setPayrollType] = useState<'teacher' | 'support'>('teacher');
  const [monthFilter, setMonthFilter] = useState('July');

  // Teacher states
  const [teacherList, setTeacherList] = useState<TeacherPayroll[]>(initialTeacherPayrolls);
  // Support states
  const [supportList, setSupportList] = useState<StaffPayroll[]>(initialSupportPayrolls);

  // Dialog states for paying salary
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [payMethod, setPayMethod] = useState<'bank_transfer' | 'cash' | 'cheque'>('bank_transfer');

  // Load from local storage on mount
  useEffect(() => {
    const savedTeachers = localStorage.getItem('buildroonix_teacher_payroll');
    if (savedTeachers) setTeacherList(JSON.parse(savedTeachers));
    
    const savedSupport = localStorage.getItem('buildroonix_support_payroll');
    if (savedSupport) setSupportList(JSON.parse(savedSupport));
  }, []);

  const saveToStorage = (type: 'teacher' | 'support', data: any) => {
    if (type === 'teacher') {
      setTeacherList(data);
      localStorage.setItem('buildroonix_teacher_payroll', JSON.stringify(data));
    } else {
      setSupportList(data);
      localStorage.setItem('buildroonix_support_payroll', JSON.stringify(data));
    }
  };

  // Filters
  const filteredTeachers = teacherList.filter(p => p.month === monthFilter);
  const filteredSupport = supportList.filter(p => p.month === monthFilter);

  const activeRecords = payrollType === 'teacher' ? filteredTeachers : filteredSupport;

  // Stats
  const totalPayable = activeRecords.reduce((a, p) => a + p.netSalary, 0);
  const paid = activeRecords.filter(p => p.status === 'paid').reduce((a, p) => a + p.netSalary, 0);
  const pending = activeRecords.filter(p => p.status !== 'paid').reduce((a, p) => a + p.netSalary, 0);

  const triggerPaymentDialog = (record: any) => {
    setSelectedRecord(record);
    setPayMethod('bank_transfer');
    setPayDialogOpen(true);
  };

  const processPayment = () => {
    if (!selectedRecord) return;

    if (payrollType === 'teacher') {
      const updated = teacherList.map(r =>
        r.id === selectedRecord.id
          ? { ...r, status: 'paid' as const, paidOn: new Date().toISOString().split('T')[0] }
          : r
      );
      saveToStorage('teacher', updated);
    } else {
      const updated = supportList.map(r =>
        r.id === selectedRecord.id
          ? { ...r, status: 'paid' as const, paidOn: new Date().toISOString().split('T')[0], paymentMethod: payMethod }
          : r
      );
      saveToStorage('support', updated);
    }

    setPayDialogOpen(false);
    setSelectedRecord(null);
  };

  const markAllPaid = () => {
    if (payrollType === 'teacher') {
      const updated = teacherList.map(r =>
        r.month === monthFilter && r.status !== 'paid'
          ? { ...r, status: 'paid' as const, paidOn: new Date().toISOString().split('T')[0] }
          : r
      );
      saveToStorage('teacher', updated);
    } else {
      const updated = supportList.map(r =>
        r.month === monthFilter && r.status !== 'paid'
          ? { ...r, status: 'paid' as const, paidOn: new Date().toISOString().split('T')[0], paymentMethod: 'bank_transfer' as const }
          : r
      );
      saveToStorage('support', updated);
    }
  };

  const statusConfig = {
    paid: { variant: 'success' as const, label: 'Paid & Settled' },
    pending: { variant: 'warning' as const, label: 'Pending Payout' },
    processing: { variant: 'info' as const, label: 'Processing' },
  };

  const METHOD_LABELS = {
    bank_transfer: 'Bank Transfer',
    cash: 'Cash In Hand',
    cheque: 'Cheque Disbursement'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <IndianRupee className="h-6 w-6 text-teal-600" /> Payroll Disbursements
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Disburse and manage salaries for teachers and supporting staff members.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="July">July 2026</option>
            <option value="June">June 2026</option>
            <option value="May">May 2026</option>
          </select>
          {activeRecords.some(p => p.status !== 'paid') && (
            <Button onClick={markAllPaid} className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1.5 h-8 text-xs font-semibold">
              <CheckCircle className="h-4 w-4" /> Pay All
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setPayrollType('teacher')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${payrollType === 'teacher' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Users className="h-4 w-4" /> Instructors & Teachers
        </button>
        <button
          onClick={() => setPayrollType('support')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${payrollType === 'support' ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <CheckCircle2 className="h-4 w-4" /> Support & Service Staff
        </button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
        <Card className="bg-gradient-to-br from-teal-500 to-teal-700 text-white border-0 shadow-md">
          <CardContent className="p-5">
            <p className="text-teal-100 text-xs font-semibold uppercase tracking-wider">Total Payable</p>
            <p className="text-2xl font-bold mt-1">₹{totalPayable.toLocaleString('en-IN')}</p>
            <p className="text-teal-200 text-[10px] mt-1 font-medium">
              {activeRecords.length} {payrollType === 'teacher' ? 'Teachers' : 'Support Staff'} · {monthFilter}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Disbursed (Paid)</p>
            <p className="text-xl font-bold text-green-600 mt-1">₹{paid.toLocaleString('en-IN')}</p>
            <p className="text-gray-400 text-[10px] mt-1 flex items-center gap-1 font-medium">
              <CheckCircle className="h-3 w-3 text-green-500" />
              {activeRecords.filter(p => p.status === 'paid').length} payments processed
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Outstanding (Pending)</p>
            <p className="text-xl font-bold text-amber-600 mt-1">₹{pending.toLocaleString('en-IN')}</p>
            <p className="text-gray-400 text-[10px] mt-1 flex items-center gap-1 font-medium">
              <Clock className="h-3 w-3 text-amber-500" />
              {activeRecords.filter(p => p.status !== 'paid').length} payouts remaining
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Users className="h-4 w-4 text-teal-600" />
            {payrollType === 'teacher' ? 'Teacher Salaries Register' : 'Support Staff Salaries Register'} — {monthFilter} 2026
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Staff Name</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">{payrollType === 'teacher' ? 'Designation' : 'Staff Role'}</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Basic Pay</th>
                {payrollType === 'support' && (
                  <>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Allowances</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Deductions</th>
                  </>
                )}
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Net Salary</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Payment Status</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Disbursed Details</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {activeRecords.map(p => {
                const conf = statusConfig[p.status] || statusConfig.pending;
                return (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${payrollType === 'teacher' ? 'from-indigo-400 to-indigo-600' : 'from-orange-400 to-orange-600'} flex items-center justify-center text-white text-xs font-bold`}>
                          {(payrollType === 'teacher' ? (p as any).teacherName : (p as any).staffName).split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="font-semibold text-gray-900 text-xs">
                          {payrollType === 'teacher' ? (p as any).teacherName : (p as any).staffName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-600 font-medium">
                      {payrollType === 'teacher' ? (p as any).designation : (p as any).role}
                    </td>
                    <td className="px-4 py-3.5 text-xs font-semibold text-slate-700">₹{p.basicSalary.toLocaleString('en-IN')}</td>
                    {payrollType === 'support' && (
                      <>
                        <td className="px-4 py-3.5 text-xs text-green-600 font-medium">+₹{(p as any).allowances.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3.5 text-xs text-red-500 font-medium">-₹{(p as any).deductions.toLocaleString('en-IN')}</td>
                      </>
                    )}
                    <td className="px-4 py-3.5 text-xs font-bold text-gray-900">₹{p.netSalary.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3.5">
                      <Badge variant={conf.variant} className="text-[9px] uppercase tracking-wider font-bold py-0.5 px-1.5">{conf.label}</Badge>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-500">
                      {p.status === 'paid' ? (
                        <div className="space-y-0.5">
                          <span className="block font-medium">Paid: {p.paidOn}</span>
                          {(p as any).paymentMethod && (
                            <span className="text-[10px] text-gray-400 font-mono">Method: {METHOD_LABELS[(p as any).paymentMethod as keyof typeof METHOD_LABELS] || (p as any).paymentMethod}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {p.status !== 'paid' ? (
                        <Button size="sm" onClick={() => triggerPaymentDialog(p)} className="bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 h-7 text-xs font-semibold">
                          Pay Salary
                        </Button>
                      ) : (
                        <span className="text-xs text-green-600 font-bold flex items-center gap-0.5 justify-end">
                          ✓ Settled
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {activeRecords.length === 0 && (
                <tr>
                  <td colSpan={payrollType === 'support' ? 9 : 7} className="px-4 py-8 text-center text-gray-400 text-xs">
                    No payroll entries found for {monthFilter} 2026.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Pay Salary Dialog */}
      <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-1.5">
              <CreditCard className="h-5 w-5 text-teal-600" />
              Disburse Salary
            </DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4 py-4 text-xs font-semibold text-gray-600">
              <div className="bg-teal-50 border border-teal-100 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Salary Payout To:</span>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">
                    {payrollType === 'teacher' ? selectedRecord.teacherName : selectedRecord.staffName}
                  </p>
                  <p className="text-[10px] text-gray-400">{payrollType === 'teacher' ? selectedRecord.designation : selectedRecord.role}</p>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Net Amount:</span>
                  <p className="text-base font-extrabold text-teal-600 mt-0.5">₹{selectedRecord.netSalary.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-600">Select Disbursement Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full h-10 px-3 border rounded-lg text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="bank_transfer">Direct Bank Transfer (NEFT/IMPS)</option>
                  <option value="cash">Cash In Hand</option>
                  <option value="cheque">Cheque Issuance</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayDialogOpen(false)}>Cancel</Button>
            <Button onClick={processPayment} className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1.5">
              Confirm & Pay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
