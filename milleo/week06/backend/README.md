# 6주차 백엔드 필수 미션 — 영화 평점 서비스

Spring Boot 3.5.0 / Java 21 / JPA / MySQL. 5주차 조회 API를 기반으로 회원가입과 평점 등록·수정·삭제를 구현했습니다.

## 실행

1. MySQL에 별도 데이터베이스를 생성합니다: `CREATE DATABASE umc_week06_movie CHARACTER SET utf8mb4;`
2. 해당 DB에서 [sql/01-schema.sql](sql/01-schema.sql)을 실행합니다.
3. `.env.example`을 `.env`로 복사한 뒤 본인의 MySQL 연결 정보를 입력합니다. `.env`는 Git에서 제외됩니다.
4. `./gradlew bootRun`을 실행합니다. 기본 주소는 `http://localhost:8082`입니다.
5. Postman에서 [요청 모음](requests/week06.postman_collection.json)을 Import하고 위에서 아래로 실행합니다. 생성된 회원·평점 ID는 자동 저장됩니다. 전체 재실행 시 가입 이메일·닉네임이 자동으로 달라집니다.

검증만 실행할 때는 MySQL 설정 없이 `./gradlew test bootJar`를 사용합니다. 테스트는 별도 H2 메모리 DB(MySQL 호환 모드)를 사용합니다.

## 필수 미션 구현

- 이메일, 닉네임(2~12자), 비밀번호(8자 이상, 대문자·소문자·숫자·특수문자) 검증
- bcrypt cost 10으로 저장. UTF-8 72바이트 초과 입력 거부, 응답에서 비밀번호 제외
- 평점 등록·수정·삭제와 소유자 확인
- movieId 양의 정수, score 1~5 정수, comment 선택·500자 이하
- 이메일·닉네임 UNIQUE, 회원+영화 복합 UNIQUE로 DB에서도 중복 방지
- 성공·실패 공통 응답과 400/403/404/409 처리. DELETE 성공은 본문 없는 204
- 기존 조회 API를 유지하고 응답 본문은 6주차 공통 형식의 `result`에 담음

워크북 규칙에 따라 회원 ID를 URL로 받습니다. 로그인/JWT는 다음 주차 범위이며 구현하지 않았습니다. PATCH는 score가 필수이고 comment를 생략하거나 null로 보내면 기존 후기를 비웁니다.

## 제출 자료

- [API 명세](docs/API.md)
- [Postman 요청·자동 확인](requests/week06.postman_collection.json)
- [IntelliJ HTTP 요청 예제](requests/week06.http)
- [검증 결과 및 캡처 안내](docs/검증결과.md)
- [트러블슈팅](docs/트러블슈팅.md)

핵심 코드: [회원가입 서비스](src/main/java/com/umc/movie/service/MemberService.java), [평점 서비스](src/main/java/com/umc/movie/service/RatingService.java), [요청 검증 DTO](src/main/java/com/umc/movie/dto/SignupRequest.java), [전역 예외 처리](src/main/java/com/umc/movie/exception/GlobalExceptionHandler.java), [통합 테스트](src/test/java/com/umc/movie/WriteApiIntegrationTest.java).

이 폴더만 6주차 백엔드 제출 대상입니다. 프론트엔드의 기존 변경은 별도로 유지했습니다. 노션 수정, 커밋 및 원격 푸시는 하지 않았습니다.
