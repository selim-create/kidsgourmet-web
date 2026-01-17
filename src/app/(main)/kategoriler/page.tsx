import { Metadata } from 'next';
import Link from 'next/link';
import { blogService } from '@/services/blog-service';

export const metadata: Metadata = {
  title: 'Tüm Kategoriler | KidsGourmet',
  description: 'KidsGourmet blog kategorileri. Hamilelik, bebek bakımı, çocuk sağlığı, beslenme, psikoloji ve daha fazlası hakkında uzman yazıları.',
  keywords: 'blog kategorileri, hamilelik, bebek bakımı, çocuk sağlığı, çocuk beslenmesi, çocuk psikolojisi',
  openGraph: {
    title: 'Tüm Kategoriler | KidsGourmet',
    description: 'KidsGourmet blog kategorileri. Hamilelik, bebek bakımı, çocuk sağlığı, beslenme ve daha fazlası.',
    url: 'https://kidsgourmet.com.tr/kategoriler',
    siteName: 'KidsGourmet',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tüm Kategoriler | KidsGourmet',
    description: 'KidsGourmet blog kategorileri.',
  },
  alternates: {
    canonical: 'https://kidsgourmet.com.tr/kategoriler',
  },
};

export default async function CategoriesPage() {
  // Fetch all categories
  let categories = [];
  try {
    categories = await blogService.getCategories();
  } catch (error) {
    console.error('Error fetching categories:', error);
  }

  // Predefined category icons and colors
  const categoryMeta: { [key: string]: { icon: string; color: string; bg: string } } = {
    'aile': { icon: 'fa-people-roof', color: 'text-pink-600', bg: 'bg-pink-50' },
    'hamilelik': { icon: 'fa-person-pregnant', color: 'text-purple-600', bg: 'bg-purple-50' },
    'bebek-bakimi': { icon: 'fa-baby-carriage', color: 'text-blue-600', bg: 'bg-blue-50' },
    'cocuk': { icon: 'fa-child', color: 'text-orange-600', bg: 'bg-orange-50' },
    'cocuk-sagligi': { icon: 'fa-heart-pulse', color: 'text-red-600', bg: 'bg-red-50' },
    'cocuk-beslenmesi': { icon: 'fa-apple-whole', color: 'text-green-600', bg: 'bg-green-50' },
    'etkinlik': { icon: 'fa-puzzle-piece', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    'haber': { icon: 'fa-newspaper', color: 'text-slate-600', bg: 'bg-slate-50' },
    'psikoloji': { icon: 'fa-brain', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    'cocuk-psikolojisi': { icon: 'fa-child-reaching', color: 'text-cyan-600', bg: 'bg-cyan-50' },
    'ergen-psikolojisi': { icon: 'fa-user-graduate', color: 'text-teal-600', bg: 'bg-teal-50' },
    'seyahat': { icon: 'fa-plane-departure', color: 'text-sky-600', bg: 'bg-sky-50' },
    'yasam': { icon: 'fa-sun', color: 'text-amber-600', bg: 'bg-amber-50' },
    'roportaj': { icon: 'fa-microphone', color: 'text-rose-600', bg: 'bg-rose-50' },
  };

  const getCategoryMeta = (slug: string) => {
    return categoryMeta[slug] || { icon: 'fa-folder', color: 'text-gray-600', bg: 'bg-gray-50' };
  };

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
            name: 'Kategoriler',
            item: 'https://kidsgourmet.com.tr/kategoriler',
          },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: 'Blog Kategorileri',
        description: 'KidsGourmet blog kategorileri',
        url: 'https://kidsgourmet.com.tr/kategoriler',
        numberOfItems: categories.length,
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
              <li className="font-medium text-slate-800">Kategoriler</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="bg-white rounded-[2rem] p-8 md:p-12 mb-8 border border-gray-100 shadow-sm">
            <div className="max-w-3xl">
              <h1 className="font-display font-bold text-3xl md:text-4xl text-slate-800 mb-4">
                Tüm Kategoriler
              </h1>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                Hamilelikten ergenliğe kadar ebeveynlik yolculuğunuzun her aşamasında size rehberlik edecek 
                içerikler. İhtiyacınız olan bilgilere kategori bazlı ulaşın.
              </p>
              
              <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-xl inline-flex">
                <i className="fa-solid fa-folder-open text-orange-500"></i>
                <span className="text-sm font-medium text-slate-800">{categories.length} Kategori</span>
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          {categories.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <i className="fa-solid fa-folder-open text-5xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">Kategoriler yükleniyor...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category: any) => {
                const meta = getCategoryMeta(category.slug);
                return (
                  <Link
                    key={category.id}
                    href={`/kesfet/kategori/${category.slug}`}
                    className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 ${meta.bg} rounded-xl flex items-center justify-center ${meta.color} group-hover:scale-110 transition-transform`}>
                        <i className={`fa-solid ${meta.icon} text-2xl`}></i>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-orange-500 transition-colors">
                          {category.name}
                        </h3>
                        {category.count > 0 && (
                          <p className="text-sm text-gray-500">
                            {category.count} yazı
                          </p>
                        )}
                        {category.description && (
                          <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                            {category.description}
                          </p>
                        )}
                      </div>
                      <i className="fa-solid fa-chevron-right text-gray-300 group-hover:text-orange-500 transition-colors"></i>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            <Link 
              href="/kesfet" 
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500">
                  <i className="fa-solid fa-compass text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 mb-1 group-hover:text-orange-500 transition-colors">
                    Keşfet
                  </h3>
                  <p className="text-xs text-gray-500">Tüm blog yazıları</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/uzmanlar" 
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-500">
                  <i className="fa-solid fa-user-doctor text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 mb-1 group-hover:text-orange-500 transition-colors">
                    Uzmanlarımız
                  </h3>
                  <p className="text-xs text-gray-500">Uzman yazarlarımız</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/topluluk" 
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                  <i className="fa-solid fa-users text-xl"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 mb-1 group-hover:text-orange-500 transition-colors">
                    Topluluk
                  </h3>
                  <p className="text-xs text-gray-500">Soru sor, deneyim paylaş</p>
                </div>
              </div>
            </Link>
          </div>

          {/* SEO Content */}
          <div className="mt-12 bg-white rounded-2xl p-8 border border-gray-100">
            <h2 className="font-bold text-2xl text-slate-800 mb-4">
              KidsGourmet Blog Kategorileri
            </h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-gray-600 leading-relaxed mb-4">
                KidsGourmet olarak, hamilelikten ergenlik dönemine kadar ebeveynlik yolculuğunuzun 
                her aşamasında size rehberlik edecek kapsamlı içerikler sunuyoruz. Uzman yazarlarımız 
                ve deneyimli ebeveynlerimiz tarafından hazırlanan içeriklerimiz, güncel bilimsel 
                araştırmalara dayanır ve pratik çözümler sunar.
              </p>
              
              <h3 className="font-bold text-xl text-slate-800 mb-3 mt-6">Neler Bulabilirsiniz?</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Hamilelik:</strong> Gebelik döneminde beslenme, sağlık ve hazırlık süreçleri</li>
                <li><strong>Bebek Bakımı:</strong> 0-12 ay arası bebek bakımı, uyku, emzirme ve gelişim</li>
                <li><strong>Çocuk Sağlığı:</strong> Aşı takvimi, hastalıklar, büyüme ve gelişim takibi</li>
                <li><strong>Çocuk Beslenmesi:</strong> Yaş gruplarına göre beslenme, tarifler ve öneriler</li>
                <li><strong>Psikoloji:</strong> Çocuk ve ergen psikolojisi, ebeveyn rehberliği</li>
                <li><strong>Etkinlik:</strong> Yaratıcı aktiviteler, oyunlar ve eğitici içerikler</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
