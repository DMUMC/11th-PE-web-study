package com.umc.movie.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI movieOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("doeyat 영화 서비스 API").version("v1")
                        .description("9주차: 회원·평점·즐겨찾기 문서와 테스트. 공개 API는 토큰 없이 호출하고, 자물쇠가 있는 API는 Authorize에 JWT만 입력합니다."))
                .components(new Components().addSecuritySchemes("bearerAuth", new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")));
    }
}
