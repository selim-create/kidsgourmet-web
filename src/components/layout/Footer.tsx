'use client';

import Link from 'next/link';
import NewsletterForm from '@/components/common/NewsletterForm'; 

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-gray-100 relative z-10 mt-auto">
        
        {/* Newsletter Section - KidsGourmet Style */}
        <div className="bg-gradient-to-br from-orange-50 via-yellow-50 to-white py-12 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-100 rounded-full blur-3xl -ml-24 -mb-24 opacity-50"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg: px-8 relative z-10">
                <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="text-center lg: text-left flex-1">
                            <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                                    <i className="fa-solid fa-envelope text-orange-500 text-xl"></i>
                                </div>
                                <h3 className="font-display font-bold text-2xl text-slate-800">K&amp;G Bülten</h3>
                            </div>
                            <p className="text-gray-500 max-w-md">
                                K&amp;G Bülten&apos;e abone ol, yeni tarifler, beslenme ipuçları ve özel içerikler e-postana gelsin!
                            </p>
                        </div>
                        <div className="w-full lg:w-auto lg:min-w-[380px]">
                            <NewsletterForm 
                                source="footer" 
                                variant="compact" 
                                placeholder="Mail Adresiniz"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Main Footer Content */}
        <div className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
                    
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-3 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-5 group" aria-label="KidsGourmet Ana Sayfa">
                            <div className="relative">
                                <div className="absolute inset-0 bg-orange-400 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                                <div className="relative w-10 h-10 flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                                    <i className="fa-solid fa-carrot text-orange-500 text-2xl"></i>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-display font-bold text-xl tracking-tight text-slate-800 leading-none">
                                    Kids<span className="text-orange-500">Gourmet</span>
                                </span>
                                <span className="text-[10px] text-gray-400 font-medium tracking-wide">Sağlıklı Nesiller</span>
                            </div>
                        </Link>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                            Bebek ve çocuk beslenmesinde güvenilir rehberiniz. Uzman görüşleri, sağlıklı tarifler ve akıllı araçlarla yanınızdayız.
                        </p>
                        
                        {/* Social Media - 3x2 Grid */}
                        <div className="grid grid-cols-3 gap-2">
                            <Link 
                                href="https://www.instagram.com/kidsgourmet/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-500 hover:to-orange-400 hover:text-white hover:border-transparent transition-all shadow-sm"
                            >
                                <i className="fa-brands fa-instagram text-sm"></i>
                            </Link>
                            <Link 
                                href="https://www.facebook.com/kidsandgourmet" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white hover:border-transparent transition-all shadow-sm"
                            >
                                <i className="fa-brands fa-facebook-f text-sm"></i>
                            </Link>
                            <Link 
                                href="https://tr.pinterest.com/KidsandGourmet" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label="Pinterest"
                                className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white hover:border-transparent transition-all shadow-sm"
                            >
                                <i className="fa-brands fa-pinterest text-sm"></i>
                            </Link>
                            <Link 
                                href="https://www.youtube.com/channel/UCkXtLdtEfhl8Do1pPW4fgsQ" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label="YouTube"
                                className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-red-500 hover:text-white hover:border-transparent transition-all shadow-sm"
                            >
                                <i className="fa-brands fa-youtube text-sm"></i>
                            </Link>
                            <Link 
                                href="https://tiktok.com/@kidsgourmet" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label="TikTok"
                                className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white hover:border-transparent transition-all shadow-sm"
                            >
                                <i className="fa-brands fa-tiktok text-sm"></i>
                            </Link>
                            <Link 
                                href="https://x.com/kidsandgourmet" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label="X (Twitter)"
                                className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white hover:border-transparent transition-all shadow-sm"
                            >
                                <i className="fa-brands fa-x-twitter text-sm"></i>
                            </Link>
                        </div>
                    </div>
                    
                    {/* Tarifler - With Icons */}
                    <div className="col-span-1">
                        <h4 className="font-display font-bold text-slate-800 mb-5 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
                                <i className="fa-solid fa-utensils text-orange-500 text-xs"></i>
                            </div>
                            Tarifler
                        </h4>
                        <nav aria-label="Tarif kategorileri">
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/tarifler" className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors text-sm group">
                                        <i className="fa-solid fa-bowl-food text-gray-300 group-hover:text-orange-400 text-xs w-4"></i>
                                        Tüm Tarifler
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/tarifler?meal-type=kahvalti" className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors text-sm group">
                                        <i className="fa-solid fa-egg text-gray-300 group-hover:text-orange-400 text-xs w-4"></i>
                                        Kahvaltı
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/tarifler?meal-type=ana-yemek" className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors text-sm group">
                                        <i className="fa-solid fa-plate-wheat text-gray-300 group-hover:text-orange-400 text-xs w-4"></i>
                                        Ana Yemekler
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/tarifler?meal-type=ara-ogun" className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors text-sm group">
                                        <i className="fa-solid fa-cookie-bite text-gray-300 group-hover:text-orange-400 text-xs w-4"></i>
                                        Ara Öğün
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/tarifler?meal-type=corba" className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors text-sm group">
                                        <i className="fa-solid fa-mug-hot text-gray-300 group-hover:text-orange-400 text-xs w-4"></i>
                                        Çorbalar
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/tarifler?meal-type=tatli" className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors text-sm group">
                                        <i className="fa-solid fa-ice-cream text-gray-300 group-hover:text-orange-400 text-xs w-4"></i>
                                        Tatlılar
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* Keşfet */}
                    <div className="col-span-1">
                        <h4 className="font-display font-bold text-slate-800 mb-5 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
                                <i className="fa-solid fa-compass text-purple-500 text-xs"></i>
                            </div>
                            Keşfet
                        </h4>
                        <nav aria-label="Keşfet">
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/kesfet" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                                        Keşfet
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/beslenme-rehberi" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                                        Beslenme Rehberi
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/akilli-asistan" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                                        Akıllı Asistan
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/topluluk" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                                        Topluluk
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/beslenme-rehberi/3-gun-kurali" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                                        3 Gün Kuralı
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* Kurumsal */}
                    <div className="col-span-1">
                        <h4 className="font-display font-bold text-slate-800 mb-5 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
                                <i className="fa-solid fa-building text-green-500 text-xs"></i>
                            </div>
                            Kurumsal
                        </h4>
                        <nav aria-label="Kurumsal">
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/hakkimizda" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                                        Hakkımızda
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/kunye" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                                        Künye
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/uzmanlar" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                                        Uzmanlar
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/iletisim" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                                        İletişim
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/reklam-verin" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                                        Reklam Verin
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* Yasal & Destek */}
                    <div className="col-span-1">
                        <h4 className="font-display font-bold text-slate-800 mb-5 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                                <i className="fa-solid fa-shield-halved text-blue-500 text-xs"></i>
                            </div>
                            Bilgilendirme
                        </h4>
                        <nav aria-label="Yasal">
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/kullanim-kosullari" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                                        Kullanım Koşulları
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/gizlilik-politikasi" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                                        Gizlilik Politikası
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/cerez-politikasi" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                                        Çerez Politikası
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/kvkk" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                                        KVKK
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/yardim" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                                        Yardım & Destek
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-white border-t border-gray-100 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    
                    {/* Copyright */}
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-1 text-sm text-gray-500">
                        <span>© 2026</span>
                        <strong className="text-slate-700">KidsGourmet</strong>
                        <span>bir</span>
                        <strong className="text-slate-700">Hip Medya</strong>
                        <span>markasıdır.</span>
                    </div>
                    
                    {/* Ecosystem Links */}
                    <div className="flex items-center gap-6">
                        <Link 
                            href="https://rejimde.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-gray-500 hover: text-green-600 transition-colors"
                        >
                            <i className="fa-solid fa-user-doctor text-green-500"></i>
                            <span className="font-medium">Rejimde.com</span>
                        </Link>
                        <Link 
                            href="https://tariften.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-gray-500 hover: text-purple-600 transition-colors"
                        >
                            <i className="fa-solid fa-utensils text-purple-500"></i>
                            <span className="font-medium">Tariften.com</span>
                        </Link>
                    </div>

                    {/* Back to Top */}
                    <button 
                        onClick={scrollToTop}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-orange-50 text-gray-500 hover:text-orange-500 rounded-full transition-all text-sm font-medium"
                        aria-label="Sayfanın başına dön"
                    >
                        <i className="fa-solid fa-arrow-up text-xs"></i>
                        Başa Dön
                    </button>
                </div>
            </div>
        </div>
    </footer>
  );
}