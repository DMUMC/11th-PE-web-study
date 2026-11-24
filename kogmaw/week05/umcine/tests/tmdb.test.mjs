import { after, before, afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

let server;
let api;
let routeTree;
const originalFetch = globalThis.fetch;
const movie = { id: 550, title: '테스트 영화', original_title: 'Test Movie', release_date: '2026-10-01', poster_path: null, backdrop_path: null, overview: '테스트 줄거리', genres: [{ id: 18, name: '드라마' }], runtime: 120, tagline: '' };
const page = { page: 1, total_pages: 3, total_results: 41, results: [movie] };
let requests = [];

function mockResponse(body = page, status = 200) {
  globalThis.fetch = async (input) => {
    requests.push(input);
    return Response.json(body, { status });
  };
}

before(async () => {
  server = await createServer({
    configFile: false,
    envDir: false,
    cacheDir: 'node_modules/.vite-test',
    appType: 'custom',
    server: { middlewareMode: true, watch: null },
    define: { 'import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN': JSON.stringify('test-token') },
  });
  api = await server.ssrLoadModule('/src/api/movies.ts');
  ({ routeTree } = await server.ssrLoadModule('/src/routeTree.gen.ts'));
});

afterEach(() => { globalThis.fetch = originalFetch; requests = []; });
after(async () => { await server?.close(); });

async function openUrl(url, redirects = 0) {
  assert.ok(redirects < 5, 'URL normalization must not loop');
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: [url] }) });
  await router.load();
  // Node loads use the server lane, which returns canonical redirects to its caller.
  if (router._serverResult?.type === 'redirect') {
    return openUrl(router._serverResult.redirect.headers.get('Location'), redirects + 1);
  }
  return { router, match: router.state.matches.at(-1) };
}

test('인기 영화: 기본 URL, 한국어, 페이지, Bearer 인증을 함께 전송한다', async () => {
  mockResponse();
  const result = await api.getPopularMovies(2);
  const url = new URL(requests[0].url);
  assert.equal(url.origin + url.pathname, 'https://api.themoviedb.org/3/movie/popular');
  assert.equal(url.searchParams.get('language'), 'ko-KR');
  assert.equal(url.searchParams.get('page'), '2');
  assert.equal(requests[0].headers.get('Authorization'), 'Bearer test-token');
  assert.deepEqual(result.results, [movie]);
});

test('검색: 한글과 특수문자를 하나의 query 값으로 보낸다', async () => {
  mockResponse();
  await api.searchMovies('스파이더맨 & 토이/스토리?', 3);
  const url = new URL(requests[0].url);
  assert.equal(url.pathname, '/3/search/movie');
  assert.equal(url.searchParams.get('query'), '스파이더맨 & 토이/스토리?');
  assert.equal(url.searchParams.get('include_adult'), 'false');
  assert.equal(url.searchParams.get('language'), 'ko-KR');
  assert.equal(url.searchParams.get('page'), '3');
});

test('상세 URL 직접 접근: 목록 데이터 없이 URL의 영화 ID로 요청한다', async () => {
  mockResponse(movie);
  const { match } = await openUrl('/movies/550');
  assert.equal(match.status, 'success');
  assert.equal(match.loaderData.id, 550);
  assert.equal(new URL(requests[0].url).pathname, '/3/movie/550');
});

test('검색 URL 직접 접근/새 라우터: 검색어와 페이지를 복원한다', async () => {
  mockResponse({ ...page, page: 2 });
  for (let reload = 0; reload < 2; reload++) {
    const { match } = await openUrl(`/search?query=${encodeURIComponent('스파이더맨')}&page=2`);
    assert.equal(match.status, 'success');
    assert.equal(match.loaderData.page, 2);
  }
  assert.equal(requests.length, 2);
  for (const request of requests) {
    const url = new URL(request.url);
    assert.equal(url.searchParams.get('query'), '스파이더맨');
    assert.equal(url.searchParams.get('page'), '2');
  }
});

test('빈 검색어: API를 요청하지 않는다', async () => {
  mockResponse();
  const { match } = await openUrl('/search?query=%20%20');
  assert.equal(match.status, 'success');
  assert.equal(match.loaderData, null);
  assert.equal(requests.length, 0);
});

test('빈 결과는 성공 응답으로 유지한다', async () => {
  mockResponse({ ...page, total_pages: 0, total_results: 0, results: [] });
  const { match } = await openUrl('/search?query=not-found');
  assert.equal(match.status, 'success');
  assert.deepEqual(match.loaderData.results, []);
});

