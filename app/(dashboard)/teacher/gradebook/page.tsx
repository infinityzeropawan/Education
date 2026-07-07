'use client';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { gradebookEntries as initialGradebookEntries, GradebookEntry } from '@/lib/mock-data';
import { Trophy, ArrowDown, ArrowUp, Percent, Search, Edit2, Download, Check, Save } from 'lucide-react';

export default function GradebookPage() {
  const [entries, setEntries] = useState<GradebookEntry[]>(initialGradebookEntries);
  const [selectedSubject, setSelectedSubject] = useState<string>('IOT101');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editMap, setEditMap] = useState<Record<string, Partial<GradebookEntry>>>({});
  
  // Dialog state for a detailed review/edit
  const [selectedEntry, setSelectedEntry] = useState<GradebookEntry | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  // Filtered entries by selected subject and search query
  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      if (e.subjectCode !== selectedSubject) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          e.studentName.toLowerCase().includes(query) ||
          e.rollNo.includes(query)
        );
      }
      return true;
    });
  }, [entries, selectedSubject, searchQuery]);

  // Statistics calculations
  const stats = useMemo(() => {
    if (filteredEntries.length === 0) {
      return { average: 0, highest: 0, lowest: 0, passRate: 0 };
    }
    let totalPct = 0;
    let highest = 0;
    let lowest = 100;
    let passed = 0;

    filteredEntries.forEach(e => {
      totalPct += e.percentage;
      if (e.percentage > highest) highest = e.percentage;
      if (e.percentage < lowest) lowest = e.percentage;
      if (e.percentage >= 40) passed++;
    });

    return {
      average: Math.round(totalPct / filteredEntries.length),
      highest,
      lowest,
      passRate: Math.round((passed / filteredEntries.length) * 100)
    };
  }, [filteredEntries]);

  // Calculations for total score, percentage, and grade mapping
  const calculateResult = (entry: Partial<GradebookEntry>): { total: number; pct: number; grade: string } => {
    const ut1 = entry.unitTest1 || 0;
    const ut2 = entry.unitTest2 || 0;
    const mid = entry.midTerm || 0;
    const asgn = entry.assignment || 0;
    const prac = entry.practical || 0;
    
    const total = ut1 + ut2 + mid + asgn + prac;
    const max = 225; // standard total max
    const pct = Math.round((total / max) * 100);
    
    let grade = 'F';
    if (pct >= 90) grade = 'A+';
    else if (pct >= 80) grade = 'A';
    else if (pct >= 70) grade = 'B+';
    else if (pct >= 60) grade = 'B';
    else if (pct >= 50) grade = 'C';
    else if (pct >= 40) grade = 'D';

    return { total, pct, grade };
  };

  // Turn on edit mode and populate temporary state
  const handleStartEdit = () => {
    const map: Record<string, Partial<GradebookEntry>> = {};
    filteredEntries.forEach(e => {
      map[e.id] = { ...e };
    });
    setEditMap(map);
    setIsEditing(true);
  };

  // Handle single cell input changes during edit mode
  const handleCellChange = (id: string, field: keyof GradebookEntry, value: string) => {
    const numVal = value === '' ? undefined : Number(value);
    setEditMap(prev => {
      const updatedEntry = { ...prev[id], [field]: numVal };
      const { total, pct, grade } = calculateResult(updatedEntry);
      
      return {
        ...prev,
        [id]: {
          ...updatedEntry,
          totalObtained: total,
          percentage: pct,
          grade
        }
      };
    });
  };

  // Save changes from edit mode back to main entries
  const handleSaveAll = () => {
    setEntries(prev => {
      return prev.map(e => {
        if (editMap[e.id]) {
          return { ...e, ...editMap[e.id] } as GradebookEntry;
        }
        return e;
      });
    });
    setIsEditing(false);
  };

  // Modal detailed editor handlers
  const handleOpenDetails = (entry: GradebookEntry) => {
    setSelectedEntry({ ...entry });
    setIsDetailsOpen(true);
  };

  const handleSaveDetail = () => {
    if (!selectedEntry) return;
    const { total, pct, grade } = calculateResult(selectedEntry);
    const updated = {
      ...selectedEntry,
      totalObtained: total,
      percentage: pct,
      grade
    };
    setEntries(prev => prev.map(e => e.id === updated.id ? updated : e));
    setIsDetailsOpen(false);
  };

  const triggerExport = () => {
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Gradebook</h1>
          <p className="text-gray-500 text-sm mt-0.5">Aggregate scores, view performance statistics, and publish final marks.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={triggerExport} className="flex items-center gap-2">
            {exportSuccess ? <Check className="h-4 w-4 text-green-600" /> : <Download className="h-4 w-4" />}
            {exportSuccess ? 'Exported CSV!' : 'Export Gradebook'}
          </Button>
          {isEditing ? (
            <Button onClick={handleSaveAll} className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2">
              <Save className="h-4 w-4" /> Save Grades
            </Button>
          ) : (
            <Button onClick={handleStartEdit} className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2">
              <Edit2 className="h-4 w-4" /> Quick Edit Mode
            </Button>
          )}
        </div>
      </div>

      {/* Subject Filter & Search */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-sm font-medium text-gray-600">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="IOT101">IOT & Embedded Systems (IOT101)</option>
              <option value="IOT102">Embedded C Programming (IOT102)</option>
              <option value="IOT103">Network Protocols (IOT103)</option>
            </select>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by student or roll no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-teal-100 bg-teal-50/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-100 text-teal-700"><Trophy className="h-5 w-5" /></div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Class Average</p>
              <p className="text-xl font-bold text-teal-800">{stats.average}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-100 bg-blue-50/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700"><ArrowUp className="h-5 w-5" /></div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Highest Grade</p>
              <p className="text-xl font-bold text-blue-800">{stats.highest}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-100 bg-amber-50/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700"><ArrowDown className="h-5 w-5" /></div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Lowest Grade</p>
              <p className="text-xl font-bold text-amber-800">{stats.lowest}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-100 bg-green-50/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-green-100 text-green-700"><Percent className="h-5 w-5" /></div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Pass Rate</p>
              <p className="text-xl font-bold text-green-800">{stats.passRate}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grade Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Roll No</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Student Name</th>
                  <th className="px-3 py-3 text-center font-semibold text-gray-600">UT1 (25)</th>
                  <th className="px-3 py-3 text-center font-semibold text-gray-600">UT2 (25)</th>
                  <th className="px-3 py-3 text-center font-semibold text-gray-600">Mid Term (100)</th>
                  <th className="px-3 py-3 text-center font-semibold text-gray-600">Assignment (50)</th>
                  <th className="px-3 py-3 text-center font-semibold text-gray-600">Practical (25)</th>
                  <th className="px-3 py-3 text-center font-semibold text-gray-600 bg-gray-100/50">Total (225)</th>
                  <th className="px-3 py-3 text-center font-semibold text-gray-600">Percentage</th>
                  <th className="px-3 py-3 text-center font-semibold text-gray-600">Grade</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map(e => {
                  const isCurEditing = isEditing && editMap[e.id];
                  const currentVals = isCurEditing ? editMap[e.id] : e;
                  const gradeColor = 
                    e.grade.startsWith('A') ? 'bg-green-50 text-green-700 border-green-200' :
                    e.grade.startsWith('B') ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    e.grade === 'C' || e.grade === 'D' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-red-50 text-red-700 border-red-200';

                  return (
                    <tr key={e.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3.5 font-medium text-gray-900">{e.rollNo}</td>
                      <td className="px-4 py-3.5 font-semibold text-gray-800">{e.studentName}</td>
                      
                      {/* UT1 Cell */}
                      <td className="px-3 py-3.5 text-center">
                        {isCurEditing ? (
                          <input
                            type="number"
                            min="0"
                            max="25"
                            value={currentVals.unitTest1 ?? ''}
                            onChange={(ev) => handleCellChange(e.id, 'unitTest1', ev.target.value)}
                            className="w-16 border rounded text-center py-1 text-sm focus:ring-1 focus:ring-teal-500"
                          />
                        ) : (
                          e.unitTest1 ?? '-'
                        )}
                      </td>

                      {/* UT2 Cell */}
                      <td className="px-3 py-3.5 text-center">
                        {isCurEditing ? (
                          <input
                            type="number"
                            min="0"
                            max="25"
                            value={currentVals.unitTest2 ?? ''}
                            onChange={(ev) => handleCellChange(e.id, 'unitTest2', ev.target.value)}
                            className="w-16 border rounded text-center py-1 text-sm focus:ring-1 focus:ring-teal-500"
                          />
                        ) : (
                          e.unitTest2 ?? '-'
                        )}
                      </td>

                      {/* Mid Term Cell */}
                      <td className="px-3 py-3.5 text-center">
                        {isCurEditing ? (
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={currentVals.midTerm ?? ''}
                            onChange={(ev) => handleCellChange(e.id, 'midTerm', ev.target.value)}
                            className="w-16 border rounded text-center py-1 text-sm focus:ring-1 focus:ring-teal-500"
                          />
                        ) : (
                          e.midTerm ?? '-'
                        )}
                      </td>

                      {/* Assignment Cell */}
                      <td className="px-3 py-3.5 text-center">
                        {isCurEditing ? (
                          <input
                            type="number"
                            min="0"
                            max="50"
                            value={currentVals.assignment ?? ''}
                            onChange={(ev) => handleCellChange(e.id, 'assignment', ev.target.value)}
                            className="w-16 border rounded text-center py-1 text-sm focus:ring-1 focus:ring-teal-500"
                          />
                        ) : (
                          e.assignment ?? '-'
                        )}
                      </td>

                      {/* Practical Cell */}
                      <td className="px-3 py-3.5 text-center">
                        {isCurEditing ? (
                          <input
                            type="number"
                            min="0"
                            max="25"
                            value={currentVals.practical ?? ''}
                            onChange={(ev) => handleCellChange(e.id, 'practical', ev.target.value)}
                            className="w-16 border rounded text-center py-1 text-sm focus:ring-1 focus:ring-teal-500"
                          />
                        ) : (
                          e.practical ?? '-'
                        )}
                      </td>

                      {/* Total */}
                      <td className="px-3 py-3.5 text-center font-bold text-gray-900 bg-gray-50/50">
                        {currentVals.totalObtained}
                      </td>

                      {/* Percentage */}
                      <td className="px-3 py-3.5 text-center font-medium text-gray-600">
                        {currentVals.percentage}%
                      </td>

                      {/* Grade Badge */}
                      <td className="px-3 py-3.5 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full border text-xs font-bold ${gradeColor}`}>
                          {currentVals.grade}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDetails(e)}
                          className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                        >
                          Details
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {filteredEntries.length === 0 && (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-gray-400">
                      No records found for search filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Academic Record Details</DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4 py-4">
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="font-semibold text-gray-900 text-sm">{selectedEntry.studentName}</p>
                <p className="text-xs text-gray-500">Roll Number: {selectedEntry.rollNo} · Subject: {selectedEntry.subjectName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Unit Test 1 (max 25)</label>
                  <Input
                    type="number"
                    value={selectedEntry.unitTest1 ?? ''}
                    onChange={(ev) => setSelectedEntry({ ...selectedEntry, unitTest1: ev.target.value === '' ? undefined : Number(ev.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Unit Test 2 (max 25)</label>
                  <Input
                    type="number"
                    value={selectedEntry.unitTest2 ?? ''}
                    onChange={(ev) => setSelectedEntry({ ...selectedEntry, unitTest2: ev.target.value === '' ? undefined : Number(ev.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Mid Term (max 100)</label>
                  <Input
                    type="number"
                    value={selectedEntry.midTerm ?? ''}
                    onChange={(ev) => setSelectedEntry({ ...selectedEntry, midTerm: ev.target.value === '' ? undefined : Number(ev.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Assignment (max 50)</label>
                  <Input
                    type="number"
                    value={selectedEntry.assignment ?? ''}
                    onChange={(ev) => setSelectedEntry({ ...selectedEntry, assignment: ev.target.value === '' ? undefined : Number(ev.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1 block">Practical (max 25)</label>
                  <Input
                    type="number"
                    value={selectedEntry.practical ?? ''}
                    onChange={(ev) => setSelectedEntry({ ...selectedEntry, practical: ev.target.value === '' ? undefined : Number(ev.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Remarks / Notes</label>
                <Input
                  value={selectedEntry.remarks ?? ''}
                  onChange={(ev) => setSelectedEntry({ ...selectedEntry, remarks: ev.target.value })}
                  placeholder="Enter academic remarks..."
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveDetail} className="bg-teal-600 hover:bg-teal-700 text-white">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
