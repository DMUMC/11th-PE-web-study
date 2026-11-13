package com.umc.movie.config;

import com.umc.movie.exception.ApiException;
import com.umc.movie.util.JwtUtil;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component @RequiredArgsConstructor
public class AuthInterceptor implements HandlerInterceptor {
    private final JwtUtil jwtUtil;
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if ("OPTIONS".equals(request.getMethod())) return true;
        String authorization = request.getHeader("Authorization");
        if (authorization == null || authorization.isBlank())
            throw new ApiException(HttpStatus.UNAUTHORIZED,"AUTH401_2","로그인이 필요한 요청입니다.");
        if (!authorization.regionMatches(true,0,"Bearer ",0,7) || authorization.substring(7).isBlank())
            throw new ApiException(HttpStatus.UNAUTHORIZED,"AUTH401_3","유효하지 않은 토큰입니다.");
        Long memberId = jwtUtil.getMemberId(authorization.substring(7).trim());
        request.setAttribute("memberId", memberId);
        response.setHeader("Cache-Control", "no-store");
        return true;
    }
}
