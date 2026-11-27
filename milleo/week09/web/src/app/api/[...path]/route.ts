import type { NextRequest } from 'next/server';

const memberResources = new Set(['auth', 'members', 'favorites', 'ratings', 'movie-records']);

async function forward(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  if (!memberResources.has(path[0]) || path.some(segment => segment === '.' || segment === '..')) {
    return Response.json({ message: '요청한 API를 찾을 수 없습니다.' }, { status: 404 });
  }

  const base = (process.env.UMC_BACKEND_URL || 'http://127.0.0.1:8098').replace(/\/$/, '');
  const url = `${base}/${path.map(encodeURIComponent).join('/')}${request.nextUrl.search}`;
  const headers = new Headers({ Accept: 'application/json' });
  for (const name of ['Authorization', 'Content-Type']) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  try {
    const upstream = await fetch(url, {
      method: request.method,
      headers,
      body: request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.text(),
      cache: 'no-store',
      redirect: 'manual',
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(10_000)]),
    });
    const body = upstream.body ? await upstream.arrayBuffer() : null;
    return new Response(body, {
      status: upstream.status,
      headers: { 'content-type': upstream.headers.get('content-type') ?? 'application/json' },
    });
  } catch {
    return Response.json({ message: '서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.' }, { status: 502 });
  }
}

export { forward as GET, forward as HEAD, forward as POST, forward as PATCH, forward as DELETE };
