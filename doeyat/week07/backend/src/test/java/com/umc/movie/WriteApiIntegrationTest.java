package com.umc.movie;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc.movie.entity.Member;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import java.util.Map;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class WriteApiIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @Autowired MemberRepository members;
    @Autowired RatingRepository ratings;
    @Autowired PasswordEncoder encoder;
    @Autowired com.umc.movie.util.JwtUtil jwt;
    String auth(long id) { return "Bearer " + jwt.createAccessToken(id,"test@example.com"); }
    MockHttpServletRequestBuilder createRating(long id) { return post("/ratings").header("Authorization",auth(id)); }
    MockHttpServletRequestBuilder updateRating(long id,long rating) { return patch("/ratings/{id}",rating).header("Authorization",auth(id)); }
    MockHttpServletRequestBuilder deleteRating(long id,long rating) { return delete("/ratings/{id}",rating).header("Authorization",auth(id)); }


    @BeforeEach
    void clear() { ratings.deleteAll(); members.deleteAll(); }

    ResultActions send(MockHttpServletRequestBuilder request, Object body) throws Exception {
        return mvc.perform(request.contentType("application/json").content(json.writeValueAsString(body)));
    }
    Map<String, Object> signup(String email, String nickname, String password) {
        return Map.of("email", email, "nickname", nickname, "password", password);
    }
    long member(String name) {
        return members.saveAndFlush(new Member(name + "@example.com", "test-only", name)).getMemberId();
    }
    long rating(long memberId) throws Exception {
        String body = send(createRating(memberId), Map.of("movieId", 550, "score", 5, "comment", "좋아요"))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        return json.readTree(body).path("result").path("ratingId").asLong();
    }
    @Test
    void signupHashesPasswordAndDoesNotExposeIt() throws Exception {
        var request = signup("member@example.com", "영화팬", "Umc!1234");
        String response = send(post("/members"), request).andExpect(status().isCreated())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.result.password").doesNotExist())
                .andReturn().getResponse().getContentAsString();
        Member saved = members.findById(json.readTree(response).path("result").path("memberId").asLong()).orElseThrow();
        assertThat(saved.getPassword()).hasSize(60).isNotEqualTo("Umc!1234");
        assertThat(encoder.matches("Umc!1234", saved.getPassword())).isTrue();
        assertThat(response).doesNotContain("Umc!1234", saved.getPassword());
    }
    @Test
    void rejectsDuplicateEmailAndNickname() throws Exception {
        member("영화팬");
        send(post("/members"), signup("영화팬@example.com", "새닉네임", "Umc!1234"))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("MEMBER4091"));
        send(post("/members"), signup("new@example.com", "영화팬", "Umc!1234"))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("MEMBER4092"));
        assertThat(members.count()).isEqualTo(1);
    }
    @ParameterizedTest
    @ValueSource(strings = {"short", "abcdefgh!1", "ABCDEFGH!1", "Abcdefgh!", "Abcdefg123", "Umc! 1234", ""})
    void rejectsInvalidPasswords(String password) throws Exception {
        send(post("/members"), signup("user@example.com", "영화팬", password))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.isSuccess").value(false));
        assertThat(members.count()).isZero();
    }
    @Test
    void validatesEmailNicknameAndBcryptByteLimit() throws Exception {
        for (var request : java.util.List.of(
                signup("invalid", "영화팬", "Umc!1234"),
                signup("user@example.com", "a", "Umc!1234"),
                signup("user@example.com", "a".repeat(13), "Umc!1234"),
                signup("user@example.com", "  ", "Umc!1234"),
                signup("user@example.com", "영화팬", "Aa1!" + "한".repeat(23)))) {
            send(post("/members"), request).andExpect(status().isBadRequest());
        }
        assertThat(members.count()).isZero();
    }
    @Test
    void createsUpdatesListsAndDeletesRating() throws Exception {
        long memberId = member("영화팬"), id = rating(memberId);
        send(updateRating(memberId, id), Map.of("score", 3, "comment", "수정 후기"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result.score").value(3));
        mvc.perform(get("/members/{m}/ratings", memberId)).andExpect(status().isOk())
                .andExpect(jsonPath("$.result[0].comment").value("수정 후기"));
        mvc.perform(deleteRating(memberId, id))
                .andExpect(status().isOk()).andExpect(jsonPath("$.code").value("COMMON200"));
        assertThat(ratings.count()).isZero();
        mvc.perform(get("/members/{m}/ratings", memberId)).andExpect(jsonPath("$.result").isEmpty());
    }
    @Test
    void duplicateRatingIsNotStoredButDifferentMemberCanRateSameMovie() throws Exception {
        long memberId = member("영화팬");
        rating(memberId);
        send(createRating(memberId), Map.of("movieId", 550, "score", 4))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("RATING409_1"));
        assertThat(ratings.count()).isEqualTo(1);
        rating(member("다른회원"));
        assertThat(ratings.count()).isEqualTo(2);
    }
    @Test
    void wrongOwnerIsForbiddenAndMissingRatingIsNotFound() throws Exception {
        long owner = member("영화팬"), other = member("다른회원"), id = rating(owner);
        send(updateRating(other, id), Map.of("score", 1))
                .andExpect(status().isForbidden()).andExpect(jsonPath("$.code").value("RATING403_1"));
        mvc.perform(deleteRating(other, id)).andExpect(status().isForbidden());
        assertThat(ratings.findById(id).orElseThrow().getScore()).isEqualTo(5);
        send(updateRating(owner, Long.MAX_VALUE), Map.of("score", 1))
                .andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("RATING404_1"));
        mvc.perform(deleteRating(owner, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }
    @Test
    void validatesRatingAndRejectsFractionalNumbers() throws Exception {
        long memberId = member("영화팬");
        for (Object score : new Object[]{0, 6, -1, 2.5}) {
            send(createRating(memberId), Map.of("movieId", 550, "score", score))
                    .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("COMMON400"));
        }
        for (Object movieId : new Object[]{0, -1, 1.5}) {
            send(createRating(memberId), Map.of("movieId", movieId, "score", 5))
                    .andExpect(status().isBadRequest());
        }
        send(createRating(memberId), Map.of("movieId", 550)).andExpect(status().isBadRequest());
        send(createRating(memberId), Map.of("movieId", 550, "score", 5, "comment", "a".repeat(501)))
                .andExpect(status().isBadRequest());
        assertThat(ratings.count()).isZero();
        long id = rating(memberId);
        send(updateRating(memberId, id), Map.of("score", 6)).andExpect(status().isBadRequest());
        send(updateRating(memberId, id), Map.of("comment", "점수 누락")).andExpect(status().isBadRequest());
    }
    @Test
    void missingMemberAndMalformedRequestsUseEnvelope() throws Exception {
        send(createRating(Long.MAX_VALUE), Map.of("movieId", 550, "score", 5))
                .andExpect(status().isNotFound()).andExpect(jsonPath("$.isSuccess").value(false));
        mvc.perform(post("/members").contentType("application/json").content("{"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("COMMON400"));
        mvc.perform(delete("/ratings/abc").header("Authorization",auth(1))).andExpect(status().isBadRequest());
    }
    @Test
    void writesAllowCorsPreflight() throws Exception {
        for (String method : new String[]{"POST", "PATCH", "DELETE"}) {
            mvc.perform(options("/ratings/1").header("Origin", "http://localhost:5173")
                    .header("Access-Control-Request-Method", method).header("Access-Control-Request-Headers", "content-type"))
                    .andExpect(status().isOk()).andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
        }
    }
    @Test
    void databaseRejectsDuplicatesEvenWithoutServicePrecheck() {
        long id = member("영화팬");
        org.assertj.core.api.Assertions.assertThatThrownBy(() ->
                members.saveAndFlush(new Member("영화팬@example.com", "test-only", "새닉네임")))
                .isInstanceOf(org.springframework.dao.DataIntegrityViolationException.class);
        org.assertj.core.api.Assertions.assertThatThrownBy(() ->
                members.saveAndFlush(new Member("new@example.com", "test-only", "영화팬")))
                .isInstanceOf(org.springframework.dao.DataIntegrityViolationException.class);
        Member owner = members.findById(id).orElseThrow();
        ratings.saveAndFlush(new com.umc.movie.entity.Rating(owner, 550L, 5, null));
        org.assertj.core.api.Assertions.assertThatThrownBy(() ->
                ratings.saveAndFlush(new com.umc.movie.entity.Rating(owner, 550L, 4, null)))
                .isInstanceOf(org.springframework.dao.DataIntegrityViolationException.class);
        assertThat(members.count()).isEqualTo(1);
        assertThat(ratings.count()).isEqualTo(1);
    }

    @Test
    void concurrentSignupReturnsOneCreatedAndOneConflict() throws Exception {
        var ready = new java.util.concurrent.CountDownLatch(2);
        var start = new java.util.concurrent.CountDownLatch(1);
        try (var pool = java.util.concurrent.Executors.newFixedThreadPool(2)) {
            java.util.concurrent.Callable<Integer> task = () -> {
                ready.countDown(); start.await();
                return send(post("/members"), signup("race@example.com", "동시가입", "Umc!1234"))
                        .andReturn().getResponse().getStatus();
            };
            var first = pool.submit(task); var second = pool.submit(task);
            assertThat(ready.await(5, java.util.concurrent.TimeUnit.SECONDS)).isTrue();
            start.countDown();
            assertThat(java.util.List.of(first.get(10, java.util.concurrent.TimeUnit.SECONDS),
                    second.get(10, java.util.concurrent.TimeUnit.SECONDS))).containsExactlyInAnyOrder(201, 409);
        }
        assertThat(members.count()).isEqualTo(1);
    }

}
