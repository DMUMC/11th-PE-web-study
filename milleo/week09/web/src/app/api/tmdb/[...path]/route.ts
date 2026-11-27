import type { NextRequest } from 'next/server';

const tmdbBaseUrl = 'https://api.themoviedb.org/3';

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const [resource, movieId] = path;
  const isPopular = resource === 'movie' && movieId === 'popular';
  const isSearch = resource === 'search' && movieId === 'movie';
  const isDetail = resource === 'movie' && /^[1-9]\d*$/.test(movieId ?? '') && Number.isSafeInteger(Number(movieId));
  if (path.length !== 2 || !(isPopular || isSearch || isDetail)) {
    return Response.json({ message: '영화를 찾을 수 없습니다.' }, { status: 404 });
  }

  const token = process.env.TMDB_READ_TOKEN?.trim();
  if (!token) {
    return Response.json({ message: 'TMDB 연결 설정이 필요합니다.' }, { status: 503 });
  }

  const url = new URL(`${tmdbBaseUrl}/${resource}/${movieId}`);
  url.searchParams.set('language', 'ko-KR');
  if (isPopular) {
    const page = Number(request.nextUrl.searchParams.get('page') ?? 1);
    if (!Number.isInteger(page) || page < 1 || page > 500) {
      return Response.json({ message: '올바르지 않은 페이지 번호입니다.' }, { status: 400 });
    }
    url.searchParams.set('page', String(page));
  }
  if (isSearch) {
    const query = request.nextUrl.searchParams.get('query')?.trim();
    if (!query) return Response.json({ message: '검색어를 입력해 주세요.' }, { status: 400 });
    url.searchParams.set('query', query);
    url.searchParams.set('page', '1');
    url.searchParams.set('include_adult', 'false');
  }

  const timeout = AbortSignal.timeout(15_000);
  try {
    const upstream = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.any([request.signal, timeout]),
    });
    if (!upstream.ok) {
      return Response.json({ message: 'TMDB 요청에 실패했습니다.' }, { status: upstream.status === 503 ? 502 : upstream.status });
    }
    const body = await upstream.arrayBuffer();
    return new Response(body, { headers: { 'content-type': 'application/json' } });
  } catch {
    return Response.json({ message: 'TMDB에 연결할 수 없습니다.' }, { status: timeout.aborted ? 504 : 502 });
  }
}
