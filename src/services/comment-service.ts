import { fetchAPI, fetchAuthAPI } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';

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
      API_ENDPOINTS.COMMENTS_BY_POST(postId)
    );
  },

  // Yorum ekle (auth gerekli)
  // Custom endpoint kullanılıyor çünkü WordPress standard /wp/v2/comments endpoint'i
  // JWT token authentication'ı desteklemiyor. /kg/v1/comments endpoint'i JWT ile çalışacak şekilde yapılandırılmış.
  addComment: async (data: CommentInput): Promise<Comment> => {
    return await fetchAuthAPI<Comment>(API_ENDPOINTS.COMMENTS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
