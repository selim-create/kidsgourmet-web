"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useUser } from "@/hooks/use-user";
import { getDashboardUrl, getPublicProfileUrl } from "@/utils/helpers";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useUser();

  // Get role-based URLs using utility functions
  const dashboardLink = getDashboardUrl(user);
  const publicProfileUrl = getPublicProfileUrl(user);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!user) return null;

  const avatarInitial = user.avatar_url 
    ? null 
    : (user.name && user.name.length > 0 ? user.name.charAt(0).toUpperCase() : '?');

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all"
      >
        <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center text-sm font-bold overflow-hidden">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            avatarInitial
          )}
        </div>
        <span className="font-bold text-sm hidden md:inline">{user.display_name || user.name}</span>
        <i className={`fa-solid fa-chevron-down text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-bold text-slate-800">{user.display_name || user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              href={dashboardLink}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              <i className="fa-solid fa-gauge-high w-4 text-center"></i>
              <span>Dashboard</span>
            </Link>

            <Link
              href="/profil"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              <i className="fa-solid fa-user-pen w-4 text-center"></i>
              <span>Profili Düzenle</span>
            </Link>

            <Link
              href={publicProfileUrl}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              <i className="fa-solid fa-user w-4 text-center"></i>
              <span>Profili Görüntüle</span>
            </Link>

            <Link
              href="/topluluk/soru-sor"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              <i className="fa-solid fa-circle-question w-4 text-center"></i>
              <span>Soru Sor</span>
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 pt-1">
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <i className="fa-solid fa-right-from-bracket w-4 text-center"></i>
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
