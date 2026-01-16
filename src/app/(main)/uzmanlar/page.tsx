"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userService } from '@/services/user-service';
import { ExpertPublicProfile } from '@/lib/types';

// Helper function to convert string to URL-safe slug
function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')                   // Normalize to decomposed form
    .replace(/[\u0300-\u036f]/g, '')    // Remove diacritics
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')               // Replace spaces with -
    .replace(/[^\w\-]+/g, '')           // Remove all non-word chars except -
    .replace(/\-\-+/g, '-')             // Replace multiple - with single -
    .replace(/^-+/, '')                 // Trim - from start
    .replace(/-+$/, '');                // Trim - from end
}

export default function ExpertsListPage() {
  const router = useRouter();
  const [experts, setExperts] = useState<ExpertPublicProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExperts() {
      try {
        setLoading(true);
        const data = await userService.getExperts();
        setExperts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Uzmanlar yüklenirken hata:', err);
        setError('Uzmanlar yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }
    fetchExperts();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-green-600 font-bold text-sm tracking-widest uppercase mb-2 block">
              Uzman Kadromuz
            </span>
            <h1 className="font-bold text-4xl md:text-5xl text-slate-800 mb-4">
              KidsGourmet <span className="text-green-500">Uzmanları</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Çocuk beslenmesi ve sağlığı konusunda uzman diyetisyen ve doktorlarımızla tanışın.
            </p>
          </div>
        </div>
      </div>

      {/* Experts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {experts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experts.map((expert) => (
              <div
                key={expert.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group cursor-pointer"
                onClick={() => router.push(`/uzman/${slugify(expert.display_name)}`)}
              >
                {/* Header with Avatar */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 text-center border-b border-gray-100">
                  <div className="relative inline-block">
                    {expert.avatar_url ? (
                      <img
                        src={expert.avatar_url}
                        alt={expert.display_name}
                        className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover mx-auto"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-3xl font-bold border-4 border-white shadow-md mx-auto">
                        {expert.display_name?.charAt(0).toUpperCase() || '?'}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs border-2 border-white">
                      <i className="fa-solid fa-check"></i>
                    </div>
                  </div>
                  <h3 className="font-bold text-xl text-slate-800 mt-4 group-hover:text-green-600 transition-colors">
                    {expert.display_name}
                  </h3>
                  {expert.expertise && expert.expertise.length > 0 && (
                    <p className="text-green-600 text-sm font-medium mt-1">
                      {expert.expertise.join(' • ')}
                    </p>
                  )}
                </div>

                {/* Body */}
                <div className="p-6">
                  {/* Biography */}
                  {expert.biography && (
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {expert.biography}
                    </p>
                  )}

                  {/* Social Links */}
                  {expert.social_links && Object.keys(expert.social_links).length > 0 && (
                    <div className="flex gap-2 mb-4">
                      {expert.social_links.instagram && (
                        <a
                          href={expert.social_links.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-8 h-8 bg-pink-50 text-pink-500 rounded-lg flex items-center justify-center hover:bg-pink-100 transition-colors"
                        >
                          <i className="fa-brands fa-instagram"></i>
                        </a>
                      )}
                      {expert.social_links.facebook && (
                        <a
                          href={expert.social_links.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
                        >
                          <i className="fa-brands fa-facebook-f"></i>
                        </a>
                      )}
                      {expert.social_links.twitter && (
                        <a
                          href={expert.social_links.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-8 h-8 bg-sky-50 text-sky-500 rounded-lg flex items-center justify-center hover:bg-sky-100 transition-colors"
                        >
                          <i className="fa-brands fa-twitter"></i>
                        </a>
                      )}
                      {expert.social_links.linkedin && (
                        <a
                          href={expert.social_links.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
                        >
                          <i className="fa-brands fa-linkedin-in"></i>
                        </a>
                      )}
                      {expert.social_links.youtube && (
                        <a
                          href={expert.social_links.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors"
                        >
                          <i className="fa-brands fa-youtube"></i>
                        </a>
                      )}
                      {expert.social_links.website && (
                        <a
                          href={expert.social_links.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-8 h-8 bg-gray-50 text-gray-500 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <i className="fa-solid fa-globe"></i>
                        </a>
                      )}
                    </div>
                  )}

                  {/* Stats */}
                  {expert.stats && (
                    <div className="flex gap-4 pt-4 border-t border-gray-100">
                      {expert.stats.total_recipes !== undefined && expert.stats.total_recipes > 0 && (
                        <div className="text-center flex-1">
                          <div className="font-bold text-slate-800">{expert.stats.total_recipes}</div>
                          <div className="text-xs text-gray-500">Tarif</div>
                        </div>
                      )}
                      {((expert.stats.total_blog_posts !== undefined && expert.stats.total_blog_posts > 0) || 
                        (expert.stats.total_posts !== undefined && expert.stats.total_posts > 0)) && (
                        <div className="text-center flex-1 border-l border-gray-100">
                          <div className="font-bold text-slate-800">
                            {expert.stats.total_blog_posts || expert.stats.total_posts || 0}
                          </div>
                          <div className="text-xs text-gray-500">Yazı</div>
                        </div>
                      )}
                      {expert.stats.total_answers !== undefined && expert.stats.total_answers > 0 && (
                        <div className="text-center flex-1 border-l border-gray-100">
                          <div className="font-bold text-slate-800">{expert.stats.total_answers}</div>
                          <div className="text-xs text-gray-500">Cevap</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* CTA */}
                  <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                    <span className="text-green-500 font-bold text-sm group-hover:underline">
                      Profili Görüntüle <i className="fa-solid fa-arrow-right ml-1"></i>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <i className="fa-solid fa-user-doctor text-4xl mb-4 text-gray-300 block"></i>
            <p>Henüz uzman eklenmemiş.</p>
          </div>
        )}
      </div>
    </div>
  );
}
