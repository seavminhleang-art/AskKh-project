// Central mock/API switch. Flip VITE_USE_MOCK_API in .env to change modes
// without touching any component or feature code.
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'

// Simulates realistic network latency for mock data so loading/skeleton
// states can be developed and tested against something other than 0ms.
export function mockDelay(data, ms = 500) {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}
