package com.umc.movie;

import com.umc.movie.entity.Member;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import com.umc.movie.util.JwtUtil;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import static org.assertj.core.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest @AutoConfigureMockMvc @ActiveProfiles("test") @Transactional
class RatingMissionIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired MemberRepository members;
    @Autowired RatingRepository ratings;
    @Autowired JwtUtil jwt;
    private static final String BODY = """
            {"movieId":550,"score":5,"comment":"다시 보고 싶은 영화"}
            """;

    @Test
    @DisplayName("토큰 없이 POST /ratings를 호출하면 401과 AUTH401_2를 응답하고 저장하지 않는다")
    void missingTokenReturns401() throws Exception {
        long before = ratings.count();
        mvc.perform(post("/ratings").contentType("application/json").content(BODY))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("AUTH401_2"));
        assertThat(ratings.count()).isEqualTo(before);
    }

    @Test
    @DisplayName("유효한 토큰으로 POST /ratings를 호출하면 201과 COMMON201을 응답하고 JWT 회원의 평점을 저장한다")
    void validTokenReturns201AndPersistsRating() throws Exception {
        Member member = members.saveAndFlush(new Member("mission@example.com", "hashed", "미션회원"));
        String token = jwt.createAccessToken(member.getMemberId(), member.getEmail());
        mvc.perform(post("/ratings").header("Authorization", "Bearer " + token)
                        .contentType("application/json").content(BODY))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.movieId").value(550))
                .andExpect(jsonPath("$.result.score").value(5));
        assertThat(ratings.existsByMember_MemberIdAndMovieId(member.getMemberId(), 550L)).isTrue();
    }
}
