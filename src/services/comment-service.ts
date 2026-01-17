import { fetchAPI, fetchAuthAPI } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';

export interface Comment {
  id: number;
  content: string;
  date: string;
  parent_id: number;
  author: {
    id: number;
    name: string;
    avatar: string | null;
  };
}

export interface CommentInput {
  post_id: number;
  content: string;
  parent_id?: number;
}

export const commentService = {
  // Yorumları getir
  getComments: async (postId: number): Promise<Comment[]> => {
    return await fetchAPI<Comment[]>(
      API_ENDPOINTS.COMMENTS_BY_POST(postId)
    );
  },

  // Yorum ekle (auth gerekli)
  addComment: async (data: CommentInput): Promise<Comment> => {
    const response = await fetchAuthAPI<{ success: boolean; message: string; comment: Comment }>(
      API_ENDPOINTS.COMMENTS, 
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return response.comment;
  },
};
