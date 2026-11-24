# 6주차 - TanStack Query로 서버 데이터 조회하기

# ❗ 학습 목표

---

<aside>
🎯

이번 주차를 마치면 다음을 할 수 있어요.

- 클라이언트 상태와 서버 상태를 구분하고 TanStack Query의 역할을 설명할 수 있어요.
- `QueryClientProvider`, `useQuery`, query key와 query function을 구성할 수 있어요.
- `staleTime`과 `gcTime`을 조정하고 캐시 재사용을 개발자 도구에서 확인할 수 있어요.
</aside>

# 📸 잠깐! 스터디 인증샷은 찍으셨나요? 📸

---

- 스터디 리더께서 대표로 매주 한 장씩 남겨주시면 좋겠어요! 🙆💗
- 사진을 저장해 이미지로 첨부하거나 복사하여 붙여 넣어 주세요.

# ✨ 학습 내용

---

<aside>
🤖

**AI를 학습에 적극 활용해요.**

AI는 **개념 이해, 코드 읽기, 오류 해결, 복습**에 활용할 수 있어요. 답을 대신 작성하게 하기보다, 이해하기 어려운 부분을 더 쉽게 설명해 달라고 요청하고 꼬리 질문을 이어가며 학습해 보세요.

- "이 개념을 초등학생도 이해할 수 있는 말로 설명해 줘. 단, 설명이 너무 길어지지 않도록 핵심만 알려 줘."
- "내 생각에는 이 부분 때문에 오류가 발생한 것 같아. 내 생각이 맞는지 확인하고, 다른 원인도 함께 알려 줘."
- "이 개념은 어느 정도 이해했어. 다음으로 알아 두면 좋은 내용도 알려 줘."
- "내가 이해한 내용을 설명할게. 틀리거나 빠진 부분을 짚어 주고, 이해했는지 확인할 질문도 해 줘."

AI의 답변이 항상 정확한 것은 아니에요. 제안받은 코드는 직접 실행하여 결과를 확인하고, 중요한 내용은 공식 문서와 함께 확인해 주세요.

</aside>

## 0. 시작하기 전

1. 이번 주차에서 배우는 내용
    
    5주차에는 `useEffect`에서 목록, 검색과 상세 API를 직접 요청했어요. 
    
    이번 주차에는 같은 서버 데이터를 TanStack Query를 이용해서 가져왔을 때 어떤 이점을 얻을 수 있는지 알아봐요.
    
2. 학습하는 방법
    
    각 단원의 번호를 따라 위에서 아래로 진행해요.
    
    1. 새로운 개념을 쉬운 설명부터 읽어요.
    2. 번호가 붙은 설명과 실습을 위에서 아래로 따라가요.
    3. 안내된 방법으로 결과를 확인해요.
    4. 텍스트, 색상이나 숫자 중 하나만 바꾸어 다시 확인해요.
    5. 예상과 다르면 직전에 작성한 코드부터 한 줄씩 살펴봐요.
    
    <aside>
    📌
    
    코드를 한 번에 완벽하게 작성하기보다 **작게 작성하고, 바로 확인하고, 한 가지씩 바꾸는 과정**이 중요해요.
    
    같은 파일에서 새 예제를 실행할 때는 **"이어서 작성해요"라는 안내가 없다면 기존 코드를 지우고 새 예제로 바꿔요.** 이전 예제를 계속 붙이면 같은 이름이 겹쳐 오류가 생길 수 있어요.
    
    </aside>
    
