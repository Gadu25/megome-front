# Megome Frontend

The frontend for **Megome** — an API-first portfolio platform that lets developers store, manage, and expose their career data through a structured REST API.

This repository is the Next.js web app (landing page, auth, dashboard, API docs). It proxies all requests to the Megome backend API.

## Features

- **Public landing page** — marketing page with live API examples (JSON, cURL, fetch)
- **Authentication** — email/password sign-up and login, Google OAuth, forgot/reset password, token refresh
- **First-time onboarding** — guided profile setup for new accounts
- **Dashboard** — manage your portfolio in one place:
  - Profile (bio, title, contact info)
  - Experience, education, skills, and certificates (full CRUD)
  - Projects — 4-step create/edit wizard, screenshot gallery with lightbox, cover images, and drag-and-drop reordering
- **Personal Access Tokens** — generate, manage, and revoke API keys from the dashboard
- **Security** — change password and manage active sessions
- **Data export** — download your portfolio data
- **AI-assisted content generation** — generate bios, experience entries, education entries, and project descriptions with a global quota status banner
- **API docs** — intro, reference, and token guides for consumers of the public API

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js](https://nextjs.org) 16 (App Router) |
| UI | [React](https://react.dev) 19, [TypeScript](https://www.typescriptlang.org) |
| Styling | [Tailwind CSS](https://tailwindcss.com) v4, [daisyUI](https://daisyui.com) |
| State | [Zustand](https://zustand.docs.pmnd.rs) |
| Validation | [Zod](https://zod.dev) |
| Rich text | [Tiptap](https://tiptap.dev) |
| Drag & drop | [dnd-kit](https://dndkit.com) |
| Icons | Heroicons |

## Prerequisites

- Node.js 18.18+ (or a compatible runtime for Next.js 16)
- A running instance of the Megome backend API

## Getting Started

The app reads the backend URL from `NEXT_PUBLIC_API_URL`.

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file (`.env*` files are gitignored):

   ```env
   NEXT_PUBLIC_API_URL=https://your-backend.example.com
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/            Next.js App Router pages and API route handlers, organized by route groups
components/     Reusable, domain-agnostic UI primitives (Avatar, Card, Logo, Navbar, ...)
features/       Domain-scoped feature folders (auth, profile, project, settings, ai, api)
lib/            App logic and services (API client/server, auth cookies, Zustand stores)
types/          Shared TypeScript type definitions (domain, form, api, ui)
utils/          Pure utility functions grouped by domain (date, api, ui, env)
middlewares/    Middleware chain (response initialization, auth guard)
```

### Route Groups (`app/`)

| Route Group | Access | Pages |
|-------------|--------|-------|
| `(app)/` | Authenticated | Dashboard, Profile, Projects, Settings, API docs |
| `(auth)/` | Public | Login/Register, Forgot/Reset password, Google OAuth callback |
| `(custom)/` | Onboarding | First-time profile setup |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## How It Works

- **Backend proxy** — Next.js route handlers under `app/api/` proxy requests to the backend, keeping tokens off the browser.
- **Session handling** — auth tokens are stored in HTTP-only cookies; the browser-side API client automatically refreshes on a 401.
- **Middleware chain** — `chain([withInitializeResponse, withAuth])` initializes per-request state and guards protected routes.
- **Public API** — each user's portfolio is exposed at `{API_URL}/public/v1/profile`, authenticated with a personal access token. See the in-app API docs for details.
