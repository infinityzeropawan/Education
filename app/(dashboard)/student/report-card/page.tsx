'use client';
import { reportCardData, subjectAttendance } from '@/lib/mock-data';
import { useAuth } from '@/lib/AuthContext';
import { Trophy, TrendingUp, Award, BookOpen, Printer, Download, Star } from 'lucide-react';

const gradeColor: Record<string, string> = {
  'A+': 'text-green-700 bg-green-100 border-green-300',
  'A':  'text-teal-700  bg-teal-100  border-teal-300',
  'B+': 'text-blue-700  bg-blue-100  border-blue-300',
  'B':  'text-indigo-700 bg-indigo-100 border-indigo-300',
  'C':  'text-amber-700 bg-amber-100 border-amber-300',
  'F':  'text-red-700   bg-red-100   border-red-300',
};

const barColor = (pct: number) =>
  pct >= 85 ? 'from-green-400 to-green-600' :
  pct >= 70 ? 'from-teal-400 to-teal-600' :
  pct >= 55 ? 'from-amber-400 to-amber-500' : 'from-red-400 to-red-500';

export default function ReportCardPage() {
  const { user } = useAuth();
  const totalObtained = reportCardData.reduce((a, r) => a + r.totalObtained, 0);
  const totalMax      = reportCardData.reduce((a, r) => a + r.totalMax, 0);
  const overallPct    = Math.round((totalObtained / totalMax) * 100);
  const overallGrade  = overallPct >= 90 ? 'A+' : overallPct >= 80 ? 'A' : overallPct >= 70 ? 'B+' : overallPct >= 60 ? 'B' : 'C';

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-teal-600" />Report Card
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Academic Year 2026-27 · Mid Term</p>
        </div>
        <button onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-teal-300 transition-all shadow-sm">
          <Printer className="h-4 w-4" />Print
        </button>
      </div>

      {/* Student Hero */}
      <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 rounded-2xl p-6 text-white shadow-xl animate-fade-in-up">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold border-2 border-white/30 animate-float">
            {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-teal-200 text-sm">IOT-2026 · Evening Section · Roll No: 001</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">Academic Year: 2026-27</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">Term: Mid Term</span>
              <span className="px-3 py-1 bg-green-400/30 rounded-full text-xs font-medium">Status: Promoted</span>
            </div>
          </div>
          <div className="text-right">
            <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/40 flex flex-col items-center justify-center animate-bounce-in">
              <span className="text-2xl font-black">{overallPct}%</span>
              <span className="text-xs text-teal-200">Overall</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Score',   value: `${totalObtained}/${totalMax}`, color: 'text-teal-600',   bg: 'bg-teal-50',   border: 'border-teal-200' },
          { label: 'Percentage',    value: `${overallPct}%`,               color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200' },
          { label: 'Overall Grade', value: overallGrade,                   color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200' },
          { label: 'Subjects',      value: String(reportCardData.length),  color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
        ].map((s, i) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 card-hover animate-fade-in-up`} style={{ animationDelay: `${i * 80}ms` }}>
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color} mt-1`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Subject Performance Bars */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up delay-200">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50 bg-gray-50/50">
          <TrendingUp className="h-4 w-4 text-teal-600" />
          <h3 className="text-sm font-semibold text-gray-800">Subject Performance</h3>
        </div>
        <div className="p-5 space-y-4">
          {reportCardData.map((r, i) => (
            <div key={r.subjectCode} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <span className="text-sm font-semibold text-gray-900">{r.subject}</span>
                  <span className="text-xs text-gray-400 ml-2">{r.subjectCode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-700">{r.totalObtained}/{r.totalMax}</span>
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${gradeColor[r.grade] || 'text-gray-600 bg-gray-50 border-gray-200'}`}>{r.grade}</span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full bg-gradient-to-r ${barColor(r.percentage)} transition-all duration-1000`}
                  style={{ width: `${r.percentage}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-400">{r.remarks}</span>
                <span className="text-xs font-medium text-gray-500">{r.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Marks Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up delay-300">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50 bg-gray-50/50">
          <BookOpen className="h-4 w-4 text-teal-600" />
          <h3 className="text-sm font-semibold text-gray-800">Detailed Marks Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Subject</th>
                <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase">UT-1<br/><span className="font-normal normal-case text-gray-400">/25</span></th>
                <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase">UT-2<br/><span className="font-normal normal-case text-gray-400">/25</span></th>
                <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase">Mid Term<br/><span className="font-normal normal-case text-gray-400">/100</span></th>
                <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase">Grade</th>
                <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase">Attend.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reportCardData.map((r, i) => {
                const att = subjectAttendance.find(a => a.subjectCode === r.subjectCode);
                return (
                  <tr key={r.subjectCode} className="hover:bg-gray-50 transition-colors animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">{r.subject}</p>
                      <p className="text-xs text-gray-400">{r.subjectCode}</p>
                    </td>
                    <td className="text-center px-3 py-4 font-semibold text-gray-800">{r.unitTest1 ?? '—'}</td>
                    <td className="text-center px-3 py-4 font-semibold text-gray-800">{r.unitTest2 ?? '—'}</td>
                    <td className="text-center px-3 py-4 font-semibold text-gray-800">{r.midTerm ?? '—'}</td>
                    <td className="text-center px-3 py-4">
                      <span className="font-bold text-teal-700">{r.totalObtained}</span>
                      <span className="text-gray-400 text-xs">/{r.totalMax}</span>
                    </td>
                    <td className="text-center px-3 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${gradeColor[r.grade] || ''}`}>{r.grade}</span>
                    </td>
                    <td className="text-center px-3 py-4">
                      {att ? (
                        <span className={`text-xs font-bold ${att.percentage >= 75 ? 'text-green-600' : 'text-red-500'}`}>
                          {att.percentage}%
                        </span>
                      ) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-teal-50 border-t-2 border-teal-200">
                <td className="px-5 py-4 font-bold text-teal-800">Total / Overall</td>
                <td colSpan={3} />
                <td className="text-center px-3 py-4 font-black text-teal-700">{totalObtained}/{totalMax}</td>
                <td className="text-center px-3 py-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${gradeColor[overallGrade] || ''}`}>{overallGrade}</span>
                </td>
                <td className="text-center px-3 py-4 font-bold text-teal-700">{overallPct}%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Remarks */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 animate-fade-in-up delay-400">
        <div className="flex items-start gap-3">
          <Star className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Teacher&apos;s Remarks</p>
            <p className="text-sm text-amber-700 mt-1 leading-relaxed">
              {user?.name?.split(' ')[0]} has shown excellent performance in IOT & Embedded Systems and Embedded C Programming.
              Attendance in Embedded C needs improvement to meet the 75% minimum requirement.
              Keep up the good work!
            </p>
            <p className="text-xs text-amber-600 mt-2 font-medium">— Pawan Kumar Dubey, Class Teacher</p>
          </div>
        </div>
      </div>
    </div>
  );
}
