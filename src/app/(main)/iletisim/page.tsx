"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function IletisimPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    requestType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '', requestType: 'general' });
      
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-orange-500 transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-gray-800">İletişim & Reklam</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">İletişim & Reklam</h1>
          <p className="text-gray-600 mt-3">Bizimle iletişime geçin veya iş birliği fırsatlarını keşfedin</p>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          
          {/* İletişim Formu */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Bize Ulaşın</h2>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
                <i className="fa-solid fa-check-circle mr-2"></i>
                Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="requestType" className="block text-sm font-semibold text-slate-700 mb-2">
                  Talep Türü
                </label>
                <select
                  id="requestType"
                  name="requestType"
                  value={formData.requestType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors"
                  required
                >
                  <option value="general">Genel İletişim</option>
                  <option value="advertising">Reklam & Sponsorluk</option>
                  <option value="partnership">İş Birliği</option>
                  <option value="support">Teknik Destek</option>
                  <option value="content">İçerik Önerisi</option>
                </select>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                  Adınız Soyadınız
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  E-posta Adresiniz
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-2">
                  Konu
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                  Mesajınız
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane mr-2"></i>
                    Mesajı Gönder
                  </>
                )}
              </button>
            </form>
          </div>

          {/* İletişim Bilgileri & Sosyal Medya */}
          <div className="space-y-6">
            
            {/* İletişim Bilgileri */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">İletişim Bilgileri</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-orange-100 rounded-lg text-orange-500 shrink-0">
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">E-posta</h4>
                    <a href="mailto:iletisim@kidsgourmet.com.tr" className="text-gray-600 hover:text-orange-500 transition-colors">
                      iletisim@kidsgourmet.com.tr
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-orange-100 rounded-lg text-orange-500 shrink-0">
                    <i className="fa-solid fa-building"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">Kurumsal</h4>
                    <p className="text-gray-600">Hip Medya</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sosyal Medya */}
            <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl shadow-sm border border-orange-100 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Bizi Takip Edin</h2>
              <div className="flex flex-wrap gap-3">
                <a href="#" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-orange-500 hover:text-orange-500 transition-colors">
                  <i className="fa-brands fa-instagram text-xl"></i>
                  Instagram
                </a>
                <a href="#" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-red-500 hover:text-red-500 transition-colors">
                  <i className="fa-brands fa-youtube text-xl"></i>
                  YouTube
                </a>
                <a href="#" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:text-blue-400 transition-colors">
                  <i className="fa-brands fa-twitter text-xl"></i>
                  Twitter
                </a>
              </div>
            </div>

            {/* Reklam & Sponsorluk */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-sm border border-green-100 p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-3">Reklam & Sponsorluk</h2>
              <p className="text-gray-600 text-sm mb-4">
                Markanızı binlerce anne-baba ile buluşturmak, KidsGourmet topluluğuna ulaşmak için bizimle iletişime geçin.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
                <i className="fa-solid fa-check-circle"></i>
                <span>Hedefli kitle erişimi</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600 font-semibold mt-2">
                <i className="fa-solid fa-check-circle"></i>
                <span>Güvenilir platform</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
