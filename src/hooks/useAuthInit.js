import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Components/Firebase/firebase';
import { useAppDispatch, useAppSelector } from './useAppStore';
import { loginSuccess, setInitialized, logout } from '../features/auth/authSlice';

export function useAuthInit() {
  const dispatch = useAppDispatch();
  const { isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Ensure any legacy insecure tokens are cleaned up
    localStorage.removeItem('nexa_token');

    let isMounted = true;

    try {
      if (!auth || typeof onAuthStateChanged !== 'function') {
        dispatch(setInitialized());
        return;
      }

      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (!isMounted) return;

        if (firebaseUser) {
          try {
            const accessToken = await firebaseUser.getIdToken();
            const userPayload = {
              id: firebaseUser.uid,
              name:
                firebaseUser.displayName ||
                firebaseUser.email?.split('@')[0] ||
                'Scholar',
              displayName:
                firebaseUser.displayName ||
                firebaseUser.email?.split('@')[0] ||
                'Scholar',
              email: firebaseUser.email,
              avatar: firebaseUser.photoURL || null,
              role: 'student',
            };

            dispatch(
              loginSuccess({
                accessToken,
                user: userPayload,
              })
            );
          } catch (error) {
            console.error('Failed to get user ID token:', error);
            dispatch(setInitialized());
          }
        } else {
          // No authenticated Firebase user
          const storedUser = localStorage.getItem('nexa_user');
          if (!storedUser) {
            dispatch(logout());
          } else {
            dispatch(setInitialized());
          }
        }
      });

      return () => {
        isMounted = false;
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    } catch (err) {
      console.warn('Auth initialization skipped:', err);
      dispatch(setInitialized());
    }
  }, [dispatch]);

  return isInitialized;
}

export default useAuthInit;
