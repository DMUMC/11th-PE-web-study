package com.umc.movie.service;

import com.umc.movie.dto.RatingCreateRequest;
import com.umc.movie.dto.RatingUpdateRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RatingServiceTest {
    @Mock RatingRepository ratings;
    @Mock MemberRepository members;
    @InjectMocks RatingService service;

    @Test
    void rejectsDuplicateRatingWithRating409_1() {
        long memberId = 1L;
        long movieId = 550L;
        Member member = new Member("owner@example.com", "test-only", "밀러");
        when(members.findById(memberId)).thenReturn(Optional.of(member));
        when(ratings.existsByMember_MemberIdAndMovieId(memberId, movieId)).thenReturn(true);

        assertThatThrownBy(() -> service.create(memberId, new RatingCreateRequest(movieId, 5, "후기")))
                .isInstanceOfSatisfying(ApiException.class, error -> {
                    assertThat(error.getStatus()).isEqualTo(HttpStatus.CONFLICT);
                    assertThat(error.getCode()).isEqualTo("RATING409_1");
                });
    }

    @Test
    void rejectsEditingAnotherMembersRatingWithRating403_1() {
        Member owner = new Member("owner@example.com", "test-only", "밀러");
        ReflectionTestUtils.setField(owner, "memberId", 1L);
        Rating rating = new Rating(owner, 550L, 5, "원래 후기");
        when(ratings.findById(10L)).thenReturn(Optional.of(rating));

        assertThatThrownBy(() -> service.update(2L, 10L, new RatingUpdateRequest(2, "다른 후기")))
                .isInstanceOfSatisfying(ApiException.class, error -> {
                    assertThat(error.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
                    assertThat(error.getCode()).isEqualTo("RATING403_1");
                });
        assertThat(rating.getScore()).isEqualTo(5);
        assertThat(rating.getComment()).isEqualTo("원래 후기");
    }
}
