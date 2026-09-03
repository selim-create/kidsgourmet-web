'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
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

function NewsletterPill({
  option,
  checked,
  onChange,
  subtle = false,
}: {
  option: HipostaNewsletterOption;
  checked: boolean;
  onChange: (checked: boolean) => void;
  subtle?: boolean;
}) {
  return (
    <label
      className={`inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-all cursor-pointer select-none ${
        checked
          ? 'border-orange-300 bg-orange-50 text-orange-700 shadow-sm'
          : subtle
            ? 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-slate-700'
            : 'border-gray-200 bg-white text-slate-600 hover:border-orange-200 hover:text-slate-800'
      }`}
      title={option.description || option.name}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[8px] ${
          checked ? 'border-orange-400 bg-orange-500 text-white' : 'border-gray-300 bg-white text-transparent'
        }`}
      >
        <i className="fa-solid fa-check"></i>
      </span>
      {!option.isPrimary && option.publicationName ? (
        <span className="truncate">{option.publicationName} · {option.name}</span>
      ) : (
        <span className="truncate">{option.name}</span>
      )}
    </label>
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
  const [email, setEmail] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [options, setOptions] = useState<HipostaNewsletterOption[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');

  useEffect(() => {
    let mounted = true;

    fetch('/api/newsletters/options')
      .then(async (response) => {
        if (!response.ok) throw new Error('catalog unavailable');
        return response.json() as Promise<{ options?: HipostaNewsletterOption[] }>;
      })
      .then((result) => {
        if (mounted) setOptions(Array.isArray(result.options) ? result.options : []);
      })
      .catch(() => {
        if (mounted) setOptions([]);
      })
      .finally(() => {
        if (mounted) setOptionsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const primaryOptions = useMemo(() => options.filter((option) => option.isPrimary), [options]);
  const relatedOptions = useMemo(() => options.filter((option) => !option.isPrimary), [options]);

  const toggleNewsletter = (slug: string, checked: boolean) => {
    setSelected((current) => checked
      ? [...new Set([...current, slug])]
      : current.filter((item) => item !== slug)
    );
  };

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
      setSelected([]);
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
      <div className={`flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50/70 px-4 py-3 ${className}`}>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-green-600 shadow-sm">
          <i className="fa-solid fa-check text-xs"></i>
        </span>
        <p className="text-sm font-medium leading-relaxed text-green-800">{message}</p>
      </div>
    );
  }

  const fieldClasses = variant === 'inline'
    ? 'min-w-0 flex-1 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm outline-none transition focus:border-green-400 focus:ring-4 focus:ring-green-50'
    : 'min-w-0 flex-1 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-50';

  const defaultButtonClasses = variant === 'inline'
    ? 'shrink-0 rounded-full bg-green-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40'
    : 'shrink-0 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <div className={className}>
      <div className="mb-3">
        {optionsLoading ? (
          <div className="flex items-center gap-2 py-1 text-xs text-gray-400">
            <i className="fa-solid fa-circle-notch fa-spin"></i>
            Bültenler hazırlanıyor
          </div>
        ) : primaryOptions.length === 0 ? (
          <p className="text-xs text-gray-400">Bülten abonelikleri şu anda kullanılamıyor.</p>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">Bültenini seç</span>
            {primaryOptions.map((option) => (
              <NewsletterPill
                key={option.slug}
                option={option}
                checked={selected.includes(option.slug)}
                onChange={(checked) => toggleNewsletter(option.slug, checked)}
              />
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2 sm:flex-row">
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
            className={buttonClassName || defaultButtonClasses}
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                Kaydediliyor
              </span>
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

      <div className="mt-2.5 flex flex-col gap-2">
        <label className="flex cursor-pointer items-start gap-2 text-[11px] leading-relaxed text-gray-400">
          <input
            type="checkbox"
            id={`consent-${normalizedSource}`}
            checked={consentChecked}
            onChange={(event) => setConsentChecked(event.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
          />
          <span>
            Seçtiğim bültenleri e-posta ile almak istiyorum.{' '}
            <Link href="/aydinlatma-metni" className="font-medium text-gray-500 underline decoration-gray-300 underline-offset-2 hover:text-orange-500">
              Aydınlatma Metni
            </Link>
          </span>
        </label>

        {relatedOptions.length > 0 && (
          <details className="group">
            <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-[11px] font-medium text-gray-400 transition hover:text-slate-600">
              <i className="fa-solid fa-plus text-[8px] transition-transform group-open:rotate-45"></i>
              Hiposta ağından diğer bültenlere de göz at
            </summary>
            <div className="mt-2 flex flex-wrap gap-2">
              {relatedOptions.map((option) => (
                <NewsletterPill
                  key={option.slug}
                  option={option}
                  subtle
                  checked={selected.includes(option.slug)}
                  onChange={(checked) => toggleNewsletter(option.slug, checked)}
                />
              ))}
            </div>
          </details>
        )}
      </div>

      {status === 'error' && (
        <p className="mt-2 text-xs font-medium text-red-500">{message}</p>
      )}
    </div>
  );
}
