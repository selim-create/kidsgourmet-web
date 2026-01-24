import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kişisel Verilerin Korunması Kanunu (KVKK) Aydınlatma Metni | KidsGourmet',
  description: 'KidsGourmet KVKK aydınlatma metni, veri sorumlusu bilgileri, işlenen veriler ve haklarınız hakkında detaylı bilgilendirme.',
};

export default function KVKKPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-orange-500 transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-gray-800">KVKK Aydınlatma Metni</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">KİŞİSEL VERİLERİN KORUNMASI KANUNU</h1>
          <div className="mt-4 text-sm text-gray-600 font-medium">
            Ocak 2026
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-10">
          
          {/* 1. Veri Sorumlusu */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">1. Veri Sorumlusunun Kimliği</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                6698 sayılı Kişisel Verilerin Korunması Kanunu ("Kanun" veya "KVKK") madde 10 kapsamında; www.kidsgourmet.com.tr alan adlı internet sitesinin ("Platform") işleticisi ve içerik sağlayıcısı olan HİP Medya (bundan sonra "Şirket" olarak anılacaktır), kişisel verilerinizin işlenmesi süreçlerinde "Veri Sorumlusu" sıfatını haizdir.
              </p>
              <p>
                Şirketimiz, ebeveynlik, çocuk sağlığı, beslenme ve gelişimi konularında dijital yayıncılık faaliyeti yürütmekte olup; tarafınıza ait verilerin güvenliğini, Anayasa'nın 20. maddesi ve KVKK hükümleri ışığında en üst düzeyde temin etmeyi taahhüt eder.
              </p>
              
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <p className="font-bold text-slate-800 mb-2">İletişim Bilgileri:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Unvan: HİP Medya (Umut Kaan Özdemir)</li>
                  <li>Vergi Kimlik No: 6810178450</li>
                  <li>Adres: Fatih Mah. Çapraz Sok. No:11/2 K.Çekmece-İstanbul</li>
                  <li>E-Posta: iletisim@kidsgourmet.com.tr</li>
                </ul>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 2. İşlenen Veriler */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">2. İşlenen Kişisel Verileriniz ve Kategorizasyon</h2>
            <p className="text-gray-600 mb-6">
              Platformumuzu ziyaretiniz, üyelik işlemleriniz, bülten aboneliğiniz veya içeriklerle etkileşiminiz sırasında, aşağıda kategorize edilen kişisel verileriniz işlenmektedir. Platformumuzun ebeveynlere yönelik olması sebebiyle, tarafınızca paylaşılan çocuklarınıza ait verilerde, yasal temsilci sıfatıyla hareket ettiğiniz kabul edilmektedir.
            </p>
            
            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 w-1/3">Veri Kategorisi</th>
                    <th className="px-4 py-3">Veri İçeriği ve Örnekler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">Kimlik Bilgileri</td>
                    <td className="px-4 py-3 text-gray-600">Ad, Soyad, Kullanıcı Adı, (Yarışma/etkinlik katılımı halinde) T.C. Kimlik No, Doğum Tarihi.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">İletişim Bilgileri</td>
                    <td className="px-4 py-3 text-gray-600">E-posta adresi, (Tercihen paylaşılması halinde) Cep telefonu numarası, Adres bilgisi.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">İşlem Güvenliği Bilgileri</td>
                    <td className="px-4 py-3 text-gray-600">IP adresi, internet sitesi giriş-çıkış kayıtları, şifre ve parola bilgileri (kriptolanmış), cihaz ID, tarayıcı bilgileri.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">Müşteri İşlem Bilgileri</td>
                    <td className="px-4 py-3 text-gray-600">Çağrı merkezi kayıtları (varsa), talep ve şikayet bilgileri, e-bülten tercihleri, anket cevapları.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">Görsel ve İşitsel Kayıtlar</td>
                    <td className="px-4 py-3 text-gray-600">Platforma yüklediğiniz profil fotoğrafları, yarışma veya "Sizden Gelenler" köşesi için gönderilen çocuk fotoğrafları/videoları.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">Pazarlama Bilgileri</td>
                    <td className="px-4 py-3 text-gray-600">Çerez (Cookie) kayıtları, site içi hareketler, okuma alışkanlıkları, ilgi alanları, kampanya katılım geçmişi.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">Özel Nitelikli Kişisel Veriler</td>
                    <td className="px-4 py-3 text-gray-600">Yorum alanlarında veya formlarda tarafınızca ihtiyari olarak paylaşılan sağlık verileri (alerji, diyet, hastalık bilgisi vb.).</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 3. Amaçlar */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">3. Kişisel Verilerin İşlenme Amaçları</h2>
            <p className="text-gray-600 mb-6">
              Kişisel verileriniz, Kanun’un 4. maddesinde belirtilen "hukuka ve dürüstlük kurallarına uygun olma", "doğru ve gerektiğinde güncel olma", "belirli, açık ve meşru amaçlar için işlenme" ilkelerine bağlı kalınarak aşağıdaki amaçlarla işlenmektedir:
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-slate-800 mb-2">3.1. Hizmetlerin Sunulması ve Operasyonel Süreçler</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                  <li>Kullanıcı Sözleşmesi'nin ifası, üyelik kaydının oluşturulması ve yönetilmesi.</li>
                  <li>Platform üzerinden sunulan içeriklerin (makale, video, tarif) erişilebilirliğinin sağlanması.</li>
                  <li>Kullanıcıların ilgi alanlarına göre içerik akışının kişiselleştirilmesi.</li>
                  <li>İletişim formları veya e-posta yoluyla iletilen soru, talep ve şikayetlerin yanıtlanması.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 mb-2">3.2. Hukuki ve Teknik Güvenlik</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                  <li>5651 sayılı İnternet Ortamında Yapılan Yayınların Düzenlenmesi Hakkında Kanun gereği erişim ve trafik kayıtlarının (log) tutulması.</li>
                  <li>Platformun siber güvenliğinin sağlanması, yetkisiz erişimlerin tespiti ve önlenmesi.</li>
                  <li>Resmi makamların (Savcılık, Mahkemeler, BTK) taleplerinin karşılanması.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 mb-2">3.3. Pazarlama ve İletişim (Açık Rıza Dahilinde)</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                  <li>Haftalık ve aylık e-bültenlerin, bilgilendirme maillerinin gönderilmesi.</li>
                  <li>Kullanıcı alışkanlıklarının analizi suretiyle hedefli reklam ve tanıtım faaliyetlerinin yürütülmesi.</li>
                  <li>Çekiliş, yarışma ve etkinlik süreçlerinin yönetilmesi.</li>
                </ul>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 4. Toplanma Yöntemi ve Hukuki Sebebi */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebebi</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Kişisel verileriniz, Platforma giriş yapmanız, üyelik formunu doldurmanız, çerezleri kabul etmeniz ve bizimle iletişime geçmeniz suretiyle otomatik veya kısmen otomatik yöntemlerle dijital ortamda toplanmaktadır.
              </p>
              <p>Bu işleme faaliyetleri, KVKK'nın 5. ve 6. maddelerinde düzenlenen aşağıdaki hukuki sebeplere dayanmaktadır:</p>
              
              <ol className="list-decimal list-inside space-y-4 ml-2">
                <li>
                  <span className="font-bold text-slate-700">Kanunlarda Açıkça Öngörülmesi ve Hukuki Yükümlülük (Madde 5/2-a, ç):</span>
                  <div className="pl-6 mt-1">
                    5651 sayılı Kanun gereği trafik loglarının tutulması ve Vergi Usul Kanunu gereği fatura (varsa) işlemlerinin yapılması.
                  </div>
                </li>
                <li>
                  <span className="font-bold text-slate-700">Sözleşmenin Kurulması ve İfası (Madde 5/2-c):</span>
                  <div className="pl-6 mt-1">
                    Üyelik sözleşmesinin gereği olarak kimlik ve iletişim verilerinizin işlenmesi.
                  </div>
                </li>
                <li>
                  <span className="font-bold text-slate-700">İlgili Kişinin Temel Haklarına Zarar Vermemek Kaydıyla Meşru Menfaat (Madde 5/2-f):</span>
                  <div className="pl-6 mt-1">
                    Site güvenliğinin sağlanması, zorunlu çerezlerin kullanımı, hizmet kalitesinin artırılmasına yönelik analizler.
                  </div>
                </li>
                <li>
                  <span className="font-bold text-slate-700">Açık Rıza (Madde 5/1 ve Madde 6/2):</span>
                  <ul className="list-[circle] list-inside pl-6 mt-1 space-y-1">
                    <li>Ticari elektronik ileti (E-bülten, kampanya) gönderimi.</li>
                    <li>Pazarlama ve analiz (profilleme) amaçlı çerezlerin kullanımı.</li>
                    <li>Yorumlar veya formlar aracılığıyla paylaşılan Özel Nitelikli Kişisel Verilerin (Sağlık verileri vb.) işlenmesi.</li>
                    <li>Çocuklara ait görsel verilerin (fotoğraf) yayınlanması.</li>
                  </ul>
                </li>
              </ol>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 5. Aktarılma */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">5. Kişisel Verilerin Aktarılması</h2>
            <p className="text-gray-600 mb-4">
              Kişisel verileriniz, Kanun'un 8. ve 9. maddelerine uygun olarak, sadece işleme amaçlarının gerektirdiği ölçüde aşağıdaki alıcı gruplarına aktarılabilmektedir:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6 ml-2">
              <li><span className="font-bold text-slate-700">Yetkili Kamu Kurum ve Kuruluşları:</span> Hukuki yükümlülüklerimizin yerine getirilmesi amacıyla, talep halinde Emniyet, Savcılık, Mahkemeler ve Bilgi Teknolojileri ve İletişim Kurumu (BTK).</li>
              <li><span className="font-bold text-slate-700">Tedarikçiler ve İş Ortakları:</span> Platformun altyapı, sunucu, barındırma, e-posta gönderim ve yazılım hizmetlerini sağlayan teknik hizmet sağlayıcılar.</li>
              <li><span className="font-bold text-slate-700">Hukuk ve Mali Danışmanlar:</span> Şirketimizin haklarının savunulması ve yasal uyumluluğun denetimi amacıyla avukatlar ve mali müşavirler.</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-800 mb-3">5.1. Yurt Dışına Aktarım</h3>
            <div className="text-gray-600 space-y-2">
              <p>Platformumuzun kullandığı bazı sunucu altyapıları, e-posta gönderim servisleri (örn. bülten altyapısı) veya analitik araçları (Google Analytics vb.) sunucularını yurt dışında barındırıyor olabilir. Bu kapsamda kişisel verileriniz;</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>KVKK'nın 9. maddesinde 2024 yılında yapılan değişiklik uyarınca; Kurul tarafından ilan edilen Standart Sözleşme metinlerinin imzalanarak Kuruma bildirilmesi güvencesine dayalı olarak, veya;</li>
                <li>İlgili ülkenin Kişisel Verileri Koruma Kurulu tarafından ilan edilen Yeterli Koruma sağlayan ülkeler listesinde yer alması halinde, veya;</li>
                <li>Bu şartların sağlanamadığı hallerde, Açık Rızanıza istinaden yurt dışına aktarılmaktadır.</li>
              </ul>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 6. Haklarınız */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">6. Veri Sahibi Olarak Haklarınız (Madde 11)</h2>
            <p className="text-gray-600 mb-4">Kanun'un 11. maddesi uyarınca, veri sorumlusu olan Şirketimize başvurarak aşağıdaki haklarınızı kullanabilirsiniz:</p>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-8 ml-2">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
              <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme,</li>
              <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
              <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme,</li>
              <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,</li>
              <li>Kanun’un 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme,</li>
              <li>Düzeltme, silme ve yok etme işlemlerinin, kişisel verilerinizin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
              <li>İşlenen verilerinizin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li>
              <li>Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme.</li>
            </ol>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h4 className="font-bold text-slate-800 mb-3">Başvuru Usulü:</h4>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Yukarıda belirtilen haklarınızı kullanmak için taleplerinizi, yazılı olarak veya kayıtlı elektronik posta (KEP) adresi, güvenli elektronik imza, mobil imza ya da Şirketimize daha önce bildirdiğiniz ve sistemimizde kayıtlı bulunan elektronik posta adresinizi kullanmak suretiyle iletisim@kidsgourmet.com.tr adresine iletebilirsiniz. Başvurunuzda; Ad, Soyad, T.C. Kimlik No, tebligata esas yerleşim yeri adresi, iletişim bilgileri ve talep konusunun bulunması zorunludur.
              </p>
              
              <Link 
                href="/basvuru-formu" 
                className="inline-flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-xl hover:bg-slate-700 transition-colors font-semibold"
              >
                <i className="fa-solid fa-file-signature"></i>
                Yazılı Başvuru Formu İçin Tıklayınız!
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}