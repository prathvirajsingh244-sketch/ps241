import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Volume2, VolumeX, Globe } from 'lucide-react';

const PAGE_NARRATIONS: Record<string, { en: string; hi: string }> = {
  '/': {
    en: 'Welcome to MaargMitra, the AI-powered vocational guidance and family decision-support platform. Explore over 250 verified vocational careers, take our career interest assessment, find government-approved training centres near you, and bridge parent-student expectations with verified industry data.',
    hi: 'मार्गमित्र में आपका स्वागत है। यह विद्यार्थियों और अभिभावकों के लिए AI-संचालित वोकेशनल मार्गदर्शन मंच है। यहाँ 250 से अधिक सत्यापित करियर खोजें, असेसमेंट पूरा करें और नजदीकी सरकारी ITI संस्थान देखें।'
  },
  '/assessment': {
    en: 'Career Assessment Page. Answer these questions about your practical interests, work environment preferences, and career goals. Your responses will discover which vocational trades suit you best and generate a verified profile for your family.',
    hi: 'करियर असेसमेंट पृष्ठ। अपनी व्यावहारिक रुचियों, कार्यशैली और तकनीकी प्राथमिकताओं के आधार पर सवालों के जवाब दें। यह आपके सही वोकेशनल ट्रेड की पहचान करेगा।'
  },
  '/assessment/result': {
    en: 'Your Career Assessment Results. Here are your top verified vocational career suggestions based on your responses, including starting salary data and placement statistics. You can view your roadmap or share this report with your parents.',
    hi: 'करियर असेसमेंट परिणाम। आपके उत्तरों के आधार पर शीर्ष वोकेशनल सुझाव, सत्यापित वेतन और प्लेसमेंट दरें यहाँ प्रदर्शित हैं। आप यह रिपोर्ट अपने माता-पिता के साथ भी साझा कर सकते हैं।'
  },
  '/map': {
    en: 'Hyperlocal Skill Map. Pinpoint government-approved Industrial Training Institutes, PMKVY centres, and local hiring employers near your location. Use the filters to find training facilities in your city.',
    hi: 'हाइपरलोकल स्किल मैप। अपने नजदीकी सरकारी ITI, PMKVY कौशल केंद्र और स्थानीय नौकरियों का विवरण देखें। अपने शहर के अनुसार फिल्टर करें।'
  },
  '/careers': {
    en: 'Vocational Career Directory. Browse verified vocational profiles across solar technology, electrical engineering, CNC machining, digital IT, and healthcare. Review entry criteria, course duration, and wage progression.',
    hi: 'वोकेशनल करियर डायरेक्टरी। सोलर, इलेक्ट्रिकल, CNC मशीनिंग और हेल्थकेयर के 250+ सत्यापित करियर प्रोफाइल, पात्रता और वेतन वृद्धि की जांच करें।'
  },
  '/counselling': {
    en: 'AI Career Counsellor. Ask any question in English or Hindi regarding ITI admissions, salary growth, government job reservations, or family doubts. Get verified answers backed by official datasets.',
    hi: 'AI करियर काउंसलर। ITI एडमिशन, सरकारी नौकरियों, सैलरी और पारिवारिक संशय से संबंधित कोई भी सवाल हिंदी या इंग्लिश में पूछें।'
  },
  '/parent': {
    en: 'Parent Decision Dashboard. Review verified outcome data, employment security, and salary growth for vocational careers. Fill your family expectations to generate an AI comparison report.',
    hi: 'अभिभावक डैशबोर्ड। वोकेशनल शिक्षा में जॉब सुरक्षा, वेतन वृद्धि और भविष्य की संभावनाओं की समीक्षा करें और तुलना रिपोर्ट देखें।'
  },
  '/parent/expectations': {
    en: 'Parent Priorities Form. Share your concerns regarding expected monthly income, job stability, social perception, and higher degree progression to help our AI align family expectations.',
    hi: 'अभिभावक प्राथमिकता प्रपत्र। अपेक्षित वेतन, जॉब सुरक्षा, सामाजिक प्रतिष्ठा और आगे की डिग्री से जुड़े अपने विचार दर्ज करें।'
  },
  '/parent/comparison': {
    en: 'AI Comparison Report. Review a structured point-by-point comparison between your family priorities and your child technical assessment, featuring an AI win-win resolution roadmap.',
    hi: 'AI तुलना रिपोर्ट। अभिभावक प्राथमिकताओं और विद्यार्थी की तकनीकी रुचियों का बिंदुवार विश्लेषण एवं दोनों की सहमति का मार्ग।'
  },
  '/login': {
    en: 'Sign in to your MaargMitra account to access your personalized vocational dashboard and saved career roadmaps.',
    hi: 'अपने मार्गमित्र खाते में लॉगिन करें और अपना करियर डैशबोर्ड देखें।'
  },
  '/signup': {
    en: 'Create your MaargMitra account as a student or parent. Connect with verified career guidance and explore your technical potential.',
    hi: 'विद्यार्थी या अभिभावक के रूप में अपना मार्गमित्र खाता बनाएं और मार्गदर्शन प्राप्त करें।'
  },
};

