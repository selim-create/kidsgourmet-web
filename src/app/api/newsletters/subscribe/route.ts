import { isIP } from 'node:net';
import { NextResponse } from 'next/server';
import {
  HIPOSTA_CORE_API_URL,
  KIDSGOURMET_PUBLISHER,
  isAllowedNewsletterSlug,
  isNewsletterSourceId,
} from '@/lib/hiposta-newsletters';

type SubscribeBody = {
  email?: unknown;
  newsletters?: unknown;
  consent?: unknown;
  source?: unknown;
  website?: unknown;
};

function clientIp(request: Request): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  const candidate = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip')?.trim() || '';
  if (candidate && isIP(candidate)) return candidate;
  if (process.env.NODE_ENV !== 'production') return '127.0.0.1';
  return null;
}

export async function POST(request: Request) {
  let body: SubscribeBody;

  try {
    body = (await request.json()) as SubscribeBody;
  } catch {
    return NextResponse.json({ success: false, code: 'invalid_request' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const source = typeof body.source === 'string' ? body.source.trim() : '';
  const consent = body.consent === true;
  const honeypot = typeof body.website === 'string' ? body.website.trim() : '';
  const requested = Array.isArray(body.newsletters)
    ? [...new Set(body.newsletters.filter((value): value is string => typeof value === 'string').map((value) => value.trim()))]
    : [];

  if (honeypot !== '') {
    return NextResponse.json({ success: true, status: 'accepted' }, { status: 202 });
  }

  if (!email || !email.includes('@')) {
    return NextResponse.json({ success: false, code: 'invalid_email', message: 'Geçerli bir e-posta adresi girin.' }, { status: 400 });
  }

  if (!consent) {
    return NextResponse.json({ success: false, code: 'consent_required', message: 'Bülten aboneliği için onay vermelisiniz.' }, { status: 400 });
  }

  if (!isNewsletterSourceId(source)) {
    return NextResponse.json({ success: false, code: 'invalid_source' }, { status: 400 });
  }

  if (requested.length === 0 || requested.length > 4 || requested.some((slug) => !isAllowedNewsletterSlug(slug))) {
    return NextResponse.json({ success: false, code: 'invalid_newsletters' }, { status: 400 });
  }

  const token = process.env.HIPOSTA_PUBLISHER_KIDSGOURMET_TOKEN?.trim() || '';
  if (!token) {
    return NextResponse.json(
      { success: false, code: 'integration_not_configured', message: 'Bülten aboneliği şu anda kullanılamıyor.' },
      { status: 503 }
    );
  }

  const ip = clientIp(request);
  if (!ip) {
    return NextResponse.json(
      { success: false, code: 'client_context_unavailable', message: 'Bülten aboneliği şu anda tamamlanamıyor.' },
      { status: 503 }
    );
  }

  try {
    const response = await fetch(`${HIPOSTA_CORE_API_URL}/subscriptions/batch`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Hiposta-Publisher': KIDSGOURMET_PUBLISHER,
        'X-Hiposta-Client-IP': ip,
        'X-Hiposta-Client-User-Agent': request.headers.get('user-agent') || 'KidsGourmet Web',
      },
      body: JSON.stringify({
        email,
        newsletters: requested,
        consent: true,
        consent_version: 'kidsgourmet-newsletter-v1',
        source,
        locale: 'tr',
      }),
      cache: 'no-store',
    });

    const result = await response.json().catch(() => ({})) as Record<string, unknown>;

    if (response.status === 503 && result.code === 'delivery_unavailable' && result.accepted === true) {
      return NextResponse.json(
        {
          success: true,
          status: 'saved_pending_delivery',
          deliveryAvailable: false,
          count: typeof result.count === 'number' ? result.count : requested.length,
          message: 'Seçimin kaydedildi. Doğrulama e-postası gönderimi yakında etkinleşecek.',
        },
        { status: 202 }
      );
    }

    if (!response.ok) {
      const code = typeof result.code === 'string' ? result.code : 'subscription_failed';
      const status = response.status >= 400 && response.status < 600 ? response.status : 502;
      const message = code === 'newsletter_unavailable'
        ? 'Seçtiğiniz bültenlerden biri şu anda aboneliğe açık değil.'
        : code === 'rate_limited'
          ? 'Çok fazla deneme yapıldı. Lütfen kısa süre sonra tekrar deneyin.'
          : 'Bülten aboneliği tamamlanamadı. Lütfen tekrar deneyin.';

      return NextResponse.json({ success: false, code, message }, { status });
    }

    return NextResponse.json(
      {
        success: true,
        status: typeof result.status === 'string' ? result.status : 'confirmation_required',
        deliveryAvailable: true,
        count: typeof result.count === 'number' ? result.count : requested.length,
        message: 'Seçimlerin kaydedildi. Aboneliğini tamamlamak için e-postandaki doğrulama bağlantısını kullan.',
      },
      { status: 202 }
    );
  } catch {
    return NextResponse.json(
      { success: false, code: 'network_error', message: 'Bülten servisine şu anda ulaşılamıyor. Lütfen tekrar deneyin.' },
      { status: 503 }
    );
  }
}
