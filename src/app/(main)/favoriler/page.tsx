"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { useFavorites } from '@/hooks/use-favorites';
import { useUser } from '@/hooks/use-user';
import { FavoriteItemType } from '@/lib/types';
import CollectionCard from '@/components/favorites/CollectionCard';
import CreateCollectionModal from '@/components/favorites/CreateCollectionModal';
import FavoriteRecipeCard from '@/components/favorites/FavoriteRecipeCard';
import FavoriteIngredientCard from '@/components/favorites/FavoriteIngredientCard';
import FavoriteBlogCard from '@/components/favorites/FavoriteBlogCard';
import FavoriteDiscussionCard from '@/components/favorites/FavoriteDiscussionCard';

export default function FavoritesPage() {
  const { isAuthenticated, isLoading: authLoading } = useUser();
  const {
    favorites,
    collections,
    isLoading,
    error,
    counts,
    toggleFavorite,
    createCollection,
    deleteCollection,
  } = useFavorites();

  const [activeFilter, setActiveFilter] = useState<FavoriteItemType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const tabs = [
    { name: "Tümü", key: "all" as const, count: counts.all },
    { name: "Tarifler", key: "recipe" as const, count: counts.recipes },
    { name: "Malzemeler", key: "ingredient" as const, count: counts.ingredients },
    { name: "Blog & Rehber", key: "post" as const, count: counts.posts },
    { name: "Topluluk", key: "discussion" as const, count: counts.discussions }
  ];

  // Auth kontrolü
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-heart text-orange-500 text-3xl"></i>
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-800 mb-2">
            Favorilerinize Erişin
          </h2>
          <p className="text-gray-500 mb-6">
            Favori tariflerinizi, malzemelerinizi ve daha fazlasını kaydetmek için giriş yapın.
          </p>
          <Link
            href="/giris"
            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  // Filtrelenmiş içerik
  const getFilteredContent = () => {
    if (!favorites) return { recipes: [], ingredients: [], posts: [], discussions: [] };
    
    const filterBySearch = <T extends { title?: string; name?: string }>(items: T[]) => {
      if (!searchQuery) return items;
      return items.filter(item => {
        const text = item.title || item.name || '';
        return text.toLowerCase().includes(searchQuery.toLowerCase());
      });
    };

    return {
      recipes: activeFilter === 'all' || activeFilter === 'recipe' 
        ? filterBySearch(favorites.recipes || []) : [],
      ingredients: activeFilter === 'all' || activeFilter === 'ingredient'
        ? filterBySearch(favorites.ingredients || []) : [],
      posts: activeFilter === 'all' || activeFilter === 'post'
        ? filterBySearch(favorites.posts || []) : [],
      discussions: activeFilter === 'all' || activeFilter === 'discussion'
        ? filterBySearch(favorites.discussions || []) : [],
    };
  };

  const filtered = getFilteredContent();
  const hasContent = filtered.recipes.length + filtered.ingredients.length + 
                     filtered.posts.length + filtered.discussions.length > 0;

  return (
    <div className="flex min-h-screen relative">

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 flex-col sticky top-20 h-[calc(100vh-5rem)] z-10 overflow-y-auto">
            <nav className="flex-1 px-4 py-6 space-y-2">
                {/* Localde Link kullanın */}
                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
                    <i className="fa-solid fa-house"></i> Genel Bakış
                </Link>
                <Link href="/dashboard/haftalik-plan" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
                    <i className="fa-solid fa-calendar-days"></i> Haftalık Plan
                </Link>
                {/* Active State */}
                <Link href="/favoriler" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-100 text-orange-500 font-bold">
                    <i className="fa-solid fa-heart"></i> Favorilerim
                </Link>
                <Link href="/alisveris-listesi" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
                    <i className="fa-solid fa-basket-shopping"></i> Alışveriş Listesi
                </Link>
                <div className="pt-6 pb-2">
                    <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Hesap</p>
                </div>
                <Link href="/profil" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
                    <i className="fa-solid fa-user"></i> Profilim
                </Link>
            </nav>

            <div className="p-4 border-t border-gray-50 mt-auto">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-bold">
                    <i className="fa-solid fa-arrow-right-from-bracket"></i> Çıkış Yap
                </button>
            </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 w-full min-w-0">
            
            {/* MOBILE HEADER */}
            <div className="lg:hidden bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-20 z-30 border-b border-gray-100">
                <span className="font-display font-bold text-lg text-slate-800">Favorilerim</span>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="text-gray-500 text-xl"
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
            </div>

            {/* FAVORITES CONTENT */}
            <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 pb-24">

                {/* 1. COLLECTIONS (Folders) */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-display font-bold text-xl text-slate-800">Koleksiyonlarım</h2>
                        <button 
                          onClick={() => setShowCreateModal(true)}
                          className="text-orange-500 text-sm font-bold hover:underline"
                        >
                          + Yeni Oluştur
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {collections.map((collection) => (
                          <CollectionCard
                            key={collection.id}
                            collection={collection}
                            onDelete={deleteCollection}
                          />
                        ))}
                        
                        {/* Add New (Placeholder Visual) */}
                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center text-gray-400 hover:border-orange-500 hover:text-orange-500 transition-colors cursor-pointer h-full"
                        >
                            <i className="fa-solid fa-plus text-xl mb-2"></i>
                            <span className="text-xs font-bold">Yeni Liste</span>
                        </button>
                    </div>
                </section>

                <hr className="border-gray-200" />

                {/* 2. FILTER TABS & SEARCH */}
                <section>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        
                        {/* Tabs (Horizontal Scroll) */}
                        <div className="flex gap-2 overflow-x-auto hide-scroll pb-2 w-full md:w-auto scrollbar-hide">
                            {tabs.map((tab) => (
                                <button 
                                    key={tab.key}
                                    onClick={() => setActiveFilter(tab.key)}
                                    className={`px-4 py-2 rounded-full font-bold text-sm shadow-sm whitespace-nowrap transition-all border ${
                                        activeFilter === tab.key 
                                        ? "bg-slate-800 text-white border-slate-800" 
                                        : "bg-white text-gray-600 border-gray-200 hover:border-orange-500 hover:text-orange-500"
                                    }`}
                                >
                                    {tab.name} <span className={`ml-1 text-xs ${activeFilter === tab.key ? "text-gray-300" : "text-gray-400"}`}>({tab.count})</span>
                                </button>
                            ))}
                        </div>
                        
                        {/* Search Within Favorites */}
                        <div className="relative w-full md:w-64 flex-shrink-0">
                            <input 
                              type="text" 
                              placeholder="Favorilerde ara..." 
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-orange-500 transition-colors" 
                            />
                            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-2.5 text-gray-400 text-xs"></i>
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <p className="text-gray-500">Favoriler yükleniyor...</p>
                      </div>
                    )}

                    {/* Error State */}
                    {error && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <i className="fa-solid fa-exclamation-triangle text-red-500 text-2xl"></i>
                        </div>
                        <p className="text-red-500 font-bold mb-2">Hata Oluştu</p>
                        <p className="text-gray-500">{error}</p>
                      </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && !error && !hasContent && (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <i className="fa-solid fa-heart text-gray-400 text-3xl"></i>
                        </div>
                        <h3 className="font-bold text-slate-800 mb-2">
                          {searchQuery ? 'Arama Sonucu Bulunamadı' : 'Henüz Favori Eklemediniz'}
                        </h3>
                        <p className="text-gray-500 mb-6">
                          {searchQuery 
                            ? `"${searchQuery}" için sonuç bulunamadı`
                            : 'Beğendiğiniz içerikleri favorilere ekleyerek kolayca erişebilirsiniz'
                          }
                        </p>
                        {!searchQuery && (
                          <Link
                            href="/tarifler"
                            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
                          >
                            Tarifleri Keşfet
                          </Link>
                        )}
                      </div>
                    )}

                    {/* CONTENT GRID */}
                    {!isLoading && !error && hasContent && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {/* Recipe Cards */}
                        {filtered.recipes.map((recipe) => (
                          <FavoriteRecipeCard key={`recipe-${recipe.id}`} recipe={recipe} />
                        ))}

                        {/* Ingredient Cards */}
                        {filtered.ingredients.map((ingredient) => (
                          <FavoriteIngredientCard key={`ingredient-${ingredient.id}`} ingredient={ingredient} />
                        ))}
                        
                        {/* Blog Post Cards */}
                        {filtered.posts.map((post) => (
                          <FavoriteBlogCard key={`post-${post.id}`} post={post} />
                        ))}

                        {/* Discussion Cards */}
                        {filtered.discussions.map((discussion) => (
                          <FavoriteDiscussionCard key={`discussion-${discussion.id}`} discussion={discussion} />
                        ))}
                      </div>
                    )}
                </section>

            </div>
        </main>

        {/* MOBILE BOTTOM NAVIGATION */}
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-3 pb-safe z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            {/* Localde Link kullanın */}
            <Link href="/dashboard" className="flex flex-col items-center text-gray-400 hover:text-orange-500 transition-colors">
                <i className="fa-solid fa-house text-xl mb-1"></i>
                <span className="text-[10px] font-medium">Panelim</span>
            </Link>
            <Link href="/dashboard/haftalik-plan" className="flex flex-col items-center text-gray-400 hover:text-orange-500 transition-colors">
                <i className="fa-solid fa-calendar-days text-xl mb-1"></i>
                <span className="text-[10px] font-medium">Plan</span>
            </Link>
            <div className="relative -top-8">
                <Link href="/alisveris-listesi" className="flex items-center justify-center w-14 h-14 bg-orange-500 rounded-full text-white shadow-lg shadow-orange-200 hover:scale-105 transition-transform">
                    <i className="fa-solid fa-basket-shopping text-2xl"></i>
                </Link>
            </div>
            <Link href="/favoriler" className="flex flex-col items-center text-orange-500 transition-colors">
                <i className="fa-solid fa-heart text-xl mb-1"></i>
                <span className="text-[10px] font-bold">Favoriler</span>
            </Link>
            <Link href="/profil" className="flex flex-col items-center text-gray-400 hover:text-orange-500 transition-colors">
                <i className="fa-solid fa-user text-xl mb-1"></i>
                <span className="text-[10px] font-medium">Profil</span>
            </Link>
        </div>

        {/* Create Collection Modal */}
        <CreateCollectionModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={createCollection}
        />

    </div>
  );
}