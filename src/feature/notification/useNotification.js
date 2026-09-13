import { mockDelay } from '@/utils/mockMode'
import { useAsyncMock } from '@/utils/useAsyncMock'
import { mockNotifications } from '@/mocks/notificationMock'

// TODO(real-api): map to the notifications endpoints once confirmed.
export function useNotifications() {
  return useAsyncMock(() => mockDelay(mockNotifications))
}