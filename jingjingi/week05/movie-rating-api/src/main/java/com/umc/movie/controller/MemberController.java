package com.umc.movie.controller;

import com.umc.movie.dto.AvailabilityResponse;
import com.umc.movie.service.MemberService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/members")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping("/nickname/{nickname}")
    public AvailabilityResponse checkNickname(@PathVariable String nickname) {
        return memberService.checkNickname(nickname);
    }

    @GetMapping("/email/{email}")
    public AvailabilityResponse checkEmail(@PathVariable String email) {
        return memberService.checkEmail(email);
    }
}
