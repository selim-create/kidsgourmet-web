import { NextResponse } from 'next/server';
import { API_URL } from '@/lib/constants';

const TAXONOMIES = new Set(['age-group', 'meal-type', 'diet-type']);
const REVALIDATE_SECONDS = 21600;
const STALE_SECONDS = 86400;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const taxonomy = searchParams.get('name');

  if (!taxonomy || !TAXONOMIES.has(taxonomy)) {
    return NextResponse.json({ error: 'Unsupported taxonomy' }, { status: 404 });
  }

  try {
    const response = await fetch(`${API_URL}/wp/v2/${taxonomy}?per_page=100`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Upstream request failed' }, {
        status: 502,
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=${STALE_SECONDS}`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Upstream request failed' }, {
      status: 502,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}
