USE umc_study;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE notification;
TRUNCATE TABLE book_like;
TRUNCATE TABLE book_tag;
TRUNCATE TABLE rental;
TRUNCATE TABLE tag;
TRUNCATE TABLE book;
TRUNCATE TABLE category;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO users (nickname) VALUES ('민서'), ('수현');
INSERT INTO category (name) VALUES ('문학'), ('과학');

INSERT INTO book (category_id, title, description, is_available) VALUES
    (1, '달빛 도서관', '소설', TRUE),
    (1, '겨울의 편지', '에세이', FALSE),
    (2, '우주를 읽는 법', '과학 교양', TRUE);

INSERT INTO rental (user_id, book_id, rented_at, due_at, returned_at) VALUES
    (1, 2, '2026-08-10 10:00:00', '2026-08-17 10:00:00', NULL),
    (2, 1, '2026-08-01 10:00:00', '2026-08-08 10:00:00', '2026-08-07 15:00:00');

INSERT INTO tag (name) VALUES ('소설'), ('추천'), ('과학');
INSERT INTO book_tag (book_id, tag_id) VALUES (1, 1), (1, 2), (3, 3);
INSERT INTO book_like (user_id, book_id) VALUES (1, 1), (1, 3);
INSERT INTO notification (user_id, type) VALUES (1, 'RENTAL_DUE'), (2, 'BOOK_AVAILABLE');
