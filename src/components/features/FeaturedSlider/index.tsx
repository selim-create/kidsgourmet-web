"use client";

import React, { useRef, useState, useEffect } from 'react';
import { RecipeCard as RecipeCardType } from '@/lib/types';
import { BlogPost } from '@/services/blog-service';
import { Discussion } from '@/lib/types';
import RecipeCard from './RecipeCard';
import QuestionCard from './QuestionCard';
import GuideCard from './GuideCard';
import SponsorCard from './SponsorCard';

type FeaturedContentType = 'recipe' | 'blog' | 'question' | 'sponsored';

interface FeaturedContent {
  id: number;
  type: FeaturedContentType;
  date: string;
  data: RecipeCardType | BlogPost | Discussion | any;
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

  // Count items by type for filter badges
  const typeCounts = {
    recipe: items.filter(item => item.type === 'recipe').length,
    blog: items.filter(item => item.type === 'blog').length,
    question: items.filter(item => item.type === 'question').length,
    sponsored: items.filter(item => item.type === 'sponsored').length,
  };

  useEffect(() => {
    // Reset to first item when filter changes
    setCurrentIndex(0);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [filter]);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 450;
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
    if (!slider || filteredItems.length === 0) return;

    const handleScroll = () => {
      const scrollLeft = slider.scrollLeft;
      const itemWidth = slider.scrollWidth / filteredItems.length;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setCurrentIndex(newIndex);
    };

    slider.addEventListener('scroll', handleScroll);
    return () => slider.removeEventListener('scroll', handleScroll);
  }, [filteredItems.length]);

  const renderCard = (item: FeaturedContent) => {
    switch (item.type) {
      case 'recipe':
        return <RecipeCard key={`recipe-${item.id}`} recipe={item.data as RecipeCardType} />;
      case 'blog':
        return <GuideCard key={`blog-${item.id}`} post={item.data as BlogPost} />;
      case 'question':
        return <QuestionCard key={`question-${item.id}`} question={item.data as Discussion} />;
      case 'sponsored':
        return <SponsorCard key={`sponsored-${item.id}`} sponsor={item.data as BlogPost} />;
      default:
        return null;
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="relative bg-orange-50/50 pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Slider Header and Filters */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-6 px-2">
          <div>
            <h2 className="font-display font-bold text-3xl text-slate-800">Günün Öne Çıkanları</h2>
            <p className="text-gray-500 text-sm">Tarifler, rehberler, sorular ve sponsorlu öneriler tek akışta.</p>

            {/* Filter Chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`featured-filter px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                  filter === 'all'
                    ? 'border-orange-200 bg-orange-50 text-orange-500'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                Tümü
              </button>
              
              {typeCounts.recipe > 0 && (
                <button
                  onClick={() => setFilter('recipe')}
                  className={`featured-filter px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                    filter === 'recipe'
                      ? 'border-orange-200 bg-orange-50 text-orange-500'
                      : 'border-orange-200 bg-orange-50 text-orange-500 hover:bg-orange-100'
                  }`}
                >
                  <i className="fa-solid fa-utensils mr-2"></i>Tarif
                </button>
              )}
              
              {typeCounts.blog > 0 && (
                <button
                  onClick={() => setFilter('blog')}
                  className={`featured-filter px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                    filter === 'blog'
                      ? 'border-blue-200 bg-blue-50 text-blue-600'
                      : 'border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  <i className="fa-solid fa-book-open mr-2"></i>Rehber
                </button>
              )}
              
              {typeCounts.question > 0 && (
                <button
                  onClick={() => setFilter('question')}
                  className={`featured-filter px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                    filter === 'question'
                      ? 'border-purple-200 bg-purple-50 text-purple-500'
                      : 'border-purple-200 bg-purple-50 text-purple-500 hover:bg-purple-100'
                  }`}
                >
                  <i className="fa-regular fa-comments mr-2"></i>Soru
                </button>
              )}
              
              {typeCounts.sponsored > 0 && (
                <button
                  onClick={() => setFilter('sponsored')}
                  className={`featured-filter px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                    filter === 'sponsored'
                      ? 'border-slate-200 bg-slate-50 text-slate-600'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <i className="fa-solid fa-badge-check mr-2"></i>Sponsor
                </button>
              )}

              <div className="ml-auto hidden sm:flex items-center gap-2 text-xs text-gray-400">
                <span className="font-bold text-gray-500">{currentIndex + 1} / {filteredItems.length}</span>
                <span>•</span>
                <span>Kaydırarak keşfet</span>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-2 self-end">
            <button
              onClick={() => scrollSlider('left')}
              className="w-10 h-10 rounded-full bg-white shadow-md text-gray-600 hover:text-orange-500 transition-colors flex items-center justify-center"
              aria-label="Önceki içerik"
            >
              <i className="fa-solid fa-chevron-left" aria-hidden="true"></i>
            </button>
            <button
              onClick={() => scrollSlider('right')}
              className="w-10 h-10 rounded-full bg-white shadow-md text-gray-600 hover:text-orange-500 transition-colors flex items-center justify-center"
              aria-label="Sonraki içerik"
            >
              <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        {/* Scroll Container */}
        <div
          ref={sliderRef}
          id="sliderContainer"
          className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-8 hide-scroll scroll-smooth px-1 items-stretch"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => renderCard(item))
          ) : (
            <div className="flex-shrink-0 w-full text-center py-12">
              <p className="text-gray-500">Bu kategoride içerik bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .hide-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
