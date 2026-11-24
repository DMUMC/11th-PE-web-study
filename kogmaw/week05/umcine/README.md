# UMCine · Week 05

React + TypeScript + Vite로 만든 영화 사이트입니다. 로컬 영화 배열 대신 TMDB API v3의 실제 영화 데이터를 사용합니다. `week04`는 수정하지 않았습니다.

## 실행

Node.js 22.12 이상(검증 환경: 24.21)과 pnpm을 사용합니다.

```sh
pnpm install --frozen-lockfile
```

`.env.example`을 `.env.local`로 복사하고 TMDB의 **API Read Access Token**을 입력합니다. 일반 API Key가 아니라 Bearer 인증용 Read Access Token을 사용하세요.

```dotenv
VITE_TMDB_READ_ACCESS_TOKEN=발급받은_Read_Access_Token
```

- 발급 위치: <https://www.themoviedb.org/settings/api>
- 토큰 입력 후 `pnpm dev`로 실행합니다. 실행 중 환경변수를 변경했다면 서버를 다시 시작합니다.
- `.env.local`은 Git에서 제외됩니다. 토큰을 소스나 README에 붙여넣지 마세요.
- `VITE_` 변수는 브라우저 번들에 포함됩니다. 이 프론트엔드 실습의 환경변수는 서버의 비밀 저장소가 아닙니다.

```sh
pnpm dev
pnpm test
pnpm check:tmdb
pnpm build
pnpm preview
```

`check:tmdb`는 인증 정보를 출력하지 않고 실제 API의 목록·검색·상세·다음 페이지·빈 결과를 확인합니다. `test`는 테스트용 토큰과 가짜 HTTP 응답을 사용하며 실제 TMDB를 호출하지 않습니다.

## 화면과 API

| 화면 URL | API (`https://api.themoviedb.org/3/` 기준) |
| --- | --- |
| `/`, `/?page=2` | `movie/popular?language=ko-KR&page=...` |
| `/search` | 검색 안내만 표시, API 요청 없음 |
| `/search?query=스파이더맨`, `&page=2` | `search/movie?language=ko-KR&query=...&page=...&include_adult=false` |
| `/movies/영화ID` | `movie/{movie_id}?language=ko-KR` |

검색은 영화 제목 기준이며 검색 버튼이나 Enter로 실행합니다. 상세 URL의 ID는 TMDB의 실제 ID입니다. 검색어·페이지를 URL에 저장하고 각 라우트의 loader에서 데이터를 요청하므로 목록을 거치지 않고 상세·검색 주소로 접근할 수 있습니다.

- `src/api/tmdb-client.ts`: ky 2.x 인스턴스. 기본 URL, 한국어, Bearer 인증, 15초 타임아웃 설정
- `src/api/movies.ts`: 목록·검색·상세 요청. 라우터의 AbortSignal 전달
- `src/types/movie.ts`: TMDB의 목록·상세·페이지 응답 타입
- `src/routes/`: URL 검증, loader, 로딩·오류 화면 연결
- `src/pages/movies/`: 목록, 검색, 상세 화면
- `src/components/movies/`: 포스터 카드, 북마크, 페이지 이동, 이미지 대체 표시와 요청 상태
- `src/components/layout/footer.tsx`: 공통 TMDB 출처 영역

로딩은 스켈레톤, 오류는 안내와 재시도, 빈 결과는 별도 안내로 표시합니다. 잘못된 영화 ID/404, 인증 실패, 429, 연결 실패를 구분합니다. 포스터·배경·줄거리·상영 시간이 없는 데이터도 대체 표시합니다. 페이지는 TMDB 요청 범위인 1–500으로 제한합니다.

기존 로컬 영화의 ID와 TMDB ID가 섞이지 않도록 북마크는 `umcine-tmdb-bookmark-store`라는 별도 localStorage 키에 저장합니다. 이전 주차의 북마크는 그대로 보존됩니다.

## 필수 미션: 순수 fetch 확인

1. 서버 실행 후 `/fetch-check.html`을 엽니다. 빌드에도 포함된 독립 실습 페이지입니다.
2. DevTools → Network → Fetch/XHR를 열고 목록을 비웁니다.
3. **인기 영화 요청 (fetch)** 버튼을 한 번 누릅니다.
4. `popular?language=ko-KR&page=1` 요청을 선택합니다.
5. Headers에서 요청 URL, GET, 상태 코드 200과 Bearer 인증 헤더의 존재를 확인합니다. 토큰 값은 공유하지 마세요.
6. Response에서 `page`, `results`, `total_pages`, `total_results`를 확인합니다. 같은 응답 JSON이 실습 페이지에도 표시됩니다.

실습 소스는 `src/labs/fetch-popular.ts`입니다. ky를 import하지 않고 브라우저의 `fetch`를 직접 사용하며, `response.ok`로 실패 응답을 구분합니다. 실제 영화 화면의 모든 API 요청은 공통 ky 인스턴스를 사용합니다.

## 브라우저 검증

- `/`, `/?page=2`, `/search`, 검색 결과 URL, 실제 영화 상세 URL을 각각 직접 입력하고 새로고침합니다.
- 검색어 변경, 빈 검색, 결과 없는 검색, 이전·다음 페이지, 북마크 추가·해제와 새로고침을 확인합니다.
- `/movies/not-a-number`와 존재하지 않는 ID의 안내를 확인합니다.
- Network의 느린 네트워크 설정으로 로딩을, Offline 설정으로 오류와 재시도를 확인한 뒤 기본 설정으로 돌립니다.
- 정상 이용 시 Console 오류·경고와 실패한 이미지 요청이 없는지 확인합니다.
- 목록·검색·상세의 공통 푸터에 TMDB 로고와 출처 문구가 보이는지 확인합니다.
- 모바일에서는 카드가 2열, 중간 화면에서는 3열, 넓은 화면에서는 5열로 표시되는지 확인합니다.

정적 호스팅을 사용할 경우 `/movies/...`, `/search` 같은 경로를 `index.html`로 연결하는 SPA fallback 설정이 필요합니다. Vite 개발 서버와 preview는 이 동작을 제공합니다.

실제 검증 결과와 남은 수동 확인 항목은 [VERIFICATION.md](./VERIFICATION.md)에 기록했습니다.

## 데이터 출처

<https://www.themoviedb.org/>

This product uses the TMDB API but is not endorsed or certified by TMDB.

TMDB 데이터는 요청 시점에 따라 달라지므로 참고 이미지와 영화 순서·검색 건수가 다를 수 있습니다.
