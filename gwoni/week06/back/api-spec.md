# 6주차 API 명세 (Spring Boot)

모든 쓰기 API와 모든 실패 응답은 아래 형식을 사용한다.

```json
{ "isSuccess": true, "code": "COMMON201", "message": "...", "result": { } }
{ "isSuccess": false, "code": "MEMBER4091", "message": "...", "result": null }
```

## 엔드포인트

| 기능 | Method | 경로 | 성공 |
|---|---|---|---|
| 회원가입 | POST | /members | 201 |
| 평점 등록 | POST | /members/{memberId}/ratings | 201 |
| 평점 수정 | PATCH | /members/{memberId}/ratings/{ratingId} | 200 |
| 평점 삭제 | DELETE | /members/{memberId}/ratings/{ratingId} | 204 (본문 없음) |
| 유저별 평점 조회 (5주차) | GET | /members/{memberId}/ratings | 200 |

### POST /members
```json
{ "email": "umc@example.com", "password": "Umc1234!", "nickname": "moviefan" }
```
- email, password, nickname: 필수 (password는 bcrypt 해시로 저장)

응답 `result`: `{ "memberId": 1, "email": "umc@example.com", "nickname": "moviefan" }` (password 없음)

### POST /members/{memberId}/ratings
```json
{ "movieId": 550, "score": 5, "comment": "최고" }
```
- movieId, score: 필수 / comment: 선택

응답 `result`: `{ "ratingId": 1 }`

### PATCH /members/{memberId}/ratings/{ratingId}
```json
{ "score": 3, "comment": "다시 보니 보통" }
```
응답 `result`: 수정된 평점 (`ratingId, movieId, score, comment, createdAt, updatedAt`)

## 오류 코드

| HTTP | code | 상황 |
|---|---|---|
| 400 | COMMON4001 | 필수 값 누락 (message에 필드별 문구) |
| 400 | COMMON4002 | JSON 형식 오류, 타입 불일치 (score: "abc") |
| 400 | COMMON4003 | 경로 변수 타입 불일치 (/members/abc/ratings) |
| 403 | RATING4031 | 다른 회원의 평점 수정/삭제 |
| 404 | MEMBER4041 | 존재하지 않는 회원 |
| 404 | RATING4041 | 존재하지 않는 평점 |
| 409 | MEMBER4091 | 이메일 중복 |
| 409 | MEMBER4092 | 닉네임 중복 |
| 409 | RATING4091 | 같은 영화 중복 평점 |
| 409 | COMMON4091 | 이름으로 구분되지 않는 DB 제약 위반 |
| 500 | COMMON500 | 처리되지 않은 서버 오류 |

## 중복 처리 (선택 미션)

1. 서비스에서 `existsBy...`로 먼저 확인 → MEMBER4091 / MEMBER4092 / RATING4091
2. 동시 요청이 1을 함께 통과하면 DB UNIQUE 제약(`uk_member_email`, `uk_member_nickname`, `uk_rating_member_movie`)에서 한쪽이 막힘
3. 이때 나는 `DataIntegrityViolationException`을 `GlobalExceptionHandler`가 제약 이름으로 구분해 1과 같은 code로 응답

5주차에 `@Column(unique = true)`로 만들어진 기존 DB는 UNIQUE 인덱스 이름이 자동 생성(UK_xxx)이라 2번에서 COMMON4091로 응답된다.
이름을 맞추려면 기존 인덱스를 지우고 서버를 재시작(ddl-auto: update가 새 이름으로 생성)하거나 테이블을 새로 만든다.

```sql
SHOW INDEX FROM member;                 -- 자동 생성된 UNIQUE 인덱스 이름 확인
ALTER TABLE member DROP INDEX <이름>;   -- email, nickname 각각
```

## 확인 순서

1. POST /members → 201, password 없음
2. 같은 email → 409 MEMBER4091 / 같은 nickname → 409 MEMBER4092 / 필수 값 누락 → 400 COMMON4001
3. POST 평점 → 201 ratingId / 같은 movieId 재등록 → 409 RATING4091
4. PATCH → 200, GET /members/{memberId}/ratings 로 반영 확인
5. DELETE → 204, 다시 조회해 사라졌는지 확인
6. 없는 ratingId로 PATCH/DELETE → 404 RATING4041 / 다른 memberId로 PATCH/DELETE → 403 RATING4031
