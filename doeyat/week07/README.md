# doeyat 7주차 — UMCine / JWT

PR #97의 회원가입·로그인·내 정보·평점 인증 흐름을 참고한 로컬 실습 프로젝트입니다.

## 빠른 실행 (Windows PowerShell)

Java 21, Node.js 22 이상이 필요합니다. 저장소 루트에서 터미널 두 개를 엽니다.

백엔드:
```powershell
cd doeyat/week07/backend
.\gradlew.bat bootRun --args="--spring.profiles.active=local"
```

프론트:
```powershell
cd doeyat/week07/web
npm.cmd ci
npm.cmd run dev
```

http://127.0.0.1:5179 에 접속합니다. 백엔드는 http://127.0.0.1:8083 입니다.
로컬 모드는 MySQL이나 .env 설정 없이 H2 메모리 DB로 실행합니다. 서버를 종료하면 회원·평점이 초기화됩니다. 회원가입에서 닉네임 `doeyat`, 본인의 테스트 이메일, 비밀번호 `Umc!1234`로 가입한 다음 로그인하세요.
TMDB 토큰이 없으면 포함된 샘플 영화로 목록·검색·상세·북마크를 실습합니다. 실제 TMDB를 사용하려면 web/.env.example을 .env.local로 복사하고 VITE_TMDB_READ_TOKEN을 입력한 뒤 프론트를 재시작하세요.

## 테스트 및 캡처

```powershell
# backend에서
.\gradlew.bat test bootJar
# web에서
npm.cmd run build
npx.cmd playwright install chromium
npm.cmd run capture
```

캡처 명령은 두 서버가 실행 중이어야 합니다. 새 DB에서 실행하면 `doeyat` 계정을 브라우저로 가입하고 캡처합니다. 이미 가입했다면 백엔드를 재시작하거나 `$env:CAPTURE_NICKNAME='doeyat2'`처럼 다른 닉네임을 지정하세요. 캡처 실행마다 새 테스트 회원이 생깁니다.

- [캡처 목록과 PR 이미지 분석](docs/캡처결과.md)
- [API 실제 응답 보고서](docs/screenshots/api-report.html)
- [Postman Collection](backend/requests/week07.postman_collection.json): Import 후 위에서부터 Runner 실행
- [HTTP 요청 예시](backend/requests/week07.http)

프론트 캡처 8장, API 전체 보고서 1장, 개별 API 응답 13장입니다. API 보고서는 실제 HTTP 응답을 HTML로 표시한 것으로 Postman 자체 캡처는 아닙니다. 토큰 값과 비밀번호는 보고서에서 생략합니다.

## MySQL 사용

backend/.env.example을 .env로 복사해 DB 접속 정보와 32바이트 이상의 무작위 JWT_SECRET을 입력합니다. 신규 DB에는 backend/sql/01-schema.sql을 적용하고 local 프로필 없이 실행합니다. 기존 DB의 introduction 열이 없다면 sql/02-profile.sql을 적용합니다. 자세한 사항은 backend/README.md를 참고하세요.