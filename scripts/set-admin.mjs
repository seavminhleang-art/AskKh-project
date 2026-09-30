import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const uid = process.argv[2];
if (!uid) {
  console.error('Usage: node scripts/set-admin.mjs <Firebase UID>');
  process.exit(1);
}

try {
  initializeApp({ credential: applicationDefault() });
  const auth = getAuth();
  const user = await auth.getUser(uid);
  await auth.setCustomUserClaims(uid, { ...user.customClaims, admin: true });
  const updated = await auth.getUser(uid);
  if (updated.customClaims?.admin !== true) throw new Error('Claim verification failed');
  console.log(`Admin role assigned to ${uid}. Sign in again to refresh your role.`);
} catch (error) {
  console.error('Could not assign admin role:', error.message);
  process.exitCode = 1;
}
