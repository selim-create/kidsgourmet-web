import React from 'react';
import { EmbedData } from '@/services/blog-service';
import EmbedCard from './EmbedCard';

interface EmbedContainerProps {
  embedData: EmbedData;
}

export default function EmbedContainer({ embedData }: EmbedContainerProps) {
  // Get title and icon based on embed type
  const getEmbedInfo = (type: string) => {
    switch (type) {
      case 'recipe':
        return {
          title: 'İlgili Tarifler',
          icon: 'fa-solid fa-utensils',
          color: 'text-orange-500'
        };
      case 'ingredient':
        return {
          title: 'İlgili Malzemeler',
          icon: 'fa-solid fa-carrot',
          color: 'text-emerald-500'
        };
      case 'tool':
        return {
          title: 'Faydalı Araçlar',
          icon: 'fa-solid fa-wand-magic-sparkles',
          color: 'text-violet-500'
        };
      case 'post':
        return {
          title: 'İlgili Yazılar',
          icon: 'fa-solid fa-book-open',
          color: 'text-blue-500'
        };
      default:
        return {
          title: 'İlgili İçerikler',
          icon: 'fa-solid fa-link',
          color: 'text-gray-500'
        };
    }
  };

  const { title, icon, color } = getEmbedInfo(embedData.type);

  return (
    <div className="my-12 p-8 bg-gradient-to-br from-gray-50 to-slate-50 rounded-3xl border border-gray-100">
      {/* Header */}
      <div className="mb-6">
        <h3 className="font-bold text-slate-800 text-2xl flex items-center gap-3">
          <i className={`${icon} ${color}`}></i>
          {title}
        </h3>
      </div>

      {/* Single column layout - stacked cards */}
      <div className="flex flex-col gap-4">
        {embedData.items.map((item) => (
          <EmbedCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
