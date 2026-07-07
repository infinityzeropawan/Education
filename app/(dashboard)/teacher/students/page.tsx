'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { studentsList } from '@/lib/mock-data';
import { GraduationCap, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Progress } from '@/components/ui/progress';

export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const filtered = studentsList.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><GraduationCap className="h-6 w-6 text-teal-600" />Student Directory</h1>
          <p className="text-gray-500 text-sm mt-0.5">{studentsList.length} students in your class</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
          <Input placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8" />
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Student', 'Roll No', 'Class', 'Email', 'Attendance'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                        {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="font-medium text-gray-900">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{s.rollNo}</td>
                  <td className="px-4 py-3"><Badge variant="info">{s.class}</Badge></td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{s.email}</td>
                  <td className="px-4 py-3 w-32">
                    <div className="flex items-center gap-2">
                      <Progress value={s.attendance} max={100} className="flex-1 h-1.5" color={s.attendance >= 75 ? 'bg-green-500' : 'bg-red-500'} />
                      <span className={`text-xs font-medium ${s.attendance >= 75 ? 'text-green-600' : 'text-red-500'}`}>{s.attendance}%</span>
                    </div>
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
