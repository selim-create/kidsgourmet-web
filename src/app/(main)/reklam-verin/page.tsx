import Link from 'next/link';
import Image from 'next/image'; // Image eklendi
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reklam Verin | KidsGourmet - Sponsorluk & İş Birliği Fırsatları',
  description: 'KidsGourmet ile markanızı binlerce anne-baba ile buluşturun. Sponsorlu içerik, araç sponsorluğu ve display reklam çözümleriyle hedef kitlenize ulaşın.',
  openGraph: {
    title: 'Reklam Verin | KidsGourmet',
    description: 'KidsGourmet ile markanızı binlerce anne-baba ile buluşturun.',
    url: 'https://kidsgourmet.com.tr/reklam-verin',
    siteName: 'KidsGourmet',
    type: 'website',
  },
  alternates: {
    canonical: 'https://kidsgourmet.com.tr/reklam-verin',
  },
};

export default function ReklamVerinPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-400 py-16 md:py-24 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl -ml-32 -mb-32"></div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <nav className="flex items-center gap-2 text-sm text-white/80 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-white">Reklam Verin</span>
          </nav>
          
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Markanızı Binlerce <br className="hidden md:block" />
              <span className="text-yellow-200">Anne-Baba</span> ile Buluşturun
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              Bebek ve çocuk beslenmesinde Türkiye&apos;nin güvenilir platformu KidsGourmet ile hedef kitlenize doğrudan ulaşın. Sponsorlu içerikler, akıllı araç entegrasyonları ve display reklamlarla markanızı öne çıkarın.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="#sponsorluk-modelleri" 
                className="inline-flex items-center px-8 py-4 bg-white text-orange-500 font-bold rounded-2xl hover:bg-gray-100 transition-colors shadow-lg"
              >
                <i className="fa-solid fa-rocket mr-2"></i>
                Sponsorluk Modellerini İncele
              </Link>
              <Link 
                href="/iletisim?requestType=advertising" 
                className="inline-flex items-center px-8 py-4 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 transition-colors"
              >
                <i className="fa-solid fa-envelope mr-2"></i>
                Teklif İste
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">50K+</div>
              <div className="text-gray-600 text-sm">Aylık Ziyaretçi</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">25K+</div>
              <div className="text-gray-600 text-sm">Kayıtlı Üye</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">500+</div>
              <div className="text-gray-600 text-sm">Onaylı Tarif</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">15+</div>
              <div className="text-gray-600 text-sm">Akıllı Araç</div>
            </div>
          </div>
        </div>
      </div>

      {/* Neden KidsGourmet */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Neden KidsGourmet?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Anne-Baba ve Ebeveyn segmentine ulaşmak için en etkili ve güvenilir platform.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center text-2xl mb-6">
                <i className="fa-solid fa-bullseye"></i>
              </div>
              <h3 className="font-bold text-xl text-slate-800 mb-3">Doğru Hedefleme</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                0-6 yaş çocuk sahibi, bilinçli ve satın alma gücü yüksek anne-babalar!
                Bebek ürünleri, gıda, sağlık ve eğitim markalarınız için ideal hedef kitleyi oluşturur.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-2xl flex items-center justify-center text-2xl mb-6">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h3 className="font-bold text-xl text-slate-800 mb-3">Güvenilir Platform</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Uzman görüşleri ve bilimsel temelli beslenme önerileri!
                Markanız güvenilir bir ortamda konumlanır.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-2xl flex items-center justify-center text-2xl mb-6">
                <i className="fa-solid fa-chart-line"></i>
              </div>
              <h3 className="font-bold text-xl text-slate-800 mb-3">Ölçülebilir Sonuçlar</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                GAM entegrasyonu ile detaylı raporlama!
                Gösterim, tıklama ve dönüşüm metriklerini takip edebilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sponsorluk Modelleri */}
      <div id="sponsorluk-modelleri" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Sponsorluk Modelleri</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Markanıza ve kampanya hedeflerinize en uygun sponsorluk modelleri KidsGourmet’de!
            </p>
          </div>

          {/* Model 1: Sponsorlu İçerik */}
          <div className="mb-16">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 md:p-12 border border-amber-100">
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-full text-sm font-bold mb-6">
                    <i className="fa-solid fa-star mr-2"></i>
                    EN POPÜLER
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
                    Sponsorlu İçerik
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Markanızı editöryel içeriklerimizle birleştirin. Keşfet bölümünde ve ana sayfada öne çıkan sponsorlu yazılar, ürün incelemeleri ve marka hikayeleri.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className="fa-solid fa-check text-xs"></i>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">Sponsor Badge</span>
                        <p className="text-sm text-gray-500">Şeffaf &quot;Sponsorlu İçerik&quot; etiketi ile güvenilir gösterim</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className="fa-solid fa-check text-xs"></i>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">Logo & Marka Görünürlüğü</span>
                        <p className="text-sm text-gray-500">İçerik kartları ve detay sayfasında logonuz</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className="fa-solid fa-check text-xs"></i>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">CTA Alanı</span>
                        <p className="text-sm text-gray-500">İçerik sonunda özel call-to-action bölümü</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className="fa-solid fa-check text-xs"></i>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">Ana Sayfa Featured Slider</span>
                        <p className="text-sm text-gray-500">Premium görünürlük için slider alanı</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Preview Mockup */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="text-xs text-gray-400 mb-4">Görünüm Önizlemesi</div>
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-gradient-to-br from-blue-100 to-blue-200 mb-4">
                    <div className="absolute top-3 right-3 bg-amber-500 text-white px-2 py-1 rounded text-xs font-bold">
                      Sponsorlu
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <div className="text-white text-sm font-bold">Bebeklerde Ek Gıdaya Geçiş Rehberi</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">Logo</div>
                    <div>
                      <div className="text-xs text-gray-500"><span className="font-bold text-blue-600">Marka Adı</span> katkılarıyla</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Model 2: Araç Sponsorluğu */}
          <div className="mb-16">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 border border-purple-100">
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div className="order-2 lg:order-1">
                  {/* Preview Mockup */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="text-xs text-gray-400 mb-4">Akıllı Asistan - Araç Görünümü</div>
                    
                    <div className="bg-gradient-to-r from-teal-500 to-teal-400 rounded-xl p-4 text-white mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-bath"></i>
                          <span className="font-bold text-sm">Banyo Rutini Planlayıcı</span>
                        </div>
                        <span className="bg-amber-400 text-amber-900 px-2 py-0.5 rounded text-xs font-bold">Sponsorlu</span>
                      </div>
                      <p className="text-xs text-white/80">Bebeğiniz için kişiselleştirilmiş banyo rutini oluşturun</p>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">Logo</div>
                        <span className="text-xs text-gray-600"><strong>Marka</strong> katkılarıyla</span>
                      </div>
                      <button className="bg-teal-500 text-white px-3 py-1 rounded-lg text-xs font-bold">
                        Ürünleri Keşfet
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="order-1 lg:order-2">
                  <div className="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-full text-sm font-bold mb-6">
                    <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>
                    AKTİF KATILIM
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
                    Akıllı Araç Sponsorluğu
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    15+ akıllı aracımızdan birini sponsor olarak sahiplenin. Banyo Rutini Planlayıcı, Hijyen Hesaplayıcı, Bez Hesaplayıcı gibi araçlarda markanızı konumlandırın.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className="fa-solid fa-check text-xs"></i>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">Araç Header Sponsorluğu</span>
                        <p className="text-sm text-gray-500">Araç başlığında logo ve &quot;X katkılarıyla&quot; mesajı</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className="fa-solid fa-check text-xs"></i>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">CTA Butonu</span>
                        <p className="text-sm text-gray-500">&quot;Ürünleri Keşfet&quot; veya özel CTA ile yönlendirme</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className="fa-solid fa-check text-xs"></i>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">Sonuç Entegrasyonu</span>
                        <p className="text-sm text-gray-500">Hesaplama sonuçlarında ürün önerileri</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className="fa-solid fa-check text-xs"></i>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">Akıllı Asistan Ana Sayfa</span>
                        <p className="text-sm text-gray-500">Araç kartında öne çıkan sponsor görünümü</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sponsored Tools List */}
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-xs font-bold text-gray-500 mb-3">MEVCUT SPONSORLANABİLİR ARAÇLAR</div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">Banyo Rutini Planlayıcı</span>
                      <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">Hijyen Hesaplayıcı</span>
                      <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">Bez Hesaplayıcı</span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">Persentil Hesaplayıcı</span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">Su İhtiyacı</span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">+10 araç</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Model 3: Display Reklam */}
          <div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 md:p-12 border border-blue-100">
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-bold mb-6">
                    <i className="fa-solid fa-rectangle-ad mr-2"></i>
                    DISPLAY REKLAM
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
                    Banner & Display Reklamlar
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Google Ad Manager (GAM) entegrasyonu ile yönetilen, yüksek görünürlüklü reklam alanları.
                    Tarif sayfaları, keşfet bölümü ve akıllı araçlarda stratejik konumlandırma.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className="fa-solid fa-check text-xs"></i>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">Çoklu Format Desteği</span>
                        <p className="text-sm text-gray-500">Leaderboard, MPU, Native ve özel formatlar</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className="fa-solid fa-check text-xs"></i>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">GAM Raporlama</span>
                        <p className="text-sm text-gray-500">Detaylı gösterim, tıklama ve CTR raporları</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className="fa-solid fa-check text-xs"></i>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">Responsive Tasarım</span>
                        <p className="text-sm text-gray-500">Tüm cihazlarda optimize edilmiş görünüm</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Ad Placements */}
                  <div className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="text-xs font-bold text-gray-500 mb-3">REKLAM ALANLARI</div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <i className="fa-solid fa-check text-green-500"></i>
                        Tarif Detay Sayfası
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <i className="fa-solid fa-check text-green-500"></i>
                        Keşfet Listesi
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <i className="fa-solid fa-check text-green-500"></i>
                        Akıllı Araç Sonuçları
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <i className="fa-solid fa-check text-green-500"></i>
                        Topluluk Sayfası
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Preview Mockup */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="text-xs text-gray-400 mb-4">Reklam Yerleşimi Önizlemesi</div>
                  
                  {/* Leaderboard */}
                  <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg h-20 flex items-center justify-center mb-4 border-2 border-dashed border-gray-300">
                    <span className="text-gray-400 text-sm">Leaderboard (728x90)</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-3">
                      <div className="bg-gray-100 rounded h-32"></div>
                      <div className="bg-gray-100 rounded h-32"></div>
                    </div>
                    <div>
                      {/* MPU */}
                      <div className="bg-gradient-to-b from-blue-100 to-blue-200 rounded-lg h-[250px] flex items-center justify-center border-2 border-dashed border-blue-300">
                        <span className="text-blue-400 text-xs text-center">MPU<br />(300x250)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fiyatlandırma CTA */}
      <div className="py-16 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Size Özel Teklif Çalışalım
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Kampanya bütçenize ve hedeflemenize uygun özel paketler hazırlayalım.
            Medya kitimizi inceleyin, sorularınız olursa doğrudan bizimle iletişime geçin.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/iletisim?requestType=advertising" 
              className="inline-flex items-center px-8 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-colors"
            >
              <i className="fa-solid fa-envelope mr-2"></i>
              Teklif İste
            </Link>
            <a 
              href="mailto:reklam@kidsgourmet.com.tr" 
              className="inline-flex items-center px-8 py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-colors"
            >
              reklam@kidsgourmet.com.tr
            </a>
          </div>
        </div>
      </div>

      {/* İş Ortaklarımız */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Başarılı Markalar Bizimle Çalışıyor</h2>
            <p className="text-gray-500">Sektörün önde gelen markalarıyla geçmişten bugüne iş birliği yapıyoruz.</p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            
            {/* Dalin */}
            <div className="relative w-32 h-16 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
              <Image 
                src="https://api.kidsgourmet.com.tr/wp-content/uploads/2026/01/dalin.png" 
                alt="Dalin" 
                fill 
                className="object-contain" 
              />
            </div>

            {/* Dyson */}
            <div className="relative w-32 h-16 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
              <Image 
                src="https://api.kidsgourmet.com.tr/wp-content/uploads/2026/01/dyson.png" 
                alt="Dyson" 
                fill 
                className="object-contain" 
              />
            </div>

            {/* Sleepy */}
            <div className="relative w-32 h-16 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
              <Image 
                src="https://api.kidsgourmet.com.tr/wp-content/uploads/2026/01/sleepy.png" 
                alt="Sleepy" 
                fill 
                className="object-contain" 
              />
            </div>

            {/* Evolvia */}
            <div className="relative w-32 h-16 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
              <Image 
                src="https://api.kidsgourmet.com.tr/wp-content/uploads/2026/01/evolvia.png" 
                alt="Evolvia" 
                fill 
                className="object-contain" 
              />
            </div>

            {/* Sebamed */}
            <div className="relative w-32 h-16 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
              <Image 
                src="https://api.kidsgourmet.com.tr/wp-content/uploads/2026/01/sebamed.png" 
                alt="Sebamed" 
                fill 
                className="object-contain" 
              />
            </div>

            {/* Benetton */}
            <div className="relative w-32 h-16 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
              <Image 
                src="https://api.kidsgourmet.com.tr/wp-content/uploads/2026/01/benetton.png" 
                alt="Benetton" 
                fill 
                className="object-contain" 
              />
            </div>

          </div>
        </div>
      </div>

      {/* SSS */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Sıkça Sorulan Sorular</h2>
          </div>
          
          <div className="space-y-4">
            <details className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 group">
              <summary className="font-bold text-slate-800 cursor-pointer flex items-center justify-between">
                Minimum sponsorluk süresi nedir?
                <i className="fa-solid fa-chevron-down text-gray-400 group-open:rotate-180 transition-transform"></i>
              </summary>
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                Sponsorlu içerikler için minimum 1 ay, Akıllı Asistan araçları sponsorlukları için minimum 3 ay süre öneriyoruz. Display reklamlarda esneklik sağlanabilir.
              </p>
            </details>
            
            <details className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 group">
              <summary className="font-bold text-slate-800 cursor-pointer flex items-center justify-between">
                İçerikler nasıl hazırlanıyor?
                <i className="fa-solid fa-chevron-down text-gray-400 group-open:rotate-180 transition-transform"></i>
              </summary>
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                Sponsorlu içerikler editöryal ekibimiz tarafından, markanızın mesajına uygun şekilde hazırlanır. İçerik onayı alındıktan sonra yayınlanır.
              </p>
            </details>
            
            <details className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 group">
              <summary className="font-bold text-slate-800 cursor-pointer flex items-center justify-between">
                Hangi raporlamaları sunuyoruz?
                <i className="fa-solid fa-chevron-down text-gray-400 group-open:rotate-180 transition-transform"></i>
              </summary>
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                Gösterim sayısı, benzersiz ziyaretçi, tıklama oranı (CTR), Akıllı Asistan araçları kullanım sayısı ve dönüşüm metrikleri gibi performans raporlarını haftalık ve aylık olarak sunuyoruz.
              </p>
            </details>
            
            <details className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 group">
              <summary className="font-bold text-slate-800 cursor-pointer flex items-center justify-between">
                &quot;Sponsorlu&quot; etiketi zorunlu mu?
                <i className="fa-solid fa-chevron-down text-gray-400 group-open:rotate-180 transition-transform"></i>
              </summary>
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                Evet, şeffaflık ilkemiz gereği tüm sponsorlu içerikler &quot;Sponsorlu İçerik&quot; etiketi ile belirtilir. Bu hem yasal zorunluluk hem de okuyucu güveninin temelidir.
              </p>
            </details>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="mb-4 font-bold text-lg text-slate-800">Sorularınız mı var?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/iletisim" 
              className="text-orange-500 font-bold hover:underline"
            >
              <i className="fa-solid fa-envelope mr-2"></i>
              İletişime Geçin
            </Link>
            <span className="text-gray-300">|</span>
            <a 
              href="mailto:reklam@kidsgourmet.com.tr" 
              className="text-orange-500 font-bold hover:underline"
            >
              reklam@kidsgourmet.com.tr
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}