'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { userService } from '@/services/user-service';
import { ExpertDashboard } from '@/lib/types';

export default function ExpertDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: userLoading } = useUser();
  const [dashboardData, setDashboardData] = useState<ExpertDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auth & Role guard
  useEffect(() => {
    if (!userLoading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/dashboard/expert');
        return;
      }
      
      // Role check
      const allowedRoles = ['administrator', 'editor', 'kg_expert'];
      if (user?.role && !allowedRoles.includes(user.role)) {
        router.push('/dashboard');
        return;
      }
    }
  }, [userLoading, isAuthenticated, user?.role, router]);

  // Fetch expert dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      if (!isAuthenticated || !user?.role) return;
      
      const allowedRoles = ['administrator', 'editor', 'kg_expert'];
      if (!allowedRoles.includes(user.role)) return;

      try {
        const data = await userService.getExpertDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error('Expert dashboard error:', err);
        setError('Dashboard verileri yüklenirken hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [isAuthenticated, user?.role]);

  // Loading state
  if (userLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Uzman paneli yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-exclamation-triangle text-red-500 text-2xl"></i>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Bir Hata Oluştu</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-purple-500 text-white px-6 py-2 rounded-full font-bold hover:bg-purple-600 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-user-tie text-purple-600 text-xl"></i>
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-slate-800">Uzman Paneli</h1>
              <p className="text-sm text-gray-500">Hoş geldiniz, {user?.display_name || user?.name}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Pending Questions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-circle-question text-orange-500 text-xl"></i>
              </div>
              <span className="text-3xl font-bold text-slate-800">{dashboardData?.pending_questions || 0}</span>
            </div>
            <h3 className="font-bold text-slate-700">Bekleyen Sorular</h3>
            <p className="text-sm text-gray-500">Cevaplanmayı bekliyor</p>
          </div>

          {/* Pending Comments */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-comments text-blue-500 text-xl"></i>
              </div>
              <span className="text-3xl font-bold text-slate-800">{dashboardData?.pending_comments || 0}</span>
            </div>
            <h3 className="font-bold text-slate-700">Bekleyen Yorumlar</h3>
            <p className="text-sm text-gray-500">Onay bekliyor</p>
          </div>

          {/* Today's Answers */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-check-circle text-green-500 text-xl"></i>
              </div>
              <span className="text-3xl font-bold text-slate-800">{dashboardData?.today_answers || 0}</span>
            </div>
            <h3 className="font-bold text-slate-700">Bugün Cevaplanan</h3>
            <p className="text-sm text-gray-500">Bugünkü aktivite</p>
          </div>

          {/* Weekly Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-chart-line text-purple-500 text-xl"></i>
              </div>
              <span className="text-3xl font-bold text-slate-800">{dashboardData?.weekly_stats?.questions_answered || 0}</span>
            </div>
            <h3 className="font-bold text-slate-700">Haftalık Cevap</h3>
            <p className="text-sm text-gray-500">Son 7 gün</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg text-slate-800 mb-4">Hızlı İşlemler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              href="/topluluk?filter=pending" 
              className="flex flex-col items-center justify-center p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
            >
              <i className="fa-solid fa-inbox text-orange-500 text-2xl mb-2"></i>
              <span className="text-sm font-bold text-orange-700">Soruları Gör</span>
            </Link>
            <Link 
              href="/dashboard" 
              className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <i className="fa-solid fa-home text-blue-500 text-2xl mb-2"></i>
              <span className="text-sm font-bold text-blue-700">Ana Dashboard</span>
            </Link>
            <Link 
              href="/profil" 
              className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
            >
              <i className="fa-solid fa-user-pen text-green-500 text-2xl mb-2"></i>
              <span className="text-sm font-bold text-green-700">Profilim</span>
            </Link>
            <Link 
              href="/tarifler" 
              className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
            >
              <i className="fa-solid fa-utensils text-purple-500 text-2xl mb-2"></i>
              <span className="text-sm font-bold text-purple-700">Tarifler</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
