import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Çerez Politikası | KidsGourmet',
  description: 'KidsGourmet çerez politikası, kullanılan çerez türleri ve yönetimi hakkında bilgiler.',
};

export default function CerezPolitikasiPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-orange-500 transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-gray-800">Çerez Politikası</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Çerez Politikası</h1>
          <p className="text-gray-600 mt-3">KidsGourmet'de kullanılan çerezler ve yönetimi hakkında bilgiler</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-8">
          
          {/* Giriş */}
          <div>
            <p className="text-gray-600 leading-relaxed">
              Bu Çerez Politikası, KidsGourmet web sitesinde kullanılan çerezler, amaçları ve yönetimi hakkında 
              sizi bilgilendirmek amacıyla hazırlanmıştır.
            </p>
          </div>

          <hr className="border-gray-200" />

          {/* Çerez Nedir */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">1. Çerez Nedir?</h2>
            <div className="space-y-3 text-gray-600">
              <p className="leading-relaxed">
                Çerezler (cookies), ziyaret ettiğiniz web sitelerinin tarayıcınıza gönderdiği ve cihazınızda saklanan 
                küçük metin dosyalarıdır. Çerezler, web sitesinin daha verimli çalışmasını sağlar ve site sahiplerine 
                bilgi sağlar.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                <p className="text-sm">
                  <i className="fa-solid fa-info-circle text-blue-500 mr-2"></i>
                  Çerezler zararlı yazılım değildir ve cihazınıza zarar vermez.
                </p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Çerez Türleri */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">2. Kullanılan Çerez Türleri</h2>
            <div className="space-y-6 text-gray-600">
              
              {/* Zorunlu Çerezler */}
              <div className="border-l-4 border-red-400 pl-4">
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  <i className="fa-solid fa-exclamation-triangle text-red-400 mr-2"></i>
                  Zorunlu Çerezler
                </h3>
                <p className="leading-relaxed mb-2">
                  Web sitesinin temel işlevlerinin çalışması için gerekli çerezlerdir. Bu çerezler olmadan site düzgün çalışamaz.
                </p>
                <p className="text-sm italic">
                  Bu çerezleri devre dışı bırakamazsınız.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2 text-sm">
                  <li>Oturum yönetimi (giriş durumu)</li>
                  <li>Güvenlik (CSRF koruması)</li>
                  <li>Form doğrulama</li>
                  <li>Tercih ayarları (dil, tema)</li>
                </ul>
              </div>

              {/* Analitik Çerezler */}
              <div className="border-l-4 border-blue-400 pl-4">
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  <i className="fa-solid fa-chart-line text-blue-400 mr-2"></i>
                  Analitik Çerezler
                </h3>
                <p className="leading-relaxed mb-2">
                  Site kullanımını analiz etmek ve kullanıcı deneyimini iyileştirmek için kullanılır.
                </p>
                <p className="text-sm italic">
                  İsteğe bağlı - Reddedebilirsiniz.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2 text-sm">
                  <li>Sayfa görüntüleme istatistikleri</li>
                  <li>Kullanıcı davranış analizi</li>
                  <li>Hata raporlama</li>
                  <li>Performans ölçümü</li>
                </ul>
              </div>

              {/* Fonksiyonel Çerezler */}
              <div className="border-l-4 border-green-400 pl-4">
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  <i className="fa-solid fa-sliders text-green-400 mr-2"></i>
                  Fonksiyonel Çerezler
                </h3>
                <p className="leading-relaxed mb-2">
                  Kişiselleştirilmiş özellikler sunmak için kullanılır.
                </p>
                <p className="text-sm italic">
                  İsteğe bağlı - Reddedebilirsiniz.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2 text-sm">
                  <li>Kullanıcı tercihlerini hatırlama</li>
                  <li>Favorileri saklama</li>
                  <li>Önceden doldurulmuş formlar</li>
                  <li>Kişiselleştirilmiş içerik</li>
                </ul>
              </div>

              {/* Pazarlama Çerezleri */}
              <div className="border-l-4 border-orange-400 pl-4">
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  <i className="fa-solid fa-bullhorn text-orange-400 mr-2"></i>
                  Pazarlama Çerezleri
                </h3>
                <p className="leading-relaxed mb-2">
                  Hedeflenmiş reklamlar sunmak ve reklam kampanyalarının etkinliğini ölçmek için kullanılır.
                </p>
                <p className="text-sm italic">
                  İsteğe bağlı - Reddedebilirsiniz.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2 text-sm">
                  <li>İlgi alanlarınıza göre reklamlar</li>
                  <li>Sosyal medya entegrasyonu</li>
                  <li>Yeniden pazarlama</li>
                  <li>Kampanya performansı</li>
                </ul>
              </div>

            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Çerez Tablosu */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">3. Çerez Tablosu</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left font-bold text-slate-800">Çerez Adı</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-800">Türü</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-800">Amaç</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-800">Süre</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 font-mono text-xs">cookie_consent</td>
                    <td className="px-4 py-3">Zorunlu</td>
                    <td className="px-4 py-3">Çerez tercihlerinizi saklar</td>
                    <td className="px-4 py-3">1 yıl</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 font-mono text-xs">_ga</td>
                    <td className="px-4 py-3">Analitik</td>
                    <td className="px-4 py-3">Google Analytics - Ziyaretçi tanımlama</td>
                    <td className="px-4 py-3">2 yıl</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 font-mono text-xs">_gid</td>
                    <td className="px-4 py-3">Analitik</td>
                    <td className="px-4 py-3">Google Analytics - Günlük ziyaretçi analizi</td>
                    <td className="px-4 py-3">24 saat</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 font-mono text-xs">_ga_*</td>
                    <td className="px-4 py-3">Analitik</td>
                    <td className="px-4 py-3">Google Analytics 4 - Oturum durumu</td>
                    <td className="px-4 py-3">2 yıl</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Çerez Tercihlerini Yönetme */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Çerez Tercihlerinizi Yönetme</h2>
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">
                İsteğe bağlı çerezleri kabul etmek veya reddetmek tamamen size kalmıştır. Tercihlerinizi aşağıdaki 
                yöntemlerle yönetebilirsiniz:
              </p>

              <div className="bg-gradient-to-r from-orange-50 to-white rounded-xl border border-orange-200 p-6">
                <h4 className="font-bold text-slate-800 mb-3">
                  <i className="fa-solid fa-cookie-bite text-orange-500 mr-2"></i>
                  Çerez Tercih Merkezi
                </h4>
                <p className="text-sm mb-4">
                  Site üzerindeki çerez tercih merkezini kullanarak çerez kategorilerini açıp kapatabilirsiniz.
                </p>
                <button className="bg-orange-500 text-white font-bold px-6 py-2 rounded-xl hover:bg-orange-600 transition-colors text-sm">
                  Çerez Tercihlerimi Yönet
                </button>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-3">Tarayıcı Ayarları</h4>
                <p className="leading-relaxed mb-2">
                  Tüm çerezleri engellemek veya silmek için tarayıcı ayarlarınızı kullanabilirsiniz:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Chrome:</strong> Ayarlar → Gizlilik ve güvenlik → Çerezler</li>
                  <li><strong>Firefox:</strong> Ayarlar → Gizlilik ve Güvenlik → Çerezler ve Site Verileri</li>
                  <li><strong>Safari:</strong> Tercihler → Gizlilik → Çerezler ve web sitesi verileri</li>
                  <li><strong>Edge:</strong> Ayarlar → Gizlilik, arama ve hizmetler → Çerezler</li>
                </ul>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
                  <p className="text-sm">
                    <i className="fa-solid fa-triangle-exclamation text-yellow-600 mr-2"></i>
                    Not: Tüm çerezleri engellemek sitenin bazı özelliklerinin çalışmamasına neden olabilir.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Üçüncü Taraf Çerezleri */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">5. Üçüncü Taraf Çerezleri</h2>
            <div className="space-y-3 text-gray-600">
              <p className="leading-relaxed">
                KidsGourmet, bazı üçüncü taraf hizmet sağlayıcıların çerezlerini kullanır:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-slate-700">Google Analytics:</strong> Site kullanımını analiz etmek için</li>
                <li><strong className="text-slate-700">YouTube:</strong> Video içerik göstermek için</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Bu çerezler hakkında daha fazla bilgi için ilgili hizmet sağlayıcıların gizlilik politikalarını inceleyebilirsiniz.
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Değişiklikler */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">6. Politika Değişiklikleri</h2>
            <div className="space-y-3 text-gray-600">
              <p className="leading-relaxed">
                Bu çerez politikası, kullanılan çerezlerde veya yasal düzenlemelerde değişiklik olması durumunda 
                güncellenebilir. Önemli değişiklikler site üzerinde duyurulacaktır.
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* İletişim */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">7. İletişim</h2>
            <div className="space-y-3 text-gray-600">
              <p className="leading-relaxed">
                Çerez politikası hakkında sorularınız için:
              </p>
              <p className="leading-relaxed">
                <strong className="text-slate-700">E-posta:</strong>{' '}
                <a href="mailto:iletisim@kidsgourmet.com.tr" className="text-orange-500 hover:underline">
                  iletisim@kidsgourmet.com.tr
                </a>
              </p>
              <p className="leading-relaxed">
                <Link href="/iletisim" className="text-orange-500 hover:underline">
                  İletişim formu →
                </Link>
              </p>
            </div>
          </div>

          {/* Son Güncelleme */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Son güncelleme: Ocak 2026
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
