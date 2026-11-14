# UMCine 7주차 - 로그인과 내 정보 화면

6주차 UMCine을 기반으로 로그인, 회원가입, 내 정보 조회와 수정 화면을 구성했습니다.

## 화면 경로

- `/login`: 이메일과 비밀번호 입력 및 로그인
- `/signup`: 회원가입 입력값 검증
- `/me`: 닉네임과 이메일 조회
- `/me/edit`: 닉네임과 이메일 수정

## 확인 방법

1. `npm install`
2. `.env.example`을 복사해 `.env.local` 작성
3. `npm run dev`
4. 로그인 후 내 정보 화면에 입력한 이메일이 보이는지 확인
5. 내 정보 수정 후 조회 화면과 새로고침 후에도 변경값이 유지되는지 확인

로그인과 프로필은 이번 퍼블리싱 미션에서 Zustand persist로 연결했으며, 비밀번호는 저장하지 않습니다.

---

## 6주차 기존 기능

5주차의 TMDB 목록, 검색과 상세 요청을 TanStack Query로 관리합니다. 서버 데이터의 로딩·오류·빈 결과·성공 상태를 구분하고, 같은 화면을 다시 열면 캐시를 먼저 재사용합니다.

## 실행 준비

이 프로젝트는 npm만 사용합니다.

```bash
npm install
```

`.env.example`을 참고해 프로젝트 루트에 `.env.local`을 만들고 TMDB API Read Access Token을 입력합니다. `.env.local`은 Git에 올리지 않습니다.

```env
VITE_TMDB_API_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_ACCESS_TOKEN=발급받은_API_READ_ACCESS_TOKEN
VITE_RUN_FETCH_EXAMPLE=false
VITE_BACKEND_API_BASE_URL=http://localhost:8080
```

```bash
npm run dev
```

## Query key

요청 종류와 요청값이 다르면 별도 캐시가 만들어지도록 구성했습니다.

| 화면 | query key 예시 |
| --- | --- |
| 인기 영화 목록 | `["movies", "list", { "page": 1 }]` |
| 영화 검색 | `["movies", "search", { "query": "오디세이" }]` |
| 영화 상세 | `["movies", "detail", 1368337]` |

전역 `staleTime`은 1분이며 상세 요청은 30초입니다. 해당 시간 안에 같은 query key의 화면을 다시 열면 캐시 데이터가 즉시 표시되고 불필요한 재요청을 줄일 수 있습니다.

## 화면과 상태 확인

- `/`: 인기 영화 목록, 페이지 이동, 목록별 캐시
- `/search`: 검색어가 없을 때 안내
- `/search?query=오디세이`: 검색 로딩·오류·빈 결과·성공 상태
- `/movies/1368337`: 상세 로딩·오류·성공 상태
- `/movies/999999999`: 존재하지 않는 영화 안내
- `/movies/not-a-number`: 잘못된 ID 안내 및 API 요청 차단

## 캐시 및 Network 확인 방법

1. 개발자 도구의 Network 패널을 열고 `/`의 1페이지 요청을 확인합니다.
2. 2페이지로 이동한 뒤 1분 안에 다시 1페이지로 돌아옵니다.
3. 화면은 1페이지 캐시를 즉시 사용하며 동일한 `movie/popular?page=1` 요청이 새로 생기지 않는지 확인합니다.
4. 같은 검색어 또는 같은 상세 화면을 다시 열어 동일하게 확인합니다.
5. 화면 오른쪽 아래의 TanStack Query 개발자 도구 버튼을 열어 `movies/list`, `movies/search`, `movies/detail` 캐시가 서로 나뉘어 있는지 확인합니다.
6. `fresh` 상태에서는 캐시가 재사용되고, 시간이 지나 `stale` 상태가 되면 다시 접근할 때 백그라운드 재조회가 실행되는지 확인합니다.

## 빌드

```bash
npm run build
```

빌드 명령은 Vite 프로덕션 빌드와 TypeScript 타입 검사를 함께 실행합니다.

## 제출용 프론트엔드 스크린샷

| 파일 | 인증 내용 |
| --- | --- |
| `docs/screenshots/01-login-page.png` | 이메일과 비밀번호를 입력할 수 있는 로그인 화면 확인 |
| `docs/screenshots/02-member-profile-page.png` | 로그인 후 닉네임과 이메일이 표시되는 내 정보 조회 화면 확인 |
| `docs/screenshots/03-member-edit-page.png` | 기존 회원 정보가 입력값에 반영된 내 정보 수정 화면 확인 |

로그인, 내 정보 조회, 내 정보 수정 화면이 각각 독립된 URL에서 표시되며, 수정 화면의 입력값이 현재 프로필 정보와 일치하는 것을 확인할 수 있습니다.
