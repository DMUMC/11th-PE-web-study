-- 먼저 08_extension_schema_and_seed.sql을 실행합니다.

USE umc_study;

SET @member_id = 1;

-- 특정 회원이 수행 중인 미션을 만료일이 가까운 순서로 최대 10개 조회합니다.
SELECT
    s.name AS store_name,
    m.name AS mission_name,
    mm.progress,
    m.task_count,
    m.reward,
    m.expired_at
FROM member_mission AS mm
JOIN mission AS m ON mm.mission_id = m.id
JOIN store AS s ON m.store_id = s.id
WHERE mm.member_id = @member_id
  AND mm.status = 'progress'
ORDER BY m.expired_at ASC, mm.id ASC
LIMIT 10;
