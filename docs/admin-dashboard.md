# Admin dashboard integration

The active `/admin/*` routes use `src/features/admin/workspace`.

- `VITE_API_BASE_URL` overrides the existing forum API base URL (include `/api/v1`).
- Requests send the signed-in Firebase ID token. The backend must support verification of that token and enforce admin authorization. A Firebase admin claim does not automatically grant access to an unrelated backend's account system.
- The workspace uses the registered RTK Query cache. A backend 401/403 appears in the workspace without clearing the Firebase session.
- Users, posts, tags, lost-and-found reports, and notifications use their existing list endpoints. Comments are extracted from the posts response.
- Counts without server totals and charts reflect only loaded records. Local search, pagination, JSON export, and record inspection operate on that response; they are not server-wide search or pagination.
- Active-user analytics, moderation actions, and marketplace management require backend support. No mock data or simulated successful mutations are used in this workspace.
- Dashboard requests can be retried/refreshed. Signing out clears Firebase, Redux auth, and cached API data.

Validation: production build; browser desktop/mobile layout, navigation, inspection, local search, no horizontal overflow, 403 handling, retry, empty responses, and student route guard. Browser scenarios use intercepted fixtures, not live account mutations. The live posts endpoint was verified; unauthenticated user search returned 403. Full authenticated backend access requires a provisioned account and compatible backend token verification.
