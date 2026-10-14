import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, MapPin, BookOpen, Video, MessageCircle, CalendarCheck } from 'lucide-react';
import { mockData } from '../services/mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const features = [
  {
    icon: BookOpen,
    title: 'Career Directory',
    description: 'Explore verified vocational career profiles with eligibility, skills, training routes and source references.',
    to: '/careers',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Star,
    title: 'Career Assessment',
    description: 'Answer a few questions to get personalised career suggestions matched to your background and interests.',
    to: '/assessment',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: MessageCircle,
    title: 'AI Career Counsellor',
    description: 'Ask career questions and receive source-grounded answers from our AI counsellor in Hindi or English.',
    to: '/counselling',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: MapPin,
    title: 'Skill & Job Map',
    description: 'Find verified skill training centres and available opportunities near you on an interactive map.',
    to: '/map',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Video,
    title: 'Career Videos',
    description: 'Watch curated career introduction videos to understand what each vocation looks like in real life.',
    to: '/videos',
    color: 'bg-red-50 text-red-600',
  },
  {
    icon: CalendarCheck,
    title: 'Book a Counsellor',
    description: 'Request a meeting with a human career counsellor for personal guidance and complex decisions.',
    to: '/counsellor-request',
    color: 'bg-teal-50 text-teal-600',
  },
];

const stats = [
  { label: 'Career Profiles', value: '5+', note: 'Source-verified' },
  { label: 'Skill Centres', value: '5+', note: 'Sample data' },
  { label: 'Assessment Questions', value: '5', note: 'Personalised guidance' },
  { label: 'Human Counsellors', value: 'Available', note: 'On-request' },
];

export default function LandingPage() {
  const featuredCareers = mockData.careers.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center animate-fade-up">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
            SIH 2026 — Problem Statement 241
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Your Vocational Career<br />
            <span className="text-yellow-300">Guidance Partner</span>
          </h1>
          <p className="mt-6 text-lg text-green-100 max-w-2xl mx-auto leading-relaxed">
            SkillSaathi helps students and families understand vocational career options, training routes,
            and next steps — with verified information, AI counselling and human support.
          </p>
          <p className="mt-1 text-sm text-green-200">
            Hindi and English supported · Source-backed information · Free to use
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/careers" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-semibold text-green-700 shadow-lg hover:bg-green-50 transition-colors">
              Explore Careers <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/assessment" className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-800/50 px-6 py-3 text-base font-semibold text-white border border-white/30 hover:bg-green-800/70 transition-colors backdrop-blur-sm">
              Take Assessment
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-4">
                <p className="text-3xl font-extrabold text-green-700">{stat.value}</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{stat.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="section-title">Everything You Need for Career Guidance</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              From exploring careers to booking a counsellor — all in one place, with verified information.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <Link
                  key={f.to}
                  to={f.to}
                  className="card group flex flex-col gap-4 hover:border-green-200 hover:shadow-md transition-all duration-200"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${f.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{f.title}</h3>
                    <p className="mt-1 text-sm text-gray-500 leading-relaxed">{f.description}</p>
                  </div>
                  <div className="mt-auto flex items-center gap-1 text-sm font-medium text-green-600">
                    Explore <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Careers */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Featured Career Profiles</h2>
              <p className="mt-1 text-sm text-gray-500">
                Source-verified vocational careers
                {USE_MOCK && <span className="ml-2 badge-amber">Sample Data</span>}
              </p>
            </div>
            <Link to="/careers" className="btn-secondary hidden sm:flex">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCareers.map((c) => (
              <Link
                key={c.id}
                to={`/careers/${c.id}`}
                className="card group flex flex-col gap-3 hover:border-green-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                    <BookOpen className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="badge-blue">{c.category}</span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{c.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{c.overview}</p>
                <div className="mt-auto flex items-center justify-end">
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link to="/careers" className="btn-primary">View All Careers</Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-green-700 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-2xl font-bold mb-10">How SkillSaathi Works</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: '1', title: 'Explore Careers', desc: 'Browse 5+ verified vocational career profiles with eligibility and training details.' },
              { step: '2', title: 'Take Assessment', desc: 'Answer questions about your background and interests to get personalised suggestions.' },
              { step: '3', title: 'Get AI Guidance', desc: 'Ask our AI counsellor source-grounded questions in Hindi or English.' },
              { step: '4', title: 'Connect with a Counsellor', desc: 'Book a Google Meet with a human counsellor for personalised support.' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-xl font-bold">
                  {s.step}
                </div>
                <h3 className="font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-green-100">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-amber-50 border-t border-amber-100 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              <strong>Important:</strong> SkillSaathi provides career information and guidance based on verified public sources.
              It does not guarantee employment, salary, placement or career outcomes. Career data is sourced from government portals
              (NSDC, DGET, MNRE) and sector skill councils. Consult a qualified counsellor for personal decisions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
