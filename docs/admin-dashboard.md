# Admin dashboard integration

The active `/admin/*` routes use `src/features/admin/workspace`.

- `VITE_API_BASE_URL` overrides the existing forum API base URL (include `/api/v1`).
- Requests send the signed-in Firebase ID token. The backend must support verification of that token and enforce admin authorization. A Firebase admin claim does not automatically grant access to an unrelated backend's account system.
- The workspace uses the registered RTK Query cache. A backend 401/403 appears in the workspace without clearing the Firebase session.
- Users, posts, tags, lost-and-found reports, and notifications use their existing list endpoints. Comments use `/comments/search?query=`. Settings loads `/users/me`.
- Users, posts, comments, and tags use their server search endpoints with a debounced query. Notifications use server pagination; other tables paginate the returned list locally. Exports contain only loaded results. Lost-and-found and notification text filters apply to loaded records.
- Counts without server totals and charts reflect only loaded records. Active users are loaded users whose `lastAccessDate` falls within the last 30 days; missing dates show an unavailable value. Content distribution uses `tagResponses`; posts with multiple tags contribute to each tag. Comment activity comes from the comments endpoint.
- The top bar polls `/notifications/unread-count` every minute. Notifications support the documented mark-read and mark-all-read PATCH endpoints and invalidate the shared notification cache. Theme, favorite pages, and recent pages are local UI state.
- Platform-wide analytics, report visibility changes, and marketplace management require backend support. No mock data or simulated successful mutations are used in this workspace.
- Dashboard requests can be retried/refreshed. Signing out clears Firebase, Redux auth, and cached API data.

Validation: production build; browser desktop/mobile layout, navigation, inspection, local search, no horizontal overflow, 403 handling, retry, empty responses, and student route guard. Browser scenarios use intercepted fixtures, not live account mutations. The live posts endpoint was verified; unauthenticated user search returned 403. Full authenticated backend access requires a provisioned account and compatible backend token verification.

The public OpenAPI schema was checked at `/api/v1/v3/api-docs`. It provides no marketplace or moderation management endpoints. Firebase tokens are refreshed once on an HTTP 401; persistent authorization failures remain visible. Full authenticated integration still requires the backend to accept the signed-in account’s token.

## Management controls

- Posts, comments, and tags have create/edit forms using the documented request schemas. Existing post attachments, tags, code, and parent links are preserved when editing title/body.
- Post and comment edit/delete controls are available only when `/users/me` identifies the record owner, matching the backend's owner-only contract.
- Users, posts, comments, and tags have confirmed deletion flows. The frontend reports failed backend authorization rather than simulating success.
- Settings updates the signed-in API profile using `username` and `bio`.
- Lost-and-found record details load claims and matches. Pending claims support confirmed approval/rejection, followed by cache refresh.
- Marketplace CRUD, report hide/unhide decisions, account role/block changes, and report edit/delete remain blocked by missing backend endpoints. This repository contains no backend implementation to extend.

Management request tests: `node --test tests/admin-management.test.mjs`. These tests do not mutate live records. Authenticated writes have not been exercised against production.

## Moderation overview

The moderation screen reads lost-and-found reports and their `moderationStatus`, with All, Pending, Suspicious, Hidden, and Resolved filters. The queue is limited to loaded lost-and-found reports; it is not a global Q&A abuse-report queue. Review opens the report's claims and matches with the supported decision actions.

The side panels load Q&A tags, lost-and-found categories, and locations. Category creation uses `POST /lost-found/categories`; zone counts count matching loaded reports. Missing safety scores and resolution dates display as unavailable. Report visibility controls are disabled because the schema contains no hide/unhide operation.

Validation: `node --test tests/admin-moderation.test.mjs tests/admin-management.test.mjs`; production build. No live mutations were performed.
