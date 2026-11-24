package com.umc.study.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class BookRepository {

    private final JdbcTemplate jdbcTemplate;

    public BookRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>> findByCategoryId(long categoryId) {
        String sql = """
                SELECT
                    book_id AS bookId,
                    category_id AS categoryId,
                    title,
                    description,
                    is_available AS isAvailable
                FROM book
                WHERE category_id = ?
                ORDER BY book_id DESC
                """;

        return jdbcTemplate.queryForList(sql, categoryId);
    }
}
