import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası | KidsGourmet',
  description: 'KidsGourmet gizlilik politikası, KVKK uyumu, kişisel veri işleme ve koruma politikası.',
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
          <p className="text-gray-600 mt-3">Kişisel verilerinizin korunması ve işlenmesi hakkında bilgiler</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-8">
          
          {/* KVKK Uyumu */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-shield-halved text-blue-500 text-2xl mt-1"></i>
              <div>
                <h3 className="font-bold text-slate-800 mb-2">KVKK ve GDPR Uyumlu</h3>
                <p className="text-sm text-gray-600">
                  Bu gizlilik politikası, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve 
                  Avrupa Birliği Genel Veri Koruma Yönetmeliği (GDPR) uyarınca hazırlanmıştır.
                </p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Giriş */}
          <div>
            <p className="text-gray-600 leading-relaxed">
              KidsGourmet olarak, kullanıcılarımızın gizliliğine saygı duyuyor ve kişisel verilerinizin korunmasına 
              büyük önem veriyoruz. Bu politika, hangi bilgilerin toplandığını, nasıl kullanıldığını ve nasıl 
              korunduğunu açıklar.
            </p>
          </div>

          <hr className="border-gray-200" />

          {/* Toplanan Veriler */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">1. Toplanan Kişisel Veriler</h2>
            <div className="space-y-4 text-gray-600">
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">Hesap Bilgileri:</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Ad, soyad</li>
                  <li>E-posta adresi</li>
                  <li>Kullanıcı adı</li>
                  <li>Profil fotoğrafı (isteğe bağlı)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">Kullanım Bilgileri:</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>IP adresi</li>
                  <li>Tarayıcı türü ve versiyonu</li>
                  <li>Ziyaret edilen sayfalar</li>
                  <li>Erişim tarihi ve saati</li>
                  <li>Yönlendiren URL</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">Çocuk Bilgileri (İsteğe Bağlı):</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Çocuğun yaşı veya doğum tarihi</li>
                  <li>Boy ve kilo bilgileri (büyüme takibi için)</li>
                  <li>Beslenme tercihleri ve alerjiler</li>
                </ul>
                <p className="text-sm mt-2 bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <i className="fa-solid fa-exclamation-circle text-orange-500 mr-2"></i>
                  Not: Çocuk bilgileri tamamen isteğe bağlıdır ve kişiselleştirilmiş deneyim sunmak için kullanılır.
                </p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Veri İşleme Amaçları */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">2. Veri İşleme Amaçları</h2>
            <div className="space-y-3 text-gray-600">
              <p className="leading-relaxed">Kişisel verileriniz aşağıdaki amaçlarla işlenir:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Hesap oluşturma ve kullanıcı kimlik doğrulama</li>
                <li>Platform hizmetlerinin sunulması</li>
                <li>Kişiselleştirilmiş içerik ve öneriler sunma</li>
                <li>İletişim kurma (bildirimler, bültenler, destek)</li>
                <li>Platformun geliştirilmesi ve iyileştirilmesi</li>
                <li>Güvenlik ve dolandırıcılık önleme</li>
                <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                <li>İstatistik ve analiz çalışmaları</li>
              </ul>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Veri Saklama */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">3. Veri Saklama Süreleri</h2>
            <div className="space-y-3 text-gray-600">
              <p className="leading-relaxed">
                Kişisel verileriniz, işlenme amacı için gerekli olan süre boyunca ve yasal saklama sürelerine 
                uygun olarak saklanır:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-slate-700">Hesap bilgileri:</strong> Hesabınız aktif olduğu sürece</li>
                <li><strong className="text-slate-700">İşlem kayıtları:</strong> Yasal saklama süreleri (genellikle 10 yıl)</li>
                <li><strong className="text-slate-700">Çerez verileri:</strong> Çerez politikasında belirtilen süreler</li>
                <li><strong className="text-slate-700">İletişim kayıtları:</strong> 3 yıl</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Hesabınızı sildiğinizde, kişisel verileriniz yasal yükümlülükler dışında kalıcı olarak silinir.
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Kullanıcı Hakları */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Kullanıcı Hakları (KVKK Madde 11)</h2>
            <div className="space-y-3 text-gray-600">
              <p className="leading-relaxed">KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <i className="fa-solid fa-check text-green-500 mr-2"></i>
                  Kişisel verilerinizin işlenip işlenmediğini öğrenme
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <i className="fa-solid fa-check text-green-500 mr-2"></i>
                  İşlenmişse bilgi talep etme
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <i className="fa-solid fa-check text-green-500 mr-2"></i>
                  İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <i className="fa-solid fa-check text-green-500 mr-2"></i>
                  Yurt içi/dışı aktarım bilgisi
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <i className="fa-solid fa-check text-green-500 mr-2"></i>
                  Eksik veya yanlış işlenmiş ise düzeltme talep etme
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <i className="fa-solid fa-check text-green-500 mr-2"></i>
                  Silinmesini veya yok edilmesini isteme
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <i className="fa-solid fa-check text-green-500 mr-2"></i>
                  Otomatik sistemlerle analiz edilmesine itiraz etme
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <i className="fa-solid fa-check text-green-500 mr-2"></i>
                  Kanuna aykırı işlemeden dolayı zararın giderilmesini talep etme
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Veri Güvenliği */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">5. Veri Güvenliği Önlemleri</h2>
            <div className="space-y-3 text-gray-600">
              <p className="leading-relaxed">
                Kişisel verilerinizin güvenliği için aşağıdaki teknik ve idari önlemleri alıyoruz:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>SSL/TLS şifreleme ile veri aktarımı</li>
                <li>Güvenli veri saklama ve yedekleme sistemleri</li>
                <li>Erişim kontrolü ve yetkilendirme</li>
                <li>Düzenli güvenlik güncellemeleri</li>
                <li>Güvenlik açığı taramaları</li>
                <li>Personel eğitimi ve gizlilik taahhütleri</li>
                <li>Veri kaybı önleme sistemleri</li>
              </ul>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Üçüncü Taraf Paylaşımları */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">6. Üçüncü Taraf Paylaşımları</h2>
            <div className="space-y-3 text-gray-600">
              <p className="leading-relaxed">
                Kişisel verileriniz aşağıdaki durumlarda üçüncü taraflarla paylaşılabilir:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong className="text-slate-700">Hizmet sağlayıcılar:</strong> Hosting, e-posta, analitik gibi hizmetler için</li>
                <li><strong className="text-slate-700">Yasal zorunluluk:</strong> Mahkeme kararı veya yasal süreçler gereği</li>
                <li><strong className="text-slate-700">İş ortakları:</strong> Açık rızanız ile pazarlama veya iş birliği için</li>
                <li><strong className="text-slate-700">Birleşme/devir:</strong> Şirket birleşmesi veya devir durumunda</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Üçüncü taraflarla paylaşılan veriler, gizlilik ve güvenlik yükümlülükleri içeren sözleşmelerle korunur.
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Çocukların Gizliliği */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">7. Çocukların Gizliliği</h2>
            <div className="space-y-3 text-gray-600">
              <p className="leading-relaxed">
                KidsGourmet, 18 yaşın altındaki kullanıcılardan ebeveyn veya vasi izni olmadan kişisel bilgi toplamaz. 
                Çocuklara ait bilgiler (yaş, boy, kilo) yalnızca ebeveyn hesapları üzerinden ve ebeveyn onayıyla işlenir.
              </p>
              <p className="leading-relaxed">
                Eğer 18 yaşın altında bir kullanıcının ebeveyn izni olmadan bilgi verdiğini fark ederseniz, 
                lütfen bizimle iletişime geçin.
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Çerezler */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">8. Çerezler</h2>
            <div className="space-y-3 text-gray-600">
              <p className="leading-relaxed">
                Platformumuzda kullanılan çerezler hakkında detaylı bilgi için{' '}
                <Link href="/cerez-politikasi" className="text-orange-500 hover:underline font-semibold">
                  Çerez Politikası
                </Link>{' '}
                sayfamızı ziyaret edin.
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Değişiklikler */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">9. Politika Değişiklikleri</h2>
            <div className="space-y-3 text-gray-600">
              <p className="leading-relaxed">
                Bu gizlilik politikası, yasal düzenlemeler ve platform güncellemeleri doğrultusunda değiştirilebilir. 
                Önemli değişiklikler e-posta veya platform bildirimleriyle duyurulacaktır.
              </p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* İletişim - Veri Sorumlusu */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">10. Veri Sorumlusu ve İletişim</h2>
            <div className="space-y-3 text-gray-600">
              <div className="bg-slate-50 rounded-xl p-6">
                <h4 className="font-bold text-slate-800 mb-3">Veri Sorumlusu:</h4>
                <p className="mb-2"><strong>Şirket:</strong> Hip Medya</p>
                <p className="mb-2"><strong>E-posta:</strong>{' '}
                  <a href="mailto:kvkk@kidsgourmet.com.tr" className="text-orange-500 hover:underline">
                    kvkk@kidsgourmet.com.tr
                  </a>
                </p>
                <p className="text-sm mt-4">
                  Haklarınızı kullanmak veya sorularınız için yukarıdaki iletişim bilgilerini kullanabilirsiniz.
                </p>
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
