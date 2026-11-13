package com.umc.movie;

import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class MemberRatingApiIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private RatingRepository ratingRepository;

    private Long memberId;

    @BeforeEach
    void setUp() {
        ratingRepository.deleteAll();
        memberRepository.deleteAll();

        Member member = memberRepository.save(
                new Member("noco@umc.com", "dummy-password", "수현")
        );
        memberId = member.getMemberId();

        ratingRepository.save(new Rating(member, 550L, 5, "최고의 영화!"));
        ratingRepository.save(new Rating(member, 155L, 4, "다시 봐도 명작"));
    }

    @Test
    void checksNicknameAndCorsHeader() throws Exception {
        mockMvc.perform(get("/members/nickname/{nickname}", "수현")
                        .header("Origin", "http://localhost:5173"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"))
                .andExpect(jsonPath("$.available").value(false));
    }

    @Test
    void allowsBackendTesterOrigin() throws Exception {
        mockMvc.perform(get("/members/email/{email}", "new@umc.com")
                        .header("Origin", "http://localhost:5174"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5174"));
    }

    @Test
    void rejectsUnknownOrigin() throws Exception {
        mockMvc.perform(get("/members/email/{email}", "new@umc.com")
                        .header("Origin", "https://example.com"))
                .andExpect(status().isForbidden());
    }

    @Test
    void checksEmailAvailability() throws Exception {
        mockMvc.perform(get("/members/email/{email}", "new@umc.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.available").value(true));
    }

    @Test
    void returnsMemberRatingsInNewestIdOrder() throws Exception {
        mockMvc.perform(get("/members/{memberId}/ratings", memberId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].movieId").value(155))
                .andExpect(jsonPath("$[1].movieId").value(550));
    }

    @Test
    void returnsNotFoundForUnknownMember() throws Exception {
        mockMvc.perform(get("/members/{memberId}/ratings", 999999L))
                .andExpect(status().isNotFound());
    }
}
