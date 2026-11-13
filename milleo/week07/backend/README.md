# UMCine 7주차 Backend

6주차 회원가입·평점 코드를 확장하여 JWT 로그인, 내 정보 조회·수정, 평점 작성자 권한 검증을 구현했습니다.

## 실행

Java 21 / MySQL이 필요합니다.

```sh
cp .env.example .env
# DB 접속 정보와 무작위 JWT_SECRET(최소 32바이트)을 입력합니다.
./gradlew test bootJar
java -jar build/libs/movie-week07-0.0.1-SNAPSHOT.jar
```

기존 DB에는 sql/02-profile.sql을 한 번 적용하고, 신규 DB는 sql/01-schema.sql을 사용합니다.
기본 포트는 8083이며 프론트는 Vite /api 프록시로 연결합니다.
비밀번호는 BCrypt로 비교하고, HS256 액세스 토큰은 기본 1시간 만료입니다.
보호 API는 Authorization: Bearer 헤더의 서명·만료를 검증한 뒤 memberId를 사용합니다.
평점 수정·삭제는 DB의 작성자와 추가 비교합니다. OPTIONS 사전 요청은 인증 대상에서 제외합니다.
JWT_SECRET과 DB 비밀번호, 실제 토큰은 Git에 저장하지 않습니다.
프론트 로그아웃은 탭의 토큰을 지우며, 이미 발급한 JWT의 서버 무효화는 이번 필수 미션 범위에 포함하지 않습니다.

요청 예시는 requests/week07.http, 검증 결과는 docs/검증결과.md를 참고하세요.
