USE umc_week02;

-- 미션 1. 문학 카테고리의 대여 가능한 도서를 최신순으로 10개 조회한다.
-- 기준 테이블은 book이다. 카테고리 이름은 category에 있어서 book.category_id로 JOIN했다.
-- 카테고리 이름이 문학이고 대여 가능한 책만 남기고, book_id 내림차순으로 10개만 가져온다.
SELECT b.title, b.description, c.name AS category_name
FROM book b
JOIN category c ON b.category_id = c.category_id
WHERE c.name = '문학'
  AND b.is_available = TRUE
ORDER BY b.book_id DESC
LIMIT 10;

-- 미션 2. 1번 사용자가 아직 반납하지 않은 책을 반납 예정일 순으로 조회한다.
-- 기준 테이블은 rental이다. 책 제목은 book에 있어서 rental.book_id로 JOIN했다.
-- 사용자가 1번이고 returned_at이 NULL인 대여만 남기고, due_at 오름차순으로 정렬한다.
SELECT b.title, r.rented_at, r.due_at
FROM rental r
JOIN book b ON r.book_id = b.book_id
WHERE r.user_id = 1
  AND r.returned_at IS NULL
ORDER BY r.due_at ASC;

-- 미션 3. 1번 책의 태그 목록과 1번 사용자의 좋아요 여부를 조회한다.
-- 기준 테이블은 book이다. 태그는 N:M 관계라 book_tag를 거쳐 tag까지 JOIN했다.
-- 좋아요는 없을 수도 있어서 book_like를 LEFT JOIN하고, 행이 있으면 1 없으면 0으로 보여준다.
-- 책은 book_id 1번으로 좁히고 태그는 tag_id 순으로 정렬한다.
SELECT b.title, t.name AS tag_name, bl.user_id IS NOT NULL AS is_liked
FROM book b
JOIN book_tag bt ON b.book_id = bt.book_id
JOIN tag t ON bt.tag_id = t.tag_id
LEFT JOIN book_like bl ON b.book_id = bl.book_id AND bl.user_id = 1
WHERE b.book_id = 1
ORDER BY t.tag_id ASC;
