'use client';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { adminStats, notices, enrollmentRequests, feeCollections, teacherPayrolls } from '@/lib/mock-data';
import {
  Users, GraduationCap, BookOpen, UserPlus, CheckCircle, XCircle,
  Calendar, Bell, IndianRupee, TrendingUp, AlertCircle, Shield, Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const attendanceData = [
  { day: 'Mon', present: 220, absent: 28 }, { day: 'Tue', present: 215, absent: 33 },
  { day: 'Wed', present: 230, absent: 18 }, { day: 'Thu', present: 210, absent: 38 }, { day: 'Fri', present: 225, absent: 23 },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const feePending = feeCollections.filter(f => f.status !== 'paid').length;
  const feeCollected = feeCollections.filter(f => f.status === 'paid').reduce((a, f) => a + f.amount, 0);
  const payrollPending = teacherPayrolls.filter(p => p.status !== 'paid' && p.month === 'July').length;

  const stats = [
    { label: 'Total Students', value: adminStats.totalStudents, icon: GraduationCap, color: 'text-teal-600', bg: 'bg-teal-50', sub: '+12 this month' },
    { label: 'Total Teachers', value: adminStats.totalTeachers, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50', sub: '3 subjects' },
    { label: 'Active Classes', value: adminStats.totalClasses, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', sub: 'All active' },
    { label: 'Pending Enrollments', value: adminStats.activeEnrollments, icon: UserPlus, color: 'text-amber-600', bg: 'bg-amber-50', sub: 'Needs review' },
    { label: 'Present Today', value: adminStats.presentToday, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', sub: `${Math.round((adminStats.presentToday / (adminStats.presentToday + adminStats.absentToday)) * 100)}% rate` },
    { label: 'Absent Today', value: adminStats.absentToday, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', sub: 'Follow up needed' },
    { label: 'Fee Collected', value: `₹${feeCollected.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-green-600', bg: 'bg-green-50', sub: `${feePending} pending` },
    { label: 'Payroll Pending', value: payrollPending, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50', sub: 'July 2026' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-gray-500 text-sm mt-0.5 flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{today}</p>
        </div>
        <Badge variant="default" className="self-start sm:self-auto flex items-center gap-1">
          <Shield className="h-3 w-3" />Institution Admin
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-500 leading-tight">{s.label}</p>
                <div className={`p-1.5 rounded-lg ${s.bg}`}><s.icon className={`h-4 w-4 ${s.color}`} /></div>
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Attendance Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">Today's Attendance</p>
            <span className="text-xs text-gray-400">{adminStats.presentToday + adminStats.absentToday} Total</span>
          </div>
          <div className="flex items-center gap-3">
            <Progress value={adminStats.presentToday} max={adminStats.presentToday + adminStats.absentToday} className="flex-1 h-3" color="bg-teal-500" />
            <span className="text-sm font-medium text-teal-600">{Math.round((adminStats.presentToday / (adminStats.presentToday + adminStats.absentToday)) * 100)}%</span>
          </div>
          <div className="flex gap-4 mt-2">
            <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle className="h-3 w-3" />{adminStats.presentToday} Present</span>
            <span className="text-xs text-red-500 flex items-center gap-1"><XCircle className="h-3 w-3" />{adminStats.absentToday} Absent</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-teal-600" />Weekly Attendance</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={attendanceData} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="present" fill="#0d9488" radius={[4, 4, 0, 0]} name="Present" />
                <Bar dataKey="absent" fill="#f87171" radius={[4, 4, 0, 0]} name="Absent" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Fee Summary */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><IndianRupee className="h-4 w-4 text-green-600" />Fee Collection Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Collected', value: feeCollections.filter(f => f.status === 'paid').length, total: feeCollections.length, color: 'bg-green-500', amount: feeCollected },
              { label: 'Pending', value: feeCollections.filter(f => f.status === 'pending').length, total: feeCollections.length, color: 'bg-amber-400', amount: feeCollections.filter(f => f.status === 'pending').reduce((a, f) => a + f.amount, 0) },
              { label: 'Overdue', value: feeCollections.filter(f => f.status === 'overdue').length, total: feeCollections.length, color: 'bg-red-500', amount: feeCollections.filter(f => f.status === 'overdue').reduce((a, f) => a + f.amount, 0) },
            ].map(r => (
              <div key={r.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{r.label} ({r.value}/{r.total})</span>
                  <span className="font-semibold text-gray-900">₹{r.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className={`h-2 rounded-full ${r.color}`} style={{ width: `${(r.value / r.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Requests */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><UserPlus className="h-4 w-4 text-amber-500" />Pending Enrollments</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {enrollmentRequests.filter(r => r.status === 'pending').map(r => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">{r.studentName}</p>
                  <p className="text-xs text-gray-400">{r.email} · {r.class}</p>
                </div>
                <Badge variant="warning">Pending</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Notices */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4 text-amber-500" />Recent Notices</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {notices.slice(0, 3).map(n => (
              <div key={n.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-sm font-medium text-gray-900">{n.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{n.date} · {n.author}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
