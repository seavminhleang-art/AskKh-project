# Assign a Firebase admin

Login reads the Firebase `admin: true` custom claim and redirects admins to
`/admin/dashboard`. Other users go to `/dashboard`.

1. In your Firebase project's settings, open **Service accounts → Firebase Admin SDK → Generate new private key**.
2. Save the JSON outside this repository, for example in your Downloads folder. Never put it in `src`, `public`, or a `VITE_` environment variable.
3. From the project directory, run this with your actual downloaded filename:

   ```bash
   GOOGLE_APPLICATION_CREDENTIALS="$HOME/Downloads/your-service-account.json" node scripts/set-admin.mjs T1lkBwjPTkU52E2oKo9bO6iVZmI2
   ```

4. Sign in again. The script preserves other existing custom claims and verifies the admin claim after writing it.

The React route guard controls navigation only. Any backend admin endpoints must verify Firebase ID tokens and require the admin claim. Firebase database rules must enforce the same permission for protected data.
