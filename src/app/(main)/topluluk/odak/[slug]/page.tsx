"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { use } from 'react';
import { toast } from 'sonner';
import { getCircles, getDiscussions, followCircle, unfollowCircle } from '@/lib/community';
import { formatRelativeTime } from '@/utils/helpers';
import type { Circle, Discussion } from '@/lib/types';

export default function CircleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  
  const [circle, setCircle] = useState<Circle | null>(null);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all circles to find this one
        const circlesData = await getCircles();
        const foundCircle = circlesData.find(c => c.slug === slug);
        
        if (!foundCircle) {
          setError('Odak bulunamadı');
          return;
        }
        
        setCircle(foundCircle);
        
        // Fetch discussions for this circle
        const discussionsData = await getDiscussions({
          circle_id: foundCircle.id,
          per_page: 20
        });
        
        setDiscussions(discussionsData.discussions);
      } catch (err) {
        console.error('Error fetching circle data:', err);
        setError('Veriler yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  async function handleFollowToggle() {
    if (!circle) return;

    try {
      setFollowLoading(true);
      
      if (circle.is_following) {
        await unfollowCircle(circle.id);
        setCircle({ ...circle, is_following: false });
        toast.success('Odak takipten çıkarıldı');
      } else {
        await followCircle(circle.id);
        setCircle({ ...circle, is_following: true });
        toast.success('Odak takip edildi');
      }
    } catch (err) {
      console.error('Error toggling follow:', err);
      toast.error('İşlem başarısız oldu. Lütfen giriş yaptığınızdan emin olun.');
    } finally {
      setFollowLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-500">Odak yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !circle) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error || 'Odak bulunamadı'}
          </div>
          <Link href="/topluluk" className="inline-block mt-4 text-orange-500 hover:underline font-bold">
            ← Topluluğa Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* MOBILE HEADER (Sticky) */}
      <div className="lg:hidden bg-white px-4 py-3 flex items-center gap-3 shadow-sm sticky top-20 z-30 border-b border-gray-100">
          <Link href="/topluluk" className="text-gray-500 text-lg"><i className="fa-solid fa-arrow-left"></i></Link>
          <span className="font-display font-bold text-lg text-slate-800">{circle.name}</span>
      </div>

      {/* CIRCLE HERO */}
      <div className="pt-8 pb-12 border-b" style={{ backgroundColor: `${circle.color_code}10` }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl shadow-md"
                    style={{ backgroundColor: circle.color_code }}
                  >
                      <i className={`fa-solid ${circle.icon || 'fa-users'}`}></i>
                  </div>
                  <div>
                      <h1 className="font-display font-bold text-3xl text-slate-800">{circle.name}</h1>
                      <p className="text-gray-600">{circle.description}</p>
                  </div>
              </div>
              <div className="flex gap-4 text-sm font-bold text-gray-500">
                  <div className="flex flex-col items-center">
                      <span className="text-slate-800 text-lg">{circle.discussion_count}</span>
                      <span className="text-xs uppercase tracking-wide">Tartışma</span>
                  </div>
                  <button 
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className="ml-4 px-6 py-2 text-white rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                    style={{ backgroundColor: circle.color_code }}
                  >
                      {followLoading ? 'Yükleniyor...' : (circle.is_following ? 'Takipten Çık' : 'Takip Et')}
                  </button>
              </div>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* MAIN FEED (Circle Posts) */}
            <main className="lg:col-span-3 space-y-6">
                
                {/* Create Post Input (Contextual) */}
                <Link
                  href="/topluluk/soru-sor"
                  className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center cursor-pointer hover:border-brand-primary/30 transition-colors"
                >
                    <img src="https://placehold.co/100x100/FFCC80/ffffff?text=Siz" className="w-10 h-10 rounded-full bg-gray-100" alt="User" />
                    <div className="flex-1 bg-gray-50 rounded-full px-4 py-2.5 text-gray-400 text-sm">
                        {circle.name} odağında bir soru sor...
                    </div>
                    <button className="text-brand-primary text-xl"><i className="fa-regular fa-image"></i></button>
                </Link>

                {/* Discussions List */}
                {discussions.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
                    <p className="text-gray-500">Bu odakta henüz tartışma bulunmuyor.</p>
                    <Link 
                      href="/topluluk/soru-sor"
                      className="inline-block mt-4 text-orange-500 hover:underline font-bold"
                    >
                      İlk soruyu siz sorun!
                    </Link>
                  </div>
                ) : (
                  discussions.map((discussion) => (
                    <div key={discussion.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        {discussion.expert_answered && (
                          <div className="mb-3 flex items-center gap-1 bg-green-50 text-green-600 px-2 py-1 rounded-lg text-[10px] font-bold border border-green-100 inline-flex">
                              <i className="fa-solid fa-user-doctor"></i> Uzman Yanıtladı
                          </div>
                        )}

                        <div className="flex justify-between items-start mb-3">
                            <div className="flex gap-3">
                                <img 
                                  src={discussion.author.avatar || `https://placehold.co/100x100/FFF9C4/FBC02D?text=${discussion.author.name.charAt(0)}`}
                                  className="w-10 h-10 rounded-full border border-gray-100" 
                                  alt={discussion.author.name} 
                                />
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm">{discussion.author.name}</h3>
                                    <p className="text-xs text-gray-400">{formatRelativeTime(discussion.created_at)}</p>
                                </div>
                            </div>
                        </div>
                        
                        <h2 className="font-bold text-base text-slate-800 mb-2">
                            <Link 
                              href={`/topluluk/${discussion.slug}`}
                              className="hover:text-brand-primary transition-colors"
                            >
                              {discussion.title}
                            </Link>
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            {discussion.excerpt}
                        </p>

                        <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                            <div className="flex gap-4">
                                <button className="flex items-center gap-1 text-gray-400 hover:text-red-500 text-sm transition-colors">
                                    <i className="fa-regular fa-heart"></i>
                                </button>
                                <Link 
                                  href={`/topluluk/${discussion.slug}`}
                                  className="flex items-center gap-1 text-gray-400 hover:text-blue-500 text-sm transition-colors"
                                >
                                    <i className="fa-regular fa-comment"></i> {discussion.comment_count} Cevap
                                </Link>
                            </div>
                            <button className="text-gray-400 hover:text-slate-800">
                              <i className="fa-regular fa-bookmark"></i>
                            </button>
                        </div>
                    </div>
                  ))
                )}

            </main>

            {/* RIGHT SIDEBAR (Related) */}
            <aside className="hidden lg:block lg:col-span-1 space-y-6">
                
                {/* Related Circles */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 text-sm mb-3">İlgili Odaklar</h3>
                    <nav className="space-y-1">
                        <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
                            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                            Ek Gıdaya Geçiş
                        </Link>
                        <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
                            <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                            Tarif Önerileri
                        </Link>
                    </nav>
                </div>

                {/* Popular Tags in this Circle */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 text-sm mb-4">Popüler Etiketler</h3>
                    <div className="flex flex-wrap gap-2">
                        <Link href="#" className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full transition-colors">#sütalerjisi</Link>
                        <Link href="#" className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full transition-colors">#yumurta</Link>
                        <Link href="#" className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full transition-colors">#diyet</Link>
                    </div>
                </div>

            </aside>

        </div>
      </div>
      
      {/* MOBILE FAB */}
      <Link
        href="/topluluk/soru-sor"
        className="lg:hidden fixed bottom-24 right-4 w-14 h-14 bg-brand-primary text-white rounded-full shadow-lg flex items-center justify-center text-2xl z-40 hover:scale-105 transition-transform"
      >
          <i className="fa-solid fa-plus"></i>
      </Link>

    </div>
  );
}