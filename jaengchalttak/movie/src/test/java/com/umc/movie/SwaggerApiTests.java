package com.umc.movie;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SwaggerApiTests {
    @Autowired private MockMvc mvc;
    @Autowired private ObjectMapper json;

    @Test
    void swaggerUiAndSpecArePublicAndOnlyProtectedOperationsRequireBearer() throws Exception {
        mvc.perform(get("/swagger-ui.html"))
                .andExpect(status().isFound())
                .andExpect(header().string(HttpHeaders.LOCATION, "/swagger-ui/index.html"));
        mvc.perform(get("/swagger-ui/index.html")).andExpect(status().isOk());
        mvc.perform(get("/v3/api-docs/swagger-config")).andExpect(status().isOk());

        JsonNode document = json.readTree(mvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsByteArray());
        assertThat(document.at("/components/securitySchemes/bearerAuth/scheme").asText()).isEqualTo("bearer");
        for (String path : new String[]{"/members/post", "/auth/login/post", "/members/{memberId}/ratings/get",
                "/members/nickname/{nickname}/get", "/members/email/{email}/get"}) {
            JsonNode operation = operation(document, path);
            assertThat(operation.path("summary").asText()).isNotBlank();
            assertThat(operation.path("security").isEmpty()).isTrue();
        }
        for (String path : new String[]{"/members/me/get", "/members/me/patch", "/ratings/post",
                "/ratings/{ratingId}/patch", "/ratings/{ratingId}/delete", "/favorites/get", "/favorites/post",
                "/favorites/{movieId}/get", "/favorites/{movieId}/delete", "/movie-records/post"}) {
            JsonNode operation = operation(document, path);
            assertThat(operation.path("summary").asText()).isNotBlank();
            assertThat(operation.at("/security/0/bearerAuth").isArray()).isTrue();
            assertThat(operation.at("/responses/401/description").asText()).contains("AUTH401_2");
        }

        JsonNode favorites = operation(document, "/favorites/post");
        assertThat(favorites.at("/responses/201/content/application~1json/example/result/movieId").asLong()).isEqualTo(550L);
        assertThat(favorites.at("/responses/409/content/application~1json/example/code").asText()).isEqualTo("FAVORITE409_1");
        assertThat(operation(document, "/ratings/post").at("/responses/201").isObject()).isTrue();
        assertThat(operation(document, "/ratings/{ratingId}/patch").at("/responses/403/description").asText())
                .contains("RATING403_1");
        assertThat(document.at("/components/schemas/SignUpRequest/properties/email/example").asText())
                .isEqualTo("challenger@umc.com");
    }

    private JsonNode operation(JsonNode document, String pathAndMethod) {
        int separator = pathAndMethod.lastIndexOf('/');
        return document.path("paths").path(pathAndMethod.substring(0, separator)).path(pathAndMethod.substring(separator + 1));
    }
}
