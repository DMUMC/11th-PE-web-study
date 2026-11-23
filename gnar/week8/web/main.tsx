//src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "./stores/auth-store";
import { routeTree } from "./routeTree.gen";

import "./index.css";

const queryClient = new QueryClient();

useAuthStore.subscribe((state, previous) => {
  if (previous.accessToken && state.accessToken !== previous.accessToken) {
    queryClient.removeQueries({ queryKey: ["session", previous.accessToken] });
  }
});

const router = createRouter({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);