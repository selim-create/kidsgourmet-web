import { fetchAPI, fetchAuthAPI } from '@/lib/api';
import { WP_API_NAMESPACE } from '@/lib/constants';

export interface Comment {
  id: number;
  post: number;
  parent: number;
  author_name: string;
  author_avatar_urls?: { [key: string]: string };
  date: string;
  content: { rendered: string };
}

export interface CommentInput {
  post: number;
  content: string;
  parent?: number;
}

export const commentService = {
  // Yorumları getir
  getComments: async (postId: number): Promise<Comment[]> => {
    return await fetchAPI<Comment[]>(
      `${WP_API_NAMESPACE}/comments?post=${postId}&per_page=100&order=asc`
    );
  },

  // Yorum ekle (auth gerekli)
  addComment: async (data: CommentInput): Promise<Comment> => {
    return await fetchAuthAPI<Comment>(`${WP_API_NAMESPACE}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
