package com.umc.jindol.repository;

import com.umc.jindol.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findAllByOrderByBookIdDesc();

    List<Book> findAllByCategory_CategoryIdOrderByBookIdDesc(Long categoryId);
}
