import { NextResponse } from 'next/server';
import { API_URL } from '@/lib/constants';

type CacheTarget = {
  endpoint: string;
  revalidate: number;
  stale: number;
};

const ENDPOINTS: Record<string, CacheTarget> = {
  featured: {
    endpoint: '/kg/v1/featured?limit=5',
    revalidate: 300,
    stale: 1800,
  },
  'home-recipes': {
    endpoint: '/kg/v1/recipes?page=1&per_page=8&orderby=date&order=desc',
    revalidate: 300,
    stale: 1800,
  },
  'home-posts': {
    endpoint: '/wp/v2/posts?page=1&per_page=12&_embed',
    revalidate: 300,
    stale: 1800,
  },
  'ad-config': {
    endpoint: '/hip-ads/v1/config',
    revalidate: 60,
    stale: 300,
  },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  const target = key ? ENDPOINTS[key] : undefined;

  if (!target) {
    return NextResponse.json({ error: 'Unsupported public cache key' }, { status: 404 });
  }

  try {
    const response = await fetch(`${API_URL}${target.endpoint}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: target.revalidate },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Upstream request failed' },
        {
          status: 502,
          headers: { 'Cache-Control': 'no-store' },
        }
      );
    }

    const data = await response.json();
    const headers = new Headers({
      'Cache-Control': `public, s-maxage=${target.revalidate}, stale-while-revalidate=${target.stale}`,
    });

    const wpTotal = response.headers.get('x-wp-total');
    const wpTotalPages = response.headers.get('x-wp-totalpages');
    if (wpTotal) headers.set('x-wp-total', wpTotal);
    if (wpTotalPages) headers.set('x-wp-totalpages', wpTotalPages);

    return NextResponse.json(data, { headers });
  } catch {
    return NextResponse.json(
      { error: 'Upstream request failed' },
      {
        status: 502,
        headers: { 'Cache-Control': 'no-store' },
      }
    );
  }
}
