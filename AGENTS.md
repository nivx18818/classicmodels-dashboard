<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Stack

- Next.js (App Router), TypeScript, Tailwind CSS.

## File conventions

- All routes live under `app/` using folder-based routing.
- Server Components by default; add `"use client"` only when interactivity requires it.
- Co-locate page-level components in the route folder.

## Imports

Use path aliases consistently:

```ts
import { MyComponent } from '@/components/my-component';
```

## Architecture

- App Router with React Server Components by default.
- Implement error boundaries at the route segment level (`error.tsx`).
- Use `loading.tsx` and React Suspense for async boundaries.
- Leverage static generation where data allows; prefer `fetch` with cache tags over `getStaticProps` patterns.

## Code Style & Conventions

- Use TypeScript across apps/packages.
- Follow Next.js + React Hooks lint rules and Core Web Vitals rules.

### TypeScript

- Keep strict typing and avoid introducing `any` unless unavoidable.
- Clear type definitions
- Proper error handling with type guards
- Zod for runtime type validation

### Naming Conventions

- Folders/Files: kebab-case
- Components: PascalCase
- Variables/Functions: camelCase
- Types/Interfaces: PascalCase
- Constants: UPPER_SNAKE_CASE

## Styling

- Tailwind CSS utilities only — no inline styles, no CSS modules, no hardcoded color values.
- Use `cn()` from `@/lib/utils` for conditional class merging.
- Consistent color palette via design system tokens (extend in `globals.css`, never override locally).
- Responsive design: mobile-first, container queries where appropriate.
- Dark mode: use Tailwind's `dark:` variant, never manual media queries in JS.
- Maintain semantic HTML structure (`<nav>`, `<main>`, `<section>`, etc.).

## State management

- React Server Components for server state — fetch directly in the component.
- React hooks (`useState`, `useReducer`) for local client state.
- No global client state library unless explicitly discussed and added.
- Implement optimistic updates with `useOptimistic` where appropriate.
- Always provide loading and error states for async operations.

## Data fetching

- Server Components for direct data access (no `useEffect` fetching).
- `React Suspense` + `loading.tsx` for streaming loading states.
- Cache invalidation via `revalidateTag` / `revalidatePath`.
- Proper error handling with `try/catch` and `error.tsx` boundaries.
- Retry logic for non-idempotent failures only.

## Performance

- Images: always use `next/image` with explicit `width`/`height` or `fill`.
- Fonts: always use `next/font`.
- Avoid importing large libraries client-side; prefer server-side or dynamic imports.
- Use `React.lazy` / `next/dynamic` for heavy client components.

## Security

- Validate and sanitize all user input server-side before any DB or API call.
- Authentication checks in Server Components or middleware, never client-only.
- Use Next.js proxy for route-level auth guards.
- CSRF protection via same-site cookies and server action validation.
- Apply rate limiting on API routes.

## Implementation process

When adding a new feature, follow this order:

1. Plan component hierarchy (server vs client split)
2. Define TypeScript types and interfaces first
3. Implement server-side logic (Server Components, Server Actions)
4. Build client components with proper `"use client"` boundaries
5. Add error boundaries and error states
6. Implement responsive styling with Tailwind
7. Add loading states with Suspense / `loading.tsx`

## Do not

- Do not use the `pages/` router — this app uses App Router exclusively.
- Do not use `useEffect` for data fetching — use Server Components.
- Do not hardcode colors, spacing, or breakpoints outside of Tailwind config.
