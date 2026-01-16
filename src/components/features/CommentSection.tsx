'use client';

import React, { useState, useEffect } from 'react';
import { commentService, Comment } from '@/services/comment-service';
import { useUser } from '@/hooks/use-user';
import { toast } from 'sonner';
import { formatRelativeTime, sanitizeHTML } from '@/utils/helpers';
import { useRouter } from 'next/navigation';

interface CommentSectionProps {
  postId: number;
  postType: 'post' | 'recipe';
  initialCommentCount?: number;
}

export default function CommentSection({ postId, postType, initialCommentCount = 0 }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user, isAuthenticated } = useUser();
  const router = useRouter();

  useEffect(() => {
    async function fetchComments() {
      try {
        setLoading(true);
        const data = await commentService.getComments(postId);
        setComments(data);
      } catch (error) {
        console.error('Yorumlar yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Yorum yapmak için giriş yapmalısınız', {
        action: {
          label: 'Giriş Yap',
          onClick: () => {
            const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
            router.push('/giris?redirect=' + encodeURIComponent(currentPath));
          }
        }
      });
      return;
    }

    if (!commentText.trim()) return;

    try {
      setSubmitting(true);
      const newComment = await commentService.addComment({
        post: postId,
        content: commentText.trim(),
      });
      setComments(prev => [...prev, newComment]);
      setCommentText('');
      toast.success('Yorumunuz eklendi!');
    } catch (error) {
      console.error('Yorum eklenirken hata:', error);
      toast.error('Yorum eklenirken bir hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  const getAvatarUrl = (comment: Comment) => {
    const urls = comment.author_avatar_urls;
    return urls?.['96'] || urls?.['48'] || urls?.['24'] || null;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
      <h3 className="font-bold text-xl text-slate-800 mb-6 flex items-center">
        <i className="fa-regular fa-comments text-orange-500 mr-3"></i>
        Yorumlar ({comments.length || initialCommentCount})
      </h3>

      {/* Yorum Formu */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3">
          {isAuthenticated && user ? (
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold flex-shrink-0">
              {user.display_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
              <i className="fa-regular fa-user"></i>
            </div>
          )}
          <div className="flex-1">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={isAuthenticated ? "Yorumunuzu yazın..." : "Yorum yapmak için giriş yapın..."}
              disabled={!isAuthenticated || submitting}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={!isAuthenticated || submitting || !commentText.trim()}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane"></i>
                    Yorum Yap
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Yorum Listesi */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => {
            const avatarUrl = getAvatarUrl(comment);
            return (
              <div key={comment.id} className="flex gap-3">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={comment.author_name}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold flex-shrink-0">
                    {comment.author_name?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-800 text-sm">{comment.author_name}</span>
                    <span className="text-xs text-gray-400">{formatRelativeTime(comment.date)}</span>
                  </div>
                  <div
                    className="text-gray-600 text-sm prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(comment.content.rendered) }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <i className="fa-regular fa-comment-dots text-4xl mb-3 block text-gray-300"></i>
          <p>Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
        </div>
      )}
    </div>
  );
}
