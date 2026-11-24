package com.umc.study.repository;

import com.umc.study.entity.Book;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

	// 카테고리를 한 번에 같이 읽어 도서마다 쿼리가 따로 나가지 않게 한다.
	@EntityGraph(attributePaths = "category")
	List<Book> findAllByOrderByBookIdDesc();
}
