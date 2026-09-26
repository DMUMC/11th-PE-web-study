package com.umc.jindol.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository // 대여 기록 창고지기
@RequiredArgsConstructor
public class RentalRepository {

    private final JdbcTemplate jdbcTemplate;

    public void save(Map<String, Object> body) {
        // rented_at은 현재 시간(NOW()), due_at은 7일 뒤(DATE_ADD)로 자동 계산
        String sql = "INSERT INTO rental (user_id, book_id, rented_at, due_at) " +
                "VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))";

        jdbcTemplate.update(
                sql,
                body.get("userId"),
                body.get("bookId")
        );
    }
}