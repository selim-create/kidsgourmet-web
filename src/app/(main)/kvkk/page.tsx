import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni | KidsGourmet',
  description: 'KidsGourmet Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında aydınlatma metni.',
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
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">KVKK Aydınlatma Metni</h1>
          <p className="text-gray-600 mt-3">Kişisel Verilerin Korunması Kanunu kapsamında bilgilendirme</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        {/* KVKK Uyumu Bilgi Kutusu */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <i className="fa-solid fa-shield-halved text-blue-500 text-2xl mt-1"></i>
            <div>
              <h3 className="font-bold text-slate-800 mb-2">KVKK Uyumlu</h3>
              <p className="text-sm text-gray-600">
                Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) 
                uyarınca hazırlanmıştır ve kişisel verilerinizin işlenmesi hakkında sizi bilgilendirmek amacıyla sunulmaktadır.
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
              <h2 className="text-2xl font-bold text-slate-800">1. Veri Sorumlusu</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, kişisel verileriniz; 
              veri sorumlusu olarak <strong>Hip Medya Dijital Yayıncılık ve Teknoloji A.Ş.</strong> 
              ("KidsGourmet" veya "Şirket") tarafından aşağıda açıklanan kapsamda işlenebilecektir.
            </p>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* Kişisel Verilerin İşlenme Amacı */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full text-blue-500">
                <i className="fa-solid fa-bullseye text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">2. Kişisel Verilerin İşlenme Amacı</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Toplanan kişisel verileriniz, KVKK'nın 5. ve 6. maddelerinde belirtilen kişisel veri işleme şartları çerçevesinde aşağıdaki amaçlarla işlenebilecektir:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-1"></i>
                <span>Üyelik işlemlerinin gerçekleştirilmesi ve yönetilmesi</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-1"></i>
                <span>Hizmetlerimizin sunulması ve iyileştirilmesi</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-1"></i>
                <span>İletişim faaliyetlerinin yürütülmesi</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-1"></i>
                <span>Bülten ve kampanya bilgilendirmelerinin yapılması</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-1"></i>
                <span>Yasal yükümlülüklerin yerine getirilmesi</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-green-500 mt-1"></i>
                <span>Çocuk beslenmesi konusunda kişiselleştirilmiş içerik sunulması</span>
              </li>
            </ul>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* İşlenen Kişisel Veriler */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-full text-purple-500">
                <i className="fa-solid fa-database text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">3. İşlenen Kişisel Veriler</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">Tarafımızca işlenen kişisel veri kategorileri şunlardır:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-slate-700 mb-2">
                  <i className="fa-solid fa-id-card text-orange-500 mr-2"></i>
                  Kimlik Bilgileri
                </h4>
                <p className="text-sm text-gray-600">Ad, soyad</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-slate-700 mb-2">
                  <i className="fa-solid fa-envelope text-orange-500 mr-2"></i>
                  İletişim Bilgileri
                </h4>
                <p className="text-sm text-gray-600">E-posta adresi</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-slate-700 mb-2">
                  <i className="fa-solid fa-baby text-orange-500 mr-2"></i>
                  Çocuk Bilgileri
                </h4>
                <p className="text-sm text-gray-600">Çocuk adı, doğum tarihi, alerjen bilgileri (ebeveyn onayı ile)</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-slate-700 mb-2">
                  <i className="fa-solid fa-chart-line text-orange-500 mr-2"></i>
                  Kullanım Verileri
                </h4>
                <p className="text-sm text-gray-600">Site kullanım istatistikleri, tercihler</p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* Kişisel Verilerin Aktarılması */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-full text-green-500">
                <i className="fa-solid fa-share-nodes text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">4. Kişisel Verilerin Aktarılması</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Kişisel verileriniz, yukarıda belirtilen amaçların gerçekleştirilmesi doğrultusunda; 
              iş ortaklarımıza, tedarikçilerimize, hizmet sağlayıcılarımıza ve yasal olarak yetkili 
              kamu kurumlarına KVKK'nın 8. ve 9. maddelerinde belirtilen kişisel veri işleme şartları 
              çerçevesinde aktarılabilecektir.
            </p>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* Veri Toplamanın Yöntemi ve Hukuki Sebebi */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-indigo-100 rounded-full text-indigo-500">
                <i className="fa-solid fa-scale-balanced text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">5. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Kişisel verileriniz, web sitemiz, mobil uygulamamız ve elektronik ortamlar aracılığıyla 
              otomatik veya otomatik olmayan yöntemlerle toplanmaktadır. Kişisel verileriniz KVKK'nın 
              5. maddesinde belirtilen aşağıdaki hukuki sebeplerine dayalı olarak işlenmektedir:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-circle-check text-blue-500 mt-1"></i>
                <span>Açık rızanızın bulunması</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-circle-check text-blue-500 mt-1"></i>
                <span>Bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-circle-check text-blue-500 mt-1"></i>
                <span>Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi için zorunlu olması</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-circle-check text-blue-500 mt-1"></i>
                <span>Veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olması</span>
              </li>
            </ul>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* KVKK Kapsamındaki Haklar */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-red-100 rounded-full text-red-500">
                <i className="fa-solid fa-user-shield text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">6. KVKK Kapsamındaki Haklarınız</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <i className="fa-solid fa-check text-green-500 mr-2"></i>
                <span className="text-sm text-gray-700">Kişisel verilerinizin işlenip işlenmediğini öğrenme</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <i className="fa-solid fa-check text-green-500 mr-2"></i>
                <span className="text-sm text-gray-700">İşlenmişse bilgi talep etme</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <i className="fa-solid fa-check text-green-500 mr-2"></i>
                <span className="text-sm text-gray-700">İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <i className="fa-solid fa-check text-green-500 mr-2"></i>
                <span className="text-sm text-gray-700">Yurt içi/dışı aktarım bilgisi</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <i className="fa-solid fa-check text-green-500 mr-2"></i>
                <span className="text-sm text-gray-700">Eksik veya yanlış işlenmiş ise düzeltme talep etme</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <i className="fa-solid fa-check text-green-500 mr-2"></i>
                <span className="text-sm text-gray-700">Silinmesini veya yok edilmesini isteme</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <i className="fa-solid fa-check text-green-500 mr-2"></i>
                <span className="text-sm text-gray-700">Otomatik sistemlerle analiz edilmesine itiraz etme</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <i className="fa-solid fa-check text-green-500 mr-2"></i>
                <span className="text-sm text-gray-700">Kanuna aykırı işlemeden dolayı zararın giderilmesini talep etme</span>
              </div>
            </div>
          </div>

          <hr className="border-gray-200 my-8" />

          {/* Başvuru Yöntemi */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center bg-teal-100 rounded-full text-teal-500">
                <i className="fa-solid fa-paper-plane text-xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">7. Başvuru Yöntemi</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Yukarıda belirtilen haklarınızı kullanmak için{' '}
              <a href="mailto:kvkk@kidsgourmet.com.tr" className="text-orange-500 hover:underline font-semibold">
                kvkk@kidsgourmet.com.tr
              </a>{' '}
              adresine e-posta göndererek veya{' '}
              <Link href="/iletisim" className="text-orange-500 hover:underline font-semibold">
                iletişim formu
              </Link>{' '}
              aracılığıyla başvuruda bulunabilirsiniz.
            </p>
          </div>

          {/* Son Güncelleme */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Son güncelleme: Ocak 2025
            </p>
          </div>

        </div>

        {/* Veri Sorumlusu İletişim Kartı */}
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 flex items-center justify-center bg-slate-700 rounded-full text-white">
              <i className="fa-solid fa-address-card text-xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Veri Sorumlusu ve İletişim</h2>
          </div>
          <div className="space-y-3 text-gray-600">
            <p><strong className="text-slate-800">Şirket:</strong> Hip Medya Dijital Yayıncılık ve Teknoloji A.Ş.</p>
            <p>
              <strong className="text-slate-800">E-posta:</strong>{' '}
              <a href="mailto:kvkk@kidsgourmet.com.tr" className="text-orange-500 hover:underline">
                kvkk@kidsgourmet.com.tr
              </a>
            </p>
            <p>
              <strong className="text-slate-800">Web:</strong>{' '}
              <a href="https://kidsgourmet.com.tr" className="text-orange-500 hover:underline">
                kidsgourmet.com.tr
              </a>
            </p>
            <p className="text-sm mt-4 bg-white border border-gray-200 rounded-lg p-4">
              <i className="fa-solid fa-info-circle text-blue-500 mr-2"></i>
              Haklarınızı kullanmak veya sorularınız için yukarıdaki iletişim bilgilerini kullanabilirsiniz.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
