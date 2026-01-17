import Link from 'next/link';
import NewsletterForm from '@/components/common/NewsletterForm'; 

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8 relative z-10 mt-auto text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
                
                {/* Brand Column (Span 3) */}
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-10 h-10 flex items-center justify-center bg-orange-100 rounded-full text-orange-500">
                            <i className="fa-solid fa-carrot text-xl"></i>
                        </div>
                        <span className="font-display font-bold text-2xl tracking-tight text-slate-800">Kids<span className="text-orange-500">Gourmet</span></span>
                    </div>
                    <p className="text-gray-500 mb-6 leading-relaxed max-w-xs">
                        Bebek ve çocuk beslenmesinde güvenilir rehberiniz. Uzman onaylı tarifler ve akıllı araçlarla ebeveynlik yolculuğunuzda yanınızdayız.
                    </p>
                    <div className="flex space-x-3">
                        <Link href="https://instagram.com/kidsgourmet" target="_blank" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-500 hover:to-orange-400 hover:text-white hover:border-transparent transition-all">
                            <i className="fa-brands fa-instagram"></i>
                        </Link>
                        <Link href="https://youtube.com/@kidsgourmet" target="_blank" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-red-500 hover:text-white hover:border-transparent transition-all">
                            <i className="fa-brands fa-youtube"></i>
                        </Link>
                        <Link href="https://twitter.com/kidsgourmet" target="_blank" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white hover:border-transparent transition-all">
                            <i className="fa-brands fa-x-twitter"></i>
                        </Link>
                        <Link href="https://tiktok.com/@kidsgourmet" target="_blank" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white hover:border-transparent transition-all">
                            <i className="fa-brands fa-tiktok"></i>
                        </Link>
                        <Link href="https://pinterest.com/kidsgourmet" target="_blank" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white hover:border-transparent transition-all">
                            <i className="fa-brands fa-pinterest"></i>
                        </Link>
                        <Link href="https://facebook.com/kidsgourmet" target="_blank" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white hover:border-transparent transition-all">
                            <i className="fa-brands fa-facebook-f"></i>
                        </Link>
                    </div>
                </div>
                
                {/* Links: Discover (Span 2) */}
                <div className="col-span-1 lg:col-span-2">
                    <h4 className="font-display font-bold text-slate-800 mb-5 text-base">Keşfet</h4>
                    <ul className="space-y-3 text-gray-600">
                        <li><Link href="/tarifler" className="hover:text-orange-500 hover:translate-x-1 transition-all inline-block">Tarifler</Link></li>
                        <li><Link href="/beslenme-rehberi" className="hover:text-orange-500 hover:translate-x-1 transition-all inline-block">Beslenme Rehberi</Link></li>
                        <li><Link href="/akilli-asistan" className="hover:text-orange-500 hover:translate-x-1 transition-all inline-block">Akıllı Asistan</Link></li>
                        <li><Link href="/kesfet" className="hover:text-orange-500 hover:translate-x-1 transition-all inline-block">Keşfet</Link></li>
                        <li><Link href="/topluluk" className="hover:text-orange-500 hover:translate-x-1 transition-all inline-block">Topluluk</Link></li>
                    </ul>
                </div>

                {/* Links: Corporate (Span 2) */}
                <div className="col-span-1 lg:col-span-2">
                    <h4 className="font-display font-bold text-slate-800 mb-5 text-base">Kurumsal</h4>
                    <ul className="space-y-3 text-gray-600">
                        <li><Link href="/hakkimizda" className="hover:text-orange-500 hover:translate-x-1 transition-all inline-block">Hakkımızda</Link></li>
                        <li><Link href="/kunye" className="hover:text-orange-500 hover:translate-x-1 transition-all inline-block">Künye</Link></li>
                        <li><Link href="/uzmanlar" className="hover:text-orange-500 hover:translate-x-1 transition-all inline-block">Uzman Kadromuz</Link></li>
                        <li><Link href="/iletisim" className="hover:text-orange-500 hover:translate-x-1 transition-all inline-block">İletişim & Reklam</Link></li>
                    </ul>
                </div>

                {/* Links: Legal (Span 2) - NEW SECTION */}
                <div className="col-span-1 lg:col-span-2">
                    <h4 className="font-display font-bold text-slate-800 mb-5 text-base">Yasal</h4>
                    <ul className="space-y-3 text-gray-600">
                        <li><Link href="/kullanim-kosullari" className="hover:text-orange-500 hover:translate-x-1 transition-all inline-block">Kullanım Koşulları</Link></li>
                        <li><Link href="/gizlilik-politikasi" className="hover:text-orange-500 hover:translate-x-1 transition-all inline-block">Gizlilik Politikası</Link></li>
                        <li><Link href="/cerez-politikasi" className="hover:text-orange-500 hover:translate-x-1 transition-all inline-block">Çerez Politikası</Link></li>
                        <li><Link href="/yardim" className="hover:text-orange-500 hover:translate-x-1 transition-all inline-block">Yardım & Destek</Link></li>
                    </ul>
                </div>

                {/* Newsletter & Contact (Span 3) */}
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                        <h4 className="font-display font-bold text-slate-800 mb-2 text-base">Bültene Katıl</h4>
                        <p className="text-xs text-gray-500 mb-4">Haftalık menü önerileri ve gelişim notları e-postana gelsin.</p>
                        <div className="mb-6">
                            <NewsletterForm 
                                source="footer" 
                                variant="compact" 
                                placeholder="E-posta adresi"
                            />
                        </div>

                        <div className="border-t border-gray-100 pt-4">
                            <h4 className="font-display font-bold text-slate-800 mb-2 text-sm">Bizimle Çalışın</h4>
                            <p className="text-xs text-gray-500 mb-3">Markanız KidsGourmet anneleriyle buluşsun.</p>
                            <Link href="/iletisim" className="inline-flex items-center justify-center w-full border-2 border-slate-200 text-slate-700 font-bold py-2 rounded-xl text-sm hover:border-slate-800 hover:text-slate-800 transition-colors">
                                Kurumsal İletişim
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-1">
                    <span>Copyright © 2026</span>
                    <strong className="text-slate-700">KidsGourmet</strong>
                    <span>bir</span>
                    <strong className="text-slate-700">Hip Medya</strong>
                    <span>markasıdır.</span>
                    <span className="hidden md:inline mx-2">•</span>
                    <span>Tüm hakları saklıdır.</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <Link href="https://rejimde.com" target="_blank" className="hover:text-orange-500 transition-colors font-medium">Rejimde.com</Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        <Link href="https://tariften.com" target="_blank" className="hover:text-orange-500 transition-colors font-medium">Tariften.com</Link>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  );
}