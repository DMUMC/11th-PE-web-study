# doeyat 9주차 — Next.js · Swagger · 평점 테스트

8주차 UMCine 기능을 유지하면서 Vite·TanStack Router를 Next.js App Router로 옮겼다. 로그인 토큰 영속 저장, Query 회원 캐시, 서버 즐겨찾기, 평점 CRUD와 영화 기록 트랜잭션을 이어간다.

## 실행

Java 21과 Node.js 22.12 이상을 사용한다. 저장소 루트에서 터미널 두 개를 연다.

```powershell
cd doeyat/week09/backend
.\gradlew.bat bootRun --args="--spring.profiles.active=local"
```

```powershell
cd doeyat/week09/web
npm.cmd ci
npm.cmd run dev
```

- 프론트: http://127.0.0.1:5179
- 백엔드: http://127.0.0.1:8089
- Swagger: http://127.0.0.1:8089/swagger-ui/index.html

로컬 모드는 H2 메모리 DB를 사용하며 종료하면 회원·평점·즐겨찾기가 초기화된다. MySQL·환경 변수 없이 실행할 수 있다. TMDB 토큰을 설정하지 않으면 로컬 샘플 영화를 사용한다. 실제 TMDB는 web/.env.example의 NEXT_PUBLIC_TMDB_READ_TOKEN을 설정한다. BACKEND_URL의 기본값은 9주차 서버 8089다.

## 마이그레이션

| 기존 | Next.js |
| --- | --- |
| createFileRoute·route tree | app의 page.tsx·layout.tsx |
| Link to·params·search | next/link href |
| useNavigate·useSearch·useParams | useRouter·useSearchParams·useParams |
| 로그인 전용 그룹과 Outlet | (authenticated)/layout.tsx와 children |
| document.title | 페이지 metadata |
| Vite proxy·환경 변수 | rewrites·NEXT_PUBLIC 환경 변수 |
| Tailwind Vite 플러그인 | PostCSS |

페이지 진입점과 공통 layout은 Server Component, 폼·이벤트·Query·Zustand 화면은 Client Component로 나눈다. Client Component도 SSR 대상이므로 persist의 skipHydration을 사용하고 마운트 후 토큰을 복원한다. 로그인 전용 화면은 복원이 끝난 뒤 접근 여부를 판단한다. 서버 API가 데이터 접근 권한을 검증한다.

## 검증과 캡처

```powershell
# backend
.\gradlew.bat test bootJar
# web
npm.cmd run build
npm.cmd run typecheck
# 두 서버 실행 후
npx.cmd playwright install chromium
npm.cmd run test:e2e
npm.cmd run capture
npm.cmd run capture:backend
```

백엔드 테스트 39개·브라우저 테스트 3개 통과. 실제 UI 회원가입·로그인·즐겨찾기·평점 CRUD·회원 수정·새로고침·로그아웃 접근 제한을 확인했다. Swagger에서 401·201·409 응답을 직접 실행했다. TMDB 실서비스·MySQL 환경은 이번 검증에서 제외했다.

- [프론트 미션 기록](docs/미션기록.md)
- [백엔드 미션 기록](docs/백엔드-미션기록.md)
- [검증 결과](docs/검증결과.md)
- [이미지 링크를 포함한 PR 본문](docs/PR본문.md)

브랜치: week09_doeyat
