package com.umc.study;

import com.umc.study.entity.Category;
import com.umc.study.repository.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class BookApiTests {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CategoryRepository categoryRepository;

    @Test
    void createBookAndListWithCategory() throws Exception {
        Category category = categoryRepository.save(new Category("소설"));

        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"categoryId": %d, "title": "테스트 도서", "description": "소개"}
                                """.formatted(category.getCategoryId())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.bookId").isNumber())
                .andExpect(jsonPath("$.categoryName").value("소설"))
                .andExpect(jsonPath("$.isAvailable").value(true));

        mockMvc.perform(get("/books"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("테스트 도서"))
                .andExpect(jsonPath("$[0].categoryName").value("소설"));
    }

    @Test
    void rejectBlankTitle() throws Exception {
        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"categoryId": 1, "title": " "}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("도서 제목은 필수입니다."));
    }

    @Test
    void rejectMissingCategory() throws Exception {
        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"categoryId": 999999, "title": "테스트 도서"}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("존재하지 않는 카테고리입니다."));
    }
}
