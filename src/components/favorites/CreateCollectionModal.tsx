"use client";

import React, { useState, useEffect } from 'react';
import { CollectionInput, Collection } from '@/lib/types';

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CollectionInput) => Promise<void | Collection>;
  editMode?: boolean;
  initialData?: {
    name: string;
    icon: string;
    color: string;
  };
}

const iconOptions = [
  { value: 'mug-hot', class: 'fa-solid fa-mug-hot', label: 'Kahve' },
  { value: 'snowflake', class: 'fa-solid fa-snowflake', label: 'Kar' },
  { value: 'carrot', class: 'fa-solid fa-carrot', label: 'Havuç' },
  { value: 'heart', class: 'fa-solid fa-heart', label: 'Kalp' },
  { value: 'star', class: 'fa-solid fa-star', label: 'Yıldız' },
  { value: 'bookmark', class: 'fa-solid fa-bookmark', label: 'İşaret' },
  { value: 'folder', class: 'fa-solid fa-folder', label: 'Klasör' },
  { value: 'utensils', class: 'fa-solid fa-utensils', label: 'Çatal' },
  { value: 'apple-whole', class: 'fa-solid fa-apple-whole', label: 'Elma' },
  { value: 'fish', class: 'fa-solid fa-fish', label: 'Balık' },
  { value: 'egg', class: 'fa-solid fa-egg', label: 'Yumurta' },
  { value: 'bread-slice', class: 'fa-solid fa-bread-slice', label: 'Ekmek' },
  { value: 'sun', class: 'fa-solid fa-sun', label: 'Güneş' },
  { value: 'moon', class: 'fa-solid fa-moon', label: 'Ay' },
  { value: 'cookie', class: 'fa-solid fa-cookie', label: 'Kurabiye' },
];

const colorOptions = [
  { value: 'orange', hex: '#FF8A65', label: 'Turuncu' },
  { value: 'blue', hex: '#4FC3F7', label: 'Mavi' },
  { value: 'green', hex: '#81C784', label: 'Yeşil' },
  { value: 'purple', hex: '#BA68C8', label: 'Mor' },
  { value: 'pink', hex: '#F06292', label: 'Pembe' },
  { value: 'yellow', hex: '#FFD54F', label: 'Sarı' },
  { value: 'red', hex: '#EF5350', label: 'Kırmızı' },
  { value: 'teal', hex: '#4DB6AC', label: 'Turkuaz' },
];

export default function CreateCollectionModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editMode = false, 
  initialData 
}: CreateCollectionModalProps) {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(iconOptions[0].value);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);
  const [isLoading, setIsLoading] = useState(false);

  // Edit modu verilerini yükle veya formu sıfırla
  useEffect(() => {
    if (isOpen) {
      if (editMode && initialData) {
        setName(initialData.name);
        // İkon ismini temizle (örn: 'fa-solid fa-star' -> 'star')
        const cleanIcon = initialData.icon.replace('fa-solid fa-', '').replace('fa-', '');
        const matchedIcon = iconOptions.find(opt => opt.value === cleanIcon);
        setSelectedIcon(matchedIcon ? matchedIcon.value : iconOptions[0].value);

        // Renk eşleştirmesi - Backend renk ismi ('orange') veya HEX döndürebilir
        const matchedColorByName = colorOptions.find(opt => opt.value === initialData.color);
        const matchedColorByHex = colorOptions.find(opt => opt.hex === initialData.color);
        setSelectedColor(matchedColorByName?.value || matchedColorByHex?.value || colorOptions[0].value);
      } else {
        setName('');
        setSelectedIcon(iconOptions[0].value);
        setSelectedColor(colorOptions[0].value);
      }
    }
  }, [isOpen, editMode, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      // API'ye ikon ismini ('mug-hot') ve renk ismini ('orange', 'blue' vb.) gönderiyoruz
      await onSubmit({
        name: name.trim(),
        icon: selectedIcon, 
        color: selectedColor, // Renk ismi gönder (HEX yerine)
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to save collection:', error);
      alert('Koleksiyon kaydedilirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl text-slate-800">
            {editMode ? 'Koleksiyonu Düzenle' : 'Yeni Koleksiyon'}
          </h2>
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
            <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto p-1">
              {iconOptions.map((icon) => (
                <button
                  key={icon.value}
                  type="button"
                  onClick={() => setSelectedIcon(icon.value)}
                  className={`w-full aspect-square rounded-xl border-2 flex items-center justify-center text-xl transition-all ${
                    selectedIcon === icon.value
                      ? 'border-orange-500 bg-orange-50 text-orange-500'
                      : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
                  }`}
                >
                  <i className={icon.class}></i>
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
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-full aspect-square rounded-xl border-2 flex items-center justify-center transition-all ${
                    selectedColor === color.value
                      ? 'border-slate-800 scale-110'
                      : 'border-gray-200 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  {selectedColor === color.value && (
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
              className="flex-1 px-6 py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <><i className="fa-solid fa-spinner fa-spin"></i> İşleniyor</>
              ) : (
                editMode ? 'Güncelle' : 'Oluştur'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}