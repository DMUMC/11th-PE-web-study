# API 명세

기본 URL: `http://localhost:8082`. 쓰기 요청의 Content-Type: `application/json`.

| 기능 | Method | 경로 | 성공 |
|---|---|---|---|
| 회원가입 | POST | `/members` | 201 |
| 평점 등록 | POST | `/members/{memberId}/ratings` | 201 |
| 평점 수정 | PATCH | `/members/{memberId}/ratings/{ratingId}` | 200 |
| 평점 삭제 | DELETE | `/members/{memberId}/ratings/{ratingId}` | 204, 본문 없음 |
| 회원 평점 조회 | GET | `/members/{memberId}/ratings` | 200 |
| 이메일 중복 확인 | GET | `/members/email/{email}` | 200 |
| 닉네임 중복 확인 | GET | `/members/nickname/{nickname}` | 200 |

## 요청

회원가입:
```json
{"email":"umc@example.com","nickname":"moviefan","password":"Umc!1234"}
```

email은 필수 이메일 형식(최대 254자), nickname은 공백만으로 구성할 수 없으며 2~12자입니다. password는 공백 없이 8자 이상이고 영문 대·소문자, 숫자, 특수문자를 모두 포함하며 UTF-8 72바이트 이하입니다. 비밀번호는 해시만 저장합니다.

평점 등록:
```json
{"movieId":550,"score":5,"comment":"좋은 영화였습니다."}
```

movieId는 양의 정수인 TMDB ID입니다. 외부 TMDB 존재 조회나 로컬 movie 테이블 참조는 하지 않습니다. score는 필수 정수 1~5, comment는 선택이며 최대 500자입니다.

평점 수정:
```json
{"score":4,"comment":"수정한 후기입니다."}
```

score는 필수입니다. movieId와 소유자는 바꿀 수 없습니다. comment 생략/null은 후기를 비웁니다. 삭제 요청은 본문이 없습니다.

## 공통 응답

회원가입 성공 예시(ID는 실행마다 다릅니다):
```json
{"isSuccess":true,"code":"COMMON201","message":"회원가입에 성공했습니다.","result":{"memberId":1,"email":"umc@example.com","nickname":"moviefan"}}
```

평점 응답 result에는 ratingId, movieId, score, comment, createdAt, updatedAt이 들어갑니다. 목록 조회 result는 배열이며 평점이 없으면 `[]`입니다. 이메일·닉네임 확인 result는 `{"available":true}` 또는 `false`입니다.

실패 예시:
```json
{"isSuccess":false,"code":"MEMBER4091","message":"이미 사용 중인 이메일입니다.","result":null}
```

| 상태 | code | 상황 |
|---|---|---|
| 400 | COMMON400 | DTO 검증 실패, JSON 파싱 실패, 소수 입력, 잘못된 경로 타입 |
| 403 | RATING403 | 다른 회원 ID로 기존 평점 수정·삭제 |
| 404 | MEMBER404 | 평점 등록 대상 회원 없음 |
| 404 | COMMON404 | 조회 대상 회원 없음 |
| 404 | RATING404 | 수정·삭제 대상 평점 없음 |
| 409 | MEMBER4091 | 이메일 중복 |
| 409 | MEMBER4092 | 닉네임 중복 |
| 409 | RATING409 | 동일 회원·영화의 평점 중복 |
| 409 | COMMON409 | 동시 요청 등으로 발생한 DB 제약 충돌 |

수정·삭제는 먼저 평점 존재 여부(404)를 확인한 다음 소유자(403)를 비교합니다. DB 오류 세부 내용이나 거절된 비밀번호 값은 오류 응답에 노출하지 않습니다.
