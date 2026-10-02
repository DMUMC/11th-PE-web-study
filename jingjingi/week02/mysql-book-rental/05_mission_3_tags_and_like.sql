USE umc_study;

SET @book_id = 1;
SET @user_id = 1;

-- 특정 책의 태그 목록과 특정 사용자의 좋아요 여부를 조회합니다.
SELECT
    b.title AS book_title,
    t.name AS tag_name,
    CASE WHEN bl.user_id IS NULL THEN FALSE ELSE TRUE END AS is_liked
FROM book AS b
JOIN book_tag AS bt ON b.book_id = bt.book_id
JOIN tag AS t ON bt.tag_id = t.tag_id
LEFT JOIN book_like AS bl
    ON b.book_id = bl.book_id
   AND bl.user_id = @user_id
WHERE b.book_id = @book_id
ORDER BY t.tag_id ASC;
