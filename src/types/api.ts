/**
 * OpenAPI Schema Types for ISTAD Forum & Lost/Found API
 * Single Source of Truth: https://forum-istad-api.cheat.casa/api/v1/v3/api-docs
 */

export interface VoteRequest {
  postId: number;
  voteTypeId: number;
}

export interface VoteResponse {
  id?: number;
  postId?: number;
  upVoteId?: number;
  voteTypeId?: number;
  userId?: number;
  creationDate?: string;
}

export interface BasedMessage {
  message?: string;
}

export interface UserUpdateRequest {
  username?: string;
  bio?: string;
}

export interface ChangePasswordRequest {
  oldPassword?: string;
  newPassword?: string;
  confirmedNewPassword?: string;
}

export interface TagRequest {
  tagName: string;
}

export interface TagResponse {
  id?: number;
  tagName?: string;
  count?: number;
  excerptPostId?: string;
  wikiPostId?: number;
}

export interface PostRequest {
  title: string;
  body: string;
  codeSnippet?: string;
  codeLanguage?: string;
  postTypeId: number; // 1 = Question, 2 = Answer
  parentId?: number;
  tagIds?: number[];
  imageUrls?: string[];
}

export interface CommentRequest {
  postId: number;
  text: string;
}

export interface CommentResponse {
  id?: number;
  postId?: number;
  text?: string;
  score?: number;
  userId?: number;
  userDisplayName?: string;
  creationDate?: string;
  lastEditDate?: string;
}

export interface PostResponse {
  id?: number;
  title?: string;
  body?: string;
  codeSnippet?: string;
  codeLanguage?: string;
  imageUrls?: string[];
  postTypeId?: number;
  score?: number;
  viewCount?: number;
  ownerId?: number;
  ownerDisplayName?: string;
  parentId?: number;
  tagResponses?: TagResponse[];
  comments?: CommentResponse[];
  creationDate?: string;
  lastActivityDate?: string;
  lastEditDate?: string;
}

export interface MediaResponse {
  name?: string;
  contentType?: string;
  extension?: string;
  uri?: string;
  size?: number;
}

export interface ItemReportRequest {
  itemType: 'LOST' | 'FOUND';
  title: string;
  categoryId?: number;
  description?: string;
  itemDate: string; // YYYY-MM-DD
  scope: string;
  locationId?: number;
  mapLat?: number;
  mapLng?: number;
  freeTextLocation?: string;
  photoUrl?: string;
  hiddenDetail?: string;
}

export interface ItemReportResponse {
  id?: number;
  userId?: number;
  itemType?: 'LOST' | 'FOUND';
  title?: string;
  categoryId?: number;
  categoryName?: string;
  description?: string;
  itemDate?: string;
  scope?: string;
  locationId?: number;
  locationLabel?: string;
  mapLat?: number;
  mapLng?: number;
  freeTextLocation?: string;
  photoUrl?: string;
  status?: string;
  moderationStatus?: string;
  expiryDate?: string;
  createdAt?: string;
}

export interface ClaimRequest {
  describedHiddenDetail: string;
}

export interface ClaimResponse {
  id?: number;
  itemReportId?: number;
  claimantUserId?: number;
  status?: string;
  confirmedByFinder?: boolean;
  confirmedByClaimant?: boolean;
  createdAt?: string;
}

export interface LocationRequest {
  building?: string;
  floor?: string;
  room?: string;
}

export interface ItemLocation {
  id?: number;
  building?: string;
  floor?: string;
  room?: string;
}

export interface CategoryRequest {
  name: string;
}

export interface ItemCategory {
  id?: number;
  name?: string;
}

export interface BookMarkRequest {
  postIds?: number[];
}

export interface BookMarkResponse {
  id?: number;
  users?: UserResponse;
  bookMarkList?: PostResponse[];
}

export interface UserResponse {
  id?: number;
  displayName?: string;
  email?: string;
  reputation?: number;
  views?: number;
  upVotes?: number;
  downVotes?: number;
  creationDate?: string;
  lastAccessDate?: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface EmailVerificationResponse {
  message?: string;
  email?: string;
  emailVerified?: boolean;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface ActionResponse {
  message?: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface RegisterRequest {
  displayName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

export interface RegisterResponse {
  message?: string;
  userId?: number;
  email?: string;
  emailVerificationRequired?: boolean;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthResponse {
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  userId?: number;
  email?: string;
  displayName?: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface MatchResponse {
  id?: number;
  lostItemId?: number;
  foundItemId?: number;
  totalScore?: number;
  status?: string;
}

export interface UserDetailResponse {
  id?: number;
  email?: string;
  displayName?: string;
  profileImage?: string;
  bio?: string;
  questions?: PostResponse[];
  comments?: CommentResponse[];
  bookmark?: BookMarkResponse;
}

export type NotificationType =
  | 'COMMENT_ON_POST'
  | 'POST_VOTE'
  | 'LOST_FOUND_MATCH'
  | 'LOST_FOUND_CLAIM_SUBMITTED'
  | 'LOST_FOUND_CLAIM_APPROVED'
  | 'LOST_FOUND_CLAIM_REJECTED';

export interface NotificationResponse {
  id?: number;
  type?: NotificationType;
  title?: string;
  body?: string;
  targetUrl?: string;
  read?: boolean;
  createdAt?: string;
  actorId?: number;
  actorDisplayName?: string;
}

export interface PageNotificationResponse {
  totalElements?: number;
  totalPages?: number;
  last?: boolean;
  numberOfElements?: number;
  first?: boolean;
  size?: number;
  content?: NotificationResponse[];
  number?: number;
  empty?: boolean;
}

export interface UnreadNotificationCountResponse {
  unreadCount?: number;
}
