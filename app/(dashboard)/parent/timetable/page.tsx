'use client';
import { timetable, studentsList } from '@/lib/mock-data';
import { Calendar, Clock, MapPin, User, BookOpen } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const DAY_LABELS: Record<string, string> = {
  Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday',
  Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday',
};

const SUBJECT_COLORS: Record<string, string> = {
  IOT101: 'bg-teal-50 border-teal-200 text-teal-700',
  IOT102: 'bg-blue-50 border-blue-200 text-blue-700',
  IOT103: 'bg-purple-50 border-purple-200 text-purple-700',
};

export default function ParentTimetablePage() {
  const student = studentsList[0];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="h-6 w-6 text-rose-600" />Class Timetable
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">{student.name} · {student.class} · {student.section} Section</p>
      </div>

      {/* Subject legend */}
      <div className="flex flex-wrap gap-2 animate-fade-in-up">
        {Object.entries(SUBJECT_COLORS).map(([code, cls]) => (
          <span key={code} className={`px-3 py-1 rounded-full text-xs font-semibold border ${cls}`}>{code}</span>
        ))}
        <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-gray-50 border-gray-200 text-gray-500">No Class</span>
      </div>

      {/* Timetable grid */}
      <div className="space-y-3">
        {DAYS.map((day, i) => {
          const periods = timetable[day] ?? [];
          const isToday = day === today;
          return (
            <div key={day} className={`bg-white rounded-2xl border shadow-sm overflow-hidden animate-fade-in-up card-hover ${isToday ? 'border-rose-300 ring-1 ring-rose-200' : 'border-gray-100'}`}
              style={{ animationDelay: `${i * 70}ms` }}>
              <div className={`flex items-center justify-between px-5 py-3 border-b ${isToday ? 'bg-rose-50 border-rose-100' : 'bg-gray-50/50 border-gray-50'}`}>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${isToday ? 'text-rose-700' : 'text-gray-700'}`}>{DAY_LABELS[day]}</span>
                  {isToday && <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-semibold">TODAY</span>}
                </div>
                <span className="text-xs text-gray-400">{periods.length} {periods.length === 1 ? 'class' : periods.length === 0 ? 'classes' : 'classes'}</span>
              </div>

              {periods.length === 0 ? (
                <div className="px-5 py-4 text-sm text-gray-400 italic">No classes scheduled</div>
              ) : (
                <div className="p-4 space-y-3">
                  {periods.map(p => {
                    const colorCls = SUBJECT_COLORS[p.subjectCode] ?? 'bg-gray-50 border-gray-200 text-gray-700';
                    return (
                      <div key={p.id} className={`rounded-xl border p-4 ${colorCls}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <BookOpen className="h-3.5 w-3.5 flex-shrink-0" />
                              <p className="text-sm font-bold">{p.subject}</p>
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-white/60 rounded-md">{p.subjectCode}</span>
                            </div>
                            <div className="flex flex-wrap gap-3 text-xs opacity-80 mt-1">
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.time}</span>
                              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{p.room}</span>
                              <span className="flex items-center gap-1"><User className="h-3 w-3" />{p.teacherName}</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold opacity-70 whitespace-nowrap">{p.name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info note */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-xs text-blue-700 animate-fade-in-up delay-500">
        <p className="font-semibold mb-0.5">📌 Note for Parents</p>
        <p>Classes are held in the evening batch (8:30 PM – 9:30 PM). Please ensure your child is present on time. Contact the class teacher for any schedule changes.</p>
      </div>
    </div>
  );
}
