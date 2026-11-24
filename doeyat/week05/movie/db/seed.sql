-- Optional demo data for a fresh local practice database.
-- The dummy password is not a usable login credential; login is not implemented.
USE umc_movie;

INSERT INTO member (member_id, email, password, nickname, created_at, updated_at)
VALUES (1, 'doeyat@umc.com', 'dummy', '도얏', NOW(6), NOW(6)),
       (2, 'minseo@umc.com', 'dummy', '민서', NOW(6), NOW(6));

INSERT INTO rating (member_id, movie_id, score, comment, created_at, updated_at)
VALUES (1, 550, 5, '최고의 영화!', NOW(6), NOW(6)),
       (1, 155, 4, '다시 봐도 명작', NOW(6), NOW(6)),
       (2, 550, 3, '호불호가 갈릴 것 같아요', NOW(6), NOW(6));
