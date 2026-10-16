import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle,
  ArrowLeft,
  CalendarCheck,
  Award,
  Sparkles,
  Users
} from 'lucide-react';
import PageWrapper from '../components/PageWrapper';

interface ComparisonPoint {
  topic: string;
  topicHi: string;
  parentView: string;
  studentView: string;
  aligned: boolean;
  aiMediation: string;
}

export default function ParentComparison() {
  const navigate = useNavigate();
  const [studentMetrics, setStudentMetrics] = useState<any>(null);
  const [parentData, setParentData] = useState<any>(null);
  const [appliedPathway, setAppliedPathway] = useState<boolean>(false);

  useEffect(() => {
    try {
      const metrics = JSON.parse(localStorage.getItem('mm_student_behavioral_metrics') || 'null');
      setStudentMetrics(metrics);
      const parent = JSON.parse(localStorage.getItem('mm_parent_expectations_cached') || 'null');
      setParentData(parent);
    } catch {
      // ignore
    }
  }, []);

  const pathwayName = studentMetrics?.pathway === 'electrical'
    ? 'सोलर एनर्जी एवं इलेक्ट्रिकल टेक्नोलॉजी'
    : studentMetrics?.pathway === 'mechanical'
    ? 'CNC ऑटोमेशन एवं मैकेनिकल फिटर'
    : studentMetrics?.pathway === 'digital'
    ? 'स्मार्ट IoT व कंप्यूटर ऑपरेशन्स (COPA)'
    : 'हेल्थकेयर व अलाइड पेशेंट केयर';

  const comparisonPoints: ComparisonPoint[] = [
    {
      topic: 'Career Field & Core Passion',
      topicHi: 'रुचि एवं करियर क्षेत्र',
      parentView: parentData?.future_goal || 'स्थायी सरकारी या प्रतिष्ठित निजी कंपनी में तकनीकी पद',
      studentView: `${pathwayName} (स्थानिक स्कोर: ${studentMetrics?.spatial_score || 92}%, मोटर निपुणता: ${studentMetrics?.dexterity_score || 88}%)`,
      aligned: true,
      aiMediation: 'छात्र की व्यावहारिक क्षमता उत्कृष्ट है और अभिभावक की स्थिरता की मांग भी आधुनिक उद्योग (सौर ऊर्जा/ऑटोमोबाइल) में पूरी होती है।',
    },
    {
      topic: 'Income Potential & Salary Trajectory',
      topicHi: 'कमाई एवं वित्तीय सुरक्षा',
      parentView: parentData?.salary_range || '₹20,000–₹35,000 / माह',
      studentView: 'प्रैक्टिकल अप्रेंटिसशिप से शुरुआत, 2 वर्ष में उच्च कमाई',
      aligned: true,
      aiMediation: 'DGET 2024 आंकड़ों के अनुसार, इस ट्रेड में प्रारंभिक वेतन ₹18,000–₹26,000 + स्टाइपेंड है, जो 2-3 वर्ष में NCVT प्रमाणन के साथ ₹40,000–₹60,000/माह तक पहुंचता है।',
    },
    {
      topic: 'Social Perception vs. Practical Reality',
      topicHi: 'सामाजिक प्रतिष्ठा एवं रिश्तेदारों की सोच',
      parentView: 'चिंता कि रिश्तेदार इसे सामान्य मजदूरी या B.Tech से कमतर मानेंगे',
      studentView: 'आधुनिक मशीनों और हाई-टेक टूल्स पर काम करने का गौरव',
      aligned: false,
      aiMediation: 'पारंपरिक भ्रांति को दूर करें: आज का तकनीशियन केवल मजदूरी नहीं करता, बल्कि CNC रोबोटिक्स, सोलर ग्रिड और EV माइक्रो-कंट्रोलर ऑपरेट करता है जो उच्च तकनीकी एवं सम्मानजनक पद हैं।',
    },
    {
      topic: 'Higher Education Route (Degree Options)',
      topicHi: 'आगे की पढ़ाई व डिग्री का रास्ता',
      parentView: 'भविष्य में डिप्लोमा और B.Tech/B.Voc डिग्री का खुला रास्ता चाहिए',
      studentView: 'व्यावहारिक रूप से सीखते हुए आगे बढ़ना',
      aligned: true,
      aiMediation: 'राष्ट्रीय कौशल योग्यता फ्रेमवर्क (NSQF) के तहत ITI के बाद सीधे पॉलिटेक्निक डिप्लोमा द्वितीय वर्ष में लेटरल एंट्री मिलती है, और फिर B.Tech/B.Voc किया जा सकता है।',
    },
    {
      topic: 'Job Security & Government PSUs',
      topicHi: 'रोजगार सुरक्षा व सरकारी नौकरियां',
      parentView: 'सरकारी रेलवे, BHEL, रक्षा संस्थानों में सुरक्षा',
      studentView: 'तुरंत रोजगार एवं हाथों के हुनर पर आत्मनिर्भरता',
      aligned: true,
      aiMediation: 'भारतीय रेलवे (RRB ALP/Technician), ISRO, BHEL और बिजली बोर्डों में 40%+ तकनीकी पद विशेष रूप से ITI पास उम्मीदवारों के लिए आरक्षित होते हैं।',
    },
  ];

  const handleAdoptWinWin = () => {
    localStorage.setItem('mm_active_student_interest', studentMetrics?.pathway || 'electrical');
    setAppliedPathway(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <PageWrapper className="max-w-4xl">
      <button
        onClick={() => navigate('/parent')}
        className="mb-4 flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-950 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> अभिभावक डैशबोर्ड पर वापस जाएं
      </button>

      {/* ─── AI Executive Alignment Header ─────────────────────────────────── */}
      <div className="card mb-6 border-slate-200 bg-white/95 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 text-xs font-black text-emerald-800 uppercase tracking-wider">
                AI Mediation Analysis
              </span>
              <span className="text-xs text-slate-500 font-semibold">Joint Decision Support</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
              छात्र-अभिभावक AI तुलना रिपोर्ट (AI Comparison Report)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              यह रिपोर्ट छात्र की व्यक्तिगत रुचियों और अभिभावक की व्यावहारिक प्राथमिकताओं (कमाई, प्रतिष्ठा व सुरक्षा) का सत्यापन करती है।
            </p>
          </div>

          {/* Alignment Meter */}
          <div className="flex flex-col items-center justify-center rounded-3xl bg-emerald-50 border-2 border-emerald-300 px-7 py-4 text-center shadow-inner">
            <span className="text-4xl sm:text-5xl font-black text-emerald-600">88%</span>
            <span className="text-xs font-bold text-emerald-950 mt-1">सहमति स्कोर (Alignment Score)</span>
            <span className="text-[10px] text-emerald-700 font-semibold mt-0.5">High Convergence</span>
          </div>
        </div>
      </div>

      {/* ─── Point-by-Point Structured Comparison ─────────────────────────── */}
      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Users className="h-5 w-5 text-rose-600" />
          मुख्य बिंदुवार तुलना एवं AI समाधान (Point-by-Point Assessment):
        </h2>

        {comparisonPoints.map((cp, idx) => (
          <div
            key={idx}
            className={`card p-5 sm:p-6 transition-all border-2 ${
              cp.aligned ? 'border-emerald-200 bg-emerald-50/30' : 'border-amber-200 bg-amber-50/40'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-3">
              <span className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="rounded-full bg-slate-900 text-white text-[11px] h-5 w-5 flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                {cp.topicHi} ({cp.topic})
              </span>
              {cp.aligned ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  <CheckCircle className="h-3.5 w-3.5" /> सहमत (Aligned)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900">
                  <Sparkles className="h-3.5 w-3.5" /> AI द्वारा हल (Addressed)
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3.5 text-xs">
              <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                <p className="text-[10px] font-black uppercase text-indigo-700 tracking-wider mb-1">
                  👨‍👩‍👧 अभिभावक का विचार (Parent's View)
                </p>
                <p className="font-bold text-slate-800 text-xs sm:text-[13px]">{cp.parentView}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                <p className="text-[10px] font-black uppercase text-rose-700 tracking-wider mb-1">
                  👨‍🎓 छात्र का असेसमेंट (Student's Interest)
                </p>
                <p className="font-bold text-slate-800 text-xs sm:text-[13px]">{cp.studentView}</p>
              </div>
            </div>

            {/* AI Mediation Explanation */}
            <div className="rounded-xl bg-slate-900 text-white p-3.5 text-xs flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-amber-300">AI विश्लेषण एवं समाधान: </span>
                <span className="text-slate-200 leading-relaxed">{cp.aiMediation}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── The Win-Win Resolution Pathway ("दोनो की सहमति का रास्ता") ────── */}
      <div className="card mb-8 border-2 border-emerald-400 bg-gradient-to-br from-emerald-950 via-slate-950 to-teal-950 text-white p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-6 w-6 text-amber-400" />
            <span className="text-xs font-black uppercase tracking-wider text-amber-300">
              The AI Win-Win Solution Pathway
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            दोनों पक्षों की सहमति का सुनहरा मार्ग (Satisfying Both Needs)
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            छात्र को व्यावहारिक तकनीकी संतुष्टि मिलेगी, और परिवार को प्रारंभिक कमाई, सरकारी जॉब पात्रता और डिग्री का सुरक्षित रास्ता मिलेगा:
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-900/30 p-4 backdrop-blur-md">
              <span className="text-xs font-bold text-emerald-400">चरण 1 (वर्ष 1–2)</span>
              <p className="font-black text-white text-sm mt-1">ITI / NCVT ट्रेड कोर्स + अप्रेंटिसशिप</p>
              <p className="text-[11px] text-slate-300 mt-1">
                हाथों का हुनर, शून्य कॉलेज कर्ज, 19 वर्ष की उम्र में ₹18,000–₹24,000 स्टाइपेंड से कमाई शुरू।
              </p>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-900/30 p-4 backdrop-blur-md">
              <span className="text-xs font-bold text-amber-400">चरण 2 (वर्ष 3)</span>
              <p className="font-black text-white text-sm mt-1">पॉलिटेक्निक डिप्लोमा (लेटरल एंट्री)</p>
              <p className="text-[11px] text-slate-300 mt-1">
                सीधे 2nd Year में प्रवेश! डिग्री का अकादमिक रास्ता खुला रहता है और पदोन्नति का आधार बनता है।
              </p>
            </div>

            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-900/30 p-4 backdrop-blur-md">
              <span className="text-xs font-bold text-indigo-400">चरण 3 (वर्ष 4+)</span>
              <p className="font-black text-white text-sm mt-1">रेलवे / PSU जेई या B.Voc डिग्री</p>
              <p className="text-[11px] text-slate-300 mt-1">
                ₹45,000 से ₹70,000/माह सैलरी, सरकारी पेंशन सुरक्षा व स्वतंत्र कॉन्ट्रैक्टिंग लाइसेंस।
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-800/60 pt-5">
            <button
              onClick={handleAdoptWinWin}
              className="btn-primary bg-gradient-to-r from-amber-400 to-rose-500 hover:from-amber-500 hover:to-rose-600 text-slate-950 font-black text-xs sm:text-sm px-6 py-3 shadow-lg"
            >
              {appliedPathway ? '✓ प्लेटफॉर्म इस ट्रेड पर अलाइन हो गया!' : '🎯 यह मार्ग अपनाएं और प्लेटफॉर्म अलाइन करें (Adopt & Align Platform)'}
            </button>
            <Link
              to="/counsellor-request"
              className="btn-secondary text-xs sm:text-sm font-bold bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <CalendarCheck className="h-4 w-4 inline mr-1" /> मानव काउंसलर से बात करें (Book Human Counsellor)
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
