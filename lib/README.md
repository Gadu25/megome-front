# lib

Application logic and services:

| Directory | Purpose |
|-----------|---------|
| `api/client/` | Browser-side API functions (auto-refresh on 401, `fetchClient`) |
| `api/server/` | Server-side API functions (cookie-based auth for Next.js routes) |
| `auth/` | HTTP cookie helpers (set, clear, read auth tokens) |
| `store/` | Zustand state management (auth-store) |
