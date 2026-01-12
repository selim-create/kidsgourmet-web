'use client';

import { useState, useEffect } from 'react';
import { useChildProfile } from '@/contexts/ChildProfileContext';

export default function ChildBirthDatePicker() {
  const { profile, setChildBirthDate } = useChildProfile();
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  // Show modal on first visit if no birth date is set (client-side only)
  useEffect(() => {
    if (!profile.birthDate) {
      setShowModal(true);
    }
  }, [profile.birthDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate) {
      const date = new Date(selectedDate);
      setChildBirthDate(date);
      setShowModal(false);
    }
  };

  const handleSkip = () => {
    setShowModal(false);
  };

  const getAgeGroupColor = () => {
    if (!profile.currentAgeGroup) {
      return '#87CEEB'; // Default blue
    }
    return profile.currentAgeGroup.age_group_meta.color_code;
  };

  // Header display when profile exists
  if (profile.birthDate && profile.currentAgeGroup) {
    return (
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-full border-2 transition-all hover:shadow-md"
        style={{ 
          borderColor: getAgeGroupColor(),
          backgroundColor: `${getAgeGroupColor()}20`
        }}
      >
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
          style={{ backgroundColor: getAgeGroupColor() }}
        >
          {profile.ageInMonths}
        </div>
        <span className="text-sm font-medium text-gray-700">
          {profile.currentAgeGroup.name}
        </span>
      </button>
    );
  }

  // Modal for selecting birth date
  if (showModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-baby text-orange-500 text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Çocuğunuzun Doğum Tarihi
            </h2>
            <p className="text-gray-600 text-sm">
              Size özel tarif önerileri için çocuğunuzun doğum tarihini girin
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                Doğum Tarihi
              </label>
              <input
                type="date"
                id="birthDate"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Kaydet
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Şimdi Değil
              </button>
            </div>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            Bu bilgi sadece cihazınızda saklanır ve yaşa uygun tarifler göstermek için kullanılır.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
