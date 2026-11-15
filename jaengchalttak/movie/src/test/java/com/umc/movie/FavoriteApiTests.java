package com.umc.movie;

import com.umc.movie.entity.Favorite;
import com.umc.movie.entity.Member;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import com.umc.movie.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.nullValue;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.reset;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class FavoriteApiTests {
    @Autowired private MockMvc mvc;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private MemberRepository members;
    @Autowired private RatingRepository ratings;
    @MockitoSpyBean private FavoriteRepository favorites;

    private Member owner;

    @BeforeEach
    void setUp() {
        owner = members.save(new Member("favorite-owner@example.com", "dummy", "즐겨찾기회원"));
    }

    @Test
    void registersListsChecksAndRemovesOnlyMyFavorites() throws Exception {
        Member other = members.save(new Member("favorite-other@example.com", "dummy", "다른즐겨찾기회원"));
        String otherToken = "Bearer " + jwtUtil.createAccessToken(other.getMemberId(), other.getEmail());
        String token = bearer();
        mvc.perform(get("/favorites").header("Authorization", token))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result").isEmpty());
        expectStatus(token, 550, false);
        submit("/favorites", token, "{\"movieId\":550}")
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.result.favoriteId").isNumber())
                .andExpect(jsonPath("$.result.movieId").value(550))
                .andExpect(jsonPath("$.result.createdAt").isString());
        expectStatus(token, 550, true);
        expectStatus(otherToken, 550, false);
        submit("/favorites", otherToken, "{\"movieId\":550}").andExpect(status().isCreated());
        submit("/favorites", otherToken, "{\"movieId\":238}").andExpect(status().isCreated());
        submit("/favorites", token, "{\"movieId\":155}").andExpect(status().isCreated());
        mvc.perform(get("/favorites").header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result.length()").value(2))
                .andExpect(jsonPath("$.result[0].movieId").value(155))
                .andExpect(jsonPath("$.result[1].movieId").value(550));
        mvc.perform(delete("/favorites/550").header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("COMMON200"))
                .andExpect(jsonPath("$.result").value(nullValue()));
        expectStatus(token, 550, false);
        expectStatus(otherToken, 550, true);
        mvc.perform(delete("/favorites/550").header("Authorization", token))
                .andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("FAVORITE404_1"));
    }

    @Test
    void rejectsMissingTokenBadMovieIdAndDuplicateFavorite() throws Exception {
        mvc.perform(post("/favorites").contentType(MediaType.APPLICATION_JSON).content("{\"movieId\":550}"))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_2"));
        mvc.perform(post("/movie-records").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":550,\"score\":4,\"addToFavorites\":true}"))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_2"));
        submit("/favorites", bearer(), "{\"movieId\":0}").andExpect(status().isBadRequest());
        submit("/favorites", bearer(), "{\"movieId\":550}").andExpect(status().isCreated());
        submit("/favorites", bearer(), "{\"movieId\":550}")
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("FAVORITE409_1"));
        assertThat(favorites.findByMember_MemberIdOrderByFavoriteIdDesc(owner.getMemberId())).hasSize(1);
    }

    @Test
    void createsBothRecordsOrJustRatingAccordingToRequest() throws Exception {
        submit("/movie-records", bearer(), "{\"movieId\":238,\"score\":5,\"addToFavorites\":true}")
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.result.rating.movieId").value(238))
                .andExpect(jsonPath("$.result.favorite.movieId").value(238));
        submit("/movie-records", bearer(), "{\"movieId\":238,\"score\":5,\"addToFavorites\":true}")
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("RATING409_1"));
        submit("/favorites", bearer(), "{\"movieId\":550}").andExpect(status().isCreated());
        submit("/movie-records", bearer(), "{\"movieId\":550,\"score\":4,\"addToFavorites\":true}")
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("FAVORITE409_1"));
        assertThat(ratings.existsByMember_MemberIdAndMovieId(owner.getMemberId(), 550L)).isFalse();
        submit("/movie-records", bearer(), "{\"movieId\":550,\"score\":4,\"addToFavorites\":false}")
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.result.rating.score").value(4))
                .andExpect(jsonPath("$.result.favorite").value(nullValue()));
        assertThat(ratings.findByMember_MemberIdOrderByRatingIdDesc(owner.getMemberId())).hasSize(2);
        assertThat(favorites.findByMember_MemberIdOrderByFavoriteIdDesc(owner.getMemberId())).hasSize(2);
    }

    @Test
    void validatesMovieRecordBeforeWriting() throws Exception {
        submit("/movie-records", bearer(), "{\"movieId\":238,\"score\":6,\"addToFavorites\":true}")
                .andExpect(status().isBadRequest());
        submit("/movie-records", bearer(), "{\"movieId\":238,\"score\":4}")
                .andExpect(status().isBadRequest());
        assertThat(ratings.findByMember_MemberIdOrderByRatingIdDesc(owner.getMemberId())).isEmpty();
        assertThat(favorites.findByMember_MemberIdOrderByFavoriteIdDesc(owner.getMemberId())).isEmpty();
    }

    @Test
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    void rollsBackRatingWhenFavoriteInsertFailsInDatabase() throws Exception {
        long memberId = owner.getMemberId();
        long movieId = 238L;
        try {
            favorites.saveAndFlush(new Favorite(owner, movieId));
            // 동시 요청이 사전 검사를 통과한 경우를 재현합니다. INSERT는 실제 DB에서 실행됩니다.
            doReturn(false).when(favorites).existsByMember_MemberIdAndMovieId(memberId, movieId);
            submit("/movie-records", bearer(), "{\"movieId\":238,\"score\":5,\"addToFavorites\":true}")
                    .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("COMMON4091"));
            assertThat(ratings.existsByMember_MemberIdAndMovieId(memberId, movieId)).isFalse();
            assertThat(favorites.findByMember_MemberIdOrderByFavoriteIdDesc(memberId)).hasSize(1);
        } finally {
            reset(favorites);
            ratings.deleteAll(ratings.findByMember_MemberIdOrderByRatingIdDesc(memberId));
            favorites.deleteAll(favorites.findByMember_MemberIdOrderByFavoriteIdDesc(memberId));
            members.deleteById(memberId);
        }
    }

    private String bearer() {
        return "Bearer " + jwtUtil.createAccessToken(owner.getMemberId(), owner.getEmail());
    }

    private ResultActions submit(String path, String token, String body) throws Exception {
        return mvc.perform(post(path).header("Authorization", token).contentType(MediaType.APPLICATION_JSON).content(body));
    }

    private void expectStatus(String token, long movieId, boolean expected) throws Exception {
        mvc.perform(get("/favorites/{movieId}", movieId).header("Authorization", token))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result.isFavorite").value(expected));
    }
}
