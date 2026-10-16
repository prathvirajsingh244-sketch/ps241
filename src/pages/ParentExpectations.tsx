import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Loader2,
  ArrowLeft,
  Users,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  IndianRupee,
  Briefcase
} from 'lucide-react';
import { api } from '../services/api';
import PageWrapper from '../components/PageWrapper';

export default function ParentExpectations() {
  const navigate = useNavigate();
  const [studentInterest, setStudentInterest] = useState<any>(null);

  // Form states matching PS concerns
  const [salaryExpectation, setSalaryExpectation] = useState('₹20,000–₹35,000 / month');
  const [securityPreference, setSecurityPreference] = useState('Government PSU / Permanent Technical Job (Railways, BHEL)');
  const [socialPerceptionConcern, setSocialPerceptionConcern] = useState('Worried that relatives will think it is inferior to B.Tech/General Degree');
  const [degreeAmbition, setDegreeAmbition] = useState('Yes, want NSQF Lateral Route to Polytechnic Diploma & B.Tech');
  const [familyIncomeBracket, setFamilyIncomeBracket] = useState('₹15,000–₹35,000 / month household income');
  const locationPreference = 'Within home district or nearby city (< 50 km)';
  const parentNotes = '';

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  // Read student assessment result if completed
  useEffect(() => {
    try {
      const metrics = JSON.parse(localStorage.getItem('mm_student_behavioral_metrics') || 'null');
      if (metrics) setStudentInterest(metrics);
    } catch {
      // ignore
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      salary_range: salaryExpectation,
      preferred_field: studentInterest?.pathway ? studentInterest.pathway : 'Engineering & Technology',
      future_goal: securityPreference,
      notes: `Perception: ${socialPerceptionConcern}. Degree: ${degreeAmbition}. Income: ${familyIncomeBracket}. Location: ${locationPreference}. Notes: ${parentNotes}`,
    };

    try {
      // Send to teammate's backend
      await api.post('/parent/expectations', payload);
      // Cache locally for instant point-by-point AI comparison
      localStorage.setItem('mm_parent_expectations_cached', JSON.stringify(payload));
      setDone(true);
    } catch {
      // Fallback cache so the user is never blocked
      localStorage.setItem('mm_parent_expectations_cached', JSON.stringify(payload));
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <PageWrapper className="max-w-xl">
        <div className="card text-center py-12 px-6 animate-fade-up">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600 shadow-md">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
            अभिभावक विवरण सहेज लिया गया! (Concerns Recorded)
          </h2>
          <p className="mt-3 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            हमारे AI ने आपकी प्राथमिकताओं और आपके बच्चे के असेसमेंट स्कोर का तुलनात्मक विश्लेषण तैयार कर लिया है।
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/parent/comparison')}
              className="btn-primary text-sm font-black px-6 py-3 shadow-lg"
            >
              AI तुलना रिपोर्ट देखें (View Comparison Report) 📊
            </button>
            <button onClick={() => navigate('/parent')} className="btn-secondary text-sm font-bold">
              डैशबोर्ड पर लौटें
            </button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="max-w-2xl">
      <button
        onClick={() => navigate('/parent')}
        className="mb-4 flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-950 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> अभिभावक डैशबोर्ड पर वापस जाएं (Back to Dashboard)
      </button>

      {/* ─── Child's Assessment Summary Header ───────────────────────────── */}
      {studentInterest && (
        <div className="card mb-6 border-2 border-amber-300 bg-amber-50/70 p-5 shadow-md animate-fade-up">
          <div className="flex items-center gap-2.5 mb-2">
            <Sparkles className="h-5 w-5 text-amber-600" />
            <span className="text-xs font-black uppercase text-amber-900 tracking-wider">
              आपके बच्चे का असेसमेंट परिणाम (Child's Interest Profile)
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-950 capitalize">
            रुचि शाखा: {studentInterest.pathway} (स्थानिक स्कोर: {studentInterest.spatial_score}%, मोटर निपुणता: {studentInterest.dexterity_score}%)
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            आपके बच्चे ने हैंड्स-ऑन वोकेशनल परीक्षण में उत्कृष्ट तकनीकी समझ प्रदर्शित की है। कृपया अपनी प्राथमिकताएं नीचे दर्ज करें ताकि AI एक संतुलित रास्ता निकाल सके।
          </p>
        </div>
      )}

      {/* ─── Main AI Guided Form ─────────────────────────────────────────── */}
      <div className="card p-6 sm:p-8 shadow-xl">
        <div className="border-b border-slate-200 pb-4 mb-6">
          <span className="rounded-full bg-rose-100 text-rose-900 px-3 py-1 text-xs font-black uppercase tracking-wider">
            Family Decision Support Form
          </span>
          <h1 className="text-2xl font-black text-slate-950 mt-2">
            अभिभावक प्राथमिकता एवं संशय निवारण प्रपत्र
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            सैलरी, जॉब सुरक्षा, सामाजिक प्रतिष्ठा और आगे की पढ़ाई से संबंधित अपने विचार साझा करें।
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Salary Expectation */}
          <div className="form-field">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <IndianRupee className="h-4 w-4 text-emerald-600" />
              1. आप अपने बच्चे के लिए कोर्स के बाद कितनी न्यूनतम मासिक कमाई की उम्मीद करते हैं?
            </label>
            <select
              value={salaryExpectation}
              onChange={(e) => setSalaryExpectation(e.target.value)}
              className="mt-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:border-rose-500 focus:outline-none shadow-sm"
            >
              <option value="₹15,000–₹22,000 / month">₹15,000–₹22,000 / माह (प्रारंभिक स्तर + अप्रेंटिसशिप)</option>
              <option value="₹20,000–₹35,000 / month">₹20,000–₹35,000 / माह (कुशल तकनीशियन स्तर)</option>
              <option value="₹35,000–₹50,000+ / month">₹35,000–₹50,000+ / माह (2-3 साल बाद या स्वतंत्र ठेकेदारी)</option>
              <option value="Not concerned about initial salary">शुरुआत में सीखने पर ध्यान, सैलरी बाद में</option>
            </select>
          </div>

          {/* 2. Job Security & Government Opportunities */}
          <div className="form-field">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-rose-600" />
              2. आपके अनुसार रोजगार का कौन सा माध्यम सबसे सुरक्षित रहेगा?
            </label>
            <select
              value={securityPreference}
              onChange={(e) => setSecurityPreference(e.target.value)}
              className="mt-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:border-rose-500 focus:outline-none shadow-sm"
            >
              <option value="Government PSU / Permanent Technical Job (Railways, BHEL)">
                सरकारी नौकरी / रेलवे / BHEL / रक्षा संस्थान में तकनीकी पद
              </option>
              <option value="Reputed Private Industry (Tata, Maruti, L&T)">
                प्रतिष्ठित निजी कंपनी (जैसे टाटा, मारुति, लार्सन एंड टुब्रो)
              </option>
              <option value="Self-Employment / Contracting Firm">
                स्वयं का सर्विस सेंटर या ठेकेदारी व्यवसाय
              </option>
              <option value="Quick Job within 6 months">
                6 महीने के भीतर तुरंत रोजगार शुरू होना चाहिए
              </option>
            </select>
          </div>

          {/* 3. Social Status & Relatives Perception */}
          <div className="form-field">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Users className="h-4 w-4 text-indigo-600" />
              3. क्या आपके मन में वोकेशनल/ITI शिक्षा को लेकर सामाजिक प्रतिष्ठा (Social Status) की चिंता है?
            </label>
            <select
              value={socialPerceptionConcern}
              onChange={(e) => setSocialPerceptionConcern(e.target.value)}
              className="mt-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:border-rose-500 focus:outline-none shadow-sm"
            >
              <option value="Worried that relatives will think it is inferior to B.Tech/General Degree">
                हाँ, चिंता है कि रिश्तेदार सोचेंगे कि डिग्री न करके छोटा काम कर रहा है
              </option>
              <option value="Want to ensure it is modern high-tech engineering work, not manual labour">
                चिंता है कि काम आधुनिक व सुरक्षित होना चाहिए, न कि केवल मजदूरी
              </option>
              <option value="No concern as long as child is earning well and happy">
                कोई सामाजिक चिंता नहीं, बस बच्चा आत्मनिर्भर और खुश होना चाहिए
              </option>
            </select>
          </div>

          {/* 4. Higher Education / Degree Continuation */}
          <div className="form-field">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-amber-600" />
              4. क्या आप चाहते हैं कि आपका बच्चा ITI के बाद आगे डिप्लोमा या इंजीनियरिंग डिग्री (B.Tech/B.Voc) भी कर सके?
            </label>
            <select
              value={degreeAmbition}
              onChange={(e) => setDegreeAmbition(e.target.value)}
              className="mt-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:border-rose-500 focus:outline-none shadow-sm"
            >
              <option value="Yes, want NSQF Lateral Route to Polytechnic Diploma & B.Tech">
                हाँ, आगे की पढ़ाई का रास्ता खुला होना चाहिए (लेटरल एंट्री द्वारा डिग्री)
              </option>
              <option value="Skill certification and job are sufficient for now">
                अभी के लिए सर्टिफिकेशन और नौकरी ही पर्याप्त है
              </option>
            </select>
          </div>

          {/* 5. Family Income Context */}
          <div className="form-field">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Briefcase className="h-4 w-4 text-teal-600" />
              5. आपके परिवार की मासिक आय का दायरा (कोर्स फीस व स्कॉलरशिप सुझाव के लिए):
            </label>
            <select
              value={familyIncomeBracket}
              onChange={(e) => setFamilyIncomeBracket(e.target.value)}
              className="mt-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:border-rose-500 focus:outline-none shadow-sm"
            >
              <option value="Below ₹15,000 / month (Need fully free / PMKVY / Govt scholarship)">
                ₹15,000 से कम (पूर्ण सरकारी सब्सिडी / छात्रवृत्ति आवश्यक)
              </option>
              <option value="₹15,000–₹35,000 / month">₹15,000 से ₹35,000 प्रति माह</option>
              <option value="₹35,000–₹70,000 / month">₹35,000 से ₹70,000 प्रति माह</option>
              <option value="Above ₹70,000 / month">₹70,000 से अधिक प्रति माह</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 text-sm font-black shadow-xl mt-4"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'प्राथमिकताएं सहेजें व AI तुलना रिपोर्ट देखें 🚀'}
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}
