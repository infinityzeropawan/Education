'use client';
import { useState, useEffect } from 'react';
import { useAuth, buildStudentUser } from '@/lib/AuthContext';
import { studentsList } from '@/lib/mock-data';
import { Rocket, Eye, EyeOff, Shield, GraduationCap, BookOpen, ChevronDown, User, School, Target, Globe } from 'lucide-react';
import { DEFAULT_MODULES, type InstitutionType, type ModuleKey } from '@/lib/modules';

interface MockInstitution {
  id: string;
  name: string;
  slug: string;
  type: InstitutionType;
  plan: string;
  status: 'active' | 'trial' | 'suspended';
  students: number;
  teachers: number;
  enabledModules: ModuleKey[];
  joinedDate: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
}

const MOCK_INSTITUTIONS: MockInstitution[] = [
  { id: 'inst-001', name: 'Greenwood High School', slug: 'greenwood', type: 'school', plan: 'pro', status: 'active', students: 248, teachers: 18, enabledModules: DEFAULT_MODULES.school, joinedDate: '2026-01-15', phone: '+91 95801 81697', email: 'admin@greenwood.buildroonix.com', website: 'greenwood.buildroonix.com', address: '12, Sector 5, Noida, UP, India' },
  { id: 'inst-002', name: 'Allen Coaching Center', slug: 'allen', type: 'coaching', plan: 'enterprise', status: 'active', students: 520, teachers: 32, enabledModules: DEFAULT_MODULES.coaching, joinedDate: '2026-02-10', phone: '+91 98765 00001', email: 'info@allen.buildroonix.com', website: 'allen.buildroonix.com', address: '45, Lajpat Nagar, Delhi, India' },
  { id: 'inst-003', name: 'LearnOnline Academy', slug: 'learnonline', type: 'online_teaching', plan: 'basic', status: 'trial', students: 85, teachers: 6, enabledModules: DEFAULT_MODULES.online_teaching, joinedDate: '2026-06-01', phone: '+91 98765 00002', email: 'help@learnonline.com', website: 'learnonline.com', address: 'Online Platform' },
  { id: 'inst-004', name: 'ABC Engineering College', slug: 'abceng', type: 'college', plan: 'enterprise', status: 'active', students: 1200, teachers: 95, enabledModules: DEFAULT_MODULES.college, joinedDate: '2025-07-20', phone: '+91 98765 00003', email: 'admissions@abceng.edu', website: 'abceng.edu', address: 'Dwarka Sector 12, Delhi, India' },
];

const STAFF_ACCOUNTS = [
  { label: 'Super Admin', username: 'superadmin', password: 'super123', role: 'superadmin' as const, icon: Shield, color: 'from-purple-500 to-purple-700', name: 'Super Admin', email: 'pawankrdubey36@gmail.com', phone: '9580181697' },
  { label: 'School Admin', username: 'admin', password: 'admin123', role: 'school_admin' as const, icon: School, color: 'from-teal-500 to-teal-700', name: 'School Admin', email: 'admin@buildroonix.com', phone: '9876500000' },
  { label: 'Coaching Admin', username: 'coaching', password: 'coaching123', role: 'school_admin' as const, icon: Target, color: 'from-orange-500 to-orange-700', name: 'Coaching Director', email: 'director@allen.buildroonix.com', phone: '9876500001' },
  { label: 'Teacher', username: 'teacher', password: 'teacher123', role: 'teacher' as const, icon: BookOpen, color: 'from-teal-500 to-teal-700', name: 'Pawan Kumar Dubey', email: 'pawankrdubey36@gmail.com', phone: '9580181697' },
  { label: 'Parent', username: 'parent', password: 'parent123', role: 'parent' as const, icon: User, color: 'from-rose-500 to-rose-700', name: 'Rajesh Sharma', email: 'rajesh@parent.com', phone: '9876543200' },
];

