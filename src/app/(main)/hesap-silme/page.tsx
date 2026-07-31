import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hesap ve Veri Silme Talebi | KidsGourmet',
  description:
    'KidsGourmet hesabınızı ve hesabınıza bağlı verileri nasıl silebileceğinizi veya belirli verilerinizin silinmesini nasıl talep edebileceğinizi öğrenin.',
};

const appDeletionSteps = [
  'KidsGourmet mobil uygulamasını açın.',
  'Hesabınıza giriş yapın.',
  'Profil ekranına gidin.',
  'Hesabımı Sil butonuna dokunun.',
  'Açılan onay penceresinde Hesabımı Sil seçeneğini onaylayın.',
];

const deletedData = [
  'Kullanıcı hesabı ve profil bilgileriniz',
  'Çocuk profilleri ve çocuk profillerine bağlı kayıtlar',
  'Besin deneme kayıtları, büyüme ve takip kayıtları',
  'Favoriler, koleksiyonlar ve alışveriş listeleri',
  'Topluluk ve uygulama kullanımınıza bağlı kişisel kayıtlar',
];

const partialDeletionExamples = [
  'Çocuk profili kayıtları',
  'Favoriler ve koleksiyonlar',
  'Alışveriş listesi kayıtları',
  'Besin deneme ve takip kayıtları',
  'Profil fotoğrafı veya profil bilgileriniz',
];

export default function HesapSilmePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-orange-500 transition-colors">
              Ana Sayfa
            </Link>
            <span>/</span>
            <span className="text-gray-800">Hesap ve Veri Silme</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
            HESAP VE VERİ SİLME TALEBİ
          </h1>
          <div className="mt-4 text-sm text-gray-600 font-medium">Temmuz 2026</div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-10">
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-6">
            <h2 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
              <i className="fa-solid fa-circle-info" aria-hidden="true"></i>
              KidsGourmet hesap silme bilgisi
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Bu sayfa, KidsGourmet: Ebeveyn Rehberi mobil uygulamasında hesap silme ve
              hesap silmeden belirli verilerin silinmesini talep etme süreçlerini açıklar.
              KidsGourmet, HİP Medya tarafından işletilen bir ebeveyn rehberi ve çocuk
              beslenmesi platformudur.
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              1. Uygulama içinden hesap silme
            </h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              KidsGourmet hesabınızı mobil uygulama içinden silebilirsiniz. Hesap silme
              işlemini başlatmak için aşağıdaki adımları izleyin:
            </p>
            <div className="space-y-3">
              {appDeletionSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4"
                >
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              2. Hesap silindiğinde hangi veriler silinir?
            </h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              Hesap silme talebiniz işleme alındığında hesabınıza bağlı aşağıdaki veriler
              silinir veya anonim hale getirilir:
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              {deletedData.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4"
                >
                  <i
                    className="fa-solid fa-check text-red-500 mt-1"
                    aria-hidden="true"
                  ></i>
                  <p className="text-gray-700 leading-relaxed text-sm">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-yellow-50 border border-yellow-100 rounded-xl p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-3">
              3. Saklama süresi ve geri yükleme
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Hesap silme talebinizden sonra hesabınız silme sürecine alınır ve 30 gün
              içinde kalıcı olarak silinir. Bu süre içinde tekrar giriş yapmanız halinde
              hesabınızı geri yükleyebilirsiniz. Yasal yükümlülükler kapsamında saklanması
              gereken sınırlı kayıtlar, ilgili mevzuatta öngörülen süre boyunca saklanabilir.
            </p>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              4. Hesabı silmeden belirli verilerin silinmesini talep etme
            </h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              Hesabınızı tamamen silmek istemiyorsanız, yalnızca belirli verilerinizin
              silinmesini veya anonim hale getirilmesini talep edebilirsiniz. Örneğin:
            </p>
            <ul className="grid md:grid-cols-2 gap-3 mb-6">
              {partialDeletionExamples.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700"
                >
                  <i
                    className="fa-solid fa-circle-minus text-orange-500 mt-0.5"
                    aria-hidden="true"
                  ></i>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-600 leading-relaxed">
              Bu talep için kayıtlı e-posta adresinizden aşağıdaki iletişim adresine
              ulaşabilirsiniz. Talebinizde hangi verilerin silinmesini istediğinizi açıkça
              belirtmeniz yeterlidir.
            </p>
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">5. E-posta ile talep gönderme</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Hesap silme veya veri silme talebinizi kayıtlı e-posta adresiniz üzerinden
                bize iletebilirsiniz.
              </p>
              <div className="rounded-xl bg-white border border-gray-200 p-5">
                <p className="text-sm text-gray-500 mb-1">E-posta adresi</p>
                <a
                  href="mailto:iletisim@kidsgourmet.com.tr?subject=KidsGourmet%20Hesap%20ve%20Veri%20Silme%20Talebi"
                  className="font-bold text-orange-600 hover:text-orange-700 transition-colors"
                >
                  iletisim@kidsgourmet.com.tr
                </a>
              </div>
              <p>
                E-posta başlığı olarak “KidsGourmet Hesap ve Veri Silme Talebi” yazabilir,
                mesajınızda hesap silme talebi mi yoksa belirli verilerin silinmesi talebi mi
                ilettiğinizi belirtebilirsiniz.
              </p>
            </div>
          </section>

          <section className="bg-blue-50 border border-blue-100 rounded-xl p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-3">6. Ek bilgi</h2>
            <p className="text-blue-900/80 leading-relaxed">
              Kişisel verilerinizin işlenmesi, saklanması ve haklarınız hakkında daha fazla
              bilgi almak için{' '}
              <Link href="/gizlilik-politikasi" className="font-bold underline">
                Gizlilik Politikası
              </Link>{' '}
              ve{' '}
              <Link href="/kvkk" className="font-bold underline">
                KVKK Aydınlatma Metni
              </Link>{' '}
              sayfalarını inceleyebilirsiniz.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
