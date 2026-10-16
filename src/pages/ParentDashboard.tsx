import { Link } from 'react-router-dom';
import { ClipboardList, BarChart2, CalendarCheck, ArrowRight, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const actions = [
    {
        icon: ClipboardList,
        title: 'My Expectations',
        desc: 'Tell us your salary expectations, preferred field, and future goals for your child.',
        to: '/parent/expectations',
        color: 'from-violet-500 to-purple-600',
        bg: 'bg-violet-50',
        text: 'text-violet-600',
        cta: 'Fill Form',
    },
    {
        icon: BarChart2,
        title: 'AI Comparison Report',
        desc: 'See how your expectations align with your child\'s assessment results — with AI insights.',
        to: '/parent/comparison',
        color: 'from-blue-500 to-indigo-600',
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        cta: 'View Report',
    },
    {
        icon: CalendarCheck,
        title: 'Book a Counsellor',
        desc: 'If there\'s a mismatch or confusion, book a session with a human career counsellor.',
        to: '/counsellor-request',
        color: 'from-emerald-500 to-teal-600',
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        cta: 'Book Now',
    },
];

export default function ParentDashboard() {
    const { user } = useAuth();
    const firstName = user?.display_name?.split(' ')[0] ?? 'Parent';

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50">
            {/* Hero */}
            <div className="bg-gradient-to-r from-violet-700 to-purple-600 text-white px-4 py-10 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl animate-fade-up">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold">
                            {firstName[0]}
                        </div>
                        <div>
                            <p className="text-violet-200 text-sm flex items-center gap-1">
                                Parent Portal <Heart className="h-3.5 w-3.5 text-pink-300" />
                            </p>
                            <h1 className="text-2xl font-bold">{user?.display_name ?? 'Parent'}</h1>
                        </div>
                    </div>
                    <p className="text-violet-100 mt-3 text-sm max-w-xl">
                        Stay informed about your child's career journey. Set your expectations, view the AI comparison,
                        and connect with a counsellor if needed.
                    </p>
                </div>
            </div>

            {/* Action cards */}
            <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
                <h2 className="text-lg font-bold text-gray-800 mb-5">What would you like to do?</h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    {actions.map((a) => {
                        const Icon = a.icon;
                        return (
                            <Link
                                key={a.to}
                                to={a.to}
                                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm
                           hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
                            >
                                <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${a.color} rounded-t-2xl`} />
                                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${a.bg}`}>
                                    <Icon className={`h-6 w-6 ${a.text}`} />
                                </div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-violet-700 transition-colors">{a.title}</h3>
                                <p className="mt-2 text-xs text-gray-500 leading-relaxed flex-1">{a.desc}</p>
                                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-violet-600">
                                    {a.cta} <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Info note */}
                <div className="mt-8 rounded-2xl border border-violet-100 bg-violet-50 p-5">
                    <p className="text-sm text-violet-800">
                        <strong>How it works:</strong> Fill in your expectations → we compare them with your child's assessment →
                        book a counsellor if the AI flags a mismatch. All information is kept private.
                    </p>
                </div>
            </div>
        </div>
    );
}
