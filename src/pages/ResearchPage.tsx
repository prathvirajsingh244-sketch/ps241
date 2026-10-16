import { useState } from 'react';

/* ── data ──────────────────────────────────────────────────────────────────── */

interface ResearchStat {
    id: number;
    icon: string;
    stat: string;
    highlight: string;
    text: string;
    color: string;
    bg: string;
    border: string;
}

interface Reference {
    id: number;
    icon: string;
    title: string;
    detail: string;
    tag: string;
    tagColor: string;
}

const researchStats: ResearchStat[] = [
    {
        id: 1,
        icon: '📊',
        stat: '9.36%',
        highlight: 'professional career guidance',
        text: 'of surveyed students received — over 90% navigate career decisions unsupported',
        color: 'text-rose-600',
        bg: 'bg-rose-50',
        border: 'border-rose-200',
    },
    {
        id: 2,
        icon: '👨‍👩‍👧',
        stat: '30%',
        highlight: 'family members',
        text: 'drive career choices vs. only 13% from teachers — structured counselling largely absent',
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
    },
    {
        id: 3,
        icon: '🗺️',
        stat: '80%',
        highlight: 'aware of just 7 options',
        text: 'of students despite 250+ structured career pathways available in India',
        color: 'text-violet-600',
        bg: 'bg-violet-50',
        border: 'border-violet-200',
    },
    {
        id: 4,
        icon: '🎓',
        stat: '15%',
        highlight: 'understand their career path',
        text: 'of Grade 12 students know required skills, education, or outcomes of their chosen field',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
    },
    {
        id: 5,
        icon: '🔧',
        stat: '14%',
        highlight: 'vocational pathways',
        text: 'considered — reflecting limited exposure beyond conventional career options',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
    },
];

const references: Reference[] = [
    {
        id: 1,
        icon: '🌐',
        title: 'UN Bharat Career Aspirations Study (2025)',
        detail: '21,239 students · Classes 9–12 · 14 districts — only 10.4% received professional guidance',
        tag: 'Survey',
        tagColor: 'bg-blue-100 text-blue-700',
    },
    {
        id: 2,
        icon: '💼',
        title: 'iDreamCareer Bharat Report',
        detail: '5,225 students · 16 states — 13.2% guided; 65% had no backup career plan',
        tag: 'Survey',
        tagColor: 'bg-indigo-100 text-indigo-700',
    },
    {
        id: 3,
        icon: '📚',
        title: 'SCCT — Lent, Brown & Hackett (1994)',
        detail: 'Career choice shaped by self-efficacy, outcome expectations & environment',
        tag: 'Theory',
        tagColor: 'bg-violet-100 text-violet-700',
    },
    {
        id: 4,
        icon: '👪',
        title: 'Parental Career Support Research',
        detail: 'Parental engagement drives career exploration, autonomy & self-efficacy',
        tag: 'Research',
        tagColor: 'bg-amber-100 text-amber-700',
    },
    {
        id: 5,
        icon: '🏛️',
        title: 'National Career Service (NCS), Govt. of India',
        detail: 'Provides aptitude testing, counselling & job-matching — digital guidance infrastructure',
        tag: 'Policy',
        tagColor: 'bg-emerald-100 text-emerald-700',
    },
];

/* ── component ─────────────────────────────────────────────────────────────── */

