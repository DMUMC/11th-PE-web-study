package com.umc.movie.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.media.BooleanSchema;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.media.ObjectSchema;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.media.StringSchema;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Set;

@Configuration
@OpenAPIDefinition(info = @Info(
        title = "밀러 · UMC Week 09 Movie API",
        version = "week09",
        description = "회원가입과 로그인으로 JWT를 발급받아 내 정보, 평점 작성, 즐겨찾기를 사용합니다. 🔒 표시가 있는 API는 Bearer JWT가 필요합니다."
))
@SecurityScheme(name = OpenApiConfig.BEARER_AUTH, type = SecuritySchemeType.HTTP,
        scheme = "bearer", bearerFormat = "JWT",
        description = "POST /auth/login 응답의 result.accessToken 값만 입력하세요.")
public class OpenApiConfig {
    public static final String BEARER_AUTH = "bearerAuth";
    public static final String JWT_ERRORS =
            "AUTH401_2 토큰 없음 / AUTH401_3 유효하지 않은 토큰 / AUTH401_4 만료된 토큰";
    private static final String ERROR_SCHEMA = "ApiErrorResponse";

    @Bean
    OpenApiCustomizer documentErrorEnvelope() {
        return document -> {
            var error = new ObjectSchema()
                    .addProperty("isSuccess", new BooleanSchema().example(false))
                    .addProperty("code", new StringSchema())
                    .addProperty("message", new StringSchema())
                    .addProperty("result", new Schema<>().types(Set.of("null")))
                    .required(List.of("isSuccess", "code", "message", "result"));
            document.getComponents().addSchemas(ERROR_SCHEMA, error);
            document.getPaths().values().stream()
                    .flatMap(path -> path.readOperations().stream())
                    .flatMap(operation -> operation.getResponses().entrySet().stream())
                    .filter(entry -> entry.getKey().startsWith("4") || entry.getKey().startsWith("5"))
                    .forEach(entry -> entry.getValue().content(new Content().addMediaType("application/json",
                            new MediaType().schema(new Schema<>().$ref("#/components/schemas/" + ERROR_SCHEMA)))));
        };
    }
}
