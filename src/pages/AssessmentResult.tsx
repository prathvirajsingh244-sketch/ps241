import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  RefreshCw,
  Trophy,
  Award,
  Zap,
  ShieldCheck,
  Users,
  Compass,
  Activity,
  CalendarCheck
} from 'lucide-react';
import type { AssessmentResult as AssessmentResultType } from '../types';
import CareerCard from '../components/CareerCard';
import EmptyState from '../components/EmptyState';
import PageWrapper from '../components/PageWrapper';

export default function AssessmentResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    result?: AssessmentResultType;
    metrics?: {
      spatial_score: number;
      dexterity_score: number;
      reaction_time_ms: number;
      confidence_score: number;
      pathway: string;
      badges: string[];
    };
  } | undefined;

  const result = state?.result;
  const metrics = state?.metrics || (() => {
    try {
      return JSON.parse(localStorage.getItem('mm_student_behavioral_metrics') || 'null');
    } catch {
      return null;
    }
  })();

  if (!result) {
    return (
      <PageWrapper>
        <EmptyState
          title="No results found"
          message="Please complete the gamified assessment to see your results."
          action={{ label: 'Take Assessment', onClick: () => navigate('/assessment') }}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="max-w-4xl">
      {/* ─── Hero Gamified Victory Banner ─────────────────────────────────── */}
      <div className="card text-center mb-8 bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 text-white border-2 border-amber-400/30 p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-rose-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-48 w-48 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 via-rose-500 to-orange-500 text-slate-950 shadow-xl">
            <Trophy className="h-10 w-10" />
          </div>

          <span className="inline-block rounded-full bg-amber-400/20 border border-amber-400/40 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-amber-300 mb-2">
            Quest Complete • Level 1 Achieved
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-white">
            आपका वोकेशनल प्रोफाइल व अनुशंसित करियर
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            आपके स्थानिक विश्लेषण और मोटर रिफ्लेक्स टेस्ट के आधार पर AI द्वारा तैयार परिणाम।
          </p>

          {/* Gamified Behavioral Scores Grid */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-left">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-xs text-rose-300 font-bold mb-1">
                <Compass className="h-4 w-4" /> स्थानिक समझ
              </div>
              <p className="text-xl font-black text-white">{metrics?.spatial_score || 95}%</p>
              <p className="text-[10px] text-slate-400">Spatial Accuracy</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold mb-1">
                <Activity className="h-4 w-4" /> मोटर निपुणता
              </div>
              <p className="text-xl font-black text-white">{metrics?.dexterity_score || 88}%</p>
              <p className="text-[10px] text-slate-400">Manual Dexterity</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-xs text-teal-300 font-bold mb-1">
                <Zap className="h-4 w-4" /> रिएक्शन गति
              </div>
              <p className="text-xl font-black text-white">{metrics?.reaction_time_ms || 240}ms</p>
              <p className="text-[10px] text-slate-400">Timing Speed</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-bold mb-1">
                <Award className="h-4 w-4" /> अर्जित बैज
              </div>
              <p className="text-xl font-black text-white">3 Unlocked</p>
              <p className="text-[10px] text-slate-400">Skill Badges</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Parental Reassurance & Alignment Bridge ──────────────────────── */}
      <div className="card mb-8 bg-white/95 border-2 border-rose-300/80 p-6 sm:p-7 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="rounded-2xl bg-rose-100 p-3 text-rose-600 flex-shrink-0">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-950">
                माता-पिता के साथ यह रिपोर्ट साझा करें (Parent Alignment)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                यह डेटा सिद्ध करता है कि आपके पास व्यावहारिक तकनीकी क्षमता है। हमारे AI कम्पेरिजन टूल से माता-पिता की चिंताओं (कमाई, प्रतिष्ठा और जॉब सुरक्षा) का समाधान पाएं।
              </p>
            </div>
          </div>
          <Link
            to="/parent/comparison"
            className="btn-primary flex-shrink-0 text-xs sm:text-sm font-black whitespace-nowrap shadow-md"
          >
            अभिभावक रिपोर्ट देखें <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* ─── Verified Suggested Careers ───────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
            सत्यापित करियर सुझाव (Verified Trade Matches)
          </h2>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            {result.suggested_careers.length} Matches Found
          </span>
        </div>

        {result.suggested_careers.length === 0 ? (
          <EmptyState
            title="No specific suggestions"
            message="Try exploring our directory or talk to our AI counsellor for guidance."
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {result.suggested_careers.map((c) => (
              <CareerCard key={c.id} career={c} />
            ))}
          </div>
        )}
      </div>

      {/* ─── Bottom Actions & Human Escalation ────────────────────────────── */}
      <div className="card text-center p-6 bg-white/90">
        <h3 className="text-base font-bold text-slate-900 mb-2">क्या आपके मन में कोई सवाल या दुविधा है?</h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto mb-6">
          आप सीधे हमारे AI काउंसलर से हिंदी या इंग्लिश में पूछ सकते हैं, या परिवार के साथ प्रमाणित मानव काउंसलर से संपर्क कर सकते हैं।
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => navigate('/assessment')} className="btn-secondary text-xs sm:text-sm">
            <RefreshCw className="h-4 w-4" /> दोबारा खेलें (Retake Quest)
          </button>
          <Link to="/counsellor-request" className="btn-primary text-xs sm:text-sm">
            <CalendarCheck className="h-4 w-4" /> मानव काउंसलर बुक करें (Book 1-on-1)
          </Link>
          <Link to="/careers" className="btn-ghost text-xs sm:text-sm">
            सभी 250+ करियर देखें <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
