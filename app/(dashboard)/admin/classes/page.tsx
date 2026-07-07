'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/ui/select';
import { classSections } from '@/lib/mock-data';
import type { ClassSection } from '@/lib/mock-data';
import { Users, Plus, BookOpen, MapPin, Pencil, Trash2 } from 'lucide-react';

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassSection[]>(classSections);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<ClassSection | null>(null);
  const [form, setForm] = useState({ className: '', section: '', classTeacher: '', room: '', totalStudents: '' });

  const openCreate = () => { setEditItem(null); setForm({ className: '', section: '', classTeacher: '', room: '', totalStudents: '' }); setOpen(true); };
  const openEdit = (c: ClassSection) => { setEditItem(c); setForm({ className: c.className, section: c.section, classTeacher: c.classTeacher, room: c.room, totalStudents: String(c.totalStudents) }); setOpen(true); };

  const save = () => {
    if (!form.className || !form.section) return;
    if (editItem) {
      setClasses(p => p.map(c => c.id === editItem.id ? { ...c, ...form, totalStudents: Number(form.totalStudents) || 0 } : c));
    } else {
      setClasses(p => [...p, { id: `cls-${Date.now()}`, ...form, totalStudents: Number(form.totalStudents) || 0, isActive: true }]);
    }
    setOpen(false);
  };

  const toggleActive = (id: string) => setClasses(p => p.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  const remove = (id: string) => setClasses(p => p.filter(c => c.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Users className="h-6 w-6 text-teal-600" />Classes & Sections</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage all classes and their sections</p>
        </div>
        <Button onClick={openCreate} className="flex items-center gap-2"><Plus className="h-4 w-4" />Add Class</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Classes', value: classes.length, color: 'text-teal-600' },
          { label: 'Active', value: classes.filter(c => c.isActive).length, color: 'text-green-600' },
          { label: 'Total Students', value: classes.reduce((a, c) => a + c.totalStudents, 0), color: 'text-blue-600' },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4 text-center"><p className={`text-2xl font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-gray-500 mt-1">{s.label}</p></CardContent></Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map(cls => (
          <Card key={cls.id} className={cls.isActive ? 'border-teal-200' : 'border-gray-200 opacity-60'}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant={cls.isActive ? 'success' : 'default'}>{cls.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>
              </div>
              <p className="font-bold text-gray-900">{cls.className}</p>
              <p className="text-sm text-gray-500">{cls.section} Section</p>
              <div className="mt-3 space-y-1.5 text-xs text-gray-500">
                <p className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5 text-teal-400" />Teacher: {cls.classTeacher}</p>
                <p className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-blue-400" />{cls.totalStudents} Students</p>
                <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-purple-400" />Room: {cls.room}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => openEdit(cls)} className="flex-1 flex items-center justify-center gap-1 text-xs"><Pencil className="h-3 w-3" />Edit</Button>
                <Button size="sm" variant="outline" onClick={() => toggleActive(cls.id)} className="flex-1 text-xs">{cls.isActive ? 'Deactivate' : 'Activate'}</Button>
                <button onClick={() => remove(cls.id)} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-md">
          <DialogHeader><DialogTitle>{editItem ? 'Edit Class' : 'Add New Class'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Class Name *</label><Input placeholder="IOT-2026" value={form.className} onChange={e => setForm(p => ({ ...p, className: e.target.value }))} /></div>
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Section *</label><Input placeholder="Evening" value={form.section} onChange={e => setForm(p => ({ ...p, section: e.target.value }))} /></div>
            </div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Class Teacher</label>
              <Select value={form.classTeacher} onValueChange={v => setForm(p => ({ ...p, classTeacher: v }))} placeholder="Select teacher">
                <SelectItem value="Pawan Kumar Dubey">Pawan Kumar Dubey</SelectItem>
                <SelectItem value="Samer Khan">Samer Khan</SelectItem>
                <SelectItem value="Ritu Sharma">Ritu Sharma</SelectItem>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Room</label><Input placeholder="Lab-3" value={form.room} onChange={e => setForm(p => ({ ...p, room: e.target.value }))} /></div>
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">Total Students</label><Input type="number" placeholder="30" value={form.totalStudents} onChange={e => setForm(p => ({ ...p, totalStudents: e.target.value }))} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editItem ? 'Update' : 'Add Class'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
