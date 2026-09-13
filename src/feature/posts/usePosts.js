import { mockDelay } from '@/utils/mockMode'
import { useAsyncMock } from '@/utils/useAsyncMock'
import { mockPosts } from '@/mocks/postsMock'

// TODO(real-api): map to the forum posts endpoints once confirmed in
// the OpenAPI spec, then inject an RTK Query endpoint into baseApi.
export function usePosts() {
  return useAsyncMock(() => mockDelay(mockPosts))
}