import { mockDelay } from '@/utils/mockMode'
import { useAsyncMock } from '@/utils/useAsyncMock'
import { mockComments } from '@/mocks/commentsMock'

// TODO(real-api): map to the comments endpoints once confirmed.
export function useComments() {
  return useAsyncMock(() => mockDelay(mockComments))
}