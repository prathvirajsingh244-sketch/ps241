import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, RefreshCw, AlertTriangle, Star } from 'lucide-react';
import type { AssessmentResult } from '../types';
import CareerCard from '../components/CareerCard';
import EmptyState from '../components/EmptyState';
import PageWrapper from '../components/PageWrapper';

export default function AssessmentResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = (location.state as { result?: AssessmentResult })?.result;

  if (!result) {
    return (
      <PageWrapper>
        <EmptyState
          title="No results found"
          message="Please complete the assessment to see your results."
          action={{ label: 'Take Assessment', onClick: () => navigate('/assessment') }}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-green-50 mx-auto mb-4">
            <Star className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Your Career Suggestions</h1>
          <p className="mt-3 text-gray-500 max-w-md mx-auto">
            Based on your responses, here are {result.suggested_careers.length} vocational careers that may suit you.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mb-8 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            <strong>Important:</strong> These suggestions are guidance based on your answers, not a guaranteed career match or endorsement.
            Verify details with official sources. Consult a human counsellor for personalised decisions.
          </p>
        </div>

        {/* Results */}
        {result.suggested_careers.length === 0 ? (
          <EmptyState
            title="No specific suggestions"
            message="Based on your answers, we couldn't identify specific career matches. Try exploring the career directory or speaking with a counsellor."
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {result.suggested_careers.map((c) => (
              <CareerCard key={c.id} career={c} />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button onClick={() => navigate('/assessment')} className="btn-secondary gap-2">
            <RefreshCw className="h-4 w-4" /> Retake Assessment
          </button>
          <Link to="/careers" className="btn-primary gap-2">
            Browse All Careers <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/counselling" className="btn-ghost">
            Ask AI Counsellor
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
