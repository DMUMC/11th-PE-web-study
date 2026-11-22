package com.umc.movie;

import com.umc.movie.entity.Member;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import com.umc.movie.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("demo")
class MovieRecordIntegrationTests {

    @Autowired
    private MockMvc mvc;
    @Autowired
    private MemberRepository members;
    @Autowired
    private RatingRepository ratings;
    @Autowired
    private JwtUtil jwt;

    private Member member;
    private String token;

    @BeforeEach
    void createMember() {
        member = newMember();
        token = authorizationFor(member);
    }

    @Test
    void favoritesCanOnlyBeReadAndDeletedByTheirOwner() throws Exception {
        String otherToken = authorizationFor(newMember());

        mvc.perform(post("/favorites").contentType(MediaType.APPLICATION_JSON).content("{\"movieId\":550}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("AUTH401_2"));
        addFavorite(0).andExpect(status().isBadRequest());
        addFavorite(550).andExpect(status().isCreated())
                .andExpect(jsonPath("$.result.movieId").value(550));
        addFavorite(551).andExpect(status().isCreated());
        addFavorite(550).andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("FAVORITE409_1"));

        mvc.perform(get("/favorites").header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result[0].movieId").value(551))
                .andExpect(jsonPath("$.result[1].movieId").value(550));
        mvc.perform(get("/favorites").header(HttpHeaders.AUTHORIZATION, otherToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").isEmpty());
        mvc.perform(get("/favorites/550").header(HttpHeaders.AUTHORIZATION, otherToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result.isFavorite").value(false));
        mvc.perform(delete("/favorites/550").header(HttpHeaders.AUTHORIZATION, otherToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("FAVORITE404_1"));
        mvc.perform(get("/favorites/550").header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result.isFavorite").value(true));
        mvc.perform(delete("/favorites/550").header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result").value(nullValue()));
        mvc.perform(get("/favorites/550").header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result.isFavorite").value(false));
    }

    @Test
    void movieRecordsSaveBothItemsOrJustTheRatingAsRequested() throws Exception {
        addRecord(550, true).andExpect(status().isCreated())
                .andExpect(jsonPath("$.result.rating.movieId").value(550))
                .andExpect(jsonPath("$.result.favorite.movieId").value(550));
        addRecord(551, false).andExpect(status().isCreated())
                .andExpect(jsonPath("$.result.rating.movieId").value(551))
                .andExpect(jsonPath("$.result.favorite").value(nullValue()));
        addRecord(551, true).andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("RATING409_1"));
        mvc.perform(get("/favorites/551").header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result.isFavorite").value(false));
    }

    @Test
    void movieRecordRollsBackTheRatingWhenFavoriteCreationFails() throws Exception {
        addFavorite(550).andExpect(status().isCreated());
        addRecord(550, true).andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("FAVORITE409_1"));

        assertThat(ratings.existsByMember_MemberIdAndMovieId(member.getMemberId(), 550L)).isFalse();
        mvc.perform(get("/favorites/550").header(HttpHeaders.AUTHORIZATION, token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result.isFavorite").value(true));
    }

    private ResultActions addFavorite(long movieId) throws Exception {
        return mvc.perform(post("/favorites").header(HttpHeaders.AUTHORIZATION, token)
                .contentType(MediaType.APPLICATION_JSON).content("{\"movieId\":%d}".formatted(movieId)));
    }

    private ResultActions addRecord(long movieId, boolean addToFavorites) throws Exception {
        return mvc.perform(post("/movie-records").header(HttpHeaders.AUTHORIZATION, token)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":%d,\"score\":5,\"addToFavorites\":%b}".formatted(movieId, addToFavorites)));
    }

    private Member newMember() {
        String nickname = UUID.randomUUID().toString().substring(0, 12);
        return members.save(Member.builder()
                .email(nickname + "@example.com")
                .nickname(nickname)
                .password("unused-by-test")
                .build());
    }

    private String authorizationFor(Member owner) {
        return "Bearer " + jwt.createAccessToken(owner.getMemberId(), owner.getEmail());
    }
}
