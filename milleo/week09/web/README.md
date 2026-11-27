# UMCine 9주차 Frontend

밀러의 UMCine을 Vite와 TanStack Router에서 Next.js App Router로 이관한 프로젝트입니다. 영화 정보는 TMDB에서 조회하고, 회원 정보·즐겨찾기·평점은 Spring Boot 서버에 저장합니다.

## 실행

1. [Spring Boot demo 서버](../backend/README.md)를 실행합니다. 기본값은 `http://127.0.0.1:8098`입니다.
2. Node.js 22 이상과 pnpm으로 웹의 의존성을 설치하고 환경 설정 파일을 준비합니다.

   ```sh
   pnpm install --frozen-lockfile
   cp .env.example .env.local
   ```

3. `.env.local`의 `TMDB_READ_TOKEN`에 본인의 TMDB API Read Access Token을 입력합니다. 백엔드 주소가 기본값과 다르면 `UMC_BACKEND_URL`을 설정합니다.
4. `pnpm dev`를 실행하고 `http://127.0.0.1:5189`를 엽니다. 프로덕션 실행은 `pnpm build`와 `pnpm start`를 사용합니다.

## 라우팅과 데이터

| 경로 | 동작 |
| --- | --- |
| `/?page=1` | 인기 영화 목록과 페이지 변경 |
| `/search?query=키워드` | 제목 검색과 즐겨찾기 표시 |
| `/movies/[movieId]` | 영화 상세, 즐겨찾기와 평점 작성·수정·삭제 |
| `/signup`, `/login` | 회원가입과 로그인 |
| `/mypage`, `/profile-edit` | 내 정보와 영화 기록 조회, 프로필 수정 |
| `/mypage/edit` | 기존 편집 주소에서 `/profile-edit`로 이동 |

서버 레이아웃에서 전역 스타일과 메타데이터를 설정합니다. 클라이언트 Provider에서 TanStack Query 캐시를 유지하고 브라우저 세션을 복원합니다. 보호 경로는 세션 복원이 끝난 뒤 접근 여부를 판단합니다.

영화 조회 요청은 서버의 `/api/tmdb` Route Handler를 거쳐 TMDB로 전달됩니다. TMDB 토큰은 서버 환경 변수로 읽습니다. 회원 API 요청은 같은 출처의 `/api` Route Handler를 거쳐 Spring Boot로 전달됩니다.

`pnpm build`에서 App Router 프로덕션 빌드와 TypeScript 검사를 실행합니다. TypeScript만 검사하려면 `pnpm typecheck`를 사용합니다.
