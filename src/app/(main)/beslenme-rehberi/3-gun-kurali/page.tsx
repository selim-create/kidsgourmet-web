"use client";

import Link from 'next/link';

export default function ThreeDayRulePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Link 
              href="/beslenme-rehberi" 
              className="text-white/80 hover:text-white transition-colors"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              Beslenme Rehberi
            </Link>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <i className="fa-solid fa-calendar-check text-4xl"></i>
            </div>
            <div>
              <h1 className="font-display font-bold text-4xl md:text-5xl mb-2">
                3 Gün Kuralı
              </h1>
              <p className="text-green-100 text-lg">
                Güvenli besin tanıtımı için adım adım rehber
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          
          {/* Introduction */}
          <div className="mb-12">
            <h2 className="font-display font-bold text-3xl text-slate-800 mb-4">
              3 Gün Kuralı Nedir?
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              3 gün kuralı, bebeğinize yeni bir besin tanıtırken olası alerjik reaksiyonları 
              tespit edebilmek için kullanılan güvenli bir yöntemdir. Bu yöntem sayesinde 
              hangi besinin reaksiyona neden olduğunu kolayca belirleyebilirsiniz.
            </p>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-2xl">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-lightbulb text-green-600 text-2xl mt-1"></i>
                <div>
                  <h3 className="font-bold text-lg text-green-900 mb-2">Neden Önemli?</h3>
                  <p className="text-green-800 leading-relaxed">
                    Yeni besinlere karşı alerjik reaksiyonlar genellikle ilk birkaç gün içinde 
                    ortaya çıkar. 3 gün kuralı ile besini izole ederek, herhangi bir olumsuz 
                    tepkinin hangi gıdadan kaynaklandığını net şekilde anlayabilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How to Apply */}
          <div className="mb-12">
            <h2 className="font-display font-bold text-3xl text-slate-800 mb-6">
              Nasıl Uygulanır?
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">1</span>
                <div className="flex-1">
                  <p className="font-bold text-xl text-slate-800 mb-2">Tek Besin</p>
                  <p className="text-gray-600 leading-relaxed">
                    Her seferinde sadece bir yeni besin tanıtın. Birden fazla yeni besini aynı 
                    anda denemek, olası bir reaksiyonun kaynağını belirlemeyi zorlaştırır.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <span className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">2</span>
                <div className="flex-1">
                  <p className="font-bold text-xl text-slate-800 mb-2">3 Gün Bekleyin</p>
                  <p className="text-gray-600 leading-relaxed">
                    Yeni besini verdikten sonra 3 gün boyunca başka yeni besin eklemeyin. 
                    Bu süre zarfında aynı besini günlük olarak vermeye devam edebilirsiniz.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <span className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">3</span>
                <div className="flex-1">
                  <p className="font-bold text-xl text-slate-800 mb-2">Gözlemleyin</p>
                  <p className="text-gray-600 leading-relaxed">
                    Bebeğinizi döküntü, kusma, ishal, huzursuzluk veya davranış değişiklikleri 
                    açısından dikkatle izleyin. Herhangi bir şüpheli durum görürseniz not alın.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quantity Guide */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-graduation-cap text-blue-500 text-xl"></i>
              </div>
              <h2 className="font-display font-bold text-3xl text-slate-800">
                Miktar Rehberi
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              Yeni bir besini tanıtırken, miktarı kademeli olarak artırmak daha güvenli bir yaklaşımdır. 
              Bu şekilde bebeğinizin vücudu yeni besine uyum sağlama fırsatı bulur.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">1. Gün</div>
                  <div className="text-xl font-bold text-slate-800 mb-1">¼ çay kaşığı</div>
                  <p className="text-sm text-gray-600">Küçük miktar ile başlayın</p>
                </div>
                
                <div className="text-center p-4 bg-white rounded-xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">2. Gün</div>
                  <div className="text-xl font-bold text-slate-800 mb-1">½ çay kaşığı</div>
                  <p className="text-sm text-gray-600">Miktarı iki katına çıkarın</p>
                </div>
                
                <div className="text-center p-4 bg-white rounded-xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">3. Gün</div>
                  <div className="text-xl font-bold text-slate-800 mb-1">1 çay kaşığı</div>
                  <p className="text-sm text-gray-600">Tam çay kaşığına ulaşın</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-2xl">
              <p className="text-green-800 leading-relaxed">
                <i className="fa-solid fa-check-circle text-green-600 mr-2"></i>
                <strong>Reaksiyon görülmezse:</strong> 3 gün sonunda herhangi bir olumsuz tepki 
                gözlemlemediyseniz, besini normal porsiyonlarda vermeye başlayabilirsiniz.
              </p>
            </div>
          </div>

          {/* Symptom Types */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-heart-pulse text-purple-500 text-xl"></i>
              </div>
              <h2 className="font-display font-bold text-3xl text-slate-800">
                Belirti Türleri
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              Alerjik reaksiyonlar hafif veya ciddi olabilir. Aralarındaki farkı bilmek, 
              doğru tepkiyi vermenize yardımcı olur.
            </p>
            
            {/* Mild Reactions */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <i className="fa-solid fa-triangle-exclamation text-amber-600 text-2xl mt-1"></i>
                <div>
                  <h3 className="font-bold text-xl text-amber-900 mb-2">
                    Hafif Tepkiler (İzlenir)
                  </h3>
                  <p className="text-amber-800 mb-4">
                    Bu belirtiler genellikle endişe verici değildir ancak takip edilmelidir. 
                    Besini kesip doktorunuzu bilgilendirin.
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-amber-900">
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-circle text-amber-400 text-xs mt-2"></i>
                  <span>Ağız çevresi kızarıklık</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-circle text-amber-400 text-xs mt-2"></i>
                  <span>Hafif döküntü (birkaç küçük kızarık nokta)</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-circle text-amber-400 text-xs mt-2"></i>
                  <span>Gaz ve karın şişkinliği</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-circle text-amber-400 text-xs mt-2"></i>
                  <span>Huzursuzluk, uyku düzeninde değişiklik</span>
                </li>
              </ul>
            </div>

            {/* Severe Reactions */}
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <i className="fa-solid fa-triangle-exclamation text-red-600 text-2xl mt-1 animate-pulse"></i>
                <div>
                  <h3 className="font-bold text-xl text-red-900 mb-2">
                    Ciddi Tepkiler (ACİL)
                  </h3>
                  <p className="text-red-800 mb-4 font-bold">
                    Bu belirtilerden herhangi birini görürseniz HEMEN 112'yi arayın veya 
                    en yakın acil servise başvurun!
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-red-900">
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-circle text-red-400 text-xs mt-2"></i>
                  <span><strong>Nefes darlığı, hırıltı veya öksürük</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-circle text-red-400 text-xs mt-2"></i>
                  <span><strong>Yüz, dudak veya dil şişmesi</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-circle text-red-400 text-xs mt-2"></i>
                  <span><strong>Tekrarlayan kusma</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-circle text-red-400 text-xs mt-2"></i>
                  <span><strong>Şiddetli ishal</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-circle text-red-400 text-xs mt-2"></i>
                  <span><strong>Halsizlik, bilinç bulanıklığı</strong></span>
                </li>
              </ul>
            </div>
          </div>

          {/* Which Foods Require 3 Day Rule */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-list-check text-orange-500 text-xl"></i>
              </div>
              <h2 className="font-display font-bold text-3xl text-slate-800">
                3 Gün Kuralı Hangi Besinlerde Şart?
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              3 gün kuralı her besin için zorunlu değildir. Alerji riski yüksek besinlerde 
              mutlaka uygulanmalı, düşük riskli besinlerde ise doktor önerisine göre esnek 
              davranılabilir.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Must Apply */}
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <h3 className="font-bold text-lg text-red-900 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-shield-halved text-red-600"></i>
                  Mutlaka Uygulanmalı
                </h3>
                <ul className="space-y-2 text-red-900">
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-red-500 mt-1"></i>
                    <span>Yumurta</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-red-500 mt-1"></i>
                    <span>İnek sütü ve süt ürünleri</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-red-500 mt-1"></i>
                    <span>Yer fıstığı ve fıstık ezmesi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-red-500 mt-1"></i>
                    <span>Balık</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-red-500 mt-1"></i>
                    <span>Kabuklu deniz ürünleri</span>
                  </li>
                </ul>
              </div>

              {/* Can Be Flexible */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                <h3 className="font-bold text-lg text-green-900 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-leaf text-green-600"></i>
                  Esnek Olunabilir
                </h3>
                <ul className="space-y-2 text-green-900">
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-green-500 mt-1"></i>
                    <span>Basit sebzeler (havuç, kabak, patates)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-green-500 mt-1"></i>
                    <span>Yaygın meyveler (elma, armut, muz)</span>
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t border-green-200">
                  <p className="text-sm text-green-800">
                    <i className="fa-solid fa-info-circle mr-2"></i>
                    Doktorunuz başka bir öneri yapmadıysa, bu besinlerde daha hızlı 
                    ilerleyebilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* When NOT to Trial */}
          <div className="mb-12">
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <i className="fa-solid fa-triangle-exclamation text-red-600 text-3xl mt-1"></i>
                <div>
                  <h2 className="font-display font-bold text-3xl text-red-900 mb-2">
                    Ne Zaman Deneme Yapılmamalı?
                  </h2>
                  <p className="text-red-800 leading-relaxed">
                    Bebeğinizin sağlığını riske atmamak için, aşağıdaki durumlarda yeni besin 
                    denemesi yapmayın:
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border-l-4 border-red-400">
                  <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                    <i className="fa-solid fa-thermometer text-red-500"></i>
                    Bebek Hastayken
                  </h3>
                  <p className="text-sm text-red-800">
                    Ateş, burun akıntısı veya herhangi bir hastalık belirtisi varsa deneme yapmayın.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 border-l-4 border-red-400">
                  <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                    <i className="fa-solid fa-syringe text-red-500"></i>
                    Aşıdan Sonra
                  </h3>
                  <p className="text-sm text-red-800">
                    Aşı olduktan sonraki ilk 24-48 saat bekleyin. Aşı reaksiyonu ile gıda alerjisini karıştırmayın.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 border-l-4 border-red-400">
                  <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                    <i className="fa-solid fa-moon text-red-500"></i>
                    Gece Saatlerinde
                  </h3>
                  <p className="text-sm text-red-800">
                    Yeni besini sabah veya öğle saatlerinde verin. Gece reaksiyon görürseniz müdahale zorlaşır.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 border-l-4 border-red-400">
                  <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                    <i className="fa-solid fa-plane text-red-500"></i>
                    Ev Dışındayken
                  </h3>
                  <p className="text-sm text-red-800">
                    Seyahat, ziyaret veya restoranda değilken evde deneme yapın. Acil durumda hemen müdahale edebilmelisiniz.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Planner Integration CTA */}
          <div className="mb-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl mb-4">
                <i className="fa-solid fa-wand-magic-sparkles text-2xl"></i>
              </div>
              <h3 className="font-display font-bold text-2xl text-slate-800 mb-2">
                Alerjen Deneme Sürecinizi Planlayın
              </h3>
              <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
                3 gün kuralını doğru uygulamak için Alerjen Deneme Planlayıcı'mızı kullanabilir, 
                hangi besini ne zaman ve nasıl deneyeceğinize dair kişiselleştirilmiş plan alabilirsiniz.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center">
              <Link 
                href="/akilli-asistan/alerjen-planlayici" 
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                <i className="fa-solid fa-shield-heart mr-2"></i>
                Alerjen Deneme Planlayıcı
              </Link>
              <Link 
                href="/beslenme-rehberi/alerji-belirtileri" 
                className="inline-flex items-center px-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-50 transition-colors border-2 border-purple-200"
              >
                <i className="fa-solid fa-heart-pulse mr-2"></i>
                Alerji Belirtileri Rehberi
              </Link>
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-info-circle text-gray-500 text-xl mt-1"></i>
              <div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  <strong>Önemli Uyarı:</strong> Bu içerik bilgilendirme amaçlıdır ve tıbbi tanı 
                  yerine geçmez. Bebeğinizde şiddetli bir alerjik reaksiyon durumunda hemen 112'yi 
                  arayın veya en yakın sağlık kuruluşuna başvurunuz. Aile geçmişinizde alerji varsa 
                  veya bebeğinizin özel bir sağlık durumu bulunuyorsa, yeni besinleri tanıtmadan önce 
                  mutlaka doktorunuza danışın.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
