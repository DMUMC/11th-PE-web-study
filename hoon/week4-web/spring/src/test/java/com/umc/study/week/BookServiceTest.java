package com.umc.study.week;

import com.umc.study.week.dto.BookResponse;
import com.umc.study.week.dto.CreateBookRequest;
import com.umc.study.week.entity.Book;
import com.umc.study.week.entity.Category;
import com.umc.study.week.repository.BookRepository;
import com.umc.study.week.repository.CategoryRepository;
import com.umc.study.week.service.BookService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private BookService bookService;

    @Test
    @DisplayName("도서 목록 전체 조회 시 DTO 목록으로 변환되어 반환된다")
    void getBooks_success() {
        Category category = new Category(1L, "소설");
        Book book = new Book(1L, category, "헤밍웨이", "노인과 바다", true);
        given(bookRepository.findAllWithCategoryOrderByBookIdDesc()).willReturn(List.of(book));

        List<BookResponse> responses = bookService.getBooks();

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).title()).isEqualTo("헤밍웨이");
        assertThat(responses.get(0).categoryName()).isEqualTo("소설");
    }

    @Test
    @DisplayName("신규 도서 정상 등록")
    void createBook_success() {
        Category category = new Category(1L, "IT");
        CreateBookRequest request = new CreateBookRequest(1L, "JPA 프로그래밍", "김영한 저");
        Book savedBook = new Book(1L, category, "JPA 프로그래밍", "김영한 저", true);

        given(bookRepository.existsByTitle(request.title())).willReturn(false);
        given(categoryRepository.findById(1L)).willReturn(Optional.of(category));
        given(bookRepository.save(any(Book.class))).willReturn(savedBook);

        BookResponse response = bookService.createBook(request);

        assertThat(response.bookId()).isEqualTo(1L);
        assertThat(response.title()).isEqualTo("JPA 프로그래밍");
        assertThat(response.categoryName()).isEqualTo("IT");
        verify(bookRepository).save(any(Book.class));
    }

    @Test
    @DisplayName("중복 도서 제목 등록 시 IllegalStateException 발생 (409)")
    void createBook_duplicateTitle_throwsException() {
        CreateBookRequest request = new CreateBookRequest(1L, "중복 도서", "설명");
        given(bookRepository.existsByTitle(request.title())).willReturn(true);

        assertThatThrownBy(() -> bookService.createBook(request))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("이미 등록된 도서 제목입니다");
    }

    @Test
    @DisplayName("존재하지 않는 카테고리 ID로 등록 시 NoSuchElementException 발생 (404)")
    void createBook_categoryNotFound_throwsException() {
        CreateBookRequest request = new CreateBookRequest(999L, "새 도서", "설명");
        given(bookRepository.existsByTitle(request.title())).willReturn(false);
        given(categoryRepository.findById(999L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> bookService.createBook(request))
                .isInstanceOf(NoSuchElementException.class)
                .hasMessageContaining("존재하지 않는 카테고리입니다");
    }
}
