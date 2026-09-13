import { mockDelay } from '@/utils/mockMode'
import { useAsyncMock } from '@/utils/useAsyncMock'
import { mockTags } from '@/mocks/tagsMock'

// TODO(real-api): map to the tags endpoints once confirmed.
export function useTags() {
  return useAsyncMock(() => mockDelay(mockTags))
}
