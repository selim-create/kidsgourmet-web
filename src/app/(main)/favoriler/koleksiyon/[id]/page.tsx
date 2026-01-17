"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { userService } from '@/services/user-service';
import { Collection, FavoriteRecipeCard as FavoriteRecipeCardType, FavoriteIngredientCard as FavoriteIngredientCardType, FavoriteBlogCard as FavoriteBlogCardType, FavoriteDiscussionCard as FavoriteDiscussionCardType } from '@/lib/types';
import FavoriteRecipeCard from '@/components/favorites/FavoriteRecipeCard';
import FavoriteIngredientCard from '@/components/favorites/FavoriteIngredientCard';
import FavoriteBlogCard from '@/components/favorites/FavoriteBlogCard';
import FavoriteDiscussionCard from '@/components/favorites/FavoriteDiscussionCard';

export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useUser();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const collectionId = params.id as string;

  const loadCollection = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getCollection(collectionId);
      setCollection(data);
    } catch (err) {
      console.error('Failed to load collection:', err);
      setError('Koleksiyon yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  }, [collectionId]);

  useEffect(() => {
    if (isAuthenticated && collectionId) {
      loadCollection();
    }
  }, [isAuthenticated, collectionId, loadCollection]);

  const handleRemoveItem = async (itemId: number, itemType: string) => {
    try {
      await userService.removeCollectionItem(collectionId, itemId, itemType as any);
      await loadCollection();
    } catch (err) {
      console.error('Failed to remove item:', err);
      alert('İçerik kaldırılırken hata oluştu');
    }
  };

  const handleDeleteCollection = async () => {
    if (!confirm(`"${collection?.name}" koleksiyonunu silmek istediğinize emin misiniz?`)) {
      return;
    }
    try {
      await userService.deleteCollection(collectionId);
      router.push('/favoriler');
    } catch (err) {
      console.error('Failed to delete collection:', err);
      alert('Koleksiyon silinirken hata oluştu');
    }
  };

  if (authLoading || isLoading) {
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
    router.push('/login');
    return null;
  }

  if (error || !collection) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-exclamation-triangle text-red-500 text-3xl"></i>
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-800 mb-2">
            Koleksiyon Bulunamadı
          </h2>
          <p className="text-gray-500 mb-6">
            {error || 'Bu koleksiyon bulunamadı veya erişim izniniz yok.'}
          </p>
          <Link
            href="/favoriler"
            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
          >
            Favorilere Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/favoriler"
            className="inline-flex items-center text-gray-500 hover:text-slate-800 mb-4 transition-colors"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Favorilere Dön
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
                style={{
                  backgroundColor: `${collection.color}20`,
                  color: collection.color
                }}
              >
                <i className={collection.icon}></i>
              </div>
              <div>
                <h1 className="font-display font-bold text-3xl text-slate-800 mb-1">
                  {collection.name}
                </h1>
                <p className="text-gray-500">
                  {collection.item_count} {collection.item_count === 1 ? 'içerik' : 'içerik'}
                </p>
              </div>
            </div>

            <button
              onClick={handleDeleteCollection}
              className="px-4 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors font-bold"
            >
              <i className="fa-solid fa-trash mr-2"></i>
              Sil
            </button>
          </div>
        </div>

        {/* Content */}
        {collection.items && collection.items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collection.items.map((item) => {
              if (item.item_type === 'recipe' && item.data) {
                return (
                  <FavoriteRecipeCard
                    key={`recipe-${item.item_id}`}
                    recipe={item.data as FavoriteRecipeCardType}
                  />
                );
              }
              if (item.item_type === 'ingredient' && item.data) {
                return (
                  <FavoriteIngredientCard
                    key={`ingredient-${item.item_id}`}
                    ingredient={item.data as FavoriteIngredientCardType}
                  />
                );
              }
              if (item.item_type === 'post' && item.data) {
                return (
                  <FavoriteBlogCard
                    key={`post-${item.item_id}`}
                    post={item.data as FavoriteBlogCardType}
                  />
                );
              }
              if (item.item_type === 'discussion' && item.data) {
                return (
                  <FavoriteDiscussionCard
                    key={`discussion-${item.item_id}`}
                    discussion={item.data as FavoriteDiscussionCardType}
                  />
                );
              }
              return null;
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-folder-open text-gray-400 text-3xl"></i>
            </div>
            <h3 className="font-bold text-slate-800 mb-2">Koleksiyon Boş</h3>
            <p className="text-gray-500 mb-6">
              Bu koleksiyonda henüz içerik yok. Favorilerinizden koleksiyonlara içerik ekleyebilirsiniz.
            </p>
            <Link
              href="/favoriler"
              className="inline-block bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
            >
              Favorilere Git
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
