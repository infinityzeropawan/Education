'use client';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { platformAnnouncements } from '@/lib/mock-data';
import type { PlatformAnnouncement } from '@/lib/mock-data';
import { Megaphone, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<PlatformAnnouncement[]>(platformAnnouncements);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', targetType: 'all' as PlatformAnnouncement['targetType'] });

  const create = () => {
    if (!form.title || !form.content) return;
    setAnnouncements(p => [{ id: `ann-${Date.now()}`, ...form, createdAt: new Date().toISOString().split('T')[0], isActive: true }, ...p]);
    setForm({ title: '', content: '', targetType: 'all' });
    setOpen(false);
  };

  const toggle = (id: string) => setAnnouncements(p => p.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  const remove = (id: string) => setAnnouncements(p => p.filter(a => a.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Megaphone className="h-6 w-6 text-teal-600" />Platform Announcements</h1>
          <p className="text-gray-500 text-sm mt-0.5">Broadcast messages to all institutions</p>
        </div>
        <Button onClick={() => setOpen(true)} className="flex items-center gap-2"><Plus className="h-4 w-4" />New Announcement</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: announcements.length, color: 'text-teal-600' },
          { label: 'Active', value: announcements.filter(a => a.isActive).length, color: 'text-green-600' },
          { label: 'Inactive', value: announcements.filter(a => !a.isActive).length, color: 'text-gray-400' },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4 text-center"><p className={`text-2xl font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-gray-500 mt-1">{s.label}</p></CardContent></Card>
        ))}
      </div>

      <div className="space-y-3">
        {announcements.map(ann => (
          <Card key={ann.id} className={ann.isActive ? 'border-purple-200' : 'border-gray-200'}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-semibold text-gray-900">{ann.title}</p>
                    <Badge variant={ann.isActive ? 'success' : 'default'}>{ann.isActive ? 'Active' : 'Inactive'}</Badge>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full capitalize">{ann.targetType === 'all' ? 'All Institutions' : ann.targetType}</span>
                  </div>
                  <p className="text-sm text-gray-600">{ann.content}</p>
                  <p className="text-xs text-gray-400 mt-2">{ann.createdAt}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toggle(ann.id)} className={ann.isActive ? 'text-teal-600' : 'text-gray-300'}>
                    {ann.isActive ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7" />}
                  </button>
                  <button onClick={() => remove(ann.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full max-w-lg">
          <DialogHeader><DialogTitle>New Platform Announcement</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Title *</label><Input placeholder="Announcement title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Target</label>
              <Select value={form.targetType} onValueChange={v => setForm(p => ({ ...p, targetType: v as PlatformAnnouncement['targetType'] }))}>
                <SelectItem value="all">All Institutions</SelectItem>
                <SelectItem value="school">Schools Only</SelectItem>
                <SelectItem value="coaching">Coaching Only</SelectItem>
                <SelectItem value="college">Colleges Only</SelectItem>
              </Select>
            </div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">Content *</label><Textarea placeholder="Announcement content..." rows={4} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={create}>Publish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
