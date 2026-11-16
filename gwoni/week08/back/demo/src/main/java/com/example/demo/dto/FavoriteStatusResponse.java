package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FavoriteStatusResponse {

    // boolean getter가 isFavorite()라서 이름을 고정하지 않으면 "favorite"로 직렬화됨
    @JsonProperty("isFavorite")
    private final boolean isFavorite;
}
