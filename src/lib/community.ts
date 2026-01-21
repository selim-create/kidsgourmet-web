import { fetchAPI, fetchAuthAPI } from './api';
import { API_ENDPOINTS } from './constants';
import type { 
  Circle, 
  Discussion, 
  DiscussionsResponse, 
  DiscussionComment,
  FeedResponse,
  CreateDiscussionRequest,
  CreateDiscussionResponse,
  TopContributor
} from './types';

/**
 * Tüm çemberleri getir (giriş yapılmışsa is_following bilgisi de gelir)
 */
export async function getCircles(): Promise<Circle[]> {
  return fetchAPI<Circle[]>(API_ENDPOINTS.CIRCLES);
}

/**
 * Kullanıcının takip ettiği çemberleri getir
 */
export async function getUserCircles(): Promise<Circle[]> {
  return fetchAuthAPI<Circle[]>(API_ENDPOINTS.USER_CIRCLES);
}

/**
 * Kullanıcının takip ettiği çemberleri güncelle
 */
export async function updateUserCircles(circleIds: number[]): Promise<{ message: string; followed_circles: number[] }> {
  return fetchAuthAPI(API_ENDPOINTS.USER_CIRCLES, {
    method: 'POST',
    body: JSON.stringify({ circle_ids: circleIds }),
  });
}

/**
 * Bir çemberi takip et
 */
export async function followCircle(circleId: number): Promise<{ message: string; circle_id: number }> {
  return fetchAuthAPI(API_ENDPOINTS.CIRCLE_FOLLOW(circleId), {
    method: 'POST',
  });
}

/**
 * Bir çemberi takipten çık
 */
export async function unfollowCircle(circleId: number): Promise<{ message: string; circle_id: number }> {
  return fetchAuthAPI(API_ENDPOINTS.CIRCLE_UNFOLLOW(circleId), {
    method: 'POST',
  });
}

/**
 * Tartışmaları getir (filtreleme ile)
 */
export async function getDiscussions(params?: {
  circle_id?: number;
  page?: number;
  per_page?: number;
  featured_only?: boolean;
  expert_answered?: boolean;
  search?: string;
}): Promise<DiscussionsResponse> {
  const searchParams = new URLSearchParams();
  
  if (params?.circle_id) searchParams.append('circle_id', params.circle_id.toString());
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
  if (params?.featured_only) searchParams.append('featured_only', '1');
  if (params?.expert_answered !== undefined) searchParams.append('expert_answered', params.expert_answered ? '1' : '0');
  if (params?.search) searchParams.append('search', params.search);
  
  const query = searchParams.toString();
  const endpoint = query ? `${API_ENDPOINTS.DISCUSSIONS}?${query}` : API_ENDPOINTS.DISCUSSIONS;
  
  return fetchAPI<DiscussionsResponse>(endpoint);
}

/**
 * Tek bir tartışmayı ID ile getir
 */
export async function getDiscussionById(id: number): Promise<Discussion> {
  return fetchAPI<Discussion>(API_ENDPOINTS.DISCUSSION_BY_ID(id));
}

/**
 * Tek bir tartışmayı slug ile getir
 */
export async function getDiscussionBySlug(slug: string): Promise<Discussion> {
  const response = await fetchAPI<DiscussionsResponse>(API_ENDPOINTS.DISCUSSION_BY_SLUG(slug));
  if (response.discussions.length === 0) {
    throw new Error('Tartışma bulunamadı');
  }
  return response.discussions[0];
}

/**
 * Bir tartışmanın yorumlarını getir
 */
export async function getDiscussionComments(discussionId: number): Promise<DiscussionComment[]> {
  const response = await fetchAPI<DiscussionComment[] | { comments: DiscussionComment[] }>(
    API_ENDPOINTS.DISCUSSION_COMMENTS(discussionId)
  );
  
  // Handle both array and object response formats
  if (Array.isArray(response)) {
    return response;
  }
  
  // If response is an object with comments property
  if (response && typeof response === 'object' && 'comments' in response) {
    return response.comments || [];
  }
  
  // Fallback to empty array
  console.warn('Unexpected comment response format:', response);
  return [];
}

