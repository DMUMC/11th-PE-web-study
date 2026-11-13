package com.umc.movie;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc.movie.entity.Member;
import com.umc.movie.repository.*;
import com.umc.movie.util.JwtUtil;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;
import static org.assertj.core.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
@SpringBootTest @AutoConfigureMockMvc @ActiveProfiles("test")
class AccountIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @Autowired MemberRepository members;
    @Autowired RatingRepository ratings;
    @Autowired JwtUtil jwt;
    @Value("${jwt.secret}") String secret;
    @BeforeEach void clear() { ratings.deleteAll(); members.deleteAll(); }
    void signup(String email,String nickname) throws Exception {
        mvc.perform(post("/members").contentType("application/json").content(json.writeValueAsString(Map.of("email",email,"nickname",nickname,"password","Umc!1234")))).andExpect(status().isCreated());
    }
    String login(String email) throws Exception {
        var result=mvc.perform(post("/auth/login").contentType("application/json").content(json.writeValueAsString(Map.of("email",email,"password","Umc!1234")))).andExpect(status().isOk()).andExpect(jsonPath("$.result.password").doesNotExist()).andReturn();
        return json.readTree(result.getResponse().getContentAsString()).path("result").path("accessToken").asText();
    }
    @Test void loginFailuresAreIndistinguishable() throws Exception {
        signup("a@umc.com","회원에이");
        var bodies=new ArrayList<String>();
        for(String email:List.of("a@umc.com","missing@umc.com")) {
            bodies.add(mvc.perform(post("/auth/login").contentType("application/json").content(json.writeValueAsString(Map.of("email",email,"password","Wrong!1234")))).andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_1")).andReturn().getResponse().getContentAsString());
        }
        assertThat(bodies.get(0)).isEqualTo(bodies.get(1));
    }
    @Test void verifiesMissingTamperedExpiredAndValidTokens() throws Exception {
        signup("a@umc.com","회원에이");String token=login("a@umc.com");
        mvc.perform(get("/members/me")).andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_2"));
        String[] parts=token.split("\\.");
        var payload=json.readTree(Base64.getUrlDecoder().decode(parts[1]));
        assertThat(payload.has("password")).isFalse();assertThat(payload.has("exp")).isTrue();
        char c=parts[1].charAt(10);parts[1]=parts[1].substring(0,10)+(c=='a'?'b':'a')+parts[1].substring(11);
        mvc.perform(get("/members/me").header("Authorization","Bearer "+String.join(".",parts))).andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_3"));
        String expired=Jwts.builder().subject(payload.path("sub").asText()).expiration(Date.from(Instant.now().minusSeconds(120))).signWith(Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)),Jwts.SIG.HS256).compact();
        mvc.perform(get("/members/me").header("Authorization","Bearer "+expired)).andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_4"));
        mvc.perform(get("/members/me").header("Authorization","Bearer "+token)).andExpect(status().isOk()).andExpect(jsonPath("$.result.email").value("a@umc.com"));
    }
    @Test void updatesSelfAndChecksNicknameWithoutChangingOtherMember() throws Exception {
        signup("a@umc.com","회원에이");signup("b@umc.com","회원비비");String token=login("a@umc.com");
        for(String nickname:List.of("회원에이","수정닉네임")) mvc.perform(patch("/members/me").header("Authorization","Bearer "+token).contentType("application/json").content(json.writeValueAsString(Map.of("nickname",nickname)))).andExpect(status().isOk()).andExpect(jsonPath("$.result.nickname").value(nickname));
        mvc.perform(patch("/members/me").header("Authorization","Bearer "+token).contentType("application/json").content("{\"nickname\":\"회원비비\"}")).andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("MEMBER409_1"));
        mvc.perform(get("/members/me").header("Authorization","Bearer "+login("a@umc.com"))).andExpect(jsonPath("$.result.nickname").value("수정닉네임"));
        assertThat(members.findByEmail("b@umc.com").orElseThrow().getNickname()).isEqualTo("회원비비");
    }
    @Test void cannotSpoofMemberIdOrUseOldWriteRoute() throws Exception {
        signup("a@umc.com","회원에이");String token=login("a@umc.com");
        mvc.perform(post("/ratings").header("Authorization","Bearer "+token).contentType("application/json").content("{\"memberId\":999,\"movieId\":550,\"score\":5}")).andExpect(status().isBadRequest());
        mvc.perform(post("/members/999/ratings").contentType("application/json").content("{\"movieId\":550,\"score\":5}")).andExpect(status().isMethodNotAllowed());
        assertThat(ratings.count()).isZero();
    }
    @Test void frontendBearerPreflightIsAllowed() throws Exception {
        mvc.perform(options("/ratings").header("Origin","http://localhost:5179").header("Access-Control-Request-Method","POST").header("Access-Control-Request-Headers","Content-Type,Authorization"))
            .andExpect(status().isOk()).andExpect(header().string("Access-Control-Allow-Origin","http://localhost:5179"));
    }
}
