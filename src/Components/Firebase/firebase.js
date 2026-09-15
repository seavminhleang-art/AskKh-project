import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";

const rawApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const isConfigured = Boolean(
  rawApiKey &&
    typeof rawApiKey === "string" &&
    rawApiKey.trim().length > 5 &&
    !rawApiKey.includes("YOUR_")
);

const firebaseConfig = {
  apiKey: isConfigured ? rawApiKey : "AIzaSyDummyKeyForDevelopmentSafeLoad123",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "askkh-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "askkh-project",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "askkh-project.appspot.com",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef",
};

let app = null;
let auth = null;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (error) {
  console.warn(
    "Firebase initialization warning (missing or invalid API key in .env):",
    error.message
  );
  auth = {
    currentUser: null,
    onAuthStateChanged: (cb) => {
      cb(null);
      return () => {};
    },
  };
}

export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export { auth, isConfigured as isFirebaseConfigured };
export default app;