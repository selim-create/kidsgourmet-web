'use client';

import Link from 'next/link';
import Image from 'next/image';
import NewsletterForm from '@/components/common/NewsletterForm';
import { openCookiePreferences } from '@/components/common/CookieConsent'; 

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-gray-100 relative z-10 mt-auto">
        
        {/* Newsletter Section */}
        <div className="bg-gradient-to-br from-orange-50 via-yellow-50 to-white py-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-100 rounded-full blur-3xl -ml-24 -mb-24 opacity-50"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="text-center lg:text-left flex-1">
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
                
                {/* GRID UPDATE:
                   lg:grid-cols-12 yaptık.
                   Logo alanı: lg:col-span-4 (Geniş)
                   Diğer alanlar: lg:col-span-2 (Daha dar ve kompakt)
                */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 lg:gap-8">
                    
                    {/* Brand Column (Genişletildi - 4/12) */}
                    <div className="col-span-2 md:col-span-4 lg:col-span-4 flex flex-col pr-0 lg:pr-8">
                        <Link href="/" className="flex items-center mb-5 group" aria-label="KidsGourmet Ana Sayfa">
                             <Image 
                                src="/kidsgourmet-logo.svg" 
                                alt="KidsGourmet Logo" 
                                width={160} 
                                height={44} 
                                className="h-10 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                            Bebek ve çocuk beslenmesinde güvenilir rehberiniz. Uzman görüşleri, sağlıklı tarifler ve akıllı araçlarla yanınızdayız.
                        </p>
                        
                        {/* Social Media - Grid System */}
                        {/* Alan genişlediği için ikonları tek satırda 6'lı gösterebiliriz veya 3'lü bırakabiliriz. 
                            Geniş alanda tek satır daha şık durabilir, bu yüzden lg:grid-cols-6 yaptım. */}
                        <div className="grid grid-cols-6 gap-2 w-fit mt-auto">
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
                                <i className="fa-brands fa-facebook-f text-xs"></i>
                            </Link>
                            <Link 
                                href="https://tr.pinterest.com/KidsandGourmet" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label="Pinterest"
                                className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white hover:border-transparent transition-all shadow-sm"
                            >
                                <i className="fa-brands fa-pinterest text-xs"></i>
                            </Link>
                            <Link 
                                href="https://www.youtube.com/channel/UCkXtLdtEfhl8Do1pPW4fgsQ" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label="YouTube"
                                className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-red-500 hover:text-white hover:border-transparent transition-all shadow-sm"
                            >
                                <i className="fa-brands fa-youtube text-xs"></i>
                            </Link>
                            <Link 
                                href="https://tiktok.com/@kidsgourmet" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label="TikTok"
                                className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white hover:border-transparent transition-all shadow-sm"
                            >
                                <i className="fa-brands fa-tiktok text-xs"></i>
                            </Link>
                            <Link 
                                href="https://x.com/kidsandgourmet" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label="X (Twitter)"
                                className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white hover:border-transparent transition-all shadow-sm"
                            >
                                <i className="fa-brands fa-x-twitter text-xs"></i>
                            </Link>
                        </div>
                    </div>
                    
                    {/* Tarifler (6 Madde) - Daraltıldı (2/12) */}
                    <div className="col-span-1 md:col-span-1 lg:col-span-2">
                        <h4 className="font-display font-bold text-slate-800 mb-5 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
                                <i className="fa-solid fa-utensils text-orange-500 text-xs"></i>
                            </div>
                            Tarifler
                        </h4>
                        <nav aria-label="Tarif kategorileri">
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/tarifler" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                                        Tüm Tarifler
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/tarifler?meal-type=kahvalti" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                                        Kahvaltı
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/tarifler?meal-type=ana-yemek" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                                        Ana Yemekler
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/tarifler?meal-type=ara-ogun" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                                        Ara Öğün
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/tarifler?meal-type=corba" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                                        Çorbalar
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/tarifler?meal-type=tatli" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                                        Tatlılar
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* Keşfet (6 Madde) - Daraltıldı (2/12) */}
                    <div className="col-span-1 md:col-span-1 lg:col-span-2">
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
                                        Keşfet Ana Sayfa
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
                                    <Link href="/akilli-asistan/persentil" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                                        Persentil Hesaplama
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

                    {/* Kurumsal (6 Madde) - Daraltıldı (2/12) */}
                    <div className="col-span-1 md:col-span-1 lg:col-span-2">
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
                                    <Link href="/yardim" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                                        Yardım & Destek
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

                    {/* Bilgilendirme (6 Madde) - Daraltıldı (2/12) */}
                    {/* Açık Rıza ve Başvuru Formu kaldırıldı, sayı 6'ya düştü. */}
                    <div className="col-span-1 md:col-span-1 lg:col-span-2">
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
                                    <button 
                                        onClick={openCookiePreferences}
                                        className="text-gray-600 hover:text-orange-500 transition-colors text-sm text-left"
                                    >
                                        Çerez Tercihleri
                                    </button>
                                </li>
                                <li>
                                    <Link href="/kvkk" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                                        KVKK
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/aydinlatma-metni" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                                        Aydınlatma Metni
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
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors"
                        >
                            <i className="fa-solid fa-user-doctor text-green-500"></i>
                            <span className="font-medium">Rejimde.com</span>
                        </Link>
                        <Link 
                            href="https://tariften.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-purple-600 transition-colors"
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