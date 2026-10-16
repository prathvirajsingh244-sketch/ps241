import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Star,
  Users,
  MapPin,
  BookOpen,
  Video,
  MessageCircle,
  CalendarCheck,
  GraduationCap,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockData } from '../services/mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const features = [
  {
    icon: BookOpen,
    title: 'Career Directory (3D Explorer)',
    description: 'Explore 250+ verified vocational career profiles with eligibility, skills, salary insights and training routes.',
    to: '/careers',
    color: 'bg-orange-100 text-orange-700 border border-orange-200',
  },
  {
    icon: Star,
    title: 'Gamified Assessment',
    description: 'Play our Level 1 Career Quest, earn XP, and unlock tailored vocational recommendations.',
    to: '/assessment',
    color: 'bg-rose-100 text-rose-700 border border-rose-200',
  },
  {
    icon: MessageCircle,
    title: 'Multilingual AI Voice Avatar',
    description: 'Ask questions in Hindi, English or Hinglish with real-time male speech and source citations.',
    to: '/counselling',
    color: 'bg-amber-100 text-amber-700 border border-amber-200',
  },
  {
    icon: MapPin,
    title: 'Skill Centre GPS Map',
    description: 'Find verified government ITIs, PMKVY centres and Kaushal Kendras nearest to your location.',
    to: '/map',
    color: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  },
  {
    icon: Video,
    title: 'Career Intro Videos',
    description: 'Watch curated day-in-the-life vocational videos to see real careers in action.',
    to: '/videos',
    color: 'bg-red-100 text-red-700 border border-red-200',
  },
  {
    icon: CalendarCheck,
    title: 'Human Counsellor Booking',
    description: 'Book a 1-on-1 meeting with certified vocational counsellors when parents and students need mediation.',
    to: '/counsellor-request',
    color: 'bg-teal-100 text-teal-800 border border-teal-200',
  },
];

const stats = [
  { label: 'Vocational Profiles', value: '250+', note: 'NSDC & DGET verified' },
  { label: 'Skill Training Centres', value: '15,000+', note: 'ITIs & PMKVY mapped' },
  { label: 'AI Voice Guidance', value: 'Hindi & English', note: 'Male AI voice synthesis' },
  { label: 'Parent-Student Alignment', value: 'AI Powered', note: 'Bridge expectation gaps' },
];

