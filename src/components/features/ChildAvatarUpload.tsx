'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { userService } from '@/services/user-service';
import { toast } from 'sonner';

interface ChildAvatarUploadProps {
  childId: string;
  currentAvatarUrl?: string;
  childName: string;
  onAvatarChange?: (newUrl: string | null) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
};

const TEXT_SIZE_MAP = {
  sm: 'text-2xl',
  md: 'text-3xl',
  lg: 'text-4xl',
};

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export default function ChildAvatarUpload({
  childId,
  currentAvatarUrl,
  childName,
  onAvatarChange,
  className = '',
  size = 'md',
}: ChildAvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(currentAvatarUrl);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      toast.error('Sadece JPG, PNG veya WebP formatında dosya yükleyebilirsiniz');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Dosya boyutu 2MB\'dan küçük olmalıdır');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const response = await userService.uploadChildAvatar(childId, file);
      const newUrl = response.avatar?.url;
      
      if (newUrl) {
        setAvatarUrl(newUrl);
        setPreviewUrl(null);
        toast.success('Fotoğraf başarıyla yüklendi');
        onAvatarChange?.(newUrl);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Fotoğraf yüklenirken bir hata oluştu');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    // TODO: Replace with a proper modal component for better UX
    if (!confirm('Fotoğrafı silmek istediğinizden emin misiniz?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await userService.deleteChildAvatar(childId);
      setAvatarUrl(undefined);
      setPreviewUrl(null);
      toast.success('Fotoğraf silindi');
      onAvatarChange?.(null);
    } catch (error) {
      console.error('Error deleting avatar:', error);
      toast.error('Fotoğraf silinirken bir hata oluştu');
    } finally {
      setIsDeleting(false);
      setShowDeleteOverlay(false);
    }
  };

  const handleClick = () => {
    if (!isUploading && !isDeleting) {
      fileInputRef.current?.click();
    }
  };

  const getInitials = () => {
    return childName.charAt(0).toUpperCase();
  };

  const displayUrl = previewUrl || avatarUrl;

  return (
    <div className={`relative ${className}`}>
      <div
        className={`${SIZE_MAP[size]} rounded-full overflow-hidden border-4 border-orange-100 shadow-lg cursor-pointer transition-all hover:shadow-xl ${
          isUploading || isDeleting ? 'opacity-50' : ''
        }`}
        onClick={handleClick}
        onMouseEnter={() => setShowDeleteOverlay(true)}
        onMouseLeave={() => setShowDeleteOverlay(false)}
      >
        {displayUrl ? (
          <div className="relative w-full h-full">
            <img
              src={displayUrl}
              alt={childName}
              className="w-full h-full object-cover"
            />
            {(isUploading || isDeleting) && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {showDeleteOverlay && avatarUrl && !isUploading && !isDeleting && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                  className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="Fotoğrafı değiştir"
                >
                  <i className="fa-solid fa-pen text-sm"></i>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  title="Fotoğrafı sil"
                >
                  <i className="fa-solid fa-trash text-sm"></i>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
            {isUploading ? (
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className={`${TEXT_SIZE_MAP[size]} font-bold text-orange-500`}>
                {getInitials()}
              </span>
            )}
          </div>
        )}
      </div>

      {!displayUrl && !isUploading && (
        <button
          onClick={handleClick}
          className="absolute bottom-0 right-0 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm hover:bg-orange-600 transition-colors"
          title="Fotoğraf ekle"
        >
          <i className="fa-solid fa-camera"></i>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_FILE_TYPES.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
