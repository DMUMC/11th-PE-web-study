# UMCine 5주차 - TMDB API 연동

로컬 영화 배열 대신 TMDB API의 인기 영화, 검색 결과와 상세 정보를 표시합니다. 일반 화면 요청은 공통 설정을 적용한 `ky` 인스턴스를 사용하며, 순수 `fetch` 비교 예제도 별도로 포함합니다.

## 실행 준비

이 프로젝트는 npm을 기준으로 실행합니다.

```bash
npm install
```

`.env.example`을 참고해 프로젝트 루트에 `.env.local`을 만들고 TMDB API Read Access Token을 입력합니다.

```env
VITE_TMDB_API_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_ACCESS_TOKEN=발급받은_API_READ_ACCESS_TOKEN
VITE_RUN_FETCH_EXAMPLE=false
VITE_BACKEND_API_BASE_URL=http://localhost:8080
```

`.env.local`은 Git에 올리지 않습니다. 환경 변수를 변경한 뒤에는 개발 서버를 다시 시작합니다.

```bash
npm run dev
```

## 화면 확인

- `/`: TMDB 인기 영화 목록과 페이지 이동
- `/search`: 검색어 입력 전 안내
- `/search?query=spider`: 실제 TMDB 영화 검색 결과
- `/movies/634649`: 영화 상세 정보
- `/movies/999999999`: 존재하지 않는 영화 안내
- `/api-demo`: Spring Boot 회원·평점 API 3개 호출 및 결과 확인

각 화면은 로딩, 오류, 빈 결과와 성공 상태를 구분합니다. 주소를 직접 입력하거나 새로고침해도 URL에 맞는 데이터를 다시 요청합니다.

## 순수 fetch 요청과 Network 확인

`.env.local`에서 아래 값만 잠시 `true`로 변경합니다.

```env
VITE_RUN_FETCH_EXAMPLE=true
```

개발 서버를 다시 시작하고 브라우저 개발자 도구의 Network 패널을 연 다음 페이지를 새로고침합니다. `movie/popular` 요청에서 다음 항목을 확인합니다.

- Request URL과 `language=ko-KR`, `page=1` query
- Request Headers의 Bearer 인증
- Status Code `200`
- Response의 `page`, `results`, `total_pages`, `total_results`

확인 후에는 중복 요청을 막기 위해 `VITE_RUN_FETCH_EXAMPLE=false`로 되돌립니다. 실제 목록, 검색과 상세 화면은 `ky` API 함수를 사용합니다.

## 빌드

```bash
npm run build
```

화면 하단에는 TMDB API 사용 사실과 TMDB의 보증·인증을 받지 않았다는 출처 문구를 표시합니다.

## 제출용 프론트엔드 스크린샷

| 파일 | 인증 내용 |
| --- | --- |
| `docs/screenshots/01-movie-list.png` | TMDB 인기 영화 목록과 출처 표기 |
| `docs/screenshots/02-movie-search.png` | 검색어, 결과 수와 실제 검색 결과 |
| `docs/screenshots/03-movie-detail.png` | TMDB 영화 상세 정보 화면 |
| `docs/screenshots/04-popular-request-headers.png` | 인기 영화 API 요청 URL과 `200 OK` |
| `docs/screenshots/05-search-request-headers.png` | 검색 API 요청 URL과 `200 OK` |
| `docs/screenshots/06-popular-response.png` | 인기 영화 API JSON 응답 데이터 |

스크린샷에는 TMDB API Read Access Token이 노출되지 않도록 Authorization 요청 헤더를 포함하지 않습니다.
