package com.example.demo.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MemberUpdateRequest {

    @NotEmpty(message = "닉네임을 입력해주세요.")
    private String nickname;
}
