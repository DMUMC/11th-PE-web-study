USE umc_study;

SET @user_id = 1;

-- 특정 사용자가 아직 반납하지 않은 책을 반납 예정일 순으로 조회합니다.
SELECT
    b.title AS book_title,
    r.rented_at,
    r.due_at
FROM rental AS r
JOIN book AS b ON r.book_id = b.book_id
WHERE r.user_id = @user_id
  AND r.returned_at IS NULL
ORDER BY r.due_at ASC, r.rental_id ASC;
