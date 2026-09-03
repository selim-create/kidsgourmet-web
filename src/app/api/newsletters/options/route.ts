import { NextResponse } from 'next/server';
import {
  ALLOWED_NEWSLETTER_SLUGS,
  HIPOSTA_CORE_API_URL,
  KIDSGOURMET_NEWSLETTER_SLUGS,
  isAllowedNewsletterSlug,
  type HipostaNewsletterOption,
} from '@/lib/hiposta-newsletters';

type CatalogNewsletter = {
  slug?: unknown;
  name?: unknown;
  publication_slug?: unknown;
  publication_name?: unknown;
  description?: unknown;
  cadence?: unknown;
};

export async function GET() {
  try {
    const response = await fetch(`${HIPOSTA_CORE_API_URL}/newsletters`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, options: [], code: 'catalog_unavailable' },
        { status: 503 }
      );
    }

    const payload = (await response.json()) as { data?: CatalogNewsletter[] };
    const rows = Array.isArray(payload.data) ? payload.data : [];
    const allowed = new Set<string>(ALLOWED_NEWSLETTER_SLUGS);
    const primary = new Set<string>(KIDSGOURMET_NEWSLETTER_SLUGS);

    const options: HipostaNewsletterOption[] = rows
      .filter((row) => typeof row.slug === 'string' && allowed.has(row.slug) && isAllowedNewsletterSlug(row.slug))
      .map((row) => ({
        slug: row.slug as HipostaNewsletterOption['slug'],
        name: typeof row.name === 'string' ? row.name : row.slug as string,
        publicationSlug: typeof row.publication_slug === 'string' ? row.publication_slug : '',
        publicationName: typeof row.publication_name === 'string' ? row.publication_name : '',
        description: typeof row.description === 'string' ? row.description : '',
        cadence: typeof row.cadence === 'string' ? row.cadence : '',
        isPrimary: primary.has(row.slug as string),
      }));

    return NextResponse.json(
      { success: true, options },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } }
    );
  } catch {
    return NextResponse.json(
      { success: false, options: [], code: 'catalog_unavailable' },
      { status: 503 }
    );
  }
}
