"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useUser } from "@/hooks/use-user";
import { userService } from "@/services/user-service";
import { Child, SocialLinks } from "@/lib/types";
import ChildWizard from "@/components/features/ChildWizard";
import { toast } from "sonner";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: userLoading, logout, refreshUser } = useUser();
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [parentRole, setParentRole] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [birthDate, setBirthDate] = useState("");
  const [avatarId, setAvatarId] = useState<number | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  // Expert profile states
  const [biography, setBiography] = useState("");
  const [expertise, setExpertise] = useState<string[]>([]);
  const [newExpertise, setNewExpertise] = useState("");
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
  const [showEmail, setShowEmail] = useState(false);

  // Auth guard - giriş yapmamış kullanıcıları yönlendir
  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      router.push('/login?redirect=/profil');
    }
  }, [userLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setName(user.display_name || user.name);
      setEmail(user.email);
      setParentRole(user.parent_role || "");
      setGender(user.gender || "");
      setBirthDate(user.birth_date || "");
      setAvatarPreview(user.avatar_url || "");
      
      // Load expert fields
      setBiography(user.biography || "");
      setExpertise(user.expertise || []);
      setSocialLinks(user.social_links || {});
      setShowEmail(user.show_email || false);
    }
  }, [user]);

  // fetchChildren sadece authenticated ise çalışsın
  useEffect(() => {
    if (isAuthenticated) {
      fetchChildren();
    }
  }, [isAuthenticated]);

  // Giriş yapılmadıysa veya yükleme devam ediyorsa loading göster
  if (userLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

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
      interface UpdateData {
        name: string;
        email: string;
        password?: string;
        parent_role?: string;
        gender?: string;
        birth_date?: string;
        avatar_id?: number;
      }

      const updateData: UpdateData = {
        name,
        email,
      };

      if (password) updateData.password = password;
      if (parentRole) updateData.parent_role = parentRole;
      if (gender) updateData.gender = gender;
      if (birthDate) updateData.birth_date = birthDate;
      if (avatarId) updateData.avatar_id = avatarId;

      // Cast to the service's expected type
      await userService.updateProfile(updateData as any);
      toast.success('Profil bilgileri güncellendi');
      await refreshUser();
      setPassword(''); // Clear password field
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Profil güncellenirken hata oluştu');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Dosya boyutu kontrolü (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Dosya boyutu 2MB\'dan küçük olmalı');
      return;
    }
    
    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      toast.error('Sadece resim dosyaları yüklenebilir');
      return;
    }
    
    try {
      const response = await userService.uploadAvatar(file);
      setAvatarId(response.id);
      setAvatarPreview(response.url);
      toast.success('Profil fotoğrafı yüklendi');
    } catch (error) {
      toast.error('Fotoğraf yüklenirken hata oluştu');
    }
  };

  const handleUpdateExpertProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await userService.updateProfile({
        biography,
        expertise,
        social_links: socialLinks,
        show_email: showEmail,
      });
      toast.success('Uzman profili güncellendi');
      await refreshUser();
    } catch (error) {
      console.error('Error updating expert profile:', error);
      toast.error('Uzman profili güncellenirken hata oluştu');
    }
  };

  const addExpertise = () => {
    const trimmedExpertise = newExpertise.trim();
    if (trimmedExpertise && !expertise.includes(trimmedExpertise)) {
      setExpertise([...expertise, trimmedExpertise]);
      setNewExpertise("");
    }
  };

  const removeExpertise = (index: number) => {
    setExpertise(expertise.filter((_, i) => i !== index));
  };

  const isExpertUser = (user: any) => {
    return user?.is_expert || user?.role === 'kg_expert' || user?.role === 'editor' || user?.role === 'administrator';
  };

  const handleSocialLinkChange = (platform: keyof SocialLinks, value: string) => {
    setSocialLinks({...socialLinks, [platform]: value});
  };

  return (
    <div className="flex min-h-screen relative">

        {/* DESKTOP SIDEBAR */}
        <DashboardSidebar activePage="profil" />

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
                                {((child.allergies && child.allergies.length > 0) || (child.allergens && child.allergens.length > 0)) ? (
                                  <div className="flex flex-wrap gap-2">
                                    {(child.allergies || child.allergens || []).map((allergen) => (
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
                            {/* Username - Read Only */}
                            {user?.username && (
                              <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kullanıcı Adı</label>
                                <div className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-gray-500 font-medium">
                                  @{user.username}
                                </div>
                              </div>
                            )}

                            {/* Avatar Upload */}
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Profil Fotoğrafı</label>
                              <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                                  {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                  ) : (
                                    <i className="fa-solid fa-user text-3xl text-gray-400"></i>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    className="hidden"
                                    id="avatar-upload"
                                  />
                                  <label
                                    htmlFor="avatar-upload"
                                    className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-xl font-bold cursor-pointer transition-colors"
                                  >
                                    <i className="fa-solid fa-upload mr-2"></i>
                                    Fotoğraf Yükle
                                  </label>
                                  <p className="text-xs text-gray-500 mt-1">Maksimum 2MB, JPG veya PNG</p>
                                </div>
                              </div>
                            </div>

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

                            {/* Parent Role */}
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Ebeveyn Rolü</label>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {['Anne', 'Baba', 'Bakıcı', 'Diğer'].map((role) => (
                                  <button
                                    key={role}
                                    type="button"
                                    onClick={() => setParentRole(role)}
                                    className={`px-4 py-2 rounded-xl font-bold transition-colors ${
                                      parentRole === role
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                  >
                                    {role}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Gender and Birth Date */}
                            <div className="flex flex-col sm:flex-row gap-4">
                              <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cinsiyet</label>
                                <select
                                  value={gender}
                                  onChange={(e) => setGender(e.target.value)}
                                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:border-orange-500 transition-colors"
                                >
                                  <option value="">Seçiniz</option>
                                  <option value="female">Kadın</option>
                                  <option value="male">Erkek</option>
                                  <option value="other">Diğer</option>
                                </select>
                              </div>
                              <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Doğum Tarihi</label>
                                <input
                                  type="date"
                                  value={birthDate}
                                  onChange={(e) => setBirthDate(e.target.value)}
                                  max={new Date().toISOString().split('T')[0]}
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
                            
                            <div className="w-full bg-white/20 text-white font-medium py-3 rounded-xl text-center">
                                Premium Hesap şu an aktif değil
                            </div>
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

                {/* Expert Profile Section - Only for experts */}
                {isExpertUser(user) && (
                  <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 mt-6">
                    <h2 className="font-display font-bold text-xl text-slate-800 mb-6 flex items-center gap-2">
                      <i className="fa-solid fa-user-tie text-purple-500"></i> Uzman Profili
                    </h2>
                    
                    <form onSubmit={handleUpdateExpertProfile} className="space-y-5">
                      {/* Meslek / Uzmanlık Alanları */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Uzmanlık Alanları</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {expertise.map((skill, index) => (
                            <span key={index} className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                              {skill}
                              <button type="button" onClick={() => removeExpertise(index)} className="hover:text-purple-900" aria-label={`${skill} uzmanlık alanını kaldır`}>
                                <i className="fa-solid fa-xmark"></i>
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newExpertise}
                            onChange={(e) => setNewExpertise(e.target.value)}
                            placeholder="Yeni uzmanlık alanı ekle..."
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm"
                          />
                          <button type="button" onClick={addExpertise} className="px-4 py-2 bg-purple-500 text-white rounded-xl font-bold" aria-label="Uzmanlık alanı ekle">
                            Ekle
                          </button>
                        </div>
                      </div>

                      {/* Biyografi */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Biyografi</label>
                        <textarea
                          value={biography}
                          onChange={(e) => setBiography(e.target.value)}
                          rows={4}
                          placeholder="Kendinizi tanıtın..."
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-slate-800"
                        />
                      </div>

                      {/* Sosyal Medya Linkleri */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Sosyal Medya</label>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <i className="fa-brands fa-instagram text-pink-500 w-6"></i>
                            <input
                              type="url"
                              value={socialLinks.instagram || ''}
                              onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                              placeholder="https://instagram.com/kullaniciadi"
                              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2"
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <i className="fa-brands fa-twitter text-blue-400 w-6"></i>
                            <input
                              type="url"
                              value={socialLinks.twitter || ''}
                              onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                              placeholder="https://twitter.com/kullaniciadi"
                              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2"
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <i className="fa-brands fa-linkedin text-blue-600 w-6"></i>
                            <input
                              type="url"
                              value={socialLinks.linkedin || ''}
                              onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                              placeholder="https://linkedin.com/in/kullaniciadi"
                              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2"
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <i className="fa-brands fa-youtube text-red-500 w-6"></i>
                            <input
                              type="url"
                              value={socialLinks.youtube || ''}
                              onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                              placeholder="https://youtube.com/@kullaniciadi"
                              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2"
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <i className="fa-solid fa-globe text-green-500 w-6"></i>
                            <input
                              type="url"
                              value={socialLinks.website || ''}
                              onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                              placeholder="https://website.com"
                              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Herkese Açık Email */}
                      <div>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showEmail}
                            onChange={(e) => setShowEmail(e.target.checked)}
                            className="w-5 h-5 text-purple-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">Email adresimi profilimde herkese göster</span>
                        </label>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button type="submit" className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-purple-700 transition-colors">
                          Uzman Profilini Güncelle
                        </button>
                      </div>
                    </form>
                  </section>
                )}

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

        {/* Child Wizard */}
        <ChildWizard
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveChild}
          child={editingChild}
        />

    </div>
  );
}