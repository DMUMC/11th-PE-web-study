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
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
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

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private Long memberId;
    private Long otherMemberId;
    private Long ratingId;

    @BeforeEach
    void setUp() {
        ratingRepository.deleteAll();
        memberRepository.deleteAll();

        Member member = memberRepository.save(
                new Member("noco@umc.com", "$2a$10$existingPasswordHash", "수현")
        );
        Member otherMember = memberRepository.save(
                new Member("minseo@umc.com", "$2a$10$existingPasswordHash", "민서")
        );
        memberId = member.getMemberId();
        otherMemberId = otherMember.getMemberId();
        ratingId = ratingRepository.save(new Rating(member, 550L, 5, "최고의 영화!")).getRatingId();
    }

    @Test
    void signsUpMemberWithBcryptPasswordAndWithoutPasswordInResponse() throws Exception {
        mockMvc.perform(post("/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "new@umc.com",
                                  "password": "Umc!1234",
                                  "nickname": "영화팬"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.email").value("new@umc.com"))
                .andExpect(jsonPath("$.result.nickname").value("영화팬"))
                .andExpect(jsonPath("$.result.password").doesNotExist());

        String password = jdbcTemplate.queryForObject(
                "select password from member where email = ?",
                String.class,
                "new@umc.com"
        );
        assertThat(password).startsWith("$2").hasSize(60).isNotEqualTo("Umc!1234");
    }

    @Test
    void rejectsInvalidSignUpRequestWithConsistentBody() throws Exception {
        mockMvc.perform(post("/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "wrong-email",
                                  "password": "short",
                                  "nickname": "한"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("COMMON4001"))
                .andExpect(jsonPath("$.message").isNotEmpty())
                .andExpect(jsonPath("$.result").isEmpty());
    }

    @Test
    void rejectsDuplicateEmail() throws Exception {
        mockMvc.perform(post("/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "noco@umc.com",
                                  "password": "Umc!1234",
                                  "nickname": "새닉네임"
                                }
                                """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("COMMON4091"))
                .andExpect(jsonPath("$.message").value("이미 사용 중인 이메일입니다."));
    }

    @Test
    void createsRating() throws Exception {
        mockMvc.perform(post("/members/{memberId}/ratings", memberId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "movieId": 155,
                                  "score": 4,
                                  "comment": "다시 봐도 명작"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result").isNumber());
    }

    @Test
    void rejectsInvalidAndDuplicateRatings() throws Exception {
        mockMvc.perform(post("/members/{memberId}/ratings", memberId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                { "movieId": 155, "score": 6, "comment": "범위 초과" }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("COMMON4001"));

        mockMvc.perform(post("/members/{memberId}/ratings", memberId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                { "movieId": 550, "score": 3, "comment": "중복" }
                                """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("COMMON4091"))
                .andExpect(jsonPath("$.message").value("이미 이 영화에 평점을 남기셨습니다."));

        assertThat(ratingRepository.count()).isEqualTo(1);
    }

    @Test
    void updatesOwnRating() throws Exception {
        mockMvc.perform(patch("/members/{memberId}/ratings/{ratingId}", memberId, ratingId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                { "score": 4, "comment": "수정한 후기" }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.code").value("COMMON200"));

        Rating updated = ratingRepository.findById(ratingId).orElseThrow();
        assertThat(updated.getScore()).isEqualTo((byte) 4);
        assertThat(updated.getComment()).isEqualTo("수정한 후기");
    }

    @Test
    void rejectsOtherMembersRatingUpdateAndMissingRating() throws Exception {
        mockMvc.perform(patch("/members/{memberId}/ratings/{ratingId}", otherMemberId, ratingId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                { "score": 2, "comment": "다른 회원의 요청" }
                                """))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("COMMON403"));

        mockMvc.perform(patch("/members/{memberId}/ratings/{ratingId}", memberId, 999999L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                { "score": 2, "comment": "없는 평점" }
                                """))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("COMMON404"));
    }

    @Test
    void deletesRatingWithNoContent() throws Exception {
        mockMvc.perform(delete("/members/{memberId}/ratings/{ratingId}", memberId, ratingId))
                .andExpect(status().isNoContent())
                .andExpect(content().string(""));

        assertThat(ratingRepository.existsById(ratingId)).isFalse();
    }

    @Test
    void preservesReadApisAndCors() throws Exception {
        mockMvc.perform(get("/members/nickname/{nickname}", "수현")
                        .header("Origin", "http://localhost:5173"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"))
                .andExpect(jsonPath("$.available").value(false));

        mockMvc.perform(get("/members/{memberId}/ratings", memberId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].movieId").value(550));
    }
}
