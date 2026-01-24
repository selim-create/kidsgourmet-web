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
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">ÇEREZ AYDINLATMA METNİ VE POLİTİKASI</h1>
          <p className="text-gray-600 mt-3">Kişisel verilerinizin korunması ve çerez kullanımı hakkında bilgilendirme</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-8">
          
{/* Veri Sorumlusu Künyesi - DÜZELTİLMİŞ VERSİYON */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <h3 className="font-bold text-orange-800 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-building-shield"></i>
              VERİ SORUMLUSU
            </h3>
            
            {/* Grid yapısını değiştirdik: İç içe divler yerine tek grid container kullandık */}
            <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 text-sm text-gray-700">
              
              {/* 1. Unvan */}
              <div>
                <span className="font-bold text-slate-800 block mb-1">Unvan:</span>
                <span>HİP Medya (Umut Kaan Özdemir)</span>
              </div>

              {/* 2. VKN */}
              <div>
                <span className="font-bold text-slate-800 block mb-1">Vergi Kimlik No:</span>
                <span>6810178450</span>
              </div>

              {/* 3. E-posta */}
              <div>
                <span className="font-bold text-slate-800 block mb-1">E-posta:</span>
                <a href="mailto:iletisim@kidsgourmet.com.tr" className="hover:text-orange-600 transition-colors">
                  iletisim@kidsgourmet.com.tr
                </a>
              </div>

              {/* 4. Adres (md:col-span-2 ile tam genişlik yaptık) */}
              <div className="md:col-span-2 border-t border-orange-200/50 pt-3 mt-1">
                <span className="font-bold text-slate-800 block mb-1">Adres:</span>
                <span>Fatih Mah. Çapraz Sok. No:11/2 K.Çekmece-İstanbul</span>
              </div>

            </div>
          </div>

          {/* Giriş */}
          <div>
            <p className="text-gray-600 leading-relaxed mb-4">
              HİP Medya (&quot;Şirket&quot;) olarak, www.kidsgourmet.com.tr alan adlı web sitemizi (&quot;Platform&quot;) ziyaretleriniz sırasında, 
              deneyiminizi iyileştirmek, hizmet kalitemizi artırmak, güvenliğinizi sağlamak ve yasal yükümlülüklerimizi yerine getirmek amacıyla 
              çerezler (cookies) ve piksel etiketleri gibi benzeri teknolojiler kullanmaktayız.
            </p>
            <p className="text-gray-600 leading-relaxed">
              İşbu Çerez Politikası (&quot;Politika&quot;), 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot; veya &quot;Kanun&quot;) ve 
              &quot;Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ&quot; uyarınca, sitemizde kullanılan çerezler, 
              bu çerezler vasıtasıyla işlenen kişisel verileriniz, işleme amaçlarımız, hukuki sebeplerimiz ve haklarınız konusunda sizi detaylı ve şeffaf 
              bir şekilde bilgilendirmek amacıyla hazırlanmıştır.
            </p>
          </div>

          <hr className="border-gray-200" />

          {/* 1. Çerez Nedir */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">1. Çerez (Cookie) Nedir ve Nasıl Çalışır?</h2>
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">
                Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla bilgisayarınıza, akıllı telefonunuza veya tabletinize kaydedilen, 
                genellikle harf ve rakamlardan oluşan küçük boyutlu metin dosyalarıdır. Çerezler, cihazınızın web sitesi sunucuları tarafından tanınmasını 
                sağlayarak, site tercihlerinizin hatırlanmasına, oturumunuzun açık tutulmasına ve site trafiğinin analiz edilmesine olanak tanır.
              </p>
              <p className="text-sm text-gray-500 mb-2">Çerezler, verilerin depolanma süresine ve kaynağına göre sınıflandırılır:</p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-bold text-slate-700 mb-2">Süreye Göre</h4>
                  <ul className="list-disc list-inside text-sm space-y-2">
                    <li><span className="font-semibold">Oturum Çerezleri (Session Cookies):</span> Sadece tarayıcınızı açık tuttuğunuz süre boyunca geçerlidir; tarayıcıyı kapattığınızda silinirler.</li>
                    <li><span className="font-semibold">Kalıcı Çerezler (Persistent Cookies):</span> Sabit diskinizde belirli bir tarihe veya siz silene kadar saklanır.</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-bold text-slate-700 mb-2">Kaynağa Göre</h4>
                  <ul className="list-disc list-inside text-sm space-y-2">
                    <li><span className="font-semibold">Birinci Taraf Çerezler (First Party Cookies):</span> Doğrudan ziyaret ettiğiniz web sitesi (KidsGourmet) tarafından yerleştirilir.</li>
                    <li><span className="font-semibold">Üçüncü Taraf Çerezler (Third Party Cookies):</span> İş birliği yaptığımız harici hizmet sağlayıcılar (Google, Meta vb.) tarafından yerleştirilir.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 2. Kullanılan Çerez Türleri */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">2. Platformumuzda Kullanılan Çerez Türleri, Amaçları ve Hukuki Sebepleri</h2>
            <p className="text-gray-600 mb-6">
              KidsGourmet platformunda kullanılan çerezler, işlevleri ve veri işleme şartları bakımından dört ana kategoride toplanmaktadır. 
              Aşağıdaki tablolarda bu çerezlerin detayları sunulmuştur:
            </p>
            
            {/* 2.1 Zorunlu Çerezler */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-700 mb-3 border-l-4 border-red-400 pl-3">
                2.1. Zorunlu (Kesinlikle Gerekli) Çerezler
              </h3>
              <p className="text-gray-600 mb-4">
                Bu çerezler, Platform&apos;un teknik olarak çalışabilmesi, güvenliğinin sağlanması (örn. siber saldırıların tespiti), sayfa geçişlerinde 
                oturum bilgisinin korunması ve talep ettiğiniz bilgi toplumu hizmetlerinin (örn. üye girişi, form doldurma) sunulması için zorunludur. 
                Bu çerezler devre dışı bırakılamaz; aksi takdirde site çalışmaz.
              </p>
              <div className="overflow-x-auto border border-gray-200 rounded-xl mb-4">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3">Çerez Adı</th>
                      <th className="px-4 py-3">Sağlayıcı</th>
                      <th className="px-4 py-3">Amaç</th>
                      <th className="px-4 py-3">Saklama Süresi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-3 font-mono text-orange-600">csrf_token</td>
                      <td className="px-4 py-3">KidsGourmet</td>
                      <td className="px-4 py-3">Cross-Site Request Forgery (CSRF) saldırılarına karşı güvenlik.</td>
                      <td className="px-4 py-3">Oturum Süresince</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-orange-600">cookie_consent</td>
                      <td className="px-4 py-3">CMP Sağlayıcı</td>
                      <td className="px-4 py-3">Kullanıcının çerez tercihlerini (kabul/red) hatırlamak.</td>
                      <td className="px-4 py-3">12 Ay</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-1">
                 <p className="text-gray-600"><span className="font-semibold">Hukuki Sebep:</span> KVKK Md. 5/2-f (Meşru Menfaat)</p>
                 <p className="text-gray-600"><span className="font-semibold">Rıza Durumu:</span> Bu çerezler için açık rızanız alınmaz.</p>
              </div>
            </div>

            {/* 2.2 Performans ve Analitik */}
            <div>
              <h3 className="text-xl font-bold text-slate-700 mb-3 border-l-4 border-blue-400 pl-3">
                2.2. Performans ve Analitik Çerezler
              </h3>
              <p className="text-gray-600 mb-4">
                Bu çerezler, sitemizi kaç kişinin ziyaret ettiği, hangi sayfaların popüler olduğu, ziyaretçilerin sitede ne kadar zaman geçirdiği 
                gibi ölçümleri anonim veya takma adlı verilerle yapmamızı sağlar. Bu veriler, sitemizin performansını artırmak ve hataları tespit 
                etmek için kullanılır.
              </p>
              
              <ul className="list-disc list-inside text-sm text-gray-600 mb-4 space-y-1">
                <li><span className="font-semibold">Kullanılan Araç:</span> Google Analytics 4 (GA4)</li>
                <li><span className="font-semibold">Önemli Not:</span> GA4 kullanımı sırasında IP adresiniz maskelenmekte (IP Anonymization) olsa da, veriler Google sunucularında işlendiği için yurt dışına veri aktarımı söz konusudur.</li>
              </ul>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 text-sm text-blue-800">
                <p><strong><i className="fa-solid fa-circle-info mr-1"></i> Teknik Not:</strong> Platformumuz Google Consent Mode v2 teknolojisini kullanmaktadır. Bu sayede çerez tercihleriniz anlık olarak Google Analytics&apos;e iletilmekte ve tercihlerinize uygun veri işleme sağlanmaktadır.</p>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-xl mb-4">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3">Çerez Adı</th>
                      <th className="px-4 py-3">Sağlayıcı</th>
                      <th className="px-4 py-3">Amaç</th>
                      <th className="px-4 py-3">Saklama Süresi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-3 font-mono text-blue-600">_ga</td>
                      <td className="px-4 py-3">Google</td>
                      <td className="px-4 py-3">Ziyaretçileri ayırt etmek için benzersiz ID atar.</td>
                      <td className="px-4 py-3">2 Yıl</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-blue-600">_gid</td>
                      <td className="px-4 py-3">Google</td>
                      <td className="px-4 py-3">Günlük ziyaretçi sayısını ve davranışını analiz eder.</td>
                      <td className="px-4 py-3">24 Saat</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-blue-600">ga*</td>
                      <td className="px-4 py-3">Google</td>
                      <td className="px-4 py-3">GA4 oturum durumu ve etkileşim verisi.</td>
                      <td className="px-4 py-3">2 Yıl</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-blue-600">_gat</td>
                      <td className="px-4 py-3">Google</td>
                      <td className="px-4 py-3">İstek hızını sınırlamak için kullanılır.</td>
                      <td className="px-4 py-3">1 Dakika</td>
                    </tr>
                  </tbody>
                </table>
              </div>
               <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-1">
                 <p className="text-gray-600"><span className="font-semibold">Hukuki Sebep:</span> KVKK Md. 5/1 (Açık Rıza)</p>
                 <p className="text-gray-600"><span className="font-semibold">Rıza Durumu:</span> Çerez yönetim panelinden onay vermeniz halinde işlenir.</p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 3. Yurt Dışı Aktarımı */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">3. Kişisel Verilerin Yurt Dışına Aktarımı ve Güvenceler</h2>
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">
                Platformumuzda kullanılan Performans/Analitik ve Reklam/Pazarlama çerezleri, altyapı sağlayıcımız olan Google LLC firmasının 
                sunucularının yurt dışında (başta ABD olmak üzere) bulunması nedeniyle, kişisel verilerinizin yurt dışına aktarılmasına neden olmaktadır.
              </p>
              <p>KVKK&apos;nın 9. maddesi uyarınca, bu aktarım faaliyeti ancak aşağıdaki şartlardan birinin varlığı halinde gerçekleştirilmektedir:</p>
              <ul className="list-decimal list-inside space-y-2 ml-2">
                <li><strong className="text-slate-700">Açık Rıza:</strong> Çerez yönetim paneli üzerinden ilgili çerez kategorilerine (&quot;Analitik&quot; veya &quot;Pazarlama&quot;) onay vererek, verilerinizin belirtilen hizmet sağlayıcılarla paylaşılmasına ve yurt dışına aktarılmasına açık rıza vermiş olursunuz.</li>
                <li><strong className="text-slate-700">Yeterlilik Kararı veya Uygun Güvenceler:</strong> İlgili ülkeler hakkında Kurul tarafından verilmiş bir yeterlilik kararı bulunması veya ilgili sağlayıcılar ile Kurul tarafından öngörülen standart sözleşmelerin imzalanması durumunda aktarım bu hukuki sebeplere dayanabilir.</li>
              </ul>
              <p className="leading-relaxed mt-2">
                HİP Medya olarak, veri aktarımlarında &quot;Standard Contractual Clauses&quot; (Standart Sözleşme Maddeleri) gibi uluslararası geçerliliği 
                olan mekanizmaları tercih etmekte ve verilerinizin güvenliği için gerekli teknik tedbirleri (şifreleme, anonimleştirme) almaktayız.
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 4. Çocuk Verileri */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Çocuk Verileri ve Ebeveyn Sorumluluğu</h2>
            <div className="space-y-3 text-gray-600">
              <p className="leading-relaxed">
                KidsGourmet, içerikleri ve hizmetleri itibarıyla ebeveynlere yönelik bir platformdur. Platformumuz, 18 yaşından küçük çocukların doğrudan 
                hedeflendiği bir mecra olmadığı gibi, çocuklara yönelik veri profillemesi veya davranışsal reklamcılık faaliyeti yürütmemektedir.
              </p>
              <p className="leading-relaxed">
                Ticari Reklam ve Haksız Ticari Uygulamalar Yönetmeliği ile KVKK ilkeleri gereği, çocukların kişisel verilerinin korunmasına azami 
                hassasiyet göstermekteyiz.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800 mb-2">
                  <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                  Eğer 18 yaşından küçükseniz, bu Platformu ancak ebeveyninizin gözetimi altında ziyaret edebilirsiniz.
                </p>
                <p className="text-sm text-yellow-800">
                  Ebeveyn olarak, çocuğunuzun bilginiz dışında veri paylaştığını düşünüyorsanız, lütfen <a href="mailto:iletisim@kidsgourmet.com.tr" className="font-bold underline">iletisim@kidsgourmet.com.tr</a> üzerinden bizimle irtibata geçiniz; söz konusu veriler derhal sistemlerimizden silinecektir.
                </p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 5. Çerez Yönetimi */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">5. Çerez Tercihlerini Yönetme ve Rızayı Geri Alma</h2>
            <p className="text-gray-600 mb-4">
              Kişisel verileriniz üzerindeki kontrol tamamen size aittir. Platformumuzu ilk ziyaretinizde karşınıza çıkan &quot;Çerez Banner&quot;ı üzerinden 
              tercihlerinizi belirleyebileceğiniz gibi, bu tercihleri daha sonra dilediğiniz zaman değiştirebilirsiniz.
            </p>

            <div className="space-y-6 text-gray-600">
              
              {/* 5.1 Platform */}
              <div>
                <h3 className="font-bold text-slate-700 mb-2">5.1. Platform Üzerinden Yönetim</h3>
                <p className="mb-3">Web sitemizin footer alanında bulunan &quot;Çerez Tercihleri&quot; linkine tıklayarak yönetim panelini açabilirsiniz. Bu panelde:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Zorunlu çerezler dışındaki tüm kategorileri &quot;Açık&quot; veya &quot;Kapalı&quot; konuma getirebilirsiniz.</li>
                  <li>&quot;Tümünü Reddet&quot; seçeneği ile zorunlu olmayan tüm veri işlemeyi durdurabilirsiniz.</li>
                  <li>Yaptığınız değişiklikler &quot;Ayarları Kaydet&quot; butonuna bastığınız andan itibaren geçerli olur.</li>
                  <li>Rızanızı geri almanız, geri alma öncesinde rızaya dayalı olarak gerçekleştirilen veri işleme faaliyetlerinin hukuka uygunluğunu etkilemez.</li>
                </ul>
              </div>

              {/* 5.2 Tarayıcı */}
              <div>
                <h3 className="font-bold text-slate-700 mb-2">5.2. Tarayıcı Ayarları Üzerinden Yönetim</h3>
                <p className="mb-3">
                  Kullandığınız internet tarayıcısının ayarlar menüsünden de çerezleri tamamen engelleyebilir veya silebilirsiniz. 
                  Yaygın tarayıcılar için yönergeler aşağıdaki linklerde mevcuttur:
                </p>
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
              <p>Kişisel veri sahibi olarak, Şirketimize başvurarak aşağıdaki haklarınızı kullanabilirsiniz:</p>
              
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
                <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
                <li>İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
                <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme,</li>
                <li>Eksik veya yanlış işlenen verilerin düzeltilmesini isteme,</li>
                <li>KVKK Md. 7 çerçevesinde verilerin silinmesini veya yok edilmesini isteme,</li>
                <li>Otomatik sistemler vasıtasıyla analiz edilen verilerin aleyhinize bir sonuç doğurmasına itiraz etme,</li>
                <li>Kanuna aykırı işleme sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme.</li>
              </ul>

              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6 mt-6">
                <h4 className="font-bold text-slate-800 mb-2">Başvuru Yöntemi</h4>
                <p className="text-sm mb-4">
                  Bu haklarınıza ilişkin taleplerinizi, Başvuru Formu adresindeki formu doldurup gönderek veya Veri Sorumlusuna Başvuru Usul 
                  ve Esasları Hakkında Tebliğ&apos;e uygun şekilde iletisim@kidsgourmet.com.tr adresine iletebilirsiniz. Başvurunuz en geç 30 gün 
                  içinde sonuçlandırılacaktır.
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
                <p className="text-xs text-gray-500 mt-4 italic">
                  (Eğer gönderim yaptığınız e-posta adresi Şirket&apos;imizin sisteminde kayıtlı değilse, başvurunuzun güvenli elektronik imza ya da mobil imza ile imzalanması gerekmektedir.)
                </p>
              </div>
            </div>
          </div>

          {/* Son Güncelleme Footer */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Son Güncelleme Tarihi: Ocak 2026
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}