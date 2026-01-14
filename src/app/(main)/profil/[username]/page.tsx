'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { userService } from '@/services/user-service';
import { PublicProfile } from '@/lib/types';

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username) {
      fetchPublicProfile();
    }
  }, [username]);

  const fetchPublicProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Remove @ symbol if present
      const cleanUsername = username.startsWith('@') ? username.slice(1) : username;
      const data = await userService.getPublicProfile(cleanUsername);
      setProfile(data);
    } catch (err) {
      console.error('Public profile fetch error:', err);
      setError(err instanceof Error ? err.message : 'Profil yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-user-slash text-red-500 text-2xl"></i>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Profil Bulunamadı</h2>
          <p className="text-gray-600 mb-4">
            {error || 'Aradığınız kullanıcı bulunamadı veya profili gizli.'}
          </p>
          <Link
            href="/topluluk"
            className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full font-bold hover:bg-orange-600 transition-colors"
          >
            Topluluğa Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-300 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Avatar */}
          <div className="mb-6">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-xl mx-auto object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl mx-auto bg-white/20 flex items-center justify-center text-5xl font-bold">
                {profile.display_name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Name and Role */}
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">
            {profile.display_name}
          </h1>
          {profile.parent_role && (
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full mb-4">
              <i className="fa-solid fa-heart"></i>
              <span className="font-bold">{profile.parent_role}</span>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.stats.question_count}</div>
              <div className="text-xs text-orange-100">Soru</div>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.stats.approved_comments}</div>
              <div className="text-xs text-orange-100">Yorum</div>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold">{profile.badges.length}</div>
              <div className="text-xs text-orange-100">Rozet</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Badges Section */}
        {profile.badges.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <h2 className="font-bold text-xl text-slate-800 mb-4 flex items-center">
              <i className="fa-solid fa-award text-yellow-500 mr-2"></i>
              Kazanılan Rozetler
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {profile.badges.map((badge, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200 text-center"
                >
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fa-solid fa-medal text-white text-xl"></i>
                  </div>
                  <p className="font-bold text-sm text-slate-800">{badge}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Questions */}
        {profile.recent_questions && profile.recent_questions.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-xl text-slate-800 mb-4 flex items-center">
              <i className="fa-solid fa-comment-dots text-purple-500 mr-2"></i>
              Son Sorular
            </h2>
            <div className="space-y-4">
              {profile.recent_questions.map((question) => (
                <Link
                  key={question.id}
                  href={`/topluluk/soru/${question.slug}`}
                  className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {question.circle && (
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${question.circle.color_code}20` }}
                      >
                        <i
                          className={`${question.circle.icon}`}
                          style={{ color: question.circle.color_code }}
                        ></i>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 mb-1">{question.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {question.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>
                          <i className="fa-solid fa-comment mr-1"></i>
                          {question.comment_count} yorum
                        </span>
                        {question.expert_answered && (
                          <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full font-bold">
                            <i className="fa-solid fa-check mr-1"></i>
                            Uzman Cevapladı
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!profile.recent_questions || profile.recent_questions.length === 0) && (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-comments text-gray-400 text-2xl"></i>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Henüz Soru Yok</h3>
            <p className="text-gray-600 mb-4">
              {profile.display_name} henüz toplulukta soru sormamış.
            </p>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <i className="fa-solid fa-shield-halved text-blue-500 text-xl mt-0.5"></i>
            <div>
              <h4 className="font-bold text-blue-800 mb-1">Gizlilik Koruması</h4>
              <p className="text-sm text-blue-700">
                Bu profilde çocuk isimleri, fotoğrafları veya kişisel bilgiler asla gösterilmez.
                Tüm kullanıcı verileri KVKK kapsamında korunmaktadır.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
