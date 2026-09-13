import { USE_MOCK_API, mockDelay } from '@/utils/mockMode'
import { useAsyncMock } from '@/utils/useAsyncMock'
import { useSearchUsersQuery } from '@/Components/API/usersApi'
import { mockUsers } from '@/mocks/usersMock'

// Real endpoint (GET /users/search) already exists per the OpenAPI spec,
// so this feature can genuinely switch on USE_MOCK_API rather than
// waiting on a future endpoint.
export function useUsers(params = {}) {
  const mock = useAsyncMock(() => mockDelay(mockUsers), [JSON.stringify(params)])
  const real = useSearchUsersQuery(params, { skip: USE_MOCK_API })

  if (USE_MOCK_API) return mock
  return { data: real.data, isLoading: real.isFetching, isError: real.isError, refetch: real.refetch }
}
