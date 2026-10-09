package com.umc.study;
import com.umc.study.book.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class MissionApiTests {
    @Autowired MockMvc mvc;
    @Autowired BookRepository books;
    @Autowired CategoryRepository categories;
    @Autowired org.springframework.jdbc.core.JdbcTemplate jdbc;
    private Category category;

    @BeforeEach void prepareData() {
        books.deleteAll();
        categories.deleteAll();
        category = categories.save(new Category("소설"));
    }

    @Test void listReturnsNewestFirstWithCategoryAndAvailability() throws Exception {
        Book older = books.save(new Book(category, "먼저 등록한 도서", "설명 1"));
        jdbc.update("UPDATE book SET is_available = ? WHERE book_id = ?", false, older.getBookId());
        Book newest = books.save(new Book(category, "나중에 등록한 도서", "설명 2"));
        mvc.perform(get("/books")).andExpect(status().isOk())
                .andExpect(jsonPath("$[0].bookId").value(newest.getBookId()))
                .andExpect(jsonPath("$[0].categoryName").value("소설"))
                .andExpect(jsonPath("$[0].description").value("설명 2"))
                .andExpect(jsonPath("$[0].isAvailable").value(true))
                .andExpect(jsonPath("$[1].title").value("먼저 등록한 도서"))
                .andExpect(jsonPath("$[1].isAvailable").value(false));
    }

    @Test void postCreatesBookAndFollowingGetReturnsIt() throws Exception {
        mvc.perform(post("/books").contentType("application/json")
                .content(body(category.getCategoryId(), "등록 테스트")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.bookId").isNumber())
                .andExpect(jsonPath("$.categoryName").value("소설"));
        assertThat(books.count()).isEqualTo(1);
        mvc.perform(get("/books")).andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("등록 테스트"));
    }

    @Test void blankTitleDoesNotInsertBook() throws Exception {
        mvc.perform(post("/books").contentType("application/json")
                .content(body(category.getCategoryId(), "   ")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.title").exists());
        assertThat(books.count()).isZero();
    }

    @Test void missingAndNonPositiveCategoryDoNotInsertBook() throws Exception {
        for (String json : new String[]{body(0L, "테스트"), "{\"title\":\"테스트\"}"}) {
            mvc.perform(post("/books").contentType("application/json").content(json))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.errors.categoryId").exists());
        }
        assertThat(books.count()).isZero();
    }

    @Test void unknownCategoryReturns404WithoutInsert() throws Exception {
        mvc.perform(post("/books").contentType("application/json")
                .content(body(999999999L, "카테고리 테스트")))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("존재하지 않는 카테고리입니다."));
        assertThat(books.count()).isZero();
    }

    @Test void malformedJsonDoesNotInsertBook() throws Exception {
        mvc.perform(post("/books").contentType("application/json").content("{broken"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists());
        assertThat(books.count()).isZero();
    }

    private String body(Long categoryId, String title) {
        return "{\"categoryId\":" + categoryId + ",\"title\":\"" + title
                + "\",\"description\":\"설명\"}";
    }
}