export default function ResearchPage() {
    const [activeResearch, setActiveResearch] = useState<number | null>(null);
    const [activeRef, setActiveRef] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4 py-10 font-sans">
            {/* ── Header ── */}
            <div className="mx-auto max-w-6xl">
                <div className="mb-10 flex flex-col items-center gap-2 text-center animate-fade-up">
                    <span className="rounded-full bg-indigo-500/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-300 border border-indigo-500/30">
                        मार्गमित्र (MaargMitra)
                    </span>
                    <h1 className="text-4xl font-bold text-white md:text-5xl">
                        Research &amp; <span className="text-indigo-400">References</span>
                    </h1>
                    <p className="max-w-xl text-sm text-slate-400">
                        Evidence-based insights driving the MaargMitra career counselling platform
                    </p>
                </div>

                {/* ── Two-column layout ── */}
                <div className="grid gap-6 lg:grid-cols-2">

                    {/* ── LEFT: Research Stats ── */}
                    <section>
                        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-indigo-400">
                            <span className="h-px flex-1 bg-indigo-800" />
                            📌 Key Research Findings
                            <span className="h-px flex-1 bg-indigo-800" />
                        </h2>

                        <div className="flex flex-col gap-3">
                            {researchStats.map((s, i) => (
                                <button
                                    key={s.id}
                                    onClick={() => setActiveResearch(activeResearch === s.id ? null : s.id)}
                                    className={`group w-full rounded-xl border p-4 text-left transition-all duration-300
                    ${activeResearch === s.id
                                            ? `${s.bg} ${s.border} shadow-lg scale-[1.01]`
                                            : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                                        }`}
                                    style={{ animationDelay: `${i * 80}ms` }}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Big stat */}
                                        <div className="flex-shrink-0 text-center min-w-[60px]">
                                            <div className={`text-2xl font-extrabold tabular-nums leading-tight
                        ${activeResearch === s.id ? s.color : 'text-white'}`}>
                                                {s.stat}
                                            </div>
                                        </div>

                                        {/* Text */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm leading-snug">
                                                <span className={`font-semibold ${activeResearch === s.id ? s.color : 'text-indigo-300'}`}>
                                                    {s.highlight}
                                                </span>{' '}
                                                <span className={activeResearch === s.id ? 'text-gray-700' : 'text-slate-300'}>
                                                    {s.text}
                                                </span>
                                            </p>
                                        </div>

                                        {/* Icon */}
                                        <span className="text-xl flex-shrink-0">{s.icon}</span>
                                    </div>

                                    {/* Expand hint */}
                                    {activeResearch !== s.id && (
                                        <div className="mt-2 text-right text-[10px] text-slate-500 group-hover:text-slate-400">
                                            click for detail ▾
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* ── RIGHT: References ── */}
                    <section>
                        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-indigo-400">
                            <span className="h-px flex-1 bg-indigo-800" />
                            📎 References
                            <span className="h-px flex-1 bg-indigo-800" />
                        </h2>

                        <div className="flex flex-col gap-3">
                            {references.map((r, i) => (
                                <button
                                    key={r.id}
                                    onClick={() => setActiveRef(activeRef === r.id ? null : r.id)}
                                    className={`group w-full rounded-xl border p-4 text-left transition-all duration-300
                    ${activeRef === r.id
                                            ? 'border-indigo-400 bg-indigo-900/60 shadow-lg scale-[1.01]'
                                            : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                                        }`}
                                    style={{ animationDelay: `${i * 80}ms` }}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl flex-shrink-0">{r.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <p className={`text-sm font-semibold leading-tight
                          ${activeRef === r.id ? 'text-indigo-200' : 'text-white'}`}>
                                                    {r.title}
                                                </p>
                                                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${r.tagColor}`}>
                                                    {r.tag}
                                                </span>
                                            </div>

                                            {/* Detail expands on click */}
                                            <div className={`overflow-hidden transition-all duration-300
                        ${activeRef === r.id ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                                                    {r.detail}
                                                </p>
                                            </div>

                                            {activeRef !== r.id && (
                                                <p className="text-[11px] text-slate-500 group-hover:text-slate-400 mt-0.5">
                                                    click to expand ▾
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>
                </div>

                {/* ── Bottom Summary Bar ── */}
                <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 animate-fade-up">
                    {[
                        { label: 'Students Surveyed', value: '26K+', icon: '👥' },
                        { label: 'States Covered', value: '16', icon: '🗺️' },
                        { label: 'Career Pathways', value: '250+', icon: '🛤️' },
                        { label: 'Guidance Gap', value: '>86%', icon: '📉' },
                    ].map((m) => (
                        <div
                            key={m.label}
                            className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm
                         hover:bg-white/10 hover:border-indigo-400/40 transition-all duration-300 hover:scale-105"
                        >
                            <div className="text-2xl mb-1">{m.icon}</div>
                            <div className="text-2xl font-extrabold text-indigo-300">{m.value}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{m.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
