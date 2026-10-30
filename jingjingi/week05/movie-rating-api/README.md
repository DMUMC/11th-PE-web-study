# UMC 영화 평점 API - 5주차

Spring Boot로 닉네임·이메일 중복 확인과 회원별 평점 조회 API를 구현한 프로젝트입니다. MySQL 스키마는 `umc_movie` 하나만 사용합니다.

## 실행 준비

1. MySQL Workbench에서 `database/setup.sql` 전체를 실행합니다.
2. `.env.example`을 복사해 `.env`를 만들고 MySQL 비밀번호를 입력합니다.
3. Windows PowerShell에서 아래 명령을 실행합니다.

```powershell
.\gradlew.bat bootRun
```

UMCine은 `http://localhost:5173`, 별도 API 테스트 프론트는 `http://localhost:5174`, 백엔드는 `http://localhost:8080`을 사용합니다. 다른 프론트 주소를 사용한다면 `.env`의 `APP_CORS_ALLOWED_ORIGINS`에 쉼표로 구분해 추가한 뒤 서버를 재시작합니다.

## API 확인

| 기능 | Method | URL | 예상 결과 |
| --- | --- | --- | --- |
| 닉네임 중복 확인 | GET | `http://localhost:8080/members/nickname/수현` | `{ "available": false }` |
| 이메일 중복 확인 | GET | `http://localhost:8080/members/email/noco@umc.com` | `{ "available": false }` |
| 회원별 평점 조회 | GET | `http://localhost:8080/members/1/ratings` | 평점 JSON 배열 |
| 없는 회원 확인 | GET | `http://localhost:8080/members/999/ratings` | `404 Not Found` |

Postman에서는 URL, 상태 코드와 응답 Body가 한 화면에 보이도록 캡처합니다. UMCine 프론트의 `/api-demo` 화면에서는 세 API를 각각 호출하고 결과 JSON을 캡처할 수 있습니다.

## 테스트

```powershell
.\gradlew.bat test
```

통합 테스트에서 정상 응답, 평점 정렬, 없는 회원의 404와 CORS 응답 헤더를 확인합니다.

## 제출용 백엔드 스크린샷

| 파일 | 인증 내용 |
| --- | --- |
| `docs/screenshots/01-browser-api-success.png` | 별도 웹 화면에서 백엔드 API 3개 호출 및 `200` JSON 응답 확인 |
| `docs/screenshots/02-member-table.png` | MySQL `member` 테이블의 회원 더미 데이터 확인 |
| `docs/screenshots/03-rating-table.png` | MySQL `rating` 테이블의 회원별 평점 더미 데이터 확인 |

## 트러블슈팅 기록

### Gradle 실행 시 잘못된 JAVA_HOME

- 증상: `JAVA_HOME is set to an invalid directory` 오류로 테스트가 시작되지 않았습니다.
- 원인: `JAVA_HOME`이 삭제된 JDK 17의 이전 설치 경로를 가리키고 있었습니다.
- 해결: 현재 설치된 `C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot`으로 `JAVA_HOME`을 변경했습니다.
- 확인: 통합 테스트 4개가 모두 통과했습니다.

### 브라우저 CORS 오류가 발생하는 경우

- 증상: Postman에서는 정상인데 브라우저에서 CORS 오류가 발생했습니다.
- 원인: 프론트 주소 `http://localhost:5173`이 백엔드의 허용 출처에 등록되지 않았습니다.
- 해결: `APP_CORS_ALLOWED_ORIGIN`을 실제 프론트 주소로 설정하고 백엔드를 재시작했습니다.
- 확인: 브라우저 Network 응답에서 `Access-Control-Allow-Origin: http://localhost:5173`을 확인했습니다.
