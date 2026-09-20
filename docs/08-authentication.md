# 08 — Authentication & Security

Authentication is handled by `AuthService` and `ApiService`, with route protection in `guards/auth.guard.ts`.

## Login flow

`POST /auth/login { email, password }` returns:

```json
{ "token": "...", "user": { "id", "name", "email", "role": "student" | "teacher" } }
```

On success the app stores:
- `nca_token` → the bearer token (localStorage)
- `nca_user` → the serialized user object (localStorage)
- The in-memory `user` signal is set; `isStudent` is a computed that is true when `role === 'student'`.

**Role enforcement**: only `student` accounts may enter. If a teacher logs in, the portal blocks them with "Teachers should use the Teacher Dashboard." (This is a student-facing frontend; the teacher dashboard is a separate system.)

## Login state (`AuthService`)

```ts
readonly user = signal<User | null>(readStoredUser());
readonly isStudent = computed(() => this.user()?.role === 'student');
get token(): string | null   // localStorage 'nca_token'
```

`readStoredUser()` safely restores the user from `localStorage` so a page refresh keeps the session.

## Route guard

```ts
export const authGuard: CanActivateFn = () => {
  if (auth.token && auth.isStudent()) return true;
  return router.createUrlTree(['/login']);
};
```

Applied to `/dashboard`, `/lessons`, `/grades`, `/payments`, `/profile`. Any valid token makes it pass; missing token or non-student role → redirect to `/login`.

## API layer (`ApiService`)

- All requests go through `request(method, path, body)`.
- Base URL from `environment.apiUrl` (dev `http://localhost:4000`, prod from `environment.production.ts`).
- Adds `Content-Type: application/json` and, when a token exists, `Authorization: Bearer {token}`.
- `204 No Content` returns `undefined`.
- Non-OK responses throw `ApiError(status, message)`; the `message` field of a JSON error body is surfaced to the UI.
- On **401**, the stored token/user are cleared automatically (session invalidated).

## Change password

Available in the topbar for students (key icon). Modal dialog:
- Fields: current password + new password (`autocomplete` attributes set properly).
- Client-side validation: requires a current password and `newPassword.length >= 6`.
- Calls `PUT /auth/password { currentPassword, newPassword }`.
- Success shows a green "Password changed successfully." message; failure shows the backend error.

## Logout

- Clears `nca_token` and `nca_user`, resets the user signal, then hard-navigates to `/login`.

## Session/security notes

- Tokens and identity live in `localStorage` (simple SPA approach, vulnerable to XSS — worth noting if hardened later).
- Quiz answers are sent from the client; the **correct answers are never exposed to the client** until after submission (server-side grading).
- `SafeUrlPipe` is used to sanitize YouTube embed URLs; the API is a `DomSanitizer` `bypassSecurityTrustResourceUrl` for `youtube-nocookie.com` embeds only.
- The current password is always required to change it (no token-only password reset in this frontend).