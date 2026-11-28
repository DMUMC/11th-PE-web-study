# UMCine

UMCine is a movie discovery app built with Next.js App Router, React, TanStack Query, and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Next.js, usually `http://localhost:3000`.

## Environment variables

Set these in `.env.local`:

- `NEXT_PUBLIC_TMDB_API_BASE_URL`
- `NEXT_PUBLIC_TMDB_ACCESS_TOKEN`
- `NEXT_PUBLIC_API_BASE_URL` (optional; defaults to an empty string)

## Routes

- `/` movie list
- `/movies/[movieId]` movie detail
- `/search?query=...&page=...` search results
- `/login` and `/signup`
- `/myPage` and `/myPageEdit`

The root layout owns the shared header and footer. Pages that use React state, TanStack Query, browser storage, or event handlers are Client Components; the root layout and route files remain Server Components.
