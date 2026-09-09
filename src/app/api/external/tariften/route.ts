import { NextResponse } from 'next/server';
import { TARIFTEN_API_URL } from '@/lib/constants';

const REVALIDATE_SECONDS = 3600;
const STALE_SECONDS = 21600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ingredient = (searchParams.get('ingredient') || '').trim();
  const rawLimit = Number.parseInt(searchParams.get('limit') || '3', 10);
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 10) : 3;

  if (!ingredient || ingredient.length > 100) {
    return NextResponse.json({ error: 'Invalid ingredient' }, { status: 400 });
  }

  try {
    const upstream = await fetch(
      `${TARIFTEN_API_URL}/recipes/by-ingredient?ingredient=${encodeURIComponent(ingredient)}&limit=${limit}`,
      {
        headers: { Accept: 'application/json' },
        next: { revalidate: REVALIDATE_SECONDS },
      }
    );

    if (!upstream.ok) {
      return NextResponse.json(
        { error: 'Upstream request failed' },
        {
          status: 502,
          headers: { 'Cache-Control': 'no-store' },
        }
      );
    }

    const data = await upstream.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=${STALE_SECONDS}`,
      },
    });
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
