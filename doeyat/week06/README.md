# Week 06

5주차에 직접 `useEffect`로 관리하던 영화 목록, 검색, 상세 API 요청을 TanStack Query의 `useQuery`로 옮기고, query key와 캐시 시간으로 서버 상태를 관리합니다. 백엔드는 5주차 프로젝트를 이어 회원가입 검증과 비밀번호 해싱, 평점 등록·수정·삭제 및 일관된 예외 응답을 구현했습니다.

## 구성

| 폴더 | 역할 |
| --- | --- |
| `umcine` | React 영화 화면의 TanStack Query 적용, 캐시와 Devtools 확인 |
| `movie` | Spring Boot 회원가입 및 평점 쓰기 API와 전역 예외 처리 |
| `study` | 도서 대여 API의 예외 처리 실습 |
| `mock-frontend` | 회원·평점 API를 브라우저에서 호출하는 간이 화면 |
| `week1_typescript` | TypeScript 기초 예제 |

이름과 작성자 표기는 이전 주차와 같은 **doeyat(도얏)**으로 통일합니다.

## UMCine 실행

Node.js 22.12 이상과 pnpm이 필요합니다. 저장소 루트에서 실행합니다.

```powershell
cd doeyat/week06/umcine
Copy-Item .env.example .env.local
pnpm install --frozen-lockfile
pnpm dev
```

`.env.local`에 `VITE_TMDB_ACCESS_TOKEN`을 입력합니다. `VITE_` 환경 변수는 브라우저 번들에 포함되므로 공개해도 되는 TMDB 읽기 전용 토큰만 사용합니다.

- 영화 목록 query key는 `['movies', 'list', { page }]`로 페이지별 캐시를 분리합니다.
- 검색은 정규화한 검색어를 key에 넣고, 검색어가 있을 때만 요청합니다.
- 상세 요청은 영화 ID별로 분리하며, 유효한 양의 정수 ID일 때만 요청합니다.
- 공통 `staleTime`은 1분이고, 상세 요청은 30초로 재정의합니다. `gcTime`은 별도 지정하지 않아 TanStack Query 기본값을 사용합니다.
- 각 화면은 로딩, 오류, 빈 결과와 성공 상태를 구분합니다. React Query Devtools에서 query 상태를, 브라우저 Network 탭에서 재요청을 확인할 수 있습니다.

검증 명령:

```powershell
pnpm test
pnpm lint
pnpm build
```

테스트는 TMDB 응답을 모킹하므로 토큰 없이 실행할 수 있습니다. 실제 TMDB 요청을 확인하려면 토큰을 설정하고 개발 서버를 실행합니다.

## 백엔드 실행

JDK 21과 MySQL이 필요합니다. MySQL에 `umc_movie` 데이터베이스와 `member`, `rating` 테이블을 먼저 준비해야 합니다. 프로젝트에는 별도 `schema.sql`·`.env.example` 파일이 없고, `ddl-auto: validate` 설정이므로 테이블은 자동 생성되지 않습니다. 접속 정보는 `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` 환경 변수로 전달합니다.

```powershell
cd doeyat/week06/movie
# DB_URL, DB_USERNAME, DB_PASSWORD 환경 변수 설정
.\gradlew.bat bootRun
```

주요 API:

| 기능 | Method | 경로 | 성공 응답 |
| --- | --- | --- | --- |
| 회원가입 | `POST` | `/members` | `201 Created`, 비밀번호를 제외한 회원 정보 |
| 평점 조회 | `GET` | `/members/{memberId}/ratings` | 회원 평점 목록 |
| 평점 등록 | `POST` | `/members/{memberId}/ratings` | `201 Created`, 새 평점 ID |
| 평점 수정 | `PATCH` | `/members/{memberId}/ratings/{ratingId}` | `200 OK` |
| 평점 삭제 | `DELETE` | `/members/{memberId}/ratings/{ratingId}` | `204 No Content` |

요청 DTO 검증은 400, 중복 데이터는 409, 없는 데이터는 404, 다른 회원 소유 평점 수정·삭제는 403으로 처리합니다. 비밀번호는 BCrypt로 해싱해 저장하고 응답 DTO에서는 제외합니다. 백엔드 테스트는 H2를 이용하며 `movie` 폴더에서 실행합니다.

```powershell
.\gradlew.bat test
```

## 간이 브라우저 화면

백엔드 실행 후 별도 터미널에서 저장소 루트 기준으로 실행합니다.

```powershell
python -m http.server 5173 --bind localhost --directory doeyat/week06/mock-frontend
```

`http://localhost:5173`에서 회원가입과 평점 API를 호출합니다. 백엔드 CORS 허용 출처는 `http://localhost:5173`입니다.

## 제출 메모

- 브랜치: `week06_doeyat` (main 기준)
- PR 제목: `[week06] doeyat 6주차 미션`
- 변경 경로: `doeyat/week06/`

이번 주차에는 5주차 영화 요청에 query key를 붙여 페이지·검색어·영화 ID별 캐시를 나누고, `staleTime`을 전역 및 상세 조회에 설정했습니다. 백엔드는 회원가입과 평점 쓰기 API를 추가해 검증, 소유자 확인, BCrypt 해싱, 성공·오류 응답을 다뤘습니다.

## 학습 기록

### 핵심 키워드

- **query key와 query function**: query key는 캐시에서 요청 데이터를 구분하는 이름입니다. 페이지, 검색어, 영화 ID를 키에 넣어 매개변수가 다른 응답을 별도 캐시로 다룹니다. query function은 해당 키의 데이터를 가져오는 비동기 함수입니다.
- **`enabled`와 요청 상태**: `enabled: false`인 query는 자동 요청을 시작하지 않습니다. 성공이나 실패로 끝나지 않은 `isPending`일 수 있지만, 실제 요청 중을 뜻하는 `isLoading`은 false입니다.
- **`staleTime`과 `gcTime`**: `staleTime`은 받은 데이터가 fresh로 남는 시간입니다. `gcTime`은 query를 쓰는 컴포넌트가 사라진 뒤 비활성 캐시를 보관하는 시간입니다. stale이 되면 조건에 따라 재요청될 수 있지만 즉시 삭제되지는 않습니다.
- **전역 및 query별 설정**: 공통 데이터에는 `QueryClient` 기본값을 쓰고, 신선도 요구가 다른 query는 각 `useQuery`에서 값을 재정의합니다. 이 프로젝트는 공통 1분, 영화 상세 30초를 사용합니다.

### 미션 구현 기록

- 영화 목록, 검색, 상세 요청을 `useQuery`로 전환했습니다. `queryKey`에 페이지·검색어·영화 ID를 넣고, 빈 검색어와 잘못된 영화 ID에는 요청하지 않도록 `enabled`를 사용합니다.
- `QueryClientProvider`와 React Query Devtools를 연결했습니다. 기본 `staleTime`은 1분이고 상세 query만 30초로 조정했습니다.
- 로딩·오류·빈 결과·성공 UI를 query 상태에 연결했습니다. Network 탭과 Devtools에서 페이지를 다시 열거나 30초가 지난 뒤 캐시 상태와 요청 여부를 확인할 수 있습니다.
- 백엔드에는 회원가입 검증 및 BCrypt 해싱, 평점 생성·수정·삭제, 중복 평점 방지, 요청자와 평점 소유자 비교, 전역 예외 응답을 구현했습니다. 요청/응답 캡처와 실행 확인 내역은 실제 확인한 결과를 기준으로 별도 첨부합니다.

작성자: **doeyat (도얏)**