3. 개념 사전 활용하기
    
    본문을 읽다가 낯선 용어가 나오면 아래 개념 사전에서 필요한 항목만 찾아보세요. 사전을 먼저 외우거나 처음부터 끝까지 읽을 필요는 없어요. 문법과 실습 방법은 이 본문에서 순서대로 설명해요.
    
    [6주차 개념 사전](https://app.notion.com/p/6-145d62e145e3831aafa1811b418c8119?pvs=21)
    

## 1. 서버 상태와 캐시 이해하기

TanStack Query를 본격적으로 배우기 전에 클라이언트 상태와 서버 상태의 차이, 캐시가 필요한 이유를 알아봐요.

- 1.1 클라이언트 상태와 서버 상태
    
    앞서 Web Storage로 데이터를 저장하고, Zustand로 상태를 관리했어요. 이번에는 상태를 누가 관리하는지에 따라 클라이언트 상태와 서버 상태를 구분해 봐요.
    
    ![image.png](image.png)
    
    - **클라이언트 상태**
        
        현재 페이지의 URL, 목록 필터, 아직 제출하지 않은 평점 입력값처럼 **브라우저에서 관리하는 상태**예요. 서버 응답을 기다리지 않고 화면에 반영할 수 있어요.
        
    - **서버 상태**
        
        사용자, 영화, 인물 정보처럼 **서버에서 원본을 관리하는 상태**예요. API로 데이터를 가져오거나 변경을 요청해요. 브라우저에 저장해도 서버 상태이며, 서버의 최신 값과 달라질 수 있어요.
        
    
    서버 데이터를 가져올 때는 브라우저가 요청을 보내고 응답을 받는 **네트워크 왕복**이 발생해요. 같은 데이터를 볼 때마다 다시 요청하면 응답을 기다려야 할 수 있어요. 이때 이미 받아 온 데이터를 재사용하는 **캐시**를 활용할 수 있어요.
    
- 1.2 캐시는 무엇인가요?
    
    **캐시**는 다시 사용할 데이터를 보관해 두었다가 필요할 때 꺼내 쓰는 것이에요. 브라우저의 캐시를 서버 요청 없이 재사용하면 **네트워크 왕복을 줄이고** **데이터를 더 빠르게 표시**할 수 있어요.
    
    다만 저장된 데이터가 최신인지 확인해야 할 때는 서버에 다시 요청할 수 있어요.
    

## 2. TanStack Query

[TanStack Query](https://tanstack.com/query/latest)는 **서버 상태와 캐시를 관리하는 라이브러리**예요. API 요청의 로딩, 성공, 실패 상태를 제공하고, 재시도와 무한 스크롤 구현도 도와줘요.

- 2.1 사용하는 이유
    
    첫 번째 이유는 **캐시를 쉽게 관리할 수 있기 때문**이에요. 요청하는데 오래 걸리거나 자주 바뀌지 않는 데이터는 캐시를 오래 재사용하도록 설정할 수 있어요. 최신 데이터가 중요한 경우에는 다시 요청하는 조건이나 주기를 조절할 수 있어요.
    
    두 번째 이유는 **API 요청 상태를 직접 관리하는 코드를 줄일 수 있기 때문**이에요. 다양한 요청 상태를 제공하므로 화면과 서비스의 동작을 구현하는 데 집중할 수 있어요. 대표적인 예시는 아래와 같아요.
    
    - **데이터 조회 시**
        - 데이터를 가져오는 중인지
        - 조회에 성공했는지, 실패했는지
        - 무한 스크롤에서 더 가져올 데이터가 있는지
    - **데이터 변경 시**
        - 데이터를 변경하는 중인지
        - 변경에 성공했는지, 실패했는지
    
    요청이 실패했을 때 재시도 여부와 횟수도 설정할 수 있어요.
    
- 2.2. 개발 환경 설정하기
    
    UMCine 프로젝트의 `package.json`이 있는 루트 폴더에서 다음 명령을 실행해요.
    
    ```bash
    pnpm add @tanstack/react-query
    pnpm add -D @tanstack/react-query-devtools
    ```
    
    `@tanstack/react-query`는 TanStack Query의 기능을 사용하는 패키지예요. `@tanstack/react-query-devtools`는 개발 중 저장된 데이터와 요청 상태를 확인하는 도구예요.
    
    이제 3주차에 작성한 `src/main.tsx`에 기존 라우터와 CSS 설정을 유지하면서 아래처럼 연결해요.
    
    ```tsx
    import { StrictMode } from "react";
    import { createRoot } from "react-dom/client";
    import { createRouter, RouterProvider } from "@tanstack/react-router";
    import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
    import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
    import { routeTree } from "./routeTree.gen";
    import "./index.css";
    
    const router = createRouter({ routeTree });
    const queryClient = new QueryClient();
    
    declare module "@tanstack/react-router" {
      interface Register {
        router: typeof router;
      }
    }
    
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </StrictMode>,
    );
    ```
    
    **`QueryClient`는 캐시와 요청 설정을 관리하는 객체**예요. `new QueryClient()`로 만든 객체를 `queryClient`라는 변수에 담고, `QueryClientProvider`에 전달해 앱에서 함께 사용하도록 해요.
    
- 📚 같이 보면 좋은 자료
    - [TanStack Query - Quick Start](https://tanstack.com/query/latest/docs/framework/react/quick-start) - Provider, query와 mutation의 기본 구조를 확인할 수 있어요.
    - [TanStack Query - Devtools](https://tanstack.com/query/latest/docs/framework/react/devtools) - 개발자 도구 설치와 사용법을 확인할 수 있어요.

## 3. 목록, 검색과 상세 요청을 useQuery로 옮기기

Tanstack Query를 이용해서 데이터 조회를 하기 위해서는 `useQuery`라는 훅을 사용해요. 이 훅에서 데이터 조회와 관련된 상태와 함수들을 사용할 수 있어요. 이제 이 훅을 사용해서 목록, 검색 그리고 상세 요청 화면을 수정해봐요.

- 3.1. 영화 목록
    
    `src/pages/movies/movie-list-page.tsx`에서 기존 `useEffect` 요청과 영화 목록, 로딩, 오류를 관리하던 상태를 `useQuery`로 바꿔요. 기존 화면의 UI는 유지하고, 각 상태에 맞게 데이터를 연결해 주세요.
    
    ```tsx
    export function MovieListPage() {
      const [page, setPage] = useState(1);
    
      const moviesQuery = useQuery({
        queryKey: ["movies", "list", { page }],
        queryFn: () => getMovies({ page }),
      });
    
      const movies = moviesQuery.data?.results ?? [];
      const totalPages = moviesQuery.data?.total_pages ?? 0;
    
      const handlePageChange = (nextPage: number) => {
        setPage(nextPage);
      };
    
      return (
        <>
          {/* 기존 화면의 다른 UI는 그대로 유지해요. */}
          {/* 데이터를 가져오는 중인지, 오류가 발생했는지 순서대로 확인해요. */}
          {moviesQuery.isPending ? (
            <p>영화를 불러오는 중이에요.</p> // 기존 로딩 UI가 있다면 재사용해요.
          ) : moviesQuery.isError ? (
            <p>{moviesQuery.error.message}</p> // 기존 오류 UI가 있다면 재사용해요.
          ) : movies.length === 0 ? (
            <p>표시할 영화가 없어요.</p> // 기존 빈 목록 UI가 있다면 재사용해요.
          ) : (
            <>
              {/* 여기에 기존 영화 목록 UI를 넣어요. */}
              {/* movies로 영화 목록을 표시해요. */}
              {/* totalPages로 전체 페이지 수를 확인해요. */}
              {/* 페이지 번호를 클릭하면 handlePageChange(다음 페이지 번호)를 호출해요. */}
            </>
          )}
        </>
      );
    }
    ```
    
    `queryKey`와 `queryFn`은 **필수로 넘겨야하는 값**이며, 각각의 역할은 아래와 같아요.
    
    - **queryKey**: 캐시에서 데이터를 구분하는 이름이에요. `page`를 포함하면 페이지별 영화 목록을 따로 저장할 수 있어요.
    - **queryFn**: 데이터를 가져오는 함수예요. 여기서는 `getMovies({ page })`를 실행하며, 요청에 성공하면 결과가 `moviesQuery.data`에 들어가요.
    
    페이지 번호를 클릭하면 `handlePageChange`로 `page`를 바꿔요. `queryKey`도 바뀌므로 해당 페이지의 캐시를 확인하고, 필요하면 데이터를 요청해요.
    
    개발 서버를 실행하고 목록 화면을 열어요. 영화 카드가 표시되고 페이지 번호를 바꾸면 목록이 바뀌는지 확인해요. Query 개발자 도구를 열면 `movies`, `list`와 페이지 번호가 포함된 캐시 이름을 확인할 수 있어요.
    
    - 결과 화면
        
        ![page가 1일 때](image%201.png)
        
        page가 1일 때
        
    
    ![page가 2일 때](image%202.png)
    
    page가 2일 때
    
- 3.2. 검색
    
    `src/pages/movies/search-page.tsx`의 검색 요청을 아래처럼 바꿔요. 기존 검색 폼과 화면의 UI는 유지해요.
    
    ```tsx
    export function SearchPage() {
      const { query } = useSearch({ from: "/search" });
      const normalizedQuery = query?.trim() ?? "";
    
      const searchQuery = useQuery({
        queryKey: ["movies", "search", { query: normalizedQuery }],
        queryFn: () => searchMovies({ query: normalizedQuery }),
        enabled: normalizedQuery.length > 0,
      });
    
      const searchResults = searchQuery.data?.results ?? [];
    
      return (
        <>
          {/* 기존 검색 폼과 다른 UI는 그대로 유지해요. */}
          {!normalizedQuery ? (
            // 기존 검색 UI를 재사용해요.
          ) : searchQuery.isLoading ? (
            <p>검색 결과를 불러오는 중이에요.</p> // 기존 로딩 UI가 있다면 재사용해요.
          ) : searchQuery.isError ? (
            <p>{searchQuery.error.message}</p> // 기존 오류 UI가 있다면 재사용해요.
          ) : searchQuery.isSuccess && searchResults.length === 0 ? (
            <p>검색 결과가 없어요.</p> // 기존 빈 결과 UI가 있다면 재사용해요.
          ) : (
            <>
              {/* 여기에 기존 검색 결과 UI를 넣어요. */}
              {/* searchResults로 영화 목록을 표시해요. */}
            </>
          )}
        </>
      );
    }
    ```
    
    `useQuery`는 캐시 상태에 따라 필요한 데이터를 자동으로 요청해요. `enabled`로 자동 요청 여부를 정해요. 여기서는 앞뒤 공백을 제거한 검색어가 있을 때만 요청해요.
    
    `isPending`과 `isLoading`은 무엇이 다를까요?
    
    - **isPending**: 첫 조회가 아직 성공이나 실패로 끝나지 않은 상태예요. 캐시가 없다면 요청 전이나 오프라인으로 요청이 멈춘 때도 참이에요.
    - **isLoading**: `isPending`이면서 실제로 요청 중인 상태예요. `isPending && isFetching`과 같아요.
    
    목록이나 상세에서는 `isPending`으로 첫 데이터가 준비되기를 기다려요. 검색처럼 조건에 따라 요청하는 화면에서는 `isLoading`으로 실제 첫 요청 중에만 로딩을 표시해요. 실패는 `isError`로 구분해요.
    
    - 결과 화면
        
        ![“스파이더맨” 검색 결과](image%203.png)
        
        “스파이더맨” 검색 결과
        
- 3.3. 상세
    
    `src/pages/movies/movie-detail-page.tsx`의 요청과 상태 처리를 아래처럼 바꿔요. 기존 UI는 주석 위치에 유지해요.
    
    ```tsx
    export function MovieDetailPage() {
      const { movieId: movieIdParam } = useParams({ from: "/movies/$movieId" });
      const movieId = Number(movieIdParam);
      const isValidMovieId = Number.isInteger(movieId) && movieId > 0;
    
      const movieDetailQuery = useQuery({
        queryKey: ["movies", "detail", movieId],
        queryFn: () => getMovieDetail(movieId),
        enabled: isValidMovieId,
      });
    
      return (
        <>
          {/* 기존 화면의 다른 UI는 그대로 유지해요. */}
          {!isValidMovieId ? (
            <p>올바르지 않은 영화 번호예요.</p>
          ) : movieDetailQuery.isPending ? (
            <p>영화 상세 정보를 불러오는 중이에요.</p> // 기존 로딩 UI가 있다면 재사용해요.
          ) : movieDetailQuery.isError ? (
            <p>{getMovieDetailErrorMessage(movieDetailQuery.error)}</p> // 기존 오류 UI가 있다면 재사용해요.
          ) : (
            <>
              {/* 여기에 기존 영화 상세 UI를 넣어요. */}
              {/* movieDetailQuery.data로 영화 정보를 표시해요. */}
            </>
          )}
        </>
      );
    }
    ```
    
    영화 번호가 **0보다 큰 정수일 때만** 요청해요. 유효하지 않은 번호에서는 요청하지 않아도 `isPending`이 참일 수 있으므로, 잘못된 번호 안내를 로딩보다 먼저 처리해요.
    
    - 결과 화면
        
        ![“스파이더맨: 브랜드 뉴 데이” 상세 조회](image%204.png)
        
        “스파이더맨: 브랜드 뉴 데이” 상세 조회
        
- 📚 같이 보면 좋은 자료
    - [TanStack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/functions/useQuery) - `useQuery`의 옵션과 반환값을 확인할 수 있어요.

## 4. 캐시 적용을 통한 네트워크 왕복 줄이기

앞에서 `new QueryClient()`로 객체를 만들었어요. **기본 설정에서도 데이터는 캐시에 저장돼요.** 다만 `staleTime`이 `0`이라 바로 오래된 데이터로 취급해요. 그래서 이미 조회한 페이지로 돌아가도 다시 요청할 수 있어요.

[기본 옵션일 때](%E1%84%92%E1%85%AA%E1%84%86%E1%85%A7%E1%86%AB_%E1%84%80%E1%85%B5%E1%84%85%E1%85%A9%E1%86%A8_2026-10-03_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_4.14.14.mov)

기본 옵션일 때

캐시를 최신으로 취급하는 시간을 설정해 불필요한 요청을 줄여 볼게요.

- 4.1 `staleTime`과 `gcTime`
    
    두 옵션은 캐시를 다루지만 역할이 달라요. 시간은 모두 밀리초(ms)로 지정해요.
    
    - **staleTime**: 데이터를 최신으로 취급하는 시간이에요. 기본값은 `0`이에요. 이 시간이 지나면 `stale` 상태가 되지만 캐시가 삭제되지는 않아요.
    - **gcTime**: query를 사용하지 않게 된 뒤 캐시를 메모리에서 지우기까지 기다리는 시간이에요. 브라우저에서 기본값은 5분이에요.
- 4.2 캐시 상태
    
    데이터가 최신인지에 따라 두 상태로 나눠요.
    
    - **fresh**: `staleTime`이 지나지 않아 최신으로 취급하는 상태예요.
    - **stale**: `staleTime`이 지나 다시 조회할 수 있는 상태예요.
    
    `inactive`는 현재 query를 사용하는 컴포넌트가 없는 상태예요. 이때부터 `gcTime`이 지나면 캐시가 삭제돼요.
    
    `stale`이 됐다고 바로 요청하지는 않아요. 기본 설정에서는 해당 화면을 다시 열거나 창에 포커스가 돌아오거나 네트워크가 다시 연결될 때 재조회할 수 있어요.
    
- 4.3 캐시 적용하고 확인하기
    
    `src/main.tsx`의 `QueryClient`에 공통 기본값을 지정해요.
    
    ```tsx
    const ONE_MINUTE = 60 * 1000;
    const queryClient = new QueryClient({
      defaultOptions: { queries: { staleTime: ONE_MINUTE } }, // staleTime: 60 * 1000도 가능
    });
    ```
    
    아래 예시처럼 **각 `useQuery`에서도 옵션을 지정할 수 있어요.**
    
    ```tsx
    const personDetailQuery = useQuery({
      queryKey: ["people", "detail", personId],
      queryFn: () => getPersonDetail(personId),
      staleTime: 30 * 1000,
    });
    ```
    
    이 조회에서는 전역 기본값인 1분 대신 30초를 적용해요. `gcTime` 같은 다른 옵션도 같은 위치에 작성할 수 있어요.
    
    목록에서 1 → 2 → 1페이지로 이동해 보세요. 캐시가 남아 있고 조회한 지 1분이 지나지 않았다면 다시 요청하지 않는지 Network 탭에서 확인해요.
    
    [staleTime 값이 1분일 때](%E1%84%92%E1%85%AA%E1%84%86%E1%85%A7%E1%86%AB_%E1%84%80%E1%85%B5%E1%84%85%E1%85%A9%E1%86%A8_2026-10-03_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_4.14.43.mov)
    
    staleTime 값이 1분일 때
    
- 미니 실습: 상세 화면 staleTime 다르게 설정하기
    1. 위 예제처럼 상세 조회의 `staleTime`을 30초로 설정해요.
    2. Query 개발자 도구를 통해 상세 조회 후 30초가 지나면 상세 데이터가 `stale`로 바뀌는지 확인해요.
- 📚 같이 보면 좋은 자료
    - [TanStack Query - Important Defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults) - fresh, stale와 garbage collection 기본 동작을 확인할 수 있어요.

# 🎯 핵심 키워드

---

<aside>
💡

아래 키워드를 직접 조사하고 자신의 말로 정리해 보세요. 정의만 옮기지 말고, 워크북에서 작성한 예시나 실제 사용 상황을 함께 기록하면 좋아요.

</aside>

- query key와 요청 상태
    - **목록, 검색과 상세에 같은 query key를 쓰면 어떤 문제가 생길까요? 
    페이지 번호, 검색어와 영화 ID를 포함하는 이유도 함께 생각해 보세요.**
        
        <aside>
        💡
        
        **query key는 캐시의 이름표 같은거라 키가 같은 경우 동일한 데이터로 취급**
        
        목록, 검색과 상세에 같은 query key가 사용된다면 목록 데이터가 상세 화면에 전달되어 영화 상세가 보이지 않고 타입과 화면도 어긋남
        
        반면에 페이지 번호, 검색어와 영화ID에는 같은 API를 사용하여도 page가 다르면 
        결과가 다르게 출력되기 때문
        
        </aside>
        
    - **`enabled: false`인데도 `isPending`이 참일 수 있는 이유는 무엇이며, 이때 `isLoading`은 어떤 값일까요**?
        
        <aside>
        💡
        
        **enabled : false** 은 요청이 나가지 않는 상태인데 **isPending**은 요청과는 상관이 
        없기에 참인것이고 반면에 **isLoading**은 실제로 요청을 받아야하기 때문에 요청이 
        나가지 않는 지금은 **fasle** 상태이다.
        
        </aside>
        
- 캐시 수명과 재조회
    - **`staleTime`과 `gcTime`은 각각 언제부터 계산하며, 시간이 지난 뒤 캐시에 어떤 차이가 생길까요?**
        
        <aside>
        💡
        
        **staleTime :** 데이터를 받은 시점부터 **저정한 시간 동안
        gcTime :** 쿼리를 사용하는 컴포넌트가 전부 사라진 시점부터 **5분동안 (기본값)**
        
        **stale이 1분, gcTime이 5분일때,**
        
        **1분안에 돌아오면** : 캐시를 그대로 사용하고 **새 요청 X**
        
        **1~5분 사이에 돌아오면** : 캐시를 먼저 보이고 뒤에서 **재 요청**
        
        **5분 뒤에 돌아오면** : 캐시가 존재하지 않아 **로딩부터 재시작**
        
        </aside>
        
    - **전역 기본값과 개별 `useQuery`의 `staleTime`은 어떤 기준으로 정하면 좋을까요?**
        
        <aside>
        💡
        
        **staleTime**은 서버 데이터가 얼마나 자주 바뀌는지, 오래된 값을 보여 줘도
        괜찮은지를 기준으로 정한다. 
        
        앱 전체에 적용되는 기본값은 무난한 값으로 두고, 자주 바뀌거나 거의 안 바뀌는
        데이터처럼 성격이 다른 쿼리만 **개별 useQuery**에서 따로 정하는 것이 좋다.
        
        </aside>
        

# 📢 학습 후기

---

<aside>
💡

서버 데이터에 캐시 관리라는 개념이 있다는 것 자체를 이번에 처음 알았습니다.
useEffect로 직접 요청하던 코드를 TanStack Query로 바꾸니 로딩이나 오류관련된 코드가 눈에 확 띄게 간단해져 관리가 쉬워진거 같습니다.

또한, 직접 TanStack 도구에서  fresh가 stale로 바뀌면서 staleTime이 어떤 역할을 하는지도 
확인했기에 같은 요청을 줄여 사용자에게 서비스가 더 빠르게 느껴지게 최적화 할 수 있다는 것도 새로 배웠습니다.

</aside>

# 🔥 미션

---

<aside>
📝

필수 미션을 진행하며 작성한 **핵심 코드와 최종 확인 결과만** 아래 **미션 기록**의 **필수 미션** 토글에 기록해 주세요. 모든 명령과 중간 과정을 빠짐없이 적을 필요는 없어요.

선택 미션을 진행했다면 결과를 **선택 미션** 토글에 기록해 주세요.

</aside>

기존 영화 API 요청을 TanStack Query로 관리하고, 캐시를 활용해 불필요한 네트워크 요청을 줄여 봐요.

## 필수 미션

- 기존 영화 화면에 TanStack Query 적용하기
    - 목록, 검색과 상세 요청을 TanStack Query 기반으로 수정하고, 서로 다른 요청이 구분되는 query key를 사용해요.
    - 로딩, 오류, 빈 결과와 성공 상태를 표시하고 화면을 다시 열 때 cache가 재사용되는지 확인해요.
    - Query 개발자 도구와 Network 패널에서 cache와 요청 흐름을 확인해요.

## 선택 미션

- `queryOptions`를 이용해 목록, 검색과 상세 query를 리팩터링해 보세요.

# 💪 미션 기록

---

<aside>
🍀

미션 기록은 아래 토글 안에 작성하거나, 별도 페이지를 만들어 작성해도 좋아요.

</aside>

- 필수 미션
    
    #### 결과화면
    
    #### **Tanstack DevTools 화면**
    
    **Fresh 1인 상태**
    
    ![image.png](image%205.png)
    
    **stale 1로 상태가 바뀜 (지정해둔 30초 가 지났을 때)**
    
    ![image.png](image%206.png)
    
    #### **개발자 도구 화면**
    
    ![image.png](image%207.png)
    
    **기준 시간이 지나니 요청을 새로보내서 줄이 늘어남**
    
    ![image.png](image%208.png)
    
    #### 코드
    
    **main.tsx (Query 사용을 위한 코드 추가)**
    
    ```python
    import { StrictMode } from "react";
    import { createRoot } from "react-dom/client";
    import { createRouter, RouterProvider } from "@tanstack/react-router";
    import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
    import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
    import { routeTree } from "./routeTree.gen";
    import "./index.css";
    
    const router = createRouter({ routeTree });
    const ONE_MINUTE = 30 * 1000;
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { staleTime: ONE_MINUTE },
      },
    });
    
    declare module "@tanstack/react-router" {
      interface Register {
        router: typeof router;
      }
    }
    
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </StrictMode>,
    );
    ```
    
    **useEffect → useQuery로 변경**
    
    ```python
    const [page, setPage] = useState(1);
    
    const moviesQuery = useQuery({
      queryKey: ["movies", "list", { page }],
      queryFn: () => getMovies({ page }),
    });
    
    const movies = moviesQuery.data?.results ?? [];
    const totalPages = Math.min(moviesQuery.data?.total_pages ?? 0, 500);
    ```
    
    **빈 검색어나 잘못된 번호 요청하지 않기**
    
    ```tsx
    //빈 검색어
    const searchQuery = useQuery({
      queryKey: ["movies", "search", { query: normalizedQuery }],
      queryFn: () => searchMovies({ query: normalizedQuery }),
      enabled: normalizedQuery.length > 0,
    });
    
    //잘못된 번호
    const movieId = Number(movieIdParam);
    const isValidMovieId = Number.isInteger(movieId) && movieId > 0;
    
    const movieDetailQuery = useQuery({
      queryKey: ["movies", "detail", movieId],
      queryFn: () => getMovieDetail(movieId),
      enabled: isValidMovieId,
    });
    ```
    
    **페이지네이션 연결**
    
    ```python
    interface PaginationProps {
      currentPage: number;
      totalPages: number;
      onPageChange: (page: number) => void;
    }
    
    <button onClick={() => onPageChange(page)}>{page}</button>
    ```
    
- 선택 미션

    #### `queryOptions`를 이용한 쿼리 관리 리팩터링

    **1. `src/api/movies/queries.ts` 정의**
    `queryOptions` 헬퍼 함수를 사용하여 쿼리 키(`queryKey`), 쿼리 함수(`queryFn`), 캐시 옵션(`staleTime`, `enabled` 등)을 객체로 중앙 집중 관리하도록 리팩터링했습니다.

    ```typescript
    import { queryOptions } from "@tanstack/react-query";
    import { getMovies, type GetMoviesRequest } from "./get-movies";
    import { getMovieDetail } from "./get-movie-detail";
    import { searchMovies, type SearchMoviesRequest } from "./search-movies";

    export const movieQueries = {
      all: () => ["movies"] as const,
      lists: () => [...movieQueries.all(), "list"] as const,
      list: (params: GetMoviesRequest = { page: 1 }) =>
        queryOptions({
          queryKey: [...movieQueries.lists(), params],
          queryFn: () => getMovies(params),
        }),
      details: () => [...movieQueries.all(), "detail"] as const,
      detail: (movieId: number) =>
        queryOptions({
          queryKey: [...movieQueries.details(), movieId],
          queryFn: () => getMovieDetail(movieId),
          enabled: Number.isInteger(movieId) && movieId > 0,
          staleTime: 5 * 60 * 1000, // 상세 화면은 5분 동안 fresh 유지
        }),
      searches: () => [...movieQueries.all(), "search"] as const,
      search: (params: SearchMoviesRequest) => {
        const normalizedQuery = params.query.trim();
        return queryOptions({
          queryKey: [...movieQueries.searches(), { ...params, query: normalizedQuery }],
          queryFn: () => searchMovies({ ...params, query: normalizedQuery }),
          enabled: normalizedQuery.length > 0,
        });
      },
    };
    ```

    **2. 컴포넌트 적용 (`MovieListPage`, `SearchPage`, `MovieDetailPage`)**
    컴포넌트에서는 인라인으로 `queryKey`와 `queryFn`을 전달하지 않고 캡슐화된 `movieQueries` 옵션을 전달하여 호출합니다.

    ```typescript
    // MovieListPage.tsx
    const moviesQuery = useQuery(movieQueries.list({ page }));

    // SearchPage.tsx
    const searchQuery = useQuery(movieQueries.search({ query: normalizedQuery }));

    // MovieDetailPage.tsx
    const movieDetailQuery = useQuery(movieQueries.detail(movieId));
    ```

    **3. 리팩터링 장점**
    - **타입 안정성**: 반환 타입 및 쿼리 파라미터가 자동으로 정밀하게 추론됩니다.
    - **키 일관성 보장**: 쿼리 키 배열이 계층 구조로 중앙 관리되어 휴먼 에러(오타)를 방지하고, 향후 `invalidateQueries` 시 일괄 무효화가 용이합니다.
    - **옵션 캡슐화**: 상세 화면의 5분 `staleTime`, 빈 검색어 `enabled` 가드 로직 등이 쿼리 정의부에 캡슐화되어 컴포넌트 코드가 간결해집니다.

# 📢 미션 제출 안내 & CodeRabbit 사용법 안내

---

<aside>
👊

미션을 마친 뒤 미션 기록이 포함된 Notion 페이지 URL을 https://umc.ai.kr/ 에 제출해 주세요.

Github에 올리신 코드는 하단의 CodeRabbit을 통해 직접 AI에게 피드백 받으실 수 있습니다!

</aside>

1. 개인 미션 페이지 오른쪽 위의 **공유** 버튼을 눌러 주세요.
2. **링크 복사**를 클릭해 주세요.
3. https://umc.ai.kr/ 에 제출해주세요.
    
    방법은 [‣](https://app.notion.com/p/3d4b57f4596b804cb1bbf4eb8eb20889?pvs=21) 에 적혀져 있습니다.
    
- 미션 제출 링크: 링크를 입력해 주시고, 하단의 CodeRabbit 설정으로 직접 AI를 통해 코드 피드백을 받아보세요!

[‣](https://app.notion.com/p/3c7b57f4596b80d9b804de47e3de2176?pvs=21) 

# 🍥 블로그 챌린지 안내

---

<aside>

☘️ 다음 활동들은 **권장 사항**이며 수행 시 챌린저 개인에게 상점이 부여됩니다.

[‣](https://app.notion.com/p/3d4b57f4596b800fab5bc9743ce8c255?pvs=21) 

</aside>

> 가이드라인에 제시된 **카테고리 중 1개를 선택해** 블로그를 작성합니다.
본인이 작성한 블로그 URL를 노션 폼에 제출하면, 상점 `+3점` 이 부여됩니다. (주 1회 제출 제한)
> 

<aside>

[‣](https://app.notion.com/p/3d5b57f4596b8023b08de1d77757de87?pvs=21) 

</aside>

> 
> 
> 
> 매주차별 챌린저분들이 작성해주신 블로그는 아래 아카이빙 페이지에서 확인 가능합니다!
> 
> [‣](https://app.notion.com/p/3d5b57f4596b80ebb468de68a6da651e?pvs=21) 
> 

## 📝 기술 블로그 주제 추천

---

<aside>
🌟

이번 주차에서 배운 내용을 자신의 말로 정리하며 복습해 보세요. 워크북에 나온 내용에 그치지 않고, 궁금한 부분을 직접 조사하거나 AI와 꼬리 질문을 이어가면 이해를 넓히는 데 도움이 돼요.

</aside>

아래 주제 중 하나를 선택하여 작성해도 좋아요.

- Tanstack Query를 사용하는 이유
- query key가 cache 재사용에 영향을 주는 방식
- staleTime과 gcTime의 역할 차이
- 기술 블로그 제출 링크: 링크를 입력해 주세요

# 🎁 ⭐️ 지식in 채널에서 **상점 받아가세요!** ⭐️🎁

---

<aside>
💡

워크북을 진행하다 궁금한 점이 생겼다면 너디너리 디스코드 서버의 `지식in 채널`을 활용해보세요!

</aside>

💬 질문 작성 → **상점 1점**

🙋 다른 챌린저의 질문에 답변 → **상점 1점**

> 워크북 수행하면서 궁금한 점도 해결하고, 다른 챌린저와 지식도 나누면서 상점까지 챙겨가세요! <u>주차별 최대 2점까지 상점을 획득할 수 있습니다.</u>
> 

![image.png](image%209.png)

# ⚡ 트러블 슈팅

---

<aside>
💡

실습 중 문제가 발생하면 **이슈 → 원인 → 해결 → 배운 점** 순서로 기록해 주세요. 오류 메시지를 지우거나 요약하지 말고 원문을 함께 남기면 원인을 찾는 데 도움이 돼요.

</aside>

- ⚡ 이슈 작성 예시
    
    **`이슈`**
    
    👉 검색어를 바꾸어도 이전 검색 결과가 계속 보였어요.
    
    **`원인`**
    
    👉 모든 검색 요청에 `['movies', 'search']`만 사용하고 실제 `query`를 query key에 넣지 않았어요.
    
    **`해결`**
    
    👉 key를 `['movies', 'search', { query: normalizedQuery }]`로 바꾸고 Query 개발자 도구에서 검색어마다 별도 캐시가 생기는지 확인했어요.
    
    **`배운 점`**
    
    👉 query function의 결과에 영향을 주는 값은 query key에도 포함해야 올바른 캐시를 찾을 수 있어요.
    
    **`참고 레퍼런스`**
    
    - [TanStack Query - Query Keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys) - query key에 포함해야 하는 값과 캐시 구분 방식을 확인할 수 있어요.
- ⚡ 이슈 No.1
    
    **`이슈`**
    
    👉 검색 페이지에 첫 진입 시 검색어가 없는 빈 문자열(`""`) 상태임에도 불구하고 검색 API 요청이 즉시 호출되어 불필요한 네트워크 요청 및 오류가 발생했음
    
    **`원인`**
    
    👉 `useQuery`는 기본적으로 컴포넌트 마운트 시점에 `queryFn`을 즉시 실행하기 때문에, 검색어 유무와 관계없이 페이지가 로드되자각자 API 요청이 발생했음
    
    **`해결`**
    
    👉 `useQuery`의 옵션에 `enabled: normalizedQuery.length > 0` 조건을 부여하여 검색어가 최소 1자 이상 입력되었을 때만 쿼리가 활성화되도록 제어함
    
    **`배운 점`**
    
    👉 사용자 입력에 반응하거나 특정 조건이 만족되어야만 실행되어야 하는 쿼리는 `enabled` 옵션을 적절히 활용하여 불필요한 네트워크 트래픽과 예기치 않은 오류 응답을 효과적으로 차단할 수 있음을 배움
    
    **`참고 레퍼런스`**
    
    - [TanStack Query - Disabling/Pausing Queries (공식 문서)](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries)

# 🔬 선택 심화 학습

---

6주차 학습을 모두 마친 뒤, Suspense와 ErrorBoundary가 로딩과 오류 UI를 나누어 처리하는 방식을 살펴보는 선택 심화 자료예요. 필수 학습에는 포함되지 않아요.

[6주차 심화 학습 - Suspense와 ErrorBoundary가 로딩과 오류를 처리하는 방식](https://app.notion.com/p/6-Suspense-ErrorBoundary-587d62e145e383e19f9e012558e6b006?pvs=21)

---

# 🤔 참고 자료

---

학습하다가 모르는 개념이 나오거나 예제가 예상대로 동작하지 않을 때 아래 자료를 참고해 보세요. 처음부터 끝까지 읽을 필요는 없어요. **궁금한 내용을 검색해 사전처럼 찾아보는 것**으로 충분해요.

- [TanStack Query 공식 문서](https://tanstack.com/query/latest/docs/framework/react/overview) - query, cache와 설정 옵션을 찾아볼 수 있어요.
- [TkDodo - The Query Options API](https://tkdodo.eu/blog/the-query-options-api) - `queryOptions`로 query key와 query function을 함께 정의하고 재사용하는 패턴을 확인할 수 있어요.
- [React Hook Form 공식 문서](https://react-hook-form.com/) - 폼 상태와 API를 확인할 수 있어요.
- [Zod 공식 문서](https://zod.dev/) - schema와 검증 메서드를 검색할 수 있어요.

---

Copyright © 2026 GwangSoo Lim(임광수) All rights reserved.