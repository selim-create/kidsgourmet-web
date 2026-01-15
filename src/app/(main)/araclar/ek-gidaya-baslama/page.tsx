"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

type Stage = 'intro' | 'test' | 'result';

interface Question {
  id: string;
  question: string;
  description: string;
  icon: string;
  options: { id: string; text: string; value: number }[];
}

const defaultQuestions: Question[] = [
  {
    id: 'q1',
    question: 'Bebeğinizin yaşı kaç ay?',
    description: 'WHO, ek gıdaya 6. aydan önce başlanmamasını önerir.',
    icon: 'fa-solid fa-calendar',
    options: [
      { id: 'a', text: '6+ ay', value: 100 },
      { id: 'b', text: '5-6 ay arası', value: 50 },
      { id: 'c', text: '4-5 ay arası', value: 10 },
      { id: 'd', text: '4 aydan küçük', value: 0 }
    ]
  },
  {
    id: 'q2',
    question: 'Bebeğiniz desteksiz oturabiliyor mu?',
    description: 'Mama sandalyesinde başını dik tutarak oturabiliyor olması gerekir.',
    icon: 'fa-solid fa-chair',
    options: [
      { id: 'a', text: 'Evet, rahatça oturabiliyor', value: 100 },
      { id: 'b', text: 'Kısa süreler oturabiliyor', value: 60 },
      { id: 'c', text: 'Destekle oturabiliyor', value: 30 },
      { id: 'd', text: 'Hayır, henüz oturamıyor', value: 0 }
    ]
  },
  {
    id: 'q3',
    question: 'Bebeğinizin baş kontrolü tam mı?',
    description: 'Başını dik tutabiliyor ve her iki yana rahatça çevirebiliyor olmalı.',
    icon: 'fa-solid fa-head-side-mask',
    options: [
      { id: 'a', text: 'Evet, tam kontrol var', value: 100 },
      { id: 'b', text: 'Çoğunlukla kontrol edebiliyor', value: 70 },
      { id: 'c', text: 'Bazen sallanıyor', value: 40 },
      { id: 'd', text: 'Hayır, başını tutamıyor', value: 0 }
    ]
  },
  {
    id: 'q4',
    question: 'Dil itme refleksi kayboldu mu?',
    description: 'Kaşıkla verilen yiyecekleri dilinin ucuyla dışarı itmek yerine yutabiliyor mu?',
    icon: 'fa-solid fa-utensils',
    options: [
      { id: 'a', text: 'Evet, yutabiliyor', value: 100 },
      { id: 'b', text: 'Bazen itiyor bazen yutabiliyor', value: 60 },
      { id: 'c', text: 'Hala çoğunlukla itiyor', value: 20 },
      { id: 'd', text: 'Henüz deneme fırsatı olmadı', value: 50 }
    ]
  },
  {
    id: 'q5',
    question: 'Bebeğiniz yiyeceklere ilgi gösteriyor mu?',
    description: 'Sizin yediğinizi izliyor, ağzını açıyor veya yiyeceklere uzanmaya çalışıyor mu?',
    icon: 'fa-solid fa-face-smile',
    options: [
      { id: 'a', text: 'Evet, çok ilgili', value: 100 },
      { id: 'b', text: 'Bazen ilgi gösteriyor', value: 70 },
      { id: 'c', text: 'Nadiren ilgileniyor', value: 40 },
      { id: 'd', text: 'Hayır, ilgilenmiyor', value: 10 }
    ]
  }
];

