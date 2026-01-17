'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AuthRequiredBannerProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'compact' | 'inline';
  icon?: string;
}

export default function AuthRequiredBanner({
  title = 'Giriş Yapın',
  description = 'Bu özelliği kullanmak için giriş yapmanız gerekiyor.',
  variant = 'default',
  icon = 'fa-solid fa-lock'
}: AuthRequiredBannerProps) {
  const pathname = usePathname();
  const redirectUrl = encodeURIComponent(pathname);

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-100 rounded-xl">
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
          <i className={icon}></i>
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <Link 
          href={`/login?redirect=${redirectUrl}`}
          className="px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-lg hover:bg-orange-600 transition-colors"
        >
          Giriş Yap
        </Link>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mx-auto mb-3">
          <i className={`${icon} text-xl`}></i>
        </div>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <div className="flex gap-2 justify-center">
          <Link 
            href={`/login?redirect=${redirectUrl}`}
            className="px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-lg hover:bg-orange-600 transition-colors"
          >
            Giriş Yap
          </Link>
          <Link 
            href={`/register?redirect=${redirectUrl}`}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-300 transition-colors"
          >
            Kayıt Ol
          </Link>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl border border-orange-100 p-8 text-center">
      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mx-auto mb-4">
        <i className={`${icon} text-2xl`}></i>
      </div>
      <h3 className="font-bold text-xl text-slate-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      <div className="flex gap-3 justify-center">
        <Link 
          href={`/login?redirect=${redirectUrl}`}
          className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-md"
        >
          <i className="fa-solid fa-right-to-bracket mr-2"></i>
          Giriş Yap
        </Link>
        <Link 
          href={`/register?redirect=${redirectUrl}`}
          className="px-6 py-3 bg-white text-orange-500 font-bold rounded-xl hover:bg-gray-50 transition-colors border border-orange-200"
        >
          Kayıt Ol
        </Link>
      </div>
    </div>
  );
}
