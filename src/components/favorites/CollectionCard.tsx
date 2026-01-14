"use client";

import React from 'react';
import Link from 'next/link';
import { Collection } from '@/lib/types';

interface CollectionCardProps {
  collection: Collection;
  onDelete?: (id: string) => void;
}

export default function CollectionCard({ collection, onDelete }: CollectionCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete && confirm(`"${collection.name}" koleksiyonunu silmek istediğinize emin misiniz?`)) {
      onDelete(collection.id);
    }
  };

  return (
    <Link
      href={`/favoriler/koleksiyon/${collection.id}`}
      className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group text-center relative"
    >
      {onDelete && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-100 hover:bg-red-100 text-gray-400 hover:text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <i className="fa-solid fa-trash text-xs"></i>
        </button>
      )}
      <div 
        className="w-12 h-12 mx-auto rounded-full flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform"
        style={{ 
          backgroundColor: `${collection.color}20`,
          color: collection.color 
        }}
      >
        <i className={collection.icon}></i>
      </div>
      <h3 className="font-bold text-slate-800 text-sm">{collection.name}</h3>
      <p className="text-xs text-gray-400 mt-1">
        {collection.item_count} {collection.item_count === 1 ? 'İçerik' : 'İçerik'}
      </p>
    </Link>
  );
}
