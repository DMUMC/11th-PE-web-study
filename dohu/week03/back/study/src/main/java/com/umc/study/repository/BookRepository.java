package com.umc.study.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class BookRepository {

	private final JdbcTemplate jdbcTemplate;

	public List<Map<String, Object>> findAll() {
		String sql = "SELECT * FROM book";

		return jdbcTemplate.queryForList(sql);
	}

	// 카테고리 하나에 속한 책만 조회한다. 값은 ? 자리에 바인딩한다.
	public List<Map<String, Object>> findByCategoryId(Long categoryId) {
		String sql = "SELECT * FROM book WHERE category_id = ?";

		return jdbcTemplate.queryForList(sql, categoryId);
	}

	public void save(Map<String, Object> body) {
		// book_id는 AUTO_INCREMENT라 적지 않고, is_available은 true로 넣는다.
		String sql = "INSERT INTO book (category_id, title, description, is_available) VALUES (?, ?, ?, true)";

		jdbcTemplate.update(
				sql,
				body.get("categoryId"),
				body.get("title"),
				body.get("description")
		);
	}
}
