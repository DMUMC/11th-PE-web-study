import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.{ts,tsx}"],
    env: {
      VITE_TMDB_API_BASE_URL: "https://api.themoviedb.org/3",
      VITE_TMDB_ACCESS_TOKEN: "test-token",
    },
  },
});
