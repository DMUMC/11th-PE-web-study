import { createFileRoute } from "@tanstack/react-router";
import { SearchPage } from "../pages/movies/search-page";

export const Route = createFileRoute("/search")({
  validateSearch: (search) => ({
    query: typeof search.query === "string" ? search.query : "",
  }),
  component: SearchPage,
});