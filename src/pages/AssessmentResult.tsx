import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, RefreshCw, ShieldCheck, BookOpen, Sparkles } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import PageWrapper from '../components/PageWrapper';

type AssessmentSummary = {
  recommendations: Array<{
    title: string;
    category: string;
    explanation: string;
    supportingSignals: string[];
    strength: 'strong' | 'explore';
    careerId: string;
  }>;
  missingQuestions: string[];
  questionsAnswered: number;
  totalQuestions: number;
};

export default function AssessmentResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    result?: {
      suggested_careers?: Array<{
        id: string;
        title: string;
        category: string;
        overview: string;
        eligibility: string;
      }>;
    };
    assessmentSummary?: AssessmentSummary;
  } | undefined;

  const summary = state?.assessmentSummary;
  const recommendations = summary?.recommendations ?? [];

  if (!summary || recommendations.length === 0) {
    return (
      <PageWrapper className="max-w-3xl">
        <EmptyState
          title="Not enough evidence for a confident match"
          message="Your answers need more detail for a reliable recommendation. Please retake the assessment or explore the career directory for more options."
          action={{ label: 'Take assessment again', onClick: () => navigate('/assessment') }}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="max-w-4xl">
      <div className="mb-8 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-6 text-white shadow-xl sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 shadow-inner">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-100">Career suggestions</p>
            <h1 className="mt-1 text-2xl font-black sm:text-3xl">Your best-fit careers</h1>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm text-emerald-50">
          These suggestions are based on your answers and the existing MargMitra career profiles. They are exploration ideas, not guaranteed outcomes.
        </p>
      </div>

      <div className="mb-8 grid gap-5">
        {recommendations.map((career) => (
          <div key={career.careerId} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                  {career.strength === 'strong' ? 'Strong match' : 'Explore further'}
                </p>
                <h2 className="mt-2 text-xl font-black text-slate-950">{career.title}</h2>
                <p className="text-sm text-slate-500">{career.category}</p>
              </div>
              <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                Score {career.strength === 'strong' ? 'High' : 'Moderate'}
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-800">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Why this was recommended
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{career.explanation}</p>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500">Supporting signals</p>
              <ul className="space-y-2 text-sm text-slate-600">
                {career.supportingSignals.map((signal) => (
                  <li key={signal} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-base font-black text-slate-900">
          <BookOpen className="h-5 w-5 text-emerald-600" />
          Additional guidance
        </div>
        <p className="text-sm leading-relaxed text-slate-600">
          {summary.questionsAnswered < summary.totalQuestions
            ? `You skipped ${summary.totalQuestions - summary.questionsAnswered} question(s). The recommendation remains answer-based and may improve if you complete the full assessment.`
            : 'You answered all questions, so the recommendation is based on the strongest available matches.'}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button onClick={() => navigate('/assessment')} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700">
          <RefreshCw className="h-4 w-4" /> Retake
        </button>
        <button onClick={() => navigate('/careers')} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
          Explore careers <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </PageWrapper>
  );
}
