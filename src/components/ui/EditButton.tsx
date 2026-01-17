'use client';

import { useUser } from '@/hooks/use-user';

interface EditButtonProps {
  contentType: 'post' | 'recipe' | 'ingredient' | 'discussion';
  contentId: number;
  authorId?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'text' | 'full';
}

export function EditButton({ 
  contentType, 
  contentId, 
  authorId,
  className = '',
  size = 'sm',
  variant = 'icon'
}: EditButtonProps) {
  const { 
    user, 
    hasEditorAccess, 
    canEditPosts, 
    canEditRecipes, 
    canEditIngredients,
    getEditUrl 
  } = useUser();
  
  // Content-type specific permission check
  const hasTypePermission = () => {
    switch (contentType) {
      case 'post':
        return canEditPosts;
      case 'recipe':
        return canEditRecipes;
      case 'ingredient':
        return canEditIngredients;
      case 'discussion':
        return canEditPosts; // Using posts permission for discussions
      default:
        return false;
    }
  };
  
  // Check if user owns the content
  const isOwner = authorId !== undefined && authorId !== null && user?.id === authorId;
  
  // Yetki kontrolü: Editor access AND (has type permission OR is owner)
  const canEdit = hasEditorAccess && (hasTypePermission() || isOwner);
  
  if (!canEdit) return null;
  
  const editUrl = getEditUrl(contentType, contentId);
  if (!editUrl) return null;
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };
  
  const baseClasses = `
    absolute z-20 bg-white/95 backdrop-blur-sm border border-gray-200 
    rounded-lg shadow-lg opacity-0 group-hover:opacity-100 
    transition-all duration-200 hover:bg-orange-500 hover:text-white 
    hover:border-orange-500 flex items-center justify-center
  `;
  
  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          window.open(editUrl, '_blank', 'noopener,noreferrer');
        }}
        className={`${baseClasses} ${sizeClasses[size]} top-3 right-3 ${className}`}
        title="Düzenle"
      >
        <i className="fa-solid fa-pen-to-square"></i>
      </button>
    );
  }
  
  if (variant === 'text') {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          window.open(editUrl, '_blank', 'noopener,noreferrer');
        }}
        className={`${baseClasses} px-3 py-1.5 top-3 right-3 text-xs font-medium ${className}`}
      >
        <i className="fa-solid fa-pen-to-square mr-1.5"></i>
        Düzenle
      </button>
    );
  }
  
  // full variant
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(editUrl, '_blank', 'noopener,noreferrer');
      }}
      className={`${baseClasses} px-4 py-2 top-3 right-3 text-sm font-bold ${className}`}
    >
      <i className="fa-solid fa-pen-to-square mr-2"></i>
      İçeriği Düzenle
    </button>
  );
}
