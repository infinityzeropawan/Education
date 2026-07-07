'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { syllabusUnits } from '@/lib/mock-data';
import type { SyllabusUnit } from '@/lib/mock-data';
import { BookOpen, Plus, CheckCircle, Clock, Circle } from 'lucide-react';

const statusConfig = {
  completed: { label: 'Completed', variant: 'success' as const, icon: CheckCircle, color: 'text-green-600' },
  in_progress: { label: 'In Progress', variant: 'warning' as const, icon: Clock, color: 'text-amber-600' },
  pending: { label: 'Pending', variant: 'default' as const, icon: Circle, color: 'text-gray-400' },
};

export default function SyllabusPage() {
  const [units, setUnits] = useState<SyllabusUnit[]>(syllabusUnits);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ subject: '', subjectCode: '', unitTitle: '', topics: '', totalHours: '', completedHours: '', status: 'pending' as SyllabusUnit['status'] });

  const subjects = [...new Set(units.map(u => u.subject))];

  const handleSave = () => {
    if (!form.subject || !form.unitTitle) return;
    if (editId) {
      setUnits(prev => prev.map(u => u.id === editId ? {
        ...u, subject: form.subject, subjectCode: form.subjectCode, unitTitle: form.unitTitle,
        topics: form.topics.split(',').map(t => t.trim()).filter(Boolean),
        totalHours: Number(form.totalHours) || 0, completedHours: Number(form.completedHours) || 0, status: form.status,
      } : u));
    } else {
      const maxUnit = Math.max(0, ...units.filter(u => u.subject === form.subject).map(u => u.unitNo));
      setUnits(prev => [...prev, {
        id: `syl-${Date.now()}`, subject: form.subject, subjectCode: form.subjectCode,
        unitNo: maxUnit + 1, unitTitle: form.unitTitle,
        topics: form.topics.split(',').map(t => t.trim()).filter(Boolean),
        totalHours: Number(form.totalHours) || 0, completedHours: Number(form.completedHours) || 0, status: form.status,
      }]);
    }
    setOpen(false); setEditId(null);
    setForm({ subject: '', subjectCode: '', unitTitle: '', topics: '', totalHours: '', completedHours: '', status: 'pending' });
  };

  const openEdit = (u: SyllabusUnit) => {
    setEditId(u.id);
    setForm({ subject: u.subject, subjectCode: u.subjectCode, unitTitle: u.unitTitle, topics: u.topics.join(', '), totalHours: String(u.totalHours), completedHours: String(u.completedHours), status: u.status });
    setOpen(true);
  };

  const updateStatus = (id: string, status: SyllabusUnit['status']) => {
    setUnits(prev => prev.map(u => u.id === id ? { ...u, status, completedHours: status === 'completed' ? u.totalHours : u.completedHours } : u));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><BookOpen className="h-6 w-6 text-teal-600" />Syllabus Tracker</h1>
          <p className="text-gray-500 text-sm mt-0.5">Track unit-wise syllabus completion</p>
        </div>
        <Button onClick={() => { setEditId(null); setOpen(true); }} className="flex items-center gap-2"><Plus className="h-4 w-4" />Add Unit</Button>
      </div>

      {subjects.map(subject => {
        const subjectUnits = units.filter(u => u.subject === subject);
        const totalHrs = subjectUnits.reduce((a, u) => a + u.totalHours, 0);
        const doneHrs = subjectUnits.reduce((a, u) => a + u.completedHours, 0);
        const pct = totalHrs > 0 ? Math.round((doneHrs / totalHrs) * 100) : 0;

        return (
          <Card key={subject}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-teal-600" />{subject}
                  <span className="text-xs text-gray-400 font-normal">({subjectUnits[0]?.subjectCode})</span>
                </CardTitle>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">{doneHrs}/{totalHrs} hrs</span>
                  <div className="flex items-center gap-2 w-32">
                    <Progress value={pct} max={100} className="flex-1 h-2" color={pct === 100 ? 'bg-green-500' : 'bg-teal-500'} />
                    <span className="text-xs font-bold text-teal-700">{pct}%</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {subjectUnits.map(unit => {
                  const cfg = statusConfig[unit.status];
                  const unitPct = unit.totalHours > 0 ? Math.round((unit.completedHours / unit.totalHours) * 100) : 0;
                  return (
                    <div key={unit.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Unit {unit.unitNo}</span>
                            <p className="text-sm font-semibold text-gray-900">{unit.unitTitle}</p>
                            <Badge variant={cfg.variant}>{cfg.label}</Badge>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {unit.topics.map(t => (
                              <span key={t} className="text-xs bg-teal-50 text-teal-700 border border-teal-100 px-2 py-0.5 rounded-full">{t}</span>
                            ))}
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-gray-400">{unit.completedHours}/{unit.totalHours} hrs</span>
                            <div className="flex items-center gap-1.5 w-24">
                              <Progress value={unitPct} max={100} className="flex-1 h-1.5" color={unitPct === 100 ? 'bg-green-500' : 'bg-teal-500'} />
                              <span className="text-xs text-gray-500">{unitPct}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {unit.status !== 'completed' && (
                            <Button size="sm" variant="outline" onClick={() => updateStatus(unit.id, unit.status === 'pending' ? 'in_progress' : 'completed')} className="text-xs">
                              {unit.status === 'pending' ? 'Start' : 'Mark Done'}
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => openEdit(unit)} className="text-xs">Edit</Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Dialog open={open} onOpenChange={v => { setOpen(v); if (!v) setEditId(null); }}>
        <DialogContent className="w-full max-w-lg">
          <DialogHeader><DialogTitle>{editId ? 'Edit Unit' : 'Add Syllabus Unit'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Subject *</label><Input placeholder="IOT & Embedded Systems" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} /></div>
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Subject Code</label><Input placeholder="IOT101" value={form.subjectCode} onChange={e => setForm(p => ({ ...p, subjectCode: e.target.value }))} /></div>
            </div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Unit Title *</label><Input placeholder="Introduction to IoT" value={form.unitTitle} onChange={e => setForm(p => ({ ...p, unitTitle: e.target.value }))} /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Topics (comma separated)</label><Input placeholder="Sensors, Arduino, MQTT" value={form.topics} onChange={e => setForm(p => ({ ...p, topics: e.target.value }))} /></div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Total Hours</label><Input type="number" placeholder="10" value={form.totalHours} onChange={e => setForm(p => ({ ...p, totalHours: e.target.value }))} /></div>
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Done Hours</label><Input type="number" placeholder="0" value={form.completedHours} onChange={e => setForm(p => ({ ...p, completedHours: e.target.value }))} /></div>
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Status</label>
                <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v as SyllabusUnit['status'] }))}>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setOpen(false); setEditId(null); }}>Cancel</Button>
            <Button onClick={handleSave}>{editId ? 'Update' : 'Add Unit'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
