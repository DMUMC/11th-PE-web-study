# 밀러 · UMC 9주차 백엔드

8주차 영화 API에 Swagger UI와 JWT 및 응답 코드 문서를 추가했다. Java 21, Spring Boot 3.5.0, Springdoc 2.8.14를 사용한다.

## 실행

```sh
export JAVA_HOME="$(/usr/libexec/java_home -v 21)"
./gradlew test bootJar
export DEMO_JWT_SECRET="$(openssl rand -hex 32)"
"$JAVA_HOME/bin/java" -jar build/libs/movie-week09-0.0.1-SNAPSHOT.jar --spring.profiles.active=demo
```

데모는 `127.0.0.1:8098`의 H2 인메모리 DB를 사용한다. 종료하면 데모 데이터는 사라진다.

- [Swagger UI](http://127.0.0.1:8098/swagger-ui.html)
- [OpenAPI JSON](http://127.0.0.1:8098/v3/api-docs)

`POST /members`에서 가입한 후 `POST /auth/login`으로 로그인한다. Swagger의 **Authorize**에 `result.accessToken` 문자열을 입력하면 Swagger가 인증이 필요한 요청에 `Authorization: Bearer <token>` 헤더를 붙인다. 클라이언트에서 직접 호출할 때는 헤더를 직접 보낸다.

MySQL로 실행하려면 `DB_URL`, `DB_USER`, `DB_PW`, `JWT_SECRET` 환경변수를 설정한다. 신규 DB에는 `sql/01-schema.sql`, `sql/03-favorite.sql`을 적용한다. 기존 DB에는 누락된 스키마 변경만 적용한다. 기본 `ddl-auto`는 `validate`다.

## API 응답

응답에는 `isSuccess`, `code`, `message`, `result`가 들어간다. 토큰이 필요한 API는 토큰 누락, 오류, 만료에 HTTP 401과 각각 `AUTH401_2`, `AUTH401_3`, `AUTH401_4`를 반환한다. 입력 오류에는 HTTP 400 `COMMON400`을 반환한다.

| 메서드와 경로 | 기능 | JWT | 성공 | 주요 오류 |
| --- | --- | --- | --- | --- |
| `POST /members` | 회원가입 | 공개 | 201 `COMMON201` | 409 `MEMBER4091` / `MEMBER4092` |
| `POST /auth/login` | 로그인과 토큰 발급 | 공개 | 200 `COMMON200` | 401 `AUTH401_1` |
| `GET /members/{memberId}/ratings` | 회원 평점 목록 최신순 조회 | 공개 | 200 `COMMON200` | 404 `COMMON404` |
| `POST /ratings` | 평점 등록 | 필요 | 201 `COMMON201` | 404 `MEMBER404_1`, 409 `RATING409_1` |
| `PATCH /ratings/{ratingId}` | 작성한 평점의 점수와 후기 수정 | 필요 | 200 `COMMON200` | 403 `RATING403_1`, 404 `RATING404_1` |
| `DELETE /ratings/{ratingId}` | 작성한 평점 삭제 | 필요 | 200 `COMMON200` | 403 `RATING403_1`, 404 `RATING404_1` |
| `GET /members/me` | 내 정보 조회 | 필요 | 200 `COMMON200` | 404 `MEMBER404_1` |
| `PATCH /members/me` | 내 닉네임, 이메일, 소개 수정 | 필요 | 200 `COMMON200` | 404 `MEMBER404_1`, 409 `MEMBER4091` / `MEMBER409_1` |
| `POST /favorites` | 즐겨찾기에 영화 등록 | 필요 | 201 `COMMON201` | 404 `MEMBER404_1`, 409 `FAVORITE409_1` |
| `GET /favorites` | 내 즐겨찾기 목록 최신 등록순 조회 | 필요 | 200 `COMMON200` | JWT 인증 오류 |
| `GET /favorites/{movieId}` | 즐겨찾기 여부 조회 | 필요 | 200 `COMMON200` | 400 `COMMON400` |
| `DELETE /favorites/{movieId}` | 내 즐겨찾기 해제 | 필요 | 200 `COMMON200` | 404 `FAVORITE404_1` |

## 검증

- `RatingServiceTest`는 중복 등록의 `RATING409_1`과 작성자가 아닌 회원의 수정 요청에 대한 `RATING403_1`을 확인한다.
- `RatingApiIntegrationTest`는 같은 평점 요청을 기준으로 토큰 없이 401, 로그인으로 발급받은 JWT로 201을 확인한다. 등록한 평점의 DB 소유자도 확인한다.
- `FavoriteServiceTest`는 동일 회원과 영화가 이미 등록된 경우의 `FAVORITE409_1`을 확인한다. `FavoriteIntegrationTest`는 실제 JWT 검사와 H2 저장 계층을 통과하는 201 → 409 흐름도 확인한다.
- 즐겨찾기 검사 한 줄을 격리 복제본에서 제거하자 단위 테스트가 `Expecting code to raise a throwable.`로 실패했다. 검사를 복원한 뒤 전체 테스트 46개가 통과했다.
- `SwaggerDocumentationIntegrationTest`는 Swagger UI의 공개 접근, 문서의 Bearer JWT 설정, 각 대상 API의 요약과 응답 코드를 확인한다. 데모 환경은 H2 MySQL 호환 모드로 검증했다.
