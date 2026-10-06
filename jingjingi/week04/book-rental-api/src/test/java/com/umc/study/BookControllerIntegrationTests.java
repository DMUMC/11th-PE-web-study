package com.umc.study;

import com.umc.study.entity.Book;
import com.umc.study.entity.Category;
import com.umc.study.repository.BookRepository;
import com.umc.study.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class BookControllerIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    private Category category;

    @BeforeEach
    void setUp() {
        category = categoryRepository.save(new Category("문학"));
    }

    @Test
    void getBooksReturnsNewestBookFirst() throws Exception {
        bookRepository.save(new Book(category, "첫 번째 책", "첫 설명"));
        bookRepository.save(new Book(category, "두 번째 책", "두 번째 설명"));

        mockMvc.perform(get("/books"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("두 번째 책"))
                .andExpect(jsonPath("$[0].categoryName").value("문학"))
                .andExpect(jsonPath("$[0].isAvailable").value(true));
    }

    @Test
    void createBookReturns201() throws Exception {
        String request = """
                {
                  "categoryId": %d,
                  "title": "새로운 도서",
                  "description": "ORM으로 등록한 도서"
                }
                """.formatted(category.getCategoryId());

        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("새로운 도서"))
                .andExpect(jsonPath("$.categoryName").value("문학"))
                .andExpect(jsonPath("$.isAvailable").value(true));
    }

    @Test
    void createBookRejectsBlankTitle() throws Exception {
        String request = """
                {
                  "categoryId": %d,
                  "title": " ",
                  "description": "잘못된 요청"
                }
                """.formatted(category.getCategoryId());

        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.title").exists());
    }

    @Test
    void createBookReturns404ForMissingCategory() throws Exception {
        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "categoryId": 999999,
                                  "title": "카테고리 없는 도서",
                                  "description": null
                                }
                                """))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("존재하지 않는 카테고리입니다. categoryId=999999"));
    }
}
