# 6주차 워크북 및 실습 프로젝트 (Week 6)

## 📌 구성 안내

- 📄 [6주차 - TanStack Query로 서버 데이터 조회하기.md](./6주차%20-%20TanStack%20Query로%20서버%20데이터%20조회하기.md) (프론트엔드 React + TanStack Query 실습 워크북)
- 📄 [6주차.md](./6주차.md) (백엔드 Spring Boot 회원가입 & 평점 API 워크북)
- 📁 [`umcine/`](./umcine) (React 19 + TanStack Router + TanStack Query 영화 애플리케이션)
- 📁 [`spring/`](./spring) (Spring Boot 3.5 + JPA + Validation + BCrypt 회원 & 영화 평점 백엔드)

---

## 🚀 프론트엔드 실습 (`umcine`) 실행 방법

### 1. 환경 변수 설정
`hoon/week6/umcine/.env.example`을 복사하여 `.env`를 생성하고 TMDB API 키를 설정합니다.

```bash
VITE_TMDB_API_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_ACCESS_TOKEN=your_tmdb_access_token_here
```

### 2. 패키지 설치 및 개발 서버 실행
```bash
cd hoon/week6/umcine
pnpm install # 또는 npm install
pnpm dev     # 또는 npm run dev
```

---

## 🚀 백엔드 실습 (`spring`) 실행 방법

### 1. DB 설정 (`src/main/resources/application.yaml`)
로컬 MySQL (`servicedb`) 접속 정보 또는 H2 인메모리 설정을 확인합니다.

### 2. 빌드 및 서버 구동
```bash
cd hoon/week6/spring
./gradlew bootRun # Windows: gradlew.bat bootRun
```

---

## ✨ 핵심 구현 내용

### 1. 프론트엔드 (TanStack Query)
- **전역 QueryClient 설정 (`src/main.tsx`)**: `staleTime: 30초` 기본값, `QueryClientProvider` 및 `ReactQueryDevtools`
- **쿼리 옵션화 (`src/api/movies/queries.ts`)**: `queryOptions` 기반으로 `list()`, `search()`, `detail()` 관리 (선택 미션 완수)
- **화면 연동 (`src/pages/movies/`)**: 목록 조회 페이지네이션, 검색어 `enabled` 가드, 상세 화면 캐시 5분 최적화

### 2. 백엔드 (Spring Boot)
- **회원가입 API (`POST /members`)**: DTO 유효성 검증(`@Valid`, `@Email`, `@Pattern`), BCrypt 해시 암호화 저장, 중복 에러 분리(`DuplicateEmailException` 4091, `DuplicateNicknameException` 4092)
- **평점 CRUD API (`/members/{memberId}/ratings`)**: 평점 등록(`POST 201`), 수정(`PATCH 200`), 삭제(`DELETE 204`), 작성자 검증(`403`), 없는 리소스(`404`)
- **전역 예외 처리기 (`GlobalExceptionHandler`)**: 일관된 `ApiResponse<T>` 규격 응답 및 DB UNIQUE 제약 위반(`DataIntegrityViolationException`) 변환 처리 (선택 미션 완수)
