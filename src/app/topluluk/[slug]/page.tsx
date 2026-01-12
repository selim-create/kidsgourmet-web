"use client";

import React, { use } from 'react';
import Link from "next/link";

export default function CommunityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  
  // Mockup verisi
  const discussion = {
    title: "Yumurta beyazı alerjisi ne zaman geçer? Tecrübesi olan var mı?",
    author: "Mert'in Babası",
    time: "2 saat önce",
    babyInfo: "12 Aylık Erkek Bebek",
    content: "Selamlar, oğlum 1 yaşına girdi ve deneme amaçlı yumurta beyazı verdiğimizde yüzünde kızarıklıklar oluştu. Doktorumuz diyete devam etmemizi söyledi. Bu durumu yaşayan ebeveynler, sizin çocuklarınızda bu süreç nasıl ilerledi? Genelde kaç yaşında tolere edebiliyorlar? Fırınlanmış ürünlerde (kek vb.) reaksiyon gösteriyor mu?",
    tags: ["Alerji"],
    likes: 24,
    replies: 8
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24 lg:pb-12">
        
        {/* MOBILE BACK HEADER */}
        <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-20 z-40">
            {/* Localde Link kullanın */}
            <Link href="/topluluk" className="text-gray-500 text-lg"><i className="fa-solid fa-arrow-left"></i></Link>
            <span className="font-bold text-slate-800 text-sm truncate">{discussion.title}</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* MAIN CONTENT (Discussion) */}
                <main className="lg:col-span-2 space-y-6">
                    
                    {/* BREADCRUMB (Desktop) */}
                    <nav className="hidden lg:flex text-sm text-gray-500 mb-2" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2">
                            {/* Localde Link kullanın */}
                            <li><Link href="/topluluk" className="hover:text-orange-500">Topluluk</Link></li>
                            <li><i className="fa-solid fa-chevron-right text-xs text-gray-300"></i></li>
                            <li><Link href="#" className="hover:text-orange-500">Alerjik Çocuklar</Link></li>
                            <li><i className="fa-solid fa-chevron-right text-xs text-gray-300"></i></li>
                            <li className="font-medium text-slate-800">Tartışma Detayı</li>
                        </ol>
                    </nav>

                    {/* THE QUESTION POST */}
                    <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative">
                        {/* User Info */}
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex gap-4">
                                <img src="https://placehold.co/100x100/FFF9C4/FBC02D?text=M" className="w-12 h-12 rounded-full border border-gray-100" alt="Author" />
                                <div>
                                    <h3 className="font-bold text-slate-800 text-base">{discussion.author}</h3>
                                    <p className="text-xs text-gray-400">{discussion.babyInfo} • {discussion.time}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs font-bold">{discussion.tags[0]}</span>
                                <button className="text-gray-400 hover:text-slate-800 px-2"><i className="fa-solid fa-ellipsis"></i></button>
                            </div>
                        </div>
                        
                        {/* Content */}
                        <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-800 mb-4 leading-tight font-sans">
                            {discussion.title}
                        </h1>
                        <p className="text-gray-600 text-lg leading-relaxed mb-6 whitespace-pre-line">
                            {discussion.content}
                        </p>

                        {/* Stats & Share */}
                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                            <div className="flex gap-6">
                                <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors font-medium">
                                    <i className="fa-regular fa-heart text-xl"></i> {discussion.likes}
                                </button>
                                <button className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors font-medium">
                                    <i className="fa-regular fa-comment text-xl"></i> {discussion.replies} Cevap
                                </button>
                            </div>
                            <button className="text-gray-400 hover:text-brand-secondary transition-colors">
                                <i className="fa-solid fa-share-nodes text-xl"></i>
                            </button>
                        </div>
                    </div>

                    {/* EXPERT ANSWER (Pinned) */}
                    <div className="bg-green-50/50 p-6 md:p-8 rounded-[2rem] border-2 border-green-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 bg-green-100 text-green-700 text-xs font-bold px-4 py-1.5 rounded-br-2xl border-r border-b border-green-200">
                            <i className="fa-solid fa-check-circle mr-1"></i> Uzman Cevabı
                        </div>

                        <div className="flex gap-4 mb-4 mt-4">
                            <img src="https://placehold.co/100x100/AED581/ffffff?text=Dyt" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt="Expert" />
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm">Dyt. Ayşe Yılmaz <i className="fa-solid fa-circle-check text-green-500 ml-1"></i></h3>
                                <p className="text-xs text-green-600 font-medium">Çocuk Beslenme Uzmanı • Rejimde.com</p>
                            </div>
                        </div>

                        <div className="prose prose-sm prose-green max-w-none text-slate-700">
                            <p>
                                Merhaba, çok geçmiş olsun. Yumurta alerjisi çocukluk çağında en sık görülen besin alerjilerinden biridir ancak iyi haber şu ki; çocukların yaklaşık %70'i okul çağına (4-5 yaş) gelmeden bu alerjiyi atlatır.
                            </p>
                            <p>
                                <strong>Fırınlanmış Ürünler Hakkında:</strong> Yumurta yüksek ısıda (fırında kek, muffin gibi) işlem gördüğünde protein yapısı değişir. Çoğu çocuk (doktor onayıyla) fırınlanmış yumurtayı tolere edebilir. Buna "Yumurta Merdiveni" tedavisi denir. Ancak doktorunuza danışmadan denemeyiniz.
                            </p>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <button className="text-xs font-bold text-green-700 bg-white border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-50">
                                Faydalı Buldum (15)
                            </button>
                        </div>
                    </div>

                    {/* COMMUNITY REPLIES */}
                    <div className="space-y-6 pt-4">
                        <h3 className="font-bold text-slate-800 text-lg px-2">Diğer Cevaplar (7)</h3>

                        {/* Reply 1 */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between mb-3">
                                <div className="flex gap-3">
                                    <img src="https://placehold.co/100x100/FFAB91/ffffff?text=S" className="w-10 h-10 rounded-full bg-gray-100" alt="User 1" />
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm">Selin K.</h4>
                                        <p className="text-xs text-gray-400">3 Yaş Erkek Çocuk Annesi</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">1 saat önce</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                                Bizimki 2 yaşında tamamen geçti. Doktorumuz 18. ayda tekrar deneme yapmıştı, o zaman hafiflemişti. Sabırlı olun, geçiyor :)
                            </p>
                            <div className="flex gap-4">
                                <button className="text-xs font-bold text-gray-500 hover:text-orange-500"><i className="fa-regular fa-thumbs-up mr-1"></i> Beğen (3)</button>
                                <button className="text-xs font-bold text-gray-500 hover:text-orange-500">Yanıtla</button>
                            </div>
                        </div>

                        {/* Reply 2 */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between mb-3">
                                <div className="flex gap-3">
                                    <img src="https://placehold.co/100x100/80CBC4/ffffff?text=Z" className="w-10 h-10 rounded-full bg-gray-100" alt="User 2" />
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm">Zeynep A.</h4>
                                        <p className="text-xs text-gray-400">2 Çocuk Annesi</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">3 saat önce</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                                Yumurta yerine ne kullanıyorsunuz tariflerde? Ben muz veya elma püresi kullanıyorum bağlayıcı olarak, tavsiye ederim.
                            </p>
                            
                            {/* Nested Reply */}
                            <div className="bg-gray-50 p-3 rounded-xl mt-3 ml-4 border-l-2 border-gray-200">
                                <p className="text-xs font-bold text-slate-700 mb-1">Mert'in Babası</p>
                                <p className="text-xs text-gray-600">Teşekkürler, keten tohumu jeli de önerdiler, onu deneyeceğim.</p>
                            </div>

                            <div className="flex gap-4 mt-3">
                                <button className="text-xs font-bold text-gray-500 hover:text-orange-500"><i className="fa-regular fa-thumbs-up mr-1"></i> Beğen (1)</button>
                                <button className="text-xs font-bold text-gray-500 hover:text-orange-500">Yanıtla</button>
                            </div>
                        </div>

                    </div>

                </main>

                {/* RIGHT SIDEBAR (Related) */}
                <aside className="hidden lg:block lg:col-span-1 space-y-6">
                    
                    {/* Related Discussions */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 text-sm mb-4">Benzer Konular</h3>
                        <div className="space-y-4">
                            <Link href="#" className="block group">
                                <h4 className="text-sm font-medium text-slate-700 group-hover:text-orange-500 transition-colors line-clamp-2">Süt alerjisi olan bebekler için yoğurt alternatifi?</h4>
                                <p className="text-xs text-gray-400 mt-1">12 Cevap</p>
                            </Link>
                            <hr className="border-gray-50" />
                            <Link href="#" className="block group">
                                <h4 className="text-sm font-medium text-slate-700 group-hover:text-orange-500 transition-colors line-clamp-2">Alerji testi kaçıncı ayda yapılmalı?</h4>
                                <p className="text-xs text-gray-400 mt-1">5 Cevap</p>
                            </Link>
                            <hr className="border-gray-50" />
                            <Link href="#" className="block group">
                                <h4 className="text-sm font-medium text-slate-700 group-hover:text-orange-500 transition-colors line-clamp-2">Ek gıdada kuruyemiş ne zaman verilir?</h4>
                                <p className="text-xs text-gray-400 mt-1">28 Cevap</p>
                            </Link>
                        </div>
                    </div>

                    {/* Guidelines Widget */}
                    <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                        <div className="flex items-start gap-3">
                            <i className="fa-solid fa-circle-info text-blue-500 mt-1"></i>
                            <div>
                                <h4 className="text-sm font-bold text-blue-800">Alerji Şüphesi mi?</h4>
                                <p className="text-xs text-blue-700 mt-1">
                                    Besin alerjisi belirtileri ve acil durum rehberimizi okudunuz mu?
                                </p>
                                <button className="mt-2 text-xs font-bold text-white bg-blue-500 px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors">Rehbere Git</button>
                            </div>
                        </div>
                    </div>

                </aside>

            </div>
        </div>

        {/* REPLY INPUT (Sticky Bottom on Mobile) */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 lg:relative lg:border-none lg:bg-transparent lg:p-0 z-50">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white lg:p-0 rounded-2xl flex gap-3 items-center">
                        <img src="https://placehold.co/100x100/FFCC80/ffffff?text=Siz" className="w-10 h-10 rounded-full bg-gray-100 hidden lg:block" alt="You" />
                        <div className="flex-1 relative">
                            <input type="text" placeholder="Bir cevap yaz..." className="w-full bg-gray-50 border border-gray-200 rounded-full py-3 px-5 pr-12 text-sm focus:outline-none focus:border-orange-500 transition-colors" />
                            <button className="absolute right-2 top-1.5 text-orange-500 hover:bg-orange-50 p-2 rounded-full transition-colors">
                                <i className="fa-solid fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
  );
}