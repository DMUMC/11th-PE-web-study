# 밀러 · UMC 8주차 백엔드

7주차 JWT·평점 API를 확장한 즐겨찾기 및 영화 기록 API. Java 21 / Spring Boot 3.5.

## 구현
- POST /favorites: 등록 201, 중복 409 FAVORITE409_1
- GET /favorites: 내 목록 최신 등록순, 빈 목록 []
- GET /favorites/{movieId}: isFavorite true/false
- DELETE /favorites/{movieId}: 200 result:null, 미등록 404 FAVORITE404_1
- POST /movie-records: movieId, score(1~5), comment, addToFavorites 입력. true이면 평점·즐겨찾기를 같은 트랜잭션으로 저장.
- 모든 신규 API는 JWT 필수. 회원 ID는 토큰에서만 가져온다.
- Favorite의 (member_id,movie_id) UNIQUE 제약과 예외 변환으로 동시 중복 요청 방어.

## 실행·검증
Java 21을 JAVA_HOME으로 설정하고 `./gradlew test bootJar` 실행.
2026-11-22 전체 테스트 37개 통과, 실패 0. H2 MySQL 호환 모드에서 검증했으며 실제 MySQL 서버 검증은 별도이다.
`FavoriteIntegrationTest`는 CRUD, 회원별 격리, 인증, 입력 검증, 중복 및 동시성, 영화 기록 원자성/롤백을 검증한다.

로컬 데모: 임의의 충분히 긴 DEMO_JWT_SECRET 환경변수를 설정한 뒤
`java -jar build/libs/movie-week08-0.0.1-SNAPSHOT.jar --spring.profiles.active=demo`
주소는 http://127.0.0.1:8088. 인메모리 DB라 종료 시 데이터가 사라진다.
회원가입 및 로그인 후 얻은 accessToken을 Postman 변수에 직접 넣는다. 인증 값은 저장소에 넣지 않는다.

MySQL 사용: DB_URL, DB_USER, DB_PW, JWT_SECRET 환경변수 설정. 신규 DB는 sql/01-schema.sql 및 sql/03-favorite.sql을 적용한다. 기존 DB에는 필요한 migration만 적용한다. 기본 ddl-auto는 validate다.

## 트러블슈팅
- DTO에 없는 memberId는 엄격한 JSON 역직렬화로 400이 정상: 잘못된 성공 기대값을 수정.
- 공유 DB에 테스트 데이터가 남아 닉네임 충돌: @AfterEach에서 favorite→rating→member 순서로 정리.
- 신규 인증 경로 누락 방지: AuthConfig에 /favorites, /favorites/**, /movie-records 추가.
- 즐겨찾기 실패 시 평점까지 롤백하는 통합 테스트로 MovieRecordService의 @Transactional 경계 검증.

핵심 소스는 src/main/java/com/umc/movie의 entity/Favorite.java, service/FavoriteService.java, service/MovieRecordService.java, controller 및 config/AuthConfig.java에 있다.
