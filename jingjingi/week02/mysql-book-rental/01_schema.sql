CREATE DATABASE IF NOT EXISTS umc_study CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE umc_study;

CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nickname VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS category (
    category_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS book (
    book_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_book_category FOREIGN KEY (category_id) REFERENCES category(category_id)
);

CREATE TABLE IF NOT EXISTS rental (
    rental_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    rented_at DATETIME NOT NULL,
    due_at DATETIME NOT NULL,
    returned_at DATETIME NULL,
    CONSTRAINT fk_rental_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_rental_book FOREIGN KEY (book_id) REFERENCES book(book_id)
);

CREATE TABLE IF NOT EXISTS tag (
    tag_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS book_tag (
    book_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    PRIMARY KEY (book_id, tag_id),
    CONSTRAINT fk_book_tag_book FOREIGN KEY (book_id) REFERENCES book(book_id),
    CONSTRAINT fk_book_tag_tag FOREIGN KEY (tag_id) REFERENCES tag(tag_id)
);

CREATE TABLE IF NOT EXISTS book_like (
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, book_id),
    CONSTRAINT fk_book_like_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_book_like_book FOREIGN KEY (book_id) REFERENCES book(book_id)
);

CREATE TABLE IF NOT EXISTS notification (
    notification_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    type VARCHAR(30) NOT NULL,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);
