import '../index.css';
import { getTmdbHeaders, TMDB_API_URL } from '../api/tmdb-auth';

const button = document.querySelector<HTMLButtonElement>('#request-button')!;
const status = document.querySelector<HTMLParagraphElement>('#request-status')!;
const output = document.querySelector<HTMLPreElement>('#response-output')!;

button.addEventListener('click', async () => {
  button.disabled = true;
  status.textContent = '인기 영화를 요청하고 있습니다…';
  output.textContent = '';

  try {
    const url = new URL('movie/popular', TMDB_API_URL);
    url.search = new URLSearchParams({ language: 'ko-KR', page: '1' }).toString();

    // 필수 미션: 이 요청은 ky 없이 브라우저의 fetch를 직접 사용합니다.
    const response = await fetch(url, {
      method: 'GET',
      headers: getTmdbHeaders(),
      signal: AbortSignal.timeout(15_000),
    });
    const body: unknown = await response.json();
    status.textContent = `${response.status} ${response.statusText} · ${url}`;
    output.textContent = JSON.stringify(body, null, 2);

    if (!response.ok) {
      status.textContent += ' · 요청 실패: 응답 내용을 확인하세요.';
    }
  } catch (error) {
    status.textContent = '요청에 실패했습니다.';
    output.textContent = error instanceof Error ? error.message : '알 수 없는 오류입니다.';
  } finally {
    button.disabled = false;
  }
});
