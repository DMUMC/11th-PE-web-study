# 8주차 API 명세 (Spring Boot)

응답 형식은 7주차와 같다 (`isSuccess, code, message, result`).
🔒 표시 API는 `Authorization: Bearer {accessToken}` 헤더가 필요하다. 요청 URL/바디 어디에도 memberId를 보내지 않는다 (토큰 subject에서 식별).

## 엔드포인트 (8주차 추가)

| 기능 | Method | 경로 | 요청 | 성공 |
|---|---|---|---|---|
| 즐겨찾기 등록 🔒 | POST | /favorites | Body: movieId | 201 COMMON201 |
| 내 즐겨찾기 조회 🔒 | GET | /favorites | - | 200 COMMON200 (최신 등록 순, 없으면 `[]`) |
| 즐겨찾기 여부 조회 🔒 | GET | /favorites/{movieId} | - | 200 COMMON200 (`isFavorite`) |
| 즐겨찾기 해제 🔒 | DELETE | /favorites/{movieId} | - | 200 COMMON200, result null |
| 영화 기록 저장 🔒 | POST | /movie-records | Body: movieId, score, comment, addToFavorites | 201 COMMON201 |

7주차 API(회원가입, 로그인, 내 정보 조회/수정, 평점 등록/수정/삭제, 유저별 평점 조회)는 그대로다.

```
POST /favorites            { "movieId": 550 }
→ result: { "favoriteId": 1, "movieId": 550, "createdAt": "2026-11-16T21:00:00" }

GET /favorites
→ result: [ { "favoriteId": 1, "movieId": 550, "createdAt": "..." } ]

GET /favorites/550
→ result: { "isFavorite": true }

DELETE /favorites/550
→ result: null

POST /movie-records        { "movieId": 238, "score": 5, "comment": "다시 보고 싶은 영화", "addToFavorites": true }
→ result: { "rating": { "ratingId": 3, "movieId": 238, "score": 5, ... }, "favorite": { "favoriteId": 2, ... } }
   (addToFavorites=false면 favorite: null)
```

## 오류 코드 (8주차 추가)

| HTTP | code | 상황 |
|---|---|---|
| 404 | FAVORITE404_1 | 해제하려는 즐겨찾기 없음 |
| 409 | FAVORITE409_1 | 같은 영화 중복 즐겨찾기 (사전 검사 + DB UNIQUE `uk_favorite_member_movie`) |
| 409 | RATING409_1 | 영화 기록 저장 시 이미 평점이 있음 (7주차 코드 재사용) |
| 400 | COMMON4001 | movieId 0/음수, score 1~5 범위 밖, 필수값 누락 |
| 401 | AUTH401_2/3/4 | 토큰 없음 / 위조 / 만료 |

## 구조

- `Favorite` (BaseTimeEntity 상속): member(ManyToOne), movieId(TMDB ID, FK 아님), `(member_id, movie_id)` 복합 UNIQUE
- `FavoriteController`: 클래스에 `@LoginRequired` → 모든 즐겨찾기 API 로그인 필요, `@LoginMember`로 memberId 주입
- `MovieRecordService.create()`: `@Transactional` 하나로 평점 저장 + 즐겨찾기 저장을 묶음. 중간에 런타임 예외가 나면 둘 다 rollback
- `GlobalExceptionHandler`: `uk_favorite_member_movie` 위반 → FAVORITE409_1

## 확인 순서 (워크북 실습 2~4)

1. 로그인 → 토큰
2. POST /favorites {movieId:550} → 201 / 같은 요청 → 409 FAVORITE409_1
3. GET /favorites → 1건 / GET /favorites/550 → isFavorite true
4. DELETE /favorites/550 → 200 / GET /favorites/550 → false / GET /favorites → []
5. POST /movie-records {movieId:238, addToFavorites:true} → rating, favorite 둘 다 채워짐
6. 같은 요청 → 409 RATING409_1, rating/favorite 테이블에 새 행 없음
7. 토큰 없이 POST /favorites → 401 AUTH401_2 / DELETE /favorites/99999 → 404 FAVORITE404_1 / movieId 0 → 400
