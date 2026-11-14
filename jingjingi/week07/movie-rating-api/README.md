# 7주차 영화 평점 API - JWT 인증과 인가

6주차 회원가입·평점 API에 로그인과 JWT 인증을 추가했습니다. 평점 API는 URL의 `memberId`를 신뢰하지 않고, 검증된 Access Token의 회원 ID를 사용합니다.

## 실습 1~6 구현 내용

1. `POST /auth/login`: bcrypt 비밀번호 비교 및 JWT Access Token 발급
2. `AuthInterceptor`: `Authorization: Bearer {token}` 검증 및 `memberId` 주입
3. `GET /members/me`: 토큰 기준 내 정보 조회
4. `PATCH /members/me`: 내 닉네임 수정과 중복 검사
5. 평점 등록·수정·삭제 경로에서 `memberId` 제거
6. 평점 소유권 검증 및 401·40403·40404·40409 오류 코드 분리

## 실행 준비

`.env.example`을 `.env`로 복사하고 MySQL 비밀번호와 JWT 비밀키를 입력합니다. `JWT_SECRET`은 32자 이상으로 설정하고 실제 `.env`는 Git에 올리지 않습니다.

```properties
DB_HOST=localhost
DB_PORT=3306
DB_NAME=umc_movie
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
APP_CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
JWT_SECRET=CHANGE_TO_A_RANDOM_SECRET_AT_LEAST_32_CHARACTERS
JWT_ACCESS_EXPIRATION=3600
```

```powershell
$env:JAVA_HOME='C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot'
.\gradlew.bat bootRun
```

## API 명세

| 기능 | Method | URL | 인증 |
| --- | --- | --- | --- |
| 회원가입 | POST | `/members` | 불필요 |
| 로그인 | POST | `/auth/login` | 불필요 |
| 내 정보 조회 | GET | `/members/me` | Bearer Token |
| 내 정보 수정 | PATCH | `/members/me` | Bearer Token |
| 회원별 평점 조회 | GET | `/members/{memberId}/ratings` | 불필요 |
| 평점 등록 | POST | `/ratings` | Bearer Token |
| 평점 수정 | PATCH | `/ratings/{ratingId}` | Bearer Token |
| 평점 삭제 | DELETE | `/ratings/{ratingId}` | Bearer Token |

## Postman 9단계 시나리오

실제 MySQL 환경에서 아래 계정을 생성해 전체 시나리오를 확인했습니다.

- 회원 A: `week7a1110150459@umc.com` / `Umc!1234`
- 회원 B: `week7b1110150459@umc.com` / `Umc!1234`

1. A, B 회원가입: `201`, `201`
2. A, B 로그인: `200 COMMON200`, Access Token 각각 발급
3. A 토큰으로 평점 등록: `201 COMMON201`
4. 같은 영화에 중복 등록: `409 RATING409_1`
5. A 토큰으로 본인 평점 수정: `200 COMMON200`
6. B 토큰으로 A의 평점 수정: `403 RATING403_1`
7. Authorization 헤더 없이 요청: `401 AUTH401_2`
8. 존재하지 않는 평점 삭제: `404 RATING404_1`
9. A 토큰으로 본인 평점 삭제: `200 COMMON200`

### 평점 등록 바디

`memberId`는 포함하지 않습니다.

```json
{
  "movieId": 680,
  "score": 5,
  "comment": "다시 보고 싶은 영화예요."
}
```

## 제출 캡처 목록

| 파일 | 인증 내용 |
| --- | --- |
| `docs/screenshots/01-login-success.png` | `POST /auth/login`의 `200` 응답과 `result.accessToken` 확인 |
| `docs/screenshots/02-member-me-unauthorized.png` | 토큰 없이 `GET /members/me` 요청 시 `401`, `AUTH401_2` 확인 |
| `docs/screenshots/03-rating-forbidden.png` | B 토큰으로 A의 평점을 수정할 때 `403`, `RATING403_1` 확인 |
| `docs/screenshots/04-rating-created.png` | A 토큰으로 `POST /ratings` 요청 시 `201`, `COMMON201` 확인 |

## 자동 검증

```powershell
$env:JAVA_HOME='C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot'
.\gradlew.bat test
```

- 통합 테스트: 4개 성공, 실패 0개
- 9단계 시나리오를 하나의 테스트에서 순서대로 검증
- 무토큰 내 정보 401, 위조 JWT 401, 내 정보 조회·수정 추가 검증
