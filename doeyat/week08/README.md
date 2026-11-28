# 8주차 — Mutation과 회원별 영화 기록

7주차 코드를 기반으로 작성했다.

- web: 회원가입·로그인·회원 수정 useMutation, Zustand 토큰 영속 저장, Query 회원 캐시, 로그인 전용 Route Group과 Layout Route
- 영화 상세: 즐겨찾기 조회·등록·삭제 및 내 평점 조회·등록·수정·삭제
- backend: 즐겨찾기 CRUD, JWT 회원 식별, UNIQUE 제약, 영화 기록 트랜잭션

## 실행

backend/.env.example을 참고해 .env를 만들고 MySQL에 backend/sql/01-schema.sql을 적용한 뒤 backend에서 `gradlew.bat bootRun`을 실행한다. 기존 DB에는 favorite 테이블을 추가해야 한다.

web에서 `npm ci`, `npm run dev`를 실행한다. Vite 프록시 설정은 web/vite.config.ts를 참고한다.

## 검증

backend에서 `gradlew.bat test`, web에서 `npm run build`.

[프론트 기록](docs/미션기록.md) · [백엔드 기록](docs/백엔드-미션기록.md)
