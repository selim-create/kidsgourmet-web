import { NextResponse } from 'next/server';
import { REJIMDE_API_URL } from '@/lib/constants';

const REVALIDATE_SECONDS = 3600;
const STALE_SECONDS = 21600;
const ALLOWED_TYPES = new Set(['diet', 'exercise', 'all']);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'all';
  const rawLimit = Number.parseInt(searchParams.get('limit') || '5', 10);
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 10) : 5;

  if (!ALLOWED_TYPES.has(type)) {
    return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 });
  }

  try {
    const upstream = await fetch(
      `${REJIMDE_API_URL}/external/featured?type=${encodeURIComponent(type)}&limit=${limit}`,
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