export default function LandingPage() {
  const { user } = useAuth();
  const featuredCareers = mockData.careers.slice(0, 3);
  const speechTriggeredRef = useRef(false);

  // Auto-play Male AI voice greeting ONCE in the background without any visual UI element
  useEffect(() => {
    const hasPlayed = sessionStorage.getItem('mm_voice_greeting_played');
    if (hasPlayed) return;

    const playMaleGreeting = () => {
      if (speechTriggeredRef.current) return;
      if (!('speechSynthesis' in window)) return;

      window.speechSynthesis.cancel();
      const text = 'नमस्ते! आपका मार्गमित्र में स्वागत है। मैं आपका AI करियर गाइड हूँ। कृपया अपनी भूमिका चुनें — विद्यार्थी या अभिभावक।';
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = 'hi-IN';

      // Pick male voice
      const voices = window.speechSynthesis.getVoices();
      const maleVoice = voices.find(v => {
        const n = v.name.toLowerCase();
        const isHindiOrIndian = v.lang.startsWith('hi') || v.lang.includes('IN');
        const hasMale = n.includes('male') || n.includes('madhur') || n.includes('rishi') || n.includes('hemant') || n.includes('david');
        const isFemale = n.includes('female') || n.includes('zira') || n.includes('swara') || n.includes('kalpana');
        return isHindiOrIndian && (hasMale || !isFemale);
      }) || voices.find(v => {
        const n = v.name.toLowerCase();
        return n.includes('male') && !n.includes('female');
      }) || voices.find(v => v.lang.startsWith('hi')) || null;

      if (maleVoice) utt.voice = maleVoice;
      utt.pitch = 0.82; // Distinctive, deep, warm male pitch
      utt.rate = 0.90;  // Deliberate, clear cadence

      window.speechSynthesis.speak(utt);
      speechTriggeredRef.current = true;
      sessionStorage.setItem('mm_voice_greeting_played', 'true');
    };

    // 1. Try playing immediately on mount
    if (window.speechSynthesis.getVoices().length > 0) {
      playMaleGreeting();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        playMaleGreeting();
      };
    }

    // 2. Safeguard for browser audio autoplay policies:
    // fires immediately on initial pointer or scroll interaction without needing any specific button click
    const handleAutoGesture = () => {
      playMaleGreeting();
      window.removeEventListener('pointerdown', handleAutoGesture);
      window.removeEventListener('pointermove', handleAutoGesture);
      window.removeEventListener('scroll', handleAutoGesture);
      window.removeEventListener('keydown', handleAutoGesture);
    };

    window.addEventListener('pointerdown', handleAutoGesture, { once: true });
    window.addEventListener('pointermove', handleAutoGesture, { once: true });
    window.addEventListener('scroll', handleAutoGesture, { once: true });
    window.addEventListener('keydown', handleAutoGesture, { once: true });

    return () => {
      window.removeEventListener('pointerdown', handleAutoGesture);
      window.removeEventListener('pointermove', handleAutoGesture);
      window.removeEventListener('scroll', handleAutoGesture);
      window.removeEventListener('keydown', handleAutoGesture);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="flex flex-col bg-gradient-to-br from-[#fbcfe8] via-[#fef08a] to-[#fed7aa] text-slate-900 min-h-screen">
      {/* ─── Hero Section with Rich Pink & Warm Yellow Gradient ─────────── */}
      <section className="relative overflow-hidden px-4 pt-14 pb-20 sm:px-6 lg:px-8 border-b border-rose-200/50">
        {/* Soft Ambient Radiance */}
        <div className="absolute inset-0 pointer-events-none opacity-50">
          <div className="absolute -top-24 left-1/4 h-[30rem] w-[30rem] rounded-full bg-rose-300/40 blur-3xl" />
          <div className="absolute top-10 right-1/4 h-[28rem] w-[28rem] rounded-full bg-yellow-300/50 blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 h-[24rem] w-[36rem] rounded-full bg-orange-300/40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl text-center animate-fade-up">
          {/* Project Pill */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/80 border border-rose-300/60 px-4 py-1.5 text-xs font-bold text-rose-950 backdrop-blur-md shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <span>मार्गमित्र (MaargMitra) — AI Career & Vocational Platform</span>
          </div>

          {/* Grand Headline */}
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl text-slate-950">
            मार्गमित्र{' '}
            <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 bg-clip-text text-transparent font-extrabold block sm:inline">
              • MaargMitra
            </span>
          </h1>
          <p className="mt-3.5 text-base sm:text-xl font-medium text-slate-800 max-w-2xl mx-auto leading-relaxed">
            AI-Powered Vocational Guidance Platform for Students & Parents.
          </p>
        </div>

        {/* ─── TWO BIG BOXES: STUDENT & PARENT DASHBOARDS ───────────────────────── */}
        <div className="relative mx-auto max-w-6xl mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* 🎓 BIG BOX 1: STUDENT DASHBOARD */}
          <div className="group relative rounded-3xl border-2 border-emerald-300/70 bg-white/95 p-8 sm:p-10 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-emerald-500 hover:shadow-emerald-300/40 flex flex-col justify-between overflow-hidden">
            {/* Top Sheen */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-100/60 blur-3xl group-hover:bg-emerald-200/60 transition-all" />

            <div>
              {/* Header Badge & Icon */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-9 w-9" />
                </div>
                <span className="rounded-full bg-emerald-100 border border-emerald-300 px-4 py-1 text-xs font-black text-emerald-900 uppercase tracking-wider shadow-sm">
                  विद्यार्थी पोर्टल • STUDENT
                </span>
              </div>

              <h2 className="text-3xl font-black text-slate-950 group-hover:text-emerald-700 transition-colors">
                Student Dashboard
              </h2>
              <p className="mt-3 text-sm text-slate-700 leading-relaxed font-medium">
                Discover vocational careers matched to your talents. Earn XP in our gamified quiz, explore 3D career pathways, track your learning roadmap, and find skill centres near you via GPS.
              </p>

              {/* Feature Checklist */}
              <div className="mt-8 space-y-3.5">
                {[
                  '🎮 Gamified Assessment (+XP, Streaks & Career Matches)',
                  '🌐 Career Explorer (Visual 3D & Salary Insights)',
                  '🤖 Multilingual Floating AI Avatar (Hindi & English Voice)',
                  '🎯 My Roadmap + Step-by-Step Learning Tracker',
                  '🗺️ Skill Centre GPS Map (Find Nearby ITIs & PMKVY)'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs text-slate-800 font-bold">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-10 pt-6 border-t border-slate-100">
              <Link
                to={user?.role === 'learner' ? '/dashboard' : '/signup?role=learner'}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 px-6 py-4 text-base font-black text-white shadow-xl hover:from-emerald-500 hover:to-teal-500 transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>{user?.role === 'learner' ? 'Open Student Dashboard' : 'Register as Student (विद्यार्थी)'}</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <p className="text-center text-[11px] text-slate-500 font-semibold mt-2.5">
                100% Free • Verified NSDC & ITI Curriculum
              </p>
            </div>
          </div>

          {/* 👨‍👩‍👧 BIG BOX 2: PARENT DASHBOARD */}
          <div className="group relative rounded-3xl border-2 border-purple-300/70 bg-white/95 p-8 sm:p-10 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-purple-500 hover:shadow-purple-300/40 flex flex-col justify-between overflow-hidden">
            {/* Top Sheen */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-purple-100/60 blur-3xl group-hover:bg-purple-200/60 transition-all" />

            <div>
              {/* Header Badge & Icon */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Users className="h-9 w-9" />
                </div>
                <span className="rounded-full bg-purple-100 border border-purple-300 px-4 py-1 text-xs font-black text-purple-900 uppercase tracking-wider shadow-sm">
                  अभिभावक पोर्टल • PARENT
                </span>
              </div>

              <h2 className="text-3xl font-black text-slate-950 group-hover:text-purple-700 transition-colors">
                Parent Dashboard
              </h2>
              <p className="mt-3 text-sm text-slate-700 leading-relaxed font-medium">
                Guide your child's career with clarity and peace of mind. Share your expectations, view an AI comparison report highlighting alignment, and connect with certified career counsellors.
              </p>

              {/* Feature Checklist */}
              <div className="mt-8 space-y-3.5">
                {[
                  '📋 Expectations Form (Salary, Sector, Future Goals)',
                  '📊 AI Comparison Report (Child vs Parent Alignment %)',
                  '🤖 AI Mediation Insights (Career Realities & Reassurance)',
                  '🤝 1-Click Human Career Counsellor Booking',
                  '🛡️ Private & Secure Family Career Dialogue'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs text-slate-800 font-bold">
                    <CheckCircle2 className="h-4.5 w-4.5 text-purple-600 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-10 pt-6 border-t border-slate-100">
              <Link
                to={user?.role === 'parent' ? '/parent' : '/signup?role=parent'}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-700 via-indigo-700 to-violet-800 px-6 py-4 text-base font-black text-white shadow-xl hover:from-purple-600 hover:to-indigo-600 transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>{user?.role === 'parent' ? 'Open Parent Dashboard' : 'Register as Parent (अभिभावक)'}</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <p className="text-center text-[11px] text-slate-500 font-semibold mt-2.5">
                Bridge Expectation Gaps • Expert Counselling
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ─── Stats Bar ────────────────────────────────────────────────────────── */}
      <section className="bg-white/80 border-b border-rose-200/50 px-4 py-8 sm:px-6 lg:px-8 backdrop-blur-md">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-5 rounded-2xl bg-white/90 border border-orange-200/70 shadow-sm">
                <p className="text-2xl sm:text-3xl font-black text-rose-600">{stat.value}</p>
                <p className="text-sm font-bold text-slate-900 mt-1">{stat.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{stat.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── All Modules & Features ───────────────────────────────────────────── */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-3.5 py-1 rounded-full border border-rose-300">
              Full Spectrum Platform
            </span>
            <h2 className="section-title mt-4 text-3xl sm:text-4xl font-black text-slate-950">Everything You Need for Career Guidance</h2>
            <p className="mt-2 text-sm text-slate-700 max-w-xl mx-auto">
              From gamified assessments and 3D visual exploration to parent alignment and certified counsellor booking.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <Link
                  key={f.to}
                  to={f.to}
                  className="group flex flex-col gap-4 bg-white/95 border border-orange-200/80 hover:border-rose-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-3xl p-6"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${f.color} shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-950 group-hover:text-rose-600 transition-colors">{f.title}</h3>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed font-medium">{f.description}</p>
                  </div>
                  <div className="mt-auto flex items-center gap-1 text-xs font-bold text-rose-600">
                    Explore Feature <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Featured Careers (3D interactive preview) ────────────────────────── */}
      <section className="bg-white/60 border-t border-rose-200/50 px-4 py-20 sm:px-6 lg:px-8 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title text-2xl sm:text-3xl font-black text-slate-950">Featured Career Profiles</h2>
              <p className="mt-1 text-xs text-slate-600 font-medium">
                Source-verified vocational careers with training pathways
                {USE_MOCK && <span className="ml-2 badge-amber">Sample Data</span>}
              </p>
            </div>
            <Link to="/careers" className="btn-secondary hidden sm:flex text-xs font-bold !bg-white !border-orange-300 !text-slate-800 hover:!bg-orange-50">
              View All 250+ Careers <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCareers.map((c) => (
              <Link
                key={c.id}
                to={`/careers/${c.id}`}
                className="group flex flex-col gap-3.5 bg-white/95 border border-orange-200/80 hover:border-rose-400 hover:shadow-xl hover:-translate-y-1 transition-all rounded-3xl p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700 border border-orange-200">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <span className="badge-blue text-[10px]">{c.category}</span>
                </div>
                <h3 className="font-bold text-slate-950 group-hover:text-rose-600 transition-colors">{c.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">{c.overview}</p>
                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3.5">
                  <span className="text-[11px] font-semibold text-rose-600">View 3D Pathway</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 border-t border-rose-300/50 px-4 py-16 text-white sm:px-6 lg:px-8 shadow-inner">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-black mb-12">How MaargMitra Guides You</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: '1', title: 'Choose Your Portal', desc: 'Select Student to explore careers or Parent to align on expectations.' },
              { step: '2', title: 'Take Gamified Quiz', desc: 'Answer questions, gain XP points, and discover your top vocational match.' },
              { step: '3', title: 'AI Bridge & Male Voice Guide', desc: 'Ask our multilingual AI Avatar questions in Hindi or English anytime.' },
              { step: '4', title: 'Book Human Counsellor', desc: 'If there is confusion or hesitation, connect 1-on-1 with an expert.' },
            ].map((s) => (
              <div key={s.step} className="text-center rounded-2xl bg-white/20 p-6 backdrop-blur-sm border border-white/30 shadow-md">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-rose-600 text-xl font-black shadow-lg">
                  {s.step}
                </div>
                <h3 className="font-bold mb-2 text-white">{s.title}</h3>
                <p className="text-xs text-rose-50 leading-relaxed font-medium">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Disclaimer ──────────────────────────────────────────────────────── */}
      <section className="bg-white/70 border-t border-rose-200/60 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex items-start gap-3">
          <Users className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-700 leading-relaxed">
            <strong>Official Source Notice:</strong> MaargMitra career profiles and training pathways are curated from official government repositories including the National Skill Development Corporation (NSDC), Directorate General of Training (DGT), Ministry of Skill Development and Entrepreneurship (MSDE), and Sector Skill Councils.
          </p>
        </div>
      </section>
    </div>
  );
}
