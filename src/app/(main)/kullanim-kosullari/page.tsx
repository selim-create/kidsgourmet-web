import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kullanıcı Sözleşmesi ve Hukuki Şartlar | KidsGourmet',
  description: 'KidsGourmet kullanıcı sözleşmesi, hukuki şartlar, gizlilik ve feragatname.',
};

export default function KullanimKosullariPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-orange-500 transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-gray-800">Kullanıcı Sözleşmesi</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">KULLANICI SÖZLEŞMESİ VE HUKUKİ ŞARTLAR</h1>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-8">
          
          {/* Önemli Yasal Uyarı - En Üstte */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-orange-800 mb-2">
              ⚠️ ÖNEMLİ YASAL UYARI VE FERAGATNAME
            </h3>
            <p className="text-sm font-semibold text-orange-700 mb-4">
              LÜTFEN PLATFORMU KULLANMAYA BAŞLAMADAN ÖNCE BU BÖLÜMÜ DİKKATLİCE OKUYUNUZ.
            </p>
            <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
              <p>
                Web sitesi www.kidsgourmet.com.tr (&quot;Platform&quot;) üzerinde yer alan her türlü metin,
                görsel, video, grafik, tarif, diyet listesi, akıllı araçlar, beslenme önerisi ve sair içerik
                (&quot;İçerik&quot;), münhasıran genel bilgilendirme, kültür ve eğitim amacı taşımaktadır.
              </p>
              <p className="font-medium">
                Platform’da sunulan hiçbir İçerik; profesyonel tıbbi tavsiye, teşhis, tedavi, terapi
                veya diyet reçetesi niteliğinde değildir ve bu amaçla kullanılamaz.
              </p>
              <p>
                Kullanıcı; Platform’da yer alan bilgilerin, bir hekim, diyetisyen veya yetkili sağlık
                profesyoneli tarafından yapılan fiziki muayene ve teşhisin yerini tutamayacağını;
                çocuğunun veya kendisinin sağlık sorunları, beslenme düzeni değişiklikleri, gıda
                intoleransları veya alerjik durumları ile ilgili olarak, herhangi bir uygulamaya
                geçmeden önce mutlaka uzman bir hekime danışması gerektiğini kabul ve beyan
                eder. Platform’daki bir içeriğe dayanarak profesyonel tıbbi yardım almayı
                geciktirmemeniz, mevcut tedavinizi değiştirmemeniz veya sonlandırmamanız
                gerekmektedir. Şirket, Platform’daki bilgilerin hatalı, eksik veya güncel olmamasından
                ya da bu bilgilerin uygulanması sonucunda doğabilecek doğrudan veya dolaylı,
                bedeni veya maddi hiçbir zarardan (alerjik reaksiyonlar, sağlık bozulmaları vb. dahil
                ancak bunlarla sınırlı olmamak üzere) sorumlu tutulamaz.
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 1. Taraflar */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">1. TARAFLAR VE KÜNYE BİLGİLERİ</h2>
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="font-bold text-slate-700 mb-2">1.1. Şirket (Hizmet Sağlayıcı):</h3>
                <ul className="list-none space-y-1 ml-4 border-l-2 border-orange-100 pl-4">
                  <li><span className="font-medium">Unvan:</span> HİP Medya (Umut Kaan Özdemir)</li>
                  <li><span className="font-medium">Vergi Kimlik No:</span> 6810178450</li>
                  <li><span className="font-medium">Adres:</span> Fatih Mah. Çapraz Sok. No:11/2 K.Çekmece-İstanbul</li>
                  <li><span className="font-medium">E-posta:</span> <a href="mailto:iletisim@kidsgourmet.com.tr" className="text-orange-500 hover:underline">iletisim@kidsgourmet.com.tr</a></li>
                  <li className="text-sm italic mt-1">(İşbu sözleşmede kısaca &quot;Şirket&quot; olarak anılacaktır.)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-slate-700 mb-2">1.2. Kullanıcı:</h3>
                <p className="ml-4 leading-relaxed">
                  Platform’a üye olan veya üye olmaksızın Platform’u ziyaret eden, içeriklere erişen,
                  içerik paylaşan, yorum yapan gerçek veya tüzel kişidir. (İşbu sözleşmede kısaca
                  &quot;Kullanıcı&quot; olarak anılacaktır.)
                </p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 2. Konu ve Tanımlar */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">2. SÖZLEŞMENİN KONUSU VE TANIMLAR</h2>
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="font-bold text-slate-700 mb-2">2.1. Konu:</h3>
                <p className="leading-relaxed">
                  İşbu Sözleşme’nin konusu; Kullanıcı’nın Platform’dan faydalanmasına, Platform’a
                  içerik yüklemesine (User Generated Content) ve Platform üzerindeki hizmetlerin
                  kullanımına ilişkin hüküm ve koşulların belirlenmesi; Taraflar’ın 5651 sayılı Kanun,
                  5846 sayılı FSEK, 6698 sayılı KVKK ve ilgili mevzuat kapsamındaki hak ve
                  yükümlülüklerinin düzenlenmesidir.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-700 mb-2">2.2. Tanımlar:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><span className="font-semibold">Platform:</span> www.kidsgourmet.com.tr alan adı, buna bağlı alt alan adları ve mobil uygulamalar.</li>
                  <li><span className="font-semibold">5651 Sayılı Kanun:</span> İnternet Ortamında Yapılan Yayınların Düzenlenmesi ve Bu Yayınlar Yoluyla İşlenen Suçlarla Mücadele Edilmesi Hakkında Kanun.</li>
                  <li><span className="font-semibold">Yer Sağlayıcı:</span> Hizmet ve içerikleri barındıran sistemleri sağlayan veya işleten gerçek veya tüzel kişi (Şirket, Kullanıcı İçerikleri/Yorumları bakımından bu sıfatı haizdir).</li>
                  <li><span className="font-semibold">İçerik Sağlayıcı:</span> İnternet ortamı üzerinden kullanıcılara sunulan her türlü bilgi veya veriyi üreten, değiştiren ve sağlayan gerçek veya tüzel kişi (Şirket, kendi editöryal içerikleri bakımından bu sıfatı haizdir).</li>
                  <li><span className="font-semibold">UGC (User Generated Content):</span> Kullanıcılar tarafından üretilen ve Platform’a yüklenen yorumlar, tarifler, fotoğraflar ve videolar.</li>
                </ul>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 3. Üyelik Şartları */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">3. ÜYELİK ŞARTLARI VE HESAP GÜVENLİĞİ</h2>
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="font-bold text-slate-700 mb-2">3.1. Doğru Bilgi Beyanı:</h3>
                <p className="leading-relaxed">
                  Kullanıcı, Platform’a üye olurken sağladığı ad, soyad, e-posta ve diğer bilgilerin tam,
                  doğru, güncel ve kendisine ait olduğunu taahhüt eder. Yanlış veya eksik bilgi
                  verilmesi, başkasının kimlik bilgilerinin kullanılması nedeniyle doğacak her türlü
                  hukuki ve cezai sorumluluk Kullanıcı’ya aittir. Şirket, bu nedenle uğrayacağı zararları
                  Kullanıcı’dan rücuen tazmin etme hakkını saklı tutar.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-700 mb-2">3.2. Hesap Güvenliği:</h3>
                <p className="leading-relaxed">
                  Kullanıcı adı ve şifre güvenliği münhasıran Kullanıcı’nın sorumluluğundadır. Kullanıcı,
                  hesabının yetkisiz kişilerce kullanıldığını fark etmesi halinde durumu derhal Şirket’e
                  bildirmekle yükümlüdür. Şirket, şifre güvenliğinin sağlanamamasından kaynaklanan
                  veri kayıplarından veya yetkisiz erişimlerden sorumlu değildir.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-700 mb-2">3.3. Yasal Ehliyet:</h3>
                <p className="leading-relaxed">
                  Platform hizmetlerinden yararlanmak için Kullanıcı’nın 18 yaşını doldurmuş ve tam
                  ehliyetli olması gerekmektedir. 18 yaş altındaki kullanıcıların Platform’u kullanımı,
                  ancak veli veya yasal vasilerinin onayı ve gözetimi altında mümkündür. Şirket,
                  çocukların ebeveyn gözetimi olmaksızın gerçekleştirdiği işlemlerden sorumlu tutulamaz.
                </p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 4. Kullanım Koşulları */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">4. KULLANIM KOŞULLARI VE YASAKLI FİİLLER</h2>
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="font-bold text-slate-700 mb-2">4.1. Hukuka Uygunluk:</h3>
                <p className="leading-relaxed">
                  Kullanıcı, Platform’u kullanırken Türkiye Cumhuriyeti yasalarına, uluslararası
                  sözleşmelere, Fikir ve Sanat Eserleri Kanunu’na, Türk Ceza Kanunu’na ve genel
                  ahlak kurallarına uygun davranacağını kabul ve taahhüt eder.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-700 mb-2">4.2. Yasaklı İçerikler:</h3>
                <p className="mb-2">Kullanıcı, Platform üzerinde aşağıda belirtilen nitelikteki içerikleri paylaşamaz, yükleyemez veya yayamaz:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
                  <li>5651 sayılı Kanun’un 8. maddesinde sayılan katalog suçları (intihara yönlendirme, çocukların cinsel istismarı, uyuşturucu kullanımı, müstehcenlik, fuhuş, kumar vb.) teşkil eden içerikler.</li>
                  <li>Terör örgütü propagandası yapan, halkı kin ve düşmanlığa tahrik eden, ayrımcı ve nefret söylemi içeren ifadeler.</li>
                  <li>Üçüncü kişilerin kişilik haklarına saldırı niteliğindeki hakaret, iftira, tehdit ve şantaj içeren beyanlar.</li>
                  <li>Başkalarına ait telif hakkı, marka veya patent haklarını ihlal eden materyaller.</li>
                  <li>Virüs, trojan, solucan gibi zararlı yazılımlar veya Platform’un güvenliğini tehdit eden kodlar.</li>
                </ul>
                <p className="text-sm italic">
                  Şirket, bu tür içerikleri tespit etmesi halinde, önceden bildirimde bulunmaksızın içeriği
                  yayından kaldırma ve ilgili Kullanıcı’nın üyeliğini askıya alma/iptal etme hakkına
                  sahiptir. Ayrıca, adli makamlara suç duyurusunda bulunma hakkı saklıdır.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-700 mb-2">4.3. Çocuğun Üstün Yararı:</h3>
                <p className="leading-relaxed">
                  Platform, çocuklara yönelik içerikler barındırdığından, Kullanıcılar paylaşımlarında
                  &quot;Çocuğun Üstün Yararı&quot; ilkesini gözetmek zorundadır. Çocukların fiziksel, zihinsel
                  veya ahlaki gelişimini olumsuz etkileyebilecek, korku veya travma yaratabilecek
                  görsellerin paylaşımı kesinlikle yasaktır.
                </p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 5. Yer Sağlayıcı */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">5. YER SAĞLAYICI VE İÇERİK SAĞLAYICI STATÜSÜ</h2>
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="font-bold text-slate-700 mb-2">5.1. Yer Sağlayıcı Olarak Şirket:</h3>
                <p className="leading-relaxed">
                  Kullanıcılar tarafından Platform’a yüklenen yorumlar, tarifler, fotoğraflar ve videolar
                  (UGC) bakımından Şirket, 5651 sayılı Kanun uyarınca &quot;Yer Sağlayıcı&quot; konumundadır.
                  Şirket, kullanıcıların paylaştığı içerikleri yayınlanmadan önce kontrol etmekle veya
                  içeriğin hukuka aykırı olup olmadığını araştırmakla yükümlü değildir (5651 s.K. m.5).
                  Dolayısıyla, Kullanıcı tarafından paylaşılan bir içeriğin üçüncü kişilere zarar vermesi
                  durumunda, hukuki ve cezai sorumluluk münhasıran içeriği paylaşan Kullanıcı’ya aittir.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-700 mb-2">5.2. Uyar-Kaldır:</h3>
                <p className="leading-relaxed">
                  Hukuka aykırı bir içeriğin varlığı iddiasında olan hak sahipleri, Şirket’in iletişim
                  adreslerine başvurarak içeriğin yayından kaldırılmasını talep edebilirler. Şirket,
                  usulüne uygun yapılan ve hak ihlalini belgeleyen başvuruları değerlendirerek, yasal
                  süreler içerisinde gereğini yapacaktır.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-700 mb-2">5.3. İçerik Sağlayıcı Olarak Şirket:</h3>
                <p className="leading-relaxed">
                  Şirket, sadece bizzat kendi editörleri tarafından üretilen ve &quot;KidsGourmet&quot; imzasıyla
                  yayınlanan içeriklerden &quot;İçerik Sağlayıcı&quot; sıfatıyla sorumludur. Ancak bu sorumluluk,
                  işbu Sözleşme’nin başındaki Tıbbi Feragatname ile sınırlandırılmıştır.
                </p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 6. Fikri Mülkiyet */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">6. FİKRİ MÜLKİYET HAKLARI VE LİSANS DEVRİ</h2>
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="font-bold text-slate-700 mb-2">6.1. Şirket&apos;in Hakları:</h3>
                <p className="leading-relaxed">
                  Platform’un yazılımı, tasarımı, arayüzü, logosu, ticari takdim şekli ve Şirket tarafından
                  üretilen özgün içeriklerin tüm mali ve manevi hakları Şirket’e aittir. Kullanıcılar, bu
                  materyalleri kopyalayamaz, değiştiremez, ticari amaçla kullanamaz.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-700 mb-2">6.2. Kullanıcı İçeriği Lisans Devri:</h3>
                <p className="leading-relaxed">
                  Kullanıcı, Platform’a fotoğraf, video, tarif metni, yorum vb. içerik yüklediğinde; bu
                  içeriklerin eser sahibi olduğunu veya eser sahibinden gerekli izinleri aldığını beyan
                  eder. Kullanıcı, işbu Sözleşme’yi onaylamakla, Platform’a yüklediği içerikler üzerinde
                  sahip olduğu FSEK m. 21 (İşleme), m. 22 (Çoğaltma), m. 23 (Yayma), m. 24 (Temsil)
                  ve m. 25 (İşaret, Ses ve/veya Görüntü Nakline Yarayan Araçlarla Umuma İletim)
                  haklarını; yer, sayı ve süre sınırı olmaksızın, dünya genelinde geçerli olmak üzere,
                  bedelsiz, münhasır olmayan ve gayri kabili rücu bir lisans ile Şirket’e
                  devrettiğini/kullandırdığını kabul ve taahhüt eder.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-700 mb-2">6.3. Kullanım Hakkı:</h3>
                <p className="leading-relaxed">
                  Şirket, Kullanıcı’nın devrettiği bu haklara dayanarak; ilgili içeriği Platform’da
                  yayınlama, sosyal medya hesaplarında paylaşma, reklam ve tanıtım materyallerinde
                  kullanma, basılı eserlerde (dergi, kitap, broşür) yer verme, üçüncü kişilere alt lisans
                  verme ve içeriği editoryal amaçlarla (imla hatası düzeltme, kısaltma, kolaj yapma vb.)
                  işleme/değiştirme hakkına sahiptir. Kullanıcı, bu kullanımlar nedeniyle Şirket’ten
                  herhangi bir telif ücreti veya tazminat talep etmeyeceğini peşinen kabul eder.
                </p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 7. Kişisel Veriler */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">7. KİŞİSEL VERİLERİN KORUNMASI VE GİZLİLİK</h2>
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="font-bold text-slate-700 mb-2">7.1. Mevzuat Uyumu:</h3>
                <p className="leading-relaxed">
                  Şirket, Kullanıcı’nın kişisel verilerini 6698 sayılı Kişisel Verilerin Korunması Kanunu
                  (KVKK) ve ilgili ikincil mevzuata uygun olarak işler. Kişisel verilerin işlenme amaçları,
                  aktarıldığı taraflar ve veri sahibi hakları, Platform’da yayınlanan &quot;Aydınlatma
                  Metni&quot;nde detaylıca açıklanmıştır.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-700 mb-2">7.2. Log Kayıtları:</h3>
                <p className="leading-relaxed">
                  Şirket, 5651 sayılı Kanun ve ilgili yönetmelikler gereği, Kullanıcı’nın internet trafiği
                  verilerini (IP adresi, erişim tarihi, saati, ziyaret edilen sayfalar vb.) zaman damgası ile
                  birlikte en az 2 (iki) yıl süreyle saklamakla yasal olarak yükümlüdür. Bu veriler,
                  yalnızca yetkili adli ve idari mercilerin (Savcılık, Mahkeme, BTK) resmi talebi üzerine
                  ilgili kurumlarla paylaşılır.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-700 mb-2">7.3. Sosyal Medya Entegrasyonu:</h3>
                <p className="leading-relaxed">
                  Kullanıcı’nın Platform’a sosyal medya hesapları (Google, Facebook vb.) üzerinden
                  giriş yapması halinde, ilgili sosyal medya platformunun izin verdiği ölçüde temel profil
                  bilgilerine erişim sağlanır. Bu verilerin işlenmesi de Aydınlatma Metni kapsamındadır.
                </p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 8. Sorumluluk */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">8. SORUMLULUĞUN SINIRLANDIRILMASI</h2>
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="font-bold text-slate-700 mb-2">8.1. &quot;Olduğu Gibi&quot; Sunum:</h3>
                <p className="leading-relaxed">
                  Platform ve içerikleri &quot;olduğu gibi&quot; sunulmaktadır. Şirket, Platform’un kesintisiz,
                  hatasız veya virüssüz çalışacağına, içeriklerin her zaman doğru ve güncel olduğuna
                  dair herhangi bir garanti vermez. Teknik aksaklıklar, siber saldırılar veya bakım
                  çalışmaları nedeniyle hizmetin geçici olarak durmasından Şirket sorumlu değildir.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-slate-700 mb-2">8.2. Üçüncü Taraf Bağlantıları:</h3>
                <p className="leading-relaxed">
                  Platform, üçüncü taraf web sitelerine veya kaynaklarına bağlantılar (linkler) içerebilir.
                  Şirket, bu bağlantıların yönlendirdiği sitelerin içeriğinden, güvenliğinden veya gizlilik
                  politikalarından sorumlu değildir. Bu sitelere erişim riski tamamen Kullanıcı’ya aittir.
                </p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 9. Mücbir Sebepler */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">9. MÜCBİR SEBEPLER</h2>
            <div className="space-y-3 text-gray-600">
              <p className="leading-relaxed">
                Doğal afetler, yangın, grev, ayaklanma, savaş, siber saldırılar, altyapı ve internet
                arızaları, elektrik kesintileri, kamu otoritelerinin kararları ve Şirket’in kontrolü dışında
                gelişen diğer haller &quot;Mücbir Sebep&quot; olarak kabul edilir. Mücbir sebep süresince
                Şirket, Sözleşme’den doğan yükümlülüklerini geç ifa etmekten veya ifa etmemekten
                dolayı sorumlu tutulamaz.
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 10. Fesih */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">10. SÖZLEŞMENİN FESHİ</h2>
            <div className="space-y-3 text-gray-600">
              <p className="leading-relaxed">
                Şirket, Kullanıcı’nın işbu Sözleşme hükümlerine, yasalara veya ahlak kurallarına
                aykırı davrandığını tespit etmesi halinde, herhangi bir ihtar veya ihbara gerek
                kalmaksızın Kullanıcı’nın üyeliğini tek taraflı olarak feshedebilir, Platform’a erişimini
                engelleyebilir ve varsa yüklediği içerikleri silebilir. Bu durumda Kullanıcı, Şirket’ten
                herhangi bir hak talebinde bulunamaz.
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 11. Hukuk */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">11. UYGULANACAK HUKUK VE YETKİLİ MAHKEME</h2>
            <div className="space-y-3 text-gray-600">
              <p className="leading-relaxed">
                İşbu Sözleşme’nin yorumlanmasında ve uygulanmasında Türkiye Cumhuriyeti
                Kanunları geçerlidir. Sözleşme’den doğabilecek her türlü uyuşmazlığın çözümünde
                İstanbul (Çağlayan) Mahkemeleri ve İcra Daireleri yetkilidir.
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 12. Delil */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">12. DELİL SÖZLEŞMESİ</h2>
            <div className="space-y-3 text-gray-600">
              <p className="leading-relaxed">
                Taraflar, işbu Sözleşme’den doğabilecek uyuşmazlıklarda, Şirket’in ticari defterlerinin,
                veritabanı kayıtlarının, sunucu loglarının, e-posta yazışmalarının ve bilgisayar
                kayıtlarının HMK madde 193 uyarınca geçerli, bağlayıcı, kesin ve münhasır delil
                teşkil edeceğini kabul ve taahhüt ederler.
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