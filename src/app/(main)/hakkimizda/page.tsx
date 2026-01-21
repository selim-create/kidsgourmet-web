import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hakkımızda | KidsGourmet',
  description: 'KidsGourmet hikayesi, misyonu, vizyonu ve değerleri. Bebek ve çocuk beslenmesinde güvenilir rehberiniz.',
};

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-orange-500 transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-gray-800">Hakkımızda</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Hakkımızda</h1>
          <p className="text-gray-600 mt-3">KidsGourmet’den Merhaba!</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        {/* Hikaye */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 flex items-center justify-center bg-orange-100 rounded-full text-orange-500">
              <i className="fa-solid fa-carrot text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">KidsGourmet Hikayesi</h2>
          </div>
          <div className="prose prose-slate max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              KidsGourmet, bebek ve çocuk beslenmesinde anne ve babalara güvenilir, bilimsel ve pratik rehberlik sunmak amacıyla hayata geçirilmiş bir platformdur.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Ebeveyn olmak muhteşem ama bir o kadar da zorlayıcı bir yolculuk. Özellikle bebeğinizin ve çocuğunuzun sağlıklı beslenmesini sağlamak, doğru bilgiye ulaşmak ve uygun tarifleri bulmak bazen bunaltıcı olabilir. İşte bu noktada KidsGourmet her zaman yanınızda!
            </p>
            <p className="text-gray-600 leading-relaxed">
              Uzman diyetisyen ve çocuk doktorlarının katkılarıyla hazırlanan içeriklerimiz, pratik tariflerimiz ve akıllı beslenme araçlarımızla çocuğunuzun her yaş döneminde ihtiyacı olan beslenme desteğini sağlıyoruz.
            </p>
          </div>
        </div>

        {/* Misyon & Vizyon */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl shadow-sm border border-orange-100 p-8">
            <div className="w-12 h-12 flex items-center justify-center bg-orange-500 rounded-xl text-white mb-4">
              <i className="fa-solid fa-bullseye text-xl"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Misyonumuz</h3>
            <p className="text-gray-600 leading-relaxed">
              Bebek ve çocukların sağlıklı beslenmesini desteklemek için ebeveynlere bilimsel ve güvenilir beslenme bilgisi sunuyor, pratik çözümler üretiyoruz.
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-sm border border-green-100 p-8">
            <div className="w-12 h-12 flex items-center justify-center bg-green-500 rounded-xl text-white mb-4">
              <i className="fa-solid fa-lightbulb text-xl"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Vizyonumuz</h3>
            <p className="text-gray-600 leading-relaxed">
              Türkiye'nin en güvenilir bebek ve çocuk beslenmesi platformu olmak amacıyla, her ailenin sağlıklı beslenme yolculuğuna eşlik etmek istiyoruz.
            </p>
          </div>
        </div>

        {/* Değerlerimiz */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Değerlerimiz</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-lg text-blue-500 shrink-0">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h4 className="font-bold text-slate-800">Güvenilirlik</h4>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-lg text-purple-500 shrink-0">
                <i className="fa-solid fa-flask"></i>
              </div>
              <h4 className="font-bold text-slate-800">Bilimsellik</h4>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-orange-100 rounded-lg text-orange-500 shrink-0">
                <i className="fa-solid fa-heart"></i>
              </div>
              <h4 className="font-bold text-slate-800">Empati</h4>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-lg text-green-500 shrink-0">
                <i className="fa-solid fa-users"></i>
              </div>
              <h4 className="font-bold text-slate-800">Topluluk</h4>
            </div>
          </div>
        </div>

        {/* Uzman Kadro */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-sm border border-green-100 p-8 md:p-12 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Uzmanlarımız</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            KidsGourmet'deki tarifler, beslenme içerikleri ve araçlar ulusal ve uluslararası sağlık oterite kaynaklarından yararlanır. Uzmanlarımız, çocuğunuzun sağlıklı büyümesi için bilimsel ve güncel bilgileri sizlere ulaştırır.
          </p>
          <Link 
            href="/uzmanlar"
            className="inline-flex items-center gap-2 bg-green-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-green-600 transition-colors shadow-sm"
          >
            <i className="fa-solid fa-user-doctor"></i>
            K&G Uzmanları
          </Link>
        </div>

        {/* Neden KidsGourmet */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Neden KidsGourmet?</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-check-circle text-orange-500 text-xl"></i>
              <h4 className="font-bold text-slate-800">Uzman Görüşleri</h4>
            </div>
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-check-circle text-orange-500 text-xl"></i>
              <h4 className="font-bold text-slate-800">Yaş Bazlı Tarifler</h4>
            </div>
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-check-circle text-orange-500 text-xl"></i>
              <h4 className="font-bold text-slate-800">Akıllı Beslenme Araçları</h4>
            </div>
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-check-circle text-orange-500 text-xl"></i>
              <h4 className="font-bold text-slate-800">Güçlü Topluluk</h4>
            </div>
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-check-circle text-orange-500 text-xl"></i>
              <h4 className="font-bold text-slate-800">Rejimde.com ve Tariften.com Desteği</h4>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}