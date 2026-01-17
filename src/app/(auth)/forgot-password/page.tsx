"use client";

import { useState } from "react";
import Link from "next/link";
import { authService } from "@/services/auth-service";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await authService.forgotPassword(email);
      if (response.success) {
        setSuccess(response.message || "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.");
        setEmail("");
      } else {
        setError(response.message || "Bir hata oluştu. Lütfen tekrar deneyin.");
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
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-50 via-brand-light to-green-50 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-secondary/20 rounded-full blur-3xl -ml-10 -mb-10"></div>
        
        <div className="relative z-10 text-center max-w-lg">
          {/* Decorative Icon */}
          <div className="mb-8 inline-block">
            <div className="w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center">
              <i className="fa-solid fa-key text-orange-500 text-5xl"></i>
            </div>
          </div>
          <h2 className="font-display font-bold text-4xl text-slate-800 mb-4">Şifrenizi mi Unuttunuz?</h2>
          <p className="text-gray-600 text-lg">Endişelenmeyin! E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.</p>
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
            <h2 className="text-3xl font-display font-bold text-slate-800">Şifremi Unuttum 🔑</h2>
            <p className="mt-2 text-sm text-gray-500">
              E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim.
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
              <i className="fa-solid fa-circle-check mr-2"></i>
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              <i className="fa-solid fa-circle-exclamation mr-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
                  className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm transition-colors" 
                  placeholder="ornek@email.com" 
                />
              </div>
            </div>

            <div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Gönderiliyor..." : "Şifre Sıfırlama Bağlantısı Gönder"}
              </button>
            </div>
          </form>

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
