'use client';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { dailyDiaryEntries as initialDailyDiaryEntries, DailyDiaryEntry } from '@/lib/mock-data';
import { BookOpen, Calendar, Plus, Search, Edit2, Trash2, CheckCircle, Clock } from 'lucide-react';

export default function DailyDiaryPage() {
  const [entries, setEntries] = useState<DailyDiaryEntry[]>(initialDailyDiaryEntries);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  
  // Dialog controls
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  
  // Form State
  const [activeEntry, setActiveEntry] = useState<Partial<DailyDiaryEntry> | null>(null);

  // Subject options
  const subjectOptions = [
    { code: 'IOT101', name: 'IOT & Embedded Systems' },
    { code: 'IOT102', name: 'Embedded C Programming' },
    { code: 'IOT103', name: 'Network Protocols' },
  ];

  // Filtered & searched entries
  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      const matchesSubject = selectedSubject === 'all' || e.subjectCode === selectedSubject;
      const matchesSearch = searchQuery === '' || 
        e.topicsCovered.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.homework?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.classwork?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSubject && matchesSearch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [entries, selectedSubject, searchQuery]);

  // Open add dialog
  const handleOpenAdd = () => {
    setActiveEntry({
      date: new Date().toISOString().split('T')[0],
      subjectCode: 'IOT101',
      subjectName: 'IOT & Embedded Systems',
      topicsCovered: '',
      classwork: '',
      homework: '',
      remarks: '',
      isPublished: true,
      teacherName: 'Pawan Kumar Dubey'
    });
    setIsAddOpen(true);
  };

  // Save new entry
  const handleAddSubmit = () => {
    if (!activeEntry || !activeEntry.topicsCovered) return;
    const sub = subjectOptions.find(o => o.code === activeEntry.subjectCode);
    const newEntry: DailyDiaryEntry = {
      id: `dd-${Date.now()}`,
      subjectCode: activeEntry.subjectCode || 'IOT101',
      subjectName: sub ? sub.name : 'IOT & Embedded Systems',
      date: activeEntry.date || new Date().toISOString().split('T')[0],
      topicsCovered: activeEntry.topicsCovered,
      classwork: activeEntry.classwork || '',
      homework: activeEntry.homework || '',
      remarks: activeEntry.remarks || '',
      isPublished: activeEntry.isPublished !== false,
      teacherName: activeEntry.teacherName || 'Pawan Kumar Dubey'
    };

    setEntries(prev => [newEntry, ...prev]);
    setIsAddOpen(false);
  };

  // Open edit dialog
  const handleOpenEdit = (entry: DailyDiaryEntry) => {
    setActiveEntry({ ...entry });
    setIsEditOpen(true);
  };

  // Submit edits
  const handleEditSubmit = () => {
    if (!activeEntry || !activeEntry.id || !activeEntry.topicsCovered) return;
    const sub = subjectOptions.find(o => o.code === activeEntry.subjectCode);
    const updatedEntry = {
      ...activeEntry,
      subjectName: sub ? sub.name : activeEntry.subjectName
    } as DailyDiaryEntry;

    setEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));
    setIsEditOpen(false);
  };

  // Open delete dialog
  const handleOpenDelete = (entry: DailyDiaryEntry) => {
    setActiveEntry(entry);
    setIsDeleteOpen(true);
  };

  // Confirm delete
  const handleDeleteConfirm = () => {
    if (!activeEntry || !activeEntry.id) return;
    setEntries(prev => prev.filter(e => e.id !== activeEntry.id));
    setIsDeleteOpen(false);
  };

  // Quick visibility toggle
  const togglePublish = (id: string) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, isPublished: !e.isPublished } : e));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daily Class Diary</h1>
          <p className="text-gray-500 text-sm mt-0.5">Post daily logs of topics covered, classwork assigned, and homework tasks.</p>
        </div>
        <Button onClick={handleOpenAdd} className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" /> Add Diary Entry
        </Button>
      </div>

      {/* Filter and Search */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-sm font-medium text-gray-600">Filter Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Subjects</option>
              {subjectOptions.map(o => (
                <option key={o.code} value={o.code}>{o.name}</option>
              ))}
            </select>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search diary logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Timeline/Entries Feed */}
      <div className="space-y-4">
        {filteredEntries.map(e => (
          <Card key={e.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="bg-gray-50/50 py-3 border-b border-gray-100 flex flex-row items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <Badge variant={e.isPublished ? "success" : "default"}>
                  {e.isPublished ? 'Published' : 'Draft'}
                </Badge>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <Calendar className="h-3.5 w-3.5" />
                  {e.date}
                </div>
                <div className="text-xs text-gray-400">by {e.teacherName}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePublish(e.id)}
                  className="text-xs text-gray-600 hover:bg-gray-100"
                >
                  {e.isPublished ? 'Unpublish' : 'Publish'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenEdit(e)}
                  className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenDelete(e)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-teal-600" />
                  {e.subjectName} <span className="text-sm font-medium text-gray-400 font-mono">({e.subjectCode})</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="space-y-1 bg-teal-50/20 p-3 rounded-lg border border-teal-50/50">
                  <h4 className="text-xs uppercase font-bold text-teal-800 tracking-wider">Topics Covered</h4>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium">{e.topicsCovered}</p>
                </div>
                <div className="space-y-1 bg-blue-50/20 p-3 rounded-lg border border-blue-50/50">
                  <h4 className="text-xs uppercase font-bold text-blue-800 tracking-wider">Classwork</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{e.classwork || 'None assigned'}</p>
                </div>
                <div className="space-y-1 bg-amber-50/20 p-3 rounded-lg border border-amber-50/50">
                  <h4 className="text-xs uppercase font-bold text-amber-800 tracking-wider">Homework / Tasks</h4>
                  <p className="text-sm text-gray-700 leading-relaxed font-semibold">{e.homework || 'None assigned'}</p>
                </div>
              </div>

              {e.remarks && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2.5 rounded border border-gray-100 flex items-start gap-2">
                  <span className="font-bold text-gray-700">Remarks:</span>
                  <span>{e.remarks}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredEntries.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No daily diary entries found.
          </div>
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Daily Diary Entry</DialogTitle>
          </DialogHeader>
          {activeEntry && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Date</label>
                  <Input
                    type="date"
                    value={activeEntry.date ?? ''}
                    onChange={(ev) => setActiveEntry({ ...activeEntry, date: ev.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Subject</label>
                  <select
                    value={activeEntry.subjectCode ?? 'IOT101'}
                    onChange={(ev) => setActiveEntry({ ...activeEntry, subjectCode: ev.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {subjectOptions.map(o => (
                      <option key={o.code} value={o.code}>{o.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Topics Covered</label>
                <Textarea
                  value={activeEntry.topicsCovered ?? ''}
                  onChange={(ev) => setActiveEntry({ ...activeEntry, topicsCovered: ev.target.value })}
                  placeholder="Explain what topics were discussed..."
                  rows={3}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Classwork Details</label>
                <Textarea
                  value={activeEntry.classwork ?? ''}
                  onChange={(ev) => setActiveEntry({ ...activeEntry, classwork: ev.target.value })}
                  placeholder="Describe in-class tasks or lab demos..."
                  rows={2}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Homework Assigned</label>
                <Textarea
                  value={activeEntry.homework ?? ''}
                  onChange={(ev) => setActiveEntry({ ...activeEntry, homework: ev.target.value })}
                  placeholder="List assignments, worksheets, or reading homework..."
                  rows={2}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Remarks / Notes</label>
                <Input
                  value={activeEntry.remarks ?? ''}
                  onChange={(ev) => setActiveEntry({ ...activeEntry, remarks: ev.target.value })}
                  placeholder="Special observations, absentees, etc."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="add-publish"
                  checked={activeEntry.isPublished !== false}
                  onChange={(ev) => setActiveEntry({ ...activeEntry, isPublished: ev.target.checked })}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="add-publish" className="text-sm font-medium text-gray-700 select-none">
                  Publish immediately (makes entry visible to students and parents)
                </label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddSubmit} className="bg-teal-600 hover:bg-teal-700 text-white">Save Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Diary Entry</DialogTitle>
          </DialogHeader>
          {activeEntry && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Date</label>
                  <Input
                    type="date"
                    value={activeEntry.date ?? ''}
                    onChange={(ev) => setActiveEntry({ ...activeEntry, date: ev.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Subject</label>
                  <select
                    value={activeEntry.subjectCode ?? 'IOT101'}
                    onChange={(ev) => setActiveEntry({ ...activeEntry, subjectCode: ev.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {subjectOptions.map(o => (
                      <option key={o.code} value={o.code}>{o.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Topics Covered</label>
                <Textarea
                  value={activeEntry.topicsCovered ?? ''}
                  onChange={(ev) => setActiveEntry({ ...activeEntry, topicsCovered: ev.target.value })}
                  placeholder="Explain what topics were discussed..."
                  rows={3}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Classwork Details</label>
                <Textarea
                  value={activeEntry.classwork ?? ''}
                  onChange={(ev) => setActiveEntry({ ...activeEntry, classwork: ev.target.value })}
                  placeholder="Describe in-class tasks or lab demos..."
                  rows={2}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Homework Assigned</label>
                <Textarea
                  value={activeEntry.homework ?? ''}
                  onChange={(ev) => setActiveEntry({ ...activeEntry, homework: ev.target.value })}
                  placeholder="List assignments, worksheets, or reading homework..."
                  rows={2}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Remarks / Notes</label>
                <Input
                  value={activeEntry.remarks ?? ''}
                  onChange={(ev) => setActiveEntry({ ...activeEntry, remarks: ev.target.value })}
                  placeholder="Special observations, absentees, etc."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="edit-publish"
                  checked={activeEntry.isPublished !== false}
                  onChange={(ev) => setActiveEntry({ ...activeEntry, isPublished: ev.target.checked })}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="edit-publish" className="text-sm font-medium text-gray-700 select-none">
                  Make public (visible to students and parents)
                </label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSubmit} className="bg-teal-600 hover:bg-teal-700 text-white">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Diary Entry</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <p className="text-sm text-gray-600">Are you sure you want to delete this diary entry? This action cannot be undone.</p>
            {activeEntry && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-sm">
                <span className="font-bold text-red-950">{activeEntry.subjectName}</span>
                <span className="text-red-800 ml-1">· {activeEntry.date}</span>
                <p className="text-xs text-red-700 mt-1 truncate">{activeEntry.topicsCovered}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700 text-white">Confirm Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
