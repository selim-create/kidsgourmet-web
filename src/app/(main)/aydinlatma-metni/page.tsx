import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Kişisel Verilerin Korunması ve İşlenmesi Aydınlatma Metni | KidsGourmet',
  description: 'KidsGourmet kişisel verilerin işlenmesi, veri güvenliği ve kullanıcı hakları hakkında aydınlatma metni.',
};

export default function AydinlatmaMetniPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-orange-500 transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-gray-800">Aydınlatma Metni</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">KİŞİSEL VERİLERİN KORUNMASI VE İŞLENMESİ AYDINLATMA METNİ</h1>
          <p className="text-gray-600 mt-3">6698 sayılı Kanun kapsamında veri güvenliği ve mahremiyet bilgilendirmesi</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        {/* Giriş Bilgi Kutusu */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <i className="fa-solid fa-file-shield text-orange-500 text-2xl mt-1"></i>
            <div>
              <h3 className="font-bold text-slate-800 mb-2">Veri Sorumlusu Bilgilendirmesi</h3>
              <p className="text-sm text-gray-600">
                İşbu Aydınlatma Metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;Kanun&quot;) m. 10 ve &quot;Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ&quot; uyarınca hazırlanmıştır.
              </p>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 mb-8">
          
          {/* Veri Sorumlusu */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-orange-100 rounded-full text-orange-500">
                <i className="fa-solid fa-building text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Veri Sorumlusu</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">
              HİP Medya (&quot;Şirket&quot;) olarak, www.kidsgourmet.com.tr (&quot;Platform&quot;) üzerinden sunduğumuz hizmetlerden yararlanan kullanıcılarımızın (&quot;Kullanıcı&quot;), ziyaretçilerimizin ve ebeveynlerin kişisel verilerinin güvenliğine ve mahremiyetine azami özen göstermekteyiz.
            </p>
            
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-sm text-gray-700">
              <ul className="space-y-2">
                <li><strong className="text-slate-900">Veri Sorumlusu:</strong> HİP Medya (Umut Kaan Özdemir)</li>
                <li><strong className="text-slate-900">Vergi Kimlik No:</strong> 6810178450</li>
                <li><strong className="text-slate-900">Adres:</strong> Fatih Mah. Çapraz Sok. No11/2 K.Çekmece-İstanbul</li>
                <li><strong className="text-slate-900">E-posta:</strong> iletisim@kidsgourmet.com.tr</li>
              </ul>
            </div>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* 1. İşlenen Kişisel Veriler */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full text-blue-500">
                <i className="fa-solid fa-layer-group text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">1. İşlenen Kişisel Verileriniz ve Kategorileri</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">
              Platformu kullanımınız sürecinde, aşağıdaki kategorilerde yer alan kişisel verileriniz, belirtilen amaçlarla sınırlı olarak işlenmektedir:
            </p>
            
            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 w-1/3">Veri Kategorisi</th>
                    <th className="px-4 py-3">Veri İçeriği Örnekleri</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">Kimlik Bilgileri</td>
                    <td className="px-4 py-3">Ad, soyad, kullanıcı adı, sosyal medya hesap ID&apos;si (Social Login durumunda).</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">İletişim Bilgileri</td>
                    <td className="px-4 py-3">E-posta adresi, (varsa) telefon numarası, iletişim adresi.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">İşlem Güvenliği Bilgileri</td>
                    <td className="px-4 py-3">IP adresi, erişim logları, giriş-çıkış bilgileri, şifre (hashlenmiş), cihaz bilgileri (User Agent).</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">Görsel ve İşitsel Kayıtlar</td>
                    <td className="px-4 py-3">Profil fotoğrafı, tariflere eklenen fotoğraflar ve videolar.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">Kullanıcı İçeriği ve Yorumlar</td>
                    <td className="px-4 py-3">Tarifler, blog yorumları, forum paylaşımları (Bu alanda paylaşılan sağlık verileri ve çocuk bilgileri alenileştirme iradeniz kapsamında işlenir).</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-700">Pazarlama Bilgileri</td>
                    <td className="px-4 py-3">Çerez kayıtları, kampanya kullanım bilgisi, bülten abonelik tercihleri.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* 2. İşleme Amaçları */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-full text-purple-500">
                <i className="fa-solid fa-bullseye text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">2. Kişisel Verilerin İşlenme Amaçları</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:
            </p>
            <ul className="grid md:grid-cols-2 gap-4 text-gray-600">
              <li className="bg-gray-50 p-4 rounded-xl">
                <strong className="block text-slate-800 mb-1"><i className="fa-solid fa-user-check text-purple-500 mr-2"></i>Üyelik Süreçleri</strong>
                <span className="text-sm">Kullanıcı kaydının oluşturulması, kimlik doğrulama ve sosyal medya hesabı ile giriş imkanının sağlanması.</span>
              </li>
              <li className="bg-gray-50 p-4 rounded-xl">
                <strong className="block text-slate-800 mb-1"><i className="fa-solid fa-utensils text-purple-500 mr-2"></i>Hizmet İfası</strong>
                <span className="text-sm">Tarif paylaşımı, yorum yapma ve içerik üretimi süreçlerinin yürütülmesi.</span>
              </li>
              <li className="bg-gray-50 p-4 rounded-xl">
                <strong className="block text-slate-800 mb-1"><i className="fa-solid fa-scale-balanced text-purple-500 mr-2"></i>Yasal Uyum</strong>
                <span className="text-sm">5651 sayılı Kanun uyarınca trafik kayıtlarının tutulması, yetkili makam taleplerinin karşılanması.</span>
              </li>
              <li className="bg-gray-50 p-4 rounded-xl">
                <strong className="block text-slate-800 mb-1"><i className="fa-solid fa-bullhorn text-purple-500 mr-2"></i>İletişim ve Pazarlama</strong>
                <span className="text-sm">Bülten (newsletter) gönderimi, kampanya duyuruları (Açık rızanız veya ticari elektronik ileti onayınız olması halinde).</span>
              </li>
              <li className="bg-gray-50 p-4 rounded-xl">
                <strong className="block text-slate-800 mb-1"><i className="fa-solid fa-shield-halved text-purple-500 mr-2"></i>Güvenlik</strong>
                <span className="text-sm">Platform güvenliğinin sağlanması, siber saldırıların tespiti ve önlenmesi.</span>
              </li>
              <li className="bg-gray-50 p-4 rounded-xl">
                <strong className="block text-slate-800 mb-1"><i className="fa-solid fa-child-reaching text-purple-500 mr-2"></i>İçerik Denetimi</strong>
                <span className="text-sm">Çocukların dijital güvenliğini sağlamak amacıyla paylaşılan içeriklerin moderasyonu.</span>
              </li>
            </ul>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* 3. Toplama Yöntemi ve Hukuki Sebep */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-full text-green-500">
                <i className="fa-solid fa-database text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">3. Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebebi</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Kişisel verileriniz; Platform üzerindeki formların doldurulması, API&apos;ler aracılığıyla sosyal medya platformlarından veri çekilmesi, çerezler ve otomatik loglama sistemleri aracılığıyla elektronik ortamda toplanmaktadır.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Bu veriler, Kanun&apos;un 5. ve 6. maddelerinde belirtilen şu hukuki sebeplere dayanmaktadır:
            </p>
            <ul className="space-y-2 text-gray-600 ml-2">
              <li className="flex gap-2 text-sm">
                <i className="fa-solid fa-check text-green-500 mt-1"></i>
                <span><strong>Bir sözleşmenin kurulması veya ifası (m. 5/2-c):</strong> Üyelik sözleşmesinin gereği olarak hesap yönetimi.</span>
              </li>
              <li className="flex gap-2 text-sm">
                <i className="fa-solid fa-check text-green-500 mt-1"></i>
                <span><strong>Kanunlarda açıkça öngörülmesi (m. 5/2-a):</strong> Trafik loglarının tutulması.</span>
              </li>
              <li className="flex gap-2 text-sm">
                <i className="fa-solid fa-check text-green-500 mt-1"></i>
                <span><strong>Veri sorumlusunun hukuki yükümlülüğü (m. 5/2-ç):</strong> Yasal bildirimler ve veri güvenliği tedbirleri.</span>
              </li>
              <li className="flex gap-2 text-sm">
                <i className="fa-solid fa-check text-green-500 mt-1"></i>
                <span><strong>İlgili kişinin alenileştirmesi (m. 6/3):</strong> Yorumlarda veya içeriklerde kendi rızanızla paylaştığınız sağlık verileri (alerji vb.) ve görseller.</span>
              </li>
              <li className="flex gap-2 text-sm">
                <i className="fa-solid fa-check text-green-500 mt-1"></i>
                <span><strong>Meşru Menfaat (m. 5/2-f):</strong> Temel haklarınıza zarar vermemek kaydıyla Platformun geliştirilmesi ve güvenliği.</span>
              </li>
              <li className="flex gap-2 text-sm">
                <i className="fa-solid fa-check text-green-500 mt-1"></i>
                <span><strong>Açık Rıza (m. 5/1):</strong> Ticari elektronik ileti gönderimi ve yurt dışı kaynaklı pazarlama çerezlerinin kullanımı.</span>
              </li>
            </ul>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* 4. Aktarım */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 rounded-full text-indigo-500">
                <i className="fa-solid fa-share-nodes text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">4. Kişisel Verilerin Aktarılması ve Yurt Dışı Aktarım</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Kişisel verileriniz;
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
                <h4 className="font-bold text-indigo-800 mb-2">Yurt İçi</h4>
                <p className="text-sm text-gray-700">
                  Hukuki uyuşmazlıklarda adli makamlara, bilişim altyapı desteği alınan yerli tedarikçilere aktarılabilir.
                </p>
              </div>
              <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
                <h4 className="font-bold text-indigo-800 mb-2">Yurt Dışı</h4>
                <p className="text-sm text-gray-700">
                  Platformumuzda kullanılan e-posta gönderim servisleri, analitik araçları (Google Analytics) ve sosyal medya giriş modülleri (Facebook/Google) nedeniyle verileriniz yurt dışındaki sunuculara aktarılabilir.
                </p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* 5. Çocuk Verileri Uyarısı */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-red-100 rounded-full text-red-500">
                <i className="fa-solid fa-triangle-exclamation text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">5. Çocuk Verileri ve &quot;Paylaşımı&quot; Hakkında Uyarı</h2>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <p className="text-red-900 leading-relaxed text-sm">
                Platformumuza içerik yükleyen ebeveynlerin, çocuklarına ait görselleri veya bilgileri paylaşırken &quot;Çocuğun Üstün Yararı&quot; ilkesini gözetmeleri esastır. Ebeveyn tarafından paylaşılan ve çocuğun mahremiyetini ihlal ettiği tespit edilen içerikler, Şirketimiz tarafından derhal kaldırılabilir. Paylaşılan içeriklerin hukuki sorumluluğu paylaşan Kullanıcı&apos;ya aittir.
              </p>
            </div>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* 6. Haklar */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-teal-100 rounded-full text-teal-500">
                <i className="fa-solid fa-user-shield text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">6. İlgili Kişi Hakları (Madde 11)</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Kanun&apos;un 11. maddesi kapsamındaki haklarınıza (bilgi alma, düzeltme, silme, itiraz etme vb.) ilişkin taleplerinizi, &quot;Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ&quot;e uygun olarak iletisim@kidsgourmet.com.tr adresine iletebilirsiniz.
            </p>
            
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-xl p-6">
              <p className="text-sm text-gray-700 mb-4">
                (Eğer gönderim yaptığınız e-posta adresi Şirket’imizin sisteminde kayıtlı değilse, başvurunuzun güvenli elektronik imza ya da mobil imza ile imzalanması gerekmektedir.)
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="mailto:iletisim@kidsgourmet.com.tr"
                  className="inline-flex items-center justify-center gap-2 bg-white border border-teal-200 text-teal-700 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors"
                >
                  <i className="fa-solid fa-envelope"></i>
                  iletisim@kidsgourmet.com.tr
                </a>
                <Link 
                  href="/basvuru-formu" 
                  className="inline-flex items-center justify-center gap-2 bg-teal-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-teal-700 transition-colors shadow-sm"
                >
                  <i className="fa-solid fa-file-pen"></i>
                  Yazılı Başvuru Formu İçin Tıklayınız!
                </Link>
              </div>
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