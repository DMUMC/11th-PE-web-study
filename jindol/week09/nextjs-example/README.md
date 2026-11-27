# UMCine

UMCine is a movie browsing app migrated from Vite and TanStack Router to the Next.js App Router.

## Getting Started

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Create a `.env.local` file from `.env.example` and set the TMDB access token and API base URLs. The TMDB values use the `NEXT_PUBLIC_` prefix because requests are made from Client Components; treat the access token as public.

## Routes

- `/` — popular movies and bookmarks
- `/movies/[movieId]` — movie details, favorites, and ratings
- `/search?query=...` — movie search
- `/login` and `/signup` — authentication
- `/mypage` and `/profile` — authenticated pages

App Router route files and the root layout are Server Components. Interactive pages, navigation state, React Query, and browser storage are isolated in Client Components.
