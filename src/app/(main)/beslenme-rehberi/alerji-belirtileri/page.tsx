"use client";

import Link from 'next/link';

export default function AlerjiBelirtileriPage() {
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
              <i className="fa-solid fa-heart-pulse text-4xl"></i>
            </div>
            <div>
              <h1 className="font-display font-bold text-4xl md:text-5xl mb-2">
                Alerji Belirtileri Rehberi
              </h1>
              <p className="text-green-100 text-lg">
                Alerjik reaksiyonları tanıyın ve doğru tepkiyi verin.
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
              Alerji Belirtilerini Tanımak Neden Önemli?
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Bebeğinize yeni besinler tanıtırken, olası alerjik reaksiyonları erken fark etmek 
              kritik öneme sahiptir. Bazı belirtiler hafif ve kendiliğinden geçerken, bazıları 
              acil tıbbi müdahale gerektirir. Aralarındaki farkı bilmek, sizi daha hazırlıklı ve 
              güvenli hissettirecektir.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-lightbulb text-blue-600 text-2xl mt-1"></i>
                <div>
                  <h3 className="font-bold text-lg text-blue-900 mb-2">Temel Prensipler</h3>
                  <ul className="space-y-2 text-blue-800">
                    <li className="flex items-start gap-2">
                      <i className="fa-solid fa-check text-blue-500 mt-1"></i>
                      <span>Alerjik reaksiyonlar genellikle yeni besini verdikten sonraki ilk birkaç saat içinde başlar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="fa-solid fa-check text-blue-500 mt-1"></i>
                      <span>Her çocuk farklıdır, aynı besine farklı tepkiler gösterebilirler</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="fa-solid fa-check text-blue-500 mt-1"></i>
                      <span>Şüpheye düştüğünüzde her zaman sağlık uzmanınıza danışın</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Mild Symptoms */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-triangle-exclamation text-amber-500 text-xl"></i>
              </div>
              <h2 className="font-display font-bold text-3xl text-slate-800">
                Hafif Belirtiler
              </h2>
            </div>
            
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8">
              <div className="mb-6">
                <h3 className="font-bold text-xl text-amber-900 mb-2">
                  Bu Belirtileri Görürseniz: İzleyin ve Doktorunuza Bildirin
                </h3>
                <p className="text-amber-800 leading-relaxed">
                  Hafif belirtiler genellikle tehlikeli değildir ancak takip edilmelidir. 
                  Besini hemen kesin, bebeğinizi gözlemlemeye devam edin ve doktorunuzu bilgilendirin.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-5 border-l-4 border-amber-400">
                  <div className="flex items-start gap-3">
                    <i className="fa-solid fa-face-flushed text-amber-600 text-2xl"></i>
                    <div>
                      <h4 className="font-bold text-amber-900 mb-1">Ağız Çevresi Kızarıklık</h4>
                      <p className="text-sm text-amber-800">
                        Dudak, ağız çevresi veya yanaklarda hafif kızarıklık, genellikle besine dokunma sonucu
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border-l-4 border-amber-400">
                  <div className="flex items-start gap-3">
                    <i className="fa-solid fa-droplet text-amber-600 text-2xl"></i>
                    <div>
                      <h4 className="font-bold text-amber-900 mb-1">Hafif Döküntü</h4>
                      <p className="text-sm text-amber-800">
                        Vücutta birkaç küçük kızarık nokta veya ürtiker (kabarık, kaşıntılı döküntü)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border-l-4 border-amber-400">
                  <div className="flex items-start gap-3">
                    <i className="fa-solid fa-wind text-amber-600 text-2xl"></i>
                    <div>
                      <h4 className="font-bold text-amber-900 mb-1">Gaz ve Karın Ağrısı</h4>
                      <p className="text-sm text-amber-800">
                        Karın şişkinliği, aşırı gaz, hafif kramplar veya rahatsızlık belirtileri
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border-l-4 border-amber-400">
                  <div className="flex items-start gap-3">
                    <i className="fa-solid fa-baby text-amber-600 text-2xl"></i>
                    <div>
                      <h4 className="font-bold text-amber-900 mb-1">Huzursuzluk</h4>
                      <p className="text-sm text-amber-800">
                        Normalden daha fazla ağlama, uyku düzeninde değişiklik, alışılmadık davranışlar
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border-l-4 border-amber-400">
                  <div className="flex items-start gap-3">
                    <i className="fa-solid fa-circle-radiation text-amber-600 text-2xl"></i>
                    <div>
                      <h4 className="font-bold text-amber-900 mb-1">Hafif Kusma</h4>
                      <p className="text-sm text-amber-800">
                        Tek seferlik hafif kusma (tekrarlanmıyor ve şiddetli değilse)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border-l-4 border-amber-400">
                  <div className="flex items-start gap-3">
                    <i className="fa-solid fa-toilet text-amber-600 text-2xl"></i>
                    <div>
                      <h4 className="font-bold text-amber-900 mb-1">Hafif İshal</h4>
                      <p className="text-sm text-amber-800">
                        Normalden daha yumuşak veya sulu dışkı (tekrar etmiyorsa)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Severe Symptoms */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-triangle-exclamation text-red-500 text-xl animate-pulse"></i>
              </div>
              <h2 className="font-display font-bold text-3xl text-slate-800">
                Ciddi Belirtiler
              </h2>
            </div>
            
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
              <div className="mb-6">
                <h3 className="font-bold text-2xl text-red-900 mb-3 flex items-center gap-2">
                  ACİL DURUM - HEMEN 112'Yİ ARAYIN!
                </h3>
                <p className="text-red-800 leading-relaxed font-bold text-lg">
                  Aşağıdaki belirtilerden herhangi birini görürseniz, zaman kaybetmeden 112'yi 
                  arayın veya en yakın acil servise gidin. Anafilaksi (şiddetli alerjik reaksiyon) 
                  hayati tehlike oluşturabilir!
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-5 border-l-4 border-red-500">
                  <div className="flex items-start gap-3">
                    <i className="fa-solid fa-lungs text-red-600 text-2xl"></i>
                    <div>
                      <h4 className="font-bold text-red-900 mb-1 text-lg">Nefes Darlığı veya Hırıltı</h4>
                      <p className="text-sm text-red-800">
                        Nefes almada zorluk, göğüste hırıltı sesi, hızlı nefes alma, nefes alamama
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border-l-4 border-red-500">
                  <div className="flex items-start gap-3">
                    <i className="fa-solid fa-head-side-mask text-red-600 text-2xl"></i>
                    <div>
                      <h4 className="font-bold text-red-900 mb-1 text-lg">Yüz, Dudak veya Dil Şişmesi</h4>
                      <p className="text-sm text-red-800">
                        Yüzde, dudaklarda, dilde veya boğazda belirgin şişme (anjiyoödem)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border-l-4 border-red-500">
                  <div className="flex items-start gap-3">
                    <i className="fa-solid fa-virus text-red-600 text-2xl"></i>
                    <div>
                      <h4 className="font-bold text-red-900 mb-1 text-lg">Yaygın Döküntü</h4>
                      <p className="text-sm text-red-800">
                        Vücudun birden fazla bölgesinde hızla yayılan şiddetli döküntü veya ürtiker
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border-l-4 border-red-500">
                  <div className="flex items-start gap-3">
                    <i className="fa-solid fa-burst text-red-600 text-2xl"></i>
                    <div>
                      <h4 className="font-bold text-red-900 mb-1 text-lg">Tekrarlayan Kusma</h4>
                      <p className="text-sm text-red-800">
                        Durmayan, tekrarlayan kusma; hiçbir şey tutamama
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border-l-4 border-red-500">
                  <div className="flex items-start gap-3">
                    <i className="fa-solid fa-droplet-slash text-red-600 text-2xl"></i>
                    <div>
                      <h4 className="font-bold text-red-900 mb-1 text-lg">Şiddetli İshal</h4>
                      <p className="text-sm text-red-800">
                        Sürekli, şiddetli, kanlı veya sulu ishal; dehidratasyon belirtileri
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border-l-4 border-red-500">
                  <div className="flex items-start gap-3">
                    <i className="fa-solid fa-brain text-red-600 text-2xl"></i>
                    <div>
                      <h4 className="font-bold text-red-900 mb-1 text-lg">Bilinç Bulanıklığı</h4>
                      <p className="text-sm text-red-800">
                        Aşırı halsizlik, bayılma, tepkisizlik, sersemlik hali
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What to Do Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-hand-holding-heart text-purple-500 text-xl"></i>
              </div>
              <h2 className="font-display font-bold text-3xl text-slate-800">
                Ne Yapmalısınız?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* For Mild Symptoms */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <h3 className="font-bold text-xl text-amber-900 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-stethoscope text-amber-600"></i>
                  Hafif Belirtilerde
                </h3>
                <ul className="space-y-3 text-amber-900">
                  {/* DÜZELTİLDİ: items-center -> items-start */}
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-600 min-w-[20px]">1.</span>
                    <span>Besini hemen kesin ve bir daha vermeyin</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-600 min-w-[20px]">2.</span>
                    <span>Belirtileri not alın (ne zaman başladı, ne kadar sürdü)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-600 min-w-[20px]">3.</span>
                    <span>Bebeğinizi gözlemlemeye devam edin</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-600 min-w-[20px]">4.</span>
                    <span>Doktorunuzu arayın ve durumu bildirin</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-600 min-w-[20px]">5.</span>
                    <span>Belirtiler kötüleşirse hemen acil servise gidin</span>
                  </li>
                </ul>
              </div>

              {/* For Severe Symptoms */}
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                <h3 className="font-bold text-xl text-red-900 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-truck-medical text-red-600 animate-pulse"></i>
                  Ciddi Belirtilerde
                </h3>
                <ul className="space-y-3 text-red-900">
                  {/* DÜZELTİLDİ: items-center -> items-start */}
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-red-600 min-w-[20px] text-lg">1.</span>
                    <span className="font-bold">HEMEN 112'yi arayın</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-red-600 min-w-[20px] text-lg">2.</span>
                    <span>Bebeğinizi yatay pozisyonda tutun (bayılmadıysa)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-red-600 min-w-[20px] text-lg">3.</span>
                    <span>Doktor önceden adrenalin kalemi (EpiPen) reçete ettiyse kullanın</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-red-600 min-w-[20px] text-lg">4.</span>
                    <span>Ambulans gelene kadar bebeğinizin yanından ayrılmayın</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-red-600 min-w-[20px] text-lg">5.</span>
                    <span className="font-bold">PANİK YAPMAYIN - sakin kalın ve yardım bekleyin</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Emergency Card */}
          <div className="mb-12">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl p-8 shadow-lg">
              <div className="text-center">
                <i className="fa-solid fa-phone text-5xl mb-4"></i>
                <h3 className="font-display font-bold text-3xl mb-2">Acil Durum İletişim</h3>
                <p className="text-red-100 mb-6">
                  Şiddetli alerjik reaksiyon belirtilerinde hemen arayın:
                </p>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 inline-block">
                  <div className="text-6xl font-bold mb-2">112</div>
                  <p className="text-lg">Acil Sağlık Hizmetleri</p>
                </div>
                <p className="mt-6 text-sm text-red-100">
                  Her saniye önemlidir. Şüphe duyduğunuzda hemen arayın!
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mb-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl mb-4">
                <i className="fa-solid fa-book-medical text-2xl"></i>
              </div>
              <h3 className="font-display font-bold text-2xl text-slate-800 mb-2">
                Daha Fazla Bilgi İçin
              </h3>
              <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
                Yeni besinleri güvenli şekilde tanıtmak ve alerji riskini minimize etmek için 
                diğer rehberlerimize göz atabilirsiniz.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center">
              <Link 
                href="/beslenme-rehberi/3-gun-kurali" 
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-md"
              >
                <i className="fa-solid fa-calendar-check mr-2"></i>
                3 Gün Kuralı
              </Link>
              <Link 
                href="/akilli-asistan/alerjen-planlayici" 
                className="inline-flex items-center px-6 py-3 bg-white text-green-600 font-bold rounded-xl hover:bg-gray-50 transition-colors border-2 border-green-200"
              >
                <i className="fa-solid fa-shield-heart mr-2"></i>
                Alerjen Deneme Planlayıcı
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
                  veya tedavi yerine geçmez. Bebeğinizde herhangi bir alerjik reaksiyon belirtisi 
                  görürseniz mutlaka bir sağlık uzmanına danışın. Şiddetli reaksiyon durumunda 
                  hemen 112'yi arayın veya en yakın acil servise başvurun. Her bebek farklıdır ve 
                  alerji belirtileri değişkenlik gösterebilir.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}