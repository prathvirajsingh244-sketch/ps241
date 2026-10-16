import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function VoiceGreeting() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speakGreeting = () => {
    if (!('speechSynthesis' in window)) return;
    
    // Cancel any active speech
    window.speechSynthesis.cancel();

    const text = 'नमस्ते! आपका मार्गमित्र में स्वागत है। मैं आपका AI करियर काउंसलर हूँ। आइए मिलकर आपका सही वोकेशनल भविष्य चुनें।';
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'hi-IN';

    // Best matching voice (Hindi or Indian male/warm voice)
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => {
      const n = v.name.toLowerCase();
      const isHi = v.lang.startsWith('hi') || v.lang.includes('IN');
      const isMale = n.includes('male') || n.includes('madhur') || n.includes('rishi') || n.includes('hemant') || n.includes('david');
      return isHi && (isMale || !n.includes('female'));
    }) || voices.find(v => v.lang.startsWith('hi')) || voices.find(v => v.lang.includes('IN')) || null;

    if (hindiVoice) utt.voice = hindiVoice;
    utt.rate = 0.92;
    utt.pitch = 0.88;

    utt.onstart = () => setIsPlaying(true);
    utt.onend = () => setIsPlaying(false);
    utt.onerror = () => setIsPlaying(false);

    speechRef.current = utt;
    window.speechSynthesis.speak(utt);
    setHasInteracted(true);
  };

  useEffect(() => {
    // Attempt automatic playback on initial load or voice load
    const tryPlay = () => {
      try {
        speakGreeting();
      } catch (e) {
        // Autoplay may be blocked by browser policy
      }
    };

    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.getVoices().length > 0) {
        tryPlay();
      } else {
        window.speechSynthesis.onvoiceschanged = tryPlay;
      }
    }

    // Fallback: Fire on first user tap/click anywhere on page
    const handleFirstGesture = () => {
      if (!hasInteracted) {
        speakGreeting();
      }
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('click', handleFirstGesture);
    };

    window.addEventListener('pointerdown', handleFirstGesture, { once: true });
    window.addEventListener('click', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('click', handleFirstGesture);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="fixed top-18 right-4 z-40 animate-fade-up">
      <button
        onClick={() => {
          if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
          } else {
            speakGreeting();
          }
        }}
        title="क्लिक करके स्वागत संदेश सुनें / Play Welcome Voice"
        className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold shadow-lg transition-all duration-300 backdrop-blur-md border ${
          isPlaying
            ? 'bg-rose-600 text-white border-rose-300 ring-2 ring-rose-400 animate-pulse'
            : 'bg-white/90 text-rose-950 border-rose-300/80 hover:bg-white hover:scale-105'
        }`}
      >
        <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
        {isPlaying ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 text-rose-600" />}
        <span>{isPlaying ? 'आवाज बंद करें (Stop)' : '🔊 स्वागत संदेश सुनें (Welcome Voice)'}</span>
      </button>
    </div>
  );
}
