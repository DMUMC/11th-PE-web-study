# 온라인 도서 대여 SQL 실습

MySQL Workbench에서 다음 순서로 실행합니다.

## 공통 실습

1. `01_schema.sql`
2. `02_seed.sql`
3. `06_verify_common_results.sql`
4. `03_mission_1_available_literature.sql`
5. `04_mission_2_active_rentals.sql`
6. `05_mission_3_tags_and_like.sql`

## 1주차 ERD 확장 실습

1. `08_extension_schema_and_seed.sql`로 확장 실습용 테이블과 더미 데이터를 준비합니다.
2. `07_extension_member_missions.sql`로 회원의 진행 중인 미션을 조회합니다.

`02_seed.sql`과 `08_extension_schema_and_seed.sql`은 기존 실습 데이터를 초기화하므로 반복 실행해도 같은 ID와 결과를 얻습니다.

미션 2와 3의 `@user_id`, 미션 3의 `@book_id`, 확장 쿼리의 `@member_id`를 바꾸면 다른 데이터도 확인할 수 있습니다.

도서 대여 테이블과 확장 미션 테이블은 프로젝트 공통 umc_study 스키마 하나에 생성됩니다.
