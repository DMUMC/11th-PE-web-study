# 미션 적립 서비스 ERD 설계

IA & 와이어프레임 분석을 바탕으로 설계한 ERD입니다.

## 설계 범위

| 구분 | 포함 여부 | 비고 |
| --- | --- | --- |
| 로그인 / 회원가입 / 소셜 로그인 | O | `member`, `member_social`, `member_agreement` |
| 온보딩 선호 음식 조사 | O | `member_food_category` |
| 홈 / 지역 / 가게 정보 | O | `region`, `store`, `food_category` |
| 미션 / 미션 수행 내역 | O | `mission`, `member_mission` |
| 리뷰 (리뷰 작성, 사장님 답글) | O | `review`, `review_image`, `review_reply` |
| 포인트 적립 내역 | O | `point_history` (미션 보상 추적용 최소 범위) |
| 1:1 문의 | O | `inquiry`, `inquiry_answer` |
| 알림 | O | `notification` (알림 *설정*은 제외) |
| 지도 / 검색 | X | PASS |
| 포인트 관리(전환·정산) / 알림 설정 | X | PASS |
| 사장님 점포 관리 화면 | X | PASS (리뷰 답글만 `review_reply`로 최소 반영) |

## ERD

```mermaid
erDiagram
    MEMBER ||--o{ MEMBER_SOCIAL : "소셜 계정 연동"
    MEMBER ||--o{ MEMBER_AGREEMENT : "약관 동의"
    MEMBER ||--o{ MEMBER_FOOD_CATEGORY : "선호 음식"
    FOOD_CATEGORY ||--o{ MEMBER_FOOD_CATEGORY : ""
    REGION ||--o{ MEMBER : "활동 지역"
    REGION ||--o{ STORE : "소속"
    FOOD_CATEGORY ||--o{ STORE : "업종"
    STORE ||--o{ MISSION : "미션 등록"
    MISSION ||--o{ MEMBER_MISSION : "도전"
    MEMBER ||--o{ MEMBER_MISSION : "수행"
    MEMBER_MISSION ||--o| REVIEW : "완료 후 작성"
    STORE ||--o{ REVIEW : ""
    MEMBER ||--o{ REVIEW : ""
    REVIEW ||--o{ REVIEW_IMAGE : ""
    REVIEW ||--o| REVIEW_REPLY : "사장님 답글"
    MEMBER ||--o{ POINT_HISTORY : "포인트 적립/사용"
    MEMBER_MISSION ||--o| POINT_HISTORY : "보상 지급"
    MEMBER ||--o{ NOTIFICATION : "수신"
    MEMBER ||--o{ INQUIRY : "문의"
    INQUIRY ||--o| INQUIRY_ANSWER : "답변"

    MEMBER {
        bigint id PK
        varchar name
        varchar email UK
        varchar phone_number
        char gender "M / F / N(선택안함)"
        date birth_date
        bigint region_id FK
        varchar address_detail
        int point_balance "보유 포인트(집계 캐시)"
        varchar status "ACTIVE / INACTIVE / WITHDRAWN"
        datetime inactive_at "탈퇴 요청 시각"
        datetime created_at
        datetime updated_at
    }

    MEMBER_SOCIAL {
        bigint id PK
        bigint member_id FK
        varchar provider "KAKAO / NAVER / APPLE / GOOGLE"
        varchar provider_user_id "소셜 고유 식별자"
        datetime created_at
    }

    MEMBER_AGREEMENT {
        bigint id PK
        bigint member_id FK
        varchar agreement_type "TERMS / PRIVACY / LOCATION / MARKETING"
        boolean is_required
        boolean is_agreed
        datetime agreed_at
    }

    FOOD_CATEGORY {
        bigint id PK
        varchar name "한식, 일식, 중식, 양식 ..."
        int display_order
    }

    MEMBER_FOOD_CATEGORY {
        bigint id PK
        bigint member_id FK
        bigint food_category_id FK
        datetime created_at
    }

    REGION {
        bigint id PK
        bigint parent_id FK "상위 지역(시/도 - 시/군/구 - 동)"
        varchar name "예: 안암동"
        int depth
    }

    STORE {
        bigint id PK
        bigint region_id FK
        bigint food_category_id FK
        varchar name
        varchar address
        varchar phone_number
        decimal latitude
        decimal longitude
        decimal rating_avg "리뷰 평점 평균(집계 캐시)"
        int review_count
        varchar status "OPEN / CLOSED"
        datetime created_at
        datetime updated_at
    }

    MISSION {
        bigint id PK
        bigint store_id FK
        varchar title "예: 12,000원 이상의 식사를 해보세요!"
        text description
        int min_order_amount "미션 조건 금액"
        int reward_point "적립 포인트"
        date start_date
        date end_date
        int duration_days "도전 후 수행 기한 (D-7 등)"
        varchar status "ACTIVE / ENDED"
        datetime created_at
        datetime updated_at
    }

    MEMBER_MISSION {
        bigint id PK
        bigint member_id FK
        bigint mission_id FK
        varchar status "IN_PROGRESS / SUCCESS_REQUESTED / COMPLETED / FAILED"
        varchar verification_code "사장님 확인용 인증번호"
        datetime started_at "미션 도전 시각"
        datetime expires_at "수행 기한"
        datetime completed_at
        datetime created_at
        datetime updated_at
    }

    REVIEW {
        bigint id PK
        bigint member_mission_id FK "어떤 미션 수행에 대한 리뷰인지"
        bigint member_id FK
        bigint store_id FK
        tinyint rating "1 ~ 5"
        text content
        datetime created_at
        datetime updated_at
    }

    REVIEW_IMAGE {
        bigint id PK
        bigint review_id FK
        varchar image_url
        int display_order
    }

    REVIEW_REPLY {
        bigint id PK
        bigint review_id FK UK
        text content
        datetime created_at
        datetime updated_at
    }

    POINT_HISTORY {
        bigint id PK
        bigint member_id FK
        bigint member_mission_id FK "미션 보상일 경우"
        varchar type "EARN / USE"
        int amount "부호 포함 증감량"
        int balance_after
        varchar description
        datetime created_at
    }

    NOTIFICATION {
        bigint id PK
        bigint member_id FK
        varchar type "NEW_MISSION / REVIEW_REQUEST / INQUIRY_ANSWER"
        varchar title
        text content
        bigint target_id "연관 리소스 id"
        boolean is_read
        datetime created_at
    }

    INQUIRY {
        bigint id PK
        bigint member_id FK
        varchar type "문의 유형"
        varchar title
        text content
        varchar status "WAITING / ANSWERED"
        datetime created_at
    }

    INQUIRY_ANSWER {
        bigint id PK
        bigint inquiry_id FK UK
        text content
        datetime created_at
    }
```

