# 7주차 API 명세 (Spring Boot)

응답 형식은 6주차와 같다 (`isSuccess, code, message, result`).
🔒 표시 API는 `Authorization: Bearer {accessToken}` 헤더가 필요하다.

## 실행 환경 변수

```
JWT_SECRET=umc-11th-movie-rating-secret-key-please-change-me   # 32자 이상, 필수
JWT_ACCESS_EXPIRATION=3600                                      # 초, 생략 시 3600
```

## 엔드포인트

| 기능 | Method | 경로 | 성공 | 비고 |
|---|---|---|---|---|
| 회원가입 | POST | /members | 201 | 6주차 그대로 |
| 로그인 | POST | /auth/login | 200 | 신규 (5주차 /members/login 제거) |
| 내 정보 조회 🔒 | GET | /members/me | 200 | 신규 |
| 내 정보 수정 🔒 | PATCH | /members/me | 200 | 신규, body: nickname |
| 평점 등록 🔒 | POST | /ratings | 201 | memberId → 토큰 |
| 평점 수정 🔒 | PATCH | /ratings/{ratingId} | 200 | memberId → 토큰 |
| 평점 삭제 🔒 | DELETE | /ratings/{ratingId} | 200 | 204 → 200 + result null |
| 유저별 평점 조회 | GET | /members/{memberId}/ratings | 200 | 공개 |

```
POST /auth/login       { "email": "a@umc.com", "password": "Umc1234!" }
→ result: { "nickname": "영화광", "accessToken": "eyJ..." }

GET /members/me
→ result: { "email": "a@umc.com", "nickname": "영화광", "createdAt": "2026-10-30T10:00:00" }

PATCH /members/me      { "nickname": "새닉네임" }   (내가 쓰는 닉네임은 중복 아님)
→ result: 내 정보 조회와 동일
```

## 오류 코드 (7주차 추가·변경)

| HTTP | code | 상황 |
|---|---|---|
| 401 | AUTH401_1 | 이메일 또는 비밀번호 틀림 |
| 401 | AUTH401_2 | 토큰 없음 / Bearer 형식 아님 |
| 401 | AUTH401_3 | 위조·형식 오류 토큰 |
| 401 | AUTH401_4 | 만료된 토큰 |
| 403 | RATING403_1 | 다른 회원의 평점 수정/삭제 |
| 404 | MEMBER404_1 | 회원 없음 |
| 404 | RATING404_1 | 평점 없음 |
| 409 | MEMBER409_1 | 닉네임 중복 (가입/수정) |
| 409 | MEMBER409_2 | 이메일 중복 |
| 409 | RATING409_1 | 같은 영화 중복 평점 |

COMMON4001~4003, COMMON4091, COMMON500은 6주차와 같다.

## 구조

- `AuthFilter` (OncePerRequestFilter): Authorization 헤더가 있으면 토큰을 해석해 memberId를, 실패하면 실패 사유(AUTH401_3/4)를 request attribute에 담는다. 요청은 막지 않는다.
- `@LoginRequired` + `AuthAspect`: 로그인이 필요한 컨트롤러 메서드에 붙인다. 메서드 실행 전에 attribute를 확인해 401(AUTH401_2/3/4)을 던진다.
- `@LoginMember` + `LoginMemberArgumentResolver` (선택 미션): 컨트롤러가 로그인 회원 id를 파라미터로 받는다.
- `JwtProvider`: `@Value`로 jwt.secret, jwt.access-expiration 주입. subject에 memberId, HS256 서명

## 확인 순서 (워크북 9단계)

1. 회원가입 A(a@umc.com), B(b@umc.com)
2. 각각 로그인 → 토큰 A, 토큰 B
3. 토큰 A로 POST /ratings → 201 COMMON201, result.ratingId
4. 같은 movieId 재등록 → 409 RATING409_1
5. 토큰 A로 PATCH /ratings/{ratingId} → 200
6. 토큰 B로 같은 PATCH → 403 RATING403_1
7. 헤더 없이 같은 PATCH → 401 AUTH401_2
8. 토큰 A로 DELETE /ratings/99999 → 404 RATING404_1
9. 토큰 A로 DELETE /ratings/{ratingId} → 200 COMMON200

선택: `JWT_ACCESS_EXPIRATION=60`으로 재시작 → 로그인 1분 후 호출 시 401 AUTH401_4
