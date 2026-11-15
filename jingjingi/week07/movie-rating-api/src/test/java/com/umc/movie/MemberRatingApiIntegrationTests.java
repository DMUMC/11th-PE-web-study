package com.umc.movie;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class MemberRatingApiIntegrationTests {

    private static final String PASSWORD = "Umc!1234";

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private RatingRepository ratingRepository;
    @Autowired private MemberRepository memberRepository;

    @BeforeEach
    void cleanDatabase() {
        ratingRepository.deleteAll();
        memberRepository.deleteAll();
    }

    @Test
    @DisplayName("Postman 9개 단계 시나리오: 인증·인가·평점 CRUD")
    void completeNineStepScenario() throws Exception {
        // 1. 회원 A, B 가입
        signUp("a@umc.com", "회원A");
        signUp("b@umc.com", "회원B");

        // 2. A, B 로그인 및 각 accessToken 확보
        String tokenA = login("a@umc.com");
        String tokenB = login("b@umc.com");
        assertThat(tokenA).isNotBlank();
        assertThat(tokenB).isNotBlank();

        // 3. 토큰 A로 평점 등록: memberId가 요청 바디에 없음
        MvcResult created = mockMvc.perform(post("/ratings")
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"movieId":680,"score":5,"comment":"다시 보고 싶은 영화예요."}
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.movieId").value(680))
                .andReturn();
        long ratingId = responseJson(created).path("result").path("ratingId").asLong();

        // 4. 같은 영화에 중복 등록
        mockMvc.perform(post("/ratings")
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":680,\"score\":4,\"comment\":\"중복 평점\"}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("RATING409_1"));

        // 5. 본인 토큰 A로 수정
        mockMvc.perform(patch("/ratings/{ratingId}", ratingId)
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"score\":4,\"comment\":\"평점과 후기를 수정했어요.\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("COMMON200"))
                .andExpect(jsonPath("$.result.score").value(4));

        // 6. 다른 회원의 토큰 B로 A의 평점 수정
        mockMvc.perform(patch("/ratings/{ratingId}", ratingId)
                        .header("Authorization", "Bearer " + tokenB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"score\":1,\"comment\":\"남의 평점 수정 시도\"}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("RATING403_1"));

        // 7. Authorization 헤더 없이 요청
        mockMvc.perform(patch("/ratings/{ratingId}", ratingId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"score\":2,\"comment\":\"토큰 없음\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("AUTH401_2"));

        // 8. 존재하지 않는 평점 삭제
        mockMvc.perform(delete("/ratings/99999")
                        .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("RATING404_1"));

        // 9. 본인 평점 삭제
        mockMvc.perform(delete("/ratings/{ratingId}", ratingId)
                        .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("COMMON200"))
                .andExpect(jsonPath("$.result").doesNotExist());
    }

    @Test
    @DisplayName("토큰 없이 내 정보를 요청하면 AUTH401_2를 반환한다")
    void getMyInfoWithoutToken() throws Exception {
        mockMvc.perform(get("/members/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("AUTH401_2"));
    }

    @Test
    @DisplayName("로그인 후 내 정보를 조회하고 닉네임을 수정한다")
    void getAndUpdateMyInfo() throws Exception {
        signUp("movie@umc.com", "영화광");
        String token = login("movie@umc.com");

        mockMvc.perform(get("/members/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result.email").value("movie@umc.com"))
                .andExpect(jsonPath("$.result.nickname").value("영화광"));

        mockMvc.perform(patch("/members/me")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nickname\":\"영화마스터\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result.nickname").value("영화마스터"));
    }

    @Test
    @DisplayName("위조된 JWT는 AUTH401_3을 반환한다")
    void rejectTamperedToken() throws Exception {
        signUp("token@umc.com", "토큰검증");
        String token = login("token@umc.com");
        String[] parts = token.split("\\.");
        char replacement = parts[1].charAt(0) == 'A' ? 'B' : 'A';
        String tampered = parts[0] + "." + replacement + parts[1].substring(1) + "." + parts[2];

        mockMvc.perform(get("/members/me").header("Authorization", "Bearer " + tampered))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("AUTH401_3"));
    }

    private void signUp(String email, String nickname) throws Exception {
        mockMvc.perform(post("/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new SignUpBody(email, PASSWORD, nickname))))
                .andExpect(status().isCreated());
    }

    private String login(String email) throws Exception {
        MvcResult result = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginBody(email, PASSWORD))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("COMMON200"))
                .andExpect(jsonPath("$.result.accessToken").isNotEmpty())
                .andReturn();
        return responseJson(result).path("result").path("accessToken").asText();
    }

    private JsonNode responseJson(MvcResult result) throws Exception {
        return objectMapper.readTree(result.getResponse().getContentAsString());
    }

    private record SignUpBody(String email, String password, String nickname) {}
    private record LoginBody(String email, String password) {}
}
