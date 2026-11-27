import ky from "ky";

export const apiClient = ky.create({ prefix: "/api/backend", retry: 0 });