## 테이블 설계 의도

### 1. 회원 / 로그인
- `member`: 온보딩 1/2 단계에서 받는 이름·성별·생년월일·주소를 보관합니다. 주소는 지역 선택(`region_id`)과 상세주소(`address_detail`)로 분리해 홈 화면의 "안암동" 같은 지역 필터에 재사용합니다.
- `member_social`: SNS 계정으로 간편 로그인(카카오/네이버/애플/구글)을 지원하기 위해 회원과 1:N으로 분리했습니다. `(provider, provider_user_id)`에 유니크 제약을 겁니다.
- `member_agreement`: 약관은 항목이 늘어나므로 컬럼이 아닌 행으로 관리하고, 필수/선택 여부와 동의 시각을 남깁니다.
- 계정 탈퇴는 하드 삭제 대신 `status = WITHDRAWN` + `inactive_at`으로 처리해 리뷰·포인트 이력의 정합성을 지킵니다.

### 2. 선호 음식 / 가게
- `food_category`는 온보딩의 선호 음식 선택지이자 가게의 업종으로 함께 쓰이는 공통 코드 테이블입니다.
- `member_food_category`는 다중 선택이 가능하므로 M:N 매핑 테이블로 풀었습니다.
- `region`은 `parent_id` 자기참조로 시/도 - 시/군/구 - 동 계층을 표현합니다.
- `store.rating_avg`, `review_count`는 목록 화면에서 매번 집계하면 비싸므로 역정규화한 캐시 컬럼입니다.

### 3. 미션
- `mission`은 가게가 등록하는 미션 템플릿(조건 금액, 보상 포인트, 기간)입니다.
- `member_mission`은 "내가 도전한 미션" 한 건으로, 진행중/완료 탭과 D-7 표시를 위해 `status`와 `expires_at`을 가집니다.
- 와이어프레임의 "미션 인증번호" 화면을 위해 `verification_code`를 두어, 사장님이 번호를 확인하면 `COMPLETED`로 전이시킵니다.
- 같은 회원이 같은 미션을 중복 도전하지 않도록 `(member_id, mission_id)`에 유니크 제약을 둘 수 있습니다(재도전 허용 정책이면 해제).

### 4. 리뷰 / 포인트 / 기타
- `review`는 미션 완료 후 작성되므로 `member_mission_id`를 유니크로 두어 1회만 작성되게 합니다. `store_id`, `member_id`는 조회 편의를 위한 중복 보관입니다.
- 리뷰 사진은 여러 장이므로 `review_image`로 분리했습니다.
- `point_history`는 포인트 적립/사용 내역 화면의 데이터 원본이며, `balance_after`로 각 시점 잔액을 기록합니다.
- 알림 설정(수신 여부 토글)은 PASS 범위라 제외하고, 발송된 알림 목록만 `notification`에 남겼습니다.
