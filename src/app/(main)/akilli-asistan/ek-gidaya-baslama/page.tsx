"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { toolService } from '@/services/tool-service';
import { setToken } from '@/lib/api';
import { toast } from 'sonner';
import type { 
  SolidFoodQuestion, 
  SolidFoodOption,
  SolidFoodReadinessResult,
  SolidFoodResultBucket,
  Child
} from '@/lib/types';

type TestStage = 'intro' | 'test' | 'result';

// Answer type aligned with BLW test
interface SolidFoodAnswer {
  question_id: string;
  option_id: string;
  score: number;
}

// Helper: Calculate child age display
const calculateAgeDisplay = (child: Child): string => {
  // First try age_months
  if (child.age_months !== undefined && child.age_months !== null) {
    const years = Math.floor(child.age_months / 12);
    const months = child.age_months % 12;
    if (years > 0) {
      return months > 0 ? `${years} yıl ${months} ay` : `${years} yıl`;
    }
    return `${child.age_months} aylık`;
  }
  
  // Fallback: calculate from birth_date
  if (child.birth_date) {
    const birthDate = new Date(child.birth_date);
    const today = new Date();
    const ageInMonths = Math.floor(
      (today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
    );
    const years = Math.floor(ageInMonths / 12);
    const months = ageInMonths % 12;
    if (years > 0) {
      return months > 0 ? `${years} yıl ${months} ay` : `${years} yıl`;
    }
    return `${ageInMonths} aylık`;
  }
  
  return 'Yaş bilgisi yok';
};

// Helper: Get result icon with emoji fallback
const getResultIcon = (icon: string): React.ReactNode => {
  const iconMap: Record<string, string> = {
    'fa-check-circle': '✅',
    'fa-circle-check': '✅',
    'fa-hourglass-half': '⏳',
    'fa-clock': '🕐',
    'fa-info-circle': 'ℹ️',
  };
  
  // Try to find matching emoji
  const emoji = Object.entries(iconMap).find(([key]) => icon.includes(key))?.[1];
  
  return emoji ? <span>{emoji}</span> : <i className={icon}></i>;
};

// Confirm Modal Component
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Onayla',
  cancelText = 'İptal',
  onConfirm,
  onCancel,
  variant = 'info'
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: 'fa-solid fa-triangle-exclamation',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-500',
      confirmBg: 'bg-red-500 hover:bg-red-600',
    },
    warning: {
      icon: 'fa-solid fa-exclamation-circle',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-500',
      confirmBg: 'bg-amber-500 hover:bg-amber-600',
    },
    info: {
      icon: 'fa-solid fa-info-circle',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-500',
      confirmBg: 'bg-blue-500 hover:bg-blue-600',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center">
          <div className={`w-16 h-16 ${styles.iconBg} ${styles.iconColor} rounded-full flex items-center justify-center mx-auto mb-4 text-2xl`}>
            <i className={styles.icon}></i>
          </div>
          <h3 className="font-display font-bold text-xl text-slate-800 mb-2">{title}</h3>
          <p className="text-gray-500 mb-6">{message}</p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-bold transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 ${styles.confirmBg} text-white px-4 py-3 rounded-xl font-bold transition-colors`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Default questions (fallback if API fails)
const defaultQuestions: SolidFoodQuestion[] = [
  {
    id: 'q1_age',
    question: 'Bebeğinizin yaşı kaç ay?',
    description: 'WHO, ek gıdaya 6. aydan önce başlanmamasını önerir.',
    icon: 'fa-solid fa-calendar',
    weight: 20,
    options: [
      { id: 'age_6plus', text: '6+ ay', value: 100 },
      { id: 'age_5', text: '5-6 ay arası', value: 50 },
      { id: 'age_4_5', text: '4-5 ay arası', value: 10, is_red_flag: true, red_flag_message: '6 aydan önce ek gıdaya başlanması önerilmez. Doktorunuza danışın.' },
      { id: 'age_below4', text: '4 aydan küçük', value: 0, is_red_flag: true, red_flag_message: '4 aydan küçük bebekler için ek gıda çok erkendir. Mutlaka doktorunuza danışın.' }
    ]
  },
  {
    id: 'q2_sitting',
    question: 'Bebeğiniz desteksiz oturabiliyor mu?',
    description: 'Mama sandalyesinde başını dik tutarak oturabiliyor olması gerekir.',
    icon: 'fa-solid fa-chair',
    weight: 20,
    options: [
      { id: 'sitting_yes', text: 'Evet, rahatça oturabiliyor', value: 100 },
      { id: 'sitting_short', text: 'Kısa süreler oturabiliyor', value: 60 },
      { id: 'sitting_support', text: 'Destekle oturabiliyor', value: 30 },
      { id: 'sitting_no', text: 'Hayır, henüz oturamıyor', value: 0 }
    ]
  },
  {
    id: 'q3_head',
    question: 'Bebeğinizin baş kontrolü tam mı?',
    description: 'Başını dik tutabiliyor ve her iki yana rahatça çevirebiliyor olmalı.',
    icon: 'fa-solid fa-head-side-mask',
    weight: 20,
    options: [
      { id: 'head_yes', text: 'Evet, tam kontrol var', value: 100 },
      { id: 'head_mostly', text: 'Çoğunlukla kontrol edebiliyor', value: 70 },
      { id: 'head_partial', text: 'Bazen sallanıyor', value: 40 },
      { id: 'head_no', text: 'Hayır, başını tutamıyor', value: 0 }
    ]
  },
  {
    id: 'q4_tongue',
    question: 'Dil itme refleksi kayboldu mu?',
    description: 'Kaşıkla verilen yiyecekleri dilinin ucuyla dışarı itmek yerine yutabiliyor mu?',
    icon: 'fa-solid fa-utensils',
    weight: 20,
    options: [
      { id: 'tongue_yes', text: 'Evet, yutabiliyor', value: 100 },
      { id: 'tongue_sometimes', text: 'Bazen itiyor bazen yutabiliyor', value: 60 },
      { id: 'tongue_present', text: 'Hala çoğunlukla itiyor', value: 20 },
      { id: 'tongue_uncertain', text: 'Henüz deneme fırsatı olmadı', value: 50 }
    ]
  },
  {
    id: 'q5_interest',
    question: 'Bebeğiniz yiyeceklere ilgi gösteriyor mu?',
    description: 'Sizin yediğinizi izliyor, ağzını açıyor veya yiyeceklere uzanmaya çalışıyor mu?',
    icon: 'fa-solid fa-face-smile',
    weight: 20,
    options: [
      { id: 'interest_high', text: 'Evet, çok ilgili', value: 100 },
      { id: 'interest_some', text: 'Bazen ilgi gösteriyor', value: 70 },
      { id: 'interest_rare', text: 'Nadiren ilgileniyor', value: 40 },
      { id: 'interest_no', text: 'Hayır, ilgilenmiyor', value: 10 }
    ]
  }
];

// Default result buckets
const defaultResultBuckets: SolidFoodResultBucket[] = [
  {
    id: 'ready',
    min_score: 80,
    max_score: 100,
    title: 'Bebeğiniz Hazır! 🎉',
    subtitle: 'Harika! Bebeğiniz hazır',
    color: 'green',
    icon: 'fa-solid fa-circle-check',
    description: 'Harika! Bebeğiniz ek gıdaya başlamak için gerekli tüm gelişimsel işaretleri gösteriyor.',
    recommendations: [
      'İlk yiyecekler olarak tek malzemeli, yumuşak gıdalar tercih edin',
      'Püre veya parmak gıda yöntemiyle başlayabilirsiniz',
      'Her yeni gıdayı 3-5 gün tek başına vererek alerji kontrolü yapın',
      'İlk günlerde bebeğiniz daha çok keşfedecek, bu normaldir'
    ]
  },
  {
    id: 'almost',
    min_score: 50,
    max_score: 79,
    title: 'Neredeyse Hazır 💪',
    subtitle: 'Birkaç alanda daha gelişim göstermeli',
    color: 'yellow',
    icon: 'fa-solid fa-hourglass-half',
    description: 'Bebeğiniz neredeyse hazır, ancak bazı alanlarda biraz daha zaman geçirmek faydalı olabilir.',
    recommendations: [
      'Desteksiz oturma pratiği yapın',
      'Bebeğinizle birlikte yemek yiyin, size bakmasını sağlayın',
      'Oyuncakları kavrayıp ağzına götürmesi için fırsatlar yaratın',
      '1-2 hafta sonra tekrar değerlendirin'
    ]
  },
  {
    id: 'wait',
    min_score: 0,
    max_score: 49,
    title: 'Biraz Daha Zaman 🕐',
    subtitle: 'Henüz erken, bebeğiniz daha fazla gelişmeli',
    color: 'red',
    icon: 'fa-solid fa-clock',
    description: 'Bebeğiniz henüz ek gıdaya hazır değil. Bu tamamen normal, her bebek kendi hızında gelişir.',
    recommendations: [
      'Bebeğinizin baş ve boyun kontrolünü güçlendirmek için tummy time yapın',
      'Desteksiz oturma için kol ve sırt kaslarını geliştirmeye odaklanın',
      'Henüz 6 aylık değilse, 6. ayı bekleyin',
      'Doktorunuzla gelişim aşamalarını düzenli olarak kontrol edin'
    ]
  }
];

export default function EkGidayaBaslamaPage() {
  const router = useRouter();
  const { isAuthenticated, children, refreshUser } = useUser();
  
  const [stage, setStage] = useState<TestStage>('intro');
  const [questions, setQuestions] = useState<SolidFoodQuestion[]>(defaultQuestions);
  const [resultBuckets, setResultBuckets] = useState<SolidFoodResultBucket[]>(defaultResultBuckets);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<SolidFoodAnswer[]>([]);
  const [result, setResult] = useState<SolidFoodReadinessResult | null>(null);
  const [redFlags, setRedFlags] = useState<string[]>([]);
  const [resultBucket, setResultBucket] = useState<SolidFoodResultBucket | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Modals
  const [showRegistration, setShowRegistration] = useState(false);
  const [showChildSelector, setShowChildSelector] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Registration form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regChildName, setRegChildName] = useState('');
  const [regChildBirthDate, setRegChildBirthDate] = useState('');
  const [guardianDeclaration, setGuardianDeclaration] = useState(false);
  const [sensitiveDataConsent, setSensitiveDataConsent] = useState(false);
  
  // Child selector
  const [selectedChildId, setSelectedChildId] = useState<string>('');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await toolService.getSolidFoodReadinessConfig();
        if (config.questions && config.questions.length > 0) {
          setQuestions(config.questions);
        }
        if (config.result_buckets && config.result_buckets.length > 0) {
          setResultBuckets(config.result_buckets);
        }
      } catch (error) {
        console.log('Using default config:', error);
      }
    };
    fetchConfig();
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleStartTest = () => {
    setStage('test');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setRedFlags([]);
  };

  const handleAnswer = (optionId: string) => {
    const option = currentQuestion.options.find(o => o.id === optionId);
    if (!option) return;

    // Add answer
    const newAnswer: SolidFoodAnswer = {
      question_id: currentQuestion.id,
      option_id: optionId,
      score: option.value
    };
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    // Check for red flags
    if (option.is_red_flag && option.red_flag_message) {
      setRedFlags([...redFlags, option.red_flag_message]);
    }

    // Move to next question or finish
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Test completed
      finishTest(newAnswers);
    }
  };

  const finishTest = (finalAnswers: SolidFoodAnswer[]) => {
    const score = calculateScore(finalAnswers);
    const bucket = findResultBucket(score);
    
    // Convert answers to backend format
    const answersRecord: Record<string, string> = {};
    finalAnswers.forEach(answer => {
      answersRecord[answer.question_id] = answer.option_id;
    });
    
    const testResult: SolidFoodReadinessResult = {
      score,
      result_bucket_id: bucket?.id || 'wait',
      red_flags: redFlags,
      answers: answersRecord,
      created_at: new Date().toISOString()
    };
    
    setResult(testResult);
    setResultBucket(bucket);
    
    // If user is authenticated, show child selector, otherwise show registration
    if (isAuthenticated) {
      if (children.length > 0) {
        setShowChildSelector(true);
      } else {
        // No children, just show result
        setStage('result');
      }
    } else {
      setShowRegistration(true);
    }
  };

  const calculateScore = (answerList: SolidFoodAnswer[]): number => {
    let totalWeighted = 0;
    let totalWeight = 0;
    
    answerList.forEach(answer => {
      const question = questions.find(q => q.id === answer.question_id);
      if (question && question.weight > 0) {
        totalWeighted += (answer.score * question.weight);
        totalWeight += question.weight;
      }
    });
    
    return totalWeight > 0 ? Math.round(totalWeighted / totalWeight) : 0;
  };

  const findResultBucket = (score: number): SolidFoodResultBucket | null => {
    return resultBuckets.find(b => score >= b.min_score && score <= b.max_score) || null;
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!result) return;
    
    if (regChildName.trim() && regChildBirthDate && !guardianDeclaration) {
      toast.error('Çocuk profili eklemek için veli/vasi beyanını onaylamanız gerekmektedir.');
      return;
    }
    
    if (!sensitiveDataConsent) {
      toast.error('Devam etmek için Açık Rıza Metni\'ni kabul etmeniz gerekmektedir.');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await toolService.submitSolidFoodReadinessTestWithRegistration(
        result.answers,
        {
          email: regEmail,
          password: regPassword,
          name: regName,
          child_name: regChildName,
          child_birth_date: regChildBirthDate,
          consents: {
            terms_accepted: true,
            terms_accepted_at: new Date().toISOString(),
            marketing_consent: false,
            marketing_consent_at: null,
            sensitive_data_consent: sensitiveDataConsent,
            sensitive_data_consent_at: sensitiveDataConsent ? new Date().toISOString() : null,
            guardian_declaration: guardianDeclaration,
            guardian_declaration_at: guardianDeclaration ? new Date().toISOString() : null,
          }
        }
      );
      
      // Set token and refresh user
      setToken(response.token);
      await refreshUser();
      
      setShowRegistration(false);
      setShowSuccessModal(true);
      
      // Hide success modal and show result after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        setStage('result');
      }, 2000);
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Kayıt başarısız oldu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChildSelectorSubmit = async () => {
    if (!result || !selectedChildId) return;
    
    setIsLoading(true);
    try {
      await toolService.submitSolidFoodReadinessTest(result.answers, selectedChildId);
      setShowChildSelector(false);
      toast.success('Test sonucunuz kaydedildi!');
      setStage('result');
    } catch (error) {
      console.error('Submit failed:', error);
      toast.error('Kayıt başarısız oldu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipRegistration = () => {
    setShowRegistration(false);
    setStage('result');
  };

  const handleSkipChildSelector = () => {
    setShowChildSelector(false);
    setStage('result');
  };

  const handleRestart = () => {
    setStage('intro');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResult(null);
    setRedFlags([]);
    setResultBucket(null);
  };

  const getBucketColor = (color: string) => {
    switch (color) {
      case 'green': return 'from-green-400 to-green-600';
      case 'yellow': return 'from-amber-400 to-amber-600';
      case 'red': return 'from-red-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getBucketBgColor = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-50';
      case 'yellow': return 'bg-amber-50';
      case 'red': return 'bg-red-50';
      default: return 'bg-gray-50';
    }
  };

  const getBucketBorderColor = (color: string) => {
    switch (color) {
      case 'green': return 'border-green-200';
      case 'yellow': return 'border-amber-200';
      case 'red': return 'border-red-200';
      default: return 'border-gray-200';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-20 z-30">
        <button onClick={() => router.push('/akilli-asistan')} className="text-gray-500">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <span className="font-display font-bold text-lg text-slate-800">Ek Gıdaya Başlama</span>
        <div className="w-6"></div>
      </div>

      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        
        {/* INTRO STAGE */}
        {stage === 'intro' && (
          <div className="animate-fade-in">
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-lg p-8 md:p-12 text-center">
              {/* Icon */}
              <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                <i className="fa-solid fa-utensils"></i>
              </div>

              {/* Title */}
              <h1 className="font-display font-bold text-3xl text-slate-800 mb-3">
                Ek Gıdaya Başlama Kontrolü
              </h1>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                WHO standartlarında {questions.length} soruda, yaklaşık 1 dakikada bebeğinizin ek gıdaya başlamaya hazır olup olmadığını öğrenin.
              </p>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-2xl mb-2">📋</div>
                  <div className="text-sm font-bold text-gray-700">{questions.length} Soru</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-2xl mb-2">⏱️</div>
                  <div className="text-sm font-bold text-gray-700">~1 Dakika</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="text-sm font-bold text-gray-700">Kişisel Sonuç</div>
                </div>
              </div>

              {/* Start Button */}
              <button 
                onClick={handleStartTest}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-12 py-4 rounded-xl font-bold shadow-lg transition-all transform hover:scale-105"
              >
                Teste Başla
              </button>

              {/* Disclaimer */}
              <p className="text-xs text-gray-400 mt-8 max-w-lg mx-auto">
                <i className="fa-solid fa-info-circle mr-1"></i>
                Bu test tıbbi tanı yerine geçmez. Bebeğinizin beslenmesi hakkında doktorunuza danışın.
              </p>
            </div>

            {/* SEO Info */}
            <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-display font-bold text-xl text-slate-800 mb-4">
                Ek Gıdaya Ne Zaman Başlanmalı?
              </h2>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                Dünya Sağlık Örgütü (WHO), bebeklerin ilk 6 ay sadece anne sütü almasını, 6. aydan itibaren ek gıdaya başlanmasını önerir. 
                Bebeğinizin hazır olması için yaş kadar gelişimsel işaretler de önemlidir.
              </p>
              <h3 className="font-bold text-slate-800 mb-2">Hazırlık İşaretleri</h3>
              <ul className="text-gray-600 text-sm leading-relaxed space-y-1">
                <li>✓ Desteksiz oturabilme</li>
                <li>✓ Baş kontrolünün tam olması</li>
                <li>✓ Dil itme refleksinin kaybolması</li>
                <li>✓ Yiyeceklere ilgi gösterme</li>
              </ul>
            </div>
          </div>
        )}

        {/* TEST STAGE */}
        {stage === 'test' && currentQuestion && (
          <div className="animate-fade-in">
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-lg overflow-hidden">
              {/* Progress Bar */}
              <div className="h-2 bg-gray-100 w-full">
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="p-8 md:p-12">
                {/* Question Counter */}
                <div className="text-center mb-6">
                  <span className="inline-block bg-orange-50 text-orange-600 px-4 py-1 rounded-full text-sm font-bold">
                    Soru {currentQuestionIndex + 1} / {questions.length}
                  </span>
                </div>

                {/* Question Icon */}
                <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                  <i className={currentQuestion.icon || 'fa-solid fa-circle-question'}></i>
                </div>

                {/* Question */}
                <h2 className="font-display font-bold text-2xl text-slate-800 mb-4 text-center">
                  {currentQuestion.question}
                </h2>
                
                {currentQuestion.description && (
                  <p className="text-gray-500 mb-8 text-center max-w-xl mx-auto">
                    {currentQuestion.description}
                  </p>
                )}

                {/* Options */}
                <div className="space-y-3 max-w-xl mx-auto">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.id)}
                      className="w-full bg-gray-50 hover:bg-orange-50 border-2 border-gray-200 hover:border-orange-400 rounded-xl px-6 py-4 text-left font-medium text-gray-700 hover:text-orange-700 transition-all transform hover:scale-[1.02]"
                    >
                      {option.text}
                    </button>
                  ))}
                </div>

                {/* Exit Button */}
                <div className="text-center mt-8">
                  <button 
                    onClick={() => setShowExitConfirm(true)}
                    className="text-gray-400 hover:text-gray-600 text-sm"
                  >
                    Testi Bırak
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RESULT STAGE */}
        {stage === 'result' && result && resultBucket && (
          <div className="animate-fade-in space-y-6">
            {/* Red Flags Warning */}
            {redFlags.length > 0 && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-red-800 mb-2">⚠️ Önemli Uyarılar</h3>
                    <ul className="space-y-2">
                      {redFlags.map((flag, index) => (
                        <li key={index} className="text-sm text-red-700">
                          • {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Score Card */}
            <div className={`rounded-[2rem] border-2 ${getBucketBorderColor(resultBucket.color)} ${getBucketBgColor(resultBucket.color)} overflow-hidden`}>
              <div className={`bg-gradient-to-r ${getBucketColor(resultBucket.color)} text-white p-8 text-center`}>
                <div className="text-6xl mb-4">
                  {getResultIcon(resultBucket.icon)}
                </div>
                <h2 className="font-display font-bold text-3xl mb-2">
                  {resultBucket.title}
                </h2>
                <p className="text-lg opacity-90 mb-4">{resultBucket.subtitle}</p>
                <div className="inline-block bg-white/20 px-6 py-2 rounded-full">
                  <span className="font-bold text-2xl">{result.score}</span>
                  <span className="text-sm opacity-80"> / 100 puan</span>
                </div>
              </div>
              
              <div className="p-8">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {resultBucket.description}
                </p>

                {/* Recommendations */}
                {resultBucket.recommendations.length > 0 && (
                  <div>
                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <i className="fa-solid fa-list-check text-orange-500"></i>
                      Öneriler
                    </h3>
                    <ul className="space-y-2">
                      {resultBucket.recommendations.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-orange-500 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Related Links */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-link text-blue-500"></i>
                İlgili Kaynaklar
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => router.push('/akilli-asistan/blw-testi')}
                  className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl px-4 py-3 text-center text-sm font-bold text-green-700 transition-colors"
                >
                  <i className="fa-solid fa-clipboard-check mr-1"></i> BLW Testi
                </button>
                <button
                  onClick={() => router.push('/malzeme-rehberi')}
                  className="bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl px-4 py-3 text-center text-sm font-bold text-orange-700 transition-colors"
                >
                  <i className="fa-solid fa-carrot mr-1"></i> Malzemeler
                </button>
                <button
                  onClick={() => router.push('/tarifler')}
                  className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl px-4 py-3 text-center text-sm font-bold text-blue-700 transition-colors"
                >
                  <i className="fa-solid fa-utensils mr-1"></i> Tarifler
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button 
                onClick={handleRestart}
                className="flex-1 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold transition-colors"
              >
                <i className="fa-solid fa-rotate-right mr-2"></i>
                Testi Tekrarla
              </button>
              <button 
                onClick={() => router.push('/akilli-asistan')}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all"
              >
                <i className="fa-solid fa-tools mr-2"></i>
                Diğer Araçlar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {showRegistration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 animate-fade-in">
            <h3 className="font-display font-bold text-2xl text-slate-800 mb-2">
              Sonuçlarınızı Kaydedin
            </h3>
            <p className="text-gray-500 mb-6 text-sm">
              Ücretsiz hesap oluşturun ve sonuçlarınızı saklayın, ilerlemenizi takip edin.
            </p>
            
            <form onSubmit={handleRegistrationSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ad Soyad</label>
                <input 
                  type="text" 
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">E-posta</label>
                <input 
                  type="email" 
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Şifre</label>
                <input 
                  type="password" 
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bebek Adı (Opsiyonel)</label>
                <input 
                  type="text" 
                  value={regChildName}
                  onChange={(e) => setRegChildName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bebek Doğum Tarihi (Opsiyonel)</label>
                <input 
                  type="date" 
                  value={regChildBirthDate}
                  onChange={(e) => setRegChildBirthDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              
              {/* Guardian Declaration - only when child info is provided */}
              {regChildName.trim() && regChildBirthDate && (
                <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <input
                    type="checkbox"
                    id="guardian-declaration"
                    checked={guardianDeclaration}
                    onChange={(e) => setGuardianDeclaration(e.target.checked)}
                    className="w-4 h-4 mt-1 shrink-0 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                  />
                  <label htmlFor="guardian-declaration" className="text-sm text-gray-700 cursor-pointer">
                    <strong>18 yaşından büyük olduğumu</strong> ve bu platformda paylaşacağım çocuk bilgilerini{' '}
                    <strong>yasal veli/vasi sıfatıyla</strong> paylaştığımı beyan ederim.
                  </label>
                </div>
              )}
              
              {/* Sensitive Data Consent */}
              <div className="flex items-start gap-3 mt-4">
                <input
                  type="checkbox"
                  id="sensitive-data-consent"
                  checked={sensitiveDataConsent}
                  onChange={(e) => setSensitiveDataConsent(e.target.checked)}
                  className="w-4 h-4 mt-1 shrink-0 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                  required
                />
                <label htmlFor="sensitive-data-consent" className="text-sm text-gray-600 cursor-pointer">
                  Çocuğuma ait sağlık ve gelişim verilerinin, kişiselleştirilmiş hizmet sunulması amacıyla işlenmesine{' '}
                  <Link href="/acik-riza-metni" className="text-orange-500 hover:underline font-medium">
                    Açık Rıza Metni
                  </Link>
                  &apos;nde belirtilen şartlarla onay veriyorum.
                </label>
              </div>
              
              <button 
                type="submit"
                disabled={isLoading || !sensitiveDataConsent}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Kaydediliyor...' : 'Kayıt Ol ve Sonucu Gör'}
              </button>
            </form>
            
            <button 
              onClick={handleSkipRegistration}
              className="w-full mt-3 text-gray-500 hover:text-gray-700 text-sm"
            >
              Kayıt olmadan devam et
            </button>
          </div>
        </div>
      )}

      {/* Child Selector Modal */}
      {showChildSelector && children.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 animate-fade-in">
            <h3 className="font-display font-bold text-2xl text-slate-800 mb-2">
              Hangi Bebeğiniz İçin?
            </h3>
            <p className="text-gray-500 mb-6 text-sm">
              Test sonucunu kaydetmek için bebeğinizi seçin.
            </p>
            
            <div className="space-y-3 mb-6">
              {children.map((child) => (
                <label 
                  key={child.id}
                  className="flex items-center gap-3 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:border-orange-400 transition-colors"
                >
                  <input 
                    type="radio" 
                    name="child" 
                    value={child.id}
                    checked={selectedChildId === child.id}
                    onChange={(e) => setSelectedChildId(e.target.value)}
                    className="accent-orange-500"
                  />
                  <div>
                    <div className="font-bold text-slate-800">{child.name}</div>
                    <div className="text-sm text-gray-500">
                      {calculateAgeDisplay(child)}
                      {child.gender && child.gender !== 'unspecified' && (
                        <> • {child.gender === 'male' ? 'Erkek' : 'Kız'}</>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            
            <button 
              onClick={handleChildSelectorSubmit}
              disabled={!selectedChildId || isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
            >
              {isLoading ? 'Kaydediliyor...' : 'Sonucu Kaydet'}
            </button>
            
            <button 
              onClick={handleSkipChildSelector}
              className="w-full mt-3 text-gray-500 hover:text-gray-700 text-sm"
            >
              Kaydetmeden devam et
            </button>
          </div>
        </div>
      )}

      {/* Exit Confirm Modal */}
      <ConfirmModal
        isOpen={showExitConfirm}
        title="Testi Bırakmak İstiyor musunuz?"
        message="İlerlemeniz kaydedilmeyecek ve baştan başlamanız gerekecek."
        confirmText="Evet, Bırak"
        cancelText="Devam Et"
        variant="warning"
        onConfirm={() => {
          setShowExitConfirm(false);
          handleRestart();
        }}
        onCancel={() => setShowExitConfirm(false)}
      />

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-8 text-center animate-in fade-in zoom-in-95">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
              ✅
            </div>
            <h3 className="font-display font-bold text-2xl text-slate-800 mb-2">Başarılı!</h3>
            <p className="text-gray-500">Hesabınız oluşturuldu ve test sonucunuz kaydedildi.</p>
          </div>
        </div>
      )}
    </div>
  );
}