export default function PageVoiceNarrator() {
  const location = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentLang, setCurrentLang] = useState<'en' | 'hi'>('en');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize language from localStorage or default to English
  useEffect(() => {
    const saved = localStorage.getItem('mm_platform_lang') as 'en' | 'hi' | null;
    if (saved) setCurrentLang(saved);
  }, []);

  const changeLanguage = (lang: 'en' | 'hi') => {
    setCurrentLang(lang);
    localStorage.setItem('mm_platform_lang', lang);
    window.dispatchEvent(new Event('mm_language_changed'));
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    speakPage(lang, false);
  };

  const speakPage = (lang = currentLang, forcePlay = false) => {
    if (!('speechSynthesis' in window)) return;
    if (isMuted && !forcePlay) return;

    window.speechSynthesis.cancel();

    // Match path or fallback to home narration
    const path = location.pathname;
    const match = PAGE_NARRATIONS[path] || {
      en: 'MaargMitra Vocational Guidance Platform. Empowering students and parents with verified vocational outcome data and AI career counselling.',
      hi: 'मार्गमित्र वोकेशनल मार्गदर्शन मंच। विद्यार्थियों और अभिभावकों के लिए सत्यापित करियर डाटा एवं AI परामर्श।'
    };

    const text = lang === 'hi' ? match.hi : match.en;
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang === 'hi' ? 'hi-IN' : 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => {
      if (lang === 'hi') return v.lang.startsWith('hi');
      return v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('David') || v.name.includes('Mark'));
    }) || voices.find(v => v.lang.startsWith(lang)) || null;

    if (voice) utt.voice = voice;
    utt.rate = 0.95;
    utt.pitch = 1.0;

    utt.onstart = () => {
      setIsPlaying(true);
      setIsMuted(false);
    };
    utt.onend = () => setIsPlaying(false);
    utt.onerror = () => setIsPlaying(false);

    utteranceRef.current = utt;
    window.speechSynthesis.speak(utt);
  };

  // Speak thoroughly when path or page changes
  useEffect(() => {
    if (isMuted) return;

    const timer = setTimeout(() => {
      speakPage(currentLang, false);
    }, 400);

    return () => {
      clearTimeout(timer);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [location.pathname, currentLang, isMuted]);

  const toggleStop = () => {
    if (isPlaying) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsMuted(true);
    } else {
      setIsMuted(false);
      speakPage(currentLang, true);
    }
  };

  return (
    <div className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white px-4 py-1.5 text-xs shadow-md">
      <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3">
        {/* Left: Speaking indicator & thorough reader */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleStop}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 font-bold transition-all ${
              isPlaying
                ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400 animate-pulse'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            title={isPlaying ? 'Click to Stop Voice' : 'Click to Read Page Aloud'}
          >
            {isPlaying ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 text-emerald-400" />}
            <span>{isPlaying ? '⏹ Stop Voice' : '🔊 Read Page Aloud'}</span>
          </button>

          <span className="text-slate-400 hidden sm:inline truncate max-w-md">
            {isPlaying ? 'Reading page content thoroughly...' : 'Voice narration is ready.'}
          </span>
        </div>

        {/* Right: Global Language Switcher (English / Hindi) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold mr-1">
            <Globe className="h-3.5 w-3.5 text-amber-400" /> Language:
          </div>
          <div className="flex rounded-lg bg-slate-950 border border-slate-800 p-0.5">
            <button
              onClick={() => changeLanguage('en')}
              className={`rounded-md px-2.5 py-0.5 text-xs font-bold transition-all ${
                currentLang === 'en'
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => changeLanguage('hi')}
              className={`rounded-md px-2.5 py-0.5 text-xs font-bold transition-all ${
                currentLang === 'hi'
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              हिंदी (Hindi)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
