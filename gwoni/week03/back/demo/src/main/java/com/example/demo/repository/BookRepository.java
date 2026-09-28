package com.example.demo.repository;

import com.example.demo.domain.Book;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class BookRepository {
    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<Book> bookRowMapper = (rs, rowNum) -> new Book(
            rs.getLong("book_id"),
            rs.getLong("category_id"),
            rs.getString("title"),
            rs.getString("description"),
            rs.getBoolean("is_available")
    );

    public List<Book> findAll() {
        String sql = "SELECT * FROM book";

        return jdbcTemplate.query(sql, bookRowMapper);
    }

    public List<Book> findByCategoryId(Long categoryId) {
        String sql = "SELECT * FROM book WHERE category_id = ?";

        return jdbcTemplate.query(sql, bookRowMapper, categoryId);
    }

    public void save(Book book){
        String sql = "INSERT INTO book (category_id, title, description, is_available) VALUES (?, ?, ?, true)";

        jdbcTemplate.update(
                sql,
                book.getCategoryId(),
                book.getTitle(),
                book.getDescription()
        );
    }
}
