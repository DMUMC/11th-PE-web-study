# 3주차 미션 — milleo

프론트엔드와 Spring 백엔드 실습을 각각 `umcine`, `study`에 정리했습니다.
두 프로젝트는 이번 주차의 별도 실습입니다.

- [프론트엔드 실행 방법](umcine/README.md): 영화 목록·검색·상세 라우팅, Tailwind CSS
- [백엔드 실행 방법](study/README.md): 카테고리별 도서 조회와 대여 기록 생성 필수 미션
- [실행 화면](docs/screenshots/): 프론트엔드 3장, Postman 결과 2장

## 검증

- 프론트엔드: `pnpm build` (Vite 빌드 및 TypeScript 검사)
- 백엔드: `./gradlew test bootJar` (테스트 7개 통과)
- 백엔드 HTTP 테스트는 Repository를 모킹합니다. 실제 MySQL 응답은 첨부한 Postman 사진에 기록했습니다.
