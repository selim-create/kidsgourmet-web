'use client';

import Image from 'next/image';
import { useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { APP_DOWNLOAD_PATH, getStoreUrl } from '@/lib/app-links';
import {
  BANNER_DISMISS_KEY,
  getBannerPlatform,
  getServerMobilePlatform,
  subscribeToBannerEligibility,
} from '@/lib/app-platform-store';

export default function MobileAppBanner() {
  const pathname = usePathname();
  // Browser-only eligibility is an external snapshot, not effect-owned React state.
  // The server snapshot stays hidden until the client has hydrated.
  const platform = useSyncExternalStore(
    subscribeToBannerEligibility,
    getBannerPlatform,
    getServerMobilePlatform
  );
  const [dismissedHere, setDismissedHere] = useState(false);
  const storeUrl = getStoreUrl(platform);

  if (pathname === APP_DOWNLOAD_PATH || dismissedHere || !storeUrl) return null;

  const handleDismiss = () => {
    try {
      window.localStorage.setItem(BANNER_DISMISS_KEY, String(Date.now()));
    } finally {
      setDismissedHere(true);
    }
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
