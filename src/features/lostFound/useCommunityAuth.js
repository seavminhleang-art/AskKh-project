import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../Components/Firebase/firebase';

export function useCommunityAuth() {
  const authenticated = useSelector(state => state.auth.isAuthenticated);
  const [firebaseUser, setFirebaseUser] = useState(auth.currentUser);
  useEffect(() => onAuthStateChanged(auth, setFirebaseUser), []);
  return Boolean(authenticated || firebaseUser);
}
