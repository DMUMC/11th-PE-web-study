# UMC Web 3주차 - UMCine

TanStack Router 파일 기반 라우팅과 Tailwind CSS v4로 영화 목록, 검색, 상세 화면을 구성했습니다.

```sh
pnpm install
pnpm dev
pnpm build
```

- `/`: 영화 목록, 북마크
- `/search?query=스파이더맨`: 제목/원제 검색, 결과 수와 영화 정보
- `/search`: 검색어 안내
- `/search?query=없는영화`: 결과 없음 안내
- `/movies/1`: 배경 이미지가 있는 상세 화면
- `/movies/999`: 잘못된 ID 안내

공통 레이아웃에서 영화 상태를 관리해 화면 이동 중 북마크를 유지합니다. 검색어는 URL에 저장됩니다.
평점은 현재 화면의 로컬 상태이며 서버 저장은 구현 범위에 포함되지 않습니다.
이미지 및 영화 데이터는 기존 week02 과제 자산을 사용했습니다.
