package com.umc.movie.service;

import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.UpdateRatingRequest;
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

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class RatingServiceTest {
    @Mock private RatingRepository ratingRepository;
    @Mock private MemberRepository memberRepository;
    @InjectMocks private RatingService ratingService;

    @Test
    void rejectsDuplicateRatingWithRating409_1WithoutSaving() {
        Member member = new Member("member@umc.com", "unused", "영화팬");
        given(memberRepository.findById(1L)).willReturn(Optional.of(member));
        given(ratingRepository.existsByMember_MemberIdAndMovieId(1L, 550L)).willReturn(true);

        assertThatExceptionOfType(ApiException.class)
                .isThrownBy(() -> ratingService.create(1L, new CreateRatingRequest(550L, 5, null)))
                .satisfies(error -> assertThat(error.getCode()).isEqualTo("RATING409_1"));
        verify(ratingRepository, never()).save(any(Rating.class));
    }

    @Test
    void rejectsEditingAnotherMembersRatingWithRating403_1WithoutChangingScore() {
        Member owner = org.mockito.Mockito.mock(Member.class);
        given(owner.getMemberId()).willReturn(2L);
        Rating rating = new Rating(owner, 550L, 4, "원래 후기");
        given(ratingRepository.findById(10L)).willReturn(Optional.of(rating));

        assertThatExceptionOfType(ApiException.class)
                .isThrownBy(() -> ratingService.update(1L, 10L, new UpdateRatingRequest(1, null)))
                .satisfies(error -> assertThat(error.getCode()).isEqualTo("RATING403_1"));
        assertThat(rating.getScore()).isEqualTo(4);
        assertThat(rating.getComment()).isEqualTo("원래 후기");
        verify(ratingRepository, never()).saveAndFlush(any(Rating.class));
    }
}
