# 밀러 6주차 Frontend — TanStack Query

영화 목록, 검색, 상세 데이터 요청을 `useQuery`로 처리하고 캐시를 재사용합니다.

## 실행

```sh
pnpm install --frozen-lockfile
cp .env.example .env.local
# .env.local의 VITE_TMDB_READ_TOKEN에 본인의 TMDB 읽기 토큰 입력
pnpm dev
```

빌드 및 TypeScript 검사: `pnpm build`.

## 필수 미션 구현

| 화면 | queryKey | staleTime |
|---|---|---|
| 목록 | `['movies', 'list', page]` | 60초 |
| 검색 | `['movies', 'search', keyword, 1]` | 60초 |
| 상세 | `['movies', 'detail', movieId]` | 30초 |

기본 gcTime은 5분, 재시도 횟수는 1회입니다. 빈 검색어와 유효하지 않은 상세 ID에서는 요청하지 않습니다. 로딩·오류·빈 결과 화면과 수동 재시도 버튼을 제공합니다.

`src/main.tsx`에서 QueryClientProvider와 React Query Devtools를 연결합니다. 각 화면 구현은 `src/routes`에 있습니다. 선택 미션인 queryOptions 리팩터링은 포함하지 않습니다.

## 캐시 확인

브라우저 Network와 React Query Devtools를 함께 열고 목록 1→2→1페이지, 검색 재방문, 상세 재방문을 확인합니다. staleTime 안에서는 같은 키의 캐시를 재사용합니다. 전체 새로고침은 메모리 캐시를 초기화하므로 화면 안의 링크와 페이지 버튼으로 이동합니다.

실제 API 검증은 2026-11-09 작업본에서 완료했으며, 제출본은 해당 소스를 복사한 뒤 빌드·타입 검사를 확인했습니다. TMDB 토큰은 Git에 포함하지 않습니다.
