CREATE DATABASE IF NOT EXISTS umc_study
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE umc_study;

CREATE TABLE IF NOT EXISTS members (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS store (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS mission (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    store_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    task_count INT NOT NULL,
    reward INT NOT NULL,
    expired_at DATE NOT NULL,
    CONSTRAINT fk_mission_store
        FOREIGN KEY (store_id) REFERENCES store(id)
);

CREATE TABLE IF NOT EXISTS member_mission (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    member_id BIGINT NOT NULL,
    mission_id BIGINT NOT NULL,
    status ENUM('complete', 'progress', 'fail') NOT NULL,
    progress INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_member_mission_member
        FOREIGN KEY (member_id) REFERENCES members(id),
    CONSTRAINT fk_member_mission_mission
        FOREIGN KEY (mission_id) REFERENCES mission(id)
);

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE member_mission;
TRUNCATE TABLE mission;
TRUNCATE TABLE store;
TRUNCATE TABLE members;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO members (name)
VALUES ('민서'), ('수현');

INSERT INTO store (name)
VALUES ('서울 맛집'), ('부산 카페');

INSERT INTO mission (store_id, name, task_count, reward, expired_at)
VALUES
    (1, '서울 맛집 방문하기', 3, 500, '2026-10-05'),
    (2, '부산 카페 리뷰 작성하기', 2, 300, '2026-10-10'),
    (1, '서울 맛집 사진 등록하기', 1, 200, '2026-09-30');

INSERT INTO member_mission (member_id, mission_id, status, progress)
VALUES
    (1, 1, 'progress', 1),
    (1, 2, 'progress', 0),
    (1, 3, 'complete', 1),
    (2, 1, 'progress', 2);

SELECT 'members' AS table_name, COUNT(*) AS row_count FROM members
UNION ALL SELECT 'store', COUNT(*) FROM store
UNION ALL SELECT 'mission', COUNT(*) FROM mission
UNION ALL SELECT 'member_mission', COUNT(*) FROM member_mission;
