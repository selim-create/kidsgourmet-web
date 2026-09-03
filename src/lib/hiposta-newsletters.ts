export const HIPOSTA_CORE_API_URL = (
  process.env.HIPOSTA_CORE_API_URL || 'https://api.hiposta.com/wp-json/hiposta/v1'
).replace(/\/+$/, '');

export const KIDSGOURMET_PUBLISHER = 'kidsgourmet';

export const KIDSGOURMET_NEWSLETTER_SLUGS = [
  'ebeveyn-notu',
  'haftalik-cocuk-menusu',
] as const;

export const NEWSLETTER_SOURCE_IDS = [
  'kidsgourmet_footer',
  'kidsgourmet_blog_inline',
  'kidsgourmet_category_sidebar',
  'kidsgourmet_tag_sidebar',
] as const;

export type NewsletterSourceId = (typeof NEWSLETTER_SOURCE_IDS)[number];
export type KidsgourmetNewsletterSlug = (typeof KIDSGOURMET_NEWSLETTER_SLUGS)[number];

export interface HipostaNewsletterOption {
  slug: string;
  name: string;
  publicationSlug: string;
  publicationName: string;
  publicationLogoUrl: string | null;
  publicationBrandColor: string;
  publicationForegroundColor: string;
  publicationMonogram: string;
  description: string;
  cadence: string;
  accentColor: string;
  isPrimary: boolean;
}

export const DEFAULT_NEWSLETTER_BY_SOURCE: Record<NewsletterSourceId, KidsgourmetNewsletterSlug> = {
  kidsgourmet_footer: 'ebeveyn-notu',
  kidsgourmet_blog_inline: 'ebeveyn-notu',
  kidsgourmet_category_sidebar: 'ebeveyn-notu',
  kidsgourmet_tag_sidebar: 'ebeveyn-notu',
};

export function isNewsletterSourceId(value: string): value is NewsletterSourceId {
  return (NEWSLETTER_SOURCE_IDS as readonly string[]).includes(value);
}

export function isKidsgourmetNewsletterSlug(value: string): value is KidsgourmetNewsletterSlug {
  return (KIDSGOURMET_NEWSLETTER_SLUGS as readonly string[]).includes(value);
}
