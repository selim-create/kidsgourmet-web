import { REJIMDE_API_URL } from '@/lib/constants';

export interface RejimdeContent {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  url?: string; // URL should be optional as we'll generate it
  type: 'diet' | 'exercise';
  meta: {
    difficulty?: string;
    duration?: string;
    calories?: string;
    category?: string;
    is_verified?: boolean;
  };
  author: {
    name: string;
    avatar: string;
    slug: string;
  };
  completed_count: number;
}

export const rejimdeService = {
  getFeatured: async (type: 'diet' | 'exercise' | 'all' = 'all', limit: number = 4): Promise<{diets: RejimdeContent[], exercises: RejimdeContent[]}> => {
    try {
      const response = await fetch(
        `${REJIMDE_API_URL}/external/featured?type=${type}&limit=${limit}`,
        { 
          next: { revalidate: 3600 },
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      if (!response.ok) return { diets: [], exercises: [] };
      
      const data = await response.json();
      
      if (data.status === 'success') {
        // Map diets and exercises to include correct URLs
        const diets = (data.data.diets || []).map((item: RejimdeContent) => ({
          ...item,
          url: `https://www.rejimde.com/diets/${item.slug}`
        }));
        
        const exercises = (data.data.exercises || []).map((item: RejimdeContent) => ({
          ...item,
          url: `https://www.rejimde.com/exercises/${item.slug}`
        }));
        
        return { diets, exercises };
      }
      
      return { diets: [], exercises: [] };
    } catch {
      return { diets: [], exercises: [] };
    }
  },

  getRandom: async (): Promise<RejimdeContent | null> => {
    try {
      const { diets, exercises } = await rejimdeService.getFeatured('all', 5);
      const all = [...diets, ...exercises];
      return all.length > 0 ? all[Math.floor(Math.random() * all.length)] : null;
    } catch {
      return null;
    }
  }
};
