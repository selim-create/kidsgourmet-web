'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingListItem } from '@/lib/types';
import { userService } from '@/services/user-service';

export default function DashboardShoppingList() {
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShoppingList = async () => {
      try {
        const data = await userService.getShoppingList();
        setShoppingList(data || []);
      } catch (error) {
        console.error('Shopping list fetch error:', error);
        setShoppingList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShoppingList();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-sm p-6 border border-stone-100">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (shoppingList.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-sm p-6 border border-stone-100">
        <h2 className="font-display font-black text-xl text-stone-900 mb-4 flex items-center gap-2">
          🛒 Alışveriş Listesi
        </h2>
        <div className="text-center py-8 bg-stone-50 rounded-2xl border border-stone-200">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-orange-100">
            <i className="fa-solid fa-basket-shopping text-orange-500 text-2xl"></i>
          </div>
          <p className="text-stone-600 mb-4 text-sm">Henüz alışveriş listeniz boş</p>
          <Link 
            href="/dashboard/haftalik-plan"
            className="inline-flex items-center bg-orange-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-sm"
          >
            <i className="fa-solid fa-calendar mr-2"></i>
            Plan Oluştur
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 border border-stone-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-black text-xl text-stone-900 flex items-center gap-2">
          🛒 Alışveriş Listesi
        </h2>
        <Link 
          href="/alisveris-listesi"
          className="text-sm font-bold text-orange-500 hover:underline"
        >
          Tümünü Gör
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {shoppingList.slice(0, 9).map((item) => (
          <div 
            key={item.id} 
            className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100"
          >
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
              item.checked ? 'bg-stone-400' : 'bg-green-500'
            }`} />
            <span className={`text-sm flex-1 min-w-0 ${
              item.checked ? 'line-through text-stone-400' : 'text-stone-700 font-medium'
            }`}>
              {item.ingredient}
              {item.amount && <span className="text-stone-500 ml-1">({item.amount})</span>}
            </span>
          </div>
        ))}
      </div>

      {shoppingList.length > 9 && (
        <div className="text-center text-sm text-stone-500">
          +{shoppingList.length - 9} ürün daha
        </div>
      )}

      <Link 
        href="/alisveris-listesi"
        className="block w-full bg-orange-500 text-white text-center py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-sm mt-4"
      >
        <i className="fa-solid fa-basket-shopping mr-2"></i>
        Tüm Listeyi Görüntüle ({shoppingList.length})
      </Link>
    </div>
  );
}
