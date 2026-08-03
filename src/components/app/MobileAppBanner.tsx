'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  APP_DOWNLOAD_PATH,
  detectMobilePlatform,
  getStoreUrl,
  type MobilePlatform,
} from '@/lib/app-links';

const DISMISS_KEY = 'kg_app_banner_dismissed_at';
const DISMISS_DURATION_MS = 14 * 24 * 60 * 60 * 1000;

export default function MobileAppBanner() {
  const pathname = usePathname();
  const [platform, setPlatform] = useState<MobilePlatform>('other');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pathname === APP_DOWNLOAD_PATH) return;
    if (!window.matchMedia('(max-width: 767px)').matches) return;
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    const detectedPlatform = detectMobilePlatform(window.navigator.userAgent);
    if (detectedPlatform === 'other') return;

    const dismissedAt = Number(window.localStorage.getItem(DISMISS_KEY) || 0);
    if (dismissedAt && Date.now() - dismissedAt < DISMISS_DURATION_MS) return;

    setPlatform(detectedPlatform);
    setVisible(true);
  }, [pathname]);

  const storeUrl = useMemo(() => getStoreUrl(platform), [platform]);

  if (!visible || !storeUrl) return null;

  const handleDismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  };

  return (
    <aside
      aria-label="KidsGourmet mobil uygulaması"
      className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+76px)] z-40 md:hidden"
    >
      <div className="mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-orange-100 bg-white p-3 shadow-2xl shadow-slate-900/15">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50">
          <Image
            src="/kidsgourmet-logo.svg"
            alt="KidsGourmet"
            width={42}
            height={42}
            className="h-8 w-10 object-contain"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-slate-900">KidsGourmet uygulaması</p>
          <p className="text-xs leading-snug text-slate-500">Tarifler ve ebeveyn rehberi cebinde.</p>
        </div>

        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-orange-600"
        >
          İndir
        </a>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Uygulama indirme önerisini kapat"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <i className="fa-solid fa-xmark" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
