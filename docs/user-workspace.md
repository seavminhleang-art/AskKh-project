# User workspace

The `/dashboard` routes use the supplied user-screen reference: a shared sidebar and top bar, light cards, 14px secondary text, and 18px section headings. Dark mode and mobile navigation are supported.

## Live interactions

- Overview and My Activity use `/users/me` questions and comments; reports are filtered by the backend user ID. Counts and charts describe returned records rather than inventing account-wide totals.
- Profile reads `/users/me`, saves only `username` and `bio`, and uploads a profile image. Email is read-only because the profile update contract does not support changing it.
- Settings saves passwords with `oldPassword`, `newPassword`, and `confirmedNewPassword`. Appearance is a device preference.
- Questions read `/posts`, detail and answers use their respective endpoints, and publishing uses `/posts` or multipart `/posts/with-images`.
- Reports publish to `/lost-found/reports`. Report types and scopes use lowercase values observed in public responses (`lost`, `found`, `istad`).
- Claims and matches require report selection because the API only exposes report-scoped lists. My Claims filters by `claimantUserId` from the backend profile. Claim submission sends `describedHiddenDetail`.
- Notifications use server pagination and PATCH requests for individual/all read actions.

The public contract was read from `https://forum-istad-api.cheat.casa/api/v1/v3/api-docs`. No unsupported account deletion, notification-preference persistence, claim withdrawal, or private-post controls are shown.

Requests share the existing Firebase-aware transport with the admin workspace. A Firebase token is retried once after refresh on a 401. Backend errors remain visible. Protected routes restore a persisted Firebase session before redirecting to login.

## Verification

Run `node --test tests/user-workspace.test.mjs` for request and identity-scoping checks and `npm run build` for the production build. Browser tests may use intercepted API fixtures to check UI behavior; those do not establish that the backend accepts a signed-in Firebase account. Authenticated end-to-end writes need a real account and remain a separate verification step.

Verification completed during implementation: production build, focused lint, and all five test files passed. Local Chromium checks covered 10 desktop screens and seven mobile layouts, with no horizontal overflow or page errors. Intercepted-request checks covered profile and password saves, question and answer publishing, report publishing, claim submission, notification read actions, and API-error retry. These checks did not send writes to the live backend.
