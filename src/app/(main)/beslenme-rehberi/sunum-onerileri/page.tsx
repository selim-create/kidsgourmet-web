"use client";

import Link from 'next/link';

export default function SunumOnerileriPage() {
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
              <i className="fa-solid fa-plate-wheat text-4xl"></i>
            </div>
            <div>
              <h1 className="font-display font-bold text-4xl md:text-5xl mb-2">
                Sunum Önerileri
              </h1>
              <p className="text-green-100 text-lg">
                Bebeğinizin ilgisini çeken yaratıcı sunum fikirleri
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
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-2xl mb-8">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-lightbulb text-green-600 text-2xl mt-1"></i>
                <div>
                  <h3 className="font-bold text-lg text-green-900 mb-2">Neden Sunum Önemli?</h3>
                  <p className="text-green-800 leading-relaxed">
                    Bebekler ve çocuklar önce gözleriyle yerler! Yaratıcı sunumlar, yeni besinleri deneme 
                    isteklerini artırır ve yemek zamanını eğlenceli bir deneyime dönüştürür.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Presentation Tips */}
          <div className="space-y-10">
            
            {/* Tip 1 */}
            <div className="border-b border-gray-100 pb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <i className="fa-solid fa-palette text-orange-500 text-xl"></i>
                </div>
                <h2 className="font-display font-bold text-2xl text-slate-800">
                  Renk Uyumu Kullanın
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Tabağınızda farklı renklerde besinler bir araya getirin. Kırmızı domates, yeşil salatalık, 
                turuncu havuç, sarı mısır gibi renkli sebzeler görsel bir şölen oluşturur.
              </p>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700">
                  <strong>İpucu:</strong> Gökkuşağı tabağı konsepti kullanarak her renkten bir sebze ekleyin!
                </p>
              </div>
            </div>

            {/* Tip 2 */}
            <div className="border-b border-gray-100 pb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <i className="fa-solid fa-shapes text-blue-500 text-xl"></i>
                </div>
                <h2 className="font-display font-bold text-2xl text-slate-800">
                  Şekil ve Kalıplardan Yararlanın
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Sebze ve meyveleri kalıplarla kesip yıldız, kalp, hayvan şekilleri verebilirsiniz. 
                Özellikle pankek, sandviç ve omlet gibi yiyeceklerde çok etkili olur.
              </p>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700">
                  <strong>Öneriler:</strong> Mini kalıplar kullanarak sebze burger yapabilir, meyveleri 
                  şekiller halinde sunabilirsiniz.
                </p>
              </div>
            </div>

            {/* Tip 3 */}
            <div className="border-b border-gray-100 pb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <i className="fa-solid fa-face-smile text-purple-500 text-xl"></i>
                </div>
                <h2 className="font-display font-bold text-2xl text-slate-800">
                  Yüz ve Karakterler Oluşturun
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Besinleri kullanarak tabakta gülen yüzler, hayvanlar veya sevdikleri karakterler yapın. 
                Örneğin: havuç dilimleriyle saç, domates dilimiyle ağız, salatalıkla göz yapabilirsiniz.
              </p>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700">
                  <strong>Popüler Fikirler:</strong> Güneş, kedi, ayı, araba gibi basit şekiller bebekler 
                  için çok ilgi çekicidir.
                </p>
              </div>
            </div>

            {/* Tip 4 */}
            <div className="border-b border-gray-100 pb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                  <i className="fa-solid fa-layer-group text-pink-500 text-xl"></i>
                </div>
                <h2 className="font-display font-bold text-2xl text-slate-800">
                  Katmanlı Sunumlar
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Yoğurt, meyve püresi ve granola ile katmanlı kahvaltılar hazırlayın. Şeffaf kaplarda 
                yapılan katmanlı sunumlar hem güzel görünür hem de besinleri tanımayı kolaylaştırır.
              </p>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700">
                  <strong>Öneri:</strong> Smoothie bowl'lar üzerine meyve dilimleri ve fındık ezmesiyle 
                  desenler yapabilirsiniz.
                </p>
              </div>
            </div>

            {/* Tip 5 */}
            <div className="pb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <i className="fa-solid fa-hand-dots text-yellow-600 text-xl"></i>
                </div>
                <h2 className="font-display font-bold text-2xl text-slate-800">
                  BLW İçin Parmak Yiyecekler
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Baby-Led Weaning (BLW) uyguluyorsanız, parmak boyutunda kesimlere önem verin. 
                Bebeğin kolayca tutabileceği çubuk şeklinde sebzeler, yumuşak meyve dilimleri hazırlayın.
              </p>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700">
                  <strong>Güvenlik:</strong> Her zaman bebeğin gelişim aşamasına uygun boyut ve 
                  yumuşaklıkta yiyecekler sunun.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
            <h3 className="font-display font-bold text-2xl text-slate-800 mb-4">
              Daha Fazla Fikir İçin
            </h3>
            <p className="text-gray-700 mb-6">
              Yaş grubunuza uygun tarif önerilerimize göz atarak, bu sunum fikirlerini pratikte 
              deneyebilirsiniz.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link 
                href="/tarifler" 
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-md"
              >
                <i className="fa-solid fa-utensils mr-2"></i>
                Tarifleri Keşfet
              </Link>
              <Link 
                href="/beslenme-rehberi" 
                className="inline-flex items-center px-6 py-3 bg-white text-green-600 font-bold rounded-xl hover:bg-gray-50 transition-colors border-2 border-green-200"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i>
                Beslenme Rehberine Dön
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
