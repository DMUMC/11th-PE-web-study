# API

공통 응답: isSuccess, code, message, result.

| 메서드 | 경로 | 인증 | 설명 |
|---|---|---|---|
| POST | /members | 없음 | 회원가입 201 |
| GET | /members/email/{email} | 없음 | 이메일 중복 확인 |
| GET | /members/nickname/{nickname} | 없음 | 닉네임 중복 확인 |
| POST | /auth/login | 없음 | BCrypt 검증, accessToken/tokenType 반환 |
| GET | /members/me | Bearer | 현재 회원 조회 |
| PATCH | /members/me | Bearer | 닉네임 수정, email/introduction 선택 |
| GET | /members/{memberId}/ratings | 없음 | 공개 평점 목록 |
| POST | /ratings | Bearer | 본인 평점 등록 201 |
| PATCH | /ratings/{ratingId} | Bearer | 본인 평점 수정 200 |
| DELETE | /ratings/{ratingId} | Bearer | 본인 평점 삭제 200, result null |

쓰기 요청에서 memberId를 받지 않습니다. JWT의 sub에서 검증된 사용자 ID를 읽습니다.
인증 오류: 로그인 실패 AUTH401_1, 토큰 누락 AUTH401_2, 변조·형식 오류 AUTH401_3, 만료 AUTH401_4.
인가 오류: 다른 회원 평점 수정·삭제 RATING403_1.
존재하지 않는 평점 RATING404_1, 중복 평점 RATING409_1, 타인과 닉네임 중복 MEMBER409_1.
본인의 기존 닉네임을 그대로 저장하는 것은 허용합니다.
