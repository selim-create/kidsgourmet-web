"use client";

import React, { useState, useEffect, Suspense, useRef } from 'react';
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import { getCircles, createDiscussion } from '@/lib/community';
import type { Circle } from '@/lib/types';
import { useUser } from '@/hooks/use-user';
import AuthRequiredBanner from '@/components/ui/AuthRequiredBanner';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

function AskQuestionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useUser();
  
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [selectedCircleId, setSelectedCircleId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Scroll ref for horizontal list
  const scrollRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Durumu detaylıca anlatın, diğer annelerin tecrübelerine ihtiyacınız var...',
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  // Initialize title from query parameter
  useEffect(() => {
    const konu = searchParams.get('konu');
    if (konu) {
      setTitle(konu);
    }
  }, [searchParams]);

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

  // Scroll handlers
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24 lg:pb-12">
        
        {/* MOBILE BACK HEADER */}
        <div className="lg:hidden bg-white border-b border-gray-100 px-4 pt-[25px] py-3 flex items-center gap-3 sticky top-0 z-40 shadow-sm">
            <Link href="/topluluk" className="text-gray-500 text-lg p-1 -ml-1"><i className="fa-solid fa-arrow-left"></i></Link>
            <span className="font-bold text-slate-800 text-base">Soru Sor</span>
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
                    
                    <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-800 mb-2 hidden lg:block">Ne sormak istersiniz?</h1>
                    <p className="text-gray-500 mb-8 hidden lg:block">Benzer durumda olan diğer ebeveynlerden ve uzmanlarımızdan destek alın.</p>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        
                        {/* Circle Selection (Scrollable with Arrows) */}
                        <div className="relative group">
                            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs flex-shrink-0">1</span>
                              İlgi Odağı Seçin <span className="text-red-500">*</span>
                            </label>
                            
                            {loading ? (
                              <div className="text-sm text-gray-500 p-4 text-center bg-gray-50 rounded-xl">Odaklar yükleniyor...</div>
                            ) : (
                              <div className="relative -mx-2 px-2">
                                {/* Left Arrow - Dikey ortalamayı iyileştirmek için z-20 ve border eklendi */}
                                <button 
                                  type="button"
                                  onClick={scrollLeft}
                                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-gray-400 hover:text-orange-500 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden md:flex border border-gray-100"
                                >
                                  <i className="fa-solid fa-chevron-left text-xs"></i>
                                </button>

                                {/* DÜZELTME: pb-4 -> pb-2 ve items-center eklendi */}
                                <div 
                                  ref={scrollRef}
                                  className="flex gap-2 overflow-x-auto pb-2 pt-1 px-1 hide-scroll snap-x items-center"
                                >
                                    {circles.map((circle) => (
                                        <button
                                            key={circle.id}
                                            type="button"
                                            onClick={() => setSelectedCircleId(circle.id)}
                                            className={`snap-start flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all border whitespace-nowrap ${
                                                selectedCircleId === circle.id
                                                ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm ring-1 ring-orange-200'
                                                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                                            }`}
                                        >
                                            {/* DÜZELTME: block ve flex-shrink-0 eklendi */}
                                            <span 
                                              className="block w-2.5 h-2.5 rounded-full ring-2 ring-white flex-shrink-0" 
                                              style={{ backgroundColor: circle.color_code }}
                                            ></span>
                                            {circle.name}
                                        </button>
                                    ))}
                                </div>

                                {/* Right Arrow */}
                                <button 
                                  type="button"
                                  onClick={scrollRight}
                                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center text-gray-400 hover:text-orange-500 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden md:flex border border-gray-100"
                                >
                                  <i className="fa-solid fa-chevron-right text-xs"></i>
                                </button>
                              </div>
                            )}
                            {errors.circle && (
                              <p className="mt-1 text-xs text-red-500 font-medium flex items-center gap-1">
                                <i className="fa-solid fa-circle-exclamation"></i> {errors.circle}
                              </p>
                            )}
                        </div>

                        {/* Title Input */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs flex-shrink-0">2</span>
                              Konu Başlığı <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="title" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Örn: 9 aylık bebeğim brokoli yemiyor, ne yapabilirim?" 
                                className={`w-full px-4 py-3.5 rounded-xl border ${
                                  errors.title ? 'border-red-300 focus:border-red-500 bg-red-50/30' : 'border-gray-200 bg-gray-50/50 focus:bg-white'
                                } focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-slate-800 placeholder-gray-400 font-medium`}
                            />
                            {errors.title && (
                              <p className="mt-2 text-xs text-red-500 font-medium flex items-center gap-1">
                                <i className="fa-solid fa-circle-exclamation"></i> {errors.title}
                              </p>
                            )}
                        </div>

                        {/* Content Input with TipTap */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs flex-shrink-0">3</span>
                              Detaylar <span className="text-red-500">*</span>
                            </label>
                            <div className={`border ${
                              errors.content ? 'border-red-300 bg-red-50/30' : 'border-gray-200 bg-white'
                            } rounded-xl overflow-hidden shadow-sm focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10 transition-all`}>
                              
                              <div className="flex gap-1 p-2 bg-gray-50 border-b border-gray-200/60">
                                <button 
                                  type="button" 
                                  onClick={() => editor?.chain().focus().toggleBold().run()} 
                                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${editor?.isActive('bold') ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                                  title="Kalın"
                                >
                                  <i className="fa-solid fa-bold text-xs"></i>
                                </button>
                                <button 
                                  type="button" 
                                  onClick={() => editor?.chain().focus().toggleItalic().run()} 
                                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${editor?.isActive('italic') ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                                  title="İtalik"
                                >
                                  <i className="fa-solid fa-italic text-xs"></i>
                                </button>
                                <button 
                                  type="button" 
                                  onClick={() => editor?.chain().focus().toggleBulletList().run()} 
                                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${editor?.isActive('bulletList') ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                                  title="Liste"
                                >
                                  <i className="fa-solid fa-list-ul text-xs"></i>
                                </button>
                                
                                <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>

                                <div className="relative">
                                  <button 
                                    type="button" 
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${showEmojiPicker ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                                    title="Emoji"
                                  >
                                    <i className="fa-regular fa-face-smile"></i>
                                  </button>
                                  {showEmojiPicker && (
                                    <div className="absolute left-0 top-full mt-2 z-50 shadow-xl rounded-xl overflow-hidden border border-gray-100">
                                      <div className="fixed inset-0 bg-black/5 z-40 lg:hidden" onClick={() => setShowEmojiPicker(false)}></div>
                                      <div className="relative z-50">
                                        <EmojiPicker 
                                          onEmojiClick={(emoji) => {
                                            editor?.chain().focus().insertContent(emoji.emoji).run();
                                            setShowEmojiPicker(false);
                                          }} 
                                          width={300}
                                          height={350}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <EditorContent 
                                editor={editor} 
                                className="p-4 min-h-[180px] prose prose-sm max-w-none focus:outline-none"
                              />
                            </div>
                            {errors.content && (
                              <p className="mt-2 text-xs text-red-500 font-medium flex items-center gap-1">
                                <i className="fa-solid fa-circle-exclamation"></i> {errors.content}
                              </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3 md:gap-4">
                            <Link 
                              href="/topluluk"
                              className="px-6 py-3 rounded-xl text-gray-500 font-bold text-sm hover:bg-gray-100 transition-colors"
                            >
                              İptal
                            </Link>
                            <button 
                              type="submit" 
                              disabled={submitting}
                              className="bg-orange-500 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 hover:shadow-orange-300 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                            >
                                {submitting ? (
                                  <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    <span>Gönderiliyor...</span>
                                  </>
                                ) : (
                                  <>
                                    <span>Yayınla</span>
                                    <i className="fa-solid fa-paper-plane text-xs"></i>
                                  </>
                                )}
                            </button>
                        </div>

                    </form>

                </div>
                
                {/* Rules Reminder */}
                <div className="mt-6 bg-blue-50/50 border border-blue-100 rounded-2xl p-5 flex gap-4 items-start">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                      <i className="fa-solid fa-shield-heart text-lg"></i>
                    </div>
                    <div>
                        <h4 className="font-bold text-blue-900 text-sm mb-1">Topluluk Kuralları</h4>
                        <p className="text-xs text-blue-700/80 leading-relaxed">
                            Burada tıbbi tavsiye vermek veya istemek yasaktır. Acil durumlar için lütfen doktorunuza danışın. Saygı çerçevesinde, destekleyici bir dille paylaşım yapmaya özen gösterin.
                        </p>
                    </div>
                </div>
              </>
            )}

        </div>

    </div>
  );
}

export default function AskQuestionPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    }>
      <AskQuestionForm />
    </Suspense>
  );
}