export default function EkGidayaBaslamaPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [score, setScore] = useState(0);

  const currentQuestion = defaultQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / defaultQuestions.length) * 100;

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (currentQuestionIndex < defaultQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const totalScore = Object.values(newAnswers).reduce((a, b) => a + b, 0) / defaultQuestions.length;
      setScore(Math.round(totalScore));
      setStage('result');
    }
  };

  const handleRestart = () => {
    setStage('intro');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setScore(0);
  };

  const getResultData = () => {
    if (score >= 80) {
      return {
        title: 'Bebeğiniz Hazır! 🎉',
        color: 'green',
        gradient: 'from-green-400 to-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: '✅',
        description: 'Harika! Bebeğiniz ek gıdaya başlamak için gerekli tüm gelişimsel işaretleri gösteriyor.',
        recommendations: [
          'İlk yiyecekler olarak tek malzemeli, yumuşak gıdalar tercih edin',
          'Püre veya parmak gıda yöntemiyle başlayabilirsiniz',
          'Her yeni gıdayı 3-5 gün tek başına vererek alerji kontrolü yapın',
          'İlk günlerde bebeğiniz daha çok keşfedecek, bu normaldir'
        ]
      };
    } else if (score >= 50) {
      return {
        title: 'Neredeyse Hazır 💪',
        color: 'yellow',
        gradient: 'from-amber-400 to-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        icon: '⏳',
        description: 'Bebeğiniz neredeyse hazır, ancak bazı alanlarda biraz daha zaman geçirmek faydalı olabilir.',
        recommendations: [
          'Desteksiz oturma pratiği yapın',
          'Bebeğinizle birlikte yemek yiyin, size bakmasını sağlayın',
          'Oyuncakları kavrayıp ağzına götürmesi için fırsatlar yaratın',
          '1-2 hafta sonra tekrar değerlendirin'
        ]
      };
    } else {
      return {
        title: 'Biraz Daha Zaman 🕐',
        color: 'red',
        gradient: 'from-red-400 to-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: '⏰',
        description: 'Bebeğiniz henüz ek gıdaya hazır değil. Bu tamamen normal, her bebek kendi hızında gelişir.',
        recommendations: [
          'Bebeğinizin baş ve boyun kontrolünü güçlendirmek için tummy time yapın',
          'Desteksiz oturma için kol ve sırt kaslarını geliştirmeye odaklanın',
          'Henüz 6 aylık değilse, 6. ayı bekleyin',
          'Doktorunuzla gelişim aşamalarını düzenli olarak kontrol edin'
        ]
      };
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-20 z-30">
        <button onClick={() => router.push('/araclar')} className="text-gray-500">
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
              <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                <i className="fa-solid fa-baby-carriage"></i>
              </div>

              <h1 className="font-display font-bold text-3xl text-slate-800 mb-3">
                Ek Gıdaya Başlama Kontrolü
              </h1>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                WHO standartlarında {defaultQuestions.length} soruda, yaklaşık 1 dakikada bebeğinizin ek gıdaya başlamaya hazır olup olmadığını öğrenin.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-2xl mb-2">📋</div>
                  <div className="text-sm font-bold text-gray-700">{defaultQuestions.length} Soru</div>
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

              <button 
                onClick={() => setStage('test')}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-12 py-4 rounded-xl font-bold shadow-lg transition-all transform hover:scale-105"
              >
                Teste Başla
              </button>

              <p className="text-xs text-gray-400 mt-8 max-w-lg mx-auto">
                <i className="fa-solid fa-info-circle mr-1"></i>
                Bu test tıbbi tanı yerine geçmez. Bebeğinizin beslenmesi hakkında doktorunuza danışın.
              </p>
            </div>

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
              <div className="h-2 bg-gray-100 w-full">
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="p-8 md:p-12">
                <div className="text-center mb-6">
                  <span className="inline-block bg-orange-50 text-orange-600 px-4 py-1 rounded-full text-sm font-bold">
                    Soru {currentQuestionIndex + 1} / {defaultQuestions.length}
                  </span>
                </div>

                <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                  <i className={currentQuestion.icon}></i>
                </div>

                <h2 className="font-display font-bold text-2xl text-slate-800 mb-4 text-center">
                  {currentQuestion.question}
                </h2>
                
                <p className="text-gray-500 mb-8 text-center max-w-xl mx-auto">
                  {currentQuestion.description}
                </p>

                <div className="space-y-3 max-w-xl mx-auto">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.value)}
                      className="w-full bg-gray-50 hover:bg-orange-50 border-2 border-gray-200 hover:border-orange-400 rounded-xl px-6 py-4 text-left font-medium text-gray-700 hover:text-orange-700 transition-all transform hover:scale-[1.02]"
                    >
                      {option.text}
                    </button>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <button 
                    onClick={() => setStage('intro')}
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
        {stage === 'result' && (() => {
          const result = getResultData();
          return (
            <div className="animate-fade-in space-y-6">
              <div className={`rounded-[2rem] border-2 ${result.border} ${result.bg} overflow-hidden`}>
                <div className={`bg-gradient-to-r ${result.gradient} text-white p-8 text-center`}>
                  <div className="text-6xl mb-4">{result.icon}</div>
                  <h2 className="font-display font-bold text-3xl mb-2">{result.title}</h2>
                  <div className="inline-block bg-white/20 px-6 py-2 rounded-full">
                    <span className="font-bold text-2xl">{score}</span>
                    <span className="text-sm opacity-80"> / 100 puan</span>
                  </div>
                </div>
                
                <div className="p-8">
                  <p className="text-gray-700 mb-6 leading-relaxed">{result.description}</p>

                  <div>
                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <i className="fa-solid fa-list-check text-orange-500"></i>
                      Öneriler
                    </h3>
                    <ul className="space-y-2">
                      {result.recommendations.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-orange-500 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-link text-blue-500"></i>
                  İlgili Kaynaklar
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => router.push('/araclar/blw-testi')}
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

              <div className="flex gap-3">
                <button 
                  onClick={handleRestart}
                  className="flex-1 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold transition-colors"
                >
                  <i className="fa-solid fa-rotate-right mr-2"></i>
                  Testi Tekrarla
                </button>
                <button 
                  onClick={() => router.push('/araclar')}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all"
                >
                  <i className="fa-solid fa-tools mr-2"></i>
                  Diğer Araçlar
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
