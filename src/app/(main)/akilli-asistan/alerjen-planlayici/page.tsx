"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Allergen {
  id: string;
  name: string;
  emoji: string;
  startAge: string;
  minAge: number; // Sayısal yaş (ay cinsinden)
  riskLevel: 'low' | 'medium' | 'high';
  ingredientSlug?: string; // Beslenme rehberi linki için
}

const allergens: Allergen[] = [
  { id: 'milk', name: 'İnek Sütü', emoji: '🥛', startAge: '6+ ay', minAge: 6, riskLevel: 'high', ingredientSlug: 'inek-sutu' },
  { id: 'egg', name: 'Yumurta', emoji: '🥚', startAge: '6+ ay', minAge: 6, riskLevel: 'high', ingredientSlug: 'yumurta' },
  { id: 'peanut', name: 'Yer Fıstığı', emoji: '🥜', startAge: '6+ ay', minAge: 6, riskLevel: 'high', ingredientSlug: 'yer-fistigi' },
  { id: 'sesame', name: 'Susam', emoji: '◾', startAge: '6+ ay', minAge: 6, riskLevel: 'medium', ingredientSlug: 'susam' },
  { id: 'gluten', name: 'Gluten (Buğday)', emoji: '🌾', startAge: '6+ ay', minAge: 6, riskLevel: 'medium', ingredientSlug: 'bugday' },
  { id: 'soy', name: 'Soya', emoji: '🌱', startAge: '6+ ay', minAge: 6, riskLevel: 'low', ingredientSlug: 'soya' },
  { id: 'fish', name: 'Balık', emoji: '🐟', startAge: '8+ ay', minAge: 8, riskLevel: 'medium', ingredientSlug: 'balik' },
  { id: 'walnut', name: 'Ceviz', emoji: '🌰', startAge: '9+ ay', minAge: 9, riskLevel: 'high', ingredientSlug: 'ceviz' },
  { id: 'hazelnut', name: 'Fındık', emoji: '🌳', startAge: '9+ ay', minAge: 9, riskLevel: 'high', ingredientSlug: 'findik' },
  { id: 'almond', name: 'Badem', emoji: '🫘', startAge: '9+ ay', minAge: 9, riskLevel: 'high', ingredientSlug: 'badem' },
  { id: 'shellfish', name: 'Kabuklu Deniz Ürünleri', emoji: '🦐', startAge: '12+ ay', minAge: 12, riskLevel: 'high', ingredientSlug: 'karides' },
  { id: 'honey', name: 'Bal', emoji: '🍯', startAge: '12+ ay', minAge: 12, riskLevel: 'high', ingredientSlug: 'bal' },
  { id: 'celery', name: 'Kereviz', emoji: '🥬', startAge: '8+ ay', minAge: 8, riskLevel: 'low', ingredientSlug: 'kereviz' },
  { id: 'mustard', name: 'Hardal', emoji: '🟡', startAge: '12+ ay', minAge: 12, riskLevel: 'low' },
];

type Stage = 'select' | 'plan';

export default function AlerjenPlanlayiciPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('select');
  const [selectedAllergen, setSelectedAllergen] = useState<Allergen | null>(null);
  const [babyAgeMonths, setBabyAgeMonths] = useState<number>(6);

  // Filter allergens based on baby age (for future use or alternative display)
  const filteredAllergens = useMemo(() => {
    return allergens.filter(a => a.minAge <= babyAgeMonths);
  }, [babyAgeMonths]);

  const handleSelectAllergen = (allergen: Allergen) => {
    setSelectedAllergen(allergen);
    setStage('plan');
  };

  const getTrialPlan = (allergen: Allergen) => {
    const plans: Record<string, { days: { day: number; amount: string; tip: string }[]; notes: string[] }> = {
      milk: {
        days: [
          { day: 1, amount: '1 kaşık yoğurt', tip: 'Sabah öğününde, evde olduğunuzda deneyin' },
          { day: 2, amount: '2 kaşık yoğurt', tip: 'Aynı saatte, aynı ortamda tekrarlayın' },
          { day: 3, amount: '3-4 kaşık yoğurt', tip: 'Miktar arttırın, reaksiyon izleyin' },
          { day: 4, amount: 'Normal porsiyon', tip: 'Problem yoksa normal porsiyonla devam edin' },
          { day: 5, amount: 'Farklı süt ürünü', tip: 'Peynir veya süt ile deneyin' },
        ],
        notes: [
          'İlk denemeyi evde yapın',
          'Her defasında aynı saatte deneyin',
          'Diğer yeni gıdalarla karıştırmayın',
          'Ailede süt alerjisi varsa doktora danışın'
        ]
      },
      egg: {
        days: [
          { day: 1, amount: '1/4 haşlanmış yumurta sarısı', tip: 'Püre kıvamında ezin' },
          { day: 2, amount: '1/2 haşlanmış yumurta sarısı', tip: 'Aynı saatte tekrarlayın' },
          { day: 3, amount: '1 tam haşlanmış yumurta sarısı', tip: 'Sarıyı bitirin, beyaza geçmeyin' },
          { day: 4, amount: 'Sarı + az beyaz', tip: 'Yavaşça beyazı da ekleyin' },
          { day: 5, amount: 'Tam yumurta', tip: 'Problem yoksa tam yumurta verin' },
        ],
        notes: [
          'Önce sarısı, sonra beyazı deneyin',
          'Tamamen pişmiş olmalı',
          'Çiğ yumurta vermeyin',
          'Ailede yumurta alerjisi varsa dikkatli olun'
        ]
      },
      peanut: {
        days: [
          { day: 1, amount: '1/2 çay kaşığı fıstık ezmesi (suda eritilmiş)', tip: 'Çok az miktarla başlayın' },
          { day: 2, amount: '1 çay kaşığı fıstık ezmesi', tip: 'Püre veya yoğurtla karıştırın' },
          { day: 3, amount: '2 çay kaşığı', tip: 'Miktar arttırın' },
          { day: 4, amount: '1 yemek kaşığı', tip: 'Normal porsiyona yaklaşın' },
        ],
        notes: [
          'Tam fıstık vermeyin, boğulma riski var',
          'Fıstık ezmesini sulu kıvamda verin',
          'Ailede fıstık alerjisi varsa önce doktora danışın',
          'Reaksiyon çok hızlı olabilir, dikkatli olun'
        ]
      },
      gluten: {
        days: [
          { day: 1, amount: '1 kaşık ekmek içi (yumuşak)', tip: 'Az miktarla başlayın' },
          { day: 2, amount: '2 kaşık ekmek veya makarna', tip: 'Miktar arttırın' },
          { day: 3, amount: 'Normal porsiyon', tip: 'Problem yoksa normal verin' },
        ],
        notes: [
          'Sade ekmek veya makarna tercih edin',
          'Çölyak hastalığı ailede varsa doktora danışın',
          'Reaksiyon hemen olmayabilir, günler sürebilir'
        ]
      },
      fish: {
        days: [
          { day: 1, amount: '1 kaşık beyaz et balık', tip: 'Dil balığı veya levrek ideal' },
          { day: 2, amount: '2 kaşık balık', tip: 'Aynı balık türüyle devam edin' },
          { day: 3, amount: 'Normal porsiyon', tip: 'Problem yoksa artırın' },
        ],
        notes: [
          'Beyaz et balıklarla başlayın',
          'Kılçıkları çok iyi temizleyin',
          'Çok taze balık kullanın',
          'Ailede balık alerjisi varsa dikkatli olun'
        ]
      },
      shellfish: {
        days: [
          { day: 1, amount: '1 kaşık karides/midye', tip: 'Çok az miktarla başlayın' },
          { day: 2, amount: '2 kaşık', tip: 'Miktar arttırın' },
          { day: 3, amount: 'Normal porsiyon', tip: 'Problem yoksa devam edin' },
        ],
        notes: [
          '12 aydan önce önerilmez',
          'Çok iyi pişmiş olmalı',
          'Ailede deniz ürünü alerjisi varsa doktora danışın',
          'Reaksiyon hızlı ve şiddetli olabilir'
        ]
      },
      soy: {
        days: [
          { day: 1, amount: '1 kaşık soya sütü/yoğurdu', tip: 'Az miktarla başlayın' },
          { day: 2, amount: '2 kaşık', tip: 'Miktar arttırın' },
          { day: 3, amount: 'Normal porsiyon', tip: 'Problem yoksa devam edin' },
        ],
        notes: [
          'Soya genelde düşük risk taşır',
          'Fermente soya ürünleri (tofu) daha iyidir',
          'GMO olmayan soya tercih edin'
        ]
      },
      treenut: {
        days: [
          { day: 1, amount: '1/2 çay kaşığı badem ezmesi', tip: 'Çok az miktarla başlayın' },
          { day: 2, amount: '1 çay kaşığı', tip: 'Miktar arttırın' },
          { day: 3, amount: '2 çay kaşığı', tip: 'Normal porsiyona yaklaşın' },
        ],
        notes: [
          'Tam fındık/badem vermeyin, boğulma riski',
          'Ezme kıvamında verin',
          'Ailede sert kabuklu meyve alerjisi varsa dikkatli olun',
          'Her bir ceviz türü ayrı alerjendir'
        ]
      },
      sesame: {
        days: [
          { day: 1, amount: '1/2 çay kaşığı tahin', tip: 'Püre veya yoğurtla karıştırın' },
          { day: 2, amount: '1 çay kaşığı tahin', tip: 'Miktar arttırın' },
          { day: 3, amount: '2 çay kaşığı', tip: 'Normal porsiyona yaklaşın' },
        ],
        notes: [
          'Tahin en kolay susam deneme yöntemidir',
          'Tam susam vermeyin, çok küçüktür',
          'Ailede susam alerjisi varsa dikkatli olun'
        ]
      },
      walnut: {
        days: [
          { day: 1, amount: '1/2 çay kaşığı ceviz ezmesi', tip: 'Çok az miktarla başlayın' },
          { day: 2, amount: '1 çay kaşığı', tip: 'Miktar arttırın' },
          { day: 3, amount: '2 çay kaşığı', tip: 'Normal porsiyona yaklaşın' },
        ],
        notes: [
          'Tam ceviz vermeyin, boğulma riski',
          'Ezme veya ince öğütülmüş halde verin',
          'Ailede sert kabuklu meyve alerjisi varsa dikkatli olun'
        ]
      },
      hazelnut: {
        days: [
          { day: 1, amount: '1/2 çay kaşığı fındık ezmesi', tip: 'Çok az miktarla başlayın' },
          { day: 2, amount: '1 çay kaşığı', tip: 'Miktar arttırın' },
          { day: 3, amount: '2 çay kaşığı', tip: 'Normal porsiyona yaklaşın' },
        ],
        notes: [
          'Tam fındık vermeyin, boğulma riski',
          'Ezme veya ince öğütülmüş halde verin',
          'Ailede sert kabuklu meyve alerjisi varsa dikkatli olun'
        ]
      },
      almond: {
        days: [
          { day: 1, amount: '1/2 çay kaşığı badem ezmesi', tip: 'Çok az miktarla başlayın' },
          { day: 2, amount: '1 çay kaşığı', tip: 'Miktar arttırın' },
          { day: 3, amount: '2 çay kaşığı', tip: 'Normal porsiyona yaklaşın' },
        ],
        notes: [
          'Tam badem vermeyin, boğulma riski',
          'Ezme veya ince öğütülmüş halde verin',
          'Ailede sert kabuklu meyve alerjisi varsa dikkatli olun'
        ]
      },
      honey: {
        days: [
          { day: 1, amount: '1/2 çay kaşığı bal', tip: '12 aydan önce kesinlikle vermeyin' },
          { day: 2, amount: '1 çay kaşığı bal', tip: 'Miktar arttırın' },
          { day: 3, amount: 'Normal porsiyon', tip: 'Problem yoksa devam edin' },
        ],
        notes: [
          '12 aydan önce bal vermeyin - botulizm riski',
          'İlk bal denemesi 12. aydan sonra yapılmalı',
          'Pastörize bal tercih edin'
        ]
      },
      celery: {
        days: [
          { day: 1, amount: '1 kaşık pişmiş kereviz', tip: 'İyi pişmiş ve püre halde verin' },
          { day: 2, amount: '2 kaşık pişmiş kereviz', tip: 'Miktar arttırın' },
          { day: 3, amount: 'Normal porsiyon', tip: 'Problem yoksa devam edin' },
        ],
        notes: [
          'Kereviz genelde düşük risk taşır',
          'İyi pişmiş halde verin',
          'Çorbalarda kullanabilirsiniz'
        ]
      },
      mustard: {
        days: [
          { day: 1, amount: 'Çok az hardal (yemekle)', tip: '12 aydan sonra deneyin' },
          { day: 2, amount: 'Az miktarda hardal', tip: 'Miktar arttırın' },
          { day: 3, amount: 'Normal kullanım', tip: 'Problem yoksa devam edin' },
        ],
        notes: [
          '12 aydan önce hardal önerilmez',
          'Baharatlı yiyecekleri dikkatli tanıtın',
          'İlk deneme çok az miktarda olmalı'
        ]
      },
    };

    return plans[allergen.id] || plans.milk;
  };

  const warningSigns = [
    '🔴 Deri döküntüsü veya kızarıklık',
    '🔴 Öksürük, hırıltılı nefes alma',
    '🔴 Kusma veya ishal',
    '🔴 Şişlik (özellikle yüz, dudaklar)',
    '🔴 Huzursuzluk, aşırı ağlama',
    '🔴 Solgunluk, uyuşukluk',
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white px-4 py-3 pt-[25px] flex items-center justify-between shadow-sm sticky top-0 z-30">
        <button onClick={() => router.push('/araclar')} className="text-gray-500">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <span className="font-display font-bold text-lg text-slate-800">Alerjen Planlayıcı</span>
        <div className="w-6"></div>
      </div>

      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-[2rem] p-8 md:p-12 text-white text-center mb-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            <i className="fa-solid fa-shield-heart"></i>
          </div>
          <h1 className="font-display font-bold text-3xl mb-3">Alerjen Deneme Planlayıcı</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Alerjenik gıdaları güvenle tanıtın.
          </p>
        </div>

        {/* SELECT STAGE */}
        {stage === 'select' && (
          <div className="animate-fade-in space-y-6">
            {/* Baby Age Input */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Bebeğinizin Yaşı (ay)
              </label>
              <input
                type="number"
                min="0"
                max="36"
                value={babyAgeMonths}
                onChange={(e) => setBabyAgeMonths(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Allergen Grid */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
              <h2 className="font-bold text-slate-800 text-xl mb-4">Alerjen Seçin</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {filteredAllergens.map((allergen) => (
                  <button
                    key={allergen.id}
                    onClick={() => handleSelectAllergen(allergen)}
                    className="bg-gray-50 hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-400 rounded-xl p-4 text-center transition-all transform hover:scale-105"
                  >
                    <div className="text-4xl mb-2">{allergen.emoji}</div>
                    <div className="font-bold text-sm text-slate-800 mb-1">{allergen.name}</div>
                    <div className={`text-xs px-2 py-1 rounded-full inline-block border ${getRiskColor(allergen.riskLevel)}`}>
                      {allergen.startAge}
                    </div>
                    {allergen.ingredientSlug && (
                      <Link 
                        href={`/beslenme-rehberi/${allergen.ingredientSlug}`}
                        className="inline-flex items-center text-xs text-purple-600 hover:text-purple-700 font-medium mt-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <i className="fa-solid fa-book-open mr-1"></i>
                      </Link>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <i className="fa-solid fa-info-circle text-blue-600 text-xl mt-1"></i>
                <div>
                  <h4 className="font-bold text-blue-900 mb-2">Alerjen Deneme Nedir?</h4>
                  <p className="text-blue-800 text-sm leading-relaxed mb-3">
                    Alerjen deneme; bebeğinize alerji yapma potansiyeli olan gıdaların, ek gıdaya geçildikten sonra 
                    (genellikle 6. ay civarı) kontrollü ve bilinçli şekilde tanıtılmasıdır.
                  </p>
                  <p className="text-blue-800 text-sm leading-relaxed mb-3">
                    Uygun zamanda ve doğru yöntemle yapılan alerjen denemeler, bazı bebeklerde ileride gelişebilecek 
                    gıda alerjisi riskini azaltmaya yardımcı olabilir.
                  </p>
                  <h5 className="font-bold text-blue-900 mb-2 text-sm">Dikkat edilmesi gerekenler:</h5>
                  <ul className="text-blue-800 text-sm space-y-1 mb-4">
                    <li>✓ Aynı anda sadece tek bir alerjen deneyin</li>
                    <li>✓ Denemeyi evde ve gündüz saatlerinde yapın</li>
                    <li>✓ İlk deneme miktarını çok küçük tutun</li>
                    <li>✓ Aynı alerjeni en az 3 gün üst üste gözlemleyin</li>
                    <li>✓ Şiddetli egzaması olan, daha önce reaksiyon geçirmiş veya ailesinde ciddi alerji öyküsü bulunan bebekler için doktorunuza danışın</li>
                  </ul>
                  <p className="text-blue-700 text-xs italic">
                    <i className="fa-solid fa-triangle-exclamation mr-1"></i>
                    Bu araç tıbbi tanı koymaz. Şiddetli bir reaksiyon durumunda en yakın sağlık kuruluşuna başvurunuz.
                  </p>
                </div>
              </div>
            </div>

            {/* İlgili Rehberler */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-link text-purple-500"></i>
                İlgili Rehberler
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Link 
                  href="/beslenme-rehberi/3-gun-kurali"
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-300 hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-calendar-check text-green-600"></i>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 group-hover:text-purple-600 transition-colors">3 Gün Kuralı</span>
                    <p className="text-xs text-gray-500">Güvenli besin tanıtımı rehberi</p>
                  </div>
                </Link>
                <Link 
                  href="/beslenme-rehberi/alerji-belirtileri"
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-300 hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-heart-pulse text-red-600"></i>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 group-hover:text-purple-600 transition-colors">Alerji Belirtileri Rehberi</span>
                    <p className="text-xs text-gray-500">Reaksiyonları Tanıyın</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* PLAN STAGE */}
        {stage === 'plan' && selectedAllergen && (() => {
          const plan = getTrialPlan(selectedAllergen);
          return (
            <div className="animate-fade-in space-y-6">
              {/* Back Button */}
              <button
                onClick={() => setStage('select')}
                className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2"
              >
                <i className="fa-solid fa-arrow-left"></i>
                Geri
              </button>

              {/* Allergen Header */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{selectedAllergen.emoji}</div>
                  <div className="flex-1">
                    <h2 className="font-display font-bold text-2xl text-slate-800 mb-1">
                      {selectedAllergen.name} Deneme Planı
                    </h2>
                    <div className="flex items-center gap-3">
                      <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                        {selectedAllergen.startAge}
                      </span>
                      <span className={`text-sm px-3 py-1 rounded-full font-medium border ${getRiskColor(selectedAllergen.riskLevel)}`}>
                        {selectedAllergen.riskLevel === 'high' ? 'Yüksek' : selectedAllergen.riskLevel === 'medium' ? 'Orta' : 'Düşük'} Risk
                      </span>
                    </div>
                    {selectedAllergen.ingredientSlug && (
                      <Link 
                        href={`/beslenme-rehberi/${selectedAllergen.ingredientSlug}`}
                        className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 font-medium mt-3"
                      >
                        <i className="fa-solid fa-book-open mr-2"></i>
                        Beslenme Rehberinde İncele
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Trial Calendar */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
                <h3 className="font-bold text-slate-800 text-xl mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-calendar-days text-purple-500"></i>
                  3-5 Günlük Plan
                </h3>
                <div className="space-y-3">
                  {plan.days.map((day) => (
                    <div key={day.day} className="bg-gray-50 rounded-xl p-4 flex items-start gap-4">
                      <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        {day.day}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">{day.amount}</div>
                        <div className="text-sm text-gray-600">{day.tip}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3 Gün Kuralı Bilgisi */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <i className="fa-solid fa-lightbulb text-green-600 mt-0.5"></i>
                  <div>
                    <p className="text-sm text-green-800">
                      <strong>3 Gün Kuralı:</strong> Her yeni besini en az 3 gün boyunca tek başına deneyin. 
                      Bu sayede olası alerjik reaksiyonların kaynağını kolayca belirleyebilirsiniz.
                    </p>
                    <Link 
                      href="/beslenme-rehberi/3-gun-kurali" 
                      className="text-sm text-green-700 font-bold hover:text-green-800 inline-flex items-center mt-2"
                    >
                      3 Gün Kuralı hakkında detaylı bilgi <i className="fa-solid fa-arrow-right ml-1 text-xs"></i>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Warning Signs */}
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                <h3 className="font-bold text-red-800 text-lg mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  Dikkat Edilmesi Gereken Belirtiler
                </h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {warningSigns.map((sign, idx) => (
                    <div key={idx} className="text-sm text-red-700">
                      {sign}
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Info */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <i className="fa-solid fa-phone text-amber-600 text-2xl mt-1"></i>
                  <div>
                    <h3 className="font-bold text-amber-900 mb-2">Acil Durum</h3>
                    <p className="text-amber-800 text-sm mb-3">
                      Şiddetli reaksiyon belirtileri (şişlik, nefes darlığı, bayılma) görürseniz <strong>hemen 112'yi arayın</strong>.
                    </p>
                    <p className="text-amber-800 text-sm">
                      Hafif belirtilerde (döküntü, hafif kusma) bebeğinizi rahatlatın ve doktorunuzu arayın.
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-clipboard-list text-blue-500"></i>
                  Önemli Notlar
                </h3>
                <ul className="space-y-2">
                  {plan.notes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setStage('select')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-4 rounded-xl font-bold transition-all"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i>
                Başka Alerjen Seç
              </button>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
