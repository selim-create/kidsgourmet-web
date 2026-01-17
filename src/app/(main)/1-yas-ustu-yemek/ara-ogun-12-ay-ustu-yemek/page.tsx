import { Metadata } from 'next';
import Link from 'next/link';
import { recipeService } from '@/services/recipe-service';
import RecipeCard from '@/components/ui/RecipeCard';

export const metadata: Metadata = {
  title: '12 Ay Üstü Ara Öğün Tarifleri | KidsGourmet',
  description: '12 ay ve üzeri çocuklar için sağlıklı ara öğün tarifleri. Atıştırmalıklar, kurabiyeler, kekler ve smoothie tarifleri.',
  keywords: '12 ay üstü ara öğün, çocuk atıştırmalıkları, sağlıklı kurabiye, çocuk keki, ara öğün tarifleri',
  openGraph: {
    title: '12 Ay Üstü Ara Öğün Tarifleri | KidsGourmet',
    description: '12 ay ve üzeri çocuklar için sağlıklı ara öğün tarifleri.',
    url: 'https://kidsgourmet.com.tr/1-yas-ustu-yemek/ara-ogun-12-ay-ustu-yemek',
    siteName: 'KidsGourmet',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '12 Ay Üstü Ara Öğün Tarifleri | KidsGourmet',
    description: '12 ay ve üzeri çocuklar için sağlıklı ara öğün tarifleri.',
  },
  alternates: {
    canonical: 'https://kidsgourmet.com.tr/1-yas-ustu-yemek/ara-ogun-12-ay-ustu-yemek',
  },
};

export default async function Snacks12PlusPage() {
  // Fetch snack recipes for 12+ months
  const recipesData = await recipeService.getAll({
    ageGroup: '12-ay-ustu',
    mealType: 'ara-ogun',
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
            name: '1 Yaş Üstü Yemekler',
            item: 'https://kidsgourmet.com.tr/1-yas-ustu-yemek',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Ara Öğün Tarifleri',
            item: 'https://kidsgourmet.com.tr/1-yas-ustu-yemek/ara-ogun-12-ay-ustu-yemek',
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: '12 Ay Üstü Ara Öğün Tarifleri',
        description: '12 ay ve üzeri çocuklar için sağlıklı ara öğün tarifleri.',
        url: 'https://kidsgourmet.com.tr/1-yas-ustu-yemek/ara-ogun-12-ay-ustu-yemek',
        numberOfItems: recipes.length,
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
              <li><Link href="/1-yas-ustu-yemek" className="hover:text-orange-500">1 Yaş Üstü Yemekler</Link></li>
              <li><i className="fa-solid fa-chevron-right text-xs text-gray-300"></i></li>
              <li className="font-medium text-slate-800">Ara Öğün Tarifleri</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="bg-white rounded-[2rem] p-8 md:p-12 mb-8 border border-gray-100 shadow-sm">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center text-green-600 flex-shrink-0">
                <i className="fa-solid fa-cookie-bite text-3xl"></i>
              </div>
              <div className="flex-1">
                <h1 className="font-display font-bold text-3xl md:text-4xl text-slate-800 mb-4">
                  12 Ay Üstü Ara Öğün Tarifleri
                </h1>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  12 ay ve üzeri çocuklarınız için hazırlanmış, sağlıklı ve lezzetli ara öğün tarifleri. 
                  Atıştırmalıklar, kurabiyeler, kekler ve smoothie tarifleri ile çocuğunuzun enerji seviyesini dengede tutun.
                </p>
                
                {/* Stats */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl">
                    <i className="fa-solid fa-cookie text-green-500"></i>
                    <span className="text-sm font-medium text-slate-800">{recipes.length} Ara Öğün Tarifi</span>
                  </div>
                  <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-xl">
                    <i className="fa-solid fa-child text-orange-500"></i>
                    <span className="text-sm font-medium text-slate-800">12+ Ay</span>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl">
                    <i className="fa-solid fa-heart text-blue-500"></i>
                    <span className="text-sm font-medium text-slate-800">Sağlıklı & Pratik</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link 
              href="/1-yas-ustu-yemek/ana-ogun-12-ay-ustu-yemek" 
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                  <i className="fa-solid fa-bowl-rice text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 mb-1 group-hover:text-orange-500 transition-colors">
                    Ana Öğün Tarifleri
                  </h3>
                  <p className="text-xs text-gray-500">Doyurucu öğünler</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/1-yas-ustu-yemek" 
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500">
                  <i className="fa-solid fa-arrow-left text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 mb-1 group-hover:text-orange-500 transition-colors">
                    Tüm 1 Yaş+ Tarifler
                  </h3>
                  <p className="text-xs text-gray-500">Ana kategoriye dön</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/akilli-asistan/su-ihtiyaci" 
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-500">
                  <i className="fa-solid fa-droplet text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 mb-1 group-hover:text-orange-500 transition-colors">
                    Su İhtiyacı Hesaplayıcı
                  </h3>
                  <p className="text-xs text-gray-500">Günlük su ihtiyacı</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Recipes Grid */}
          {recipes.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <i className="fa-solid fa-cookie-bite text-5xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 mb-4">Bu kategoride henüz tarif bulunmamaktadır.</p>
              <Link href="/1-yas-ustu-yemek" className="text-orange-500 hover:underline font-medium">
                Tüm 1 Yaş+ Tarifler
              </Link>
            </div>
          ) : (
            <>
              <h2 className="font-bold text-2xl text-slate-800 mb-6">
                Tüm Ara Öğün Tarifleri <span className="text-orange-500">({recipes.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </>
          )}

          {/* SEO Content */}
          <div className="mt-12 bg-white rounded-2xl p-8 border border-gray-100">
            <h2 className="font-bold text-2xl text-slate-800 mb-4">
              Sağlıklı Ara Öğün Beslenmesi
            </h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-gray-600 leading-relaxed mb-4">
                12 ay ve üzeri çocuklar için ara öğünler, ana öğünler arasında enerji seviyesini dengede tutmak 
                ve günlük besin ihtiyacını tamamlamak açısından önemlidir. Sağlıklı ara öğünler seçmek, 
                çocuğunuzun uzun vadede sağlıklı beslenme alışkanlıkları kazanmasına yardımcı olur.
              </p>
              
              <h3 className="font-bold text-xl text-slate-800 mb-3 mt-6">Ara Öğün Zamanlaması</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Ana öğünler arasında 2-3 saat arayla ara öğün verin. Genellikle sabah 10-11 arası ve 
                öğleden sonra 15-16 arası ara öğün için ideal zamanlardır.
              </p>

              <h3 className="font-bold text-xl text-slate-800 mb-3 mt-6">Sağlıklı Ara Öğün Seçenekleri</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li>Taze meyve dilimleri veya meyve püresi</li>
                <li>Sebze çubukları ile humus veya yoğurt sosu</li>
                <li>Tam buğday kurabiyeler veya galeta</li>
                <li>Peynir küpleri ve ceviz içi</li>
                <li>Ev yapımı smoothie veya meyve suyu</li>
                <li>Ev yapımı kek veya muffin (az şekerli)</li>
              </ul>

              <h3 className="font-bold text-xl text-slate-800 mb-3 mt-6">Kaçınılması Gerekenler</h3>
              <p className="text-gray-600 leading-relaxed">
                İşlenmiş atıştırmalıklar, şekerli bisküviler, gazlı içecekler ve aşırı tuzlu gıdalardan 
                kaçınmaya özen gösterin. Doğal, az işlenmiş ve besleyici seçenekleri tercih edin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
