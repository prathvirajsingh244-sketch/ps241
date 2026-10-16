import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  BookOpen,
  MapPin,
  ArrowRight,
  Zap,
  Trophy,
  Target,
  Eye,
  Users,
  Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: Star, title: 'Gamified Quest', desc: 'Interactive games → get matched careers', to: '/assessment', color: 'from-rose-500 to-amber-500', bg: 'bg-rose-50', text: 'text-rose-600' },
  { icon: Eye, title: '360° AR Previews', desc: 'Try Before You Train virtual workshops', to: '/previews', color: 'from-indigo-500 to-violet-600', bg: 'bg-indigo-50', text: 'text-indigo-600' },
  { icon: MapPin, title: 'Hyperlocal Job Map', desc: 'Local training centres & hiring companies', to: '/map', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', text: 'text-amber-600' },
  { icon: Target, title: 'My NSQF Roadmap', desc: 'Step-by-step career progression tracker', to: '/roadmap', color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  { icon: Users, title: 'Parent Alignment Report', desc: 'View AI agreement & bridge family concerns', to: '/parent/comparison', color: 'from-blue-500 to-cyan-600', bg: 'bg-blue-50', text: 'text-blue-600' },
  { icon: BookOpen, title: 'Career Explorer', desc: 'Browse 250+ verified career profiles', to: '/careers', color: 'from-purple-500 to-pink-600', bg: 'bg-purple-50', text: 'text-purple-600' },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const firstName = user?.display_name?.split(' ')[0] ?? 'Student';
  const [activeInterest, setActiveInterest] = useState<any>(null);

  useEffect(() => {
    try {
      const metrics = JSON.parse(localStorage.getItem('mm_student_behavioral_metrics') || 'null');
      if (metrics) setActiveInterest(metrics);
    } catch {
      // ignore
    }
  }, []);

  const pathwayTitle = activeInterest?.pathway === 'electrical'
    ? 'Solar PV Renewable Energy & Electrical Systems'
    : activeInterest?.pathway === 'mechanical'
    ? 'CNC Precision Machining & Automotive Tech'
    : activeInterest?.pathway === 'digital'
    ? 'Smart IoT & Computer Operations (COPA)'
    : activeInterest?.pathway === 'healthcare'
    ? 'General Duty Healthcare & Assistive Care'
    : 'Renewable Solar & Industrial Electrical Technology';

  return (
    <div className="min-h-screen">
      {/* ─── Hero greeting ────────────────────────────────────────────────── */}
      <div className="bg-slate-950 text-white px-4 py-10 sm:px-6 lg:px-8 border-b border-slate-800 shadow-xl">
        <div className="mx-auto max-w-5xl animate-fade-up">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-rose-500 to-orange-500 text-slate-950 text-2xl font-black shadow-md">
                {firstName[0]}
              </div>
              <div>
                <p className="text-amber-400 text-xs font-bold uppercase tracking-wider">विद्यार्थी डैशबोर्ड (Student Dashboard)</p>
                <h1 className="text-2xl sm:text-3xl font-black text-white">{user?.display_name ?? 'Student Learner'}</h1>
              </div>
            </div>

            {/* Quick stats badges */}
            <div className="flex flex-wrap gap-2.5">
              <div className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-1.5">
                <Zap className="h-4 w-4 text-amber-400" />
                <span className="text-xs text-slate-400">XP Points:</span>
                <span className="text-sm font-black text-amber-300">225 XP</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-1.5">
                <Trophy className="h-4 w-4 text-yellow-400" />
                <span className="text-xs text-slate-400">Level:</span>
                <span className="text-sm font-black text-white">Level 1</span>
              </div>
            </div>
          </div>

          <p className="text-slate-300 mt-3 text-sm max-w-xl leading-relaxed">
            मार्गमित्र पर आपका स्वागत है। यहां आप अपनी रुचियों के आधार पर वोकेशनल ट्रेड्स, स्थानीय नौकरियां और आगे की पढ़ाई के रास्ते देख सकते हैं।
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* ─── DYNAMIC PLATFORM ALIGNMENT BANNER (When interest is chosen) ── */}
        <div className="card border-2 border-amber-400 bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/10 p-6 sm:p-7 shadow-xl animate-fade-up">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="rounded-full bg-amber-400/25 border border-amber-500/40 px-3 py-1 text-[11px] font-black uppercase text-amber-950 tracking-wider">
                🎯 आपका सक्रिय वोकेशनल ट्रैक (Active Vocational Track)
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 mt-1">
                {pathwayTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                सत्यापित प्लेसमेंट: 88% • प्रारंभिक कमाई: ₹18,000–₹28,000/माह • NSQF Level 4/5
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link to="/map" className="btn-primary text-xs font-black shadow-md">
                <Building2 className="h-4 w-4 mr-1 inline" /> पास की नौकरियां देखें (Local Jobs)
              </Link>
              <Link to="/previews" className="btn-secondary text-xs font-bold">
                <Eye className="h-4 w-4 mr-1 inline" /> 360° कार्यशाला देखें
              </Link>
            </div>
          </div>
        </div>

        {/* ─── Feature Hub ─────────────────────────────────────────────────── */}
        <div>
          <h2 className="text-lg font-black text-slate-950 mb-4">आप आज क्या करना चाहते हैं? (Quick Access)</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <Link
                  key={f.to}
                  to={f.to}
                  className="card p-5 group hover:-translate-y-1 hover:shadow-xl transition-all duration-200 border border-slate-200/80 bg-white/95"
                >
                  <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl ${f.bg} shadow-sm group-hover:scale-105 transition-transform`}>
                    <Icon className={`h-5 w-5 ${f.text}`} />
                  </div>
                  <h3 className="font-black text-slate-950 group-hover:text-rose-600 transition-colors text-base flex items-center justify-between">
                    {f.title}
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-rose-600" />
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">{f.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
