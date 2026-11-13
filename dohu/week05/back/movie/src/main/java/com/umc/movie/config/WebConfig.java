package com.umc.movie.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // 프론트 개발 서버(Vite) 출처만 허용한다.
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PATCH", "DELETE")
                .allowedHeaders("*");
    }
}
