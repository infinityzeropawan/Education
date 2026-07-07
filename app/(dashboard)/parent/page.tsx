'use client';
import { studentsList, feeRecords, studentResults, subjectAttendance, notices, upcomingExams } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Trophy, CreditCard, Bell, TrendingUp, AlertTriangle, Calendar, BookOpen, GraduationCap } from 'lucide-react';

export default function ParentDashboardPage() {
  const student = studentsList[0];
  const initials = student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const paid    = feeRecords.filter(f => f.status === 'paid');
  const due     = feeRecords.filter(f => f.status !== 'paid');
  const totalPaid = paid.reduce((a, f) => a + f.amount, 0);
  const totalDue  = due.reduce((a, f) => a + f.amount, 0);
  const lowAtt  = subjectAttendance.filter(s => s.percentage < 75);
  const overallPct = Math.round(subjectAttendance.reduce((a, s) => a + s.percentage, 0) / subjectAttendance.length);
  const totalObtained = studentResults.reduce((a, r) => a + r.obtainedMarks, 0);
  const totalMax      = studentResults.reduce((a, r) => a + r.maxMarks, 0);
  const overallScore  = Math.round((totalObtained / totalMax) * 100);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-teal-600" />Parent Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Monitor your child's academic progress</p>
      </div>

      {/* Child card */}
      <div className={`bg-gradient-to-br ${student.profileColor} rounded-2xl p-6 text-white shadow-xl animate-fade-in-up`}>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold border-2 border-white/30 animate-float">
            {initials}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{student.name}</h2>
            <p className="text-white/80 text-sm">{student.class} · {student.section} Section · Roll No: {student.rollNo}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">Admission: {student.admissionDate}</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">Blood: {student.bloodGroup}</span>
              <span className="px-3 py-1 bg-green-400/30 rounded-full text-xs font-medium">✓ Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(lowAtt.length > 0 || totalDue > 0) && (
        <div className="space-y-2 animate-slide-right">
          {lowAtt.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-700">Attendance Warning</p>
                <p className="text-xs text-red-600 mt-0.5">
                  {student.name.split(' ')[0]}'s attendance in <strong>{lowAtt.map(s => s.subjectCode).join(', ')}</strong> is below 75%. Please ensure regular attendance.
                </p>
              </div>
            </div>
          )}
          {totalDue > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-700">Fee Due</p>
                <p className="text-xs text-amber-600 mt-0.5">₹{totalDue.toLocaleString()} is pending. Please clear dues to avoid late fees.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Key stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Attendance',   value: `${overallPct}%`,                  color: overallPct >= 75 ? 'text-green-600' : 'text-red-500', bg: overallPct >= 75 ? 'bg-green-50' : 'bg-red-50', border: overallPct >= 75 ? 'border-green-200' : 'border-red-200', icon: CheckCircle },
          { label: 'Academic Score', value: `${overallScore}%`,              color: 'text-teal-600',   bg: 'bg-teal-50',   border: 'border-teal-200',   icon: Trophy },
          { label: 'Fee Paid',     value: `₹${totalPaid.toLocaleString()}`,  color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200',  icon: CreditCard },
          { label: 'Fee Due',      value: `₹${totalDue.toLocaleString()}`,   color: totalDue > 0 ? 'text-red-600' : 'text-gray-400', bg: totalDue > 0 ? 'bg-red-50' : 'bg-gray-50', border: totalDue > 0 ? 'border-red-200' : 'border-gray-200', icon: CreditCard },
        ].map((s, i) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 card-hover animate-fade-in-up`} style={{ animationDelay: `${i * 80}ms` }}>
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={`text-xl font-bold ${s.color} mt-1`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject attendance */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up delay-200">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50 bg-gray-50/50">
            <TrendingUp className="h-4 w-4 text-teal-600" />
            <h3 className="text-sm font-semibold text-gray-800">Subject-wise Attendance</h3>
          </div>
          <div className="p-5 space-y-4">
            {subjectAttendance.map(s => {
              const isLow = s.percentage < 75;
              return (
                <div key={s.subjectCode}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-semibold text-gray-700">{s.subjectCode}</p>
                    <span className={`text-sm font-bold ${isLow ? 'text-red-500' : 'text-green-600'}`}>{s.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className={`h-2 rounded-full transition-all duration-1000 ${isLow ? 'bg-red-400' : 'bg-gradient-to-r from-teal-400 to-teal-600'}`} style={{ width: `${s.percentage}%` }} />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">{s.attended}/{s.totalClasses} classes · {s.subjectName}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent results */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up delay-300">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50 bg-gray-50/50">
            <Trophy className="h-4 w-4 text-teal-600" />
            <h3 className="text-sm font-semibold text-gray-800">Recent Results</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {studentResults.slice(0, 4).map(r => {
              const pct = Math.round((r.obtainedMarks / r.maxMarks) * 100);
              return (
                <div key={r.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{r.subject}</p>
                    <p className="text-xs text-gray-400">{r.examType} · {r.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">{r.obtainedMarks}/{r.maxMarks}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${pct >= 80 ? 'text-green-700 bg-green-50 border-green-200' : 'text-amber-700 bg-amber-50 border-amber-200'}`}>{r.grade}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming exams */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up delay-300">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50 bg-gray-50/50">
            <Calendar className="h-4 w-4 text-teal-600" />
            <h3 className="text-sm font-semibold text-gray-800">Upcoming Exams</h3>
          </div>
          <div className="p-5 space-y-3">
            {upcomingExams.map(e => (
              <div key={e.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-xl border border-purple-100">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{e.subject}</p>
                  <p className="text-xs text-gray-500">{e.date} · {e.time} · {e.room}</p>
                </div>
                <Badge variant="info">{e.maxMarks}M</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Notices */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up delay-400">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50 bg-gray-50/50">
            <Bell className="h-4 w-4 text-teal-600" />
            <h3 className="text-sm font-semibold text-gray-800">School Notices</h3>
          </div>
          <div className="p-5 space-y-3">
            {notices.slice(0, 3).map(n => (
              <div key={n.id} className={`p-3 rounded-xl border ${n.priority === 'high' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
                <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.content}</p>
                <p className="text-[10px] text-gray-400 mt-1">{n.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
