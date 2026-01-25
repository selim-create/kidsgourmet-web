import { Metadata } from 'next';
import Link from 'next/link';
import { recipeService } from '@/services/recipe-service';
import RecipeCard from '@/components/ui/RecipeCard';

export const metadata: Metadata = {
  title: '1 Yaş Üstü Çocuk Yemekleri | KidsGourmet',
  description: '12 ay ve üzeri çocuklar için sağlıklı ve lezzetli tarif önerileri. Ana öğün, ara öğün ve aile sofrasına geçiş tarifleri.',
  keywords: '1 yaş üstü yemekler, çocuk yemekleri, 12 ay üstü tarifler, aile sofrası, çocuk beslenmesi',
  openGraph: {
    title: '1 Yaş Üstü Çocuk Yemekleri | KidsGourmet',
    description: '12 ay ve üzeri çocuklar için sağlıklı ve lezzetli tarif önerileri.',
    url: 'https://kidsgourmet.com.tr/1-yas-ustu-yemek',
    siteName: 'KidsGourmet',
    type: 'website',
    images: [
      {
        url: 'https://kidsgourmet.com.tr/og-image-12-ay-ustu.jpg',
        width: 1200,
        height: 630,
        alt: '1 Yaş Üstü Çocuk Yemekleri',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '1 Yaş Üstü Çocuk Yemekleri | KidsGourmet',
    description: '12 ay ve üzeri çocuklar için sağlıklı ve lezzetli tarif önerileri.',
    images: ['https://kidsgourmet.com.tr/og-image-12-ay-ustu.jpg'],
  },
  alternates: {
    canonical: 'https://kidsgourmet.com.tr/1-yas-ustu-yemek',
  },
};

export default async function Recipes12PlusMonthsPage() {
  // 12-24 Ay ve 2 Yaş Üzeri gruplarını virgülle birleştirerek gönderiyoruz
  const recipesData = await recipeService.getAll({
    ageGroup: '12-24-ay-gecis,2-yas-ve-uzeri', // Burayı güncelledik
    perPage: 24,
    orderBy: 'date',
    order: 'desc',
  });

  const recipes = recipesData.recipes || [];

  // JSON-LD Structured Data
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Ana Sayfa',
            item: 'https://kidsgourmet.com.tr',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: '1 Yaş Üstü Çocuk Yemekleri',
            item: 'https://kidsgourmet.com.tr/1-yas-ustu-yemek',
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: '1 Yaş Üstü Çocuk Yemekleri',
        description: '12 ay ve üzeri çocuklar için sağlıklı ve lezzetli tarif önerileri.',
        url: 'https://kidsgourmet.com.tr/1-yas-ustu-yemek',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-orange-500">Ana Sayfa</Link></li>
              <li><i className="fa-solid fa-chevron-right text-xs text-gray-300"></i></li>
              <li className="font-medium text-slate-800">1 Yaş Üstü Çocuk Yemekleri</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-[2rem] p-8 md:p-12 mb-8 border border-orange-100 shadow-sm">
            <div className="max-w-3xl">
              <h1 className="font-display font-bold text-3xl md:text-4xl text-slate-800 mb-4">
                1 Yaş Üstü Çocuk Yemekleri
              </h1>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                12 ay ve üzeri çocuklar için özel olarak hazırlanmış, besleyici ve lezzetli tarifler. 
                Aile sofrasına geçiş döneminde çocuğunuzun sağlıklı beslenme alışkanlıkları kazanmasına 
                yardımcı olacak ana öğün ve ara öğün tarifleri.
              </p>
              
              {/* Age Info */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm">
                  <i className="fa-solid fa-child text-orange-500"></i>
                  <span className="text-sm font-medium text-slate-800">12+ Ay</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm">
                  <i className="fa-solid fa-utensils text-green-500"></i>
                  <span className="text-sm font-medium text-slate-800">Ana & Ara Öğün</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm">
                  <i className="fa-solid fa-people-group text-blue-500"></i>
                  <span className="text-sm font-medium text-slate-800">Aile Sofrası</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            
            {/* Ana Öğün */}
            <Link 
              href="/1-yas-ustu-yemek/ana-ogun-12-ay-ustu-yemek"
              className="group bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-bowl-rice text-2xl"></i>
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-2xl text-slate-800 mb-2 group-hover:text-orange-500 transition-colors">
                    Ana Öğün Tarifleri
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Kahvaltı, öğle ve akşam yemekleri için doyurucu ve besleyici ana öğün tarifleri. 
                    Çocuğunuzun günlük enerji ihtiyacını karşılayacak dengeli öğünler.
                  </p>
                  <div className="flex items-center gap-2 text-orange-500 font-medium">
                    <span>Tarifleri Keşfet</span>
                    <i className="fa-solid fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
                  </div>
                </div>
              </div>
            </Link>

            {/* Ara Öğün */}
            <Link 
              href="/1-yas-ustu-yemek/ara-ogun-12-ay-ustu-yemek"
              className="group bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-cookie-bite text-2xl"></i>
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-2xl text-slate-800 mb-2 group-hover:text-orange-500 transition-colors">
                    Ara Öğün Tarifleri
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Sağlıklı atıştırmalıklar, kurabiyeler, kekler ve smoothie tarifleri. 
                    Çocuğunuzun enerji seviyesini dengede tutacak hafif ara öğünler.
                  </p>
                  <div className="flex items-center gap-2 text-orange-500 font-medium">
                    <span>Tarifleri Keşfet</span>
                    <i className="fa-solid fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
                  </div>
                </div>
              </div>
            </Link>

          </div>

          {/* Featured Recipes */}
          {recipes.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-2xl text-slate-800">
                  Öne Çıkan Tarifler
                </h2>
                <Link 
                  href="/tarifler?age=12-ay-ustu" 
                  className="text-orange-500 hover:text-orange-600 font-medium text-sm"
                >
                  Tümünü Gör <i className="fa-solid fa-arrow-right ml-1"></i>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recipes.slice(0, 8).map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link 
              href="/beslenme-rehberi" 
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500">
                  <i className="fa-solid fa-book-open text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 mb-1 group-hover:text-orange-500 transition-colors">
                    Beslenme Rehberi
                  </h3>
                  <p className="text-xs text-gray-500">Yaş gruplarına göre beslenme önerileri</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/akilli-asistan/persentil" 
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                  <i className="fa-solid fa-chart-line text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 mb-1 group-hover:text-orange-500 transition-colors">
                    Persentil Hesaplayıcı
                  </h3>
                  <p className="text-xs text-gray-500">Çocuğunuzun gelişimini takip edin</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/topluluk" 
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500">
                  <i className="fa-solid fa-users text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 mb-1 group-hover:text-orange-500 transition-colors">
                    Topluluk
                  </h3>
                  <p className="text-xs text-gray-500">Diğer ebeveynlerle deneyim paylaşın</p>
                </div>
              </div>
            </Link>
          </div>

          {/* SEO Content */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            <h2 className="font-bold text-2xl text-slate-800 mb-4">
              1 Yaş Üzeri Çocuk Beslenmesi
            </h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-gray-600 leading-relaxed mb-4">
                12 ay ve sonrası, çocuğunuzun aile sofrasına geçiş yaptığı ve beslenme alışkanlıklarının 
                şekillenmeye başladığı kritik bir dönemdir. Bu yaşta çocuğunuz artık daha çeşitli yiyecekleri 
                deneyebilir ve aile bireyleriyle birlikte yemek yemeye başlayabilir.
              </p>
              
              <h3 className="font-bold text-xl text-slate-800 mb-3 mt-6">Aile Sofrasına Geçiş</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                1 yaş sonrasında çocuğunuz, ailenin yediği çoğu yiyeceği tüketebilir hale gelir. 
                Ancak yine de tuz, şeker ve yağ tüketimini sınırlı tutmak, işlenmiş gıdalardan kaçınmak önemlidir.
              </p>

              <h3 className="font-bold text-xl text-slate-800 mb-3 mt-6">Öğün Planlaması</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Günde 3 ana öğün ve 2-3 ara öğün planlayın</li>
                <li>Öğünlerde farklı besin gruplarından seçimler yapın</li>
                <li>Porsiyon kontrolüne dikkat edin, çocuğunuza göre ayarlayın</li>
                <li>Rengarenk tabaklar hazırlayarak yemek yemeyi eğlenceli hale getirin</li>
                <li>Düzenli öğün saatlerine özen gösterin</li>
              </ul>

              <h3 className="font-bold text-xl text-slate-800 mb-3 mt-6">Beslenme İpuçları</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Bu yaş grubunda çocuğunuzun sağlıklı beslenme alışkanlıkları kazanması için ailenin 
                örnek olması çok önemlidir. Ailenizle birlikte masa başında oturup, sağlıklı yiyecekleri 
                paylaşarak çocuğunuza olumlu bir rol model olabilirsiniz.
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
