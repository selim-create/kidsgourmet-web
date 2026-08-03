import Image from 'next/image';
import AppStoreButtons from '@/components/app/AppStoreButtons';

export default function AppDownloadFooter() {
  return (
    <section className="border-t border-orange-100 bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-8 sm:px-6 md:flex-row lg:px-8">
        <div className="flex max-w-2xl items-center gap-4 text-center md:text-left">
          <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-orange-100 bg-white shadow-sm sm:flex">
            <Image
              src="/kidsgourmet-logo.svg"
              alt="KidsGourmet uygulaması"
              width={54}
              height={54}
              className="h-10 w-12 object-contain"
            />
          </div>
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-orange-500">Mobil uygulama</p>
            <h2 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">KidsGourmet her zaman yanında</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              Tariflere, ebeveyn rehberlerine ve akıllı araçlara iOS ve Android uygulamasından ulaş.
            </p>
          </div>
        </div>

        <AppStoreButtons compact className="w-full justify-center sm:w-auto md:justify-end" />
      </div>
    </section>
  );
}
