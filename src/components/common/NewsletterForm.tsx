'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import HipostaNewsletterModal from '@/components/common/HipostaNewsletterModal';
import { newsletterService } from '@/services/newsletterService';
import type { HipostaNewsletterOption, NewsletterSourceId } from '@/lib/hiposta-newsletters';

interface NewsletterFormProps {
  source: NewsletterSourceId | 'footer' | 'blog' | 'category' | 'tag';
  variant?: 'default' | 'compact' | 'inline';
  placeholder?: string;
  buttonText?: string;
  showNameField?: boolean;
  className?: string;
  buttonClassName?: string;
  interests?: string[];
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

const LEGACY_SOURCE_MAP: Record<'footer' | 'blog' | 'category' | 'tag', NewsletterSourceId> = {
  footer: 'kidsgourmet_footer',
  blog: 'kidsgourmet_blog_inline',
  category: 'kidsgourmet_category_sidebar',
  tag: 'kidsgourmet_tag_sidebar',
};

function normalizeSource(source: NewsletterFormProps['source']): NewsletterSourceId {
  return source in LEGACY_SOURCE_MAP
    ? LEGACY_SOURCE_MAP[source as keyof typeof LEGACY_SOURCE_MAP]
    : source as NewsletterSourceId;
}

function cadenceLabel(value: string) {
  const normalized = value.toLowerCase();
  if (normalized === 'daily') return 'Günlük';
  if (normalized === 'weekly') return 'Haftalık';
  if (normalized === 'monthly') return 'Aylık';
  return value;
}

function PrimaryChoice({
  option,
  checked,
  onChange,
  dense = false,
}: {
  option: HipostaNewsletterOption;
  checked: boolean;
  onChange: (checked: boolean) => void;
  dense?: boolean;
}) {
  return (
    <label
      className={`group flex cursor-pointer items-center rounded-2xl border transition-all ${
        dense ? 'min-h-[58px] gap-3 px-3.5 py-2.5' : 'min-h-[66px] gap-3 px-4 py-3'
      } ${
        checked
          ? 'border-orange-200 bg-[#fff9f1] shadow-[0_7px_22px_rgba(249,115,22,0.06)]'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      <span
        className={`grid shrink-0 place-items-center rounded-full border transition ${
          dense ? 'h-5 w-5' : 'h-6 w-6'
        } ${
          checked
            ? 'border-orange-500 bg-orange-500 text-white'
            : 'border-slate-300 bg-white text-transparent group-hover:border-orange-300'
        }`}
      >
        <i className="fa-solid fa-check text-[9px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className={`${dense ? 'text-[13px]' : 'text-sm'} block font-extrabold leading-snug text-slate-700`}>{option.name}</span>
        {option.cadence && (
          <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
            {cadenceLabel(option.cadence)} seçki
          </span>
        )}
      </span>
    </label>
  );
}

function HipostaMiniMark() {
  return (
    <span className="inline-flex shrink-0 items-center text-[13px] font-black tracking-[-0.06em] text-slate-900" aria-label="Hiposta">
      <span>hip</span>
      <span className="mx-[1px] inline-grid h-3.5 w-3.5 -rotate-3 place-items-center rounded-[1px] bg-[#173bdc] text-[9px] tracking-normal text-white shadow-[1px_1px_0_#ffd93b]">o</span>
      <span>sta</span>
      <span className="text-[#ff6648]">.</span>
    </span>
  );
}

export default function NewsletterForm({
  source,
  variant = 'default',
  placeholder = 'E-posta adresin',
  buttonText = 'Abone Ol',
  className = '',
  buttonClassName,
  onSuccess,
  onError,
}: NewsletterFormProps) {
  const normalizedSource = normalizeSource(source);
  const isFooterLayout = variant === 'compact';
  const isInlineLayout = variant === 'inline';

  const [email, setEmail] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [options, setOptions] = useState<HipostaNewsletterOption[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [discoveryOpen, setDiscoveryOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    fetch('/api/newsletters/options')
      .then(async (response) => {
        if (!response.ok) throw new Error('catalog unavailable');
        return response.json() as Promise<{ options?: HipostaNewsletterOption[] }>;
      })
      .then((result) => {
        if (!mounted) return;
        const nextOptions = Array.isArray(result.options) ? result.options : [];
        setOptions(nextOptions);
        setSelected(nextOptions.filter((option) => option.isPrimary).map((option) => option.slug));
      })
      .catch(() => {
        if (mounted) {
          setOptions([]);
          setSelected([]);
        }
      })
      .finally(() => {
        if (mounted) setOptionsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const primaryOptions = useMemo(() => options.filter((option) => option.isPrimary), [options]);
  const networkOptions = useMemo(() => options.filter((option) => !option.isPrimary), [options]);
  const selectedPrimaryCount = useMemo(
    () => primaryOptions.filter((option) => selected.includes(option.slug)).length,
    [primaryOptions, selected]
  );
  const selectedNetworkSlugs = useMemo(
    () => selected.filter((slug) => networkOptions.some((option) => option.slug === slug)),
    [selected, networkOptions]
  );
  const selectedNetworkOptions = useMemo(
    () => networkOptions.filter((option) => selected.includes(option.slug)),
    [networkOptions, selected]
  );

  const networkSubtitle = useMemo(() => {
    if (selectedNetworkOptions.length === 0) {
      return `${networkOptions.length} aktif bülten · Hip Medya yayın ağı`;
    }
    if (selectedNetworkOptions.length === 1) {
      const option = selectedNetworkOptions[0];
      return `${option.publicationName} · ${option.name} seçili`;
    }
    return `${selectedNetworkOptions.length} ek bülten seçili · düzenlemek için tıkla`;
  }, [networkOptions.length, selectedNetworkOptions]);

  const toggleNewsletter = (slug: string, checked: boolean) => {
    setSelected((current) => checked
      ? [...new Set([...current, slug])]
      : current.filter((item) => item !== slug)
    );
  };

  const applyNetworkSelection = (networkSlugs: string[]) => {
    const primarySlugs = primaryOptions
      .filter((option) => selected.includes(option.slug))
      .map((option) => option.slug);
    setSelected([...new Set([...primarySlugs, ...networkSlugs])]);
  };

  const closeDiscovery = useCallback(() => setDiscoveryOpen(false), []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Geçerli bir e-posta adresi girin.');
      return;
    }

    if (selected.length === 0) {
      setStatus('error');
      setMessage('En az bir bülten seçmelisin.');
      return;
    }

    if (!consentChecked) {
      setStatus('error');
      setMessage('Bülten aboneliği için onay vermelisin.');
      return;
    }

    setIsLoading(true);
    setStatus('idle');

    const result = await newsletterService.subscribe({
      email,
      source: normalizedSource,
      newsletters: selected,
      consent: true,
      website,
    });

    setIsLoading(false);

    if (result.success) {
      setStatus('success');
      setMessage(result.message || 'Seçimin kaydedildi.');
      setEmail('');
      setSelected(primaryOptions.map((option) => option.slug));
      setConsentChecked(false);
      setWebsite('');
      onSuccess?.();
    } else {
      setStatus('error');
      setMessage(result.message || 'Bir hata oluştu. Lütfen tekrar dene.');
      onError?.(result.message || 'Bir hata oluştu.');
    }
  };

  if (status === 'success') {
    return (
      <div className={`flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/75 px-4 py-3.5 ${className}`}>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-emerald-600 shadow-sm">
          <i className="fa-solid fa-check text-xs" />
        </span>
        <p className="text-sm font-semibold leading-relaxed text-emerald-800">{message}</p>
      </div>
    );
  }

  const fieldClasses = isInlineLayout
    ? 'min-w-0 flex-1 rounded-full border border-slate-200 bg-white px-5 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-green-400 focus:ring-4 focus:ring-green-50'
    : 'min-w-0 flex-1 rounded-full border border-slate-200 bg-white px-5 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-300 focus:ring-4 focus:ring-orange-50';

  const defaultButtonClasses = isInlineLayout
    ? 'shrink-0 rounded-full bg-green-600 px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-white'
    : 'shrink-0 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none';

  const primaryGridClasses = isFooterLayout
    ? 'grid grid-cols-1 gap-2 sm:grid-cols-2'
    : 'grid grid-cols-1 gap-2';

  const formRowClasses = isFooterLayout || isInlineLayout
    ? 'grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto]'
    : 'grid grid-cols-1 gap-2';

  const shellClasses = isFooterLayout
    ? 'w-full min-w-0 lg:w-[680px] xl:w-[720px]'
    : 'w-full min-w-0';

  return (
    <div className={`${shellClasses} ${className}`}>
      {optionsLoading ? (
        <div className="mb-4 flex items-center gap-2 py-1 text-xs font-medium text-slate-400">
          <i className="fa-solid fa-circle-notch fa-spin" /> Bültenler hazırlanıyor
        </div>
      ) : primaryOptions.length === 0 ? (
        <p className="mb-4 text-xs text-slate-400">Bülten abonelikleri şu anda kullanılamıyor.</p>
      ) : (
        <div className="mb-3.5">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">KidsGourmet bültenleri</span>
            <span className="shrink-0 rounded-full bg-slate-50 px-2 py-1 text-[9px] font-bold text-slate-400">
              {selectedPrimaryCount}/{primaryOptions.length} seçili
            </span>
          </div>
          <div className={primaryGridClasses}>
            {primaryOptions.map((option) => (
              <PrimaryChoice
                key={option.slug}
                option={option}
                checked={selected.includes(option.slug)}
                dense={!isFooterLayout}
                onChange={(checked) => toggleNewsletter(option.slug, checked)}
              />
            ))}
          </div>
        </div>
      )}

      {networkOptions.length > 0 && (
        <div className="mb-3.5">
          <button
            type="button"
            onClick={() => setDiscoveryOpen(true)}
            className={`group flex w-full items-center justify-between border border-blue-100 bg-gradient-to-r from-blue-50/80 via-white to-amber-50/65 text-left transition hover:border-blue-200 hover:shadow-[0_7px_24px_rgba(23,59,220,0.08)] ${
              isFooterLayout ? 'min-h-[62px] gap-4 rounded-2xl px-4 py-3' : 'min-h-[58px] gap-3 rounded-2xl px-3.5 py-2.5'
            }`}
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className={`grid shrink-0 place-items-center rounded-xl border border-white bg-white shadow-sm ${isFooterLayout ? 'h-9 w-9' : 'h-8 w-8'}`}>
                <i className="fa-regular fa-compass text-[#173bdc]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex min-w-0 items-center gap-1.5 text-xs font-extrabold text-slate-700">
                  <HipostaMiniMark />
                  <span className="min-w-0">ile daha fazlasını keşfet</span>
                </span>
                <span className="mt-0.5 block truncate text-[10px] font-medium text-slate-400">{networkSubtitle}</span>
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-2">
              {selectedNetworkOptions.length > 0 && (
                <span className="hidden rounded-full bg-[#173bdc] px-2 py-1 text-[9px] font-extrabold text-white min-[430px]:inline-flex">
                  +{selectedNetworkOptions.length}
                </span>
              )}
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-[10px] text-slate-400 shadow-sm transition group-hover:translate-x-0.5 group-hover:text-[#173bdc]">
                <i className="fa-solid fa-arrow-right" />
              </span>
            </span>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={formRowClasses}>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={placeholder}
            className={fieldClasses}
            disabled={isLoading || primaryOptions.length === 0}
            required
          />
          <button
            type="submit"
            disabled={isLoading || optionsLoading || primaryOptions.length === 0 || selected.length === 0 || !consentChecked}
            className={buttonClassName || `${defaultButtonClasses} ${!isFooterLayout && !isInlineLayout ? 'w-full' : ''}`}
          >
            {isLoading ? (
              <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap"><i className="fa-solid fa-circle-notch fa-spin" /> Kaydediliyor</span>
            ) : (
              <span className="whitespace-nowrap">{buttonText}</span>
            )}
          </button>
        </div>
        <input
          type="text"
          name="website"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-px w-px opacity-0"
        />
      </form>

      <label className={`mt-3 flex cursor-pointer items-start gap-2.5 text-[11px] leading-[1.55] text-slate-400 ${isFooterLayout ? '' : 'text-left'}`}>
        <input
          type="checkbox"
          id={`consent-${normalizedSource}`}
          checked={consentChecked}
          onChange={(event) => setConsentChecked(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-orange-500 focus:ring-orange-400"
        />
        <span>
          Seçtiğim bültenleri e-posta ile almak istiyorum.{' '}
          <Link href="/aydinlatma-metni" className="font-semibold text-slate-500 underline decoration-slate-300 underline-offset-2 transition hover:text-orange-500">
            Aydınlatma Metni
          </Link>
        </span>
      </label>

      {status === 'error' && (
        <p className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-red-500">
          <i className="fa-solid fa-circle-exclamation text-[10px]" />{message}
        </p>
      )}

      <HipostaNewsletterModal
        open={discoveryOpen}
        options={networkOptions}
        selected={selectedNetworkSlugs}
        onClose={closeDiscovery}
        onApply={applyNetworkSelection}
      />
    </div>
  );
}
