"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { userService } from '@/services/user-service';
import { ExpertPublicProfile } from '@/lib/types';

type TabType = 'recipes' | 'blog_posts' | 'answered_questions' | 'asked_questions';

// Helper function to validate and sanitize color codes
function sanitizeColor(color: string): string {
  // Only allow valid hex colors
  if (/^#[0-9A-Fa-f]{6}$/.test(color) || /^#[0-9A-Fa-f]{3}$/.test(color)) {
    return color;
  }
  // Default fallback color
  return '#6366f1'; // indigo-500
}

export default function ExpertPublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  
  const [profile, setProfile] = useState<ExpertPublicProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('recipes');
  // Pagination state'leri
  const [recipesLimit, setRecipesLimit] = useState(6);
  const [postsLimit, setPostsLimit] = useState(5);
  const [answersLimit, setAnswersLimit] = useState(5);
  const [questionsLimit, setQuestionsLimit] = useState(5);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getExpertPublicProfile(username);
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Profil yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Profil yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-user-slash text-3xl text-red-500"></i>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Kullanıcı Bulunamadı</h1>
          <p className="text-gray-600 mb-6">{error || 'Bu kullanıcı adına sahip bir uzman profili bulunamadı.'}</p>
          <Link href="/" className="inline-block bg-purple-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-600 transition-colors">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'recipes' as TabType, label: 'Tarifler', count: profile.stats.total_recipes },
    { id: 'blog_posts' as TabType, label: 'Blog Yazıları', count: profile.stats.total_blog_posts },
    { id: 'answered_questions' as TabType, label: 'Cevapları', count: profile.stats.total_answers },
    { id: 'asked_questions' as TabType, label: 'Soruları', count: profile.stats.total_questions },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
        
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.display_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-purple-200 flex items-center justify-center text-purple-600 text-5xl font-bold">
                    {profile.display_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              {/* Verified Badge */}
              <div className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <i className="fa-solid fa-check text-white text-sm"></i>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">{profile.display_name}</h1>
              <p className="text-purple-200 font-medium mb-4">@{profile.username}</p>
              
              {/* Profession Badge - Show first expertise if available */}
              {profile.expertise && profile.expertise.length > 0 && (
                <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                  <span className="font-bold">{profile.expertise[0]}</span>
                </div>
              )}

              {/* Expertise Tags */}
              {profile.expertise && profile.expertise.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  {profile.expertise.map((skill, index) => (
                    <span key={index} className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Social Links */}
              {profile.social_links && (
                <div className="flex gap-3 justify-center md:justify-start">
                  {profile.social_links.instagram && (
                    <a href={profile.social_links.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                      <i className="fa-brands fa-instagram"></i>
                    </a>
                  )}
                  {profile.social_links.twitter && (
                    <a href={profile.social_links.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                      <i className="fa-brands fa-twitter"></i>
                    </a>
                  )}
                  {profile.social_links.linkedin && (
                    <a href={profile.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                      <i className="fa-brands fa-linkedin"></i>
                    </a>
                  )}
                  {profile.social_links.youtube && (
                    <a href={profile.social_links.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                      <i className="fa-brands fa-youtube"></i>
                    </a>
                  )}
                  {profile.social_links.website && (
                    <a href={profile.social_links.website} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                      <i className="fa-solid fa-globe"></i>
                    </a>
                  )}
                  {profile.email && profile.show_email && (
                    <a href={`mailto:${profile.email}`} className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                      <i className="fa-solid fa-envelope"></i>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">{profile.stats.total_recipes}</div>
            <div className="text-sm text-gray-600 font-medium">Tarif</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-1">{profile.stats.total_blog_posts}</div>
            <div className="text-sm text-gray-600 font-medium">Blog Yazısı</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">{profile.stats.total_answers}</div>
            <div className="text-sm text-gray-600 font-medium">Cevap</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">{profile.stats.total_questions}</div>
            <div className="text-sm text-gray-600 font-medium">Soru</div>
          </div>
        </div>
      </div>

      {/* Biography Section */}
      {profile.biography && (
        <div className="max-w-6xl mx-auto px-4 mt-8">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-quote-left text-purple-500"></i>
              Hakkında
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{profile.biography}</p>
          </div>
        </div>
      )}

      {/* Content Tabs */}
      <div className="max-w-6xl mx-auto px-4 mt-8 pb-12">
        {/* Tab Navigation */}
        <div className="bg-white rounded-t-2xl shadow-md overflow-x-auto">
          <div className="flex border-b border-gray-200 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 font-bold transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-purple-600 bg-purple-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-purple-200 text-purple-700'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-2xl shadow-md p-6 md:p-8">
          {/* Recipes Tab */}
          {activeTab === 'recipes' && (
            <div>
              {profile.recipes && profile.recipes.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profile.recipes.slice(0, recipesLimit).map((recipe) => (
                      <Link
                        key={recipe.id}
                        href={`/tarifler/${recipe.slug}`}
                        className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
                      >
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">
                            {recipe.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <i className="fa-regular fa-clock"></i>
                              {recipe.prep_time}
                            </span>
                            <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded-lg text-xs font-bold">
                              {recipe.age_group}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  {profile.recipes.length > recipesLimit && (
                    <div className="text-center mt-8">
                      <button
                        onClick={() => setRecipesLimit(prev => prev + 6)}
                        className="bg-purple-100 text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-purple-200 transition-colors"
                      >
                        Daha Fazla Göster ({profile.recipes.length - recipesLimit} tarif daha)
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <i className="fa-solid fa-utensils text-5xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">Henüz tarif paylaşılmamış</p>
                </div>
              )}
            </div>
          )}

          {/* Blog Posts Tab */}
          {activeTab === 'blog_posts' && (
            <div>
              {profile.blog_posts && profile.blog_posts.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {profile.blog_posts.slice(0, postsLimit).map((post) => (
                      <Link
                        key={post.id}
                        href={`/kesfet/${post.slug}`}
                        className="group flex gap-4 bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-lg transition-all"
                      >
                        <div className="w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">
                            {post.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-lg font-bold">
                              {post.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <i className="fa-regular fa-clock"></i>
                              {post.read_time}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  {profile.blog_posts.length > postsLimit && (
                    <div className="text-center mt-8">
                      <button
                        onClick={() => setPostsLimit(prev => prev + 5)}
                        className="bg-purple-100 text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-purple-200 transition-colors"
                      >
                        Daha Fazla Göster ({profile.blog_posts.length - postsLimit} yazı daha)
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <i className="fa-solid fa-blog text-5xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">Henüz blog yazısı paylaşılmamış</p>
                </div>
              )}
            </div>
          )}

          {/* Answered Questions Tab */}
          {activeTab === 'answered_questions' && (
            <div>
              {profile.answered_questions && profile.answered_questions.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {profile.answered_questions.slice(0, answersLimit).map((question) => (
                      <Link
                        key={question.id}
                        href={`/topluluk/${question.slug}`}
                        className="group block bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all"
                      >
                        <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">
                          {question.title}
                        </h3>
                        <p className="text-gray-600 mb-3 line-clamp-2">{question.answer_excerpt}</p>
                        <div className="text-sm text-gray-500">
                          <i className="fa-regular fa-calendar mr-1"></i>
                          Cevaplandı: {new Date(question.answered_at).toLocaleDateString('tr-TR')}
                        </div>
                      </Link>
                    ))}
                  </div>
                  {profile.answered_questions.length > answersLimit && (
                    <div className="text-center mt-8">
                      <button
                        onClick={() => setAnswersLimit(prev => prev + 5)}
                        className="bg-purple-100 text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-purple-200 transition-colors"
                      >
                        Daha Fazla Göster ({profile.answered_questions.length - answersLimit} cevap daha)
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <i className="fa-solid fa-comment-dots text-5xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">Henüz soru cevaplamadı</p>
                </div>
              )}
            </div>
          )}

          {/* Asked Questions Tab */}
          {activeTab === 'asked_questions' && (
            <div>
              {profile.asked_questions && profile.asked_questions.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {profile.asked_questions.slice(0, questionsLimit).map((question) => (
                      <Link
                        key={question.id}
                        href={`/topluluk/${question.slug}`}
                        className="group block bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {question.circle && (
                            <span 
                              className="px-2 py-1 rounded-lg text-xs font-bold"
                              style={{ 
                                backgroundColor: `${sanitizeColor(question.circle.color_code)}20`, 
                                color: sanitizeColor(question.circle.color_code) 
                              }}
                            >
                              {question.circle.icon} {question.circle.name}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">
                          {question.title}
                        </h3>
                        <p className="text-gray-600 mb-3 line-clamp-2">{question.excerpt}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <i className="fa-regular fa-comment"></i>
                            {question.comment_count} cevap
                          </span>
                          <span>
                            <i className="fa-regular fa-calendar mr-1"></i>
                            {new Date(question.created_at).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  {profile.asked_questions.length > questionsLimit && (
                    <div className="text-center mt-8">
                      <button
                        onClick={() => setQuestionsLimit(prev => prev + 5)}
                        className="bg-purple-100 text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-purple-200 transition-colors"
                      >
                        Daha Fazla Göster ({profile.asked_questions.length - questionsLimit} soru daha)
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <i className="fa-solid fa-question text-5xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">Henüz soru sormadı</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
