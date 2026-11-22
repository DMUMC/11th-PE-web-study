package com.umc.movie;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc.movie.entity.*;
import com.umc.movie.repository.*;
import com.umc.movie.util.JwtUtil;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.*;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import java.util.*;
import static org.assertj.core.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
@SpringBootTest @AutoConfigureMockMvc @ActiveProfiles("test")
class FavoriteIntegrationTest {
 @Autowired MockMvc mvc; @Autowired ObjectMapper json;
 @Autowired MemberRepository members; @Autowired RatingRepository ratings;
 @Autowired FavoriteRepository favorites; @Autowired JwtUtil jwt;
 Long owner,other;
 @BeforeEach void setup(){favorites.deleteAll();ratings.deleteAll();members.deleteAll();
 owner=members.saveAndFlush(new Member("owner@example.com","test-only","밀러")).getMemberId();
 other=members.saveAndFlush(new Member("other@example.com","test-only","다른회원")).getMemberId();}
 @AfterEach void cleanup(){favorites.deleteAll();ratings.deleteAll();members.deleteAll();}
 String token(Long id){return "Bearer "+jwt.createAccessToken(id,"test@example.com");}
 ResultActions send(MockHttpServletRequestBuilder r,Long id,Object body)throws Exception{
 if(id!=null)r.header("Authorization",token(id));
 return mvc.perform(r.contentType("application/json").content(json.writeValueAsString(body)));}
 ResultActions favorite(Long id,long movie)throws Exception{return send(post("/favorites"),id,Map.of("movieId",movie));}
 @Test void fullLifecycleAndIsolation()throws Exception{
 mvc.perform(get("/favorites/550").header("Authorization",token(owner))).andExpect(jsonPath("$.result.isFavorite").value(false));
 favorite(owner,550).andExpect(status().isCreated()).andExpect(jsonPath("$.result.createdAt").isNotEmpty());
 favorite(owner,550).andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("FAVORITE409_1"));
 favorite(owner,238).andExpect(status().isCreated());
 mvc.perform(get("/favorites").header("Authorization",token(owner))).andExpect(jsonPath("$.result.length()").value(2)).andExpect(jsonPath("$.result[0].movieId").value(238));
 mvc.perform(get("/favorites").header("Authorization",token(other))).andExpect(jsonPath("$.result").isEmpty());
 mvc.perform(delete("/favorites/550").header("Authorization",token(other))).andExpect(status().isNotFound());
 mvc.perform(get("/favorites/550").header("Authorization",token(owner))).andExpect(jsonPath("$.result.isFavorite").value(true));
 mvc.perform(delete("/favorites/550").header("Authorization",token(owner))).andExpect(status().isOk()).andExpect(jsonPath("$.result").doesNotExist());
 mvc.perform(get("/favorites/550").header("Authorization",token(owner))).andExpect(jsonPath("$.result.isFavorite").value(false));
 mvc.perform(delete("/favorites/550").header("Authorization",token(owner))).andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("FAVORITE404_1"));
 }
 @Test void authValidationAndForgedMemberId()throws Exception{
 for(var r:List.of(post("/favorites"),get("/favorites"),get("/favorites/550"),delete("/favorites/550"),post("/movie-records")))
 mvc.perform(r).andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_2"));
 favorite(owner,0).andExpect(status().isBadRequest());
 send(post("/favorites"),owner,Map.of("movieId",550,"memberId",other)).andExpect(status().isBadRequest());
 favorite(owner,550).andExpect(status().isCreated());
 assertThat(favorites.existsByMember_MemberIdAndMovieId(owner,550L)).isTrue();
 assertThat(favorites.existsByMember_MemberIdAndMovieId(other,550L)).isFalse();
 }
 @Test void movieRecordCommitAndRollbackAfterRatingFlush()throws Exception{
 var body=Map.of("movieId",238,"score",5,"comment","다시 보고 싶은 영화입니다.","addToFavorites",true);
 send(post("/movie-records"),owner,body).andExpect(status().isCreated()).andExpect(jsonPath("$.result.rating.movieId").value(238)).andExpect(jsonPath("$.result.favorite.movieId").value(238));
 send(post("/movie-records"),owner,body).andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("RATING409_1"));
 favorite(owner,550).andExpect(status().isCreated());
 send(post("/movie-records"),owner,Map.of("movieId",550,"score",5,"addToFavorites",true)).andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("FAVORITE409_1"));
 assertThat(ratings.existsByMember_MemberIdAndMovieId(owner,550L)).isFalse();
 assertThat(ratings.count()).isEqualTo(1);assertThat(favorites.count()).isEqualTo(2);
 send(post("/movie-records"),owner,Map.of("movieId",680,"score",4,"addToFavorites",false)).andExpect(status().isCreated()).andExpect(jsonPath("$.result.favorite").doesNotExist());
 assertThat(favorites.existsByMember_MemberIdAndMovieId(owner,680L)).isFalse();
 }
 @Test void uniqueConstraintAndConcurrentRequests()throws Exception{
 var ready=new java.util.concurrent.CountDownLatch(2);var start=new java.util.concurrent.CountDownLatch(1);
 try(var pool=java.util.concurrent.Executors.newFixedThreadPool(2)){
 java.util.concurrent.Callable<String> task=()->{ready.countDown();start.await();var response=favorite(owner,550).andReturn().getResponse();return response.getStatus()+":"+json.readTree(response.getContentAsString()).path("code").asText();};
 var a=pool.submit(task);var b=pool.submit(task);assertThat(ready.await(5,java.util.concurrent.TimeUnit.SECONDS)).isTrue();start.countDown();
 assertThat(List.of(a.get(15,java.util.concurrent.TimeUnit.SECONDS),b.get(15,java.util.concurrent.TimeUnit.SECONDS))).containsExactlyInAnyOrder("201:COMMON201","409:FAVORITE409_1");}
 assertThat(favorites.count()).isEqualTo(1);
 assertThatThrownBy(()->favorites.saveAndFlush(new Favorite(members.findById(owner).orElseThrow(),550L))).isInstanceOf(org.springframework.dao.DataIntegrityViolationException.class);
 }
}
