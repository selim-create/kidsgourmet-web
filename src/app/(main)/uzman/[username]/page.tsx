import { Metadata } from 'next';
import ExpertProfileClient from './ExpertProfileClient';
import { userService } from '@/services/user-service';
import { SITE_URL } from '@/lib/constants';

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;

  try {
    const profile = await userService.getExpertPublicProfile(username);
    if (!profile) {
      return { alternates: { canonical: `${SITE_URL}/uzman/${username}` } };
    }

    const title = `${profile.display_name} - Uzman Profili | KidsGourmet`;
    const description = profile.biography
      ? profile.biography.replace(/<[^>]*>/g, '').substring(0, 160)
      : `${profile.display_name} uzmanın KidsGourmet'teki tarifleri, blog yazıları ve bebek beslenmesi önerileri.`;
    const ogImage = profile.avatar_url;
    const url = `${SITE_URL}/uzman/${username}`;

    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        siteName: 'KidsGourmet',
        locale: 'tr_TR',
        type: 'profile',
        images: ogImage ? [{ url: ogImage, width: 400, height: 400, alt: profile.display_name }] : [],
      },
    };
  } catch {
    return { alternates: { canonical: `${SITE_URL}/uzman/${username}` } };
  }
}

export default function ExpertProfilePageWrapper() {
  return <ExpertProfileClient />;
}
