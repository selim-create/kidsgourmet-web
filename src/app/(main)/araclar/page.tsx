"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { toolService } from '@/services/tool-service';
import type { Tool } from '@/lib/types';

// Fallback araç listesi (API'den veri gelmezse)
const defaultTools: Tool[] = [
  {
    id: 1,
    title: 'BLW Hazırlık Testi',
    slug: 'blw-testi',
    description: 'WHO standartlarında 8 soruda bebeğinizin BLW\'ye hazır olup olmadığını öğrenin.',
    icon: 'fa-solid fa-baby',
    tool_type: 'blw_test',
    is_active: true,
    requires_auth: false,
  },
  {
    id: 2,
    title: 'Persentil Hesaplayıcı',
    slug: 'persentil',
    description: 'Bebeğinizin boy ve kilosunu WHO büyüme eğrileriyle karşılaştırın.',
    icon: 'fa-solid fa-chart-line',
    tool_type: 'percentile',
    is_active: true,
    requires_auth: false,
  },
  {
    id: 3,
    title: 'Su İhtiyacı Hesaplayıcı',
    slug: 'su-ihtiyaci',
    description: 'Bebeğinizin günlük sıvı ihtiyacını hesaplayın.',
    icon: 'fa-solid fa-glass-water',
    tool_type: 'water_calculator',
    is_active: true,
    requires_auth: false,
  },
  {
    id: 4,
    title: 'Ek Gıda Rehberi',
    slug: 'ek-gida-rehberi',
    description: 'Bu besin bebeğime uygun mu? Malzemeleri arayın ve yaşa göre uygunluğunu öğrenin.',
    icon: 'fa-solid fa-carrot',
    tool_type: 'food_guide',
    is_active: true,
    requires_auth: false,
  },
  {
    id: 5,
    title: 'Ek Gıdaya Başlama Kontrolü',
    slug: 'ek-gidaya-baslama',
    description: 'Bebeğiniz katı gıdaya hazır mı? Hazırlık testini yapın ve öneriler alın.',
    icon: 'fa-solid fa-utensils',
    tool_type: 'solid_food_readiness',
    is_active: true,
    requires_auth: false,
  },
  {
    id: 6,
    title: 'Bu Gıda Verilir mi?',
    slug: 'bu-gida-verilir-mi',
    description: 'Tek bir besin için hızlı karar verin. Hangi yaşta, nasıl verilebilir?',
    icon: 'fa-solid fa-check-circle',
    tool_type: 'food_checker',
    is_active: true,
    requires_auth: false,
  },
  {
    id: 7,
    title: 'Alerjen Deneme Planlayıcı',
    slug: 'alerjen-planlayici',
    description: 'Potansiyel alerjenleri güvenli şekilde tanıtma planı oluşturun.',
    icon: 'fa-solid fa-shield-heart',
    tool_type: 'allergen_planner',
    is_active: true,
    requires_auth: false,
  },
  {
    id: 8,
    title: 'Besin Deneme Takvimi',
    slug: 'besin-takvimi',
    description: 'Hangi gıdaların ne zaman denendiğini takip edin ve kayıt altına alın.',
    icon: 'fa-solid fa-calendar-check',
    tool_type: 'food_trial_calendar',
    is_active: true,
    requires_auth: true,
  },
];

const toolIconColors: Record<string, string> = {
  blw_test: 'bg-green-50 text-green-500',
  percentile: 'bg-blue-50 text-blue-500',
  water_calculator: 'bg-cyan-50 text-cyan-500',
  food_guide: 'bg-orange-50 text-orange-500',
  solid_food_readiness: 'bg-amber-50 text-amber-500',
  food_checker: 'bg-emerald-50 text-emerald-500',
  allergen_planner: 'bg-red-50 text-red-500',
  food_trial_calendar: 'bg-purple-50 text-purple-500',
  meal_planner: 'bg-orange-50 text-orange-500',
};

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>(defaultTools);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const data = await toolService.getTools();
        if (data && data.length > 0) {
          setTools(data);
        }
      } catch (error) {
        console.log('Using default tools:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTools();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-20 z-30">
        <span className="font-display font-bold text-lg text-slate-800">Akıllı Asistan</span>
      </div>

      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
          </div>
          <h1 className="font-display font-bold text-3xl text-slate-800 mb-2">Akıllı Asistan</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Bebek beslenmesi yolculuğunuzda size yardımcı olacak interaktif araçlar
          </p>
        </div>

        {/* Tools Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="w-14 h-14 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.filter(tool => tool.is_active).map((tool) => (
              <Link
                key={tool.id}
                href={`/araclar/${tool.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-2xl transition-transform group-hover:scale-110 ${toolIconColors[tool.tool_type] || 'bg-gray-50 text-gray-500'}`}>
                    <i className={tool.icon}></i>
                  </div>

                  {/* Content */}
                  <h3 className="font-display font-bold text-lg text-slate-800 mb-2 group-hover:text-orange-500 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {tool.description}
                  </p>

                  {/* CTA */}
                  <div className="mt-4 flex items-center text-orange-500 text-sm font-bold">
                    <span>Başla</span>
                    <i className="fa-solid fa-arrow-right ml-2 transition-transform group-hover:translate-x-1"></i>
                  </div>
                </div>

                {/* Bottom Accent */}
                <div className="h-1 bg-gradient-to-r from-orange-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </Link>
            ))}
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-circle-info"></i>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-1">Uzman Kontrolünde İçerik</h4>
            <p className="text-sm text-gray-600">
              Tüm araçlarımız pediatri uzmanları ve diyetisyenler tarafından kontrol edilmiştir. 
              Ancak bu araçlar tıbbi tanı yerine geçmez, kesin bilgi için doktorunuza danışın.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}