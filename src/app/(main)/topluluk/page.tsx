"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { getCircles, getDiscussions, getTopContributors } from '@/lib/community';
import { formatRelativeTime } from '@/utils/helpers';
import type { Circle, Discussion, TopContributor } from '@/lib/types';

export default function CommunityPage() {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [topContributors, setTopContributors] = useState<TopContributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCircleId, setSelectedCircleId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        const [circlesData, discussionsData, contributorsData] = await Promise.all([
          getCircles(),
          getDiscussions({ per_page: 20 }),
          getTopContributors(3)
        ]);
        
        setCircles(circlesData);
        setDiscussions(discussionsData.discussions);
        setTopContributors(contributorsData);
      } catch (err) {
        console.error('Error fetching community data:', err);
        setError('Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  async function handleCircleFilter(circleId: number | null) {
    try {
      setSelectedCircleId(circleId);
      setLoading(true);
      
      const discussionsData = await getDiscussions({
        circle_id: circleId || undefined,
        per_page: 20
      });
      
      setDiscussions(discussionsData.discussions);
    } catch (err) {
      console.error('Error filtering discussions:', err);
    } finally {
      setLoading(false);
    }
  }

  const myCircles = circles.filter(c => c.is_following);

  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* MOBILE HEADER (Sticky) */}
      <div className="lg:hidden bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-20 z-30 border-b border-gray-100">
          <span className="font-display font-bold text-lg text-slate-800">Topluluk</span>
          <Link href="/topluluk/soru-sor" className="text-orange-500 text-xl">
            <i className="fa-solid fa-pen-to-square"></i>
          </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* LEFT SIDEBAR: CIRCLES (Topics) */}
            <aside className="hidden lg:block lg:col-span-1 space-y-6">
                
                {/* Quick Actions */}
                <Link 
                  href="/topluluk/soru-sor"
                  className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                >
                    <i className="fa-solid fa-pen-to-square"></i> Soru Sor
                </Link>

                {/* My Circles */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                        <h3 className="font-bold text-slate-800 text-sm">Çemberlerim</h3>
                    </div>
                    <nav className="p-2 space-y-1">
                        {loading ? (
                          <div className="px-3 py-2 text-gray-400 text-sm">Yükleniyor...</div>
                        ) : myCircles.length === 0 ? (
                          <div className="px-3 py-2 text-gray-400 text-sm">Henüz takip ettiğiniz çember yok</div>
                        ) : (
                          myCircles.map((circle) => (
                            <Link 
                              key={circle.id}
                              href={`/topluluk/cember/${circle.slug}`}
                              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                selectedCircleId === circle.id
                                  ? 'bg-orange-50 text-orange-500 font-medium'
                                  : 'hover:bg-gray-50 text-gray-600'
                              }`}
                            >
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: circle.color_code }}></span>
                                {circle.name}
                            </Link>
                          ))
                        )}
                    </nav>
                </div>

                {/* All Circles */}
                {circles.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                          <h3 className="font-bold text-slate-800 text-sm">Tüm Çemberler</h3>
                      </div>
                      <nav className="p-2 space-y-1">
                          <button
                            onClick={() => handleCircleFilter(null)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                              selectedCircleId === null
                                ? 'bg-orange-50 text-orange-500 font-medium'
                                : 'hover:bg-gray-50 text-gray-600'
                            }`}
                          >
                              <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                              Tümü
                          </button>
                          {circles.map((circle) => (
                            <button
                              key={circle.id}
                              onClick={() => handleCircleFilter(circle.id)}
                              className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors ${
                                selectedCircleId === circle.id
                                  ? 'bg-orange-50 text-orange-500 font-medium'
                                  : 'hover:bg-gray-50 text-gray-600'
                              }`}
                            >
                                <div className="flex items-center gap-3">
                                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: circle.color_code }}></span>
                                  {circle.name}
                                </div>
                                <span className="text-xs text-gray-400">{circle.discussion_count}</span>
                            </button>
                          ))}
                      </nav>
                  </div>
                )}

            </aside>

            {/* MAIN FEED */}
            <main className="lg:col-span-2 space-y-6">
                
                {/* Mobile Only: Quick Filters */}
                <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 hide-scroll">
                    <button 
                      onClick={() => handleCircleFilter(null)}
                      className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap ${
                        selectedCircleId === null
                          ? 'bg-orange-500 text-white'
                          : 'bg-white border border-gray-200 text-gray-600'
                      }`}
                    >
                      Tümü
                    </button>
                    {circles.slice(0, 4).map((circle) => (
                      <button
                        key={circle.id}
                        onClick={() => handleCircleFilter(circle.id)}
                        className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
                          selectedCircleId === circle.id
                            ? 'bg-orange-500 text-white font-bold'
                            : 'bg-white border border-gray-200 text-gray-600'
                        }`}
                      >
                        {circle.name}
                      </button>
                    ))}
                </div>

                {/* Create Post Input (Teaser) */}
                <Link
                  href="/topluluk/soru-sor"
                  className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center cursor-pointer hover:border-orange-200 transition-colors"
                >
                    <img src="https://placehold.co/100x100/FFCC80/ffffff?text=Siz" className="w-10 h-10 rounded-full bg-gray-100" alt="User" />
                    <div className="flex-1 bg-gray-50 rounded-full px-4 py-2.5 text-gray-400 text-sm">
                        Aklına takılanı sor, anneler ve uzmanlar cevaplasın...
                    </div>
                    <button className="text-orange-500 text-xl"><i className="fa-regular fa-image"></i></button>
                </Link>

                {/* Loading State */}
                {loading && (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    <p className="mt-4 text-gray-500">Tartışmalar yükleniyor...</p>
                  </div>
                )}

                {/* Discussions List */}
                {!loading && discussions.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
                    <p className="text-gray-500">Henüz tartışma bulunmuyor.</p>
                    <Link 
                      href="/topluluk/soru-sor"
                      className="inline-block mt-4 text-orange-500 hover:underline font-bold"
                    >
                      İlk soruyu siz sorun!
                    </Link>
                  </div>
                )}

                {!loading && discussions.map((discussion) => (
                  <div 
                    key={discussion.id}
                    className={`bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative ${
                      discussion.expert_answered
                        ? 'border-l-4 border-green-400'
                        : 'border border-gray-100'
                    }`}
                  >
                    {discussion.expert_answered && (
                      <div className="absolute top-4 right-4 flex items-center gap-1 bg-green-50 text-green-600 px-2 py-1 rounded-lg text-[10px] font-bold border border-green-100">
                          <i className="fa-solid fa-user-doctor"></i> Uzman Yanıtladı
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-3">
                            <img 
                              src={discussion.author.avatar || `https://placehold.co/100x100/E1BEE7/8E24AA?text=${discussion.author.name.charAt(0)}`}
                              className="w-10 h-10 rounded-full border border-gray-100" 
                              alt={discussion.author.name} 
                            />
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm">{discussion.author.name}</h3>
                                <p className="text-xs text-gray-400">{formatRelativeTime(discussion.created_at)}</p>
                            </div>
                        </div>
                        {discussion.circle && (
                          <span 
                            className="px-2 py-1 rounded-lg text-[10px] font-bold"
                            style={{ 
                              backgroundColor: `${discussion.circle.color_code}20`,
                              color: discussion.circle.color_code
                            }}
                          >
                            {discussion.circle.name}
                          </span>
                        )}
                    </div>
                    
                    <h2 className="font-bold text-base text-slate-800 mb-2">
                        <Link 
                          href={`/topluluk/${discussion.slug}`}
                          className="hover:text-orange-500 transition-colors"
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
                ))}

            </main>

            {/* RIGHT SIDEBAR (Desktop) */}
            <aside className="hidden lg:block lg:col-span-1 space-y-6">
                
                {/* Community Rules */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                        <i className="fa-solid fa-shield-heart text-orange-500"></i> Topluluk Kuralları
                    </h3>
                    <ul className="text-xs text-gray-600 space-y-2">
                        <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-0.5"></i> Nazik ve destekleyici olun.</li>
                        <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-0.5"></i> Tıbbi tavsiye vermeyin.</li>
                        <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-0.5"></i> Reklam içerikli paylaşım yasaktır.</li>
                    </ul>
                    <button className="mt-3 text-xs text-orange-500 font-bold hover:underline">Tamamını Oku</button>
                </div>

                {/* Top Contributors */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 text-sm mb-4">Haftanın Anneleri 👑</h3>
                    {loading ? (
                      <div className="text-xs text-gray-400">Yükleniyor...</div>
                    ) : topContributors.length === 0 ? (
                      <div className="text-xs text-gray-400">Henüz veri yok</div>
                    ) : (
                      <div className="space-y-4">
                        {topContributors.map((contributor, index) => (
                          <div key={contributor.id} className="flex items-center gap-3">
                            <img 
                              src={contributor.avatar || `https://placehold.co/100x100/${index === 0 ? 'FFAB91' : index === 1 ? '80CBC4' : 'CE93D8'}/ffffff?text=${contributor.name.charAt(0)}`} 
                              className="w-8 h-8 rounded-full" 
                              alt={contributor.name} 
                            />
                            <div className="flex-1">
                              <p className="text-xs font-bold text-slate-700">{contributor.name}</p>
                              <p className="text-[10px] text-gray-400">{contributor.contribution_count}+ Katkı</p>
                            </div>
                            {index === 0 && <i className="fa-solid fa-award text-yellow-400"></i>}
                          </div>
                        ))}
                      </div>
                    )}
                </div>

            </aside>

        </div>
      </div>

      {/* MOBILE FAB */}
      <Link
        href="/topluluk/soru-sor"
        className="lg:hidden fixed bottom-24 right-4 w-14 h-14 bg-orange-500 text-white rounded-full shadow-lg flex items-center justify-center text-2xl z-40 hover:scale-105 transition-transform"
      >
          <i className="fa-solid fa-plus"></i>
      </Link>

      {/* MOBILE BOTTOM NAVIGATION (Same as Dashboard) */}
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-3 pb-safe z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <Link href="dashboard.html" className="flex flex-col items-center text-gray-400 hover:text-brand-primary transition-colors">
                <i className="fa-solid fa-house text-xl mb-1"></i>
                <span className="text-[10px] font-medium">Panelim</span>
            </Link>
            <Link href="#" className="flex flex-col items-center text-brand-primary">
                <i className="fa-solid fa-users text-xl mb-1"></i>
                <span className="text-[10px] font-bold">Topluluk</span>
            </Link>
            <div className="relative -top-8">
                <Link href="#" className="flex items-center justify-center w-14 h-14 bg-brand-primary rounded-full text-white shadow-lg shadow-orange-200 hover:scale-105 transition-transform">
                    <i className="fa-solid fa-magnifying-glass text-2xl"></i>
                </Link>
            </div>
            <Link href="favorites.html" className="flex flex-col items-center text-gray-400 hover:text-brand-primary transition-colors">
                <i className="fa-solid fa-heart text-xl mb-1"></i>
                <span className="text-[10px] font-medium">Favoriler</span>
            </Link>
            <Link href="profile.html" className="flex flex-col items-center text-gray-400 hover:text-brand-primary transition-colors">
                <i className="fa-solid fa-user text-xl mb-1"></i>
                <span className="text-[10px] font-medium">Profil</span>
            </Link>
        </div>
    </div>
  );
}