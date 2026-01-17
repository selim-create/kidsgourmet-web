import { Metadata } from 'next';
import Link from 'next/link';
import { recipeService } from '@/services/recipe-service';
import RecipeCard from '@/components/ui/RecipeCard';

export const metadata: Metadata = {
  title: '12 Ay Üstü Ana Öğün Tarifleri | KidsGourmet',
  description: '12 ay ve üzeri çocuklar için besleyici ve lezzetli ana öğün tarifleri. Kahvaltı, öğle ve akşam yemekleri için sağlıklı tarifler.',
  keywords: '12 ay üstü ana öğün, çocuk kahvaltısı, çocuk öğle yemeği, çocuk akşam yemeği, ana öğün tarifleri',
  openGraph: {
    title: '12 Ay Üstü Ana Öğün Tarifleri | KidsGourmet',
    description: '12 ay ve üzeri çocuklar için besleyici ve lezzetli ana öğün tarifleri.',
    url: 'https://kidsgourmet.com.tr/1-yas-ustu-yemek/ana-ogun-12-ay-ustu-yemek',
    siteName: 'KidsGourmet',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '12 Ay Üstü Ana Öğün Tarifleri | KidsGourmet',
    description: '12 ay ve üzeri çocuklar için besleyici ve lezzetli ana öğün tarifleri.',
  },
  alternates: {
    canonical: 'https://kidsgourmet.com.tr/1-yas-ustu-yemek/ana-ogun-12-ay-ustu-yemek',
  },
};

export default async function MainMeals12PlusPage() {
  // Fetch main meal recipes for 12+ months
  const recipesData = await recipeService.getAll({
    ageGroup: '12-ay-ustu',
    mealType: 'ana-ogun',
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
            name: 'Ana Öğün Tarifleri',
            item: 'https://kidsgourmet.com.tr/1-yas-ustu-yemek/ana-ogun-12-ay-ustu-yemek',
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: '12 Ay Üstü Ana Öğün Tarifleri',
        description: '12 ay ve üzeri çocuklar için besleyici ve lezzetli ana öğün tarifleri.',
        url: 'https://kidsgourmet.com.tr/1-yas-ustu-yemek/ana-ogun-12-ay-ustu-yemek',
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
              <li className="font-medium text-slate-800">Ana Öğün Tarifleri</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="bg-white rounded-[2rem] p-8 md:p-12 mb-8 border border-gray-100 shadow-sm">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center text-orange-600 flex-shrink-0">
                <i className="fa-solid fa-bowl-rice text-3xl"></i>
              </div>
              <div className="flex-1">
                <h1 className="font-display font-bold text-3xl md:text-4xl text-slate-800 mb-4">
                  12 Ay Üstü Ana Öğün Tarifleri
                </h1>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  12 ay ve üzeri çocuklarınız için hazırlanmış, besleyici ve doyurucu ana öğün tarifleri. 
                  Kahvaltıdan akşam yemeğine kadar günün her öğünü için sağlıklı ve lezzetli seçenekler.
                </p>
                
                {/* Stats */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-xl">
                    <i className="fa-solid fa-utensils text-orange-500"></i>
                    <span className="text-sm font-medium text-slate-800">{recipes.length} Ana Öğün Tarifi</span>
                  </div>
                  <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl">
                    <i className="fa-solid fa-child text-green-500"></i>
                    <span className="text-sm font-medium text-slate-800">12+ Ay</span>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl">
                    <i className="fa-solid fa-heart text-blue-500"></i>
                    <span className="text-sm font-medium text-slate-800">Besleyici & Lezzetli</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link 
              href="/1-yas-ustu-yemek/ara-ogun-12-ay-ustu-yemek" 
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-500">
                  <i className="fa-solid fa-cookie-bite text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 mb-1 group-hover:text-orange-500 transition-colors">
                    Ara Öğün Tarifleri
                  </h3>
                  <p className="text-xs text-gray-500">Sağlıklı atıştırmalıklar</p>
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
              href="/beslenme-rehberi" 
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                  <i className="fa-solid fa-book-open text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 mb-1 group-hover:text-orange-500 transition-colors">
                    Beslenme Rehberi
                  </h3>
                  <p className="text-xs text-gray-500">Yaş gruplarına göre rehber</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Recipes Grid */}
          {recipes.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <i className="fa-solid fa-bowl-food text-5xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 mb-4">Bu kategoride henüz tarif bulunmamaktadır.</p>
              <Link href="/1-yas-ustu-yemek" className="text-orange-500 hover:underline font-medium">
                Tüm 1 Yaş+ Tarifler
              </Link>
            </div>
          ) : (
            <>
              <h2 className="font-bold text-2xl text-slate-800 mb-6">
                Tüm Ana Öğün Tarifleri <span className="text-orange-500">({recipes.length})</span>
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
              Ana Öğün Beslenmesi
            </h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-gray-600 leading-relaxed mb-4">
                12 ay ve üzeri çocuklar için ana öğünler, günlük enerji ve besin ihtiyacının büyük kısmını karşılar. 
                Bu yaşta çocuğunuz dengeli bir kahvaltı, öğle yemeği ve akşam yemeği tüketmelidir.
              </p>
              
              <h3 className="font-bold text-xl text-slate-800 mb-3 mt-6">Dengeli Tabak</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Ana öğünlerde protein, karmaşık karbonhidrat, sağlıklı yağlar ve bol miktarda sebze bulundurmaya özen gösterin. 
                Her öğünde farklı renklerde besinler sunarak çocuğunuzun çeşitli vitamin ve mineraller almasını sağlayın.
              </p>

              <h3 className="font-bold text-xl text-slate-800 mb-3 mt-6">Öğün Planı</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li><strong>Kahvaltı:</strong> Protein (yumurta, peynir), tam tahıllı ekmek, meyve</li>
                <li><strong>Öğle Yemeği:</strong> Sebzeli yemek, protein kaynağı, pilav/makarna</li>
                <li><strong>Akşam Yemeği:</strong> Çorba, ana yemek, salata, yoğurt</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
