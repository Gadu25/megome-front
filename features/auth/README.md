# features/auth

Authentication domain — login, register, logout, and OAuth.

| File | Purpose |
|------|---------|
| `schema.ts` | Zod validation schemas (registerSchema, loginSchema) |
| `components/AuthForm.tsx` | Login/register form with inline validation |
| `components/GoogleLoginButton.tsx` | Google OAuth popup + message listener |
| `components/LogoutButton.tsx` | Logout with confirmation modal |
