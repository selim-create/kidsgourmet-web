import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Çerez Aydınlatma Metni ve Politikası | KidsGourmet',
  description: 'KidsGourmet çerez politikası, kullanılan çerez türleri, KVKK uyumu ve çerez yönetimi hakkında bilgiler.',
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
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Çerez Aydınlatma Metni ve Politikası</h1>
          <p className="text-gray-600 mt-3">Kişisel verilerinizin korunması ve çerez kullanımı hakkında bilgilendirme</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-8">
          
          {/* Veri Sorumlusu Künyesi */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <h3 className="font-bold text-orange-800 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-building-shield"></i>
              VERİ SORUMLUSU
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p><span className="font-semibold">Unvan:</span> HİP Medya (Umut Kaan Özdemir)</p>
                <p><span className="font-semibold">Vergi Kimlik No:</span> 6810178450</p>
              </div>
              <div>
                <p><span className="font-semibold">Adres:</span> Fatih Mah. Çapraz Sok. No:11/2 K.Çekmece-İstanbul</p>
                <p><span className="font-semibold">E-posta:</span> iletisim@kidsgourmet.com.tr</p>
              </div>
            </div>
          </div>

          {/* Giriş */}
          <div>
            <p className="text-gray-600 leading-relaxed mb-4">
              HİP Medya (&quot;Şirket&quot;) olarak, www.kidsgourmet.com.tr alan adlı web sitemizi (&quot;Platform&quot;) ziyaretleriniz sırasında, 
              deneyiminizi iyileştirmek, hizmet kalitemizi artırmak, güvenliğinizi sağlamak ve yasal yükümlülüklerimizi yerine getirmek 
              amacıyla çerezler (cookies) ve piksel etiketleri gibi benzeri teknolojiler kullanmaktayız.
            </p>
            <p className="text-gray-600 leading-relaxed">
              İşbu Çerez Politikası (&quot;Politika&quot;), 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot; veya &quot;Kanun&quot;) ve 
              &quot;Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ&quot; uyarınca hazırlanmıştır.
            </p>
          </div>

          <hr className="border-gray-200" />

          {/* 1. Çerez Nedir */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">1. Çerez (Cookie) Nedir ve Nasıl Çalışır?</h2>
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">
                Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla bilgisayarınıza, akıllı telefonunuza veya tabletinize 
                kaydedilen, genellikle harf ve rakamlardan oluşan küçük boyutlu metin dosyalarıdır.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-bold text-slate-700 mb-2">Süreye Göre</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li><span className="font-semibold">Oturum Çerezleri:</span> Tarayıcı kapanınca silinir.</li>
                    <li><span className="font-semibold">Kalıcı Çerezler:</span> Belirli bir süre veya silinene kadar saklanır.</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-bold text-slate-700 mb-2">Kaynağa Göre</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li><span className="font-semibold">Birinci Taraf:</span> Doğrudan sitemiz tarafından yerleştirilir.</li>
                    <li><span className="font-semibold">Üçüncü Taraf:</span> İş ortaklarımız (Google vb.) tarafından yerleştirilir.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 2. Kullanılan Çerez Türleri */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">2. Platformumuzda Kullanılan Çerez Türleri</h2>
            
            {/* 2.1 Zorunlu Çerezler */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-700 mb-3 border-l-4 border-red-400 pl-3">
                2.1. Zorunlu (Kesinlikle Gerekli) Çerezler
              </h3>
              <p className="text-gray-600 mb-4">
                Bu çerezler, Platform&apos;un teknik olarak çalışabilmesi, güvenliğinin sağlanması ve talep ettiğiniz hizmetlerin sunulması için zorunludur. 
                Bu çerezler devre dışı bırakılamaz.
              </p>
              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3">Çerez Adı</th>
                      <th className="px-4 py-3">Sağlayıcı</th>
                      <th className="px-4 py-3">Amaç</th>
                      <th className="px-4 py-3">Süre</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-3 font-mono text-orange-600">csrf_token</td>
                      <td className="px-4 py-3">KidsGourmet</td>
                      <td className="px-4 py-3">Güvenlik (CSRF koruması)</td>
                      <td className="px-4 py-3">Oturum Boyunca</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-orange-600">cookie_consent</td>
                      <td className="px-4 py-3">CMP Sağlayıcı</td>
                      <td className="px-4 py-3">Çerez tercihlerinizi hatırlamak</td>
                      <td className="px-4 py-3">12 Ay</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-2 italic">* Hukuki Sebep: KVKK Md. 5/2-f (Meşru Menfaat)</p>
            </div>

            {/* 2.2 Performans ve Analitik */}
            <div>
              <h3 className="text-xl font-bold text-slate-700 mb-3 border-l-4 border-blue-400 pl-3">
                2.2. Performans ve Analitik Çerezler
              </h3>
              <p className="text-gray-600 mb-4">
                Bu veriler, sitemizin performansını artırmak ve hataları tespit etmek için kullanılır. Google Analytics 4 (GA4) kullanılmaktadır.
              </p>
              
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 text-sm text-blue-800">
                <p className="mb-2"><strong><i className="fa-solid fa-circle-info mr-1"></i> Teknik Not:</strong> Platformumuz Google Consent Mode v2 teknolojisini kullanmaktadır.</p>
                <p>IP adresiniz maskelenmekte olsa da, veriler Google sunucularında işlendiği için yurt dışına veri aktarımı söz konusudur.</p>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3">Çerez Adı</th>
                      <th className="px-4 py-3">Sağlayıcı</th>
                      <th className="px-4 py-3">Amaç</th>
                      <th className="px-4 py-3">Süre</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-3 font-mono text-blue-600">_ga</td>
                      <td className="px-4 py-3">Google</td>
                      <td className="px-4 py-3">Ziyaretçi tanımlama (Unique ID)</td>
                      <td className="px-4 py-3">2 Yıl</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-blue-600">_gid</td>
                      <td className="px-4 py-3">Google</td>
                      <td className="px-4 py-3">Günlük ziyaretçi analizi</td>
                      <td className="px-4 py-3">24 Saat</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-blue-600">ga*</td>
                      <td className="px-4 py-3">Google</td>
                      <td className="px-4 py-3">GA4 oturum durumu</td>
                      <td className="px-4 py-3">2 Yıl</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-blue-600">_gat</td>
                      <td className="px-4 py-3">Google</td>
                      <td className="px-4 py-3">İstek hızı sınırlama</td>
                      <td className="px-4 py-3">1 Dakika</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-2 italic">* Hukuki Sebep: KVKK Md. 5/1 (Açık Rıza)</p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 3. Yurt Dışı Aktarımı */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">3. Kişisel Verilerin Yurt Dışına Aktarımı ve Güvenceler</h2>
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">
                Platformumuzda kullanılan Performans/Analitik ve Reklam/Pazarlama çerezleri, altyapı sağlayıcımız olan Google LLC firmasının 
                sunucularının yurt dışında bulunması nedeniyle, kişisel verilerinizin yurt dışına aktarılmasına neden olmaktadır.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-slate-700">Açık Rıza:</strong> Çerez yönetim paneli üzerinden onay vererek bu aktarıma rıza göstermiş olursunuz.</li>
                <li><strong className="text-slate-700">Güvenceler:</strong> HİP Medya olarak, veri aktarımlarında uluslararası geçerliliği olan mekanizmaları tercih etmekteyiz.</li>
              </ul>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 4. Çocuk Verileri */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Çocuk Verileri ve Ebeveyn Sorumluluğu</h2>
            <div className="space-y-3 text-gray-600">
              <p className="leading-relaxed">
                KidsGourmet, ebeveynlere yönelik bir platformdur. 18 yaşından küçük çocukların doğrudan hedeflendiği bir mecra olmadığı gibi, 
                çocuklara yönelik veri profillemesi veya davranışsal reklamcılık faaliyeti yürütmemektedir.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800">
                  <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                  Eğer 18 yaşından küçükseniz, bu Platformu ancak ebeveyninizin gözetimi altında ziyaret edebilirsiniz.
                </p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 5. Çerez Yönetimi */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">5. Çerez Tercihlerini Yönetme</h2>
            <div className="space-y-6 text-gray-600">
              
              {/* 5.1 Platform */}
              <div>
                <h3 className="font-bold text-slate-700 mb-2">5.1. Platform Üzerinden Yönetim</h3>
                <p className="mb-3">Web sitemizin alt kısmında (footer) bulunan &quot;Çerez Tercihleri&quot; linkine tıklayarak yönetim panelini açabilirsiniz.</p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Zorunlu çerezler dışındaki tüm kategorileri açıp kapatabilirsiniz.</li>
                  <li>&quot;Tümünü Reddet&quot; seçeneği ile zorunlu olmayan işlemeyi durdurabilirsiniz.</li>
                </ul>
              </div>

              {/* 5.2 Tarayıcı */}
              <div>
                <h3 className="font-bold text-slate-700 mb-2">5.2. Tarayıcı Ayarları Üzerinden Yönetim</h3>
                <p className="mb-3">Tarayıcınızın ayarlarından çerezleri tamamen engelleyebilir veya silebilirsiniz:</p>
                <div className="flex flex-wrap gap-3">
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="nofollow noreferrer" className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm transition-colors">
                    <i className="fa-brands fa-chrome mr-2 text-blue-500"></i>Google Chrome
                  </a>
                  <a href="https://support.mozilla.org/tr/kb/cerezleri-silme-web-sitelerini-kaldirma" target="_blank" rel="nofollow noreferrer" className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm transition-colors">
                    <i className="fa-brands fa-firefox mr-2 text-orange-500"></i>Mozilla Firefox
                  </a>
                  <a href="https://support.apple.com/tr-tr/guide/safari/sfri11471/mac" target="_blank" rel="nofollow noreferrer" className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm transition-colors">
                    <i className="fa-brands fa-safari mr-2 text-blue-400"></i>Apple Safari
                  </a>
                  <a href="https://support.microsoft.com/tr-tr/microsoft-edge" target="_blank" rel="nofollow noreferrer" className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm transition-colors">
                    <i className="fa-brands fa-edge mr-2 text-blue-700"></i>Microsoft Edge
                  </a>
                </div>
              </div>

            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 6. Haklarınız */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">6. Veri Sahibi Olarak Haklarınız (KVKK Md. 11)</h2>
            <div className="space-y-4 text-gray-600">
              <p>Kişisel veri sahibi olarak, Şirketimize başvurarak KVKK Md. 11 kapsamındaki haklarınızı (öğrenme, düzeltme, silme, itiraz etme vb.) kullanabilirsiniz.</p>
              
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6">
                <h4 className="font-bold text-slate-800 mb-2">Başvuru Yöntemi</h4>
                <p className="text-sm mb-4">
                  Haklarınıza ilişkin taleplerinizi, aşağıdaki butona tıklayarak ulaşabileceğiniz başvuru formunu doldurup iletebilirsiniz.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <Link 
                    href="/basvuru-formu" 
                    className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors w-full sm:w-auto"
                  >
                    <i className="fa-solid fa-file-contract"></i>
                    Başvuru Formuna Git
                  </Link>
                  <span className="text-sm text-gray-500">veya</span>
                  <a href="mailto:iletisim@kidsgourmet.com.tr" className="text-orange-600 font-semibold hover:underline">
                    iletisim@kidsgourmet.com.tr
                  </a>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                * Başvurunuz en geç 30 gün içinde sonuçlandırılacaktır.
              </p>
            </div>
          </div>

          {/* Son Güncelleme Footer */}
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