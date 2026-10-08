package com.umc.study.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.Map;

@Repository
public class RentalRepository {

    private final JdbcTemplate jdbcTemplate;

    public RentalRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Map<String, Object> save(long userId, long bookId) {
        String insertSql = """
                INSERT INTO rental (user_id, book_id, rented_at, due_at, returned_at)
                VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), NULL)
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(
                    insertSql,
                    Statement.RETURN_GENERATED_KEYS
            );
            statement.setLong(1, userId);
            statement.setLong(2, bookId);
            return statement;
        }, keyHolder);

        Number generatedId = keyHolder.getKey();
        if (generatedId == null) {
            throw new IllegalStateException("생성된 대여 ID를 확인할 수 없습니다.");
        }

        String selectSql = """
                SELECT
                    rental_id AS rentalId,
                    user_id AS userId,
                    book_id AS bookId,
                    rented_at AS rentedAt,
                    due_at AS dueAt,
                    returned_at AS returnedAt
                FROM rental
                WHERE rental_id = ?
                """;

        return jdbcTemplate.queryForMap(selectSql, generatedId.longValue());
    }
}
