export type AssessmentAnswerMap = Record<string, string>;

export type AssessmentQuestionOption = {
  value: string;
  labelEn: string;
  labelHi: string;
  emoji: string;
  weights: Record<string, number>;
};

export type AssessmentQuestion = {
  id: string;
  category: string;
  promptEn: string;
  promptHi: string;
  options: AssessmentQuestionOption[];
};

export type AssessmentRecommendation = {
  careerId: string;
  title: string;
  score: number;
  category: string;
  explanation: string;
  supportingSignals: string[];
  strength: 'strong' | 'explore';
};

export type AssessmentResult = {
  recommendations: AssessmentRecommendation[];
  missingQuestions: string[];
  scoresByCareer: Record<string, number>;
  questionsAnswered: number;
  totalQuestions: number;
};

export const CAREER_DATA = [
  {
    id: 'career-001',
    title: 'Electrician (ITI)',
    category: 'Engineering & Technology',
    keywords: ['repair', 'technical', 'hands_on', 'machines', 'electrical', 'outdoor'],
  },
  {
    id: 'career-002',
    title: 'Beauty & Wellness Therapist',
    category: 'Health & Wellness',
    keywords: ['help', 'people', 'service', 'care', 'creative', 'communication'],
  },
  {
    id: 'career-003',
    title: 'Plumber (ITI)',
    category: 'Construction & Infrastructure',
    keywords: ['repair', 'hands_on', 'practical', 'outdoor', 'systems', 'tools'],
  },
  {
    id: 'career-004',
    title: 'Solar Panel Technician',
    category: 'Renewable Energy',
    keywords: ['technical', 'repair', 'outdoor', 'hands_on', 'systems', 'electrical'],
  },
  {
    id: 'career-005',
    title: 'Welder (ITI)',
    category: 'Engineering & Technology',
    keywords: ['repair', 'hands_on', 'machines', 'technical', 'outdoor', 'practical'],
  },
] as const;

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'q_activity',
    category: 'Activity preference',
    promptEn: 'Which activity sounds most enjoyable to you?',
    promptHi: 'आपको कौन-सा काम सबसे अधिक पसंद है?',
    options: [
      {
        value: 'repair',
        labelEn: 'Repairing machines, wires, or tools',
        labelHi: 'मशीन, तार या उपकरणों को ठीक करना',
        emoji: '🛠️',
        weights: { 'career-001': 5, 'career-003': 4, 'career-004': 4, 'career-005': 5, 'career-002': 0 },
      },
      {
        value: 'digital',
        labelEn: 'Working with computers or digital devices',
        labelHi: 'कंप्यूटर या डिजिटल उपकरणों के साथ काम करना',
        emoji: '💻',
        weights: { 'career-001': 2, 'career-003': 1, 'career-004': 2, 'career-005': 1, 'career-002': 0 },
      },
      {
        value: 'help',
        labelEn: 'Helping people or caring for others',
        labelHi: 'लोगों की मदद करना या उनकी सेवा करना',
        emoji: '🤝',
        weights: { 'career-001': 1, 'career-003': 1, 'career-004': 1, 'career-005': 0, 'career-002': 5 },
      },
      {
        value: 'design',
        labelEn: 'Designing, drawing, or creating new ideas',
        labelHi: 'नई चीज़ बनाना, ड्राइंग या डिजाइन करना',
        emoji: '🎨',
        weights: { 'career-001': 1, 'career-003': 1, 'career-004': 1, 'career-005': 2, 'career-002': 2 },
      },
      {
        value: 'nature',
        labelEn: 'Working outdoors with plants, soil, or tools',
        labelHi: 'बगीचे, जमीन या आउटडोर कार्य में काम करना',
        emoji: '🌾',
        weights: { 'career-001': 1, 'career-003': 3, 'career-004': 2, 'career-005': 1, 'career-002': 0 },
      },
    ],
  },
  {
    id: 'q_work_style',
    category: 'Work style',
    promptEn: 'How do you prefer to work most of the time?',
    promptHi: 'आप ज्यादातर किस तरह के काम को पसंद करते हैं?',
    options: [
      {
        value: 'hands_on',
        labelEn: 'Hands-on practical work with tools',
        labelHi: 'औजारों के साथ हाथों से काम करना',
        emoji: '🔧',
        weights: { 'career-001': 5, 'career-003': 5, 'career-004': 4, 'career-005': 5, 'career-002': 0 },
      },
      {
        value: 'people',
        labelEn: 'Talking to people and helping them directly',
        labelHi: 'लोगों से बात करके उनकी मदद करना',
        emoji: '🗣️',
        weights: { 'career-001': 0, 'career-003': 1, 'career-004': 1, 'career-005': 0, 'career-002': 5 },
      },
      {
        value: 'technical',
        labelEn: 'Solving technical problems and checking systems',
        labelHi: 'तकनीकी समस्या हल करना और सिस्टम देखना',
        emoji: '⚙️',
        weights: { 'career-001': 5, 'career-003': 2, 'career-004': 5, 'career-005': 4, 'career-002': 0 },
      },
      {
        value: 'service',
        labelEn: 'Customer service or personal care work',
        labelHi: 'ग्राहक सेवा या व्यक्तिगत देखभाल का काम',
        emoji: '💬',
        weights: { 'career-001': 1, 'career-003': 1, 'career-004': 1, 'career-005': 0, 'career-002': 4 },
      },
    ],
  },
  {
    id: 'q_environment',
    category: 'Work environment',
    promptEn: 'Where would you like to work most often?',
    promptHi: 'आप सबसे ज्यादा कहाँ काम करना पसंद करेंगे?',
    options: [
      {
        value: 'outdoor',
        labelEn: 'Outdoor sites, fieldwork, or on-site repairs',
        labelHi: 'आउटडोर साइट, फील्डवर्क या साइट पर मरम्मत',
        emoji: '🏗️',
        weights: { 'career-001': 4, 'career-003': 5, 'career-004': 5, 'career-005': 4, 'career-002': 1 },
      },
      {
        value: 'workshop',
        labelEn: 'Workshop, factory, or machine area',
        labelHi: 'कारखाना, वर्कशॉप या मशीन एरिया',
        emoji: '🏭',
        weights: { 'career-001': 5, 'career-003': 2, 'career-004': 3, 'career-005': 5, 'career-002': 0 },
      },
      {
        value: 'people_space',
        labelEn: 'Salon, clinic, or customer-facing space',
        labelHi: 'सैलून, क्लिनिक या ग्राहक-सामने वाला स्थान',
        emoji: '🧴',
        weights: { 'career-001': 0, 'career-003': 0, 'career-004': 0, 'career-005': 0, 'career-002': 5 },
      },
      {
        value: 'indoor',
        labelEn: 'Indoor space with structured tasks',
        labelHi: 'सही नियमों वाले इनडोर काम',
        emoji: '📋',
        weights: { 'career-001': 1, 'career-003': 1, 'career-004': 1, 'career-005': 2, 'career-002': 2 },
      },
    ],
  },
  {
    id: 'q_support',
    category: 'Problem solving',
    promptEn: 'When something breaks down, what do you naturally do?',
    promptHi: 'जब कोई चीज़ खराब हो जाए, तो आप सबसे पहले क्या करते हैं?',
    options: [
      {
        value: 'problem_solver',
        labelEn: 'Check the system and find the problem',
        labelHi: 'सिस्टम जांचकर समस्या ढूँढना',
        emoji: '🧩',
        weights: { 'career-001': 5, 'career-003': 4, 'career-004': 5, 'career-005': 4, 'career-002': 1 },
      },
      {
        value: 'caring',
        labelEn: 'Comfort and support the person involved',
        labelHi: 'व्यक्ति की सहायता और आराम करना',
        emoji: '💚',
        weights: { 'career-001': 0, 'career-003': 1, 'career-004': 0, 'career-005': 0, 'career-002': 5 },
      },
      {
        value: 'measure',
        labelEn: 'Measure, inspect, and test tools carefully',
        labelHi: 'औजारों को मापकर और टेस्ट करके जांचना',
        emoji: '📏',
        weights: { 'career-001': 5, 'career-003': 4, 'career-004': 4, 'career-005': 5, 'career-002': 0 },
      },
      {
        value: 'organise',
        labelEn: 'Keep things clean, neat, and well arranged',
        labelHi: 'सब कुछ सही, साफ और व्यवस्थित रखना',
        emoji: '🧼',
        weights: { 'career-001': 1, 'career-003': 2, 'career-004': 1, 'career-005': 1, 'career-002': 3 },
      },
    ],
  },
  {
    id: 'q_training',
    category: 'Training commitment',
    promptEn: 'How much time can you give to skill training?',
    promptHi: 'आप स्किल ट्रेनिंग के लिए कितना समय दे सकते हैं?',
    options: [
      {
        value: 'short',
        labelEn: 'A few months',
        labelHi: 'कुछ महीने',
        emoji: '⏳',
        weights: { 'career-001': 2, 'career-003': 2, 'career-004': 3, 'career-005': 2, 'career-002': 4 },
      },
      {
        value: 'medium',
        labelEn: '6 to 12 months',
        labelHi: '6 से 12 महीने',
        emoji: '📆',
        weights: { 'career-001': 3, 'career-003': 3, 'career-004': 3, 'career-005': 3, 'career-002': 3 },
      },
      {
        value: 'long',
        labelEn: '1 to 2 years of structured training',
        labelHi: '1 से 2 वर्षों का Structured प्रशिक्षण',
        emoji: '🎓',
        weights: { 'career-001': 5, 'career-003': 4, 'career-004': 3, 'career-005': 5, 'career-002': 1 },
      },
    ],
  },
  {
    id: 'q_preference',
    category: 'Preferred tasks',
    promptEn: 'Which kind of day-to-day task would you enjoy more?',
    promptHi: 'आपको दैनिक कामों में से कौन-सा काम अधिक पसंद है?',
    options: [
      {
        value: 'practical',
        labelEn: 'Fixing, installing, and testing real things',
        labelHi: 'वास्तविक चीज़ों को ठीक करना, लगाना और टेस्ट करना',
        emoji: '🧰',
        weights: { 'career-001': 5, 'career-003': 5, 'career-004': 5, 'career-005': 5, 'career-002': 0 },
      },
      {
        value: 'people_service',
        labelEn: 'Meeting people, grooming, and service work',
        labelHi: 'लोगों से मिलना, ग्रूमिंग और सेवा का काम',
        emoji: '✨',
        weights: { 'career-001': 0, 'career-003': 0, 'career-004': 0, 'career-005': 0, 'career-002': 5 },
      },
      {
        value: 'systems',
        labelEn: 'Following technical steps and system work',
        labelHi: 'तकनीकी चरणों का पालन करके सिस्टम काम करना',
        emoji: '🔌',
        weights: { 'career-001': 5, 'career-003': 2, 'career-004': 5, 'career-005': 4, 'career-002': 1 },
      },
      {
        value: 'creative',
        labelEn: 'Creative, neat, and design-based tasks',
        labelHi: 'क्रिएटिव, साफ-सुथरे और डिजाइन-आधारित काम',
        emoji: '🎯',
        weights: { 'career-001': 1, 'career-003': 1, 'career-004': 1, 'career-005': 2, 'career-002': 3 },
      },
    ],
  },
];

