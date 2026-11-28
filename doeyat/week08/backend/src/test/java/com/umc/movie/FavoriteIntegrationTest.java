package com.umc.movie;
import com.umc.movie.repository.FavoriteRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import static org.assertj.core.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
class FavoriteIntegrationTest extends AccountIntegrationTest {
 @Autowired FavoriteRepository favorites;
 @BeforeEach void clearFavorites() { favorites.deleteAll(); }
 @Test void favoritesAndAtomicRollback() throws Exception {
  signup("favorite@umc.com","favorite");String token=login("favorite@umc.com");String auth="Bearer "+token;
  mvc.perform(post("/favorites").contentType("application/json").content("{\"movieId\":238}")).andExpect(status().isUnauthorized());
  mvc.perform(get("/favorites/238").header("Authorization",auth)).andExpect(jsonPath("$.result.isFavorite").value(false));
  mvc.perform(post("/favorites").header("Authorization",auth).contentType("application/json").content("{\"movieId\":238}")).andExpect(status().isCreated());
  mvc.perform(post("/favorites").header("Authorization",auth).contentType("application/json").content("{\"movieId\":238}")).andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("FAVORITE409_1"));
  mvc.perform(post("/movie-records").header("Authorization",auth).contentType("application/json").content("{\"movieId\":238,\"score\":5,\"comment\":\"test\",\"addToFavorites\":true}")).andExpect(status().isConflict());
  assertThat(ratings.count()).isZero();
  mvc.perform(delete("/favorites/238").header("Authorization",auth)).andExpect(status().isOk());
  mvc.perform(delete("/favorites/238").header("Authorization",auth)).andExpect(status().isNotFound());
  mvc.perform(post("/movie-records").header("Authorization",auth).contentType("application/json").content("{\"movieId\":238,\"score\":5,\"addToFavorites\":true}")).andExpect(status().isCreated()).andExpect(jsonPath("$.result.favorite.movieId").value(238)).andExpect(jsonPath("$.result.rating.score").value(5));
  assertThat(ratings.count()).isEqualTo(1);assertThat(favorites.count()).isEqualTo(1);
  favorites.deleteAll();
 }
}
