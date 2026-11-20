# 8주차 워크북 및 실습 프로젝트 (Week 8)

## 📌 구성 안내

- 📄 [`8주차 - 서비스의 핵심 기능 만들기.md`](./8주차%20-%20서비스의%20핵심%20기능%20만들기.md) (백엔드 워크북)
- 📄 [`8주차 - TanStack Query로 서버에 데이터 요청하기.md`](./8주차%20-%20TanStack%20Query로%20서버에%20데이터%20요청하기.md) (프론트엔드 워크북)
- 📁 [`spring/`](./spring) (Spring Boot 3.5 + JPA + 트랜잭션(@Transactional) + 즐겨찾기 & 영화기록 백엔드)

---

## 🚀 백엔드 (`spring`) 실행 및 테스트 방법

### 1. 서버 구동
```bash
cd hoon/week8/spring
./gradlew.bat bootRun
```
*(H2 인메모리 프로파일 실행 시: `./gradlew.bat bootRun --args='--spring.profiles.active=local'`)*

### 2. 시나리오 자동 검증 스크립트 실행
서버가 뜬 상태에서 새 터미널을 열고 아래 스크립트를 실행하면 10단계 전체 시나리오를 한 번에 검증할 수 있습니다:
```powershell
cd hoon/week8/spring
.\test-api.ps1
```

---

## ✨ 핵심 구현 내용

### 1. 즐겨찾기(Favorite) 도메인 구축
- **`Favorite` 엔티티**: `member_id`와 `movie_id`를 복합 UNIQUE 제약(`uk_favorite_member_movie`)으로 묶어 DB 레벨에서 중복 방지
- **`FavoriteRepository`**:
  - `existsByMember_MemberIdAndMovieId`: 등록 전 사전 중복 검사 (`FAVORITE409_1`)
  - `findByMember_MemberIdOrderByFavoriteIdDesc`: 최신순 목록 조회
  - `findByMember_MemberIdAndMovieId`: 단건 여부 조회 및 삭제 대상 엔티티 조회

### 2. 즐겨찾기 API 완성 (`FavoriteController`)
- `POST /favorites`: 토큰에서 추출한 회원 정보로 등록 (`201 Created`)
- `GET /favorites`: 본인의 즐겨찾기 목록 최신순 조회 (`200 OK`)
- `GET /favorites/{movieId}`: 영화별 즐겨찾기 등록 여부 boolean 반환 (`200 OK`)
- `DELETE /favorites/{movieId}`: 즐겨찾기 해제 (`200 OK`, `result: null`)

### 3. 트랜잭션 기반 영화 기록 API (`MovieRecordService`)
- `POST /movie-records`:
  - 하나의 서비스 메서드에 `@Transactional`을 적용하여 평점 등록(`Rating`)과 즐겨찾기 등록(`Favorite`)을 단일 트랜잭션으로 묶음
  - 둘 중 하나라도 오류가 발생할 경우 자동 롤백되어 데이터 불일치(Inconsistency) 원천 차단
