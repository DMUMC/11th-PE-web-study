package com.umc.study.rental;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.Map;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class RentalRepository {
    private final JdbcTemplate jdbcTemplate;

    public Map<String, Object> create(long userId, long bookId) {
        var keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(
                    "INSERT INTO rental (user_id, book_id, rented_at, due_at, returned_at) "
                            + "VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), NULL)",
                    Statement.RETURN_GENERATED_KEYS);
            statement.setLong(1, userId);
            statement.setLong(2, bookId);
            return statement;
        }, keyHolder);
        long rentalId = Objects.requireNonNull(keyHolder.getKey()).longValue();
        return jdbcTemplate.queryForMap("SELECT * FROM rental WHERE rental_id = ?", rentalId);
    }
}
