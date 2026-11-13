package com.example.demo.auth;

import com.example.demo.common.exception.ErrorStatus;
import com.example.demo.common.exception.GeneralException;
import jakarta.servlet.http.HttpServletRequest;

public final class AuthContext {

    static final String MEMBER_ID = AuthContext.class.getName() + ".memberId";
    static final String ERROR = AuthContext.class.getName() + ".error";

    private AuthContext() {
    }

    public static Long requireMemberId(HttpServletRequest request) {
        if (request.getAttribute(ERROR) instanceof ErrorStatus error) {
            throw new GeneralException(error);
        }
        if (request.getAttribute(MEMBER_ID) instanceof Long memberId) {
            return memberId;
        }
        throw new GeneralException(ErrorStatus.AUTH_TOKEN_MISSING);
    }
}
