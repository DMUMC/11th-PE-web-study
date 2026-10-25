# Week 05

week04의 북마크 기능을 유지하면서 정적 영화 데이터를 TMDB API로 교체하고, 별도의 영화 서비스 백엔드와 간이 프론트를 구성했습니다.

## 구성

| 폴더 | 역할 |
| --- | --- |
| `umcine` | React 영화 목록·검색·상세, TMDB API 연동 |
| `movie` | 회원 닉네임·이메일 중복 확인, 회원별 평점 조회 API |
| `mock-frontend` | movie API를 브라우저에서 호출하는 간이 프론트 |
| `study` | week04에서 이어온 도서 API 실습과 회귀 테스트 |

`umcine`은 TMDB에 직접 요청합니다. `movie` API는 `mock-frontend`에서 별도로 확인합니다.

## 프론트엔드 실행

Node.js 22.12 이상과 pnpm을 사용합니다. 아래 명령은 저장소 루트 기준입니다.

```powershell
cd doeyat/week05/umcine
Copy-Item .env.example .env.local
pnpm install --frozen-lockfile
pnpm dev
```

`.env.local`의 `VITE_TMDB_ACCESS_TOKEN`에 TMDB API 읽기 액세스 토큰을 입력하고 개발 서버를 재시작합니다. `VITE_` 변수는 브라우저 번들에 포함되므로 서버 전용 비밀 키를 넣지 않습니다.

- `fetch` 예제와 공통 ky 클라이언트로 HTTP 요청·응답 타입을 정의했습니다.
- 인기 영화 목록과 페이지 이동, URL 검색어 기반 검색, ID 기반 상세 조회를 구현했습니다.
- 로딩·빈 결과·HTTP 오류·없는 영화·잘못된 ID·이미지 누락을 구분합니다.
- 요청 취소로 이전 응답이 새 화면을 덮어쓰지 않도록 했습니다.
- 북마크는 Zustand와 localStorage로 유지하고, TMDB 출처를 푸터에 표시합니다.
- `src/examples`에는 Promise 상태, then과 async/await, fetch 실습 코드가 있습니다.

검증 명령:

```powershell
pnpm test
pnpm lint
pnpm build
```

테스트는 TMDB 응답을 대체하므로 실제 토큰 없이 실행할 수 있습니다. 실제 TMDB 서버와의 통신은 토큰 설정 후 브라우저에서 별도로 확인합니다.

## 영화 백엔드 실행

JDK 21과 MySQL이 필요합니다.

1. MySQL 클라이언트에서 `movie/db/schema.sql`을 실행해 실습 DB와 테이블을 준비합니다. 다른 DB 이름을 사용한다면 스크립트와 `DB_URL`을 함께 수정합니다.
2. 샘플 조회가 필요하면 빈 실습 DB에서 `movie/db/seed.sql`을 한 번 실행합니다. 샘플 회원 1·2와 평점 3개를 추가합니다.
3. 아래 명령으로 환경 파일을 준비하고 서버를 실행합니다.

```powershell
cd doeyat/week05/movie
Copy-Item .env.example .env
# .env에 로컬 MySQL 접속 정보 입력
.\gradlew.bat bootRun
```

`ddl-auto: validate`이므로 서버는 스키마와 샘플 데이터를 자동 생성하지 않습니다. `.env`의 기본 URL은 `jdbc:mysql://localhost:3306/umc_movie`이며 `DB_USERNAME`, `DB_PASSWORD`도 설정합니다.

| 요청 | 응답 |
| --- | --- |
| `GET /members/nickname/{nickname}` | `{"available": true}`이면 사용 가능한 닉네임 |
| `GET /members/email/{email}` | `{"available": true}`이면 사용 가능한 이메일 |
| `GET /members/{memberId}/ratings` | 해당 회원의 평점을 ID 내림차순으로 반환 |

평점이 없는 회원은 빈 배열, 존재하지 않는 회원은 404를 반환합니다. 평점 DTO에는 비밀번호나 회원 엔티티를 포함하지 않습니다. 생성·수정 시간은 공통 엔티티에서 관리합니다.

백엔드 테스트는 `movie` 폴더에서 `.\gradlew.bat test`로 실행하며 H2를 사용합니다. 실제 MySQL 스키마와의 호환성은 별도 실행 확인이 필요합니다.

## 간이 프론트 실행

별도 터미널에서 저장소 루트 기준으로 실행합니다.

```powershell
python -m http.server 5173 --bind localhost --directory doeyat/week05/mock-frontend
```

`http://localhost:5173`에서 닉네임·이메일 중복 확인과 회원별 평점 조회를 실행합니다. 서버는 `http://localhost:8080`으로 요청하며, CORS 허용 출처는 `http://localhost:5173`입니다. UMCine 개발 서버와 동시에 같은 포트를 사용할 수 없으므로 둘 중 하나를 종료한 뒤 실행합니다.

## 기존 도서 API

`study`는 week04 도서 API를 유지합니다. JDK 21과 `DB_URL`, `DB_USER`, `DB_PW`를 설정해 실행합니다. `study` 폴더에서 `.\gradlew.bat test`로 외부 DB 없이 도서 등록·조회·검증 테스트를 실행할 수 있습니다. `movie`와 기본 포트가 같으므로 동시에 실행하지 않습니다.

## 제출

- 브랜치: `week05_doeyat` (main 기준)
- PR 제목: `[week05] doeyat 5주차 미션`
- 커밋 대상: `doeyat/week05/`
- PR base: `main`

```powershell
git add doeyat/week05/
git diff --cached --stat
```

PR 내용 초안:

> 정적 영화 데이터를 TMDB API로 교체하고 목록·검색·상세 화면에서 비동기 요청의 로딩과 오류 상태를 처리했습니다. fetch와 ky의 사용 방식을 비교하고, 요청 취소로 응답 순서가 바뀌는 경우를 처리했습니다. 별도 영화 백엔드에서는 JPA 엔티티와 DTO를 나누어 회원 중복 확인·평점 조회 API를 구현하고 간이 프론트로 CORS 요청을 실습했습니다.
