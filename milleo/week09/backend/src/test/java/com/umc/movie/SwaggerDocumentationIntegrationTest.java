package com.umc.movie;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SwaggerDocumentationIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;

    @Test
    void swaggerUiIsAccessibleWithoutToken() throws Exception {
        mvc.perform(get("/swagger-ui.html"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/swagger-ui/index.html"));
        mvc.perform(get("/swagger-ui/index.html")).andExpect(status().isOk());
    }

    @Test
    void documentsSummariesJwtAndResponseCodes() throws Exception {
        JsonNode document = json.readTree(mvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsByteArray());
        JsonNode bearer = document.at("/components/securitySchemes/bearerAuth");
        assertThat(bearer.path("type").asText()).isEqualTo("http");
        assertThat(bearer.path("scheme").asText()).isEqualTo("bearer");
        assertThat(bearer.path("bearerFormat").asText()).isEqualTo("JWT");
        assertThat(document.path("security").isEmpty()).isTrue();
        assertThat(document.at("/components/schemas/ApiErrorResponse/properties/result/type").asText())
                .isEqualTo("null");

        check(document, "/members", "post", false, Map.of("201", "COMMON201", "409", "MEMBER4091"));
        check(document, "/auth/login", "post", false, Map.of("200", "COMMON200", "401", "AUTH401_1"));
        check(document, "/members/{memberId}/ratings", "get", false, Map.of("200", "COMMON200", "404", "COMMON404"));
        check(document, "/ratings", "post", true, Map.of("201", "COMMON201", "401", "AUTH401_2", "409", "RATING409_1"));
        check(document, "/ratings/{ratingId}", "patch", true, Map.of("200", "COMMON200", "403", "RATING403_1", "404", "RATING404_1"));
        check(document, "/ratings/{ratingId}", "delete", true, Map.of("200", "COMMON200", "403", "RATING403_1", "404", "RATING404_1"));
        check(document, "/members/me", "get", true, Map.of("200", "COMMON200", "401", "AUTH401_2", "404", "MEMBER404_1"));
        check(document, "/members/me", "patch", true, Map.of("200", "COMMON200", "401", "AUTH401_2", "409", "MEMBER409_1"));
        check(document, "/favorites", "post", true, Map.of("201", "COMMON201", "401", "AUTH401_2", "409", "FAVORITE409_1"));
        check(document, "/favorites", "get", true, Map.of("200", "COMMON200", "401", "AUTH401_2"));
        check(document, "/favorites/{movieId}", "get", true, Map.of("200", "COMMON200", "401", "AUTH401_2"));
        check(document, "/favorites/{movieId}", "delete", true, Map.of("200", "COMMON200", "401", "AUTH401_2", "404", "FAVORITE404_1"));
    }

    private void check(JsonNode document, String path, String method, boolean authenticated,
                       Map<String, String> responseCodes) {
        String operationId = method.toUpperCase() + " " + path;
        JsonNode operation = document.path("paths").path(path).path(method);
        assertThat(operation.path("summary").asText()).as(operationId).isNotBlank();
        if (authenticated) {
            assertThat(operation.at("/security/0").has("bearerAuth")).as(operationId).isTrue();
        } else {
            assertThat(operation.path("security").isEmpty()).as(operationId).isTrue();
        }
        operation.path("parameters").forEach(parameter -> {
            if (parameter.path("name").asText().equals("memberId")) {
                assertThat(parameter.path("in").asText()).as(operationId).isEqualTo("path");
            }
        });
        responseCodes.forEach((http, code) -> {
            JsonNode response = operation.at("/responses/" + http);
            assertThat(response.path("description").asText()).as("%s · HTTP %s", operationId, http)
                    .contains(code);
            if (http.startsWith("4")) {
                assertThat(response.at("/content/application~1json/schema/$ref").asText())
                        .as("%s · HTTP %s", operationId, http)
                        .isEqualTo("#/components/schemas/ApiErrorResponse");
            }
        });
    }
}
