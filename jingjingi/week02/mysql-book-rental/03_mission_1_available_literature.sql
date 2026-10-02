USE umc_study;

-- 문학 카테고리의 대여 가능한 도서를 최신순으로 최대 10개 조회합니다.
SELECT
    b.title AS book_title,
    b.description,
    c.name AS category_name
FROM book AS b
JOIN category AS c ON b.category_id = c.category_id
WHERE c.name = '문학'
  AND b.is_available = TRUE
ORDER BY b.book_id DESC
LIMIT 10;
