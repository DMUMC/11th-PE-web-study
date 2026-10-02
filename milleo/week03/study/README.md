# UMC 3주차 필수 미션 (Spring Boot)

노션 Spring 세팅 가이드: Java 21, Gradle Groovy, Spring Boot 3.5.0,
Spring Web, JDBC API, MySQL Driver, Lombok. DTO와 ORM 없이 JdbcTemplate으로 구현했다.

## 실행

IntelliJ에서 이 `study` 폴더를 Gradle 프로젝트로 연다.
실행 구성 `StudyApplication`에서 아래 환경 변수를 설정한다.

```text
DB_URL=jdbc:mysql://localhost:3306/umc_week02_20260927
DB_USER=root
DB_PW=본인 로컬 MySQL 비밀번호
```

실제 값은 개인 실행 구성에만 저장하며 커밋하지 않는다.
`src/main/resources/application.yml`은 노션처럼 환경 변수 이름만 참조한다.

```sh
./gradlew test bootJar
./gradlew bootRun
```

## 필수 미션

- `GET http://localhost:8080/books/category/1`: 경로 변수를 받아 `WHERE category_id = ?`로 조회한다. 결과가 없으면 빈 JSON 배열을 반환한다.
- `POST http://localhost:8080/rentals`: JSON `{"userId":1,"bookId":3}`을 받고 대여 기록을 저장한다. 응답은 201과 삽입된 행이다. 대여일은 `NOW()`, 예정일은 `DATE_ADD(NOW(), INTERVAL 7 DAY)`이다.

각 기능을 Controller → Service → Repository로 나눴다. SQL은 Repository에만 있다.
요청 ID가 누락되거나 양의 정수가 아니면 400, 없는 사용자나 도서 FK도 400으로 응답한다.
선택 미션과 별도의 도서 대여 정책은 추가하지 않았다.

## 검증 범위

`MissionApiTests`는 실제 Controller와 Service를 거치는 요청을 검사하되 Repository는 모킹한다.
따라서 HTTP 경로·본문·응답·입력 오류를 검증하며, MySQL 쿼리 실행 증거는 아니다.
실제 MySQL 연결 후 Postman에서 조회 200과 대여 등록 201을 확인했다.
생성된 rental_id=4의 대여일과 예정일은 DB에서도 7일 간격으로 확인했다.

`umc-week03-required.postman_collection.json`을 Postman에서 Import하면 필요한 요청과 예외 확인 요청을 사용할 수 있다.

## 참고

[스터디 PR #22](https://github.com/DMUMC/11th-PE-web-study/pull/22)의 Spring 설정,
Controller → Service → Repository 구성과 두 필수 미션 인증 방식을 비교했다.