test('잘못된 영화 ID는 외부 요청 전에 거부한다', async () => {
  mockResponse();
  for (const id of ['abc', '-1', '0', '1.5', '../search', '9007199254740992']) {
    assert.throws(() => api.getMovieDetail(id), { name: 'MovieNotFoundError' });
  }
  assert.equal(requests.length, 0);
});

test('HTTP 401, 404, 429, 500을 성공 데이터로 취급하거나 자동 반복 요청하지 않는다', async () => {
  for (const status of [401, 404, 429, 500]) {
    mockResponse({ status_message: 'test error' }, status);
    await assert.rejects(api.getMovieDetail('550'), (error) => error.response?.status === status);
  }
  assert.equal(requests.length, 4);
});

test('네트워크 실패를 호출자에게 전달한다', async () => {
  globalThis.fetch = async () => { throw new TypeError('offline'); };
  await assert.rejects(api.getPopularMovies(1));
});

test('라우터가 넘긴 AbortSignal로 진행 중인 요청을 취소한다', async () => {
  globalThis.fetch = (input) => new Promise((resolve, reject) => {
    requests.push(input);
    input.signal.addEventListener('abort', () => reject(input.signal.reason), { once: true });
  });
  const controller = new AbortController();
  const pending = api.getPopularMovies(1, controller.signal);
  const rejection = assert.rejects(pending);
  await new Promise((resolve) => setImmediate(resolve));
  controller.abort();
  await rejection;
  assert.equal(requests[0].signal.aborted, true);
});

test('목록 URL의 비정상 페이지는 유효한 범위로 정리한다', async () => {
  mockResponse();
  for (const [value, expected] of [['-1', '1'], ['hello', '1'], ['2.5', '1'], ['900', '500']]) {
    const { match } = await openUrl(`/?page=${value}`);
    assert.equal(match.status, 'success');
    assert.equal(new URL(requests.at(-1).url).searchParams.get('page'), expected);
  }
});

test('성공 화면 렌더링: API 제목, 상세 링크, 이미지 대체 표시와 TMDB 출처를 표시한다', async () => {
  mockResponse();
  const { router } = await openUrl('/');
  const html = renderToStaticMarkup(createElement(RouterProvider, { router }));
  assert.ok(html.includes('테스트 영화'));
  assert.ok(html.includes('/movies/550'));
  assert.ok(html.includes('이미지 준비 중'));
  assert.ok(html.includes('This product uses the TMDB API but is not endorsed or certified by TMDB.'));
});

test('검색과 상세 화면 렌더링: 빈 결과 및 누락된 줄거리/상영 시간도 안전하게 표시한다', async () => {
  mockResponse({ ...page, total_pages: 0, total_results: 0, results: [] });
  const search = await openUrl('/search?query=missing');
  const searchHtml = renderToStaticMarkup(createElement(RouterProvider, { router: search.router }));
  assert.ok(searchHtml.includes('검색 결과가 없어요.'));
  mockResponse({ ...movie, overview: '', runtime: null });
  const detail = await openUrl('/movies/550');
  const detailHtml = renderToStaticMarkup(createElement(RouterProvider, { router: detail.router }));
  assert.ok(detailHtml.includes('등록된 줄거리가 없습니다.'));
  assert.ok(detailHtml.includes('상영 시간 정보 없음'));
});

test('오류 화면 렌더링: 404와 연결 실패를 구분하고 재시도를 제공한다', async () => {
  mockResponse({ status_message: 'not found' }, 404);
  const missing = await openUrl('/movies/550');
  assert.equal(missing.match.status, 'error');
  const missingHtml = renderToStaticMarkup(createElement(RouterProvider, { router: missing.router }));
  assert.ok(missingHtml.includes('영화를 찾을 수 없어요.'));
  assert.ok(missingHtml.includes('role="alert"'));
  mockResponse({ status_message: 'unauthorized' }, 401);
  const unauthorized = await openUrl('/');
  const unauthorizedHtml = renderToStaticMarkup(createElement(RouterProvider, { router: unauthorized.router }));
  assert.ok(unauthorizedHtml.includes('영화 서비스에 연결할 수 없어요.'));
  assert.ok(unauthorizedHtml.includes('다시 시도'));
  globalThis.fetch = async () => { throw new TypeError('offline'); };
  const offline = await openUrl('/');
  const offlineHtml = renderToStaticMarkup(createElement(RouterProvider, { router: offline.router }));
  assert.ok(offlineHtml.includes('영화 정보를 불러오지 못했어요.'));
  assert.ok(offlineHtml.includes('다시 시도'));
});
