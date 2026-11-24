# UMC 영화 평점 API - 6주차

Spring Boot로 회원가입과 평점 등록·수정·삭제 API를 구현한 프로젝트입니다. DTO 검증, bcrypt 비밀번호 저장, UNIQUE 제약과 공통 오류 응답을 적용합니다. MySQL 스키마는 기존 `umc_movie` 하나만 사용합니다.

## 실행 준비

1. MySQL Workbench에서 `database/setup.sql` 전체를 실행합니다.
2. `.env.example`을 복사해 `.env`를 만들고 MySQL 접속 정보를 입력합니다.
3. JDK 17 환경에서 서버를 실행합니다.

```powershell
.\gradlew.bat bootRun
```

기본 서버 주소는 `http://localhost:8080`입니다.

## API 명세

| 기능 | Method | URL | 성공 상태 |
| --- | --- | --- | --- |
| 회원가입 | POST | `/members` | `201 Created` |
| 평점 등록 | POST | `/members/{memberId}/ratings` | `201 Created` |
| 평점 수정 | PATCH | `/members/{memberId}/ratings/{ratingId}` | `200 OK` |
| 평점 삭제 | DELETE | `/members/{memberId}/ratings/{ratingId}` | `204 No Content` |
| 회원별 평점 조회 | GET | `/members/{memberId}/ratings` | `200 OK` |

## Postman 요청값

### 회원가입 성공

`POST http://localhost:8080/members`

```json
{
  "email": "week6@umc.com",
  "password": "Umc!1234",
  "nickname": "육주차"
}
```

예상 결과는 `201 Created`이며 응답의 `result`에는 `memberId`, `email`, `nickname`만 포함됩니다. `password`는 응답에 포함되지 않고 DB에는 60자의 bcrypt 해시로 저장됩니다.

### 회원가입 검증 실패

`POST http://localhost:8080/members`

```json
{
  "email": "wrong-email",
  "password": "short",
  "nickname": "한"
}
```

예상 결과는 `400 Bad Request`와 `COMMON4001` 오류 응답입니다.

### 평점 등록 성공

`POST http://localhost:8080/members/1/ratings`

```json
{
  "movieId": 680,
  "score": 5,
  "comment": "다시 보고 싶은 영화예요."
}
```

기존 더미 데이터와 겹치지 않는 `movieId`를 사용합니다. 예상 결과는 `201 Created`와 생성된 `ratingId`입니다.

### 평점 수정 성공

`PATCH http://localhost:8080/members/1/ratings/{등록된 ratingId}`

```json
{
  "score": 4,
  "comment": "평점과 후기를 수정했어요."
}
```

### 평점 삭제 성공

`DELETE http://localhost:8080/members/1/ratings/{등록된 ratingId}`

응답 상태는 `204 No Content`이며 Body는 비어 있어야 합니다.

## 실패 응답 확인

- 기존 이메일 `noco@umc.com`으로 가입: `409 Conflict`
- 별점 `0` 또는 `6` 전달: `400 Bad Request`
- 같은 회원과 영화로 평점 재등록: `409 Conflict`
- 다른 회원 ID로 평점 수정·삭제: `403 Forbidden`
- 존재하지 않는 평점 ID 수정·삭제: `404 Not Found`

실패 응답은 아래 구조를 공통으로 사용합니다.

```json
{
  "isSuccess": false,
  "code": "COMMON4091",
  "message": "이미 이 영화에 평점을 남기셨습니다.",
  "result": null
}
```

## 제출용 캡처

| 파일 | 인증 내용 |
| --- | --- |
| `docs/screenshots/01-signup-created.png` | 회원가입 요청과 `201 Created`, password가 제외된 회원 응답 |
| `docs/screenshots/02-duplicate-email-conflict.png` | 동일 이메일 재가입 요청과 `409 Conflict` 공통 오류 응답 |
| `docs/screenshots/03-rating-created.png` | 평점 등록 요청과 `201 Created`, 생성된 ratingId |
| `docs/screenshots/04-rating-validation-error.png` | 범위를 벗어난 별점 요청과 `400 Bad Request` 검증 응답 |
| `docs/screenshots/05-rating-updated.png` | 평점 수정 요청과 `200 OK` 공통 성공 응답 |
| `docs/screenshots/06-rating-deleted.png` | 평점 삭제 요청과 Body가 없는 `204 No Content` 응답 |

각 이미지에는 Postman의 Method, URL, 요청 Body, 상태 코드와 응답 JSON이 한 화면에 보이도록 기록했습니다.

## 핵심 코드

- `dto/SignUpRequest.java`: 회원가입 입력 검증
- `config/PasswordConfig.java`: BCryptPasswordEncoder 설정
- `service/MemberService.java`: 중복 검사, bcrypt 저장과 응답 DTO 변환
- `service/RatingService.java`: 평점 등록·소유권 확인·수정·삭제
- `controller/GlobalExceptionHandler.java`: 400·403·404·409 공통 오류 응답
- `entity/Rating.java`: 회원과 영화의 복합 UNIQUE 모델링

## 테스트

```powershell
.\gradlew.bat test
```

통합 테스트에서 회원가입과 bcrypt 저장, password 응답 제외, 검증 실패, 이메일·평점 중복, 평점 등록·수정·삭제, 403·404, DELETE 204와 기존 조회 API를 확인합니다.

## 트러블슈팅 기록

### Gradle 실행 시 잘못된 JAVA_HOME

- 증상: Gradle 실행 직후 `JAVA_HOME is set to an invalid directory` 오류가 발생했습니다.
- 원인: 환경 변수가 삭제된 JDK 17의 이전 설치 경로를 가리키고 있었습니다.
- 해결: 테스트 명령을 실행할 때 현재 설치된 `C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot`을 `JAVA_HOME`으로 지정했습니다.
- 확인: 통합 테스트 9개를 포함한 Gradle 빌드가 성공했습니다.

### 서비스 중복 검사만으로 동시 요청을 막을 수 없는 문제

- 문제: 거의 동시에 같은 이메일이나 평점이 저장되면 두 요청이 모두 사전 중복 검사를 통과할 수 있습니다.
- 해결: 서비스에서 이해하기 쉬운 오류 메시지를 위한 사전 검사를 수행하고, DB의 이메일·닉네임 및 `(member_id, movie_id)` UNIQUE 제약을 마지막 안전망으로 유지했습니다.
- 처리: DB 제약 위반은 전역 예외 처리에서 `409 Conflict` 공통 응답으로 변환합니다.
