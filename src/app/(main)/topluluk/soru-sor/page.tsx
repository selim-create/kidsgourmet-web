"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getCircles, createDiscussion } from '@/lib/community';
import type { Circle } from '@/lib/types';
import { useUser } from '@/hooks/use-user';
import AuthRequiredBanner from '@/components/ui/AuthRequiredBanner';

export default function AskQuestionPage() {
  const router = useRouter();
  const { isAuthenticated } = useUser();
  
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [selectedCircleId, setSelectedCircleId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    async function fetchCircles() {
      try {
        const circlesData = await getCircles();
        setCircles(circlesData);
      } catch (err) {
        console.error('Error fetching circles:', err);
        toast.error('Çemberler yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    }

    fetchCircles();
  }, []);

  function validateForm(): boolean {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Konu başlığı gereklidir';
    } else if (title.trim().length < 10) {
      newErrors.title = 'Konu başlığı en az 10 karakter olmalıdır';
    }

    if (!content.trim()) {
      newErrors.content = 'Detaylı açıklama gereklidir';
    } else if (content.trim().length < 20) {
      newErrors.content = 'Açıklama en az 20 karakter olmalıdır';
    }

    if (!selectedCircleId) {
      newErrors.circle = 'Lütfen bir çember seçin';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      
      await createDiscussion({
        title: title.trim(),
        content: content.trim(),
        circle_id: selectedCircleId!,
      });

      toast.success('Sorunuz uzmanlarımız tarafından incelendikten sonra yayına alınacaktır');
      
      // Redirect to community page
      router.push('/topluluk');
    } catch (err) {
      console.error('Error creating discussion:', err);
      toast.error('Soru gönderilirken bir hata oluştu. Lütfen giriş yaptığınızdan emin olun.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24 lg:pb-12">
        
        {/* MOBILE BACK HEADER */}
        <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-20 z-40">
            <Link href="/topluluk" className="text-gray-500 text-lg"><i className="fa-solid fa-arrow-left"></i></Link>
            <span className="font-bold text-slate-800 text-sm">Soru Sor</span>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {!isAuthenticated ? (
              <AuthRequiredBanner 
                title="Soru Sormak İçin Giriş Yapın"
                description="Toplulukta soru sormak ve diğer ailelerin deneyimlerinden faydalanmak için giriş yapmanız gerekiyor."
                icon="fa-regular fa-comment-dots"
              />
            ) : (
              <>
                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                    
                    <h1 className="font-display font-bold text-2xl text-slate-800 mb-6">Ne sormak istersiniz?</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Circle Selection */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">
                              İlgili Çemberi Seçin <span className="text-red-500">*</span>
                            </label>
                            {loading ? (
                              <div className="text-sm text-gray-500">Çemberler yükleniyor...</div>
                            ) : (
                              <div className="flex flex-wrap gap-3">
                                  {circles.map((circle) => (
                                      <button
                                          key={circle.id}
                                          type="button"
                                          onClick={() => setSelectedCircleId(circle.id)}
                                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                                              selectedCircleId === circle.id
                                              ? 'border-orange-500 bg-orange-50 ring-2 ring-offset-1 ring-orange-500'
                                              : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                          }`}
                                      >
                                          <span 
                                            className="w-2 h-2 rounded-full" 
                                            style={{ backgroundColor: circle.color_code }}
                                          ></span>
                                          {circle.name}
                                      </button>
                                  ))}
                              </div>
                            )}
                            {errors.circle && (
                              <p className="mt-2 text-sm text-red-600">{errors.circle}</p>
                            )}
                        </div>

                        {/* Title Input */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">
                              Konu Başlığı <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="title" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Örn: 9 aylık bebeğim brokoli yemiyor, ne yapabilirim?" 
                                className={`w-full px-4 py-3 rounded-xl border ${
                                  errors.title ? 'border-red-500' : 'border-gray-200'
                                } focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all text-slate-800 placeholder-gray-400`}
                            />
                            {errors.title && (
                              <p className="mt-2 text-sm text-red-600">{errors.title}</p>
                            )}
                        </div>

                        {/* Content Input */}
                        <div>
                            <label htmlFor="content" className="block text-sm font-bold text-gray-700 mb-2">
                              Detaylar <span className="text-red-500">*</span>
                            </label>
                            <textarea 
                                id="content" 
                                rows={6}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Durumu detaylıca anlatın, diğer annelerin tecrübelerine ihtiyacınız var..." 
                                className={`w-full px-4 py-3 rounded-xl border ${
                                  errors.content ? 'border-red-500' : 'border-gray-200'
                                } focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all text-slate-800 placeholder-gray-400 resize-none`}
                            ></textarea>
                            {errors.content && (
                              <p className="mt-2 text-sm text-red-600">{errors.content}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-gray-50 flex items-center justify-end gap-4">
                            <Link 
                              href="/topluluk"
                              className="text-gray-500 font-bold text-sm hover:text-slate-800 transition-colors"
                            >
                              İptal
                            </Link>
                            <button 
                              type="submit" 
                              disabled={submitting}
                              className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-orange-600 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {submitting ? 'Gönderiliyor...' : 'Yayınla'}
                            </button>
                        </div>

                    </form>

                </div>
                
                {/* Rules Reminder */}
                <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 items-start">
                    <i className="fa-solid fa-circle-info text-blue-500 mt-1"></i>
                    <div>
                        <h4 className="font-bold text-blue-800 text-sm">Hatırlatma</h4>
                        <p className="text-xs text-blue-700 mt-1">
                            Burada tıbbi tavsiye vermek veya istemek yasaktır. Acil durumlar için lütfen doktorunuza danışın. Topluluk kurallarına uygun paylaşımlar yapmaya özen gösterin.
                        </p>
                    </div>
                </div>
              </>
            )}

        </div>

    </div>
  );
}