# 백엔드 API 테스트 프론트

UMCine과 별도로 Spring Boot 회원·평점 API 세 개를 실제 브라우저에서 검증하기 위한 화면입니다.

## 실행

먼저 `movie-rating-api` 백엔드를 실행한 뒤 이 폴더에서 실행합니다.

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5174`를 엽니다. 각 카드의 `요청 보내기` 또는 `전체 API 실행`을 누르면 요청 URL, 상태 코드와 JSON 응답이 표시됩니다.

## 기본 테스트 값

| 기능 | 입력값 | 예상 결과 |
| --- | --- | --- |
| 닉네임 중복 확인 | `수현` | `{ "available": false }` |
| 닉네임 사용 가능 확인 | `지민` | `{ "available": true }` |
| 이메일 중복 확인 | `noco@umc.com` | `{ "available": false }` |
| 이메일 사용 가능 확인 | `new@umc.com` | `{ "available": true }` |
| 회원별 평점 조회 | `1` | 평점 2건 배열 |
| 없는 회원 확인 | `999` | `404 Not Found` |

## Postman 캡처용 요청

```text
GET http://localhost:8080/members/nickname/수현
GET http://localhost:8080/members/email/noco@umc.com
GET http://localhost:8080/members/1/ratings
GET http://localhost:8080/members/999/ratings
```

Postman 캡처에는 Method, 전체 URL, 상태 코드와 응답 Body가 한 화면에 보이게 합니다. 브라우저 캡처에는 결과가 표시된 카드와 Network 패널의 요청을 함께 포함합니다.
