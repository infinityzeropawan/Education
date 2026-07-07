'use client';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { billingInvoices, platformAnnouncements } from '@/lib/mock-data';
import { DEFAULT_MODULES, INSTITUTION_TYPE_LABELS } from '@/lib/modules';
import {
  Building2, Users, IndianRupee, TrendingUp, Shield, Calendar,
  CheckCircle, AlertCircle, Clock, Megaphone, Globe, Rocket
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const INSTITUTIONS = [
  { name: 'Greenwood High School', type: 'school', plan: 'pro', status: 'active', students: 248, teachers: 18 },
  { name: 'Allen Coaching Center', type: 'coaching', plan: 'enterprise', status: 'active', students: 520, teachers: 32 },
  { name: 'LearnOnline Academy', type: 'online_teaching', plan: 'basic', status: 'trial', students: 85, teachers: 6 },
  { name: 'ABC Engineering College', type: 'college', plan: 'enterprise', status: 'active', students: 1200, teachers: 95 },
  { name: 'Sunrise Tuition Center', type: 'tuition', plan: 'basic', status: 'active', students: 42, teachers: 4 },
];

const revenueData = [
  { month: 'Feb', revenue: 18000 }, { month: 'Mar', revenue: 22000 },
  { month: 'Apr', revenue: 26000 }, { month: 'May', revenue: 24000 },
  { month: 'Jun', revenue: 28996 }, { month: 'Jul', revenue: 16997 },
];

const growthData = [
  { month: 'Feb', institutions: 2 }, { month: 'Mar', institutions: 3 },
  { month: 'Apr', institutions: 4 }, { month: 'May', institutions: 4 },
  { month: 'Jun', institutions: 5 }, { month: 'Jul', institutions: 5 },
];

const planColors: Record<string, string> = { basic: 'bg-gray-100 text-gray-700', pro: 'bg-blue-100 text-blue-700', enterprise: 'bg-purple-100 text-purple-700' };
const statusColors: Record<string, 'success' | 'warning' | 'danger'> = { active: 'success', trial: 'warning', suspended: 'danger' };

export default function SuperadminDashboard() {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const totalRevenue = billingInvoices.filter(i => i.status === 'paid').reduce((a, i) => a + i.amount, 0);
  const pendingRevenue = billingInvoices.filter(i => i.status !== 'paid').reduce((a, i) => a + i.amount, 0);
  const totalStudents = INSTITUTIONS.reduce((a, i) => a + i.students, 0);
  const totalTeachers = INSTITUTIONS.reduce((a, i) => a + i.teachers, 0);

  const stats = [
    { label: 'Total Institutions', value: INSTITUTIONS.length, icon: Building2, color: 'text-teal-600', bg: 'bg-teal-50', sub: `${INSTITUTIONS.filter(i => i.status === 'active').length} active` },
    { label: 'Total Students', value: totalStudents.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', sub: 'Across all institutions' },
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-green-600', bg: 'bg-green-50', sub: 'Collected this cycle' },
    { label: 'Pending Revenue', value: `₹${pendingRevenue.toLocaleString('en-IN')}`, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', sub: `${billingInvoices.filter(i => i.status !== 'paid').length} invoices` },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-gray-500 text-sm mt-0.5 flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{today}</p>
        </div>
        <Badge variant="default" className="self-start sm:self-auto flex items-center gap-1 bg-purple-600 hover:bg-purple-600">
          <Shield className="h-3 w-3" />Super Admin · Buildroonix
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-500">{s.label}</p>
                <div className={`p-1.5 rounded-lg ${s.bg}`}><s.icon className={`h-4 w-4 ${s.color}`} /></div>
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><IndianRupee className="h-4 w-4 text-green-600" />Monthly Revenue (₹)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenueData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: unknown) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-teal-600" />Institution Growth</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="institutions" stroke="#0d9488" strokeWidth={2} dot={{ fill: '#0d9488' }} name="Institutions" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Institutions Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Building2 className="h-4 w-4 text-teal-600" />Institutions Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Institution', 'Type', 'Plan', 'Students', 'Teachers', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INSTITUTIONS.map((inst, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${INSTITUTION_TYPE_LABELS[inst.type as keyof typeof INSTITUTION_TYPE_LABELS].color} flex items-center justify-center`}>
                        <Globe className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">{inst.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs capitalize">{INSTITUTION_TYPE_LABELS[inst.type as keyof typeof INSTITUTION_TYPE_LABELS].label}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${planColors[inst.plan]}`}>{inst.plan}</span></td>
                  <td className="px-4 py-3 font-medium text-gray-900">{inst.students}</td>
                  <td className="px-4 py-3 text-gray-600">{inst.teachers}</td>
                  <td className="px-4 py-3"><Badge variant={statusColors[inst.status]}>{inst.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><IndianRupee className="h-4 w-4 text-amber-500" />Recent Invoices</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {billingInvoices.slice(0, 5).map(inv => (
              <div key={inv.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-900">{inv.institutionName}</p>
                  <p className="text-xs text-gray-400">{inv.plan} · {inv.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">₹{inv.amount.toLocaleString('en-IN')}</p>
                  <Badge variant={inv.status === 'paid' ? 'success' : inv.status === 'overdue' ? 'danger' : 'warning'} className="text-[10px]">{inv.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Platform Announcements */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Megaphone className="h-4 w-4 text-purple-500" />Platform Announcements</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {platformAnnouncements.map(ann => (
              <div key={ann.id} className={`p-3 rounded-xl border ${ann.isActive ? 'bg-purple-50 border-purple-100' : 'bg-gray-50 border-gray-100'}`}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900">{ann.title}</p>
                  <Badge variant={ann.isActive ? 'success' : 'default'} className="text-[10px] flex-shrink-0">{ann.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ann.content}</p>
                <p className="text-xs text-gray-400 mt-1">{ann.createdAt}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
