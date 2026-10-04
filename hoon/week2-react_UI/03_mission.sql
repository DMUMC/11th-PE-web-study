-- 미션 1. 문학 카테고리의 대여 가능한 도서를 최신순으로 10개 조회합니다.
-- 기준 테이블: book
-- JOIN 이유: 카테고리의 이름('문학')을 조건으로 사용하고 결과에 포함하기 위해 category 테이블 조인
-- WHERE 조건: category.name = '문학' AND book.is_available = TRUE
-- 정렬/범위: 최신순(book_id 내림차순), LIMIT 10
SELECT 
    b.title, 
    b.description, 
    c.name AS category_name
FROM book b
JOIN category c ON b.category_id = c.category_id
WHERE c.name = '문학' AND b.is_available = TRUE
ORDER BY b.book_id DESC
LIMIT 10;

-- 미션 2. 특정 사용자가 아직 반납하지 않은 책을 반납 예정일 순으로 조회합니다. (예: user_id = 1)
-- 기준 테이블: rental
-- JOIN 이유: 대여 내역에 해당하는 책의 제목(title)을 결과에 포함하기 위해 book 테이블 조인
-- WHERE 조건: 특정 사용자(user_id = 1) AND 반납 안함(returned_at IS NULL)
-- 정렬/범위: 반납 예정일(due_at) 오름차순
SELECT 
    b.title, 
    r.rented_at, 
    r.due_at
FROM rental r
JOIN book b ON r.book_id = b.book_id
WHERE r.user_id = 1 AND r.returned_at IS NULL
ORDER BY r.due_at ASC;

-- 미션 3. 특정 책의 태그 목록과 특정 사용자의 좋아요 여부를 조회합니다. (예: book_id = 1, user_id = 1)
-- 기준 테이블: book
-- JOIN 이유: 태그 이름을 가져오기 위해 book_tag, tag 조인. 현재 사용자의 좋아요 여부를 가져오기 위해 book_like를 LEFT JOIN으로 조인 (좋아요 안 눌렀을 수도 있으므로)
-- WHERE 조건: 특정 책 (book_id = 1)
-- 정렬/범위: 없음
SELECT 
    b.title, 
    t.name AS tag_name, 
    IF(bl.user_id IS NOT NULL, 'O', 'X') AS is_liked
FROM book b
LEFT JOIN book_tag bt ON b.book_id = bt.book_id
LEFT JOIN tag t ON bt.tag_id = t.tag_id
LEFT JOIN book_like bl ON b.book_id = bl.book_id AND bl.user_id = 1
WHERE b.book_id = 1;
