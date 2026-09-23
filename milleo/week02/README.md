# Week 02 · UMCine 영화 목록

React와 TypeScript로 만든 2주차 필수 미션입니다. 제공된 영화 10편을 표시하고 각 영화의 북마크를 켜거나 끌 수 있습니다.

## 실행

Node.js 22.12 이상과 pnpm을 사용합니다.

```sh
cd milleo/week02
pnpm install
pnpm dev
```

```sh
pnpm build
pnpm preview
```

`pnpm build`는 TypeScript 타입 검사 후 배포용 파일을 `dist`에 만듭니다.

## 구성

- `src/app.tsx`: 영화 배열 상태와 북마크 변경 함수
- `src/components/header.tsx`: 로고와 상단 메뉴
- `src/components/movie-card.tsx`: 영화 포스터, 제목, 개봉일, 북마크 버튼
- `src/components/movie-grid.tsx`: `map()`과 고유한 `key`로 영화 목록 렌더링
- `src/components/pagination.tsx`: 페이지 번호 UI
- `src/data/movies.ts`, `src/types/movie.ts`: 워크북의 더미 데이터와 Movie 타입
- `public/images`, `public/icons`: 워크북에서 제공된 에셋 원본

## 핵심 구현

북마크 상태는 공통 부모인 `App`에서 관리합니다. 값과 변경 함수를 props로 전달하고, 클릭한 영화의 id에 해당하는 객체만 새로 만들어 기존 배열을 직접 수정하지 않습니다.

```tsx
setMovieList((previousMovies) =>
  previousMovies.map((movie) =>
    movie.id === movieId
      ? { ...movie, isBookmarked: !movie.isBookmarked }
      : movie,
  ),
);
```

북마크 여부에 따라 제공된 채움/윤곽 아이콘과 버튼 색상이 달라집니다. `aria-pressed`로 보조 기술에도 상태를 전달하며 키보드로 조작할 수 있습니다.

## 구현 범위

- Figma의 데스크톱 영화 목록 화면을 기준으로 5열 그리드를 구현했습니다.
- 영화 데이터와 초기 북마크(오디세이, 토이 스토리 5)는 워크북 값을 사용합니다.
- 북마크는 `useState`로 관리하므로 새로고침하면 초기값으로 돌아갑니다.
- 검색, 내 정보, 로그인과 페이지 이동은 필수 미션 범위 밖이므로 화면만 표시합니다. 미구현 기능의 버튼은 비활성화했습니다.
- 선택 미션인 모바일 그리드와 페이지 번호 상태 변경은 포함하지 않았습니다.

디자인: [UMCine Figma](https://www.figma.com/design/erFuXxEy5svB8Be5gjIqdu/?node-id=129-2)

에셋 출처: [asset-sources.md](./asset-sources.md)

## 확인 결과

- `pnpm build`: 타입 검사와 프로덕션 빌드 통과
- 1440 × 1024 브라우저 화면에서 5열 영화 목록과 Figma 배치 비교
- 영화 10편과 모든 이미지 정상 표시
- 영화별 북마크 추가·해제 20회 확인, 선택하지 않은 영화의 상태·아이콘 유지
- Enter 키로 북마크 조작 확인
- 브라우저 Console 경고·오류 없음
