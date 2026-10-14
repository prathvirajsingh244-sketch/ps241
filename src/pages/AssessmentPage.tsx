import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, CheckCircle2, ClipboardList } from 'lucide-react';
import { assessmentApi, parseApiError } from '../services/api';
import type { AssessmentQuestion, AssessmentAnswer } from '../types';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';
import PageWrapper from '../components/PageWrapper';
import MockBanner from '../components/MockBanner';

export default function AssessmentPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    assessmentApi.getQuestions()
      .then(setQuestions)
      .catch((e) => setError(parseApiError(e)))
      .finally(() => setIsLoading(false));
  }, []);

  const handleAnswer = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    setSubmitError('');
    setIsSubmitting(true);
    const payload: AssessmentAnswer[] = questions.map((q) => ({
      question_id: q.id,
      selected_option: answers[q.id] ?? '',
    }));
    try {
      const result = await assessmentApi.submitAttempt({ answers: payload });
      navigate('/assessment/result', { state: { result } });
    } catch (err) {
      setSubmitError(parseApiError(err));
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingState fullPage message="Loading assessment..." />;
  if (error) return <ErrorMessage fullPage message={error} onRetry={() => window.location.reload()} />;

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;
  const allAnswered = questions.every((q) => answers[q.id]);
  const currentAnswered = q ? !!answers[q.id] : false;

  if (!started) {
    return (
      <>
        <MockBanner />
        <PageWrapper>
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-green-50 mx-auto mb-6">
              <ClipboardList className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Career Assessment</h1>
            <p className="mt-4 text-gray-500 leading-relaxed max-w-md mx-auto">
              Answer {questions.length} questions about your preferences, background and interests.
              We\'ll suggest vocational careers that may suit you.
            </p>
            <div className="mt-6 rounded-xl border border-amber-100 bg-amber-50 px-5 py-3 text-sm text-amber-800 text-left">
              <strong>Note:</strong> Suggestions are guidance, not a diagnosis or guaranteed career match.
              Verify details with official sources and consult a counsellor before making decisions.
            </div>
            <button
              id="assessment-start"
              onClick={() => setStarted(true)}
              className="btn-primary mt-8 px-10 py-3 text-base"
            >
              Start Assessment
            </button>
          </div>
        </PageWrapper>
      </>
    );
  }

  return (
    <>
      <MockBanner />
      <PageWrapper>
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>Question {current + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={current + 1}
                aria-valuemin={1}
                aria-valuemax={questions.length}
                aria-label={`Assessment progress: question ${current + 1} of ${questions.length}`}
              />
            </div>
          </div>

          {/* Question card */}
          <div className="card mb-6">
            <p className="text-xs font-medium text-green-600 uppercase tracking-wider mb-3">
              {q.category.replace(/_/g, ' ')}
            </p>
            <h2 className="text-xl font-semibold text-gray-900 mb-6" id={`question-${q.id}`}>
              {q.prompt}
            </h2>

            <div className="space-y-3" role="radiogroup" aria-labelledby={`question-${q.id}`}>
              {q.answer_options.map((option, idx) => {
                const isSelected = answers[q.id] === option;
                return (
                  <button
                    key={idx}
                    id={`answer-${q.id}-${idx}`}
                    onClick={() => handleAnswer(q.id, option)}
                    className={`w-full text-left rounded-xl border-2 px-5 py-4 text-sm font-medium transition-all duration-150 ${
                      isSelected
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    role="radio"
                    aria-checked={isSelected}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                        isSelected ? 'border-green-500 bg-green-500' : 'border-gray-300'
                      }`}>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-white" />}
                      </span>
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          {submitError && (
            <div className="mb-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
              {submitError}
            </div>
          )}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrent((c) => c - 1)}
              disabled={current === 0}
              className="btn-secondary"
              aria-label="Previous question"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            {current < questions.length - 1 ? (
              <button
                onClick={() => setCurrent((c) => c + 1)}
                disabled={!currentAnswered}
                className="btn-primary"
                aria-label="Next question"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                id="assessment-submit"
                onClick={handleSubmit}
                disabled={!allAnswered || isSubmitting}
                className="btn-primary"
              >
                {isSubmitting ? 'Submitting...' : 'See Results'}
              </button>
            )}
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
