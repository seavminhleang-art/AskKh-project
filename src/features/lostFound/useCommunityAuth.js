import { useSelector } from 'react-redux';
export function useCommunityAuth() {
  return useSelector(state => state.auth.isAuthenticated);
}