const getSelectedOption = (questionId: string, answers: AssessmentAnswerMap) => {
  const answer = answers[questionId];
  if (!answer) return undefined;

  for (const question of ASSESSMENT_QUESTIONS) {
    if (question.id !== questionId) continue;
    return question.options.find((option) => option.value === answer);
  }

  return undefined;
};

export function calculateAssessmentResult(answers: AssessmentAnswerMap): AssessmentResult {
  const scoresByCareer: Record<string, number> = Object.fromEntries(CAREER_DATA.map((career) => [career.id, 0]));
  const supportingSignals: Record<string, string[]> = Object.fromEntries(CAREER_DATA.map((career) => [career.id, []]));
  const missingQuestions: string[] = [];

  for (const question of ASSESSMENT_QUESTIONS) {
    const selected = getSelectedOption(question.id, answers);
    if (!selected) {
      missingQuestions.push(question.id);
      continue;
    }

    for (const career of CAREER_DATA) {
      const weight = selected.weights[career.id] || 0;
      if (weight <= 0) continue;
      scoresByCareer[career.id] += weight;
      const label = selected.labelEn.replace(/\s+/g, ' ').trim();
      supportingSignals[career.id].push(label);
    }
  }

  const sorted = CAREER_DATA.map((career) => ({
    careerId: career.id,
    title: career.title,
    category: career.category,
    score: scoresByCareer[career.id] || 0,
    supportingSignals: supportingSignals[career.id],
  })).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.title.localeCompare(b.title);
  });

  const qualifying = sorted.filter((item) => item.score > 0);
  const maxScore = Math.max(1, ...qualifying.map((item) => item.score));
  const recommendationLimit = 5;
  const strongThreshold = Math.max(4, Math.ceil(maxScore * 0.6));

  const recommendations: AssessmentRecommendation[] = qualifying
    .filter((item) => item.score >= strongThreshold || item.score === maxScore)
    .slice(0, recommendationLimit)
    .map((item) => {
      const signalSummary = item.supportingSignals.slice(0, 2).join(' and ');
      const explanation = `${item.title} is a good fit because your answers point to practical, hands-on, and ${item.category.toLowerCase()}-aligned work. Your selected responses suggest ${signalSummary || 'active, problem-solving tasks'}. This is a career exploration suggestion based on your answers and the existing MargMitra career profile, not a guaranteed aptitude result.`;

      return {
        careerId: item.careerId,
        title: item.title,
        score: item.score,
        category: item.category,
        explanation,
        supportingSignals: item.supportingSignals.slice(0, 3),
        strength: item.score >= strongThreshold ? 'strong' : 'explore',
      };
    });

  if (recommendations.length < 2 && qualifying.length > 0) {
    const fallback: AssessmentRecommendation[] = qualifying.slice(0, 2).map((item): AssessmentRecommendation => ({
      careerId: item.careerId,
      title: item.title,
      score: item.score,
      category: item.category,
      explanation: `${item.title} is a relevant option because your answers lean toward practical problem-solving and ${item.category.toLowerCase()} work. This recommendation should be explored further with the career directory or a counsellor.`,
      supportingSignals: item.supportingSignals.slice(0, 3),
      strength: item.score >= strongThreshold ? 'strong' : 'explore',
    }));

    return {
      recommendations: fallback,
      missingQuestions,
      scoresByCareer,
      questionsAnswered: ASSESSMENT_QUESTIONS.length - missingQuestions.length,
      totalQuestions: ASSESSMENT_QUESTIONS.length,
    };
  }

  if (recommendations.length === 0) {
    return {
      recommendations: [],
      missingQuestions,
      scoresByCareer,
      questionsAnswered: ASSESSMENT_QUESTIONS.length - missingQuestions.length,
      totalQuestions: ASSESSMENT_QUESTIONS.length,
    };
  }

  return {
    recommendations,
    missingQuestions,
    scoresByCareer,
    questionsAnswered: ASSESSMENT_QUESTIONS.length - missingQuestions.length,
    totalQuestions: ASSESSMENT_QUESTIONS.length,
  };
}
