package com.umc.movie;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class MovieApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    void setUpData() {
        jdbcTemplate.update("""
                INSERT INTO member (member_id, email, password, nickname, created_at, updated_at)
                VALUES (1, 'doeyat@umc.com', 'dummy', '도얏', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
                       (2, 'minseo@umc.com', 'dummy', '민서', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                """);
        jdbcTemplate.update("""
                INSERT INTO rating (rating_id, member_id, movie_id, score, comment, created_at, updated_at)
                VALUES (1, 1, 550, 5, '최고의 영화!', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
                       (2, 1, 155, 4, '다시 봐도 명작', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
                       (3, 2, 550, 3, '호불호가 갈릴 것 같아요', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                """);
    }

    @ParameterizedTest
    @CsvSource({"nickname, 도얏, false", "nickname, 새닉네임, true",
            "email, doeyat@umc.com, false", "email, new@umc.com, true"})
    void checksAvailability(String field, String value, boolean available) throws Exception {
        mockMvc.perform(get("/members/{field}/{value}", field, value))
                .andExpect(status().isOk())
                .andExpect(content().json("{\"available\":" + available + "}", true));
    }

    @Test
    void returnsOnlyRequestedMembersRatingsInDescendingIdOrder() throws Exception {
        mockMvc.perform(get("/members/1/ratings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].ratingId").value(2))
                .andExpect(jsonPath("$[0].movieId").value(155))
                .andExpect(jsonPath("$[0].score").value(4))
                .andExpect(jsonPath("$[0].comment").value("다시 봐도 명작"))
                .andExpect(jsonPath("$[0].createdAt").isString())
                .andExpect(jsonPath("$[0].updatedAt").isString())
                .andExpect(jsonPath("$[0].member").doesNotExist())
                .andExpect(jsonPath("$[0].password").doesNotExist())
                .andExpect(jsonPath("$[1].ratingId").value(1));
    }

    @Test
    void returnsEmptyListForMemberWithNoRatings() throws Exception {
        jdbcTemplate.update("DELETE FROM rating WHERE member_id = 2");
        mockMvc.perform(get("/members/2/ratings"))
                .andExpect(status().isOk()).andExpect(content().json("[]"));
    }

    @Test
    void returnsNotFoundForMissingMember() throws Exception {
        mockMvc.perform(get("/members/999/ratings")).andExpect(status().isNotFound());
    }

    @Test
    void rejectsNonNumericMemberId() throws Exception {
        mockMvc.perform(get("/members/invalid/ratings")).andExpect(status().isBadRequest());
    }

    @Test
    void allowsFrontendOrigin() throws Exception {
        mockMvc.perform(get("/members/1/ratings").header("Origin", "http://localhost:5173"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
    }

    @Test
    void acceptsCorsPreflight() throws Exception {
        mockMvc.perform(options("/members/1/ratings")
                        .header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", "GET")
                        .header("Access-Control-Request-Headers", "Content-Type"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
    }

    @Test
    void rejectsUnlistedOrigin() throws Exception {
        mockMvc.perform(get("/members/1/ratings").header("Origin", "http://localhost:5174"))
                .andExpect(status().isForbidden())
                .andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
    }
}
