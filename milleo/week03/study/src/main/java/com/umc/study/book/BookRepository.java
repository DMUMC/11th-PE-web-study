package com.umc.study.book;

import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class BookRepository {
    private final JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> findByCategoryId(long categoryId) {
        return jdbcTemplate.queryForList(
                "SELECT * FROM book WHERE category_id = ? ORDER BY book_id", categoryId);
    }
}
