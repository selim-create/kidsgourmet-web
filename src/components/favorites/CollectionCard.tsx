"use client";

import React from 'react';
import Link from 'next/link';
import { Collection } from '@/lib/types';
import { getIconClass } from '@/utils/iconHelpers';

interface CollectionCardProps {
  collection: Collection;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

// Renk isimlerini HEX kodlarına çevir
const colorMap: Record<string, string> = {
  orange: '#FF8A65',
  blue: '#4FC3F7',
  green: '#81C784',
  purple: '#BA68C8',
  pink: '#F06292',
  yellow: '#FFD54F',
  red: '#EF5350',
  teal: '#4DB6AC',
};

export default function CollectionCard({ collection, onDelete, onEdit }: CollectionCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete && confirm(`"${collection.name}" koleksiyonunu silmek istediğinize emin misiniz?`)) {
      onDelete(collection.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) {
      onEdit(collection.id);
    }
  };

  // Renk değerini HEX'e çevir (eğer isimse)
  const hexColor = colorMap[collection.color] || collection.color;

  return (
    <Link
      href={`/favoriler/koleksiyon/${collection.id}`}
      className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group text-center relative"
    >
      <div className="absolute top-2 right-2 flex gap-1">
        {onEdit && (
          <button
            onClick={handleEdit}
            className="w-6 h-6 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-400 hover:text-blue-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            title="Düzenle"
          >
            <i className="fa-solid fa-pen text-xs"></i>
          </button>
        )}
        {onDelete && (
          <button
            onClick={handleDelete}
            className="w-6 h-6 rounded-full bg-gray-100 hover:bg-red-100 text-gray-400 hover:text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            title="Sil"
          >
            <i className="fa-solid fa-trash text-xs"></i>
          </button>
        )}
      </div>
      <div 
        className="w-12 h-12 mx-auto rounded-full flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform"
        style={{ 
          backgroundColor: `${hexColor}20`,
          color: hexColor 
        }}
      >
        <i className={getIconClass(collection.icon)}></i>
      </div>
      <h3 className="font-bold text-slate-800 text-sm">{collection.name}</h3>
      <p className="text-xs text-gray-400 mt-1">
        {collection.item_count} {collection.item_count === 1 ? 'İçerik' : 'İçerik'}
      </p>
    </Link>
  );
}
