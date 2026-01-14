"use client";

import React, { useState } from 'react';
import { CollectionInput, Collection } from '@/lib/types';

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CollectionInput) => Promise<void | Collection>;
}

const iconOptions = [
  'fa-solid fa-mug-hot',
  'fa-solid fa-snowflake',
  'fa-solid fa-carrot',
  'fa-solid fa-heart',
  'fa-solid fa-star',
  'fa-solid fa-cake-candles',
  'fa-solid fa-apple-whole',
  'fa-solid fa-fish',
  'fa-solid fa-egg',
  'fa-solid fa-bowl-rice',
];

const colorOptions = [
  '#FF8A65',
  '#4FC3F7',
  '#81C784',
  '#FFD54F',
  '#BA68C8',
  '#FF6B6B',
  '#4ECDC4',
  '#95E1D3',
  '#F38181',
  '#AA96DA',
];

export default function CreateCollectionModal({ isOpen, onClose, onCreate }: CreateCollectionModalProps) {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(iconOptions[0]);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      await onCreate({
        name: name.trim(),
        icon: selectedIcon,
        color: selectedColor,
      });
      setName('');
      setSelectedIcon(iconOptions[0]);
      setSelectedColor(colorOptions[0]);
      onClose();
    } catch (error) {
      console.error('Failed to create collection:', error);
      alert('Koleksiyon oluşturulurken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl text-slate-800">Yeni Koleksiyon</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Koleksiyon Adı
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: Kahvaltılar, Buzluk İçin"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 transition-colors"
              required
              maxLength={50}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold text-slate-800 mb-2">
              İkon Seç
            </label>
            <div className="grid grid-cols-5 gap-2">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`w-full aspect-square rounded-xl border-2 flex items-center justify-center text-xl transition-all ${
                    selectedIcon === icon
                      ? 'border-orange-500 bg-orange-50 text-orange-500'
                      : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
                  }`}
                >
                  <i className={icon}></i>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Renk Seç
            </label>
            <div className="grid grid-cols-5 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-full aspect-square rounded-xl border-2 flex items-center justify-center transition-all ${
                    selectedColor === color
                      ? 'border-slate-800 scale-110'
                      : 'border-gray-200 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && (
                    <i className="fa-solid fa-check text-white text-sm"></i>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="flex-1 px-6 py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Oluşturuluyor...' : 'Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
