import { fetchAPI, fetchAPIWithHeaders } from '@/lib/api';
import { WP_API_NAMESPACE } from '@/lib/constants';
import { SponsorData, SEOData } from '@/lib/types';
import { sanitizeAndTransformContent, transformContentLinks } from '@/lib/content-transformer';

// Blog Yazısı Tip Tanımı (Basitleştirilmiş)
export interface BlogPost {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  featured_media: number;
  comment_count?: number;
  sponsor_data?: SponsorData | null;
  seo?: SEOData;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    author?: Array<{
      name: string;
      slug?: string;
      id?: number;
      avatar_urls?: {
        [key: string]: string;
      };
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
    }>>;
  };
}

export interface BlogPostsResponse {
  posts: BlogPost[];
  total: number;
  totalPages: number;
}

// Helper function to transform post content
function transformPost(post: BlogPost): BlogPost {
  return {
    ...post,
    content: {
      rendered: sanitizeAndTransformContent(post.content.rendered)
    },
    excerpt: {
      rendered: transformContentLinks(post.excerpt.rendered)
    }
  };
}

export const blogService = {
  
  // Tüm blog yazılarını getir (Sayfalama ve Embed destekli)
  getAll: async (page = 1, perPage = 10, category?: number): Promise<BlogPostsResponse> => {
    let endpoint = `${WP_API_NAMESPACE}/posts?page=${page}&per_page=${perPage}&_embed`;
    
    if (category) {
      endpoint += `&categories=${category}`;
    }

    const response = await fetchAPIWithHeaders<BlogPost[]>(endpoint);
    
    return {
      posts: response.data.map(transformPost),
      total: parseInt(response.headers['x-wp-total'] || '0'),
      totalPages: parseInt(response.headers['x-wp-totalpages'] || '1')
    };
  },

  // Tekil blog yazısı detayı (Slug ile)
  getBySlug: async (slug: string) => {
    const posts = await fetchAPI<BlogPost[]>(`${WP_API_NAMESPACE}/posts?slug=${slug}&_embed`);
    return posts.length > 0 ? transformPost(posts[0]) : null;
  },

  // Öne çıkan yazıları getir (Örn: 'sticky' olanlar veya belirli bir kategori)
  getFeatured: async (perPage = 3) => {
    // Sticky postları çekmek için 'sticky=true' parametresi kullanılabilir
    // Veya sadece son eklenenleri 'featured' olarak kabul edebiliriz
    const posts = await fetchAPI<BlogPost[]>(`${WP_API_NAMESPACE}/posts?per_page=${perPage}&_embed`);
    return posts.map(transformPost);
  },

  // Kategorileri getir
  getCategories: async () => {
    return await fetchAPI<any[]>(`${WP_API_NAMESPACE}/categories?per_page=100&hide_empty=true`);
  }
};