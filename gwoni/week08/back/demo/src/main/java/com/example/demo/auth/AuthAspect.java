package com.example.demo.auth;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
public class AuthAspect {

    @Before("@within(com.example.demo.auth.LoginRequired) || @annotation(com.example.demo.auth.LoginRequired)")
    public void checkLogin() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        AuthContext.requireMemberId(attributes.getRequest());
    }
}
