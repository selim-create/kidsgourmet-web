"use client";

import { useState, useEffect } from "react";
import { Child } from "@/lib/types";

interface ChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (child: Omit<Child, 'id'> | Child) => Promise<void>;
  child?: Child | null;
}

const ALLERGENS = [
  "İnek Sütü",
  "Yumurta",
  "Fıstık",
  "Soya",
  "Buğday",
  "Balık",
  "Kabuklu Deniz Ürünleri",
  "Fındık",
  "Domates",
  "Muz",
  "Çilek",
];

export default function ChildModal({ isOpen, onClose, onSave, child }: ChildModalProps) {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (child) {
      setName(child.name);
      setBirthDate(child.birth_date);
      setSelectedAllergens(child.allergens || []);
      setNotes(child.notes || "");
    } else {
      setName("");
      setBirthDate("");
      setSelectedAllergens([]);
      setNotes("");
    }
  }, [child, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const childData: Omit<Child, 'id'> | Child = child?.id
        ? {
            id: child.id,
            name,
            birth_date: birthDate,
            allergens: selectedAllergens,
            notes,
          }
        : {
            name,
            birth_date: birthDate,
            allergens: selectedAllergens,
            notes,
          };

      await onSave(childData);
      onClose();
    } catch (error) {
      console.error('Error saving child:', error);
      alert('Çocuk kaydedilirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAllergen = (allergen: string) => {
    setSelectedAllergens(prev =>
      prev.includes(allergen)
        ? prev.filter(a => a !== allergen)
        : [...prev, allergen]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl shadow-xl max-w-2xl w-full p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          {/* Header */}
          <div className="mb-6">
            <h2 className="font-display font-bold text-2xl text-slate-800">
              {child ? 'Çocuğu Düzenle' : 'Yeni Çocuk Ekle'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Çocuğunuzun bilgilerini girin
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="childName" className="block text-sm font-bold text-gray-700 mb-2">
                Ad Soyad
              </label>
              <input
                type="text"
                id="childName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-orange-500 transition-colors"
                placeholder="Örn: Deniz Yılmaz"
              />
            </div>

            {/* Birth Date */}
            <div>
              <label htmlFor="birthDate" className="block text-sm font-bold text-gray-700 mb-2">
                Doğum Tarihi
              </label>
              <input
                type="date"
                id="birthDate"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            {/* Allergens */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Alerjenler (Varsa)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {ALLERGENS.map((allergen) => (
                  <button
                    key={allergen}
                    type="button"
                    onClick={() => toggleAllergen(allergen)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedAllergens.includes(allergen)
                        ? 'bg-red-100 text-red-700 border-2 border-red-300'
                        : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
                    }`}
                  >
                    {selectedAllergens.includes(allergen) && (
                      <i className="fa-solid fa-check mr-1"></i>
                    )}
                    {allergen}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-bold text-gray-700 mb-2">
                Notlar (Opsiyonel)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                placeholder="Örn: 9. ay gelişiminde, pütürlü gıdalara alışma dönemi..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Kaydediliyor...' : child ? 'Güncelle' : 'Ekle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