/**
 * Bir tartışmaya yorum ekle
 */
export async function addComment(
  discussionId: number, 
  content: string, 
  parentId?: number
): Promise<{ id: number; message: string }> {
  return fetchAuthAPI(API_ENDPOINTS.DISCUSSION_COMMENTS(discussionId), {
    method: 'POST',
    body: JSON.stringify({ 
      content, 
      parent_id: parentId || 0 
    }),
  });
}

/**
 * Yeni tartışma oluştur (pending olarak)
 */
export async function createDiscussion(data: CreateDiscussionRequest): Promise<CreateDiscussionResponse> {
  return fetchAuthAPI<CreateDiscussionResponse>(API_ENDPOINTS.DISCUSSIONS, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Kullanıcının kendi tartışmalarını getir (pending dahil)
 */
export async function getUserDiscussions(status?: 'any' | 'publish' | 'pending'): Promise<Discussion[]> {
  const endpoint = status ? `${API_ENDPOINTS.USER_DISCUSSIONS}?status=${status}` : API_ENDPOINTS.USER_DISCUSSIONS;
  return fetchAuthAPI<Discussion[]>(endpoint);
}

/**
 * Kişiselleştirilmiş feed getir
 */
export async function getPersonalizedFeed(params?: {
  circle_id?: number;
  page?: number;
  per_page?: number;
  type?: 'discussions' | 'recipes';
}): Promise<FeedResponse> {
  const searchParams = new URLSearchParams();
  
  if (params?.circle_id) searchParams.append('circle_id', params.circle_id.toString());
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
  if (params?.type) searchParams.append('type', params.type);
  
  const query = searchParams.toString();
  const endpoint = query ? `${API_ENDPOINTS.FEED}?${query}` : API_ENDPOINTS.FEED;
  
  return fetchAuthAPI<FeedResponse>(endpoint);
}

/**
 * Haftanın en aktif katkı sağlayanlarını getir
 */
export async function getTopContributors(limit: number = 3): Promise<TopContributor[]> {
  try {
    const endpoint = `${API_ENDPOINTS.TOP_CONTRIBUTORS}?limit=${limit}`;
    return fetchAPI<TopContributor[]>(endpoint);
  } catch (error) {
    console.error('Error fetching top contributors:', error);
    // Return empty array on error to prevent UI breaking
    return [];
  }
}

/**
 * Tartışmaya oy ver (like/dislike toggle)
 */
export async function voteDiscussion(
  discussionId: number, 
  voteType: 'like' | 'dislike'
): Promise<{
  success: boolean; 
  action?: 'added' | 'removed' | 'changed';
  like_count: number; 
  dislike_count: number; 
  user_vote: string | null
}> {
  return fetchAuthAPI(`/kg/v1/community/discussions/${discussionId}/vote`, {
    method: 'POST',
    body: JSON.stringify({ vote_type: voteType }),
  });
}

/**
 * Yoruma oy ver (like/dislike toggle)
 */
export async function voteComment(
  commentId: number, 
  voteType: 'like' | 'dislike'
): Promise<{
  success: boolean; 
  action?: 'added' | 'removed' | 'changed';
  like_count: number; 
  dislike_count: number; 
  user_vote: string | null
}> {
  return fetchAuthAPI(`/kg/v1/community/comments/${commentId}/vote`, {
    method: 'POST',
    body: JSON.stringify({ vote_type: voteType }),
  });
}

/**
 * İçerik raporla (discussion veya comment)
 */
export async function reportContent(
  contentType: 'discussion' | 'comment',
  contentId: number,
  reason: string,
  description?: string
): Promise<{ success: boolean; message: string }> {
  return fetchAuthAPI('/kg/v1/community/report', {
    method: 'POST',
    body: JSON.stringify({ 
      content_type: contentType, 
      content_id: contentId, 
      reason, 
      description 
    }),
  });
}
