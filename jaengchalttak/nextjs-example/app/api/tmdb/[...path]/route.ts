import { upstreamResponse } from "@/src/server/upstream-response";

export async function GET(request: Request, context: RouteContext<"/api/tmdb/[...path]">) {
  const { path } = await context.params;
  const endpoint = path.join("/");
  if (endpoint !== "movie/popular" && endpoint !== "search/movie" && !/^movie\/[1-9]\d*$/.test(endpoint)) {
    return Response.json({ message: "지원하지 않는 영화 API예요." }, { status: 404 });
  }

  const token = process.env.TMDB_ACCESS_TOKEN?.trim();
  if (!token) {
    return Response.json({ code: "TMDB_CONFIG_REQUIRED" }, { status: 503 });
  }

  try {
    const base = process.env.TMDB_API_BASE_URL?.trim() || "https://api.themoviedb.org/3";
    const url = new URL(endpoint, `${base.replace(/\/+$/, "")}/`);
    const search = new URL(request.url).searchParams;
    for (const key of ["language", "page", "query", "include_adult"]) {
      const value = search.get(key);
      if (value !== null) url.searchParams.set(key, value);
    }
    const upstream = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(10_000)]),
    });
    return upstreamResponse(upstream);
  } catch {
    return Response.json({ message: "영화 서버에 연결할 수 없어요." }, { status: 502 });
  }
}
