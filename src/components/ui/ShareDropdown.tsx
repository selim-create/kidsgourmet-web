'use client';

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface ShareDropdownProps {
  url: string;
  title: string;
}

export default function ShareDropdown({ url, title }: ShareDropdownProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  function shareToTwitter() {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
    setShowMenu(false);
  }

  function shareToFacebook() {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
    setShowMenu(false);
  }

  function shareToWhatsApp() {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
    window.open(whatsappUrl, '_blank');
    setShowMenu(false);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link kopyalandı!');
      setShowMenu(false);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Link kopyalanamadı');
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setShowMenu(!showMenu)} 
        className="text-gray-400 hover:text-brand-secondary transition-colors"
        aria-label="Paylaş"
      >
        <i className="fa-solid fa-share-nodes text-xl"></i>
      </button>
      {showMenu && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-[200px] z-50">
          <button 
            onClick={shareToTwitter} 
            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <i className="fa-brands fa-x-twitter"></i> X'te Paylaş
          </button>
          <button 
            onClick={shareToFacebook} 
            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <i className="fa-brands fa-facebook"></i> Facebook'ta Paylaş
          </button>
          <button 
            onClick={shareToWhatsApp} 
            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <i className="fa-brands fa-whatsapp"></i> WhatsApp'ta Paylaş
          </button>
          <button 
            onClick={copyLink} 
            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <i className="fa-solid fa-link"></i> Linki Kopyala
          </button>
        </div>
      )}
    </div>
  );
}
