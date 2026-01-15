"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { toolService } from '@/services/tool-service';
import { setToken } from '@/lib/api';
import { toast } from 'sonner';
import type { 
  BLWTestQuestion, 
  BLWTestAnswer,
  BLWTestResult,
  BLWRedFlag,
  BLWResultBucket,
  Child
} from '@/lib/types';

type TestStage = 'intro' | 'test' | 'result';

// Helper: Calculate child age display
const calculateAgeDisplay = (child: Child): string => {
  // Önce age_months varsa kullan
  if (child.age_months !== undefined && child.age_months !== null) {
    const years = Math.floor(child.age_months / 12);
    const months = child.age_months % 12;
    if (years > 0) {
      return months > 0 ? `${years} yıl ${months} ay` : `${years} yıl`;
    }
    return `${child.age_months} aylık`;
  }
  
  // Fallback: birth_date'den hesapla
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

// Default questions (Backend ile uyumlu ID'ler)
const defaultQuestions: BLWTestQuestion[] = [
  {
    id: 'q1_sitting',
    category: 'physical_readiness',
    question: 'Bebeğiniz desteksiz oturabiliyor mu?',
    description: 'Mama sandalyesinde veya kucağınızda, öne veya yana devrilmeden başını dik tutarak oturabiliyor olması gerekir.',
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
    id: 'q2_head_control',
    category: 'physical_readiness',
    question: 'Bebeğinizin baş kontrolü tam mı?',
    description: 'Başını dik tutabiliyor ve her iki yana rahatça çevirebiliyor olmalı.',
    icon: 'fa-solid fa-head-side-mask',
    weight: 15,
    options: [
      { id: 'head_yes', text: 'Evet, tam kontrol var', value: 100 },
      { id: 'head_mostly', text: 'Çoğunlukla kontrol edebiliyor', value: 70 },
      { id: 'head_partial', text: 'Bazen sallanıyor', value: 40 },
      { id: 'head_no', text: 'Hayır, başını tutamıyor', value: 0 }
    ]
  },
  {
    id: 'q3_tongue_reflex',
    category: 'physical_readiness',
    question: 'Dil itme refleksi kayboldu mu?',
    description: 'Bebeğiniz kaşıkla verilen yiyecekleri dilinin ucuyla dışarı itmek yerine yutabiliyor mu?',
    icon: 'fa-solid fa-utensils',
    weight: 15,
    options: [
      { id: 'reflex_gone', text: 'Evet, yutabiliyor', value: 100 },
      { id: 'reflex_sometimes', text: 'Bazen itiyor bazen yutabiliyor', value: 60 },
      { id: 'reflex_present', text: 'Hala çoğunlukla itiyor', value: 20 },
      { id: 'reflex_uncertain', text: 'Henüz deneme fırsatı olmadı', value: 50 }
    ]
  },
  {
    id: 'q4_interest',
    category: 'feeding_history',
    question: 'Bebeğiniz yiyeceklere ilgi gösteriyor mu?',
    description: 'Sizin yediğinizi izliyor, ağzını açıyor veya yiyeceklere uzanmaya çalışıyor mu?',
    icon: 'fa-solid fa-face-smile',
    weight: 10,
    options: [
      { id: 'interest_high', text: 'Evet, çok ilgili', value: 100 },
      { id: 'interest_some', text: 'Bazen ilgi gösteriyor', value: 70 },
      { id: 'interest_rare', text: 'Nadiren ilgileniyor', value: 40 },
      { id: 'interest_no', text: 'Hayır, ilgilenmiyor', value: 10 }
    ]
  },
  {
    id: 'q5_grasp',
    category: 'physical_readiness',
    question: 'Bebeğiniz nesneleri kavrayıp ağzına götürebiliyor mu?',
    description: 'El-göz koordinasyonu gelişmiş ve oyuncakları ağzına götürebiliyor olmalı.',
    icon: 'fa-solid fa-hand',
    weight: 10,
    options: [
      { id: 'grasp_yes', text: 'Evet, rahatça yapabiliyor', value: 100 },
      { id: 'grasp_sometimes', text: 'Bazen yapabiliyor', value: 70 },
      { id: 'grasp_trying', text: 'Kavrayabiliyor ama ağzına götüremiyor', value: 40 },
      { id: 'grasp_no', text: 'Henüz yapamıyor', value: 0 }
    ]
  },
  {
    id: 'q6_age',
    category: 'physical_readiness',
    question: 'Bebeğinizin yaşı kaç ay?',
    description: 'WHO, ek gıdaya 6. aydan önce başlanmamasını önerir.',
    icon: 'fa-solid fa-calendar',
    weight: 10,
    options: [
      { id: 'age_6plus', text: '6+ ay', value: 100 },
      { id: 'age_5', text: '5-6 ay arası', value: 50 },
      { id: 'age_4_5', text: '4-5 ay arası', value: 10, is_red_flag: true, red_flag_message: '6 aydan önce ek gıdaya başlanması önerilmez. Doktorunuza danışın.' },
      { id: 'age_below5', text: '4 aydan küçük', value: 0, is_red_flag: true, red_flag_message: '4 aydan küçük bebekler için ek gıda çok erkendir. Mutlaka doktorunuza danışın.' }
    ]
  },
  {
    id: 'q7_highchair',
    category: 'environment',
    question: 'Uygun mama sandalyeniz var mı?',
    description: 'Bebeğinizin dik oturabileceği, ayaklarının yere basabileceği güvenli bir sandalye.',
    icon: 'fa-solid fa-chair',
    weight: 5,
    options: [
      { id: 'chair_yes', text: 'Evet, uygun sandalye var', value: 100 },
      { id: 'chair_planning', text: 'Yakında alacağız', value: 80 },
      { id: 'chair_lap', text: 'Kucakta beslemeyi planlıyoruz', value: 30 },
      { id: 'chair_no', text: 'Henüz düşünmedik', value: 50 }
    ]
  },
  {
    id: 'q8_medical',
    category: 'safety',
    question: 'Bebeğinizde boğulma riskini artıran tıbbi bir durum var mı?',
    description: 'Yutma güçlüğü, nörolojik sorunlar, prematürelik vb.',
    icon: 'fa-solid fa-notes-medical',
    weight: 10,
    options: [
      { id: 'medical_no', text: 'Hayır, bilinen bir sorun yok', value: 100 },
      { id: 'medical_mild', text: 'Küçük bir sorun var, doktora danıştık', value: 70 },
      { id: 'medical_yes', text: 'Evet var, doktora henüz danışmadık', value: 0, is_red_flag: true, red_flag_message: 'Tıbbi bir durum varsa mutlaka doktorunuza danışın.' },
      { id: 'medical_uncertain', text: 'Emin değilim', value: 50 }
    ]
  },
  {
    id: 'q9_first_aid',
    category: 'safety',
    question: 'Bebek ilk yardımı ve Heimlich manevrası hakkında bilginiz var mı?',
    description: 'Boğulma durumunda ne yapmanız gerektiğini biliyor musunuz?',
    icon: 'fa-solid fa-kit-medical',
    weight: 5,
    options: [
      { id: 'firstaid_yes', text: 'Evet, eğitim aldım/videolarını izledim', value: 100 },
      { id: 'firstaid_basic', text: 'Kısmen biliyorum', value: 60 },
      { id: 'firstaid_learn', text: 'Hayır, öğrenmem gerek', value: 30 },
      { id: 'firstaid_no', text: 'Hiç düşünmedim', value: 10 }
    ]
  },
  {
    id: 'q10_supervision',
    category: 'environment',
    question: 'Bebek yemek yerken yanında olabilir misiniz?',
    description: 'BLW\'de sürekli gözetim şarttır. Bebeği asla yalnız bırakmayın.',
    icon: 'fa-solid fa-eye',
    weight: 0,
    options: [
      { id: 'supervision_yes', text: 'Evet, her öğünde yanında olabilirim', value: 100 },
      { id: 'supervision_mostly', text: 'Çoğu öğünde olabilirim', value: 100 },
      { id: 'supervision_sometimes', text: 'Bazen başkası bakacak', value: 100 },
      { id: 'supervision_uncertain', text: 'Bilmiyorum', value: 100 }
    ]
  }
];

// Default result buckets
const defaultResultBuckets: BLWResultBucket[] = [
  {
    id: 'ready',
    min_score: 80,
    max_score: 100,
    title: 'BLW\'ye Hazır Görünüyorsunuz! 🎉',
    subtitle: 'Harika! Bebeğiniz ve siz hazırsınız',
    color: 'green',
    icon: 'fa-solid fa-circle-check',
    description: 'Bebeğiniz BLW (Baby-Led Weaning) yöntemine başlamak için gerekli tüm fiziksel ve gelişimsel işaretleri gösteriyor.',
    action_items: [
      'İlk yiyecekler olarak yumuşak, parmak şeklinde kesilebilen gıdalar tercih edin',
      'Buharda pişmiş havuç, tatlı patates, avokado veya muz ile başlayabilirsiniz',
      'İlk günlerde bebeğiniz daha çok oynayacak ve keşfedecek, bu normaldir',
      'Sabırlı olun ve bebeğinizin kendi hızında öğrenmesine izin verin'
    ],
    next_steps: [
      'BLW tariflerimize göz atın',
      'İlk yardım videolarını izleyin',
      'Malzeme rehberinden güvenli gıdaları öğrenin'
    ]
  },
  {
    id: 'almost',
    min_score: 55,
    max_score: 79,
    title: 'Neredeyse Hazır! 💪',
    subtitle: 'Birkaç alanda daha gelişim göstermeli',
    color: 'yellow',
    icon: 'fa-solid fa-hourglass-half',
    description: 'Bebeğiniz BLW\'ye neredeyse hazır, ancak bazı alanlarda biraz daha zaman geçirmek faydalı olabilir.',
    action_items: [
      'Desteksiz oturma pratiği yapın (yastıklarla destek vererek)',
      'Bebeğinizle birlikte yemek yiyin, size bakmasını sağlayın',
      'Oyuncakları kavrayıp ağzına götürmesi için fırsatlar yaratın',
      'Kaşıkla püre deneyimleri yaparak dil itme refleksini değerlendirin'
    ],
    next_steps: [
      '1-2 hafta sonra testi tekrarlayın',
      'Doktorunuza danışarak hazırlık sürecini değerlendirin',
      'Bu süreçte püre yöntemiyle başlayabilirsiniz'
    ]
  },
  {
    id: 'wait',
    min_score: 0,
    max_score: 54,
    title: 'Biraz Daha Zaman 🕐',
    subtitle: 'Henüz erken, bebeğiniz daha fazla gelişmeli',
    color: 'red',
    icon: 'fa-solid fa-clock',
    description: 'Bebeğiniz henüz BLW için hazır değil. Bu tamamen normal, her bebek kendi hızında gelişir.',
    action_items: [
      'Bebeğinizin baş ve boyun kontrolünü güçlendirmek için tummy time yapın',
      'Desteksiz oturma için kol ve sırt kaslarını geliştirmeye odaklanın',
      'Henüz 6 aylık değilse, 6. ayı bekleyin',
      'Doktorunuzla gelişim aşamalarını düzenli olarak kontrol edin'
    ],
    next_steps: [
      'Her ay testi tekrarlayın',
      'Doktorunuza danışın',
      'Gelişim egzersizleri yapın'
    ]
  }
];

export default function BLWTestPage() {
  const router = useRouter();
  const { isAuthenticated, children, refreshUser } = useUser();
  
  const [stage, setStage] = useState<TestStage>('intro');
  const [questions, setQuestions] = useState<BLWTestQuestion[]>(defaultQuestions);
  const [resultBuckets, setResultBuckets] = useState<BLWResultBucket[]>(defaultResultBuckets);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<BLWTestAnswer[]>([]);
  const [result, setResult] = useState<BLWTestResult | null>(null);
  const [redFlags, setRedFlags] = useState<BLWRedFlag[]>([]);
  const [resultBucket, setResultBucket] = useState<BLWResultBucket | null>(null);
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
  
  // Child selector
  const [selectedChildId, setSelectedChildId] = useState<string>('');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await toolService.getBLWTestConfig();
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
    const newAnswer: BLWTestAnswer = {
      question_id: currentQuestion.id,
      option_id: optionId,
      score: option.value
    };
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    // Check for red flags
    if (option.is_red_flag && option.red_flag_message) {
      setRedFlags([...redFlags, {
        question_id: currentQuestion.id,
        message: option.red_flag_message,
        severity: 'critical'
      }]);
    }

    // Move to next question or finish
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Test completed
      finishTest(newAnswers);
    }
  };

  const finishTest = (finalAnswers: BLWTestAnswer[]) => {
    const score = calculateScore(finalAnswers);
    const bucket = findResultBucket(score);
    
    const testResult: BLWTestResult = {
      score,
      result_bucket_id: bucket?.id || 'wait',
      red_flags: redFlags,
      answers: finalAnswers,
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

  const calculateScore = (answerList: BLWTestAnswer[]): number => {
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

  const findResultBucket = (score: number): BLWResultBucket | null => {
    return resultBuckets.find(b => score >= b.min_score && score <= b.max_score) || null;
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!result) return;
    
    setIsLoading(true);
    try {
      const response = await toolService.submitBLWTestWithRegistration(
        result.answers,
        {
          email: regEmail,
          password: regPassword,
          name: regName,
          child_name: regChildName,
          child_birth_date: regChildBirthDate
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
      await toolService.submitBLWTest(result.answers, selectedChildId);
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
        <button onClick={() => router.push('/araclar')} className="text-gray-500">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <span className="font-display font-bold text-lg text-slate-800">BLW Hazırlık Testi</span>
        <div className="w-6"></div>
      </div>

      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        
        {/* INTRO STAGE */}
        {stage === 'intro' && (
          <div className="animate-fade-in">
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-lg p-8 md:p-12 text-center">
              {/* Icon */}
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                <i className="fa-solid fa-baby"></i>
              </div>

              {/* Title */}
              <h1 className="font-display font-bold text-3xl text-slate-800 mb-3">
                BLW Hazırlık Testi
              </h1>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                WHO standartlarında {questions.length} soruda, yaklaşık 2 dakikada bebeğinizin Baby-Led Weaning yöntemine hazır olup olmadığını öğrenin.
              </p>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-2xl mb-2">📋</div>
                  <div className="text-sm font-bold text-gray-700">{questions.length} Soru</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-2xl mb-2">⏱️</div>
                  <div className="text-sm font-bold text-gray-700">~2 Dakika</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="text-sm font-bold text-gray-700">Kişiselleştirilmiş Sonuç</div>
                </div>
              </div>

              {/* Start Button */}
              <button 
                onClick={handleStartTest}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-12 py-4 rounded-xl font-bold shadow-lg transition-all transform hover:scale-105"
              >
                Teste Başla
              </button>

              {/* Disclaimer */}
              <p className="text-xs text-gray-400 mt-8 max-w-lg mx-auto">
                <i className="fa-solid fa-info-circle mr-1"></i>
                Bu test tıbbi tanı yerine geçmez. Bebeğinizin gelişimi hakkında kesin bilgi için pediatristinize danışın.
              </p>
            </div>

            {/* SEO Info */}
            <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-display font-bold text-xl text-slate-800 mb-4">
                BLW (Baby-Led Weaning) Nedir?
              </h2>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                Baby-Led Weaning (Bebek Liderliğinde Ek Gıdaya Geçiş), bebeğinizin kendi kendine beslenmeyi öğrenmesi için tasarlanmış bir yöntemdir. 
                Geleneksel püre yöntemi yerine, bebeğiniz parmak şeklinde kesilmiş yumuşak gıdaları kendi elleriyle alır ve yer. 
                Bu yöntem, bebeğinizin motor becerilerini, el-göz koordinasyonunu ve bağımsızlığını geliştirir.
              </p>
              <h3 className="font-bold text-slate-800 mb-2">WHO Önerileri</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Dünya Sağlık Örgütü (WHO), bebeklerin ilk 6 ay sadece anne sütü almasını, 6. aydan itibaren ek gıdaya başlanmasını önerir. 
                BLW yöntemi için bebeğinizin desteksiz oturabilmesi, baş kontrolünün tam olması ve yiyeceklere ilgi göstermesi gerekir.
              </p>
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
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="p-8 md:p-12">
                {/* Question Counter */}
                <div className="text-center mb-6">
                  <span className="inline-block bg-green-50 text-green-600 px-4 py-1 rounded-full text-sm font-bold">
                    Soru {currentQuestionIndex + 1} / {questions.length}
                  </span>
                </div>

                {/* Question Icon */}
                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                  <i className={currentQuestion.icon || 'fa-solid fa-question'}></i>
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
                      className="w-full bg-gray-50 hover:bg-green-50 border-2 border-gray-200 hover:border-green-400 rounded-xl px-6 py-4 text-left font-medium text-gray-700 hover:text-green-700 transition-all transform hover:scale-[1.02]"
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

                {/* Footer Note */}
                <p className="text-xs text-gray-400 text-center mt-8">
                  <i className="fa-solid fa-shield-halved mr-1"></i>
                  Bu test tıbbi tanı değildir, sadece bilgilendirme amaçlıdır.
                </p>
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
                          • {flag.message}
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

                {/* Action Items */}
                {resultBucket.action_items.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <i className="fa-solid fa-list-check text-green-500"></i>
                      Bugün Ne Yapmalı?
                    </h3>
                    <ul className="space-y-2">
                      {resultBucket.action_items.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-green-500 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Next Steps */}
                {resultBucket.next_steps.length > 0 && (
                  <div>
                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <i className="fa-solid fa-forward text-orange-500"></i>
                      Sonraki Adımlar
                    </h3>
                    <ul className="space-y-2">
                      {resultBucket.next_steps.map((step, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-orange-500 mt-0.5">→</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Allergy Warning (if child has allergies) */}
            {isAuthenticated && children.length > 0 && children[0].allergies.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-exclamation-triangle"></i>
                </div>
                <div>
                  <h4 className="font-bold text-amber-800 mb-1">Alerji Uyarısı</h4>
                  <p className="text-sm text-amber-700">
                    Bebeğinizin <strong>{children[0].allergies.join(', ')}</strong> alerjisi var. 
                    Tarifleri seçerken bu alerjenleri içermeyen yiyecekleri tercih edin.
                  </p>
                </div>
              </div>
            )}

            {/* Related Links */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-link text-blue-500"></i>
                İlgili Rehberler
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link href="/tarifler?age=6-9-ay" className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl px-4 py-3 text-center text-sm font-bold text-blue-700 transition-colors">
                  <i className="fa-solid fa-utensils mr-1"></i> BLW Tarifleri
                </Link>
                <Link href="/beslenme-rehberi" className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl px-4 py-3 text-center text-sm font-bold text-green-700 transition-colors">
                  <i className="fa-solid fa-carrot mr-1"></i> Malzeme Rehberi
                </Link>
                <Link href="/kesfet" className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl px-4 py-3 text-center text-sm font-bold text-purple-700 transition-colors">
                  <i className="fa-solid fa-book mr-1"></i> BLW Rehberi
                </Link>
              </div>
            </div>

            {/* Emergency Note */}
            <div className="bg-gray-100 rounded-2xl p-4 text-center">
              <p className="text-xs text-gray-500">
                <i className="fa-solid fa-hospital mr-1"></i>
                Acil durumlarda 112&apos;yi arayın. Bebeğinizin sağlığıyla ilgili tüm konularda doktorunuza danışın.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleRestart}
                className="flex-1 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold transition-colors"
              >
                <i className="fa-solid fa-rotate-right mr-2"></i>
                Testi Tekrarla
              </button>
              {isAuthenticated && (
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all"
                >
                  <i className="fa-solid fa-gauge mr-2"></i>
                  Dashboard&apos;a Git
                </button>
              )}
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
              
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
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
                  className="flex items-center gap-3 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:border-green-400 transition-colors"
                >
                  <input 
                    type="radio" 
                    name="child" 
                    value={child.id}
                    checked={selectedChildId === child.id}
                    onChange={(e) => setSelectedChildId(e.target.value)}
                    className="accent-green-500"
                  />
                  <div>
                    <div className="font-bold text-slate-800">{child.name}</div>
                    <div className="text-sm text-gray-500">
                      {calculateAgeDisplay(child)} • {child.gender === 'male' ? 'Erkek' : child.gender === 'female' ? 'Kız' : ''}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            
            <button 
              onClick={handleChildSelectorSubmit}
              disabled={!selectedChildId || isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
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
