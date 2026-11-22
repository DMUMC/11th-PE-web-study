import { createServer, loadEnv } from 'vite';
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const { VITE_TMDB_READ_ACCESS_TOKEN: token } = loadEnv('development', process.cwd(), 'VITE_');
if (!token?.trim()) {
  console.error('TMDB 토큰이 없습니다. .env.local을 설정해 주세요.');
  process.exit(1);
}

let failed = false;
const paths = [
  'movie/popular?language=ko-KR&page=1',
  `search/movie?language=ko-KR&include_adult=false&page=1&query=${encodeURIComponent('스파이더맨')}`,
];

for (let index = 0; index < paths.length; index++) {
  const path = paths[index];
  try {
    const response = await fetch(`https://api.themoviedb.org/3/${path}`, {
      headers: { Authorization: `Bearer ${token.trim()}`, accept: 'application/json' },
      signal: AbortSignal.timeout(15_000),
    });
    const data = await response.json();
    // 인증 헤더와 토큰은 출력하지 않습니다.
    console.log(JSON.stringify({ path, status: response.status, results: data.results?.length, total_results: data.total_results, id: data.id, title: data.title, status_code: data.status_code }));
    if (!response.ok) failed = true;
    if (index === 0 && response.ok && data.results?.length) {
      paths.push(`movie/${data.results[0].id}?language=ko-KR`);
      paths.push(`movie/popular?language=ko-KR&page=2`);
      paths.push(`search/movie?language=ko-KR&page=1&query=umcine-no-results-93d6e845`);
    }
  } catch (error) {
    failed = true;
    console.error(JSON.stringify({ path, error: error instanceof Error ? error.name : 'UnknownError' }));
  }
}

// 실제 앱의 ky 요청, 라우트 loader와 서버 렌더링도 같은 인증으로 확인합니다.
// 브라우저의 Network/Console 및 시각 검증은 README의 별도 절차를 따릅니다.
const server = await createServer({
  configFile: false,
  cacheDir: 'node_modules/.vite-check',
  appType: 'custom',
  server: { middlewareMode: true, watch: null },
});
try {
  const { routeTree } = await server.ssrLoadModule('/src/routeTree.gen.ts');
  const firstId = paths.find((path) => /^movie\/\d+\?/.test(path))?.match(/^movie\/(\d+)/)?.[1];
  const urls = ['/', '/?page=2', '/search', `/search?query=${encodeURIComponent('스파이더맨')}`, '/search?query=umcine-no-results-93d6e845'];
  if (firstId) urls.push(`/movies/${firstId}`);
  for (const url of urls) {
    const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: [url] }) });
    await router.load();
    const match = router.state.matches.at(-1);
    if (match?.status !== 'success') {
      failed = true;
      console.log(JSON.stringify({ route: url, status: match?.status ?? 'not-rendered' }));
      continue;
    }
    const html = renderToStaticMarkup(createElement(RouterProvider, { router }));
    const attribution = html.includes('This product uses the TMDB API but is not endorsed or certified by TMDB.');
    console.log(JSON.stringify({ route: url, status: match.status, rendered: html.length > 0, attribution }));
    if (!attribution) failed = true;
  }
} finally {
  await server.close();
}
if (failed) process.exitCode = 1;
