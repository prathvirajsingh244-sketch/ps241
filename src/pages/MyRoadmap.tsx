import { useEffect, useState } from 'react';
import { CheckCircle, Circle, Loader2, Clock, ArrowLeft, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface Step { step: number; title: string; description: string; duration: string; completed: boolean; }
interface Roadmap { career_title: string; steps: Step[] }

export default function MyRoadmap() {
    const navigate = useNavigate();
    const [data, setData] = useState<Roadmap | null>(null);
    const [loading, setLoading] = useState(true);
    const [steps, setSteps] = useState<Step[]>([]);

    useEffect(() => {
        api.get('/roadmap/me')
            .then(r => { setData(r.data); setSteps(r.data.steps); })
            .catch(() => {
                // Fallback mock roadmap
                const mock: Roadmap = {
                    career_title: 'Your Career Path',
                    steps: [
                        { step: 1, title: 'Complete Class 10', description: 'Pass Class 10 with Science and Mathematics.', duration: 'As applicable', completed: true },
                        { step: 2, title: 'Apply to ITI', description: 'Fill ITI admission form. Deadline usually June–July.', duration: '1 month', completed: false },
                        { step: 3, title: 'Complete ITI Trade (2 years)', description: 'Complete your trade course covering practical skills.', duration: '2 years', completed: false },
                        { step: 4, title: 'NCVT Certification', description: 'Appear for certification exam after ITI.', duration: '2 months', completed: false },
                        { step: 5, title: 'Apprenticeship', description: 'Join apprenticeship at a company.', duration: '1 year', completed: false },
                        { step: 6, title: 'First Job', description: 'Apply for jobs or start as an independent contractor.', duration: 'Ongoing', completed: false },
                    ]
                };
                setData(mock); setSteps(mock.steps);
            })
            .finally(() => setLoading(false));
    }, []);

    const toggle = (idx: number) =>
        setSteps(s => s.map((st, i) => i === idx ? { ...st, completed: !st.completed } : st));

    const done = steps.filter(s => s.completed).length;
    const pct = steps.length ? Math.round((done / steps.length) * 100) : 0;

    if (loading) return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
    );

    return (
        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 animate-fade-up">
            <button onClick={() => navigate('/dashboard')} className="mb-6 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </button>

            {/* Header */}
            <div className="card mb-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">My Roadmap</h1>
                        <p className="text-sm text-gray-500 mt-1">{data?.career_title}</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2">
                        <Zap className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-bold text-emerald-700">{done}/{steps.length} steps</span>
                    </div>
                </div>
                {/* Progress bar */}
                <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span><span>{pct}%</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                </div>
                {pct === 100 && (
                    <div className="mt-4 flex items-center gap-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 p-3.5 text-white shadow-md animate-fade-up">
                        <span className="text-2xl">🏆</span>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-emerald-100">Milestone Complete!</p>
                            <p className="text-sm font-semibold">You've completed your entire career preparation pathway!</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Steps */}
            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />
                <div className="flex flex-col gap-4">
                    {steps.map((s, i) => (
                        <div
                            key={s.step}
                            className={`relative flex gap-4 rounded-2xl border p-4 transition-all duration-300 cursor-pointer
                ${s.completed ? 'border-emerald-200 bg-emerald-50' : 'border-gray-100 bg-white hover:border-emerald-200 hover:shadow-sm'}`}
                            onClick={() => toggle(i)}
                        >
                            {/* Icon */}
                            <div className={`relative z-10 flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full border-2
                ${s.completed ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-300 bg-white text-gray-400'}`}>
                                {s.completed
                                    ? <CheckCircle className="h-5 w-5" />
                                    : <Circle className="h-5 w-5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                    <h3 className={`text-sm font-semibold ${s.completed ? 'text-emerald-700 line-through decoration-emerald-400' : 'text-gray-900'}`}>
                                        Step {s.step}: {s.title}
                                    </h3>
                                    <span className="flex items-center gap-1 text-[11px] text-gray-400">
                                        <Clock className="h-3 w-3" />{s.duration}
                                    </span>
                                </div>
                                <p className="mt-1 text-xs text-gray-500 leading-relaxed">{s.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <p className="mt-6 text-center text-xs text-gray-400">Click any step to mark as complete / incomplete</p>
        </div>
    );
}
