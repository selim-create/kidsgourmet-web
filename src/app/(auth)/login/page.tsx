"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image"; // Image import edildi
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { useGoogleAuth } from "@/hooks/use-google-auth";

export default function LoginPage() {
  const router = useRouter();
  const { login, refreshUser } = useUser();
  const { isScriptLoaded, initializeGoogleButton, isLoading: googleLoading, error: googleError } = useGoogleAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  // Google butonunu initialize et
  useEffect(() => {
    if (isScriptLoaded && googleButtonRef.current) {
      initializeGoogleButton('google-signin-button', async () => {
        await refreshUser();
        // Google login sonrası da rol tabanlı yönlendirme yapılabilir
        // Ancak authService.googleLogin'den response almamız gerekir
        router.push("/dashboard");
      });
    }
  }, [isScriptLoaded, initializeGoogleButton, refreshUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await login(username, password);
      
      // Rol tabanlı yönlendirme
      if (response.redirect_url) {
        router.push(response.redirect_url);
      } else if (response.is_expert) {
        router.push("/dashboard/expert");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Giriş başarısız oldu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white overflow-hidden mx-auto max-w-6xl">
        
        {/* LEFT SIDE: DECORATIVE (Desktop) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-50 via-brand-light to-green-50 relative items-center justify-center p-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-secondary/20 rounded-full blur-3xl -ml-10 -mb-10"></div>
            
            <div className="relative z-10 text-center max-w-lg">
                {/* Decorative Illustration */}
                <div className="mb-8 relative inline-block">
                    <div className="w-64 h-64 bg-white/50 backdrop-blur-sm rounded-full shadow-2xl transform -rotate-3 border-8 border-white flex items-center justify-center">
                        <Image 
                          src="/kidsgourmet-icon.svg" 
                          alt="KidsGourmet" 
                          width={120} 
                          height={120} 
                          className="w-32 h-32 object-contain"
                        />
                    </div>
                    <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-lg flex items-center gap-3 animate-bounce">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <i className="fa-solid fa-check"></i>
                        </div>
                        <div className="text-left">
                            <p className="text-xs text-gray-400 font-bold uppercase">Bugünün Menüsü</p>
                            <p className="font-bold text-slate-800">Hazır!</p>
                        </div>
                    </div>
                </div>
                <h2 className="font-display font-bold text-4xl text-slate-800 mb-4">Mutfakta Yalnız Değilsiniz.</h2>
                <p className="text-gray-600 text-lg">KidsGourmet&apos;ye giriş yapın, bebeğinize özel haftalık planlara, uzman görüşlerine ve tariflere ulaşın.</p>
            </div>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white overflow-y-auto">
            <div className="w-full max-w-md space-y-8">
                {/* Logo - Updated with Split SVGs and Hover Animation */}
                <Link href="/" className="flex items-center gap-3 cursor-pointer group mb-8 justify-center lg:justify-start">
                    
                    {/* 1. Part: Carrot Icon (Animated) */}
                    <div className="relative flex items-center justify-center">
                        <Image 
                            src="/kidsgourmet-icon.svg" 
                            alt="KidsGourmet İkon" 
                            width={48} 
                            height={48} 
                            priority
                            className="w-12 h-12 object-contain transition-transform duration-300 ease-in-out group-hover:rotate-12"
                        />
                    </div>

                    {/* 2. Part: Text Logo (Static) */}
                    <div className="flex flex-col justify-center">
                        <Image 
                            src="/kidsgourmet-text.svg" 
                            alt="KidsGourmet" 
                            width={180} 
                            height={48} 
                            priority
                            className="h-12 w-auto object-contain"
                        />
                    </div>

                </Link>

                <div>
                    <h2 className="text-3xl font-display font-bold text-slate-800">Tekrar Hoş Geldiniz! 👋</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Hesabınız yok mu? <Link href="/register" className="font-bold text-brand-primary hover:text-orange-600 transition-colors">Hemen ücretsiz kayıt olun</Link>
                    </p>
                </div>

                {/* Google Sign-In Button */}
                <div>
                    <div 
                      id="google-signin-button" 
                      ref={googleButtonRef}
                      className="w-full flex items-center justify-center"
                    >
                      {/* Google SDK butonu buraya render edilecek */}
                      {!isScriptLoaded && (
                        <button 
                          disabled 
                          className="w-full flex items-center justify-center gap-2 bg-gray-100 border border-gray-200 rounded-xl py-3 px-4 text-sm font-bold text-gray-400 cursor-not-allowed"
                        >
                          <i className="fa-brands fa-google text-lg"></i> Google ile Giriş Yap
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
                        <span className="px-2 bg-white text-gray-400 font-medium">veya e-posta ile</span>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-1">E-posta veya Kullanıcı Adı</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 z-10">
                                    <i className="fa-regular fa-envelope"></i>
                                </div>
                                <input 
                                  id="username" 
                                  name="username" 
                                  type="text" 
                                  required 
                                  value={username}
                                  onChange={(e) => setUsername(e.target.value)}
                                  className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm transition-colors z-0" 
                                  placeholder="E-posta veya Kullanıcı Adı"
                                  style={{ WebkitBoxShadow: '0 0 0 1000px white inset' } as React.CSSProperties}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label htmlFor="password" className="block text-sm font-bold text-gray-700">Şifre</label>
                                <Link href="/forgot-password" className="text-xs font-bold text-brand-primary hover:text-orange-600">Şifremi Unuttum?</Link>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 z-10">
                                    <i className="fa-solid fa-lock"></i>
                                </div>
                                <input 
                                  id="password" 
                                  name="password" 
                                  type="password" 
                                  required 
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm transition-colors z-0" 
                                  placeholder="••••••••"
                                  style={{ WebkitBoxShadow: '0 0 0 1000px white inset' } as React.CSSProperties}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex gap-3">
                          <button 
                            type="submit" 
                            disabled={isLoading || googleLoading}
                            className="group relative flex-1 flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                              {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
                          </button>
                          <Link
                            href="/register"
                            className="flex-1 flex justify-center items-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                          >
                              Kayıt Ol
                          </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
}