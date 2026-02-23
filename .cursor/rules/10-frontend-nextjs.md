---
description: "Next.js 15 App Router and Frontend standards in frontend/"
globs: frontend/**/*.tsx
alwaysApply: false
---

# Frontend: Next.js 15

- **Server-First:** Components are Server Components by default. 
- **Client Boundary:** Use `"use client"` only at the leaf level for interactivity. **Prohibited** on top-level `page.tsx` or `layout.tsx` files.
- **Data Fetching:** Use standard `fetch()`. **Prohibited:** `axios`. Utilize Next.js caching (`next: { revalidate: ... }`).
- **Async Routes:** Always `await params` and `await searchParams` in pages.
- **Robustness:** Every main route segment must have a `loading.tsx` and `error.tsx`.
- **Styling:** Tailwind only. Use existing `globals.css` variables for radii and colors.
- **Imports:** Use `@/` alias. No relative path nesting (e.g., `../../`).