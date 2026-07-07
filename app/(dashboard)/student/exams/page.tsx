'use client';
import { useState } from 'react';
import { upcomingExams, admitCards, type AdmitCard } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { Award, Calendar, Clock, MapPin, Download, FileCheck, BookOpen, AlertCircle, Printer } from 'lucide-react';

export default function StudentExamsPage() {
  const [admitCard, setAdmitCard] = useState<AdmitCard | null>(null);

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Award className="h-6 w-6 text-teal-600" />My Exams
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Upcoming examinations schedule & admit cards</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Upcoming Exams', value: upcomingExams.length,    color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
          { label: 'Admit Cards',    value: admitCards.length,        color: 'text-teal-600',   bg: 'bg-teal-50',   border: 'border-teal-200' },
          { label: 'Total Marks',    value: upcomingExams.reduce((a, e) => a + e.maxMarks, 0), color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
        ].map((s, i) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 text-center card-hover animate-fade-in-up`} style={{ animationDelay: `${i * 80}ms` }}>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Exam cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {upcomingExams.map((e, i) => {
          const ac = admitCards.find(a => a.examId === e.id);
          return (
            <div key={e.id}
              className="bg-white rounded-2xl border border-purple-100 shadow-sm hover:shadow-lg transition-all duration-300 card-hover overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}>
              <div className="h-1 bg-gradient-to-r from-purple-400 to-indigo-500" />
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{e.subject}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Mid Term Examination</p>
                  </div>
                  <Badge variant="info">{e.maxMarks} Marks</Badge>
                </div>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-purple-400" />{e.date}</p>
                  <p className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-blue-400" />{e.time} · {e.duration}</p>
                  <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-teal-400" />{e.room}</p>
                  <p className="flex items-center gap-2"><BookOpen className="h-3.5 w-3.5 text-amber-400" />{e.syllabus}</p>
                </div>
                {ac ? (
                  <Button onClick={() => setAdmitCard(ac)} variant="outline" className="w-full flex items-center gap-2 border-purple-200 text-purple-700 hover:bg-purple-50">
                    <FileCheck className="h-4 w-4" />View Admit Card
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-xl p-3">
                    <AlertCircle className="h-4 w-4" />Admit card not yet issued
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Admit Card Dialog */}
      <Dialog open={!!admitCard} onOpenChange={v => { if (!v) setAdmitCard(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-teal-600" />Admit Card / Hall Ticket
            </DialogTitle>
          </DialogHeader>
          {admitCard && (
            <DialogBody className="space-y-0 p-0">
              {/* Admit card design */}
              <div className="mx-6 my-5 border-2 border-gray-200 rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-teal-600 to-teal-800 px-6 py-4 text-white text-center">
                  <p className="text-xs font-medium text-teal-200 uppercase tracking-widest">Buildroonix Institute</p>
                  <h2 className="text-lg font-bold mt-1">ADMIT CARD</h2>
                  <p className="text-sm text-teal-200">{admitCard.examType} — Academic Year 2026-27</p>
                </div>
                {/* Student info */}
                <div className="grid grid-cols-2 gap-0 border-b border-gray-200">
                  {[
                    { label: 'Student Name', value: admitCard.studentName },
                    { label: 'Roll Number',  value: admitCard.rollNo },
                    { label: 'Class',        value: 'IOT-2026 · Evening' },
                    { label: 'Issued On',    value: admitCard.issuedOn },
                  ].map((f, i) => (
                    <div key={f.label} className={`px-4 py-3 ${i % 2 === 0 ? 'border-r border-gray-200' : ''} ${i < 2 ? 'border-b border-gray-200' : ''}`}>
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">{f.label}</p>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">{f.value}</p>
                    </div>
                  ))}
                </div>
                {/* Exam info */}
                <div className="bg-purple-50 px-4 py-3 border-b border-gray-200">
                  <p className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-2">Examination Details</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="flex items-center gap-2 text-gray-700"><BookOpen className="h-3.5 w-3.5 text-purple-500" />{admitCard.subject}</p>
                    <p className="flex items-center gap-2 text-gray-700"><Calendar className="h-3.5 w-3.5 text-purple-500" />{admitCard.examDate}</p>
                    <p className="flex items-center gap-2 text-gray-700"><Clock className="h-3.5 w-3.5 text-purple-500" />{admitCard.examTime} · {admitCard.duration}</p>
                    <p className="flex items-center gap-2 text-gray-700"><MapPin className="h-3.5 w-3.5 text-purple-500" />{admitCard.room}</p>
                  </div>
                </div>
                {/* Instructions */}
                <div className="px-4 py-3">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Instructions</p>
                  <ol className="space-y-1">
                    {admitCard.instructions.map((ins, i) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                        <span className="w-4 h-4 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                        {ins}
                      </li>
                    ))}
                  </ol>
                </div>
                {/* Signature area */}
                <div className="grid grid-cols-2 border-t border-gray-200">
                  <div className="px-4 py-3 border-r border-gray-200 text-center">
                    <div className="h-8 border-b border-dashed border-gray-300 mb-1" />
                    <p className="text-[10px] text-gray-400">Student Signature</p>
                  </div>
                  <div className="px-4 py-3 text-center">
                    <div className="h-8 border-b border-dashed border-gray-300 mb-1" />
                    <p className="text-[10px] text-gray-400">Principal Signature</p>
                  </div>
                </div>
              </div>
            </DialogBody>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdmitCard(null)}>Close</Button>
            <Button onClick={() => window.print()} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />Print Admit Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
