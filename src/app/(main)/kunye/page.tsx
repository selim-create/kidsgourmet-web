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

          {/* Sahibi */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Site Sahibi</h2>
            <div className="space-y-3 text-gray-600">
              <div className="flex flex-col md:flex-row md:gap-4">
                <span className="font-semibold text-slate-700 md:w-48">Şirket:</span>
                <span>Hip Medya</span>
              </div>
              <div className="flex flex-col md:flex-row md:gap-4">
                <span className="font-semibold text-slate-700 md:w-48">Marka:</span>
                <span>KidsGourmet bir Hip Medya markasıdır</span>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Yayın Kurulu */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Yayın Kurulu</h2>
            <div className="space-y-3 text-gray-600">
              <div className="flex flex-col md:flex-row md:gap-4">
                <span className="font-semibold text-slate-700 md:w-48">İçerik Sorumlusu:</span>
                <span>KidsGourmet Editör Ekibi</span>
              </div>
              <div className="flex flex-col md:flex-row md:gap-4">
                <span className="font-semibold text-slate-700 md:w-48">Uzmanlarımız:</span>
                <span>
                  <Link href="/uzmanlar" className="text-orange-500 hover:underline">
                    Diyetisyen ve Doktorlarımızı Görüntüleyin
                  </Link>
                </span>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Hosting ve Teknik */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Teknik Altyapı</h2>
            <div className="space-y-3 text-gray-600">
              <div className="flex flex-col md:flex-row md:gap-4">
                <span className="font-semibold text-slate-700 md:w-48">Hosting:</span>
                <span>Türkiye</span>
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

          {/* Kardeş Siteler */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Kardeş Siteler</h2>
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