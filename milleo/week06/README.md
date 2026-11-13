# [week06] 밀러 6주차 필수 미션

## Frontend — TanStack Query

[web](web)에서 영화 목록·검색·상세 요청을 TanStack Query로 관리합니다.

- 페이지·검색어·영화 ID별 queryKey 분리
- 기본 staleTime 60초, 상세 30초, gcTime 5분
- 빈 검색어·잘못된 영화 ID 요청 방지
- 로딩·오류·빈 결과 표시와 재시도
- QueryClientProvider와 React Query Devtools 연결

## Backend — 회원가입 및 평점 저장

[backend](backend)에서 Spring Boot로 회원가입, 평점 등록·수정·삭제를 구현합니다.

- 입력 검증, bcrypt 비밀번호 해시, 응답 DTO에서 비밀번호 제외
- 성공·실패 공통 응답, 400/403/404/409 처리
- 평점 소유자 확인, 회원·영화 복합 UNIQUE 제약
- DELETE 204 No Content

프론트는 TMDB API를 사용하며, 백엔드는 워크북의 별도 영화 평점 API입니다. 두 필수 미션을 하나의 회원가입 UI로 연결하는 추가 기능은 구현하지 않았습니다.

## 검증

- Frontend: `pnpm build` (Vite 및 TypeScript 검사)
- Backend: `./gradlew test bootJar`, 통합 테스트 28건 통과
- 실제 Postman/MySQL: 회원가입 201, 입력 검증 실패 400, 평점 등록 201 확인

실행 방법은 각 폴더 README를 참고합니다. 실제 환경 파일·API 토큰·빌드 결과·로그는 제출에서 제외합니다.
