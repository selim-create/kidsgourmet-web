import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası | KidsGourmet',
  description: 'KidsGourmet gizlilik politikası, kişisel verilerin işlenmesi, korunması ve kullanıcı hakları hakkında detaylı bilgilendirme.',
};

export default function GizlilikPolitikasiPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-orange-500 transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-gray-800">Gizlilik Politikası</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">GİZLİLİK POLİTİKASI</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-4 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <i className="fa-regular fa-calendar"></i>
              Son Güncelleme Tarihi: Ocak 2026
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-building-user"></i>
              Veri Sorumlusu: HİP Medya (Umut Kaan Özdemir)
            </span>
          </div>
          <p className="text-gray-600 mt-2 font-medium">Platform: www.kidsgourmet.com.tr</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-10">
          
          {/* 1. Giriş */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">1. GİRİŞ VE HUKUKİ DAYANAK</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                İşbu Gizlilik Politikası ve Aydınlatma Metni (&quot;Politika&quot;), HİP Medya (&quot;Şirket&quot;) tarafından işletilen 
                www.kidsgourmet.com.tr (&quot;Platform&quot;) web sitesini ziyaret eden, üye olan, içerik paylaşan veya hizmetlerimizden 
                yararlanan tüm gerçek kişilerin (&quot;Kullanıcı&quot;) kişisel verilerinin işlenmesi, saklanması, korunması ve imha edilmesi 
                süreçlerini düzenlemektedir.
              </p>
              <p>
                Şirketimiz, T.C. Anayasası’nın 20. maddesi, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;), 5651 sayılı 
                İnternet Ortamında Yapılan Yayınların Düzenlenmesi Hakkında Kanun ve ilgili ikincil mevzuat uyarınca; kişisel verilerinizin 
                güvenliğini sağlamayı ve mahremiyet haklarınıza saygı duymayı en öncelikli taahhüdü olarak kabul eder. Bu metin, KVKK’nın 
                10. maddesinden doğan &quot;Aydınlatma Yükümlülüğü&quot;nü yerine getirmek ve veri işleme faaliyetlerimiz hakkında şeffaf, 
                anlaşılır bilgi sunmak amacıyla hazırlanmıştır.
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 2. Veri Kategorileri */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">2. İŞLENEN KİŞİSEL VERİ KATEGORİLERİ VE TANIMLAR</h2>
            <p className="text-gray-600 mb-6">
              Platformumuzun sunduğu hizmetlerin doğası gereği, aşağıda kategorize edilen kişisel verileriniz, belirtilen yöntemlerle 
              toplanmakta ve işlenmektedir:
            </p>

            {/* 2.1 Tablo */}
            <h3 className="text-lg font-bold text-slate-700 mb-3 pl-3 border-l-4 border-orange-400">2.1. Veri Kategorileri</h3>
            <div className="overflow-x-auto border border-gray-200 rounded-xl mb-8">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 w-1/3">Veri Kategorisi</th>
                    <th className="px-4 py-3">Açıklama ve Örnekler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">Kimlik Bilgileri</td>
                    <td className="px-4 py-3 text-gray-600">Ad, soyad, kullanıcı adı, üyelik ID numarası. Sosyal medya ile giriş yapılması halinde ilgili platformdan aktarılan kimlik verileri.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">İletişim Bilgileri</td>
                    <td className="px-4 py-3 text-gray-600">E-posta adresi, (tercihe bağlı olarak) telefon numarası, iletişim tercihleri.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">İşlem Güvenliği (Log) Verileri</td>
                    <td className="px-4 py-3 text-gray-600">IP adresi, erişim tarihi ve saati, tarayıcı türü/sürümü, işletim sistemi, site içi gezinme hareketleri (5651 sayılı Kanun gereği).</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">Kullanıcı İçeriği (UGC)</td>
                    <td className="px-4 py-3 text-gray-600">Platforma yüklenen tarifler, yorumlar, fotoğraflar, videolar ve bu içeriklerde yer alan görsel/işitsel veriler.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">Özel Nitelikli Kişisel Veriler (Sağlık)</td>
                    <td className="px-4 py-3 text-gray-600">Kullanıcının profilinde veya tarif filtrelerinde beyan ettiği gıda alerjileri (örn: glüten, fıstık alerjisi), diyet kısıtlamaları (örn: diyabetik, çölyak).</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">Pazarlama Verileri</td>
                    <td className="px-4 py-3 text-gray-600">Çerezler (cookies) aracılığıyla elde edilen alışveriş alışkanlıkları, beğeni geçmişi, demografik analiz verileri.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 2.2 Çocuk Verileri */}
            <h3 className="text-lg font-bold text-slate-700 mb-3 pl-3 border-l-4 border-yellow-400">2.2. Çocuk Verilerine İlişkin Yaklaşımımız</h3>
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5 text-gray-700">
              <p>
                Platformumuz, çocuklara yönelik içerikler sunmakla birlikte, yasal olarak ebeveynlerinin izni olmaksızın 18 yaşından küçüklerin 
                (reşit olmayanların) doğrudan veri sağlamasını hedeflememektedir. Platformda çocuklara ait olduğu anlaşılan veriler 
                (isim, fotoğraf vb.), ancak ebeveynin/yasal vasinin kendi kullanıcı hesabı üzerinden ve kendi sorumluluğunda paylaşması 
                durumunda işlenmektedir.
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 3. Amaçlar */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">3. KİŞİSEL VERİLERİN İŞLENME AMAÇLARI VE HUKUKİ SEBEPLERİ</h2>
            <p className="text-gray-600 mb-6">
              Kişisel verileriniz, KVKK Madde 5 ve Madde 6’da belirtilen hukuki sebeplere dayalı olarak, sınırlı ve ölçülü şekilde 
              aşağıdaki amaçlarla işlenmektedir:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-bold text-slate-800 mb-3">3.1. Hukuki Yükümlülüklerin Yerine Getirilmesi (KVKK Md. 5/2-ç)</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                  <li><span className="font-semibold">5651 Sayılı Kanun:</span> İnternet ortamındaki erişim kayıtlarının (trafik loglarının) 2 yıl süreyle saklanması, zaman damgasıyla imzalanması ve talep halinde yetkili makamlarla paylaşılması.</li>
                  <li><span className="font-semibold">Bilgi Güvenliği:</span> Sistem güvenliğinin sağlanması, siber saldırıların tespiti ve önlenmesi.</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-bold text-slate-800 mb-3">3.2. Sözleşmenin Kurulması ve İfası (KVKK Md. 5/2-c)</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                  <li>Üyelik işlemlerinin tamamlanması ve kullanıcı hesabının aktive edilmesi.</li>
                  <li>Kullanıcıların tarif paylaşabilmesi, yorum yapabilmesi ve diğer üyelerle etkileşime girebilmesi.</li>
                  <li>Kullanıcı taleplerine ve şikayetlerine yanıt verilmesi, teknik destek sağlanması.</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-bold text-slate-800 mb-3">3.3. İlgili Kişinin Açık Rızası (KVKK Md. 5/1 ve Md. 6/2)</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                  <li>
                    <span className="font-semibold">Sağlık Verileri:</span> Profilinizde belirttiğiniz gıda alerjileri ve diyet bilgilerinin, size kişiselleştirilmiş (alerjen içermeyen) tarifler sunulması amacıyla işlenmesi.
                    <br/><span className="text-red-500 italic mt-1 block pl-4 text-xs">Uyarı: Profilinize sağlık verisi ekleyerek, bu verinin işlenmesine açık rıza göstermiş sayılırsınız.</span>
                  </li>
                  <li><span className="font-semibold">Ticari Elektronik İleti:</span> Bülten, kampanya ve tanıtım e-postalarının gönderilmesi (ETK onayı kapsamında).</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-bold text-slate-800 mb-3">3.4. Meşru Menfaat (KVKK Md. 5/2-f)</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                  <li>Platformun işlevselliğinin artırılması, kullanıcı deneyiminin iyileştirilmesi ve istatistiksel analizlerin yapılması (Kullanıcının temel haklarına zarar vermemek kaydıyla).</li>
                </ul>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 4. Paylaşım Uyarısı */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">4. &quot;PAYLAŞIM&quot; UYARISI VE ÇOCUK GÜVENLİĞİ POLİTİKASI</h2>
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-6">
              <p className="text-gray-700 mb-4">
                KidsGourmet olarak, dijital dünyada çocukların mahremiyetinin korunması en temel değerlerimizdendir. Ebeveynlerin çocuklarıyla 
                ilgili paylaşım yaparken aşağıdaki hususlara dikkat etmesi hem çocuğun güvenliği hem de hukuki sorumluluk açısından kritiktir:
              </p>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li><strong className="text-orange-900">Görsel Mahremiyet:</strong> Çocuğunuzun yüzünün tam ve net göründüğü, konumunu belli eden (okul logosu, ev adresi tabelası vb.) veya özel hayatın gizliliğini ihlal edebilecek (banyo, uyku hali vb.) fotoğrafları paylaşmamanızı önemle tavsiye ederiz.</li>
                <li><strong className="text-orange-900">Veri Minimizasyonu:</strong> Tarifi veya içeriği anlatmak için gerekli olandan fazla kişisel veriyi (çocuğun tam adı, doğum tarihi, gittiği okul vb.) paylaşmaktan kaçınınız.</li>
                <li><strong className="text-orange-900">İçerik Mülkiyeti ve Riskler:</strong> Platforma yüklediğiniz fotoğrafların, internetin doğası gereği üçüncü kişilerce kopyalanabileceğini ve kontrolümüz dışında kullanılabileceğini unutmayınız.</li>
                <li><strong className="text-orange-900">Müdahale Hakkı:</strong> Şirketimiz, çocuğun üstün yararını gözeterek, çocuk güvenliğini tehlikeye atabileceğini değerlendirdiği içerikleri önceden haber vermeksizin yayından kaldırma, buzlama (blurring) veya silme hakkını saklı tutar.</li>
              </ol>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 5. Tıbbi Sorumluluk Reddi */}
          <div>
            <h2 className="text-2xl font-bold text-red-700 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-file-medical"></i>
              5. TIBBİ SORUMLULUK REDDİ
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-900">
              <p className="mb-4 font-medium">
                KidsGourmet, bir tıbbi danışmanlık platformu değildir. Sitede yer alan tarifler, beslenme önerileri, kullanıcı yorumları ve 
                akıllı araçlar ile çocuk gelişim hesaplamaları yalnızca bilgilendirme amaçlıdır ve tıbbi tavsiye, teşhis veya tedavi yerine geçmez.
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Kullanıcılar, gıda alerjileri veya tıbbi durumları için mutlaka yetkili bir sağlık profesyoneline danışmalıdır.</li>
                <li>Platform üzerindeki &quot;Glütensiz&quot;, &quot;Alerjen İçermez&quot; gibi etiketler, kullanıcı beyanına veya genel içerik analizine dayanır; Şirketimiz bu tariflerin çapraz bulaşma (cross-contamination) riskini veya tıbbi güvenilirliğini garanti etmez. Bu içeriklerin kullanımından doğabilecek sağlık sorunlarında sorumluluk tamamen kullanıcıya aittir.</li>
              </ul>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 6. Veri Aktarımı */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">6. KİŞİSEL VERİLERİN AKTARILMASI</h2>
            <p className="text-gray-600 mb-4">
              Kişisel verileriniz, KVKK&apos;nın 8. ve 9. maddelerine uygun olarak aşağıdaki alıcı gruplarına aktarılabilir:
            </p>
            <ul className="space-y-3 text-gray-600">
              <li className="flex gap-2">
                <i className="fa-solid fa-scale-balanced text-orange-500 mt-1"></i>
                <div><span className="font-bold text-slate-700">Yasal Makamlar:</span> Mahkemeler, savcılıklar, emniyet birimleri ve mevzuat gereği yetkili kamu kurumları (Trafik logları, suç şüphesi durumunda üyelik bilgileri).</div>
              </li>
              <li className="flex gap-2">
                <i className="fa-solid fa-server text-orange-500 mt-1"></i>
                <div><span className="font-bold text-slate-700">Teknik Hizmet Sağlayıcılar:</span> Verilerin saklandığı sunucu hizmeti sağlayıcıları, e-posta gönderim altyapıları, güvenlik hizmeti veren firmalar.</div>
              </li>
              <li className="flex gap-2">
                <i className="fa-solid fa-share-nodes text-orange-500 mt-1"></i>
                <div><span className="font-bold text-slate-700">Sosyal Medya Entegrasyonları:</span> İçerikleri sosyal medya butonları ile paylaşmanız durumunda, ilgili veriler (IP, tarayıcı bilgisi) ilgili sosyal medya platformuna (Facebook, Instagram vb.) aktarılır.</div>
              </li>
            </ul>
          </div>

          <hr className="border-gray-200" />

          {/* 7. Güvenlik */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">7. TEKNİK VE İDARİ GÜVENLİK TEDBİRLERİ</h2>
            <p className="text-gray-600 mb-4">
              Şirketimiz, verilerinizin kaybolmasını, çalınmasını, yetkisiz erişime uğramasını veya değiştirilmesini önlemek için 
              endüstri standartlarında teknik ve idari tedbirler uygulamaktadır.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                <h4 className="font-bold text-slate-700 mb-1 flex items-center gap-2">
                  <i className="fa-solid fa-lock text-green-500"></i> SSL (Secure Sockets Layer)
                </h4>
                <p className="text-xs text-gray-500">Platformumuzdaki tüm veri trafiği, 256-bit SSL sertifikası ile şifrelenmektedir. Bu sayede, tarayıcınız ile sunucularımız arasındaki iletişim üçüncü kişilerce dinlenemez.</p>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                <h4 className="font-bold text-slate-700 mb-1 flex items-center gap-2">
                  <i className="fa-solid fa-user-shield text-blue-500"></i> Erişim Kontrolü ve Loglama
                </h4>
                <p className="text-xs text-gray-500">Kişisel verilere erişim, sadece yetkili personel ile sınırlandırılmış olup, tüm erişim hareketleri yasal mevzuata uygun olarak loglanmaktadır.</p>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                <h4 className="font-bold text-slate-700 mb-1 flex items-center gap-2">
                  <i className="fa-solid fa-shield-halved text-red-500"></i> Güvenlik Duvarı (Firewall)
                </h4>
                <p className="text-xs text-gray-500">Sunucularımız, siber saldırılara (DDoS, SQL Injection vb.) karşı yeni nesil güvenlik duvarları ve saldırı tespit sistemleri (IDS/IPS) ile korunmaktadır.</p>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                <h4 className="font-bold text-slate-700 mb-1 flex items-center gap-2">
                  <i className="fa-solid fa-key text-yellow-500"></i> Parola Güvenliği
                </h4>
                <p className="text-xs text-gray-500">Kullanıcı parolaları sistemlerimizde açık metin olarak değil, güvenli özetleme algoritmaları (Hashing) ile saklanmaktadır.</p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 8. Çerezler */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">8. ÇEREZ (COOKIE) POLİTİKASI</h2>
            <p className="text-gray-600 mb-4">
              Platformumuzda, ziyaretçilerimizin deneyimini iyileştirmek ve site trafiğini analiz etmek için çerezler kullanılmaktadır.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
              <li><span className="font-bold">Zorunlu Çerezler:</span> Sitenin çalışması, oturum açma işlemlerinin güvenliği için gereklidir.</li>
              <li><span className="font-bold">Analitik Çerezler:</span> Google Analytics vb. araçlarla ziyaretçi sayısı, sayfada kalma süresi gibi anonim istatistiklerin toplanmasını sağlar.</li>
              <li><span className="font-bold">Tercih Çerezleri:</span> Dil seçimi, &quot;Beni Hatırla&quot; özelliği gibi kişiselleştirmeleri sağlar.</li>
            </ul>
            <p className="text-sm text-gray-500 italic">
              Tarayıcınızın ayarlarından çerezleri dilediğiniz zaman silebilir veya engelleyebilirsiniz; ancak zorunlu çerezlerin engellenmesi sitenin bazı fonksiyonlarının çalışmamasına neden olabilir.
            </p>
          </div>

          <hr className="border-gray-200" />

          {/* 9. Haklar */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">9. İLGİLİ KİŞİNİN HAKLARI (KVKK MADDE 11)</h2>
            <p className="text-gray-600 mb-4">KVKK’nın 11. maddesi uyarınca, veri sahibi olarak Şirketimize başvurarak aşağıdaki haklarınızı kullanabilirsiniz:</p>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-6">
              <li>Kişisel verinizin işlenip işlenmediğini öğrenme,</li>
              <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme,</li>
              <li>Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
              <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme,</li>
              <li>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,</li>
              <li>KVKK 7. maddede öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok edilmesini isteme,</li>
              <li>(5) ve (6) bentleri uyarınca yapılan işlemlerin, kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
              <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li>
              <li>Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme.</li>
            </ol>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="font-bold text-slate-800 mb-2">Başvuru Yöntemi:</h4>
              <p className="text-gray-600 text-sm mb-4">
                Bu haklarınıza ilişkin taleplerinizi, e-posta göndererek veya Şirket adresine yazılı olarak iletebilirsiniz. Başvurunuz, 
                Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ&apos;e uygun olarak en geç 30 gün içinde ücretsiz olarak yanıtlanacaktır.
              </p>
              <p className="text-xs text-gray-500 mb-4 italic">
                (Eğer gönderim yaptığınız e-posta adresi Şirket’imizin sisteminde kayıtlı değilse, başvurunuzun güvenli elektronik imza ya da mobil imza ile imzalanması gerekmektedir.)
              </p>
              <Link 
                href="/basvuru-formu" 
                className="inline-flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-xl hover:bg-slate-700 transition-colors font-semibold"
              >
                <i className="fa-solid fa-pen-to-square"></i>
                Yazılı Başvuru Formu İçin Tıklayınız!
              </Link>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 10. İletişim */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">10. İLETİŞİM BİLGİLERİ</h2>
            <p className="text-gray-600 mb-6">Veri Sorumlusu sıfatıyla Şirketimizle ilgili her türlü soru ve görüşünüz için aşağıdaki kanallardan bize ulaşabilirsiniz:</p>
            
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-2xl p-6 sm:p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Ticari Unvan</p>
                  <p className="text-slate-800 font-semibold text-lg">HİP Medya (Umut Kaan Özdemir)</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Web</p>
                  <p className="text-slate-800 font-semibold text-lg">www.kidsgourmet.com.tr</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">E-posta</p>
                  <a href="mailto:iletisim@kidsgourmet.com.tr" className="text-orange-600 font-semibold text-lg hover:underline">iletisim@kidsgourmet.com.tr</a>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Adres</p>
                  <p className="text-slate-800">Fatih Mah. Çapraz Sok. No:11/2 K.Çekmece-İstanbul</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}