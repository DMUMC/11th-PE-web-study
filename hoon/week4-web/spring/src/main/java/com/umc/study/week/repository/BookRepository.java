package com.umc.study.week.repository;

import com.umc.study.week.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    @Query("SELECT b FROM Book b JOIN FETCH b.category ORDER BY b.bookId DESC")
    List<Book> findAllWithCategoryOrderByBookIdDesc();

    List<Book> findAllByOrderByBookIdDesc();

    @Query("SELECT b FROM Book b JOIN FETCH b.category WHERE b.title LIKE %:keyword% ORDER BY b.bookId DESC")
    List<Book> findByTitleContainingWithCategoryOrderByBookIdDesc(@Param("keyword") String keyword);

    List<Book> findByTitleContainingOrderByBookIdDesc(String keyword);

    boolean existsByTitle(String title);

    List<Book> findByCategory_CategoryIdOrderByBookIdDesc(Long categoryId);
}
