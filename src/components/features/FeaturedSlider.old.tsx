"use client";

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { RecipeCard } from '@/lib/types';
import { BlogPost } from '@/services/blog-service';
import { Discussion } from '@/lib/types';
import { decodeHTMLEntities } from '@/utils/helpers';

type FeaturedContentType = 'recipe' | 'blog' | 'question' | 'sponsored';

interface FeaturedContent {
  id: number;
  type: FeaturedContentType;
  date: string;
  data: RecipeCard | BlogPost | Discussion | any;
}

interface FeaturedSliderProps {
  items: FeaturedContent[];
}

export default function FeaturedSlider({ items }: FeaturedSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState<FeaturedContentType | 'all'>('all');

  // Filter items based on selected filter
  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.type === filter);

  // Find last sponsor for filter button
  const lastSponsor = items.find(item => item.type === 'sponsored');

  useEffect(() => {
    // Reset to first item when filter changes
    setCurrentIndex(0);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [filter]);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 400;
      if (direction === 'left') {
        sliderRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  // Update current index on scroll
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleScroll = () => {
      const scrollLeft = slider.scrollLeft;
      const itemWidth = slider.scrollWidth / filteredItems.length;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setCurrentIndex(newIndex);
    };

    slider.addEventListener('scroll', handleScroll);
    return () => slider.removeEventListener('scroll', handleScroll);
  }, [filteredItems.length]);

  const renderRecipeCard = (recipe: RecipeCard, index: number) => {
    const isHero = index === 0;
    
    if (isHero) {
      return (
        <Link 
          href={`/tarifler/${recipe.slug}`} 
          className="flex-shrink-0 w-full md:w-[650px] lg:w-[800px] snap-center bg-white rounded-[2rem] shadow-lg overflow-hidden relative flex flex-col md:flex-row group cursor-pointer border border-gray-100"
        >
          <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden bg-gray-100">
            <img 
              src={recipe.image || 'https://placehold.co/800x800/FF8A65/ffffff?text=Tarif'} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              alt={decodeHTMLEntities(recipe.title)} 
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-orange-500 shadow-sm">
              <i className="fa-solid fa-fire mr-1"></i> Haftanın Tarifi
            </div>
          </div>
          <div className="p-8 md:p-10 flex flex-col justify-center w-full md:w-1/2 bg-white">
            <span className="text-green-500 font-bold text-sm mb-2 uppercase tracking-wider">
              {recipe.age_group}
            </span>
            <h3 className="font-sans font-bold text-3xl text-slate-800 mb-4 leading-tight">
              {decodeHTMLEntities(recipe.title)}
            </h3>
            <div className="flex items-center gap-4">
              <span className="bg-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-md group-hover:bg-orange-600 transition-colors">
                Tarife Git
              </span>
              <span className="text-xs text-gray-400">
                <i className="fa-solid fa-clock mr-1"></i> {recipe.prep_time}
              </span>
            </div>
          </div>
        </Link>
      );
    }

    return (
      <Link 
        href={`/tarifler/${recipe.slug}`}
        className="flex-shrink-0 w-full md:w-[400px] lg:w-[450px] snap-center bg-white rounded-[2rem] shadow-md overflow-hidden relative flex flex-col border border-gray-100 group"
      >
        <div className="h-48 relative overflow-hidden bg-gray-100">
          <img 
            src={recipe.image || 'https://placehold.co/800x400/FF8A65/ffffff?text=Tarif'} 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            alt={decodeHTMLEntities(recipe.title)} 
          />
          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-green-500 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
            {recipe.age_group}
          </span>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="font-sans font-bold text-xl text-slate-800 mb-2">
            {decodeHTMLEntities(recipe.title)}
          </h3>
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
            <span><i className="fa-solid fa-clock mr-1"></i> {recipe.prep_time}</span>
          </div>
          <div className="text-orange-500 font-bold text-sm hover:underline flex items-center mt-auto">
            Tarife Git <i className="fa-solid fa-arrow-right ml-2"></i>
          </div>
        </div>
      </Link>
    );
  };

  const renderBlogCard = (post: BlogPost) => {
    const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, '');
    const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
                     'https://placehold.co/800x400/AED581/ffffff?text=Rehber';
    const categoryName = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Rehber';

    return (
      <Link
        href={`/blog/${post.slug}`}
        className="flex-shrink-0 w-full md:w-[400px] lg:w-[450px] snap-center bg-white rounded-[2rem] shadow-md overflow-hidden relative flex flex-col border border-gray-100 group"
      >
        <div className="h-48 relative overflow-hidden bg-green-100">
          <img 
            src={imageUrl} 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            alt={decodeHTMLEntities(stripHtml(post.title.rendered))} 
          />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
          <span className="absolute bottom-4 left-4 text-white font-bold text-lg font-sans">
            {categoryName}
          </span>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="font-sans font-bold text-xl text-slate-800 mb-2">
            {decodeHTMLEntities(stripHtml(post.title.rendered))}
          </h3>
          <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-2">
            {decodeHTMLEntities(stripHtml(post.excerpt.rendered))}
          </p>
          <div className="text-orange-500 font-bold text-sm hover:underline flex items-center">
            Rehberi Oku <i className="fa-solid fa-arrow-right ml-2"></i>
          </div>
        </div>
      </Link>
    );
  };

  const renderQuestionCard = (question: Discussion) => {
    return (
      <div className="flex-shrink-0 w-full md:w-[400px] lg:w-[450px] snap-center bg-gradient-to-br from-purple-500 to-purple-600 rounded-[2rem] shadow-md overflow-hidden relative flex flex-col p-6 text-white border border-purple-400">
        <div className="flex items-center gap-3 mb-4">
          <img 
            src={question.author.avatar || 'https://placehold.co/50x50/9C27B0/ffffff?text=A'} 
            className="w-10 h-10 rounded-full border-2 border-white/50" 
            alt={question.author.name} 
          />
          <div>
            <div className="font-bold text-sm">{question.author.name}</div>
            <div className="text-xs text-purple-200">Topluluk</div>
          </div>
        </div>
        
        <h3 className="font-sans font-bold text-xl mb-3 leading-tight">
          {decodeHTMLEntities(question.title)}
        </h3>
        
        <p className="text-sm text-purple-100 mb-4 flex-grow line-clamp-3">
          {decodeHTMLEntities(question.excerpt)}
        </p>
        
        <Link 
          href={`/topluluk/sorular/${question.slug}`}
          className="flex items-center justify-between bg-white/20 backdrop-blur hover:bg-white/30 transition-colors px-4 py-3 rounded-full"
        >
          <span className="font-bold text-sm">
            <i className="fa-solid fa-comments mr-2"></i>
            {question.comment_count} Cevap
          </span>
          <i className="fa-solid fa-arrow-right"></i>
        </Link>
      </div>
    );
  };

  const renderSponsoredCard = (sponsored: any) => {
    const sponsorData = sponsored.data.sponsor_data;
    
    return (
      <div className="flex-shrink-0 w-full md:w-[400px] lg:w-[450px] snap-center bg-blue-50 rounded-[2rem] shadow-md overflow-hidden relative flex flex-col border border-blue-100">
        <div className="h-48 relative overflow-hidden bg-blue-100">
          <img 
            src={sponsorData?.sponsor_image || 'https://placehold.co/800x400/81D4FA/ffffff?text=Sponsor'} 
            className="absolute inset-0 w-full h-full object-cover opacity-90" 
            alt="Sponsorlu İçerik" 
          />
          <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-md z-10">
            Sponsorlu
          </div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-2">
            {sponsorData?.sponsor_logo && typeof sponsorData.sponsor_logo === 'string' && (
              <img 
                src={sponsorData.sponsor_logo} 
                alt={sponsorData.sponsor_name || 'Sponsor'}
                className="h-6 object-contain"
              />
            )}
            <span className="text-xs font-bold text-gray-500 uppercase">
              {sponsorData?.sponsor_name || 'Sponsor'}
            </span>
          </div>
          <h3 className="font-sans font-bold text-xl text-slate-800 mb-2">
            {decodeHTMLEntities(sponsored.data.title?.rendered || sponsored.data.title || 'Sponsorlu İçerik')}
          </h3>
          <p className="text-sm text-gray-600 mb-4 flex-grow">
            {sponsored.data.excerpt?.rendered 
              ? decodeHTMLEntities(sponsored.data.excerpt.rendered.replace(/<[^>]*>?/gm, ''))
              : 'Sponsorlu içerik detayları için tıklayın.'}
          </p>
          <button className="w-full bg-white text-blue-500 border-2 border-blue-500 hover:bg-blue-500 hover:text-white py-2 rounded-full font-bold transition-all text-sm">
            İncele
          </button>
        </div>
      </div>
    );
  };

  const renderCard = (item: FeaturedContent, index: number) => {
    switch (item.type) {
      case 'recipe':
        return renderRecipeCard(item.data as RecipeCard, index);
      case 'blog':
        return renderBlogCard(item.data as BlogPost);
      case 'question':
        return renderQuestionCard(item.data as Discussion);
      case 'sponsored':
        return renderSponsoredCard(item);
      default:
        return null;
    }
  };

  const getSponsorLogoUrl = (sponsorData: any) => {
    if (!sponsorData) return null;
    return typeof sponsorData.sponsor_logo === 'string' 
      ? sponsorData.sponsor_logo 
      : (typeof sponsorData.sponsor_light_logo === 'string' 
          ? sponsorData.sponsor_light_logo 
          : null);
  };

  return (
    <div className="relative bg-orange-50/50 pt-8 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Slider Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 px-2 gap-4">
          <div>
            <h2 className="font-sans font-bold text-3xl text-slate-800">Öne Çıkanlar</h2>
            <p className="text-gray-500 text-sm">Bu hafta anneler neler konuşuyor?</p>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                filter === 'all'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setFilter('recipe')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                filter === 'recipe'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Tarif
            </button>
            <button
              onClick={() => setFilter('blog')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                filter === 'blog'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Rehber
            </button>
            <button
              onClick={() => setFilter('question')}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                filter === 'question'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Soru
            </button>
            {lastSponsor && lastSponsor.data.sponsor_data && (
              <button
                onClick={() => setFilter('sponsored')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
                  filter === 'sponsored'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {getSponsorLogoUrl(lastSponsor.data.sponsor_data) && (
                  <img 
                    src={getSponsorLogoUrl(lastSponsor.data.sponsor_data)!} 
                    alt={lastSponsor.data.sponsor_data.sponsor_name || 'Sponsor'}
                    className="h-4 object-contain"
                  />
                )}
                <span>{lastSponsor.data.sponsor_data.sponsor_name || 'Sponsor'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation and Counter */}
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="flex gap-2">
            <button 
              onClick={() => scrollSlider('left')} 
              className="w-10 h-10 rounded-full bg-white shadow-md text-gray-600 hover:text-orange-500 hover:scale-110 transition-all flex items-center justify-center z-10 cursor-pointer"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button 
              onClick={() => scrollSlider('right')} 
              className="w-10 h-10 rounded-full bg-white shadow-md text-gray-600 hover:text-orange-500 hover:scale-110 transition-all flex items-center justify-center z-10 cursor-pointer"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
          
          {/* Counter */}
          <div className="text-sm font-bold text-gray-600">
            {currentIndex + 1} / {filteredItems.length}
          </div>
        </div>

        {/* Scroll Container */}
        <div 
          ref={sliderRef} 
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 scroll-smooth px-1 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <React.Fragment key={`${item.type}-${item.id}`}>
                {renderCard(item, index)}
              </React.Fragment>
            ))
          ) : (
            <div className="flex-shrink-0 w-full text-center py-12">
              <p className="text-gray-500">Bu kategoride içerik bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
