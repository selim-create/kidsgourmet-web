import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası | KidsGourmet',
  description: 'KidsGourmet gizlilik politikası, KVKK aydınlatma metni, veri işleme süreçleri ve çocuk güvenliği politikası.',
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
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Gizlilik Politikası</h1>
          <p className="text-gray-600 mt-3">Kişisel verilerinizin işlenmesi, saklanması ve korunması hakkında bilgilendirme</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-8">
          
          {/* Veri Sorumlusu Künyesi - Üst Bilgi */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-user-shield"></i>
              VERİ SORUMLUSU
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p><span className="font-semibold">Unvan:</span> HİP Medya (Umut Kaan Özdemir)</p>
                <p><span className="font-semibold">Platform:</span> www.kidsgourmet.com.tr</p>
              </div>
              <div>
                <p><span className="font-semibold">Adres:</span> Fatih Mah. Çapraz Sok. No:11/2 K.Çekmece-İstanbul</p>
                <p><span className="font-semibold">E-posta:</span> iletisim@kidsgourmet.com.tr</p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 1. Giriş */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">1. GİRİŞ VE HUKUKİ DAYANAK</h2>
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">
                İşbu Gizlilik Politikası ve Aydınlatma Metni (“Politika”), HİP Medya (“Şirket”) tarafından işletilen 
                www.kidsgourmet.com.tr (“Platform”) web sitesini ziyaret eden, üye olan, içerik paylaşan veya 
                hizmetlerimizden yararlanan tüm gerçek kişilerin (“Kullanıcı”) kişisel verilerinin işlenmesi, 
                saklanması, korunması ve imha edilmesi süreçlerini düzenlemektedir.
              </p>
              <p className="leading-relaxed">
                Şirketimiz, T.C. Anayasası’nın 20. maddesi, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”), 
                5651 sayılı İnternet Ortamında Yapılan Yayınların Düzenlenmesi Hakkında Kanun ve ilgili ikincil mevzuat uyarınca; 
                kişisel verilerinizin güvenliğini sağlamayı ve mahremiyet haklarınıza saygı duymayı en öncelikli taahhüdü olarak kabul eder.
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 2. Veri Kategorileri */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">2. İŞLENEN KİŞİSEL VERİ KATEGORİLERİ</h2>
            
            {/* 2.1 Tablo */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-700 mb-3">2.1. Veri Kategorileri</h3>
              <div className="overflow-x-auto border border-gray-200 rounded-xl">
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
                      <td className="px-4 py-3">Ad, soyad, kullanıcı adı, üyelik ID numarası. Sosyal medya ile giriş verileri.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-slate-700">İletişim Bilgileri</td>
                      <td className="px-4 py-3">E-posta adresi, (tercihe bağlı) telefon numarası, iletişim tercihleri.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-slate-700">İşlem Güvenliği (Log)</td>
                      <td className="px-4 py-3">IP adresi, erişim tarihi/saati, tarayıcı bilgisi, işletim sistemi (5651 sayılı Kanun gereği).</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-slate-700">Kullanıcı İçeriği (UGC)</td>
                      <td className="px-4 py-3">Yüklenen tarifler, yorumlar, fotoğraflar, videolar.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-slate-700">Özel Nitelikli Veriler (Sağlık)</td>
                      <td className="px-4 py-3">Beyan edilen gıda alerjileri (örn: glüten, fıstık) ve diyet kısıtlamaları.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-slate-700">Pazarlama Verileri</td>
                      <td className="px-4 py-3">Çerezler aracılığıyla elde edilen alışveriş alışkanlıkları, beğeni geçmişi.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2.2 Çocuk Verileri */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                <i className="fa-solid fa-child-reaching"></i>
                2.2. Çocuk Verilerine İlişkin Yaklaşımımız
              </h3>
              <p className="text-sm text-yellow-900 leading-relaxed">
                Platformumuz, çocuklara yönelik içerikler sunmakla birlikte, yasal olarak ebeveynlerinin izni olmaksızın 
                18 yaşından küçüklerin doğrudan veri sağlamasını hedeflememektedir. Çocuklara ait olduğu anlaşılan veriler, 
                ancak ebeveynin/yasal vasinin kendi kullanıcı hesabı üzerinden ve kendi sorumluluğunda paylaşması durumunda işlenmektedir.
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 3. Amaçlar ve Hukuki Sebepler */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">3. KİŞİSEL VERİLERİN İŞLENME AMAÇLARI</h2>
            <div className="space-y-4 text-gray-600">
              <ul className="list-none space-y-4">
                <li className="bg-gray-50 p-4 rounded-xl">
                  <strong className="block text-slate-700 mb-1">3.1. Hukuki Yükümlülüklerin Yerine Getirilmesi (KVKK Md. 5/2-ç)</strong>
                  <span className="text-sm">5651 Sayılı Kanun gereği erişim kayıtlarının saklanması ve sistem güvenliğinin sağlanması.</span>
                </li>
                <li className="bg-gray-50 p-4 rounded-xl">
                  <strong className="block text-slate-700 mb-1">3.2. Sözleşmenin Kurulması ve İfası (KVKK Md. 5/2-c)</strong>
                  <span className="text-sm">Üyelik işlemleri, tarif paylaşımı, yorum yapma ve teknik destek hizmetlerinin sunulması.</span>
                </li>
                <li className="bg-gray-50 p-4 rounded-xl">
                  <strong className="block text-slate-700 mb-1">3.3. İlgili Kişinin Açık Rızası (KVKK Md. 5/1 ve Md. 6/2)</strong>
                  <span className="text-sm block mb-1">Sağlık verilerinin (alerjen bilgisi) kişiselleştirilmiş hizmet için işlenmesi ve ticari elektronik ileti gönderimi.</span>
                  <span className="text-xs text-orange-600 font-semibold">⚠️ Profilinize sağlık verisi ekleyerek, bu verinin işlenmesine açık rıza göstermiş sayılırsınız.</span>
                </li>
                <li className="bg-gray-50 p-4 rounded-xl">
                  <strong className="block text-slate-700 mb-1">3.4. Meşru Menfaat (KVKK Md. 5/2-f)</strong>
                  <span className="text-sm">Platform işlevselliğinin artırılması ve istatistiksel analizler.</span>
                </li>
              </ul>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 4. Çocuk Güvenliği ve Paylaşım Uyarısı */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">4. "PAYLAŞIM" UYARISI VE ÇOCUK GÜVENLİĞİ</h2>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 space-y-4">
              <p className="text-red-900 font-medium">
                Ebeveynlerin çocuklarıyla ilgili paylaşım yaparken aşağıdaki hususlara dikkat etmesi kritiktir:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-red-800 ml-2">
                <li><strong className="text-red-900">Görsel Mahremiyet:</strong> Çocuğunuzun yüzünün tam göründüğü veya özel hayatını ihlal edebilecek (banyo vb.) fotoğrafları paylaşmamanızı öneririz.</li>
                <li><strong className="text-red-900">Veri Minimizasyonu:</strong> Çocuğun tam adı, doğum tarihi, okulu gibi gereksiz detayları paylaşmaktan kaçınınız.</li>
                <li><strong className="text-red-900">Riskler:</strong> Paylaşılan fotoğrafların üçüncü kişilerce kopyalanabileceğini unutmayınız.</li>
                <li><strong className="text-red-900">Müdahale Hakkı:</strong> Şirketimiz, çocuk güvenliğini tehlikeye atabileceğini değerlendirdiği içerikleri kaldırma veya buzlama hakkını saklı tutar.</li>
              </ul>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 5. Tıbbi Sorumluluk Reddi */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">5. TIBBİ SORUMLULUK REDDİ</h2>
            <div className="space-y-3 text-gray-600">
              <p className="leading-relaxed">
                KidsGourmet, bir tıbbi danışmanlık platformu değildir. Sitede yer alan tarifler ve öneriler yalnızca bilgilendirme amaçlıdır; 
                tıbbi tavsiye, teşhis veya tedavi yerine geçmez.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Kullanıcılar, gıda alerjileri veya tıbbi durumları için mutlaka yetkili bir sağlık profesyoneline danışmalıdır.</li>
                <li>"Glütensiz", "Alerjen İçermez" gibi etiketler kullanıcı beyanına dayanır; Şirketimiz çapraz bulaşma riskini garanti etmez.</li>
              </ul>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 6. Verilerin Aktarılması */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">6. KİŞİSEL VERİLERİN AKTARILMASI</h2>
            <div className="space-y-3 text-gray-600">
              <p className="leading-relaxed">
                Kişisel verileriniz, KVKK'nın 8. ve 9. maddelerine uygun olarak şu gruplara aktarılabilir:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-slate-700">Yasal Makamlar:</strong> Mahkemeler, savcılıklar ve yetkili kamu kurumları.</li>
                <li><strong className="text-slate-700">Teknik Hizmet Sağlayıcılar:</strong> Sunucu hizmeti, e-posta altyapısı ve güvenlik firmaları.</li>
                <li><strong className="text-slate-700">Sosyal Medya:</strong> Paylaşım butonları kullanıldığında ilgili platformlara (Facebook vb.) veri aktarımı.</li>
              </ul>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 7. Güvenlik Tedbirleri */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">7. TEKNİK VE İDARİ GÜVENLİK TEDBİRLERİ</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h4 className="font-bold text-slate-700 mb-2"><i className="fa-solid fa-lock text-orange-500 mr-2"></i>SSL Şifreleme</h4>
                <p className="text-sm text-gray-600">Tüm veri trafiği 256-bit SSL sertifikası ile şifrelenmektedir.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h4 className="font-bold text-slate-700 mb-2"><i className="fa-solid fa-user-lock text-orange-500 mr-2"></i>Erişim Kontrolü</h4>
                <p className="text-sm text-gray-600">Erişim yetkili personel ile sınırlıdır ve loglanmaktadır.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h4 className="font-bold text-slate-700 mb-2"><i className="fa-solid fa-shield-virus text-orange-500 mr-2"></i>Güvenlik Duvarı</h4>
                <p className="text-sm text-gray-600">Siber saldırılara karşı güvenlik duvarları ve IDS/IPS sistemleri mevcuttur.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h4 className="font-bold text-slate-700 mb-2"><i className="fa-solid fa-key text-orange-500 mr-2"></i>Parola Güvenliği</h4>
                <p className="text-sm text-gray-600">Parolalar hashing algoritmaları ile saklanmaktadır.</p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 8. Çerez Politikası */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">8. ÇEREZ (COOKIE) POLİTİKASI</h2>
            <p className="text-gray-600 mb-4">
              Platformumuzda deneyimi iyileştirmek için Zorunlu, Analitik ve Tercih çerezleri kullanılmaktadır. 
              Detaylı bilgi için <Link href="/cerez-politikasi" className="text-orange-500 hover:underline font-semibold">Çerez Politikası</Link> sayfamızı inceleyebilirsiniz.
            </p>
          </div>

          <hr className="border-gray-200" />

          {/* 9. Haklarınız ve Başvuru */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">9. İLGİLİ KİŞİNİN HAKLARI (KVKK MADDE 11)</h2>
            <div className="space-y-4 text-gray-600">
              <p>KVKK’nın 11. maddesi uyarınca veri sahibi olarak şu haklara sahipsiniz:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme.</li>
                <li>İşleme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme.</li>
                <li>Yurt içi/dışı aktarım yapılan üçüncü kişileri bilme.</li>
                <li>Eksik/yanlış işlemelerin düzeltilmesini, verilerin silinmesini isteme.</li>
                <li>Aleyhinize çıkan otomatik analiz sonuçlarına itiraz etme.</li>
                <li>Zararın giderilmesini talep etme.</li>
              </ul>
              
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mt-6">
                <h4 className="font-bold text-orange-800 mb-2">Başvuru Yöntemi</h4>
                <p className="text-sm text-gray-700 mb-4">
                  Haklarınıza ilişkin taleplerinizi aşağıdaki butona tıklayarak ulaşacağınız formu doldurarak veya 
                  e-posta yoluyla iletebilirsiniz. Başvurularınız en geç 30 gün içinde yanıtlanacaktır.
                </p>
                <Link 
                  href="/basvuru-formu" 
                  className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
                >
                  <i className="fa-solid fa-file-pen"></i>
                  Yazılı Başvuru Formu İçin Tıklayınız
                </Link>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 10. İletişim */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">10. İLETİŞİM BİLGİLERİ</h2>
            <div className="space-y-3 text-gray-600">
              <p>Veri Sorumlusu sıfatıyla her türlü soru ve görüşünüz için:</p>
              <ul className="space-y-2 ml-4">
                <li><strong>Ticari Unvan:</strong> HİP Medya (Umut Kaan Özdemir)</li>
                <li><strong>Adres:</strong> Fatih Mah. Çapraz Sok. No:11/2 K.Çekmece-İstanbul</li>
                <li>
                  <strong>E-posta:</strong>{' '}
                  <a href="mailto:iletisim@kidsgourmet.com.tr" className="text-orange-500 hover:underline">
                    iletisim@kidsgourmet.com.tr
                  </a>
                </li>
                <li>
                  <strong>Web:</strong>{' '}
                  <a href="https://kidsgourmet.com.tr" className="text-orange-500 hover:underline">
                    www.kidsgourmet.com.tr
                  </a>
                </li>
              </ul>
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