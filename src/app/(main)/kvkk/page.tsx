import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni | KidsGourmet',
  description: 'KidsGourmet Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında aydınlatma metni ve veri işleme politikası.',
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
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Kişisel Verilerin Korunması Kanunu Aydınlatma Metni</h1>
          <p className="text-gray-600 mt-3">6698 sayılı Kanun kapsamında veri işleme faaliyetlerimiz hakkında bilgilendirme</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        {/* KVKK Uyumu Bilgi Kutusu */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <i className="fa-solid fa-shield-halved text-blue-500 text-2xl mt-1"></i>
            <div>
              <h3 className="font-bold text-slate-800 mb-2">Veri Sorumlusu Bilgilendirmesi</h3>
              <p className="text-sm text-gray-600">
                Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) 
                madde 10 kapsamında hazırlanmıştır.
              </p>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 mb-8">
          
          {/* 1. Veri Sorumlusu */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-orange-100 rounded-full text-orange-500">
                <i className="fa-solid fa-building text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">1. Veri Sorumlusunun Kimliği</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;Kanun&quot; veya &quot;KVKK&quot;) madde 10 kapsamında; 
              www.kidsgourmet.com.tr alan adlı internet sitesinin (&quot;Platform&quot;) işleticisi ve içerik sağlayıcısı olan 
              HİP Medya (bundan sonra &quot;Şirket&quot; olarak anılacaktır), kişisel verilerinizin işlenmesi süreçlerinde 
              &quot;Veri Sorumlusu&quot; sıfatını haizdir.
            </p>
            
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-sm text-gray-700">
              <h4 className="font-bold text-slate-800 mb-3 border-b border-gray-200 pb-2">İletişim Bilgileri:</h4>
              <ul className="space-y-2">
                <li><strong className="text-slate-900">Unvan:</strong> HİP Medya (Umut Kaan Özdemir)</li>
                <li><strong className="text-slate-900">Vergi Kimlik No:</strong> 6810178450</li>
                <li><strong className="text-slate-900">Adres:</strong> Fatih Mah. Çapraz Sok. No:11/2 K.Çekmece-İstanbul</li>
                <li><strong className="text-slate-900">E-Posta:</strong> iletisim@kidsgourmet.com.tr</li>
              </ul>
            </div>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* 2. İşlenen Veriler ve Kategorizasyon */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-full text-purple-500">
                <i className="fa-solid fa-layer-group text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">2. İşlenen Kişisel Verileriniz ve Kategorizasyon</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">
              Platformumuzu ziyaretiniz, üyelik işlemleriniz, bülten aboneliğiniz veya içeriklerle etkileşiminiz sırasında, 
              aşağıda kategorize edilen kişisel verileriniz işlenmektedir.
            </p>
            
            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 w-1/3">Veri Kategorisi</th>
                    <th className="px-4 py-3">Veri İçeriği ve Örnekler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">Kimlik Bilgileri</td>
                    <td className="px-4 py-3">Ad, Soyad, Kullanıcı Adı, (Yarışma/etkinlik katılımı halinde) T.C. Kimlik No, Doğum Tarihi.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">İletişim Bilgileri</td>
                    <td className="px-4 py-3">E-posta adresi, (Tercihen paylaşılması halinde) Cep telefonu numarası, Adres bilgisi.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">İşlem Güvenliği</td>
                    <td className="px-4 py-3">IP adresi, giriş-çıkış kayıtları, şifre bilgileri (kriptolanmış), cihaz ID, tarayıcı bilgileri.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">Müşteri İşlem</td>
                    <td className="px-4 py-3">Talep ve şikayet bilgileri, e-bülten tercihleri, anket cevapları.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">Görsel/İşitsel Kayıtlar</td>
                    <td className="px-4 py-3">Profil fotoğrafları, yarışma veya "Sizden Gelenler" için gönderilen çocuk fotoğrafları/videoları.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">Pazarlama Bilgileri</td>
                    <td className="px-4 py-3">Çerez kayıtları, site içi hareketler, ilgi alanları, kampanya katılım geçmişi.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">Özel Nitelikli Veriler</td>
                    <td className="px-4 py-3">Yorumlarda veya formlarda paylaşılan sağlık verileri (alerji, diyet vb.).</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* 3. İşlenme Amaçları */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full text-blue-500">
                <i className="fa-solid fa-bullseye text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">3. Kişisel Verilerin İşlenme Amaçları</h2>
            </div>
            
            <div className="space-y-6 text-gray-600">
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-bold text-slate-700 mb-3">3.1. Hizmetlerin Sunulması ve Operasyonel Süreçler</h4>
                <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                  <li>Kullanıcı Sözleşmesi&apos;nin ifası, üyelik kaydının oluşturulması.</li>
                  <li>İçeriklerin (makale, video, tarif) erişilebilirliğinin sağlanması.</li>
                  <li>İçerik akışının kişiselleştirilmesi.</li>
                  <li>Soru, talep ve şikayetlerin yanıtlanması.</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-bold text-slate-700 mb-3">3.2. Hukuki ve Teknik Güvenlik</h4>
                <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                  <li>5651 sayılı Kanun gereği trafik kayıtlarının (log) tutulması.</li>
                  <li>Siber güvenliğin sağlanması, yetkisiz erişimlerin önlenmesi.</li>
                  <li>Resmi makamların taleplerinin karşılanması.</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-bold text-slate-700 mb-3">3.3. Pazarlama ve İletişim (Açık Rıza Dahilinde)</h4>
                <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                  <li>E-bülten ve bilgilendirme maillerinin gönderilmesi.</li>
                  <li>Hedefli reklam ve tanıtım faaliyetleri.</li>
                  <li>Çekiliş ve yarışma süreçlerinin yönetilmesi.</li>
                </ul>
              </div>
            </div>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* 4. Toplama Yöntemi ve Hukuki Sebep */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 rounded-full text-indigo-500">
                <i className="fa-solid fa-scale-balanced text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">4. Toplanma Yöntemi ve Hukuki Sebebi</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Kişisel verileriniz, Platforma giriş yapmanız, formları doldurmanız ve çerezleri kabul etmeniz suretiyle 
              dijital ortamda toplanmaktadır. İşleme faaliyetlerimiz KVKK Madde 5 ve 6&apos;ya dayanmaktadır:
            </p>
            <ul className="space-y-3 text-gray-600">
              <li className="flex gap-3">
                <span className="font-bold text-indigo-500 min-w-[20px]">1.</span>
                <span><strong>Kanunlarda Açıkça Öngörülmesi (Md. 5/2-a, ç):</strong> Trafik loglarının tutulması, fatura işlemleri.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-indigo-500 min-w-[20px]">2.</span>
                <span><strong>Sözleşmenin İfası (Md. 5/2-c):</strong> Üyelik sözleşmesi gereği kimlik/iletişim verilerinin işlenmesi.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-indigo-500 min-w-[20px]">3.</span>
                <span><strong>Meşru Menfaat (Md. 5/2-f):</strong> Site güvenliği, zorunlu çerezler, hizmet kalitesi analizleri.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-indigo-500 min-w-[20px]">4.</span>
                <span><strong>Açık Rıza (Md. 5/1 ve 6/2):</strong> E-bülten gönderimi, pazarlama çerezleri, özel nitelikli verilerin işlenmesi ve çocuk görsel verilerinin yayınlanması.</span>
              </li>
            </ul>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* 5. Aktarım */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-full text-green-500">
                <i className="fa-solid fa-share-nodes text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">5. Kişisel Verilerin Aktarılması</h2>
            </div>
            <p className="text-gray-600 mb-4">Verileriniz, KVKK 8. ve 9. maddelere uygun olarak şu gruplara aktarılabilir:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6 ml-2">
              <li><strong>Yetkili Kamu Kurumları:</strong> Emniyet, Savcılık, Mahkemeler, BTK (talep halinde).</li>
              <li><strong>Tedarikçiler:</strong> Sunucu, e-posta gönderim ve altyapı sağlayıcıları.</li>
              <li><strong>Danışmanlar:</strong> Hukuk ve mali müşavirler.</li>
            </ul>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
              <h4 className="font-bold text-orange-800 mb-2">5.1. Yurt Dışına Aktarım</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                Sunucu altyapıları veya analitik araçların (Google Analytics vb.) yurt dışında olması durumunda; 
                verileriniz, Kurul tarafından ilan edilen standart sözleşmelere, güvenli ülke listelerine veya 
                Açık Rızanıza dayalı olarak yurt dışına aktarılmaktadır.
              </p>
            </div>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* 6. Haklar */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-red-100 rounded-full text-red-500">
                <i className="fa-solid fa-user-shield text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">6. Veri Sahibi Olarak Haklarınız (Madde 11)</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">Şirketimize başvurarak aşağıdaki haklarınızı kullanabilirsiniz:</p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {[
                "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
                "İşlenmişse bilgi talep etme",
                "İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme",
                "Yurt içi/dışı aktarım yapılan kişileri bilme",
                "Eksik/yanlış işlemelerin düzeltilmesini isteme",
                "Verilerin silinmesini veya yok edilmesini isteme",
                "Düzeltme/silme işlemlerinin üçüncü kişilere bildirilmesini isteme",
                "Otomatik analiz sonuçlarına itiraz etme",
                "Kanuna aykırı işlemeyle oluşan zararın giderilmesini talep etme"
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3 flex items-start gap-2">
                  <i className="fa-solid fa-check text-green-500 mt-1 text-xs"></i>
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6">
              <h4 className="font-bold text-slate-800 mb-3">Başvuru Usulü</h4>
              <p className="text-sm text-gray-700 mb-4">
                Taleplerinizi yazılı olarak, KEP adresi, güvenli elektronik imza, mobil imza veya sistemimizde kayıtlı 
                e-postanız aracılığıyla <strong className="text-orange-600">iletisim@kidsgourmet.com.tr</strong> adresine iletebilirsiniz.
              </p>
              <Link 
                href="/basvuru-formu" 
                className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors shadow-sm w-full sm:w-auto"
              >
                <i className="fa-solid fa-file-signature"></i>
                Yazılı Başvuru Formu İçin Tıklayınız
              </Link>
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