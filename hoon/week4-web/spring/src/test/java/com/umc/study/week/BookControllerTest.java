package com.umc.study.week;

import com.umc.study.week.controller.BookController;
import com.umc.study.week.dto.BookResponse;
import com.umc.study.week.dto.CreateBookRequest;
import com.umc.study.week.service.BookService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.NoSuchElementException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BookController.class)
class BookControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BookService bookService;

    @Test
    @DisplayName("GET /books - 도서 목록 조회 성공 (200 OK)")
    void getBooks_success() throws Exception {
        BookResponse response = new BookResponse(1L, "테스트 도서", "설명", "소설", true);
        given(bookService.getBooks()).willReturn(List.of(response));

        mockMvc.perform(get("/books"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].bookId").value(1L))
                .andExpect(jsonPath("$[0].title").value("테스트 도서"))
                .andExpect(jsonPath("$[0].categoryName").value("소설"));
    }

    @Test
    @DisplayName("GET /books?keyword=스프링 - 도서 검색 성공 (200 OK)")
    void getBooks_search_success() throws Exception {
        BookResponse response = new BookResponse(2L, "스프링 입문", "설명", "IT", true);
        given(bookService.searchBooks("스프링")).willReturn(List.of(response));

        mockMvc.perform(get("/books").param("keyword", "스프링"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].bookId").value(2L))
                .andExpect(jsonPath("$[0].title").value("스프링 입문"));
    }

    @Test
    @DisplayName("POST /books - 도서 등록 성공 (201 Created)")
    void createBook_success() throws Exception {
        BookResponse response = new BookResponse(1L, "클린 코드", "설명", "컴퓨터", true);
        given(bookService.createBook(any(CreateBookRequest.class))).willReturn(response);

        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "categoryId": 1,
                                  "title": "클린 코드",
                                  "description": "설명"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.bookId").value(1L))
                .andExpect(jsonPath("$.title").value("클린 코드"));
    }

    @Test
    @DisplayName("POST /books - 유효성 검증 실패 시 400 Bad Request")
    void createBook_validationFail() throws Exception {
        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "categoryId": null,
                                  "title": "",
                                  "description": "설명"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.validationErrors.title").exists())
                .andExpect(jsonPath("$.validationErrors.categoryId").exists());
    }

    @Test
    @DisplayName("POST /books - 존재하지 않는 카테고리 요청 시 404 Not Found")
    void createBook_notFoundCategory() throws Exception {
        given(bookService.createBook(any(CreateBookRequest.class)))
                .willThrow(new NoSuchElementException("존재하지 않는 카테고리입니다. categoryId: 999"));

        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "categoryId": 999,
                                  "title": "새 도서",
                                  "description": "설명"
                                }
                                """))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    @DisplayName("POST /books - 중복 도서 등록 요청 시 409 Conflict")
    void createBook_conflictTitle() throws Exception {
        given(bookService.createBook(any(CreateBookRequest.class)))
                .willThrow(new IllegalStateException("이미 등록된 도서 제목입니다: 클린 코드"));

        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "categoryId": 1,
                                  "title": "클린 코드",
                                  "description": "설명"
                                }
                                """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409));
    }
}
