import { mockDelay } from '@/utils/mockMode'
import { useAsyncMock } from '@/utils/useAsyncMock'
import { mockMarketplaceItems } from '@/mocks/marketplaceMock'

// TODO(real-api): the OpenAPI spec has no marketplace endpoints yet.
// If real API mode is enabled before one exists, the Marketplace page
// shows "Marketplace API not available" instead of silently using mocks.
export function useMarketplace() {
  return useAsyncMock(() => mockDelay(mockMarketplaceItems))
}