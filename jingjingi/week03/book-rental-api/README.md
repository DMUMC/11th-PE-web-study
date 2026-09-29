# 3주차 도서 대여 API

Spring Boot와 JdbcTemplate의 Raw SQL로 구현한 3계층 API입니다.

## 사전 준비

MySQL Workbench에서 다음 파일을 실행합니다.

1. `../../week02/mysql-book-rental/01_schema.sql`
2. `../../week02/mysql-book-rental/02_seed.sql`

## 실행

프로젝트 루트의 `.env` 파일에 본인의 MySQL 접속 정보를 입력합니다.

```properties
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=본인의 MySQL 사용자명
DB_PASSWORD=본인의 MySQL 비밀번호
```

스키마 이름은 프로젝트 전체에서 `umc_study` 하나로 고정되어 있으므로 `.env`에 스키마 이름을 입력하지 않습니다.

```powershell
$env:JAVA_HOME='C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot'
.\gradlew.bat bootRun
```

## GET 카테고리별 도서 목록

- Method: `GET`
- URL: `http://localhost:8080/books/category/1`
- 성공 상태: `200 OK`

```json
[
  {
    "bookId": 2,
    "categoryId": 1,
    "title": "겨울의 편지",
    "description": "에세이",
    "isAvailable": false
  },
  {
    "bookId": 1,
    "categoryId": 1,
    "title": "달빛 도서관",
    "description": "소설",
    "isAvailable": true
  }
]
```

## POST 신규 대여 기록

- Method: `POST`
- URL: `http://localhost:8080/rentals`
- Header: `Content-Type: application/json`
- 성공 상태: `201 Created`

```json
{
  "userId": 1,
  "bookId": 1
}
```

응답의 `rentedAt`은 현재 시각, `dueAt`은 그 시각으로부터 7일 뒤입니다.

## 핵심 SQL

```sql
SELECT book_id, category_id, title, description, is_available
FROM book
WHERE category_id = ?
ORDER BY book_id DESC;

INSERT INTO rental (user_id, book_id, rented_at, due_at, returned_at)
VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), NULL);
```

두 쿼리 모두 사용자 입력을 문자열로 이어 붙이지 않고 `?`에 바인딩합니다.

## 트러블슈팅

- 실행 버튼이 비활성화됨: Workbench에서 먼저 로컬 MySQL 연결을 엽니다.
- `Unknown database 'umc_study'`: 2주차의 `01_schema.sql`을 먼저 실행합니다.
- `Access denied for user`: `DB_USERNAME`과 `DB_PASSWORD`를 확인합니다.
- FK 오류: 요청한 `userId`, `bookId`가 실제 더미 데이터에 존재하는지 확인합니다.
- 8080 포트 충돌: 실행 시 `--args='--server.port=8081'`을 추가하고 Postman URL도 변경합니다.
