package com.umc.movie;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc.movie.entity.Member;
import com.umc.movie.repository.MemberRepository;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest @AutoConfigureMockMvc @ActiveProfiles("test") @Transactional
class SwaggerAndFavoriteIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @Autowired MemberRepository members;
    @Autowired JwtUtil jwt;

    @Test
    @DisplayName("공개 Swagger 문서에 필수 API 9개의 설명·인증과 평점 실패 응답이 표시된다")
    void documentsAuthenticationAndErrorContracts() throws Exception {
        var response = mvc.perform(get("/v3/api-docs")).andExpect(status().isOk()).andReturn();
        var api = json.readTree(response.getResponse().getContentAsByteArray());
        String[][] operations = {{"/ratings", "post"}, {"/ratings/{ratingId}", "patch"}, {"/ratings/{ratingId}", "delete"},
                {"/members/{memberId}/ratings", "get"}, {"/members/me", "get"}, {"/members/me", "patch"},
                {"/favorites", "get"}, {"/favorites/{movieId}", "get"}, {"/favorites/{movieId}", "delete"}};
        for (var operation : operations) {
            var doc = api.path("paths").path(operation[0]).path(operation[1]);
            assertThat(doc.path("summary").asText()).isNotBlank();
            boolean secured = !operation[0].equals("/members/{memberId}/ratings");
            assertThat(doc.path("security").toString().contains("bearerAuth")).isEqualTo(secured);
            if (secured) assertThat(doc.path("responses").has("401")).isTrue();
            for (var parameter : doc.path("parameters")) {
                assertThat(parameter.path("in").asText()).isEqualTo("path");
            }
        }
        assertThat(api.path("paths").path("/auth/login").path("post").has("security")).isFalse();
        assertThat(api.path("paths").path("/members").path("post").has("security")).isFalse();
        assertThat(api.path("paths").path("/ratings").path("post").path("responses").path("409").toString()).contains("RATING409_1");
        assertThat(api.path("paths").path("/ratings/{ratingId}").path("patch").path("responses").path("403").toString()).contains("RATING403_1");
        mvc.perform(get("/swagger-ui/index.html")).andExpect(status().isOk());
    }

    @Test
    @DisplayName("즐겨찾기는 인증 후 등록·목록·여부·해제가 가능하고 다른 회원과 분리된다")
    void favoritesAreScopedToAuthenticatedMember() throws Exception {
        Member member = members.saveAndFlush(new Member("favorite@example.com", "hashed", "즐겨찾기회원"));
        Member other = members.saveAndFlush(new Member("other-favorite@example.com", "hashed", "다른회원"));
        String token = "Bearer " + jwt.createAccessToken(member.getMemberId(), member.getEmail());
        String otherToken = "Bearer " + jwt.createAccessToken(other.getMemberId(), other.getEmail());
        mvc.perform(post("/favorites").contentType("application/json").content("{\"movieId\":550}"))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_2"));
        mvc.perform(post("/favorites").header("Authorization", token).contentType("application/json").content("{\"movieId\":550}"))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.code").value("COMMON201"));
        mvc.perform(post("/favorites").header("Authorization", token).contentType("application/json").content("{\"movieId\":550}"))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("FAVORITE409_1"));
        mvc.perform(get("/favorites").header("Authorization", token)).andExpect(jsonPath("$.result[0].movieId").value(550));
        mvc.perform(get("/favorites/550").header("Authorization", otherToken)).andExpect(status().isOk()).andExpect(jsonPath("$.result.isFavorite").value(false));
        mvc.perform(delete("/favorites/550").header("Authorization", otherToken)).andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("FAVORITE404_1"));
        mvc.perform(get("/favorites/550").header("Authorization", token)).andExpect(jsonPath("$.result.isFavorite").value(true));
        mvc.perform(delete("/favorites/550").header("Authorization", token)).andExpect(status().isOk());
        mvc.perform(get("/favorites").header("Authorization", token)).andExpect(jsonPath("$.result").isEmpty());
    }
}
