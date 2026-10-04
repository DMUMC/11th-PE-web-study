-- 확장. 내 1주차 ERD에서 화면 조회 요구사항 1개를 SQL로 옮긴다.
-- 요구사항: 로그인한 사용자가 진행 중인 미션을 가게 이름과 함께 최신순으로 10개 보여준다.
-- 기준 테이블은 user_missions다. 미션 제목은 missions에, 가게 이름은 stores에 있어서
-- user_missions.mission_id와 missions.store_id를 따라 JOIN했다.
-- 사용자가 1번이고 상태가 진행 중인 것만 남기고, 받은 시각 내림차순으로 10개만 가져온다.
SELECT m.title, s.name AS store_name, um.created_at
FROM user_missions um
JOIN missions m ON um.mission_id = m.id
JOIN stores s ON m.store_id = s.id
WHERE um.user_id = 1
  AND um.status = 'IN_PROGRESS'
ORDER BY um.created_at DESC
LIMIT 10;
