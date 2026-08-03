'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import AppStoreButtons from '@/components/app/AppStoreButtons';
import {
  APP_STORE_URL,
  GOOGLE_PLAY_URL,
  detectMobilePlatform,
  getStoreUrl,
} from '@/lib/app-links';

export default function DownloadAppPage() {
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const platform = detectMobilePlatform(window.navigator.userAgent);
    const storeUrl = getStoreUrl(platform);

    if (!storeUrl) return;

    setRedirecting(true);
    const timeout = window.setTimeout(() => {
      window.location.replace(storeUrl);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <section className="min-h-[70vh] bg-gradient-to-br from-orange-50 via-white to-yellow-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-xl shadow-orange-100/40">
        <div className="grid gap-0 lg:grid-cols-2">
          <div className="flex flex-col justify-center p-8 text-center sm:p-12 lg:text-left">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-orange-50 lg:mx-0">
              <Image
                src="/kidsgourmet-logo.svg"
                alt="KidsGourmet"
                width={80}
                height={80}
                className="h-14 w-20 object-contain"
                priority
              />
            </div>

            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-500">KidsGourmet mobil</p>
            <h1 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">Ebeveyn rehberin cebinde</h1>
            <p className="mt-4 text-base leading-relaxed text-slate-500">
              Sağlıklı tariflere, beslenme rehberlerine ve akıllı araçlara tek uygulamadan ulaş.
            </p>

            {redirecting && (
              <p className="mt-5 text-sm font-semibold text-orange-600" role="status">
                Seni uygun uygulama mağazasına yönlendiriyoruz…
              </p>
            )}

            <AppStoreButtons className="mt-8" />
          </div>

          <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden bg-slate-950 p-8 text-white sm:p-12">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl" />

            <div className="relative z-10 max-w-sm">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <i className="fa-solid fa-mobile-screen-button text-xl text-orange-400" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-bold">Tek link, doğru mağaza</p>
                  <p className="text-xs text-white/60">iPhone ve Android otomatik algılanır.</p>
                </div>
              </div>

              <ul className="space-y-4 text-sm text-white/80">
                <li className="flex gap-3">
                  <i className="fa-solid fa-check mt-0.5 text-orange-400" aria-hidden="true" />
                  <span>Bebek ve çocuklara özel tarifler</span>
                </li>
                <li className="flex gap-3">
                  <i className="fa-solid fa-check mt-0.5 text-orange-400" aria-hidden="true" />
                  <span>Beslenme ve ebeveynlik rehberleri</span>
                </li>
                <li className="flex gap-3">
                  <i className="fa-solid fa-check mt-0.5 text-orange-400" aria-hidden="true" />
                  <span>Akıllı hesaplama ve planlama araçları</span>
                </li>
              </ul>

              <div className="mt-8 border-t border-white/10 pt-5 text-xs text-white/50">
                Yönlendirme olmazsa mağaza butonlarından seçim yapabilirsin.
              </div>
            </div>
          </div>
        </div>
      </div>

      <noscript>
        <div className="mx-auto mt-6 max-w-4xl rounded-xl bg-white p-4 text-center text-sm text-slate-600">
          JavaScript kapalı. iOS için <a className="font-bold text-orange-600" href={APP_STORE_URL}>App Store</a>, Android için{' '}
          <a className="font-bold text-orange-600" href={GOOGLE_PLAY_URL}>Google Play</a> bağlantısını kullan.
        </div>
      </noscript>
    </section>
  );
}
