package com.umc.movie;

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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class RatingApiIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired MemberRepository members;
    @Autowired JdbcTemplate jdbc;

    @Test
    void returnsOnlyRequestedMembersRatingsInDescendingIdOrder() throws Exception {
        Long memberId = members.saveAndFlush(new Member("first@example.com", "dummy", "첫회원")).getMemberId();
        Long otherId = members.saveAndFlush(new Member("other@example.com", "dummy", "다른회원")).getMemberId();
        insertRating(100, memberId, 550, 5, "최고의 영화!");
        insertRating(200, memberId, 155, 4, "다시 봐도 명작");
        insertRating(300, otherId, 550, 3, "다른 회원의 평점");

        mvc.perform(get("/members/{memberId}/ratings", memberId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].ratingId").value(200))
                .andExpect(jsonPath("$[0].movieId").value(155))
                .andExpect(jsonPath("$[0].score").value(4))
                .andExpect(jsonPath("$[0].comment").value("다시 봐도 명작"))
                .andExpect(jsonPath("$[0].createdAt").isString())
                .andExpect(jsonPath("$[0].updatedAt").isString())
                .andExpect(jsonPath("$[0].member").doesNotExist())
                .andExpect(jsonPath("$[0].password").doesNotExist())
                .andExpect(jsonPath("$[1].ratingId").value(100));
    }

    @Test
    void existingMemberWithoutRatingsReturnsEmptyArray() throws Exception {
        Long id = members.saveAndFlush(new Member("empty@example.com", "dummy", "평점없음")).getMemberId();
        mvc.perform(get("/members/{memberId}/ratings", id))
                .andExpect(status().isOk())
                .andExpect(content().string("[]"));
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
