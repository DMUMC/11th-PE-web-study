// src/routes/index.tsx

import { createFileRoute } from "@tanstack/react-router";

import { MovieListPage } from "../pages/movies/movie-list-page";
import { MemberApiSection } from "../components/members/member-api-section";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <MovieListPage />
      <MemberApiSection />
    </>
  );
}