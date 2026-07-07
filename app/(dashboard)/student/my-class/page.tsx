'use client';
import { studentsList, teachers, timetable } from '@/lib/mock-data';
import { useAuth } from '@/lib/AuthContext';
import { Users, GraduationCap, BookOpen, Clock } from 'lucide-react';

export default function MyClassPage() {
  const { user } = useAuth();
  const myClass = user?.class || 'IOT-2026';
  const classmates = studentsList.filter(s => s.class === myClass);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Users className="h-6 w-6 text-teal-600" />My Class</h1>
        <p className="text-gray-500 text-sm mt-0.5">Class information, teachers, and classmates</p>
      </div>

      {/* Class Info */}
      <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{myClass}</h2>
            <p className="text-teal-100 text-sm">Evening Section · Academic Year 2026-27</p>
            <div className="flex gap-3 mt-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">{classmates.length} Students</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">{teachers.length} Teachers</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">3 Subjects</span>
            </div>
          </div>
        </div>
      </div>

      {/* Teachers */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50 bg-gray-50/50">
          <BookOpen className="h-4 w-4 text-teal-600" />
          <h3 className="text-sm font-semibold text-gray-800">My Teachers ({teachers.length})</h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {teachers.map(t => (
            <div key={t.id} className="p-4 bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl border border-teal-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold">
                  {t.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{t.name}</p>
                  <p className="text-xs text-teal-600 font-medium">{t.subject}</p>
                </div>
              </div>
              <div className="space-y-1 text-xs text-gray-500">
                <p>🎓 {t.qualification}</p>
                <p>📧 {t.email}</p>
                <p>📞 {t.phone}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50 bg-gray-50/50">
          <Clock className="h-4 w-4 text-teal-600" />
          <h3 className="text-sm font-semibold text-gray-800">Weekly Schedule</h3>
        </div>
        <div className="p-5 space-y-2">
          {Object.entries(timetable).filter(([, periods]) => periods.length > 0).map(([day, periods]) => (
            <div key={day} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <span className="w-10 text-xs font-bold text-teal-600">{day}</span>
              {periods.map(p => (
                <div key={p.id} className="flex-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{p.subject}</span>
                  <span className="text-xs text-gray-400">{p.time} · {p.room} · {p.teacherName}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Classmates */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50 bg-gray-50/50">
          <Users className="h-4 w-4 text-teal-600" />
          <h3 className="text-sm font-semibold text-gray-800">Classmates ({classmates.length})</h3>
        </div>
        <div className="p-5 grid grid-cols-2 md:grid-cols-5 gap-3">
          {classmates.map(s => (
            <div key={s.id} className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-teal-50 transition-colors text-center">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${s.profileColor} flex items-center justify-center text-white text-sm font-bold`}>
                {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900">{s.name.split(' ')[0]}</p>
                <p className="text-[10px] text-gray-400">Roll: {s.rollNo}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
