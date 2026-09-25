// Backend post type used for both questions and replies.
export const QUESTION_POST_TYPE_ID = 3;
export const ANSWER_POST_TYPE_ID = 3;

export function isAnswerPost(post) {
  if (post.parentId != null) return true;
  // Keep legacy answers recognizable when parentId is absent from a response.
  return Number(post.postTypeId) === 2 ||
    (ANSWER_POST_TYPE_ID !== QUESTION_POST_TYPE_ID && Number(post.postTypeId) === ANSWER_POST_TYPE_ID);
}
export function isQuestionPost(post) {
  return !isAnswerPost(post) && (post.postTypeId == null ||
    Number(post.postTypeId) === QUESTION_POST_TYPE_ID || Number(post.postTypeId) === 1);
}
