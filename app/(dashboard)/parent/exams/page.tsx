'use client';
import { useState } from 'react';
import { upcomingExams, admitCards, studentsList } from '@/lib/mock-data';
import { Dialog, DialogHeader, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Calendar, Clock, MapPin, BookOpen, FileText, Printer, AlertCircle } from 'lucide-react';

export default function ParentExamsPage() {
  const student = studentsList[0];
  const [admitCard, setAdmitCard] = useState<typeof admitCards[0] | null>(null);

  const today = new Date();
  const getDaysLeft = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-rose-600" />Exams & Admit Cards
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">{student.name} · {student.class} · Roll No: {student.rollNo}</p>
      </div>

      {/* Exam schedule */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50 bg-gray-50/50">
          <Calendar className="h-4 w-4 text-rose-600" />
          <h3 className="text-sm font-semibold text-gray-800">Upcoming Exam Schedule</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {upcomingExams.map((exam, i) => {
            const daysLeft = getDaysLeft(exam.date);
            const urgency = daysLeft <= 7 ? 'text-red-600 bg-red-50 border-red-200'
              : daysLeft <= 14 ? 'text-amber-600 bg-amber-50 border-amber-200'
              : 'text-green-600 bg-green-50 border-green-200';
            const ac = admitCards.find(a => a.examId === exam.id);

            return (
              <div key={exam.id} className="px-5 py-4 hover:bg-gray-50 transition-colors animate-fade-in-up" style={{ animationDelay: `${i * 70}ms` }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <BookOpen className="h-4 w-4 text-rose-500" />
                      <p className="text-sm font-bold text-gray-900">{exam.subject}</p>
                      <Badge variant="info">{exam.maxMarks}M</Badge>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{exam.date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{exam.time} · {exam.duration}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{exam.room}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5 line-clamp-1">📚 {exam.syllabus}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${urgency}`}>
                      {daysLeft > 0 ? `${daysLeft}d left` : 'Today'}
                    </span>
                    {ac && (
                      <button onClick={() => setAdmitCard(ac)}
                        className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                        <FileText className="h-3.5 w-3.5" />Admit Card
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Admit cards grid */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4 text-rose-500" />All Admit Cards
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {admitCards.map((ac, i) => (
            <div key={ac.id} className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 rounded-2xl p-4 card-hover animate-fade-in-up cursor-pointer"
              style={{ animationDelay: `${i * 80}ms` }}
              onClick={() => setAdmitCard(ac)}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">{ac.examType}</span>
                <FileText className="h-4 w-4 text-rose-400" />
              </div>
              <p className="text-sm font-bold text-gray-900 mb-1">{ac.subject}</p>
              <p className="text-xs text-gray-500">{ac.examDate} · {ac.examTime}</p>
              <p className="text-xs text-gray-400 mt-0.5">{ac.room}</p>
              <button className="mt-3 w-full text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold py-1.5 rounded-lg transition-colors">
                View Admit Card
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Admit Card Dialog */}
      <Dialog open={!!admitCard} onOpenChange={() => setAdmitCard(null)}>
        <DialogHeader>Admit Card</DialogHeader>
        <DialogBody>
          {admitCard && (
            <div className="space-y-4">
              {/* Header */}
              <div className="text-center border-b border-dashed border-gray-200 pb-4">
                <p className="text-lg font-bold text-gray-900">Buildroonix Institute</p>
                <p className="text-sm font-semibold text-rose-600 mt-0.5">{admitCard.examType}</p>
                <p className="text-xs text-gray-500">Issued: {admitCard.issuedOn}</p>
              </div>

              {/* Student info */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Student Name', admitCard.studentName],
                  ['Roll Number', admitCard.rollNo],
                  ['Class', `${student.class} · ${student.section}`],
                  ['Subject', admitCard.subject],
                  ['Exam Date', admitCard.examDate],
                  ['Exam Time', admitCard.examTime],
                  ['Duration', admitCard.duration],
                  ['Exam Room', admitCard.room],
                ].map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{k}</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">{v}</p>
                  </div>
                ))}
              </div>

              {/* Instructions */}
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <p className="text-xs font-bold text-amber-700 flex items-center gap-1.5 mb-2">
                  <AlertCircle className="h-3.5 w-3.5" />Instructions
                </p>
                <ul className="space-y-1">
                  {admitCard.instructions.map((ins, i) => (
                    <li key={i} className="text-xs text-amber-700 flex items-start gap-1.5">
                      <span className="mt-0.5 flex-shrink-0">•</span>{ins}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <button onClick={() => setAdmitCard(null)} className="px-4 py-2 text-sm text-gray-600 font-medium">Close</button>
          <button onClick={() => window.print()} className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors">
            <Printer className="h-4 w-4" />Print
          </button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
