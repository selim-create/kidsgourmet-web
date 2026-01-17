"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { use } from 'react';
import { toast } from 'sonner';
import { getDiscussionBySlug, getDiscussionComments, addComment, getDiscussions } from '@/lib/community';
import { formatRelativeTime, sanitizeHTML } from '@/utils/helpers';
import type { Discussion, DiscussionComment } from '@/lib/types';
import { EditButton } from '@/components/ui/EditButton';

export default function CommunityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [comments, setComments] = useState<DiscussionComment[]>([]);
  const [relatedDiscussions, setRelatedDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        // First fetch discussion to get its ID
        const discussionData = await getDiscussionBySlug(slug);
        setDiscussion(discussionData);
        
        // Then fetch comments with the discussion ID
        const fetchedComments = await getDiscussionComments(discussionData.id);
        setComments(fetchedComments);
        
        // Fetch related discussions from the same circle
        if (discussionData.circle) {
          try {
            const relatedData = await getDiscussions({
              circle_id: discussionData.circle.id,
              per_page: 4 // Get 4 so we can exclude current and show 3
            });
            // Filter out current discussion and limit to 3
            const filtered = relatedData.discussions
              .filter(d => d.id !== discussionData.id)
              .slice(0, 3);
            setRelatedDiscussions(filtered);
          } catch (relErr) {
            console.error('Error fetching related discussions:', relErr);
            // Don't set error state, just leave related empty
          }
        }
      } catch (err) {
        console.error('Error fetching discussion:', err);
        setError('Tartışma yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    
    if (!commentText.trim() || !discussion) {
      return;
    }

    try {
      setSubmittingComment(true);
      await addComment(discussion.id, commentText.trim());
      
      // Refresh comments
      const updatedComments = await getDiscussionComments(discussion.id);
      setComments(updatedComments);
      
      setCommentText('');
      toast.success('Yorumunuz eklendi');
    } catch (err) {
      console.error('Error submitting comment:', err);
      toast.error('Yorum eklenirken bir hata oluştu. Lütfen giriş yaptığınızdan emin olun.');
    } finally {
      setSubmittingComment(false);
    }
  }

  // Separate expert and non-expert comments
  const expertComments = comments.filter(c => c.is_expert_comment);
  const regularComments = comments.filter(c => !c.is_expert_comment);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen pb-24 lg:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-500">Tartışma yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !discussion) {
    return (
      <div className="bg-gray-50 min-h-screen pb-24 lg:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error || 'Tartışma bulunamadı'}
          </div>
          <Link href="/topluluk" className="inline-block mt-4 text-orange-500 hover:underline font-bold">
            ← Topluluğa Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24 lg:pb-12">
        
        {/* MOBILE BACK HEADER */}
        <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-20 z-40">
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
                            <li><Link href="/topluluk" className="hover:text-orange-500">Topluluk</Link></li>
                            <li><i className="fa-solid fa-chevron-right text-xs text-gray-300"></i></li>
                            {discussion.circle && (
                              <>
                                <li><Link href={`/topluluk/cember/${discussion.circle.slug}`} className="hover:text-orange-500">{discussion.circle.name}</Link></li>
                                <li><i className="fa-solid fa-chevron-right text-xs text-gray-300"></i></li>
                              </>
                            )}
                            <li className="font-medium text-slate-800">Tartışma Detayı</li>
                        </ol>
                    </nav>

                    {/* THE QUESTION POST */}
                    <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative group">
                        {/* User Info */}
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex gap-4">
                                <img 
                                  src={discussion.author.avatar || `https://placehold.co/100x100/FFF9C4/FBC02D?text=${discussion.author.name.charAt(0)}`}
                                  className="w-12 h-12 rounded-full border border-gray-100" 
                                  alt={discussion.author.name} 
                                />
                                <div>
                                    <h3 className="font-bold text-slate-800 text-base">{discussion.author.name}</h3>
                                    <p className="text-xs text-gray-400">{formatRelativeTime(discussion.created_at)}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {discussion.circle && (
                                  <span 
                                    className="px-3 py-1 rounded-full text-xs font-bold"
                                    style={{ 
                                      backgroundColor: `${discussion.circle.color_code}20`,
                                      color: discussion.circle.color_code
                                    }}
                                  >
                                    {discussion.circle.name}
                                  </span>
                                )}
                                <button className="text-gray-400 hover:text-slate-800 px-2"><i className="fa-solid fa-ellipsis"></i></button>
                            </div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-800 leading-tight font-sans">
                            {discussion.title}
                          </h1>
                          <EditButton 
                            contentType="discussion" 
                            contentId={discussion.id}
                            authorId={discussion.author.id}
                            variant="icon"
                          />
                        </div>
                        <div 
                          className="text-gray-600 text-lg leading-relaxed mb-6 whitespace-pre-line"
                          dangerouslySetInnerHTML={{ __html: sanitizeHTML(discussion.content || discussion.excerpt) }}
                        />

                        {/* Stats & Share */}
                        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                            <div className="flex gap-6">
                                <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors font-medium">
                                    <i className="fa-regular fa-heart text-xl"></i>
                                </button>
                                <button className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors font-medium">
                                    <i className="fa-regular fa-comment text-xl"></i> {discussion.comment_count} Cevap
                                </button>
                            </div>
                            <button className="text-gray-400 hover:text-brand-secondary transition-colors">
                                <i className="fa-solid fa-share-nodes text-xl"></i>
                            </button>
                        </div>
                    </div>

                    {/* EXPERT ANSWERS (Pinned) */}
                    {expertComments.map((comment) => (
                      <div key={comment.id} className="bg-green-50/50 p-6 md:p-8 rounded-[2rem] border-2 border-green-100 shadow-sm relative overflow-hidden">
                          <div className="absolute top-0 left-0 bg-green-100 text-green-700 text-xs font-bold px-4 py-1.5 rounded-br-2xl border-r border-b border-green-200">
                              <i className="fa-solid fa-check-circle mr-1"></i> Uzman Cevabı
                          </div>

                          <div className="flex gap-4 mb-4 mt-4">
                              <img 
                                src={comment.author.avatar || `https://placehold.co/100x100/AED581/ffffff?text=${comment.author.name.charAt(0)}`}
                                className="w-12 h-12 rounded-full border-2 border-white shadow-sm" 
                                alt={comment.author.name} 
                              />
                              <div>
                                  <h3 className="font-bold text-slate-800 text-sm">
                                    {comment.author.name} <i className="fa-solid fa-circle-check text-green-500 ml-1"></i>
                                  </h3>
                                  <p className="text-xs text-green-600 font-medium">{formatRelativeTime(comment.created_at)}</p>
                              </div>
                          </div>

                          <div 
                            className="prose prose-sm prose-green max-w-none text-slate-700"
                            dangerouslySetInnerHTML={{ __html: sanitizeHTML(comment.content) }}
                          />
                      </div>
                    ))}

                    {/* COMMUNITY REPLIES */}
                    {regularComments.length > 0 && (
                      <div className="space-y-6 pt-4">
                          <h3 className="font-bold text-slate-800 text-lg px-2">
                            Diğer Cevaplar ({regularComments.length})
                          </h3>

                          {regularComments.map((comment) => (
                            <div key={comment.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                <div className="flex justify-between mb-3">
                                    <div className="flex gap-3">
                                        <img 
                                          src={comment.author.avatar || `https://placehold.co/100x100/FFAB91/ffffff?text=${comment.author.name.charAt(0)}`}
                                          className="w-10 h-10 rounded-full bg-gray-100" 
                                          alt={comment.author.name} 
                                        />
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm">{comment.author.name}</h4>
                                            <p className="text-xs text-gray-400">{formatRelativeTime(comment.created_at)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div 
                                  className="text-sm text-gray-600 mb-3"
                                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(comment.content) }}
                                />
                                <div className="flex gap-4">
                                    <button className="text-xs font-bold text-gray-500 hover:text-orange-500">
                                      <i className="fa-regular fa-thumbs-up mr-1"></i> Beğen
                                    </button>
                                    <button className="text-xs font-bold text-gray-500 hover:text-orange-500">Yanıtla</button>
                                </div>
                            </div>
                          ))}
                      </div>
                    )}

                </main>

                {/* RIGHT SIDEBAR (Related) */}
                <aside className="hidden lg:block lg:col-span-1 space-y-6">
                    
                    {/* Related Discussions */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 text-sm mb-4">Benzer Konular</h3>
                        {relatedDiscussions.length === 0 ? (
                          <p className="text-xs text-gray-400">Benzer konu bulunamadı</p>
                        ) : (
                          <div className="space-y-4">
                            {relatedDiscussions.map((related, index) => (
                              <React.Fragment key={related.id}>
                                {index > 0 && <hr className="border-gray-50" />}
                                <Link href={`/topluluk/${related.slug}`} className="block group">
                                  <h4 className="text-sm font-medium text-slate-700 group-hover:text-orange-500 transition-colors line-clamp-2">
                                    {related.title}
                                  </h4>
                                  <p className="text-xs text-gray-400 mt-1">{related.comment_count} Cevap</p>
                                </Link>
                              </React.Fragment>
                            ))}
                          </div>
                        )}
                    </div>

                    {/* Faydalı Araçlar Widget */}
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center text-sm uppercase tracking-wider">
                        <i className="fa-solid fa-wand-magic-sparkles text-orange-500 mr-2"></i> 
                        Faydalı Araçlar
                      </h3>
                      <div className="space-y-2">
                        {[
                          { name: 'BLW Hazırlık Testi', slug: 'blw-testi', icon: 'fa-baby', color: 'text-pink-500', bg: 'bg-pink-50' },
                          { name: 'Persentil Hesaplayıcı', slug: 'persentil', icon: 'fa-chart-line', color: 'text-blue-500', bg: 'bg-blue-50' },
                          { name: 'Su İhtiyacı', slug: 'su-ihtiyaci', icon: 'fa-droplet', color: 'text-cyan-500', bg: 'bg-cyan-50' },
                          { name: 'Bu Gıda Verilir mi?', slug: 'bu-gida-verilir-mi', icon: 'fa-circle-question', color: 'text-amber-500', bg: 'bg-amber-50' },
                        ].map((tool) => (
                          <Link
                            key={tool.slug}
                            href={`/akilli-asistan/${tool.slug}`}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                          >
                            <div className={`w-10 h-10 ${tool.bg} rounded-xl flex items-center justify-center`}>
                              <i className={`fa-solid ${tool.icon} ${tool.color}`}></i>
                            </div>
                            <span className="font-medium text-slate-700 group-hover:text-orange-500 transition-colors text-sm">
                              {tool.name}
                            </span>
                            <i className="fa-solid fa-chevron-right text-gray-300 ml-auto text-xs"></i>
                          </Link>
                        ))}
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
                    <form onSubmit={handleSubmitComment} className="bg-white lg:p-0 rounded-2xl flex gap-3 items-center">
                        <img src="https://placehold.co/100x100/FFCC80/ffffff?text=Siz" className="w-10 h-10 rounded-full bg-gray-100 hidden lg:block" alt="You" />
                        <div className="flex-1 relative">
                            <input 
                              type="text" 
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              disabled={submittingComment}
                              placeholder="Bir cevap yaz..." 
                              className="w-full bg-gray-50 border border-gray-200 rounded-full py-3 px-5 pr-12 text-sm focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50" 
                            />
                            <button 
                              type="submit"
                              disabled={submittingComment || !commentText.trim()}
                              className="absolute right-2 top-1.5 text-orange-500 hover:bg-orange-50 p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submittingComment ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                                ) : (
                                  <i className="fa-solid fa-paper-plane"></i>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    </div>
  );
}