export default function LoginPage() {
  const [tab, setTab] = useState<'staff' | 'student'>('staff');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [studentPass, setStudentPass] = useState('');
  const [showStudentPass, setShowStudentPass] = useState(false);
  
  // Custom multi-tenant active school state
  const [selectedTenantSlug, setSelectedTenantSlug] = useState<string>('greenwood');
  const { login } = useAuth();

  // Find active tenant info
  const activeTenant = MOCK_INSTITUTIONS.find(i => i.slug === selectedTenantSlug) || MOCK_INSTITUTIONS[0];

  // Set the theme and active institution mapping based on username input dynamically
  useEffect(() => {
    if (username === 'admin') {
      setSelectedTenantSlug('greenwood');
    } else if (username === 'coaching') {
      setSelectedTenantSlug('allen');
    }
  }, [username]);

  // Color mappings based on tenant types
  const themeColors = {
    school: {
      bg: 'from-slate-900 via-slate-800 to-teal-900',
      logo: 'from-teal-400 to-teal-600',
      btn: 'from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 hover:shadow-teal-200',
      text: 'text-teal-300',
      ring: 'focus:ring-teal-500',
      badge: 'bg-teal-50 text-teal-800 border-teal-200'
    },
    coaching: {
      bg: 'from-slate-900 via-slate-800 to-orange-900',
      logo: 'from-orange-400 to-orange-600',
      btn: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-200',
      text: 'text-orange-300',
      ring: 'focus:ring-orange-500',
      badge: 'bg-orange-50 text-orange-800 border-orange-200'
    },
    college: {
      bg: 'from-slate-900 via-slate-800 to-indigo-900',
      logo: 'from-indigo-400 to-indigo-600',
      btn: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 hover:shadow-indigo-200',
      text: 'text-indigo-300',
      ring: 'focus:ring-indigo-500',
      badge: 'bg-indigo-50 text-indigo-800 border-indigo-200'
    },
    online_teaching: {
      bg: 'from-slate-900 via-slate-800 to-purple-900',
      logo: 'from-purple-400 to-purple-600',
      btn: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 hover:shadow-purple-200',
      text: 'text-purple-300',
      ring: 'focus:ring-purple-500',
      badge: 'bg-purple-50 text-purple-800 border-purple-200'
    },
    tuition: {
      bg: 'from-slate-900 via-slate-800 to-blue-900',
      logo: 'from-blue-400 to-blue-600',
      btn: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-200',
      text: 'text-blue-300',
      ring: 'focus:ring-blue-500',
      badge: 'bg-blue-50 text-blue-800 border-blue-200'
    },
    hybrid: {
      bg: 'from-slate-900 via-slate-800 to-emerald-900',
      logo: 'from-emerald-400 to-emerald-600',
      btn: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-emerald-200',
      text: 'text-emerald-300',
      ring: 'focus:ring-emerald-500',
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    }
  };

  const activeTheme = themeColors[activeTenant.type] || themeColors.school;

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    
    const acc = STAFF_ACCOUNTS.find(a => a.username === username && a.password === password);
    if (!acc) { setError('Invalid credentials'); setLoading(false); return; }

    // Onboard tenant information to localStorage dynamically
    if (acc.role === 'school_admin') {
      localStorage.setItem('buildroonix_my_institution', JSON.stringify(activeTenant));
    } else {
      // Superadmins default to schools config but can access all
      localStorage.setItem('buildroonix_my_institution', JSON.stringify(MOCK_INSTITUTIONS[0]));
    }

    login({
      id: `usr-${acc.role}`,
      name: acc.name,
      email: acc.email,
      role: acc.role,
      phone: acc.phone,
      joiningDate: '6/5/2026',
      institutionSlug: activeTenant.slug
    });
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    
    const s = studentsList.find(st => st.id === selectedStudent);
    if (!s || s.password !== studentPass) { setError('Invalid student credentials'); setLoading(false); return; }

    // Map student login to Greenwood High School (school type)
    localStorage.setItem('buildroonix_my_institution', JSON.stringify(MOCK_INSTITUTIONS[0]));

    const u = buildStudentUser(s.id);
    if (u) {
      login({
        ...u,
        institutionSlug: MOCK_INSTITUTIONS[0].slug
      });
    }
  };

  const quickFill = (acc: typeof STAFF_ACCOUNTS[0]) => {
    setUsername(acc.username);
    setPassword(acc.password);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${activeTheme.bg} flex items-center justify-center p-4 transition-all duration-500`}>
      <div className="w-full max-w-md">
        
        {/* Tenant Switcher Dropdown */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-xl p-2.5 mb-6 border border-slate-700/50 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-300 pl-1.5">Select Portal Tenant:</span>
          <select
            value={selectedTenantSlug}
            onChange={(e) => {
              setSelectedTenantSlug(e.target.value);
              // Clear inputs if they clash
              setUsername('');
              setPassword('');
            }}
            className="bg-slate-800 text-white border border-slate-700 rounded px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            {MOCK_INSTITUTIONS.map(inst => (
              <option key={inst.slug} value={inst.slug}>{inst.name}</option>
            ))}
          </select>
        </div>

        {/* Logo and Branded Title */}
        <div className="text-center mb-6 animate-fade-in">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${activeTheme.logo} shadow-2xl mb-3 animate-bounce-slow`}>
            <Rocket className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{activeTenant.name}</h1>
          <p className={`${activeTheme.text} text-xs mt-1 uppercase tracking-widest font-bold`}>Branded ERP & LMS Portal</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button onClick={() => { setTab('staff'); setError(''); }} className={`flex-1 py-3.5 text-sm font-semibold transition-all ${tab === 'staff' ? 'bg-slate-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              Staff Login
            </button>
            <button onClick={() => { setTab('student'); setError(''); }} className={`flex-1 py-3.5 text-sm font-semibold transition-all ${tab === 'student' ? 'bg-slate-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              Student Login
            </button>
          </div>

          <div className="p-6">
            {tab === 'staff' ? (
              <>
                <p className="text-gray-500 text-xs mb-4">Quick login — click a role to auto-fill</p>
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {STAFF_ACCOUNTS.map(acc => (
                    <button key={acc.username} type="button" onClick={() => quickFill(acc)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl bg-gradient-to-br ${acc.color} text-white hover:opacity-95 transition-all hover:scale-105 shadow-sm text-center`}>
                      <acc.icon className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-bold truncate w-full">{acc.label}</span>
                    </button>
                  ))}
                </div>
                <form onSubmit={handleStaffLogin} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Username</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="admin / coaching / teacher"
                      className={`w-full h-10 px-4 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 ${activeTheme.ring} focus:border-transparent bg-gray-50`} required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Password</label>
                    <div className="relative">
                      <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password"
                        className={`w-full h-10 px-4 pr-11 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 ${activeTheme.ring} focus:border-transparent bg-gray-50`} required />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600 flex items-center gap-2">⚠️ {error}</div>}
                  <button type="submit" disabled={loading}
                    className={`w-full h-11 bg-gradient-to-r ${activeTheme.btn} text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-md`}>
                    {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</> : 'Sign In →'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <p className="text-gray-500 text-xs mb-4">Select your name and enter your password</p>
                <form onSubmit={handleStudentLogin} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Select Student</label>
                    <div className="relative">
                      <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}
                        className={`w-full h-10 px-4 pr-10 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 ${activeTheme.ring} bg-gray-50 appearance-none`} required>
                        <option value="">— Choose your name —</option>
                        {studentsList.map(s => (
                          <option key={s.id} value={s.id}>{s.name} (Roll: {s.rollNo})</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {selectedStudent && (
                    <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl border border-gray-150">
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${studentsList.find(s => s.id === selectedStudent)?.profileColor || 'from-teal-400 to-teal-600'} flex items-center justify-center text-white text-xs font-bold`}>
                        {studentsList.find(s => s.id === selectedStudent)?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-900">{studentsList.find(s => s.id === selectedStudent)?.name}</p>
                        <p className="text-[10px] text-gray-500">{studentsList.find(s => s.id === selectedStudent)?.class} · {studentsList.find(s => s.id === selectedStudent)?.section}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Password</label>
                    <div className="relative">
                      <input type={showStudentPass ? 'text' : 'password'} value={studentPass} onChange={e => setStudentPass(e.target.value)} placeholder="Enter your password"
                        className={`w-full h-10 px-4 pr-11 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 ${activeTheme.ring} bg-gray-50`} required />
                      <button type="button" onClick={() => setShowStudentPass(!showStudentPass)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                        {showStudentPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Default password: firstname123 (e.g. aarav123)</p>
                  </div>

                  {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600">⚠️ {error}</div>}
                  <button type="submit" disabled={loading}
                    className={`w-full h-11 bg-gradient-to-r ${activeTheme.btn} text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-md`}>
                    {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</> : 'Sign In →'}
                  </button>
                </form>

                <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs text-blue-700 font-medium mb-1">New student?</p>
                  <a href="/register" className="text-xs text-blue-600 hover:underline font-semibold">Register here → </a>
                  <span className="text-xs text-blue-500">Pending approval? </span>
                  <a href="/pending" className="text-xs text-blue-600 hover:underline font-semibold">Check status</a>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-slate-400 text-[10px] mt-6 flex items-center justify-center gap-1">
          <Rocket className="h-3 w-3 text-slate-400" /> Powered by Buildroonix © 2026
        </p>
      </div>
    </div>
  );
}
