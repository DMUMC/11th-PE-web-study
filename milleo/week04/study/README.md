# UMC 4주차 ORM 도서 API

3주차 JDBC 프로젝트의 복사본입니다. 원본은 기존 폴더에 그대로 있습니다.

## 실행

```bash
/Users/david/Documents/Codex/2026-10-09/x20/outputs/umc-week04-spring/start-week04.command
```

기존 3주차 서버가 8080을 사용하면 해당 서버를 종료하고 4주차 서버를 실행합니다. 다른 프로젝트가 사용 중이면 안내를 출력합니다. 실제 시작 로그에서 `Started StudyApplication`을 확인한 뒤 Postman을 실행합니다. 종료하려면 Ctrl+C를 누릅니다.

기존 `.env`의 `DB_URL`, `DB_USER`, `DB_PW`를 읽습니다. 기존 테이블을 변경하지 않도록 `ddl-auto: validate`를 적용했고 `open-in-view: false`로 설정했습니다. GitHub에 코드를 올릴 때 `.env`는 제외합니다.

## Postman 확인

준비된 탭에서 Send를 누릅니다. 모든 요청 주소는 `http://localhost:8080/books`입니다.

| 순서 | 요청 | 확인할 결과 |
| --- | --- | --- |
| 1 | 정상 POST | 201, 생성된 bookId |
| 2 | GET | 200, 등록한 도서가 맨 앞에 표시됨 |
| 3 | 빈 title POST | 400, title 검증 메시지 |
| 4 | 없는 categoryId POST | 404, 카테고리 오류 메시지 |
| 5 | GET | 실패 요청의 도서가 추가되지 않음 |

정상 POST 본문:

```json
{
  "categoryId": 1,
  "title": "ORM 미션 확인용 도서",
  "description": "4주차 등록 테스트"
}
```

POST는 Body를 raw JSON으로 설정하고 GET은 Body를 사용하지 않습니다. 목록 필드는 `bookId`, `title`, `description`, `categoryId`, `categoryName`, `isAvailable`이며 bookId 내림차순입니다.

## 핵심 코드

경로는 `src/main/java/com/umc/study/` 기준입니다.

- `book/Book.java`, `book/Category.java`: PK, FK, ManyToOne 관계
- `book/CreateBookRequest.java`, `book/BookResponse.java`: 검증 및 응답 DTO
- `book/BookRepository.java`, `book/CategoryRepository.java`: JPA 조회와 저장
- `book/BookService.java`: 트랜잭션, 카테고리 확인, DTO 변환
- `book/BookController.java`: GET, POST, 등록 성공 201
- `common/ApiExceptionHandler.java`: 입력 오류 400, 없는 카테고리 404

EntityGraph로 카테고리를 함께 조회하고 서비스 트랜잭션 안에서 DTO로 변환합니다.

## 워크북 결과물

핵심 코드와 역할을 캡처 또는 GitHub 링크로 남깁니다. 정상 POST, GET, 빈 제목 POST, 없는 카테고리 POST의 요청 주소·본문·상태 코드·응답을 캡처합니다. 미션 중간 과정, Raw SQL 비교 3문장 이상, 최종 확인 1문장을 기록합니다.

실제 Postman 결과는 직접 실행한 뒤 작성합니다.

## 검사 결과

`./gradlew test bootJar --console=plain` 성공. 테스트 7개 모두 통과했습니다. 별도 H2 메모리 DB에서 정상 등록 후 조회, 정렬, 대여 가능 여부, 입력 오류, 없는 카테고리, 잘못된 JSON, 실패 요청의 미등록을 확인했습니다.

실제 MySQL 연결과 JPA 스키마 검증도 통과했습니다. 실제 MySQL에서는 스키마 변경이나 미션 도서 등록을 하지 않았습니다.

[Spring Boot 외부 설정 참고](https://docs.spring.io/spring-boot/3.5/reference/features/external-config.html)
