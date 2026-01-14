'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { userService } from '@/services/user-service';
import { ExpertDashboard } from '@/lib/types';

export default function ExpertDashboardPage() {
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<ExpertDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is expert or admin
  const isExpertOrAdmin = user?.role && ['kg_expert', 'editor', 'administrator'].includes(user.role);

  useEffect(() => {
    if (!userLoading) {
      if (!user) {
        router.push('/login');
        return;
      }

      if (!isExpertOrAdmin) {
        router.push('/dashboard');
        return;
      }

      fetchExpertDashboard();
    }
  }, [user, userLoading, isExpertOrAdmin, router]);

  const fetchExpertDashboard = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getExpertDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Expert dashboard fetch error:', err);
      setError(err instanceof Error ? err.message : 'Veriler yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (userLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
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
            className="bg-green-500 text-white px-6 py-2 rounded-full font-bold hover:bg-green-600 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  // Access denied if not expert
  if (!isExpertOrAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-400 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <i className="fa-solid fa-user-doctor text-3xl"></i>
            <h1 className="font-display font-bold text-3xl md:text-4xl">Uzman Paneli</h1>
          </div>
          <p className="text-green-100 text-sm md:text-base">
            Hoş geldiniz, {user?.display_name || user?.name}! 🌟
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 -mt-8">
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Pending Questions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-question text-orange-500 text-xl"></i>
              </div>
              <span className="text-3xl font-bold text-orange-500">
                {dashboardData?.pending_questions || 0}
              </span>
            </div>
            <h3 className="font-bold text-slate-800">Bekleyen Sorular</h3>
            <p className="text-xs text-gray-500 mt-1">Cevaplanmayı bekliyor</p>
          </div>

          {/* Pending Comments */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-comment text-blue-500 text-xl"></i>
              </div>
              <span className="text-3xl font-bold text-blue-500">
                {dashboardData?.pending_comments || 0}
              </span>
            </div>
            <h3 className="font-bold text-slate-800">Bekleyen Yorumlar</h3>
            <p className="text-xs text-gray-500 mt-1">Moderasyon gerekli</p>
          </div>

          {/* Today's Answers */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-check-circle text-green-500 text-xl"></i>
              </div>
              <span className="text-3xl font-bold text-green-500">
                {dashboardData?.today_answers || 0}
              </span>
            </div>
            <h3 className="font-bold text-slate-800">Bugün Cevapladım</h3>
            <p className="text-xs text-gray-500 mt-1">Tebrikler!</p>
          </div>

          {/* Weekly Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-chart-line text-purple-500 text-xl"></i>
              </div>
              <span className="text-3xl font-bold text-purple-500">
                {dashboardData?.weekly_stats?.questions_answered || 0}
              </span>
            </div>
            <h3 className="font-bold text-slate-800">Bu Hafta</h3>
            <p className="text-xs text-gray-500 mt-1">Toplam cevap</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="font-bold text-xl text-slate-800 mb-4 flex items-center">
            <i className="fa-solid fa-bolt text-yellow-500 mr-2"></i>
            Hızlı İşlemler
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/topluluk"
              className="flex flex-col items-center justify-center p-6 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors border-2 border-transparent hover:border-orange-300"
            >
              <i className="fa-solid fa-reply text-orange-500 text-2xl mb-2"></i>
              <span className="font-bold text-sm text-slate-800">Soru Cevapla</span>
            </Link>
            <Link
              href="/topluluk"
              className="flex flex-col items-center justify-center p-6 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border-2 border-transparent hover:border-blue-300"
            >
              <i className="fa-solid fa-shield-halved text-blue-500 text-2xl mb-2"></i>
              <span className="font-bold text-sm text-slate-800">Moderasyon</span>
            </Link>
            <Link
              href="/tarifler"
              className="flex flex-col items-center justify-center p-6 bg-green-50 hover:bg-green-100 rounded-xl transition-colors border-2 border-transparent hover:border-green-300"
            >
              <i className="fa-solid fa-plus text-green-500 text-2xl mb-2"></i>
              <span className="font-bold text-sm text-slate-800">Yeni Tarif</span>
            </Link>
            <Link
              href="/malzeme-rehberi"
              className="flex flex-col items-center justify-center p-6 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors border-2 border-transparent hover:border-purple-300"
            >
              <i className="fa-solid fa-carrot text-purple-500 text-2xl mb-2"></i>
              <span className="font-bold text-sm text-slate-800">Malzeme Ekle</span>
            </Link>
          </div>
        </div>

        {/* Pending Questions Table */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-xl text-slate-800 flex items-center">
              <i className="fa-solid fa-list text-orange-500 mr-2"></i>
              Cevaplanacak Sorular
            </h2>
            <Link
              href="/topluluk"
              className="text-sm font-bold text-green-500 hover:underline"
            >
              Tümünü Gör
            </Link>
          </div>

          {/* Placeholder for questions list */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-user text-orange-500"></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 mb-1">
                    6 Aylık Bebeğim İlk Kez Patlıcan Yiyecek
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Merhaba, 6 aylık bebeğime ilk kez patlıcan vereceğim. Nasıl hazırlamalıyım?
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>
                      <i className="fa-solid fa-user mr-1"></i>
                      Anne Elif
                    </span>
                    <span>
                      <i className="fa-solid fa-clock mr-1"></i>
                      2 saat önce
                    </span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded-full font-bold">
                      BLW
                    </span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors">
                  Cevapla
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Questions Answered This Week */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
              <i className="fa-solid fa-chart-bar text-green-500 mr-2"></i>
              Haftalık Cevap İstatistikleri
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cevaplanan Sorular</span>
                <span className="font-bold text-green-500">
                  {dashboardData?.weekly_stats?.questions_answered || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Modere Edilen Yorumlar</span>
                <span className="font-bold text-blue-500">
                  {dashboardData?.weekly_stats?.comments_moderated || 0}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-800">Toplam Aktivite</span>
                  <span className="font-bold text-purple-500">
                    {(dashboardData?.weekly_stats?.questions_answered || 0) + 
                     (dashboardData?.weekly_stats?.comments_moderated || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
              <i className="fa-solid fa-clock-rotate-left text-blue-500 mr-2"></i>
              Son Aktiviteler
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    <span className="font-bold">&ldquo;BLW İlk Gün&rdquo;</span> sorusunu cevapladınız
                  </p>
                  <p className="text-xs text-gray-500">30 dakika önce</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    <span className="font-bold">3 yorum</span> onayladınız
                  </p>
                  <p className="text-xs text-gray-500">1 saat önce</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    Yeni tarif <span className="font-bold">&ldquo;Avokadolu Püresi&rdquo;</span> eklediniz
                  </p>
                  <p className="text-xs text-gray-500">2 saat önce</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
