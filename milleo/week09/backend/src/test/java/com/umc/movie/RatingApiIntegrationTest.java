package com.umc.movie;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc.movie.entity.Member;
import com.umc.movie.repository.MemberRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class RatingApiIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired MemberRepository members;
    @Autowired JdbcTemplate jdbc;
    @Autowired ObjectMapper json;

    @Test
    void createRatingWithoutTokenReturns401() throws Exception {
        mvc.perform(post("/ratings").contentType("application/json")
                        .content("""
                                {"movieId":550,"score":5,"comment":"평점 등록"}
                                """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("AUTH401_2"));
    }

    @Test
    void createRatingWithLoginTokenReturns201AndPersistsForThatMember() throws Exception {
        var signup = mvc.perform(post("/members").contentType("application/json")
                        .content("""
                                {"email":"rating@example.com","password":"Test!123","nickname":"밀러평점"}
                                """))
                .andExpect(status().isCreated())
                .andReturn().getResponse();
        long memberId = json.readTree(signup.getContentAsByteArray()).path("result").path("memberId").asLong();
        var login = mvc.perform(post("/auth/login").contentType("application/json")
                        .content("""
                                {"email":"rating@example.com","password":"Test!123"}
                                """))
                .andExpect(status().isOk())
                .andReturn().getResponse();
        String token = json.readTree(login.getContentAsByteArray()).path("result").path("accessToken").asText();

        var response = mvc.perform(post("/ratings").header("Authorization", "Bearer " + token)
                        .contentType("application/json")
                        .content("""
                                {"movieId":550,"score":5,"comment":"평점 등록"}
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.movieId").value(550))
                .andExpect(jsonPath("$.result.score").value(5))
                .andReturn().getResponse();
        long ratingId = json.readTree(response.getContentAsByteArray()).path("result").path("ratingId").asLong();
        assertThat(jdbc.queryForObject("SELECT member_id FROM rating WHERE rating_id = ?", Long.class, ratingId))
                .isEqualTo(memberId);
    }

    @Test
    void returnsOnlyRequestedMembersRatingsInDescendingIdOrder() throws Exception {
        Long memberId = members.saveAndFlush(new Member("first@example.com", "dummy", "첫회원")).getMemberId();
        Long otherId = members.saveAndFlush(new Member("other@example.com", "dummy", "다른회원")).getMemberId();
        insertRating(100, memberId, 550, 5, "최고의 영화!");
        insertRating(200, memberId, 155, 4, "다시 봐도 명작");
        insertRating(300, otherId, 550, 3, "다른 회원의 평점");

        mvc.perform(get("/members/{memberId}/ratings", memberId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result.length()").value(2))
                .andExpect(jsonPath("$.result[0].ratingId").value(200))
                .andExpect(jsonPath("$.result[0].movieId").value(155))
                .andExpect(jsonPath("$.result[0].score").value(4))
                .andExpect(jsonPath("$.result[0].comment").value("다시 봐도 명작"))
                .andExpect(jsonPath("$.result[0].createdAt").isString())
                .andExpect(jsonPath("$.result[0].updatedAt").isString())
                .andExpect(jsonPath("$.result[0].member").doesNotExist())
                .andExpect(jsonPath("$.result[0].password").doesNotExist())
                .andExpect(jsonPath("$.result[1].ratingId").value(100));
    }

    @Test
    void existingMemberWithoutRatingsReturnsEmptyArray() throws Exception {
        Long id = members.saveAndFlush(new Member("empty@example.com", "dummy", "평점없음")).getMemberId();
        mvc.perform(get("/members/{memberId}/ratings", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").isEmpty());
    }

    @Test
    void missingMemberReturns404() throws Exception {
        mvc.perform(get("/members/{memberId}/ratings", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    private void insertRating(long id, long memberId, long movieId, int score, String comment) {
        jdbc.update("""
                INSERT INTO rating (rating_id, member_id, movie_id, score, comment, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                """, id, memberId, movieId, score, comment);
    }
}
