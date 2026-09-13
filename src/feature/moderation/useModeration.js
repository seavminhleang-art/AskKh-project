import { mockDelay } from '@/utils/mockMode'
import { useAsyncMock } from '@/utils/useAsyncMock'
import { mockModerationStats, mockModerationQueue } from '@/mocks/moderationMock'

// TODO(real-api): the OpenAPI spec has no moderation endpoints yet.
// Per project policy, do not invent one — keep this on mock data until
// a real moderation endpoint is confirmed and added to the spec.
export function useModeration() {
  return useAsyncMock(() => mockDelay({ stats: mockModerationStats, queue: mockModerationQueue }))
}