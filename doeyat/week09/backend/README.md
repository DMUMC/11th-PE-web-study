# doeyat 9주차 백엔드 — Swagger / 평점 테스트

8주차 기능을 유지하며 필수 API 문서화와 평점 단위·통합 테스트를 추가했습니다. 선택 미션인 `/movie-records` 트랜잭션 테스트는 포함하지 않습니다.

## 실행

JDK 21을 사용합니다. 저장소 루트에서 실행합니다.

```powershell
cd doeyat/week09/backend
.\gradlew.bat bootRun --args="--spring.profiles.active=local"
```

로컬 모드는 H2 메모리 DB를 사용하며 MySQL·환경 변수 없이 실행합니다. 서버를 재시작하면 데이터가 초기화됩니다.

- API: http://127.0.0.1:8089
- Swagger UI: http://127.0.0.1:8089/swagger-ui/index.html
- OpenAPI JSON: http://127.0.0.1:8089/v3/api-docs

회원가입 → 로그인 후 응답의 `accessToken` 값만 Swagger의 Authorize에 입력합니다. Swagger가 `Bearer` 접두사를 붙여 전송합니다. 공개 API는 토큰 없이 호출할 수 있습니다.

## 테스트

```powershell
.\gradlew.bat test bootJar
# 필수 미션 테스트 4개만 실행
.\gradlew.bat test --tests '*RatingServiceTest' --tests '*RatingMissionIntegrationTest'
```

전체 테스트 39개를 실행해 통과했습니다. 필수 테스트 4개는 상태 코드·업무 오류 코드를 함께 검증하고, 저장 방지·원본 유지·실제 DB 저장도 확인합니다. 추가로 OpenAPI의 필수 9개 API 설명·인증 정보와 즐겨찾기의 회원별 분리를 검증합니다.

테스트 보고서는 `build/reports/tests/test/index.html`에 생성됩니다. [백엔드 미션 기록](../docs/백엔드-미션기록.md)에는 실제 실행 화면 캡처를 포함했습니다.

## 헤드리스 캡처 재현

테스트를 전체 실행하고 백엔드 서버를 켠 상태에서 별도 터미널로 실행합니다. 기존 프론트의 Playwright 설치를 이용합니다.

```powershell
cd doeyat/week09/web
npm.cmd ci
npx.cmd playwright install chromium
npm.cmd run capture:backend
```

Swagger 문서 11장, 실제 요청 응답 5장, Gradle 보고서 3장을 `docs/backend-screenshots`에 저장하고 실제 테스트 보고서를 `docs/backend-test-report`로 복사합니다. 캡처 과정에서 로컬 테스트 계정을 만들며, 토큰은 메모리에서만 사용합니다. 응답 영역만 캡처해 Authorization 헤더를 이미지에 노출하지 않습니다.

다른 실행 주소는 `BACKEND_URL`, 이미 설치된 Chromium 실행 파일은 `PLAYWRIGHT_CHROMIUM_EXECUTABLE` 환경 변수로 지정할 수 있습니다.

이 주차는 H2 로컬 환경에서 검증했습니다. MySQL로 실행하려면 기존 회원·평점 테이블 외에 `favorite` 테이블과 회원·영화 ID 복합 유니크 제약이 필요합니다. `ddl-auto: validate` 모드에서는 새 테이블이 자동 생성되지 않습니다. 프론트의 BACKEND_URL 기본값은 이 서버와 같은 http://127.0.0.1:8089 입니다.
