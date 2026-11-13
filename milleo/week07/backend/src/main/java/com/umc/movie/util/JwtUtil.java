package com.umc.movie.util;

import com.umc.movie.exception.ApiException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

@Component
public class JwtUtil {
    private final SecretKey key;
    private final long expirationSeconds;
    public JwtUtil(@Value("${jwt.secret}") String secret,
                   @Value("${jwt.access-expiration}") long expirationSeconds) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationSeconds = expirationSeconds;
    }
    public String createAccessToken(Long memberId, String email) {
        Instant now = Instant.now();
        return Jwts.builder().subject(memberId.toString()).claim("email", email)
                .issuedAt(Date.from(now)).expiration(Date.from(now.plusSeconds(expirationSeconds)))
                .signWith(key, Jwts.SIG.HS256).compact();
    }
    public Long getMemberId(String token) {
        try {
            Jws<Claims> signed = Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            if (!"HS256".equals(signed.getHeader().getAlgorithm()) || signed.getPayload().getExpiration() == null)
                throw new IllegalArgumentException("Invalid token claims");
            Long id = Long.valueOf(signed.getPayload().getSubject());
            if (id <= 0) throw new IllegalArgumentException("Invalid subject");
            return id;
        } catch (ExpiredJwtException e) {
            throw new ApiException(HttpStatus.UNAUTHORIZED,"AUTH401_4","토큰이 만료되었습니다. 다시 로그인해주세요.");
        } catch (JwtException | IllegalArgumentException e) {
            throw new ApiException(HttpStatus.UNAUTHORIZED,"AUTH401_3","유효하지 않은 토큰입니다.");
        }
    }
}
