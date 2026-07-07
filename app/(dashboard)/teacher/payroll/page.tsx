'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { payrollRecords } from '@/lib/mock-data';
import type { PayrollRecord } from '@/lib/mock-data';
import { IndianRupee, TrendingUp, FileText, Download, Eye } from 'lucide-react';

const statusConfig = {
  paid: { variant: 'success' as const },
  pending: { variant: 'warning' as const },
  processing: { variant: 'info' as const },
};

export default function PayrollPage() {
  const [slipRecord, setSlipRecord] = useState<PayrollRecord | null>(null);

  const latestPaid = payrollRecords.filter(r => r.status === 'paid').at(-1);
  const totalEarned = payrollRecords.filter(r => r.status === 'paid').reduce((a, r) => a + r.netSalary, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><IndianRupee className="h-6 w-6 text-teal-600" />My Payroll</h1>
        <p className="text-gray-500 text-sm mt-0.5">Salary slips and payroll history</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-teal-500 to-teal-700 text-white border-0">
          <CardContent className="p-5">
            <p className="text-teal-100 text-xs font-medium uppercase tracking-wide">Last Paid Salary</p>
            <p className="text-3xl font-bold mt-1">₹{(latestPaid?.netSalary || 0).toLocaleString('en-IN')}</p>
            <p className="text-teal-200 text-xs mt-1">{latestPaid?.month} {latestPaid?.year}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Total Earned (2026)</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">₹{totalEarned.toLocaleString('en-IN')}</p>
            <p className="text-green-500 text-xs mt-1 flex items-center gap-1"><TrendingUp className="h-3 w-3" />All payments received</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Basic Salary</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">₹{(latestPaid?.basicSalary || 0).toLocaleString('en-IN')}</p>
            <p className="text-gray-400 text-xs mt-1">Per month</p>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Table */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4 text-teal-600" />Salary History</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Month', 'Basic', 'HRA', 'DA', 'Allowances', 'Deductions', 'Net Salary', 'Status', 'Slip'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payrollRecords.map(r => {
                  const totalDeductions = r.pf + r.tds + r.otherDeductions;
                  const totalAllowances = r.hra + r.da + r.otherAllowances;
                  return (
                    <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{r.month} {r.year}</p>
                        {r.paidOn && <p className="text-xs text-gray-400">Paid: {r.paidOn}</p>}
                      </td>
                      <td className="px-4 py-3 text-gray-700">₹{r.basicSalary.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-gray-700">₹{r.hra.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-gray-700">₹{r.da.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-green-600 font-medium">+₹{totalAllowances.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-red-500 font-medium">-₹{totalDeductions.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 font-bold text-teal-700">₹{r.netSalary.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3"><Badge variant={statusConfig[r.status].variant}>{r.status}</Badge></td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="outline" onClick={() => setSlipRecord(r)} className="flex items-center gap-1 text-xs">
                          <Eye className="h-3 w-3" />View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Salary Slip Dialog */}
      <Dialog open={!!slipRecord} onOpenChange={() => setSlipRecord(null)}>
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-teal-600" />Salary Slip</DialogTitle>
          </DialogHeader>
          {slipRecord && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl p-4 text-center">
                <p className="font-bold text-lg">BUILDROONIX</p>
                <p className="text-teal-200 text-xs">Salary Slip — {slipRecord.month} {slipRecord.year}</p>
                <p className="text-teal-200 text-xs mt-0.5">Slip No: {slipRecord.slipNo}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div><p className="text-xs text-gray-400">Employee</p><p className="font-semibold">Pawan Kumar Dubey</p></div>
                  <div><p className="text-xs text-gray-400">Designation</p><p className="font-semibold">Teacher</p></div>
                  <div><p className="text-xs text-gray-400">Department</p><p className="font-semibold">IOT & Electronics</p></div>
                  <div><p className="text-xs text-gray-400">Pay Period</p><p className="font-semibold">{slipRecord.month} {slipRecord.year}</p></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-green-700 mb-2 uppercase">Earnings</p>
                  {[
                    { label: 'Basic Salary', value: slipRecord.basicSalary },
                    { label: 'HRA', value: slipRecord.hra },
                    { label: 'DA', value: slipRecord.da },
                    { label: 'Other Allowances', value: slipRecord.otherAllowances },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between text-xs py-0.5">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="font-medium">₹{item.value.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  <div className="border-t border-green-200 mt-2 pt-2 flex justify-between text-xs font-bold text-green-700">
                    <span>Gross</span>
                    <span>₹{(slipRecord.basicSalary + slipRecord.hra + slipRecord.da + slipRecord.otherAllowances).toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div className="bg-red-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-red-600 mb-2 uppercase">Deductions</p>
                  {[
                    { label: 'PF', value: slipRecord.pf },
                    { label: 'TDS', value: slipRecord.tds },
                    { label: 'Other', value: slipRecord.otherDeductions },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between text-xs py-0.5">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="font-medium">₹{item.value.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  <div className="border-t border-red-200 mt-2 pt-2 flex justify-between text-xs font-bold text-red-600">
                    <span>Total</span>
                    <span>₹{(slipRecord.pf + slipRecord.tds + slipRecord.otherDeductions).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
              <div className="bg-teal-600 text-white rounded-xl p-4 flex items-center justify-between">
                <span className="font-bold text-lg">Net Salary</span>
                <span className="font-bold text-2xl">₹{slipRecord.netSalary.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSlipRecord(null)}>Close</Button>
            <Button className="flex items-center gap-2"><Download className="h-4 w-4" />Download PDF</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
