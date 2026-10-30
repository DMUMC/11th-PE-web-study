# UMC 5주차 UMCine

4주차의 UI와 Zustand 북마크를 이어 받아 TMDB 목록·검색·상세 API를 연결했습니다.

## 실행

```bash
pnpm install
cp .env.example .env.local
# .env.local의 VITE_TMDB_READ_TOKEN에 본인의 TMDB Read Access Token 입력
pnpm dev --host 127.0.0.1 --port 5175
```

환경변수를 변경한 뒤 개발 서버를 재시작합니다. 토큰은 Git에 올리지 않습니다. VITE_ 변수는 브라우저에 노출됩니다.

## 구현

- src/api/tmdb.ts: 순수 fetch 실습 함수, ky 인스턴스, API 응답 타입과 UI adapter, 오류 안내
- src/hooks/use-request.ts: 요청 취소, 최신 응답만 반영, 로딩·오류·재시도
- src/routes/index.tsx: 인기 목록, URL page 기반 페이지 이동
- src/routes/search.tsx: URL query 기반 검색
- src/routes/movies.$movieId.tsx: 영화 ID 직접 조회
- public/images/no-poster.svg: 포스터가 없을 때 대체 이미지

## 검증 (2026-10-27)

`pnpm build` 통과. 테스트 응답을 주입한 브라우저 검증에서 목록·검색·상세, 직접 접근·새로고침, 북마크 유지, 페이지 이동, 빈 결과, 401·404·네트워크 오류, 재시도, 로딩, 375px 레이아웃, 순수 fetch를 확인했습니다. 이 검증 중 JavaScript 예외는 없었습니다.

**실제 TMDB 인증 및 실데이터 결과는 토큰 미설정으로 아직 미검증입니다.** 테스트 응답 검증을 실서버 성공 결과로 취급하지 않습니다.
