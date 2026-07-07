'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { enrollmentRequests } from '@/lib/mock-data';
import type { EnrollmentRequest } from '@/lib/mock-data';
import { UserPlus, Check, X, Clock } from 'lucide-react';

export default function EnrollmentPage() {
  const [requests, setRequests] = useState<EnrollmentRequest[]>(enrollmentRequests);

  const update = (id: string, status: EnrollmentRequest['status']) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const statusColor: Record<string, 'success' | 'danger' | 'warning'> = { approved: 'success', rejected: 'danger', pending: 'warning' };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><UserPlus className="h-6 w-6 text-teal-600" />Enrollment Requests</h1>
        <p className="text-gray-500 text-sm mt-0.5">Review and manage student enrollment applications</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending', value: requests.filter(r => r.status === 'pending').length, color: 'text-amber-600', icon: Clock },
          { label: 'Approved', value: requests.filter(r => r.status === 'approved').length, color: 'text-green-600', icon: Check },
          { label: 'Rejected', value: requests.filter(r => r.status === 'rejected').length, color: 'text-red-500', icon: X },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center"><s.icon className={`h-5 w-5 ${s.color}`} /></div>
            <div><p className={`text-2xl font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-gray-500">{s.label}</p></div>
          </CardContent></Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Student', 'Email', 'Class', 'Applied On', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{r.studentName}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{r.email}</td>
                  <td className="px-4 py-3"><Badge variant="info">{r.class}</Badge></td>
                  <td className="px-4 py-3 text-gray-500">{r.date}</td>
                  <td className="px-4 py-3"><Badge variant={statusColor[r.status]}>{r.status}</Badge></td>
                  <td className="px-4 py-3">
                    {r.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="success" onClick={() => update(r.id, 'approved')} className="flex items-center gap-1"><Check className="h-3 w-3" />Approve</Button>
                        <Button size="sm" variant="destructive" onClick={() => update(r.id, 'rejected')} className="flex items-center gap-1"><X className="h-3 w-3" />Reject</Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
