'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useActiveChild } from '@/contexts/ActiveChildContext';

export default function ChildSwitcher() {
  const { activeChild, setActiveChild, children } = useActiveChild();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Don't render if no children
  if (children.length === 0) {
    return null;
  }

  // Calculate age display
  const getAgeDisplay = (child: typeof activeChild) => {
    if (!child) return '';
    if (child.age_months !== undefined) {
      const years = Math.floor(child.age_months / 12);
      const months = child.age_months % 12;
      if (years > 0) {
        return months > 0 ? `${years}y ${months}m` : `${years}y`;
      }
      return `${months}m`;
    }
    // Fallback: calculate from birth_date if age_months not available
    if (child.birth_date) {
      const birthDate = new Date(child.birth_date);
      const today = new Date();
      const ageInMonths = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
      const years = Math.floor(ageInMonths / 12);
      const months = ageInMonths % 12;
      if (years > 0) {
        return months > 0 ? `${years}y ${months}m` : `${years}y`;
      }
      return `${months}m`;
    }
    return '';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-orange-50 hover:bg-orange-100 transition-colors border border-orange-200"
      >
        <div className="w-6 h-6 rounded-full bg-orange-200 flex items-center justify-center text-xs font-bold text-orange-600">
          {activeChild?.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs font-bold text-slate-800 leading-none">
            {activeChild?.name}
          </span>
          <span className="text-[10px] text-gray-500 leading-none">
            {getAgeDisplay(activeChild)}
          </span>
        </div>
        <i className={`fa-solid fa-chevron-down text-xs text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
          {/* Children List */}
          <div className="px-2 max-h-64 overflow-y-auto">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => {
                  setActiveChild(child);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                  activeChild?.id === child.id
                    ? 'bg-orange-50 border border-orange-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  activeChild?.id === child.id
                    ? 'bg-orange-200 text-orange-600'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {child.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-bold text-sm text-slate-800">{child.name}</div>
                  <div className="text-xs text-gray-500">{getAgeDisplay(child)}</div>
                </div>
                {activeChild?.id === child.id && (
                  <i className="fa-solid fa-check text-orange-500"></i>
                )}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-2"></div>

          {/* Add Child Link */}
          <Link
            href="/profil"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm font-bold text-orange-500"
          >
            <i className="fa-solid fa-plus"></i>
            Çocuk Ekle
          </Link>
        </div>
      )}
    </div>
  );
}
