'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, Users, BookOpen } from 'lucide-react';

const weeklyAttendance = [
  { day: 'Mon', present: 220, absent: 28 }, { day: 'Tue', present: 215, absent: 33 },
  { day: 'Wed', present: 230, absent: 18 }, { day: 'Thu', present: 210, absent: 38 }, { day: 'Fri', present: 225, absent: 23 },
];
const monthlyTrend = [
  { month: 'Apr', students: 230 }, { month: 'May', students: 238 }, { month: 'Jun', students: 244 }, { month: 'Jul', students: 248 },
];
const subjectPerf = [
  { name: 'IOT101', avg: 78 }, { name: 'CS101', avg: 82 }, { name: 'MATH101', avg: 71 }, { name: 'PHY101', avg: 85 },
];

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><BarChart3 className="h-6 w-6 text-teal-600" />Reports & Analytics</h1>
        <p className="text-gray-500 text-sm mt-0.5">Platform-wide statistics and insights</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4 w-4 text-teal-600" />Weekly Attendance</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyAttendance} barSize={20}>
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
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-indigo-600" />Student Growth</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} name="Students" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><BookOpen className="h-4 w-4 text-amber-500" />Subject Performance (Avg %)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={subjectPerf} barSize={30} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={60} />
                <Tooltip />
                <Bar dataKey="avg" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Avg Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4 text-purple-500" />User Summary</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4 pt-2">
              {[{ label: 'Total Students', value: 248, color: 'bg-teal-500', pct: 90 }, { label: 'Total Teachers', value: 18, color: 'bg-indigo-500', pct: 7 }, { label: 'Admins', value: 3, color: 'bg-amber-500', pct: 1 }].map(r => (
                <div key={r.label}>
                  <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">{r.label}</span><span className="font-semibold text-gray-900">{r.value}</span></div>
                  <div className="h-2 bg-gray-100 rounded-full"><div className={`h-2 rounded-full ${r.color}`} style={{ width: `${r.pct}%` }} /></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
