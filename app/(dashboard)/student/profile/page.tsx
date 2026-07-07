'use client';
import { useAuth } from '@/lib/AuthContext';
import { studentsList, teachers, feeRecords } from '@/lib/mock-data';
import { User, Mail, Phone, Calendar, BookOpen, Users, Hash, Droplets, MapPin, Bus, CreditCard, GraduationCap, Heart, Home, Edit3, CheckCircle } from 'lucide-react';

export default function StudentProfilePage() {
  const { user } = useAuth();
  const student = studentsList.find(s => s.id === user?.id) || studentsList[0];
  const initials = student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const paidFees = feeRecords.filter(f => f.status === 'paid');
  const pendingFees = feeRecords.filter(f => f.status !== 'paid');
  const totalPaid = paidFees.reduce((a, f) => a + f.amount, 0);
  const totalPending = pendingFees.reduce((a, f) => a + f.amount, 0);

  const Section = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50 bg-gray-50/50">
        <Icon className="h-4 w-4 text-teal-600" />
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );

  const Field = ({ label, value, icon: Icon, highlight }: { label: string; value: string; icon: React.ElementType; highlight?: boolean }) => (
    <div className={`flex items-start gap-3 p-3 rounded-xl ${highlight ? 'bg-teal-50 border border-teal-100' : 'bg-gray-50'}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${highlight ? 'bg-teal-100' : 'bg-white border border-gray-200'}`}>
        <Icon className={`h-4 w-4 ${highlight ? 'text-teal-600' : 'text-gray-500'}`} />
      </div>
      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
        <p className={`text-sm font-semibold mt-0.5 ${highlight ? 'text-teal-700' : 'text-gray-900'}`}>{value || '—'}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><User className="h-6 w-6 text-teal-600" />My Profile</h1>
          <p className="text-gray-500 text-sm mt-0.5">View your complete student profile</p>
        </div>
      </div>

      {/* Hero Card */}
      <div className={`bg-gradient-to-br ${student.profileColor} rounded-2xl p-6 text-white shadow-xl`}>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-bold shadow-lg border-2 border-white/30">
            {initials}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{student.name}</h2>
            <p className="text-white/80 text-sm mt-0.5">{student.class} · {student.section} Section</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">Roll No: {student.rollNo}</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">Bus: {student.busNumber}</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">{student.bloodGroup}</span>
              <span className="px-3 py-1 bg-green-400/30 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle className="h-3 w-3" />Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Paid', value: `₹${totalPaid.toLocaleString()}`, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
          { label: 'Pending', value: `₹${totalPending.toLocaleString()}`, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
          { label: 'Attendance', value: `${student.attendance}%`, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
          { label: 'Bus Number', value: student.busNumber, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4`}>
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={`text-xl font-bold ${s.color} mt-1`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Personal Information" icon={User}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Full Name" value={student.name} icon={User} />
            <Field label="Date of Birth" value={student.dob} icon={Calendar} />
            <Field label="Gender" value={student.gender} icon={Users} />
            <Field label="Blood Group" value={student.bloodGroup} icon={Droplets} highlight />
            <Field label="Email" value={student.email} icon={Mail} />
            <Field label="Phone" value={student.phone} icon={Phone} />
          </div>
        </Section>

        <Section title="Academic Information" icon={GraduationCap}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Class" value={student.class} icon={BookOpen} highlight />
            <Field label="Section" value={student.section} icon={Users} />
            <Field label="Roll Number" value={student.rollNo} icon={Hash} highlight />
            <Field label="Admission Date" value={student.admissionDate} icon={Calendar} />
          </div>
        </Section>

        <Section title="Transport Information" icon={Bus}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Bus Number" value={student.busNumber} icon={Bus} highlight />
            <Field label="Bus Route" value={student.busRoute} icon={MapPin} highlight />
          </div>
          <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-xs text-amber-700 font-medium">🚌 Bus Timing: Pickup 7:30 PM · Drop 10:00 PM</p>
          </div>
        </Section>

        <Section title="Family Information" icon={Heart}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Father's Name" value={student.fatherName} icon={User} />
            <Field label="Mother's Name" value={student.motherName} icon={User} />
            <div className="sm:col-span-2">
              <Field label="Address" value={student.address} icon={Home} />
            </div>
          </div>
        </Section>
      </div>

      {/* Teachers */}
      <Section title="My Teachers" icon={GraduationCap}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teachers.map(t => (
            <div key={t.id} className="flex items-center gap-3 p-4 bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl border border-teal-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {t.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                <p className="text-xs text-teal-600 font-medium">{t.subject}</p>
                <p className="text-xs text-gray-400">{t.qualification}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
