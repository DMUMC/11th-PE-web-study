# UMCine 7주차 Frontend

6주차 영화 목록·검색·상세·캐시 코드를 유지하고 회원 화면을 연결한 누적 작업본입니다.

## 실행

```sh
pnpm install --frozen-lockfile
cp .env.example .env.local
# VITE_TMDB_READ_TOKEN에 본인의 TMDB 읽기 토큰 설정
pnpm dev --host 127.0.0.1 --port 5179
```

백엔드는 ../backend에서 8083 포트로 실행합니다. Vite가 /api 요청을 프록시합니다.
로컬 .env.local은 기존 작업본의 설정을 사용하며 Git에 포함하지 않습니다.

## 연결 흐름

- 영화 목록(/), 검색(/search), 상세(/movies/$movieId): 기존 실제 TMDB API
- 회원가입(/signup): 이메일·닉네임 중복 확인, 비밀번호 확인, 실제 POST /members
- 로그인(/login): 기존 회원 DB의 비밀번호 검증 후 JWT 발급, Authorization: Bearer 헤더 사용
- 내 정보(/mypage): GET /members/me로 로그인한 계정 조회
- 수정(/mypage/edit): PATCH /members/me, 중복·입력 오류 표시, 저장 후 DB 유지
- 로그아웃: 탭의 sessionStorage에서 토큰 제거. 발급된 토큰은 서버에서 만료 전까지 유효하며, 서버 측 폐기는 추가 과제입니다.

비밀번호와 가짜 프로필은 저장하지 않습니다. 액세스 토큰은 현재 탭의 sessionStorage에 보관합니다.
입력 중에는 임시 값을 유지하고 저장 성공 시에만 회원 상태를 갱신합니다.

검증: pnpm build(Vite + TypeScript), 실제 브라우저 로그인 및 프로필 저장, 실제 TMDB 응답 확인.
