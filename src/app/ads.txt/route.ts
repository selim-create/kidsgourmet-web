/**
 * ads.txt Route - Proxy to backend ads.txt endpoint
 */

import { NextResponse } from 'next/server';
import { fetchAdsTxt } from '@/lib/ads/ad-config';

export async function GET() {
  try {
    const adsTxtContent = await fetchAdsTxt();

    return new NextResponse(adsTxtContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error('Error serving ads.txt:', error);
    return new NextResponse('', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}
