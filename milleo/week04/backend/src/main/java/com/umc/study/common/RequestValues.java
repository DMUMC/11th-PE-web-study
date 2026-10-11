package com.umc.study.common;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public final class RequestValues {
    private RequestValues() {}

    public static long readPositiveId(Map<String, Object> body, String field) {
        Object value = body.get(field);
        if (!(value instanceof Byte || value instanceof Short
                || value instanceof Integer || value instanceof Long)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, field + "는 양의 정수로 입력해주세요.");
        }
        long id = ((Number) value).longValue();
        requirePositiveId(id, field);
        return id;
    }

    public static void requirePositiveId(long id, String field) {
        if (id <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, field + "는 양의 정수로 입력해주세요.");
        }
    }
}
