"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useUser } from "@/hooks/use-user";
import { userService } from "@/services/user-service";
import { Child } from "@/lib/types";
import ChildModal from "@/components/features/ChildModal";
import { toast } from "sonner";

export default function ProfileSettingsPage() {
  const { user, logout, refreshUser } = useUser();
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.display_name || user.name);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const childrenData = await userService.getChildren();
      setChildren(childrenData);
    } catch (error) {
      console.error('Error fetching children:', error);
      toast.error('Çocuk bilgileri yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddChild = () => {
    setEditingChild(null);
    setIsModalOpen(true);
  };

  const handleEditChild = (child: Child) => {
    setEditingChild(child);
    setIsModalOpen(true);
  };

  const handleSaveChild = async (childData: Omit<Child, 'id'> | Child) => {
    try {
      if ('id' in childData && childData.id) {
        // Update existing child
        await userService.updateChild(childData.id, childData);
        toast.success('Çocuk bilgileri güncellendi');
      } else {
        // Add new child
        await userService.addChild(childData as Omit<Child, 'id'>);
        toast.success('Çocuk başarıyla eklendi');
      }
      await fetchChildren();
      await refreshUser();
    } catch (error) {
      console.error('Error saving child:', error);
      throw error;
    }
  };

  const handleDeleteChild = async (childId: string) => {
    if (!confirm('Bu çocuğu silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await userService.deleteChild(childId);
      toast.success('Çocuk başarıyla silindi');
      await fetchChildren();
      await refreshUser();
    } catch (error) {
      console.error('Error deleting child:', error);
      toast.error('Çocuk silinirken hata oluştu');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      interface UpdateProfileData {
        name: string;
        email: string;
        password?: string;
      }

      const updateData: UpdateProfileData = {
        name,
        email,
      };

      if (password) {
        updateData.password = password;
      }

      await userService.updateProfile(updateData);
      toast.success('Profil bilgileri güncellendi');
      await refreshUser();
      setPassword(''); // Clear password field
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Profil güncellenirken hata oluştu');
    }
  };
  return (
    <div className="flex min-h-screen relative">

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 flex-col sticky top-20 h-[calc(100vh-5rem)] z-10 overflow-y-auto">
            <nav className="flex-1 px-4 py-6 space-y-2">
                {/* Localde Link kullanın */}
                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
                    <i className="fa-solid fa-house"></i> Genel Bakış
                </Link>
                <Link href="/dashboard/haftalik-plan" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
                    <i className="fa-solid fa-calendar-days"></i> Haftalık Plan
                </Link>
                <Link href="/favoriler" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
                    <i className="fa-solid fa-heart"></i> Favorilerim
                </Link>
                <div className="pt-6 pb-2">
                    <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Hesap</p>
                </div>
                <Link href="/profil" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-100 text-orange-500 font-bold">
                    <i className="fa-solid fa-user"></i> Profilim
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-slate-800 font-medium transition-colors">
                    <i className="fa-solid fa-credit-card"></i> Abonelik
                </Link>
            </nav>

            <div className="p-4 border-t border-gray-50 mt-auto">
                <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-bold">
                    <i className="fa-solid fa-arrow-right-from-bracket"></i> Çıkış Yap
                </button>
            </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 w-full min-w-0">
            
            {/* MOBILE HEADER */}
            <div className="lg:hidden bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-20 z-30 border-b border-gray-100">
                <span className="font-display font-bold text-lg text-slate-800">Profilim</span>
                <button onClick={logout} className="text-red-500 text-sm font-bold">Çıkış</button>
            </div>

            {/* PROFILE CONTENT */}
            <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 pb-24">

                {/* 1. CHILDREN MANAGEMENT (Top Priority) */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-display font-bold text-xl text-slate-800">Çocuklarım</h2>
                        <button 
                          onClick={handleAddChild}
                          className="bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-bold hover:bg-green-600 hover:text-white transition-colors flex items-center gap-2"
                        >
                            <i className="fa-solid fa-plus"></i> <span className="hidden sm:inline">Yeni Ekle</span>
                        </button>
                    </div>

                    {isLoading ? (
                      <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Yükleniyor...</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        
                        {children.map((child, index) => (
                          <div 
                            key={child.id} 
                            className={`bg-white rounded-3xl shadow-sm p-6 relative overflow-hidden group ${
                              index === 0 ? 'border-2 border-orange-500' : 'border border-gray-100 hover:shadow-md transition-shadow'
                            }`}
                          >
                            <div className="absolute top-3 right-3 flex gap-2">
                              <button 
                                onClick={() => handleEditChild(child)}
                                className="text-gray-300 hover:text-orange-500 transition-colors"
                              >
                                <i className="fa-solid fa-pen-to-square"></i>
                              </button>
                              <button 
                                onClick={() => handleDeleteChild(child.id)}
                                className="text-gray-300 hover:text-red-500 transition-colors"
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                                  index === 0 ? 'bg-orange-100 text-orange-500 border-2 border-orange-500' : 'bg-gray-100 text-gray-500'
                                }`}>
                                  {child.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">{child.name}</h3>
                                    <p className={`text-sm font-medium ${index === 0 ? 'text-orange-500' : 'text-gray-500'}`}>
                                      {child.age_months ? `${child.age_months} Aylık` : 'Bebek'}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Doğum Tarihi</span>
                                    <span className="font-medium text-slate-700">
                                      {new Date(child.birth_date).toLocaleDateString('tr-TR')}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-400 mb-2 font-bold uppercase">Alerjenler</p>
                                {child.allergens && child.allergens.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {child.allergens.map((allergen) => (
                                      <span key={allergen} className="px-2 py-1 bg-red-50 text-red-500 rounded-lg text-xs font-bold border border-red-100">
                                        {allergen}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-xs text-green-500 font-medium">
                                    <i className="fa-solid fa-check mr-1"></i> Bilinen alerji yok
                                  </span>
                                )}
                            </div>
                          </div>
                        ))}

                        {/* Add New Child Card */}
                        <button 
                          onClick={handleAddChild}
                          className="border-2 border-dashed border-gray-300 rounded-3xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-all group h-full min-h-[200px]"
                        >
                            <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-white flex items-center justify-center text-xl mb-3 transition-colors">
                                <i className="fa-solid fa-plus"></i>
                            </div>
                            <span className="font-bold text-sm">Yeni Çocuk Ekle</span>
                        </button>

                      </div>
                    )}
                </section>

                <hr className="border-gray-200" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* 2. PARENT PROFILE */}
                    <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <h2 className="font-display font-bold text-xl text-slate-800 mb-6 flex items-center gap-2">
                            <i className="fa-solid fa-id-card text-orange-500"></i> Ebeveyn Bilgileri
                        </h2>
                        
                        <form onSubmit={handleUpdateProfile} className="space-y-5">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ad Soyad</label>
                                    <input 
                                      type="text" 
                                      value={name} 
                                      onChange={(e) => setName(e.target.value)}
                                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:border-orange-500 transition-colors" 
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">E-Posta</label>
                                    <input 
                                      type="email" 
                                      value={email}
                                      onChange={(e) => setEmail(e.target.value)}
                                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:border-orange-500 transition-colors" 
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Şifre Değiştir</label>
                                <input 
                                  type="password" 
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  placeholder="Yeni şifreniz (Değiştirmek istemiyorsanız boş bırakın)" 
                                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:border-orange-500 transition-colors" 
                                />
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button type="submit" className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-slate-700 transition-colors">
                                    Bilgileri Güncelle
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* 3. SUBSCRIPTION & SETTINGS */}
                    <section className="space-y-6">
                        
                        {/* Subscription Card */}
                        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            
                            <div className="relative z-10 flex items-start justify-between">
                                <div>
                                    <span className="bg-white/20 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block">Üyelik Durumu</span>
                                    <h3 className="font-display font-bold text-2xl mb-1">KidsGourmet Free</h3>
                                    <p className="text-purple-200 text-sm mb-4">Bazı özellikler kısıtlı.</p>
                                </div>
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
                                    <i className="fa-solid fa-crown"></i>
                                </div>
                            </div>
                            
                            <button className="w-full bg-white text-purple-700 font-bold py-3 rounded-xl hover:bg-purple-50 transition-colors shadow-sm">
                                Premium'a Yükselt (₺29.99/ay)
                            </button>
                        </div>

                        {/* Preferences */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-bold text-slate-800 mb-4">Tercihler</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Haftalık Bülten (E-posta)</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Yeni Tarif Bildirimleri</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                    </section>
                </div>

            </div>
        </main>

        {/* MOBILE BOTTOM NAVIGATION */}
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-3 pb-safe z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <Link href="/dashboard" className="flex flex-col items-center text-gray-400 hover:text-orange-500 transition-colors">
                <i className="fa-solid fa-house text-xl mb-1"></i>
                <span className="text-[10px] font-medium">Panelim</span>
            </Link>
            <Link href="/dashboard/haftalik-plan" className="flex flex-col items-center text-gray-400 hover:text-orange-500 transition-colors">
                <i className="fa-solid fa-calendar-days text-xl mb-1"></i>
                <span className="text-[10px] font-medium">Plan</span>
            </Link>
            <div className="relative -top-8">
                <Link href="#" className="flex items-center justify-center w-14 h-14 bg-orange-500 rounded-full text-white shadow-lg shadow-orange-200 hover:scale-105 transition-transform">
                    <i className="fa-solid fa-magnifying-glass text-2xl"></i>
                </Link>
            </div>
            <Link href="/favoriler" className="flex flex-col items-center text-gray-400 hover:text-orange-500 transition-colors">
                <i className="fa-solid fa-heart text-xl mb-1"></i>
                <span className="text-[10px] font-medium">Favoriler</span>
            </Link>
            <Link href="/profil" className="flex flex-col items-center text-orange-500 transition-colors">
                <i className="fa-solid fa-user text-xl mb-1"></i>
                <span className="text-[10px] font-bold">Profil</span>
            </Link>
        </div>

        {/* Child Modal */}
        <ChildModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveChild}
          child={editingChild}
        />

    </div>
  );
}