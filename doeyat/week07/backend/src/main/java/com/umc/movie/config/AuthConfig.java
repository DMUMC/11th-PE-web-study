package com.umc.movie.config;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;
@Configuration @RequiredArgsConstructor
public class AuthConfig implements WebMvcConfigurer {
    private final AuthInterceptor interceptor;
    @Override public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(interceptor).addPathPatterns("/members/me", "/ratings", "/ratings/**");
    }
}
