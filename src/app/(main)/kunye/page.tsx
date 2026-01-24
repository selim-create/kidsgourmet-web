import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Künye | KidsGourmet',
  description: 'KidsGourmet site sahibi bilgileri, yayın kurulu ve iletişim bilgileri.',
};

export default function KunyePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-orange-500 transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-gray-800">Künye</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Künye</h1>
          <p className="text-gray-600 mt-3">KidsGourmet Künye Bilgileri</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-8">
          
          {/* Site Bilgileri */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Site Bilgileri</h2>
            <div className="space-y-3 text-gray-600">
              <div className="flex flex-col md:flex-row md:gap-4">
                <span className="font-semibold text-slate-700 md:w-48">Site Adı:</span>
                <span>KidsGourmet</span>
              </div>
              <div className="flex flex-col md:flex-row md:gap-4">
                <span className="font-semibold text-slate-700 md:w-48">Site URL:</span>
                <span>https://kidsgourmet.com.tr</span>
              </div>
              <div className="flex flex-col md:flex-row md:gap-4">
                <span className="font-semibold text-slate-700 md:w-48">Yayın Türü:</span>
                <span>Süreli Yayın (Web)</span>
              </div>
              <div className="flex flex-col md:flex-row md:gap-4">
                <span className="font-semibold text-slate-700 md:w-48">Yayın Dili:</span>
                <span>Türkçe</span>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Site Sahibi */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Site Sahibi</h2>
            <div className="space-y-3 text-gray-600">
              <div className="flex flex-col md:flex-row md:gap-4">
                <span className="font-semibold text-slate-700 md:w-48">Şirket:</span>
                <span>HİP Medya (Umut Kaan Özdemir)</span>
              </div>
              <div className="flex flex-col md:flex-row md:gap-4">
                <span className="font-semibold text-slate-700 md:w-48">Vergi Kimlik No:</span>
                <span>6810178450</span>
              </div>
              <div className="flex flex-col md:flex-row md:gap-4">
                <span className="font-semibold text-slate-700 md:w-48">Adres:</span>
                <span>Türkiye-İstanbul</span>
              </div>
              <div className="flex flex-col md:flex-row md:gap-4">
                <span className="font-semibold text-slate-700 md:w-48">Web Sitesi:</span>
                <span>
                  <a href="https://www.hipmedya.com" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">
                    www.hipmedya.com
                  </a>
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:gap-4">
                <span className="font-semibold text-slate-700 md:w-48">Marka:</span>
                <span>KidsGourmet bir HİP medya markasıdır.</span>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Yayın-Yönetim */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Yayın-Yönetim</h2>
            <div className="space-y-3 text-gray-600">
              <div className="flex flex-col md:flex-row md:gap-4">
                <span className="font-semibold text-slate-700 md:w-48">İmtiyaz Sahibi:</span>
                <span>Umut Kaan Özdemir</span>
              </div>
              <div className="flex flex-col md:flex-row md:gap-4">
                <span className="font-semibold text-slate-700 md:w-48">Genel Yayın Yönetmeni:</span>
                <span>Uzman Ebe-Hemşire Yeliz Toplar Eken</span>
              </div>
              <div className="flex flex-col md:flex-row md:gap-4">
                <span className="font-semibold text-slate-700 md:w-48">Yazarlar:</span>
                <span>
                  <Link href="/uzmanlar" className="text-orange-500 hover:underline">
                    Uzmanlarımız
                  </Link>
                </span>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Hosting ve Teknik */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Teknik Alt Yapı</h2>
            <div className="space-y-3 text-gray-600">
              <div className="flex flex-col md:flex-row md:gap-4">
                <span className="font-semibold text-slate-700 md:w-48">Hosting:</span>
                <span>Hostinger - Türkiye</span>
              </div>
              <div className="flex flex-col md:flex-row md:gap-4">
                <span className="font-semibold text-slate-700 md:w-48">Domain:</span>
                <span>İxir Host - Türkiye</span>
              </div>
              <div className="flex flex-col md:flex-row md:gap-4">
                <span className="font-semibold text-slate-700 md:w-48">Teknoloji:</span>
                <span>Next.js, React, TypeScript</span>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* İletişim */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">İletişim Bilgileri</h2>
            <div className="space-y-3 text-gray-600">
              <div className="flex flex-col md:flex-row md:gap-4">
                <span className="font-semibold text-slate-700 md:w-48">Telefon:</span>
                <span>
                  <a href="tel:08504501105" className="text-orange-500 hover:underline">
                    0850 450 11 05
                  </a>
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:gap-4">
                <span className="font-semibold text-slate-700 md:w-48">E-posta:</span>
                <span>
                  <a href="mailto:iletisim@kidsgourmet.com.tr" className="text-orange-500 hover:underline">
                    iletisim@kidsgourmet.com.tr
                  </a>
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:gap-4">
                <span className="font-semibold text-slate-700 md:w-48">İletişim Formu:</span>
                <span>
                  <Link href="/iletisim" className="text-orange-500 hover:underline">
                    İletişim Sayfası
                  </Link>
                </span>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Ekosistem */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Ekosistem</h2>
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://rejimde.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Rejimde.com
              </a>
              <a 
                href="https://tariften.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                Tariften.com
              </a>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Yasal Bildirimler ve Uyarılar */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Yasal Bildirimler ve Uyarılar</h2>
            <div className="space-y-4 text-gray-600">
              <div>
                <p className="mb-2">
                  <strong className="text-slate-700">1. Tıbbi Sorumluluk Reddi:</strong>
                </p>
                <p className="leading-relaxed">
                  KidsGourmet platformunda yer alan tüm içerikler, tarifler ve akıllı hesaplama araçları (Aşı Takvimi, Persentil vb.) yalnızca bilgilendirme amaçlıdır. Sitemizde sunulan bilgiler bir hekimin tıbbi tavsiyesi, teşhisi veya tedavisi yerine geçmez. Herhangi bir uygulamadan önce mutlaka uzman bir doktora danışınız.
                </p>
              </div>
              <div>
                <p className="mb-2">
                  <strong className="text-slate-700">2. Fikri Mülkiyet Hakları:</strong>
                </p>
                <p className="leading-relaxed">
                  Sitede yayınlanan tüm metin, fotoğraf, video ve yazılım kodları Fikir ve Sanat Eserleri Kanunu (FSEK) uyarınca korunmaktadır. KidsGourmet&apos;in yazılı izni olmaksızın içeriklerin kısmen veya tamamen kopyalanması, başka platformlarda yayınlanması yasaktır.
                </p>
              </div>
              <div>
                <p className="mb-2">
                  <strong className="text-slate-700">3. Yer Sağlayıcı Bildirimi:</strong>
                </p>
                <p className="leading-relaxed">
                  Kids Gourmet, 5651 sayılı &quot;İnternet Ortamında Yapılan Yayınların Düzenlenmesi ve Bu Yayınlar Yoluyla İşlenen Suçlarla Mücadele Edilmesi Hakkında Kanun&quot; kapsamında &quot;İçerik Sağlayıcı&quot; ve kullanıcı yorumları bakımından &quot;Yer Sağlayıcı&quot; olarak faaliyet göstermektedir.
                </p>
              </div>
              <div>
                <p className="mb-2">
                  <strong className="text-slate-700">4. Uyar-Kaldır Prensibi:</strong>
                </p>
                <p className="leading-relaxed">
                  Sitemizde telif haklarını veya kişilik haklarını ihlal ettiğini düşündüğünüz bir içerik varsa, lütfen iletisim@kidsgourmet.com.tr adresi üzerinden bizimle iletişime geçiniz. Bildiriminiz en geç 48 saat içerisinde incelenerek yasal gereği yapılacaktır.
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