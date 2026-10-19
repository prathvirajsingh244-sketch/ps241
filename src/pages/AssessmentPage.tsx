import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Volume2 } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import {
  ASSESSMENT_QUESTIONS,
  calculateAssessmentResult,
  type AssessmentAnswerMap,
} from '../utils/assessmentLogic';

const TOTAL_QUESTIONS = ASSESSMENT_QUESTIONS.length;

export default function AssessmentPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswerMap>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  useEffect(() => {
    const saved = localStorage.getItem('mm_platform_lang') as 'en' | 'hi' | null;
    if (saved) {
      setLang(saved);
    }

    const onLangChange = () => {
      const updated = localStorage.getItem('mm_platform_lang') as 'en' | 'hi' | null;
      if (updated) {
        setLang(updated);
      }
    };

    window.addEventListener('mm_language_changed', onLangChange);
    return () => window.removeEventListener('mm_language_changed', onLangChange);
  }, []);

  const currentQuestion = ASSESSMENT_QUESTIONS[current];
  const progressPercent = Math.round(((current + 1) / TOTAL_QUESTIONS) * 100);
  const isCurrentAnswered = Boolean(answers[currentQuestion.id]);

  const handleSelectOption = (questionId: string, value: string) => {
    const nextAnswers = { ...answers, [questionId]: value };
    setAnswers(nextAnswers);

    if (current < TOTAL_QUESTIONS - 1) {
      setCurrent((next) => next + 1);
      return;
    }

    void handleSubmit(nextAnswers);
  };

  const handleSubmit = async (finalAnswers: AssessmentAnswerMap = answers) => {
    setIsSubmitting(true);

    const assessmentResult = calculateAssessmentResult(finalAnswers);
    const recommendedCareers = assessmentResult.recommendations.map((item) => ({
      id: item.careerId,
      title: item.title,
      category: item.category,
      overview: `${item.title} is suggested because your responses point to practical problem-solving and ${item.category.toLowerCase()}-aligned work.`,
      eligibility: 'Career exploration suggestion based on your answers',
      status: 'published' as const,
    }));

    const result = {
      id: `assessment-${Date.now()}`,
      suggested_career_ids: recommendedCareers.map((career) => career.id),
      suggested_careers: recommendedCareers,
      created_at: new Date().toISOString(),
    };

    navigate('/assessment/result', {
      state: {
        result,
        assessmentSummary: assessmentResult,
        metrics: {
          pathway: recommendedCareers[0]?.title ?? 'Career Explorer',
          badges: ['Career fit check'],
        },
      },
    });

    setIsSubmitting(false);
  };

  const speakQuestion = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <PageWrapper className="max-w-3xl">
      <div className="card mb-6 border-slate-200 bg-white/95 p-5 sm:p-6 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] font-black text-emerald-600">MargMitra</p>
            <h1 className="mt-2 text-xl sm:text-2xl font-black text-slate-950">
              {lang === 'hi' ? 'साधारण करियर असेसमेंट' : 'Simple Career Assessment'}
            </h1>
          </div>
          <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {current + 1} of {TOTAL_QUESTIONS}
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-600">
            <span>{currentQuestion.category}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="card p-5 sm:p-8 shadow-xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-slate-600">
            Question {current + 1}
          </span>
          <button
            type="button"
            onClick={() => speakQuestion(lang === 'hi' ? currentQuestion.promptHi : currentQuestion.promptEn)}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
          >
            <Volume2 className="h-3.5 w-3.5" />
            Listen
          </button>
        </div>

        <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
          {lang === 'hi' ? currentQuestion.promptHi : currentQuestion.promptEn}
        </h2>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {currentQuestion.options.map((option) => {
            const isSelected = answers[currentQuestion.id] === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelectOption(currentQuestion.id, option.value)}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50 shadow-sm ring-2 ring-emerald-200'
                    : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40'
                }`}
              >
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl shadow-sm">
                  {option.emoji}
                </div>
                <p className="text-sm font-bold text-slate-900">
                  {lang === 'hi' ? option.labelHi : option.labelEn}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-7 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setCurrent((value) => Math.max(0, value - 1))}
            disabled={current === 0}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>

          <div className="text-xs font-medium text-slate-500">
            {isCurrentAnswered ? 'Answer selected' : 'Choose one option'}
          </div>

          <button
            type="button"
            onClick={() => {
              if (current < TOTAL_QUESTIONS - 1) {
                setCurrent((value) => value + 1);
                return;
              }

              void handleSubmit();
            }}
            disabled={!isCurrentAnswered || isSubmitting}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {current < TOTAL_QUESTIONS - 1 ? 'Next' : 'See results'}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white/80 p-4 text-center text-xs text-slate-500">
        {lang === 'hi'
          ? 'यह असेसमेंट केवल आपकी रुचि और पसंद को समझने के लिए है, न कि किसी निश्चित क्षमता का प्रमाण।'
          : 'This assessment is meant to explore interests and preferences, not to guarantee a fixed aptitude or career outcome.'}
      </div>
    </PageWrapper>
  );
}
