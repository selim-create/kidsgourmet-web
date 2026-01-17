'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/use-user';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { recipeService } from '@/services/recipe-service';

interface RecipeRatingProps {
  recipeId: number;
  recipeTitle?: string;
  initialRating?: number;
  initialRatingCount?: number;
  currentUserRating?: number;
}

// Fake rating hesaplama (4.0 - 4.9 arası, recipe ID'ye göre deterministik)
const generateFakeRating = (recipeId: number): number => {
  // Recipe ID'ye göre deterministik fake rating (4.0 - 4.9 arası)
  const seed = recipeId % 10;
  return 4.0 + (seed / 10); // 4.0, 4.1, 4.2, ... 4.9
};

const generateFakeCount = (recipeId: number): number => {
  // Recipe ID'ye göre deterministik fake count (10-150 arası)
  return 10 + (recipeId % 141);
};

export default function RecipeRating({
  recipeId,
  recipeTitle = '',
  initialRating = 0,
  initialRatingCount = 0,
  currentUserRating = 0,
}: RecipeRatingProps) {
  const [rating, setRating] = useState(() => {
    if (initialRating && initialRating > 0) return initialRating;
    return generateFakeRating(recipeId);
  });
  
  const [ratingCount, setRatingCount] = useState(() => {
    if (initialRatingCount && initialRatingCount > 0) return initialRatingCount;
    return generateFakeCount(recipeId);
  });
  
  const [userRating, setUserRating] = useState(currentUserRating);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { isAuthenticated } = useUser();
  const router = useRouter();

  const handleStarClick = async (starValue: number) => {
    if (!isAuthenticated) {
      toast.error('Puan vermek için giriş yapmalısınız', {
        action: {
          label: 'Giriş Yap',
          onClick: () => router.push('/login?redirect=' + encodeURIComponent(window.location.pathname))
        }
      });
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      // API call to save rating
      const response = await recipeService.rateRecipe(recipeId, starValue);
      
      if (response.success) {
        // Update local state with API response
        setUserRating(response.user_rating);
        setRating(response.rating);
        setRatingCount(response.rating_count);
        
        toast.success('Puanınız kaydedildi! Teşekkürler 🌟');
      } else {
        toast.error('Puan kaydedilirken bir hata oluştu');
      }
    } catch (error: any) {
      console.error('Rating error:', error);
      
      // Use errorInfo from API library for robust error handling
      const errorInfo = error.errorInfo;
      
      if (errorInfo?.type === 'auth') {
        // Authentication error - session expired
        toast.error('Oturumunuz sona ermiş. Lütfen tekrar giriş yapın.', {
          action: {
            label: 'Giriş Yap',
            onClick: () => router.push('/login?redirect=' + encodeURIComponent(window.location.pathname))
          }
        });
      } else if (errorInfo?.type === 'network') {
        // Network error - connection failed
        toast.error('Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.');
      } else if (errorInfo?.userMessage) {
        // Use the user-friendly message from errorInfo
        toast.error(errorInfo.userMessage);
      } else {
        // Fallback error message
        toast.error('Puan kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hoveredStar > 0 ? hoveredStar : (userRating > 0 ? userRating : rating);

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Stars */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            disabled={isSubmitting}
            className={`text-2xl transition-all duration-200 ${
              isSubmitting ? 'cursor-wait opacity-50' : 'cursor-pointer hover:scale-110'
            } ${
              star <= displayRating
                ? 'text-amber-400 drop-shadow-sm'
                : 'text-gray-300'
            }`}
            title={isAuthenticated ? `${star} yıldız ver` : 'Puan vermek için giriş yapın'}
          >
            <i className={star <= displayRating ? 'fa-solid fa-star' : 'fa-regular fa-star'}></i>
          </button>
        ))}
      </div>

      {/* Rating Display */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-bold text-amber-600">
          {rating > 0 ? rating.toFixed(1) : '—'}
        </span>
        <span className="text-gray-400">|</span>
        <span className="text-gray-600">
          {ratingCount} {ratingCount === 1 ? 'değerlendirme' : 'değerlendirme'}
        </span>
      </div>

      {/* User's Rating Indicator */}
      {userRating > 0 && (
        <div className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded-full">
          Puanınız: {userRating} ⭐
        </div>
      )}
    </div>
  );
}
