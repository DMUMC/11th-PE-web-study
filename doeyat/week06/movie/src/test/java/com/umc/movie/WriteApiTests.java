package com.umc.movie;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc.movie.controller.GlobalExceptionHandler;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

import static org.assertj.core.api.Assertions.*;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class WriteApiTests {
    @Autowired private MockMvc mvc;
    @Autowired private ObjectMapper mapper;
    @Autowired private MemberRepository members;
    @Autowired private RatingRepository ratings;
    @Autowired private PasswordEncoder encoder;
    @Autowired private GlobalExceptionHandler exceptionHandler;

    private Member owner;
    private Member other;
    private Rating rating;

    @BeforeEach
    void setUp() {
        owner = members.saveAndFlush(new Member("owner@umc.com", "dummy", "작성자"));
        other = members.saveAndFlush(new Member("other@umc.com", "dummy", "다른회원"));
        rating = ratings.saveAndFlush(new Rating(owner, 550L, 5, "원본 후기"));
    }

    @Test
    void signsUpAndStoresOnlyBcryptHash() throws Exception {
        var response = signUp("new@umc.com", "Umc!1234", "새회원")
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.email").value("new@umc.com"))
                .andExpect(jsonPath("$.result.nickname").value("새회원"))
                .andExpect(jsonPath("$.result.password").doesNotExist())
                .andReturn().getResponse();
        long memberId = mapper.readTree(response.getContentAsString()).at("/result/memberId").asLong();
        String hash = members.findById(memberId).orElseThrow().getPassword();
        assertThat(hash).hasSize(60).isNotEqualTo("Umc!1234");
        assertThat(encoder.matches("Umc!1234", hash)).isTrue();
    }

    @ParameterizedTest
    @CsvSource({
            "invalid-email, Umc!1234, 새회원",
            "new@umc.com, weakpass, 새회원",
            "new@umc.com, UMC!1234, 새회원",
            "new@umc.com, umc!1234, 새회원",
            "new@umc.com, Umc!abcd, 새회원",
            "new@umc.com, Umc12345, 새회원",
            "new@umc.com, Umc!123, 새회원",
            "new@umc.com, Umc!1234, 한",
            "new@umc.com, Umc!1234, abcdefghijklm"
    })
    void rejectsInvalidSignUp(String email, String password, String nickname) throws Exception {
        expectFailure(signUp(email, password, nickname), 400);
        assertThat(members.count()).isEqualTo(2);
    }

    @Test
    void rejectsMissingSignUpFields() throws Exception {
        expectFailure(mvc.perform(post("/members").contentType(MediaType.APPLICATION_JSON).content("{}")), 400);
    }

    @Test
    void rejectsPasswordBeyondBcryptByteLimit() throws Exception {
        expectFailure(signUp("new@umc.com", "Umc!1234" + "가".repeat(22), "새회원"), 400);
    }

    @ParameterizedTest
    @CsvSource({"owner@umc.com, 새회원", "new@umc.com, 작성자"})
    void rejectsDuplicateMember(String email, String nickname) throws Exception {
        expectFailure(signUp(email, "Umc!1234", nickname), 409);
        assertThat(members.count()).isEqualTo(2);
    }

    @Test
    void createsUpdatesAndDeletesRating() throws Exception {
        var response = createRating(owner.getMemberId(), Map.of("movieId", 155, "score", 4, "comment", "등록 후기"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result").isNumber())
                .andReturn().getResponse();
        long id = mapper.readTree(response.getContentAsString()).path("result").asLong();
        mvc.perform(patch("/members/{memberId}/ratings/{ratingId}", owner.getMemberId(), id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(Map.of("score", 2, "comment", "수정 후기"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.code").value("COMMON200"))
                .andExpect(jsonPath("$.result").value(nullValue()));
        ratings.flush();
        mvc.perform(get("/members/{memberId}/ratings", owner.getMemberId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].ratingId").value(id))
                .andExpect(jsonPath("$[0].score").value(2))
                .andExpect(jsonPath("$[0].comment").value("수정 후기"));
        mvc.perform(delete("/members/{memberId}/ratings/{ratingId}", owner.getMemberId(), id))
                .andExpect(status().isNoContent()).andExpect(content().string(""));
        ratings.flush();
        assertThat(ratings.existsById(id)).isFalse();
    }

    @Test
    void allowsCommentToBeOmittedAndCleared() throws Exception {
        createRating(owner.getMemberId(), Map.of("movieId", 155, "score", 1)).andExpect(status().isCreated());
        mvc.perform(patch("/members/{memberId}/ratings/{ratingId}", owner.getMemberId(), rating.getRatingId())
                        .contentType(MediaType.APPLICATION_JSON).content("{\"score\":5}"))
                .andExpect(status().isOk());
        assertThat(ratings.findById(rating.getRatingId()).orElseThrow().getComment()).isNull();
    }

    @Test
    void rejectsDuplicateRatingWithoutSaving() throws Exception {
        expectFailure(createRating(owner.getMemberId(), Map.of("movieId", 550, "score", 4)), 409);
        assertThat(ratings.count()).isEqualTo(1);
    }

    @Test
    void rejectsRatingForMissingMember() throws Exception {
        expectFailure(createRating(Long.MAX_VALUE, Map.of("movieId", 155, "score", 4)), 404);
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "{}", "{\"movieId\":0,\"score\":3}", "{\"movieId\":-1,\"score\":3}",
            "{\"movieId\":155}", "{\"movieId\":155,\"score\":0}",
            "{\"movieId\":155,\"score\":6}", "{\"movieId\":155,\"score\":2.5}",
            "{\"movieId\":1.5,\"score\":3}", "{broken"
    })
    void rejectsInvalidRating(String body) throws Exception {
        expectFailure(mvc.perform(post("/members/{memberId}/ratings", owner.getMemberId())
                .contentType(MediaType.APPLICATION_JSON).content(body)), 400);
        assertThat(ratings.count()).isEqualTo(1);
    }

    @Test
    void rejectsOverlongCommentOnCreateAndUpdate() throws Exception {
        String body = mapper.writeValueAsString(Map.of("movieId", 155, "score", 3, "comment", "가".repeat(501)));
        expectFailure(mvc.perform(post("/members/{memberId}/ratings", owner.getMemberId())
                .contentType(MediaType.APPLICATION_JSON).content(body)), 400);
        expectFailure(mvc.perform(patch("/members/{memberId}/ratings/{ratingId}", owner.getMemberId(), rating.getRatingId())
                .contentType(MediaType.APPLICATION_JSON).content(body)), 400);
        assertThat(rating.getComment()).isEqualTo("원본 후기");
    }

    @ParameterizedTest
    @ValueSource(strings = {"{}", "{\"score\":null}", "{\"score\":0}", "{\"score\":6}", "{\"score\":1.5}"})
    void rejectsInvalidUpdate(String body) throws Exception {
        expectFailure(mvc.perform(patch("/members/{memberId}/ratings/{ratingId}", owner.getMemberId(), rating.getRatingId())
                .contentType(MediaType.APPLICATION_JSON).content(body)), 400);
        assertThat(rating.getScore()).isEqualTo(5);
    }

    @Test
    void rejectsOtherMembersUpdateAndDeleteWithoutChangingData() throws Exception {
        expectFailure(mvc.perform(patch("/members/{memberId}/ratings/{ratingId}", other.getMemberId(), rating.getRatingId())
                .contentType(MediaType.APPLICATION_JSON).content("{\"score\":1}")), 403);
        expectFailure(mvc.perform(delete("/members/{memberId}/ratings/{ratingId}", other.getMemberId(), rating.getRatingId())), 403);
        assertThat(ratings.existsById(rating.getRatingId())).isTrue();
        assertThat(rating.getScore()).isEqualTo(5);
    }

    @Test
    void returnsNotFoundForMissingRatingOnUpdateAndDelete() throws Exception {
        expectFailure(mvc.perform(patch("/members/{memberId}/ratings/{ratingId}", owner.getMemberId(), Long.MAX_VALUE)
                .contentType(MediaType.APPLICATION_JSON).content("{\"score\":1}")), 404);
        expectFailure(mvc.perform(delete("/members/{memberId}/ratings/{ratingId}", owner.getMemberId(), Long.MAX_VALUE)), 404);
    }

    @Test
    void databaseRejectsDuplicateMemberEvenWithoutServiceCheck() {
        assertThatThrownBy(() -> members.saveAndFlush(new Member(owner.getEmail(), "dummy", "새닉네임")))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void databaseRejectsDuplicateNicknameEvenWithoutServiceCheck() {
        assertThatThrownBy(() -> members.saveAndFlush(new Member("new@umc.com", "dummy", owner.getNickname())))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void databaseRejectsDuplicateRatingEvenWithoutServiceCheck() {
        assertThatThrownBy(() -> ratings.saveAndFlush(new Rating(owner, 550L, 3, null)))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void databaseConstraintFailureUsesCommonResponse() {
        var response = exceptionHandler.handleDataIntegrity(new DataIntegrityViolationException("internal database detail"));
        assertThat(response.getStatusCode().value()).isEqualTo(409);
        assertThat(response.getBody().isSuccess()).isFalse();
        assertThat(response.getBody().code()).isEqualTo("COMMON4091");
        assertThat(response.getBody().result()).isNull();
        assertThat(response.getBody().message()).doesNotContain("internal database detail");
    }

    private ResultActions signUp(String email, String password, String nickname) throws Exception {
        return mvc.perform(post("/members").contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(Map.of("email", email, "password", password, "nickname", nickname))));
    }

    private ResultActions createRating(Long memberId, Map<String, Object> body) throws Exception {
        return mvc.perform(post("/members/{memberId}/ratings", memberId).contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(body)));
    }

    private void expectFailure(ResultActions action, int statusCode) throws Exception {
        action.andExpect(status().is(statusCode))
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").isString())
                .andExpect(jsonPath("$.message").isString())
                .andExpect(jsonPath("$.result").value(nullValue()));
    }
}
