import Link from 'next/link';
import { APP_STORE_URL, GOOGLE_PLAY_URL } from '@/lib/app-links';

interface AppStoreButtonsProps {
  compact?: boolean;
  className?: string;
}

export default function AppStoreButtons({ compact = false, className = '' }: AppStoreButtonsProps) {
  const buttonClass = compact
    ? 'min-h-11 px-4 py-2.5 rounded-xl'
    : 'min-h-14 px-5 py-3 rounded-2xl';

  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <Link
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="KidsGourmet uygulamasını App Store'dan indirin"
        className={`${buttonClass} inline-flex items-center justify-center gap-3 bg-slate-950 text-white hover:bg-slate-800 transition-colors shadow-sm`}
      >
        <i className="fa-brands fa-apple text-2xl" aria-hidden="true" />
        <span className="text-left leading-tight">
          <span className="block text-[10px] uppercase tracking-wide text-white/70">App Store&apos;dan</span>
          <span className="block text-sm font-bold">İndirin</span>
        </span>
      </Link>

      <Link
        href={GOOGLE_PLAY_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="KidsGourmet uygulamasını Google Play'den indirin"
        className={`${buttonClass} inline-flex items-center justify-center gap-3 bg-slate-950 text-white hover:bg-slate-800 transition-colors shadow-sm`}
      >
        <i className="fa-brands fa-google-play text-xl" aria-hidden="true" />
        <span className="text-left leading-tight">
          <span className="block text-[10px] uppercase tracking-wide text-white/70">Google Play&apos;den</span>
          <span className="block text-sm font-bold">İndirin</span>
        </span>
      </Link>
    </div>
  );
}
