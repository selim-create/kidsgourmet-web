"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { useGoogleAuth } from "@/hooks/use-google-auth";
import { authService } from "@/services/auth-service";

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useUser();
  const { isScriptLoaded, initializeGoogleButton, isLoading: googleLoading, error: googleError } = useGoogleAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [childName, setChildName] = useState("");
  const [childBirthDate, setChildBirthDate] = useState("");
  const [skipChild, setSkipChild] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  // Google butonunu initialize et
  useEffect(() => {
    if (isScriptLoaded && googleButtonRef.current) {
      initializeGoogleButton('google-register-button', async () => {
        await refreshUser();
        router.push("/dashboard");
      });
    }
  }, [isScriptLoaded, initializeGoogleButton, refreshUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const registerData: {
        email: string;
        password: string;
        name: string;
        username?: string;
        child?: { name: string; birth_date: string };
      } = {
        email,
        password,
        name,
      };

      // Add username if provided
      if (username.trim()) {
        registerData.username = username.trim();
      }

      // Add child profile if not skipped and fields are filled
      if (!skipChild && childName.trim() && childBirthDate) {
        registerData.child = {
          name: childName.trim(),
          birth_date: childBirthDate,
        };
      }

      const response = await authService.register(registerData);
      await refreshUser();
      
      // Rol tabanlı yönlendirme
      if (response.redirect_url) {
        router.push(response.redirect_url);
      } else if (response.is_expert) {
        router.push("/dashboard/expert");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt başarısız oldu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white overflow-hidden mx-auto max-w-6xl">
        
        {/* LEFT SIDE: DECORATIVE (Desktop) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-50 via-brand-light to-orange-50 relative items-center justify-center p-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-200 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-100 rounded-full blur-3xl -ml-10 -mb-10 opacity-70"></div>
            
            <div className="relative z-10 text-center max-w-lg">
                {/* Decorative Illustration */}
                <div className="mb-8 relative inline-block">
                    <div className="w-64 h-64 bg-white/50 backdrop-blur-sm rounded-full shadow-2xl transform rotate-2 border-8 border-white flex items-center justify-center">
                        <div className="text-center">
                            <i className="fa-solid fa-child-reaching text-green-500 text-7xl mb-4"></i>
                            <i className="fa-solid fa-sparkles text-yellow-400 text-4xl"></i>
                        </div>
                    </div>
                    <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-lg flex items-center gap-3 animate-pulse">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-brand-primary">
                            <i className="fa-solid fa-gift"></i>
                        </div>
                        <div className="text-left">
                            <p className="text-xs text-gray-400 font-bold uppercase">Yeni Üyelere</p>
                            <p className="font-bold text-slate-800">Özel Rehberler</p>
                        </div>
                    </div>
                </div>
                <h2 className="font-display font-bold text-4xl text-slate-800 mb-4">Sağlıklı Bir Başlangıç.</h2>
                <p className="text-gray-600 text-lg">KidsGourmet ailesine katılarak çocuğunuzun gelişimine en uygun beslenme yolculuğunu başlatın.</p>
            </div>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white overflow-y-auto">
            <div className="w-full max-w-md space-y-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 cursor-pointer group mb-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-orange-400 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                        <div className="relative w-12 h-12 flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                            <i className="fa-solid fa-carrot text-orange-500 text-4xl"></i>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-display font-bold text-3xl tracking-tight text-slate-800 leading-none">
                            Kids<span className="text-orange-500">Gourmet</span>
                        </span>
                        <span className="text-xs text-gray-400 font-medium tracking-wide">Sağlıklı Nesiller</span>
                    </div>
                </Link>

                <div>
                    <h2 className="text-3xl font-display font-bold text-slate-800">Aramıza Katılın! 🚀</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Zaten hesabınız var mı? <Link href="/login" className="font-bold text-brand-secondary hover:text-green-600 transition-colors">Giriş Yap</Link>
                    </p>
                </div>

                {/* Google Sign-In Button */}
                <div>
                    <div 
                      id="google-register-button" 
                      ref={googleButtonRef}
                      className="w-full flex items-center justify-center"
                    >
                      {/* Google SDK butonu buraya render edilecek */}
                      {!isScriptLoaded && (
                        <button 
                          disabled 
                          className="w-full flex items-center justify-center gap-2 bg-gray-100 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-400 cursor-not-allowed"
                        >
                          <i className="fa-brands fa-google text-lg"></i> Google ile Kayıt Ol
                        </button>
                      )}
                    </div>
                    {googleError && (
                      <p className="text-red-500 text-sm mt-2 text-center">{googleError}</p>
                    )}
                </div>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-400 font-medium">veya e-posta ile kayıt</span>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                        <label htmlFor="fullname" className="block text-sm font-bold text-gray-700 mb-1">Ad Soyad</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <i className="fa-regular fa-user"></i>
                            </div>
                            <input 
                              id="fullname" 
                              name="fullname" 
                              type="text" 
                              required 
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary focus:z-10 sm:text-sm transition-colors" 
                              placeholder="Adınız Soyadınız" 
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-1">Kullanıcı Adı <span className="text-gray-400 font-normal">(opsiyonel)</span></label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <i className="fa-solid fa-at"></i>
                            </div>
                            <input 
                              id="username" 
                              name="username" 
                              type="text" 
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary focus:z-10 sm:text-sm transition-colors" 
                              placeholder="kullaniciadi" 
                            />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Benzersiz bir kullanıcı adı seçin</p>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">E-Posta Adresi</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <i className="fa-regular fa-envelope"></i>
                            </div>
                            <input 
                              id="email" 
                              name="email" 
                              type="email" 
                              required 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary focus:z-10 sm:text-sm transition-colors" 
                              placeholder="ornek@email.com" 
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1">Şifre</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <i className="fa-solid fa-lock"></i>
                            </div>
                            <input 
                              id="password" 
                              name="password" 
                              type="password" 
                              required 
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary focus:z-10 sm:text-sm transition-colors" 
                              placeholder="En az 6 karakter" 
                            />
                        </div>
                    </div>

                    {/* Child Profile Section */}
                    <div className="border-t border-gray-200 pt-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <i className="fa-solid fa-baby text-green-500"></i>
                                Çocuk Profili
                                <span className="text-gray-400 font-normal">(opsiyonel)</span>
                            </h3>
                            <button
                              type="button"
                              onClick={() => setSkipChild(!skipChild)}
                              className="text-xs font-medium text-gray-500 hover:text-gray-700"
                            >
                              {skipChild ? "Ekle" : "Atla"}
                            </button>
                        </div>

                        {!skipChild && (
                          <div className="space-y-4 bg-green-50 p-4 rounded-xl">
                            <div>
                              <label htmlFor="childName" className="block text-sm font-bold text-gray-700 mb-1">Çocuğunuzun Adı</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                  <i className="fa-solid fa-child"></i>
                                </div>
                                <input 
                                  id="childName" 
                                  name="childName" 
                                  type="text" 
                                  value={childName}
                                  onChange={(e) => setChildName(e.target.value)}
                                  className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary focus:z-10 sm:text-sm transition-colors bg-white" 
                                  placeholder="Çocuğunuzun adı" 
                                />
                              </div>
                            </div>

                            <div>
                              <label htmlFor="childBirthDate" className="block text-sm font-bold text-gray-700 mb-1">Doğum Tarihi</label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                  <i className="fa-regular fa-calendar"></i>
                                </div>
                                <input 
                                  id="childBirthDate" 
                                  name="childBirthDate" 
                                  type="date" 
                                  value={childBirthDate}
                                  onChange={(e) => setChildBirthDate(e.target.value)}
                                  className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary focus:z-10 sm:text-sm transition-colors bg-white" 
                                />
                              </div>
                            </div>

                            <p className="text-xs text-gray-600 flex items-start gap-2">
                              <i className="fa-solid fa-circle-info text-green-500 mt-0.5"></i>
                              <span>Çocuk profilini daha sonra panelden de ekleyebilirsiniz.</span>
                            </p>
                          </div>
                        )}
                    </div>

                    <div>
                        <button 
                          type="submit" 
                          disabled={isLoading || googleLoading}
                          className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Kayıt yapılıyor..." : "Ücretsiz Kayıt Ol"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
}