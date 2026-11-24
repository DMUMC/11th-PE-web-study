package com.umc.study.controller;

import com.umc.study.dto.BookCreateRequest;
import com.umc.study.dto.BookResponse;
import com.umc.study.exception.CategoryNotFoundException;
import com.umc.study.service.BookService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

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

    @MockitoBean
    private BookService bookService;

    @Test
    void getBooksReturnsLatestBooks() throws Exception {
        given(bookService.getAllBooks()).willReturn(List.of(
                new BookResponse(3L, "우주를 읽는 법", "과학 교양", "과학", true),
                new BookResponse(2L, "겨울의 편지", "에세이", "문학", false)
        ));

        mockMvc.perform(get("/books"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].bookId").value(3))
                .andExpect(jsonPath("$[0].categoryName").value("과학"))
                .andExpect(jsonPath("$[0].isAvailable").value(true));
    }

    @Test
    void createBookReturnsCreatedBook() throws Exception {
        given(bookService.createBook(any(BookCreateRequest.class)))
                .willReturn(new BookResponse(4L, "어린 왕자", "생텍쥐페리의 대표 소설", "문학", true));

        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "categoryId": 1,
                                  "title": "어린 왕자",
                                  "description": "생텍쥐페리의 대표 소설"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.bookId").value(4))
                .andExpect(jsonPath("$.title").value("어린 왕자"))
                .andExpect(jsonPath("$.categoryName").value("문학"))
                .andExpect(jsonPath("$.isAvailable").value(true));
    }

    @Test
    void createBookRejectsUnknownCategory() throws Exception {
        given(bookService.createBook(any(BookCreateRequest.class)))
                .willThrow(new CategoryNotFoundException());

        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "categoryId": 999,
                                  "title": "미래 과학 이야기",
                                  "description": "존재하지 않는 카테고리 테스트"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("존재하지 않는 카테고리입니다."));
    }

    @Test
    void createBookValidatesRequest() throws Exception {
        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "categoryId": 1,
                                  "title": "",
                                  "description": "설명"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("제목은 필수입니다."));
    }
}
