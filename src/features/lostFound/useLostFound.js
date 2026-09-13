import { mockDelay } from '@/utils/mockMode'
import { useAsyncMock } from '@/utils/useAsyncMock'
import { mockLostFoundStats, mockLostFoundReports, mockLocations } from '@/mocks/lostFoundMock'

// TODO(real-api): map to the lost & found endpoints once confirmed.
export function useLostFound() {
  return useAsyncMock(() => mockDelay({
    stats: mockLostFoundStats,
    reports: mockLostFoundReports,
    locations: mockLocations,
  }))
}
