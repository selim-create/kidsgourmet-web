"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { toast } from 'sonner';
import { getCircles, getDiscussions, getTopContributors, voteDiscussion } from '@/lib/community';
import { formatRelativeTime, getProfileUrl, decodeHtmlEntities, ensureDiscussionDefaults } from '@/utils/helpers';
import type { Circle, Discussion, TopContributor } from '@/lib/types';
import { useFavorites } from '@/hooks/use-favorites';

// Discussion Card Component
function DiscussionCard({ 
  discussion, 
  onVote, 
  toggleFavorite, 
  isFavorite 
}: { 
  discussion: Discussion; 
  onVote: (id: number, voteType: 'like' | 'dislike') => void;
  toggleFavorite: (id: number, type: 'discussion') => void;
  isFavorite: boolean;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    if (showMenu) {
      // Small delay to allow dropdown to open
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleReport = () => {
    setShowMenu(false);
    toast.info('Raporlama özelliği yakında aktif olacak');
  };

  return (
    <div 
      className={`bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow relative ${
        discussion.expert_answered
          ? 'border-l-4 border-green-400'
          : 'border border-gray-100'
      }`}
    >
      {/* Circle tag (left side) and Expert badge (right side) */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-2 items-center">
          {discussion.circle && (
            <Link 
              href={`/topluluk/odak/${discussion.circle.slug}`}
              className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full text-xs font-medium hover:bg-orange-100 transition-colors"
            >
              <span>{discussion.circle.icon || '📌'}</span>
              <span>{discussion.circle.name}</span>
            </Link>
          )}
        </div>
        
        <div className="flex gap-2 items-center">
          {discussion.expert_answered && (
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <i className="fa-solid fa-check-circle"></i>
              Uzman Yanıtladı
            </span>
          )}
          
          {/* Dropdown menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </button>

            {showMenu && (
              <div 
                className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-[160px] z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReport();
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <i className="fa-solid fa-flag text-red-400"></i>
                  <span>Raporla</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Author info */}
      <div className="flex gap-3 mb-3">
        <img 
          src={discussion.author.avatar || `https://placehold.co/100x100/E1BEE7/8E24AA?text=${discussion.author.name.charAt(0)}`}
          className="w-10 h-10 rounded-full border border-gray-100" 
          alt={discussion.author.name} 
        />
        <div>
          <Link 
            href={getProfileUrl(discussion.author)} 
            className="font-bold text-slate-800 text-sm hover:text-orange-500 transition-colors"
          >
            {discussion.author.name}
          </Link>
          <p className="text-xs text-gray-400">{formatRelativeTime(discussion.created_at)}</p>
        </div>
      </div>
      
      {/* Title and excerpt */}
      <h2 className="font-bold text-base text-slate-800 mb-2">
        <Link 
          href={`/topluluk/${discussion.slug}`}
          className="hover:text-orange-500 transition-colors"
        >
          {decodeHtmlEntities(discussion.title)}
        </Link>
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        {decodeHtmlEntities(discussion.excerpt)}
      </p>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-gray-50 pt-3">
        <div className="flex gap-4">
          {/* Like Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onVote(discussion.id, 'like');
            }}
            className={`
              flex items-center gap-1.5 px-2 py-1 rounded-lg text-sm transition-all duration-200
              ${discussion.user_vote === 'like'
                ? 'text-green-600 bg-green-50 font-medium'
                : 'text-gray-400 hover:text-green-500 hover:bg-green-50'
              }
            `}
          >
            <i className={`${discussion.user_vote === 'like' ? 'fa-solid' : 'fa-regular'} fa-thumbs-up`}></i>
            <span>{discussion.like_count || 0}</span>
          </button>

          {/* Dislike Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onVote(discussion.id, 'dislike');
            }}
            className={`
              flex items-center gap-1.5 px-2 py-1 rounded-lg text-sm transition-all duration-200
              ${discussion.user_vote === 'dislike'
                ? 'text-red-600 bg-red-50 font-medium'
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }
            `}
          >
            <i className={`${discussion.user_vote === 'dislike' ? 'fa-solid' : 'fa-regular'} fa-thumbs-down`}></i>
            <span>{discussion.dislike_count || 0}</span>
          </button>
          <Link 
            href={`/topluluk/${discussion.slug}`}
            className="flex items-center gap-1 text-gray-400 hover:text-blue-500 text-sm transition-colors"
          >
            <i className="fa-regular fa-comment"></i> {discussion.comment_count} Cevap
          </Link>
        </div>
        <button 
          onClick={() => toggleFavorite(discussion.id, 'discussion')}
          className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors"
        >
          <i className={`${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
        </button>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [topContributors, setTopContributors] = useState<TopContributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCircleId, setSelectedCircleId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDebounceTimer, setSearchDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  
  const { toggleFavorite, isFavorite } = useFavorites();

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
        
        // Ensure all discussions have default values for vote counts
        const discussionsWithDefaults = discussionsData.discussions.map(ensureDiscussionDefaults);
        
        setCircles(circlesData);
        setDiscussions(discussionsWithDefaults);
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
      
      // Ensure all discussions have default values for vote counts
      const discussionsWithDefaults = discussionsData.discussions.map(ensureDiscussionDefaults);
      
      setDiscussions(discussionsWithDefaults);
    } catch (err) {
      console.error('Error filtering discussions:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(query: string) {
    setSearchQuery(query);
    
    // Clear existing timer
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }
    
    // Set new timer for debounced search
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        
        const discussionsData = await getDiscussions({
          circle_id: selectedCircleId || undefined,
          per_page: 20,
          search: query.trim() || undefined
        });
        
        // Ensure all discussions have default values for vote counts
        const discussionsWithDefaults = discussionsData.discussions.map(ensureDiscussionDefaults);
        
        setDiscussions(discussionsWithDefaults);
      } catch (err) {
        console.error('Error searching discussions:', err);
      } finally {
        setLoading(false);
      }
    }, 500);
    
    setSearchDebounceTimer(timer);
  }

  async function handleVote(discussionId: number, voteType: 'like' | 'dislike') {
    try {
      const result = await voteDiscussion(discussionId, voteType);
      console.log('Vote result:', result); // Debug için
      
      if (result.success) {
        // Update the discussion using optimistic update based on action
        setDiscussions(prev => prev.map(d => {
          if (d.id === discussionId) {
            let newLikeCount = d.like_count;
            let newDislikeCount = d.dislike_count;
            let newUserVote: 'like' | 'dislike' | null = d.user_vote;
            
            // If API returns counts directly, use them
            if (result.like_count !== undefined && result.dislike_count !== undefined) {
              newLikeCount = result.like_count;
              newDislikeCount = result.dislike_count;
              newUserVote = result.user_vote as 'like' | 'dislike' | null;
            } else if (result.action) {
              // Optimistic update based on action
              if (result.action === 'added') {
                // New vote added
                newUserVote = voteType;
                if (voteType === 'like') {
                  newLikeCount = d.like_count + 1;
                } else {
                  newDislikeCount = d.dislike_count + 1;
                }
              } else if (result.action === 'removed') {
                // Vote removed (clicked same button again)
                newUserVote = null;
                if (voteType === 'like') {
                  newLikeCount = Math.max(0, d.like_count - 1);
                } else {
                  newDislikeCount = Math.max(0, d.dislike_count - 1);
                }
              } else if (result.action === 'updated' || result.action === 'changed') {
                // Vote changed (from like to dislike or vice versa)
                newUserVote = voteType;
                if (voteType === 'like') {
                  newLikeCount = d.like_count + 1;
                  newDislikeCount = Math.max(0, d.dislike_count - 1);
                } else {
                  newDislikeCount = d.dislike_count + 1;
                  newLikeCount = Math.max(0, d.like_count - 1);
                }
              }
            }
            
            const updated = { 
              ...d, 
              like_count: newLikeCount, 
              dislike_count: newDislikeCount, 
              user_vote: newUserVote 
            };
            console.log('Updated discussion:', updated); // Debug
            return updated;
          }
          return d;
        }));
      }
    } catch (err) {
      console.error('Error voting on discussion:', err);
      toast.error('Oy kullanırken bir hata oluştu. Lütfen giriş yaptığınızdan emin olun.');
    }
  }

  const myCircles = circles.filter(c => c.is_following);
  
  // Helper function to get placeholder avatar colors for top contributors
  const getContributorAvatarColor = (index: number): string => {
    const colors = ['FFAB91', '80CBC4', 'CE93D8'];
    return colors[index] || 'CE93D8';
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* MOBILE HEADER (Sticky) */}
      <div className="lg:hidden bg-white px-4 pt-[25px] py-3 flex items-center justify-between shadow-sm sticky top-20 z-30 border-b border-gray-100">
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
                        <h3 className="font-bold text-slate-800 text-sm">Odaklarım</h3>
                    </div>
                    <nav className="p-2 space-y-1">
                        {loading ? (
                          <div className="px-3 py-2 text-gray-400 text-sm">Yükleniyor...</div>
                        ) : myCircles.length === 0 ? (
                          <div className="px-3 py-2 text-gray-400 text-sm">Henüz takip ettiğiniz odak yok</div>
                        ) : (
                          myCircles.map((circle) => (
                            <Link 
                              key={circle.id}
                              href={`/topluluk/odak/${circle.slug}`}
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
                          <h3 className="font-bold text-slate-800 text-sm">Tüm Odaklar</h3>
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

                {/* Search Box */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="relative">
                        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Sorularda ara..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-full pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                        />
                    </div>
                </div>

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
                  <DiscussionCard 
                    key={discussion.id} 
                    discussion={discussion} 
                    onVote={handleVote}
                    toggleFavorite={toggleFavorite}
                    isFavorite={isFavorite(discussion.id, 'discussion')}
                  />
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
                        <li className="flex items-start gap-2"><i className="fa-solid fa-check text-green-500 mt-0.5"></i> Reklam içerikli paylaşım yapmayın.</li>
                    </ul>
                    <Link href="/kullanim-kosullari" className="mt-3 inline-block text-xs text-orange-500 font-bold hover:underline">
                      Kullanıcı Sözleşmesini Okuyun
                    </Link>
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
                              src={contributor.avatar || `https://placehold.co/100x100/${getContributorAvatarColor(index)}/ffffff?text=${contributor.name.charAt(0)}`} 
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