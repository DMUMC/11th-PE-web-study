package com.umc.movie;

import com.umc.movie.entity.Member;
import com.umc.movie.repository.MemberRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class MemberApiIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired MemberRepository members;

    @BeforeEach
    void seedMember() {
        members.saveAndFlush(new Member("noco@umc.com", "dummy-not-for-login", "수현"));
    }

    @Test
    void nicknameAvailabilityReflectsDatabase() throws Exception {
        mvc.perform(get("/members/nickname/{nickname}", "수현"))
                .andExpect(status().isOk())
                .andExpect(content().json("{\"available\":false}", true));
        mvc.perform(get("/members/nickname/{nickname}", "새로운밀러"))
                .andExpect(status().isOk())
                .andExpect(content().json("{\"available\":true}", true));
    }

    @Test
    void emailAvailabilityPreservesDotsAndAtSign() throws Exception {
        mvc.perform(get("/members/email/{email}", "noco@umc.com"))
                .andExpect(status().isOk())
                .andExpect(content().json("{\"available\":false}", true));
        mvc.perform(get("/members/email/{email}", "new-user@example.com"))
                .andExpect(status().isOk())
                .andExpect(content().json("{\"available\":true}", true));
    }
}
