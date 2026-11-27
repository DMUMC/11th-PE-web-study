import { upstreamResponse } from "@/src/server/upstream-response";

const endpoints = {
  GET: [
    /^members\/(email|nickname)\/[^/]+$/,
    /^members\/(me|[1-9]\d*\/ratings)$/,
    /^favorites(\/[1-9]\d*)?$/,
  ],
  POST: [/^(auth\/login|members|favorites|ratings)$/],
  PATCH: [/^(members\/me|ratings\/[1-9]\d*)$/],
  DELETE: [/^(favorites|ratings)\/[1-9]\d*$/],
};

async function forward(request: Request, context: RouteContext<"/api/backend/[...path]">) {
  const { path } = await context.params;
  const method = request.method as keyof typeof endpoints;
  const endpoint = path.join("/");
  if (path.some((part) => part === "." || part === ".." || part.includes("/"))
    || !endpoints[method]?.some((pattern) => pattern.test(endpoint))) {
    return Response.json({ message: "지원하지 않는 API예요." }, { status: 404 });
  }

  try {
    const base = process.env.API_BASE_URL?.trim() || "http://127.0.0.1:8080";
    const url = new URL(path.map(encodeURIComponent).join("/"), `${base.replace(/\/+$/, "")}/`);
    const headers = new Headers({ Accept: "application/json" });
    for (const name of ["authorization", "content-type"]) {
      const value = request.headers.get(name);
      if (value) headers.set(name, value);
    }
    const upstream = await fetch(url, {
      method,
      headers,
      body: method === "POST" || method === "PATCH" ? await request.text() : undefined,
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(10_000)]),
    });
    return upstreamResponse(upstream);
  } catch {
    return Response.json({ message: "UMCine 서버에 연결할 수 없어요." }, { status: 502 });
  }
}

export { forward as GET, forward as POST, forward as PATCH, forward as DELETE };
