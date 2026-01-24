"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image"; // Image import edildi
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth-service";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidLink, setIsValidLink] = useState(true);

  const key = searchParams.get("key");
  const login = searchParams.get("login");

  useEffect(() => {
    // URL parametrelerini kontrol et
    if (!key || !login) {
      setIsValidLink(false);
      setError("Geçersiz şifre sıfırlama bağlantısı.");
    }
  }, [key, login]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validasyon
    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.resetPassword(key!, login!, password);
      if (response.success) {
        setSuccess(response.message || "Şifreniz başarıyla değiştirildi!");
        // 3 saniye sonra login sayfasına yönlendir
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(response.message || "Bir hata oluştu.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white overflow-hidden mx-auto max-w-6xl">
      
      {/* LEFT SIDE: DECORATIVE (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-50 via-brand-light to-orange-50 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-200 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-100 rounded-full blur-3xl -ml-10 -mb-10 opacity-70"></div>
        
        <div className="relative z-10 text-center max-w-lg">
          {/* Decorative Icon */}
          <div className="mb-8 inline-block">
            <div className="w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center">
              <i className="fa-solid fa-shield-check text-green-500 text-5xl"></i>
            </div>
          </div>
          <h2 className="font-display font-bold text-4xl text-slate-800 mb-4">Yeni Şifre Belirleyin</h2>
          <p className="text-gray-600 text-lg">Güvenli bir şifre seçerek hesabınıza tekrar erişim sağlayın.</p>
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
            <h2 className="text-3xl font-display font-bold text-slate-800">Yeni Şifre 🔐</h2>
            <p className="mt-2 text-sm text-gray-500">
              Hesabınız için yeni bir şifre belirleyin.
            </p>
          </div>

          {/* Invalid Link Error */}
          {!isValidLink && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              <i className="fa-solid fa-circle-exclamation mr-2"></i>
              Geçersiz veya süresi dolmuş şifre sıfırlama bağlantısı.
              <div className="mt-3">
                <Link href="/forgot-password" className="text-red-700 font-bold underline">
                  Yeni bağlantı talep edin
                </Link>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
              <i className="fa-solid fa-circle-check mr-2"></i>
              {success}
              <div className="mt-2 text-green-600">
                Giriş sayfasına yönlendiriliyorsunuz...
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && !success && isValidLink && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              <i className="fa-solid fa-circle-exclamation mr-2"></i>
              {error}
            </div>
          )}

          {/* Form */}
          {isValidLink && !success && (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1">Yeni Şifre</label>
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
                    className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm"
                    placeholder="En az 6 karakter" 
                    minLength={6}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-1">Şifre Tekrar</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <i className="fa-solid fa-lock"></i>
                  </div>
                  <input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type="password" 
                    required 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm"
                    placeholder="Şifrenizi tekrar girin" 
                    minLength={6}
                  />
                </div>
              </div>

              <div>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? "İşleniyor..." : "Şifremi Değiştir"}
                </button>
              </div>
            </form>
          )}

          {/* Back to Login */}
          <div className="text-center">
            <Link href="/login" className="text-sm font-bold text-brand-primary hover:text-orange-600 transition-colors inline-flex items-center gap-2">
              <i className="fa-solid fa-arrow-left"></i>
              Giriş Sayfasına Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">Yükleniyor...</div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}