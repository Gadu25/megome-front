# app

Next.js App Router pages and API routes organized by route groups:

| Route Group | Access | Pages |
|-------------|--------|-------|
| `(app)/` | Authenticated | Dashboard, Profile, Projects, Settings, API docs |
| `(auth)/` | Public | Login/Register, Forgot/Reset password, Google OAuth callback |
| `(custom)/` | Onboarding | Profile setup (first-time) |
| `(public)/` | Public | (reserved) |
| `api/` | Server | Next.js API route handlers that proxy to backend |
