'use client';

import { useUser } from '@/hooks/use-user';

interface AdminQuickMenuProps {
  className?: string;
}

const ADMIN_BASE_URL = 'https://api.kidsgourmet.com.tr/wp-admin/';

const defaultEditUrls = {
  new_post: `${ADMIN_BASE_URL}post-new.php`,
  new_recipe: `${ADMIN_BASE_URL}post-new.php?post_type=recipe`,
  new_ingredient: `${ADMIN_BASE_URL}post-new.php?post_type=ingredient`,
};

export function AdminQuickMenu({ className = '' }: AdminQuickMenuProps) {
  const { hasEditorAccess, adminUrl, editUrls } = useUser();
  
  if (!hasEditorAccess) return null;
  
  const urls = editUrls || defaultEditUrls;
  
  return (
    <div className={`border-t border-gray-100 pt-2 mt-2 ${className}`}>
      {/* Yeni İçerik Başlığı */}
      <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
        Yeni Ekle
      </div>
      
      {/* Yeni Yazı */}
      <a
        href={urls.new_post}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
      >
        <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
          <i className="fa-solid fa-file-pen"></i>
        </span>
        <span className="font-medium">Yeni Yazı</span>
      </a>
      
      {/* Yeni Tarif */}
      <a
        href={urls.new_recipe}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
      >
        <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
          <i className="fa-solid fa-utensils"></i>
        </span>
        <span className="font-medium">Yeni Tarif</span>
      </a>
      
      {/* Yeni Malzeme */}
      <a
        href={urls.new_ingredient}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
      >
        <span className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
          <i className="fa-solid fa-carrot"></i>
        </span>
        <span className="font-medium">Yeni Malzeme</span>
      </a>
      
      {/* Admin Paneli (sadece admin/editor için) */}
      {adminUrl && (
        <>
          <div className="border-t border-gray-100 my-2"></div>
          <a
            href={adminUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <i className="fa-solid fa-gear"></i>
            </span>
            <span className="font-medium">Admin Paneli</span>
            <i className="fa-solid fa-arrow-up-right-from-square text-xs text-gray-400 ml-auto"></i>
          </a>
        </>
      )}
    </div>
  );
}
