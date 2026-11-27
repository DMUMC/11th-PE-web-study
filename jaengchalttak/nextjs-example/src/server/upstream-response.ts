import "server-only";

export function upstreamResponse(upstream: Response) {
  const headers = new Headers({ "Cache-Control": "no-store" });
  const contentType = upstream.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);
  return new Response(upstream.body, { status: upstream.status, headers });
}
