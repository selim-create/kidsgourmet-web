import { Metadata } from 'next';
import Link from 'next/link';
import { recipeService } from '@/services/recipe-service';
import RecipeCard from '@/components/ui/RecipeCard';

export const metadata: Metadata = {
  title: '6-12 Ay Bebek Yemekleri | KidsGourmet',
  description: '6-12 aylık bebekler için özel olarak hazırlanmış sağlıklı ve besleyici tarif önerileri. Püre, parmak yiyecek ve BLW tarifleri.',
  keywords: '6-12 ay bebek yemekleri, bebek tarifleri, ek gıda tarifleri, bebek püreleri, BLW tarifleri',
  openGraph: {
    title: '6-12 Ay Bebek Yemekleri | KidsGourmet',
    description: '6-12 aylık bebekler için özel olarak hazırlanmış sağlıklı ve besleyici tarif önerileri.',
    url: 'https://kidsgourmet.com.tr/06-12-ay-yemek',
    siteName: 'KidsGourmet',
    type: 'website',
    images: [
      {
        url: 'https://kidsgourmet.com.tr/og-image-6-12-ay.jpg',
        width: 1200,
        height: 630,
        alt: '6-12 Ay Bebek Yemekleri',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '6-12 Ay Bebek Yemekleri | KidsGourmet',
    description: '6-12 aylık bebekler için özel olarak hazırlanmış sağlıklı ve besleyici tarif önerileri.',
    images: ['https://kidsgourmet.com.tr/og-image-6-12-ay.jpg'],
  },
  alternates: {
    canonical: 'https://kidsgourmet.com.tr/06-12-ay-yemek',
  },
};

export default async function Recipes6To12MonthsPage() {
  // Fetch recipes for 6-12 months age group
  const recipesData = await recipeService.getAll({
    ageGroup: '6-8-ay-baslangic,9-11-ay-kesif', // Burayı güncelledik
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
            name: '6-12 Ay Bebek Yemekleri',
            item: 'https://kidsgourmet.com.tr/06-12-ay-yemek',
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: '6-12 Ay Bebek Yemekleri',
        description: '6-12 aylık bebekler için özel olarak hazırlanmış sağlıklı ve besleyici tarif önerileri.',
        url: 'https://kidsgourmet.com.tr/06-12-ay-yemek',
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
              <li className="font-medium text-slate-800">6-12 Ay Bebek Yemekleri</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="bg-white rounded-[2rem] p-8 md:p-12 mb-8 border border-gray-100 shadow-sm">
            <div className="max-w-3xl">
              <h1 className="font-display font-bold text-3xl md:text-4xl text-slate-800 mb-4">
                6-12 Ay Bebek Yemekleri
              </h1>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Bebeğinizin ek gıdaya başladığı bu özel dönem için hazırlanmış, yaşına uygun tarifler. 
                Püre, parmak yiyecek ve BLW (Baby-Led Weaning) yöntemiyle hazırlayabileceğiniz, 
                besin değeri yüksek tarifler ile bebeğinizin gelişimini destekleyin.
              </p>
              
              {/* Age Info */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-xl">
                  <i className="fa-solid fa-baby text-orange-500"></i>
                  <span className="text-sm font-medium text-slate-800">6-12 Ay</span>
                </div>
                <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl">
                  <i className="fa-solid fa-utensils text-green-500"></i>
                  <span className="text-sm font-medium text-slate-800">{recipes.length} Tarif</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl">
                  <i className="fa-solid fa-user-doctor text-blue-500"></i>
                  <span className="text-sm font-medium text-slate-800">Uzman Onaylı</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link 
              href="/kesfet/ek-gidaya-giris" 
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500">
                  <i className="fa-solid fa-book-open text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 mb-1 group-hover:text-orange-500 transition-colors">
                    Ek Gıdaya Giriş Rehberi
                  </h3>
                  <p className="text-xs text-gray-500">Ek gıdaya başlama sürecini öğrenin</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/akilli-asistan/blw-testi" 
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500">
                  <i className="fa-solid fa-baby text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 mb-1 group-hover:text-orange-500 transition-colors">
                    BLW Hazırlık Testi
                  </h3>
                  <p className="text-xs text-gray-500">Bebeğiniz BLW için hazır mı?</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/beslenme-rehberi" 
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-500">
                  <i className="fa-solid fa-apple-whole text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 mb-1 group-hover:text-orange-500 transition-colors">
                    Beslenme Rehberi
                  </h3>
                  <p className="text-xs text-gray-500">Malzeme ve besin değerleri</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Recipes Grid */}
          {recipes.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <i className="fa-solid fa-bowl-food text-5xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">Bu kategoride henüz tarif bulunmamaktadır.</p>
            </div>
          ) : (
            <>
              <h2 className="font-bold text-2xl text-slate-800 mb-6">
                Tüm Tarifler <span className="text-orange-500">({recipes.length})</span>
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
              6-12 Ay Bebek Beslenmesi Hakkında
            </h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-gray-600 leading-relaxed mb-4">
                6-12 ay arası dönem, bebeğinizin ek gıdaya başladığı ve yeni tatlar keşfettiği heyecan verici bir süreçtir. 
                Bu dönemde bebeğinize sunacağınız yiyecekler, gelişimi ve sağlıklı beslenme alışkanlıkları kazanması açısından 
                büyük önem taşır.
              </p>
              <h3 className="font-bold text-xl text-slate-800 mb-3 mt-6">Ek Gıdaya Başlama</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Dünya Sağlık Örgütü ve Türk Pediatri Derneği, bebeğinizin ek gıdaya 6. aydan itibaren başlamasını önerir. 
                İlk aylarda püre kıvamında yiyeceklerle başlayabilir, zamanla parmak yiyeceklere ve BLW yöntemine geçiş yapabilirsiniz.
              </p>
              <h3 className="font-bold text-xl text-slate-800 mb-3 mt-6">Nelere Dikkat Edilmeli?</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Yeni bir besini 3-5 gün boyunca tek başına vererek alerji takibi yapın</li>
                <li>Besinleri tuz, şeker ve baharatlar eklemeden sunun</li>
                <li>Her öğünde farklı besin gruplarından seçimler yapın</li>
                <li>Bebeğinizin işaretlerine dikkat edin ve zorlamayın</li>
                <li>8. aydan itibaren parmak yiyecekleri denemeye başlayın</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
