'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { newsletterService } from '@/services/newsletterService';
import type { HipostaNewsletterOption, NewsletterSourceId } from '@/lib/hiposta-newsletters';

interface NewsletterFormProps {
  source: NewsletterSourceId;
  variant?: 'default' | 'compact' | 'inline';
  placeholder?: string;
  buttonText?: string;
  className?: string;
  buttonClassName?: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

function ConsentCheckbox({ source, checked, onChange }: { source: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div className="flex items-start gap-2 mt-3">
      <input
        type="checkbox"
        id={`consent-${source}`}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="w-4 h-4 mt-0.5 shrink-0 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
      />
      <label htmlFor={`consent-${source}`} className="text-xs text-gray-500 cursor-pointer leading-relaxed">
        Seçtiğim bültenlerin e-posta adresime gönderilmesini kabul ediyorum.{' '}
        <Link href="/aydinlatma-metni" className="text-orange-500 hover:underline font-medium">
          Aydınlatma Metni
        </Link>
        &apos;ni okudum.
      </label>
    </div>
  );
}

function NewsletterChoice({
  option,
  checked,
  onChange,
}: {
  option: HipostaNewsletterOption;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white/80 p-3 cursor-pointer hover:border-orange-200 transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="w-4 h-4 mt-0.5 shrink-0 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
      />
      <span className="min-w-0">
        <span className="block text-sm font-bold text-slate-800">{option.name}</span>
        {!option.isPrimary && option.publicationName && (
          <span className="block text-[11px] font-semibold uppercase tracking-wide text-orange-500 mt-0.5">
            {option.publicationName}
          </span>
        )}
        {option.description && (
          <span className="block text-xs text-gray-500 mt-1 leading-relaxed">{option.description}</span>
        )}
      </span>
    </label>
  );
}

export default function NewsletterForm({
  source,
  variant = 'default',
  placeholder = 'Mail Adresiniz',
  buttonText = 'Abone Ol',
  className = '',
  buttonClassName,
  onSuccess,
  onError,
}: NewsletterFormProps) {
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
      setMessage('Abone olmak istediğiniz en az bir bülteni seçin.');
      return;
    }

    if (!consentChecked) {
      setStatus('error');
      setMessage('Bülten aboneliği için onay vermelisiniz.');
      return;
    }

    setIsLoading(true);
    setStatus('idle');

    const result = await newsletterService.subscribe({
      email,
      source,
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
      setMessage(result.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
      onError?.(result.message || 'Bir hata oluştu.');
    }
  };

  if (status === 'success') {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-xl p-4 text-center ${className}`}>
        <div className="text-green-600 mb-2">
          <i className="fa-solid fa-check-circle text-2xl"></i>
        </div>
        <p className="text-green-700 text-sm font-medium">{message}</p>
      </div>
    );
  }

  const fieldClasses = variant === 'inline'
    ? 'flex-1 py-3 px-6 rounded-full border border-gray-200 outline-none focus:border-green-500 shadow-sm'
    : variant === 'compact'
      ? 'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-500 bg-gray-50 focus:bg-white transition-colors'
      : 'w-full px-4 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-500';

  const defaultButtonClasses = variant === 'inline'
    ? 'bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-md transition-colors disabled:opacity-50'
    : variant === 'compact'
      ? 'bg-slate-800 text-white font-bold py-2.5 px-5 rounded-xl text-sm hover:bg-slate-700 transition-colors disabled:opacity-50'
      : 'w-full bg-orange-500 text-white font-bold py-2 rounded-xl text-sm hover:bg-orange-600 transition-colors disabled:opacity-50';

  return (
    <div className={className}>
      <div className="space-y-2 mb-3">
        {optionsLoading && (
          <div className="text-xs text-gray-500 flex items-center gap-2 py-2">
            <i className="fa-solid fa-spinner fa-spin"></i>
            Bültenler yükleniyor...
          </div>
        )}

        {!optionsLoading && primaryOptions.length === 0 && (
          <div className="text-xs text-gray-500 rounded-xl bg-gray-50 border border-gray-100 p-3">
            KidsGourmet bülten abonelikleri şu anda kullanılamıyor.
          </div>
        )}

        {primaryOptions.map((option) => (
          <NewsletterChoice
            key={option.slug}
            option={option}
            checked={selected.includes(option.slug)}
            onChange={(checked) => toggleNewsletter(option.slug, checked)}
          />
        ))}

        {relatedOptions.length > 0 && (
          <details className="group rounded-xl border border-dashed border-gray-200 bg-gray-50/60 p-3">
            <summary className="cursor-pointer list-none text-xs font-bold text-slate-700 flex items-center justify-between gap-3">
              <span>Hiposta ağından ilgini çekebilecek diğer bültenler</span>
              <i className="fa-solid fa-chevron-down text-[10px] text-gray-400 group-open:rotate-180 transition-transform"></i>
            </summary>
            <div className="space-y-2 mt-3">
              {relatedOptions.map((option) => (
                <NewsletterChoice
                  key={option.slug}
                  option={option}
                  checked={selected.includes(option.slug)}
                  onChange={(checked) => toggleNewsletter(option.slug, checked)}
                />
              ))}
            </div>
          </details>
        )}
      </div>

      <form onSubmit={handleSubmit} className={variant === 'inline' ? 'flex flex-col gap-3' : ''}>
        <div className={variant === 'inline' || variant === 'compact' ? 'flex flex-col sm:flex-row gap-2' : ''}>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={placeholder}
            className={`${fieldClasses} ${variant === 'default' ? 'mb-2' : ''}`}
            disabled={isLoading || primaryOptions.length === 0}
            required
          />
          <button
            type="submit"
            disabled={isLoading || optionsLoading || primaryOptions.length === 0 || selected.length === 0 || !consentChecked}
            className={buttonClassName || defaultButtonClasses}
          >
            {isLoading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                Gönderiliyor...
              </>
            ) : variant === 'compact' ? (
              <span className="whitespace-nowrap">{buttonText}</span>
            ) : (
              buttonText
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

      <ConsentCheckbox source={source} checked={consentChecked} onChange={setConsentChecked} />

      {status === 'error' && (
        <p className={`text-red-500 mt-2 ${variant === 'inline' ? 'text-sm' : 'text-xs'}`}>{message}</p>
      )}
    </div>
  );
}
