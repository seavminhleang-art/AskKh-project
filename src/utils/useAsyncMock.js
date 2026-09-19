import { useEffect, useState } from 'react'

// Generic data-provider hook used by every feature until its real RTK
// Query endpoint exists. Returns the same { data, isLoading, isError,
// refetch } shape RTK Query hooks return, so pages never need to change
// when a feature is migrated from mock -> real API.
export function useAsyncMock(loader, deps = []) {
  const [state, setState] = useState({ data: undefined, isLoading: true, isError: false })
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    setState((s) => ({ ...s, isLoading: true, isError: false }))
    Promise.resolve(loader())
      .then((data) => {
        if (!cancelled) setState({ data, isLoading: false, isError: false })
      })
      .catch(() => {
        if (!cancelled) setState({ data: undefined, isLoading: false, isError: true })
      })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick])

  return { ...state, refetch: () => setTick((t) => t + 1) }
}
