# 8주차 - TanStack Query로 서버에 데이터 요청하기

# ❗ 학습 목표

---

<aside>
🎯

이번 주차를 마치면 다음을 할 수 있어요.

- useMutation으로 요청의 진행, 성공과 실패를 관리할 수 있어요.
- 기존 회원가입의 요청 상태 관리를 useMutation으로 바꿀 수 있어요.
- 로그인 API를 연결하고 성공 응답의 토큰을 저장할 수 있어요.
- invalidateQueries와 setQueryData의 캐시 갱신 방식을 비교할 수 있어요.
- 내 정보, 즐겨찾기와 평점 API를 연결하고 변경 결과를 화면에 반영할 수 있어요.
</aside>

# 📸 잠깐! 스터디 인증샷은 찍으셨나요? 📸

---

- 스터디 리더께서 대표로 매주 한 장씩 남겨주시면 좋겠어요! 🙆💗
- 사진을 저장해 이미지로 첨부하거나 복사하여 붙여 넣어 주세요.

[](https://app.notion.com)

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
    
    7주차에는 인증과 JWT의 개념을 배우고 회원가입 요청의 상태를 직접 관리했어요.
    
    이번 주차에는 useMutation을 이용해서 데이터 요청 상태를 보다 편리하게 관리하고, 최신 데이터를 반영하는 방법에 대해 알아봐요.
    
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
    

## 1. 회원가입 API를 useMutation으로 옮기기

앞서 TanStack Query는 서버 상태를 쉽게 관리하도록 도와준다고 언급했어요. 

그중 `useMutation`은 데이터를 생성, 수정, 삭제하거나 서버에서 특정 작업을 실행하는 요청의 상태를 관리하는 훅이에요.

- 1.1 회원가입 API에 상태를 늘린다면?
    
    7주차에서는 `isSubmitting`으로 회원가입 요청이 진행 중인지 관리했어요.
    
    여기에 성공과 실패 여부, 서버의 응답 데이터와 오류까지 화면에 표시해야 한다면 관리할 상태가 더 늘어나요.
    
    ```tsx
    // 요청에 성공했을 때 받은 응답 데이터
    const [data, setData] = useState<SomeSuccessResponse | null>(null);
    // 요청 성공 여부
    const [isSuccess, setIsSuccess] = useState(false);
    // 요청 실패 여부
    const [isError, setIsError] = useState(false);
    // 요청에 실패했을 때의 오류 정보
    const [error, setError] = useState<SomeErrorResponse | null>(null);
    // 요청 진행 여부: 기존 isSubmitting과 같은 역할
    const [isPending, setIsPending] = useState(false);
    ```
    
    이후 실패 횟수나 요청을 시작한 시점까지 확인해야 한다면 상태를 더 추가해야 해요. 재시도 기능을 넣거나 요청을 실행하고 결과를 처리하는 방식까지 바꾸려면 직접 작성할 코드도 늘어나요.
    
    `useMutation`은 이런 상태와 값을 관리하고, 요청 실행과 재시도에 필요한 기능도 제공해요. 덕분에 요청과 관련된 상태와 함수를 직접 하나씩 만들어 관리하는 코드를 줄일 수 있어요.
    
- 1.2 회원가입 API 리팩토링
    
    이제 `useMutation`으로 회원가입 요청 상태와 성공·실패 처리를 관리해 볼게요. 7주차 `try` 안의 성공 처리는 `onSuccess`로, `catch` 안의 실패 처리는 `onError`로 옮겨요.
    
    `src/hooks/use-signup-mutation.ts`를 만들고 아래 코드를 작성해요.
    
    ```tsx
    import { useMutation } from "@tanstack/react-query";
    import { signup } from "../api/members/signup";
    // import { useNavigate } from "@tanstack/react-router";
    
    export function useSignupMutation() {
      // const navigate = useNavigate();
    
      return useMutation({
        mutationFn: signup,
        onSuccess: (response) => {
          alert(response.message);
          
          // 로그인 페이지 연결 후 주석 해제
          // navigate({ to: "/login" });
        },
        onError: () => {
          alert("회원가입에 실패했어요. 다시 시도해 주세요.");
        },
      });
    }
    ```
    
    `signup-page.tsx`의 기존 `signup` import를 `useSignupMutation` import로 바꿔요. `SignupPage` 안의 `isSubmitting` 상태는 제거하고, 기존 `handleSubmit`을 아래 코드로 교체해요.
    
    ```tsx
    const signupMutation = useSignupMutation();
    
    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      
      if (!canSubmit || signupMutation.isPending) return;
      
      signupMutation.mutate({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });
    };
    ```
    
    가입하기 버튼에서 사용하던 `isSubmitting`은 `signupMutation.isPending`으로 바꿔요.
    
- 📚 같이 보면 좋은 자료
    - [TanStack Query - Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations) - mutation의 상태와 입력값 전달을 확인할 수 있어요.

## 2. 로그인 API 연결하기

이번에는 로그인 이후 토큰을 저장하고, 내 정보 조회 API까지 연결해 볼 거예요. 

로그인에 성공하면 홈으로 이동하고, `invalidateQueries`로 내 정보를 다시 조회하도록 해봐요.

- 2.1 invalidateQueries로 캐시 갱신하기
    
    6주차에서 `staleTime` 동안은 조회한 데이터를 최신으로 취급한다고 배웠어요. 그런데 로그인처럼 사용자의 동작으로 조회 결과가 달라졌다면, 그 시간이 끝날 때까지 기다려야 할까요?
    
    `invalidateQueries`는 지정한 query key의 캐시를 `stale` 상태로 바꿔요. `staleTime`이 남아 있어도 활성화된 query가 화면에서 사용 중이면 다시 요청해요. 사용 중이 아니라면 다음에 그 query를 사용하는 화면이 열릴 때 다시 요청해요.
    
    `useQueryClient`로 `QueryClientProvider`에 연결된 QueryClient를 가져와서 사용해요.
    
    ```tsx
    const queryClient = useQueryClient();
    
    queryClient.invalidateQueries({ queryKey: ["members", "me"] });
    ```
    
- 2.2 로그인과 내 정보 조회 함수 작성하기
    
    **1. 토큰 저장하기**
    
    4주차에서 배운 Zustand의 `persist`로 토큰을 저장해요. `src/stores/auth-store.ts`를 만들어요.
    
    ```tsx
    import { create } from "zustand";
    import { createJSONStorage, persist } from "zustand/middleware";
    
    interface AuthStore {
      accessToken: string | null;
      setAccessToken: (accessToken: string | null) => void;
    }
    
    export const useAuthStore = create<AuthStore>()(
      persist(
        (set) => ({
          accessToken: null,
          setAccessToken: (accessToken) => set({ accessToken }),
        }),
        {
          name: "umcine-auth-store",
          storage: createJSONStorage(() => localStorage),
          partialize: (state) => ({ accessToken: state.accessToken }),
        },
      ),
    );
    ```
    
    **2. 인증 요청용 API 인스턴스 만들기**
    
    `extend`는 기존 API 인스턴스의 설정을 이어받아 새 인스턴스를 만들어요. 기존 `apiClient`는 그대로 두고, 공통 서버 주소에 인증 처리를 더한 `authApi`를 만들 수 있어요.
    
    `src/api/auth-api.ts`를 만들어요.
    
    ```tsx
    import { useAuthStore } from "../stores/auth-store";
    import { apiClient } from "./api-client";
    
    export const authApi = apiClient.extend({
      hooks: {
        beforeRequest: [
          ({ request }) => {
            const accessToken = useAuthStore.getState().accessToken;
            if (accessToken) {
              request.headers.set("Authorization", `Bearer ${accessToken}`);
            }
          },
        ],
        afterResponse: [
          ({ response }) => {
            if (response.status === 401) {
              useAuthStore.getState().setAccessToken(null);
            }
          },
        ],
      },
    });
    ```
    
    `beforeRequest`는 요청을 보내기 전에 최신 토큰을 읽어 헤더에 넣어요. React 컴포넌트 바깥에서는 `getState()`로 store의 현재 값을 읽을 수 있어요.
    
    `afterResponse`는 인증에 실패한 `401` 응답을 받으면 토큰을 비워요.
    
    **3. 로그인 요청 함수 작성하기**
    
    `POST /auth/login`에 이메일과 비밀번호를 보내면 닉네임과 토큰을 받아요. 인증이 필요 없는 로그인은 `apiClient`로 요청해요. `src/api/auth/login.ts`를 작성해요.
    
    ```tsx
    import { apiClient } from "../api-client";
    
    export interface LoginRequest {
      email: string;
      password: string;
    }
    
    export interface LoginResponse {
      isSuccess: boolean;
      code: string;
      message: string;
      result: {
        nickname: string;
        accessToken: string;
      };
    }
    
    export function login(body: LoginRequest) {
      return apiClient.post("auth/login", { json: body }).json<LoginResponse>();
    }
    ```
    
    **4. 내 정보 조회 함수 작성하기**
    
    `GET /members/me`는 인증이 필요하므로 `authApi`로 요청해요. `src/api/members/me.ts`를 만들어요.
    
    ```tsx
    import { authApi } from "../auth-api";
    
    export interface MemberInfo {
      email: string;
      nickname: string;
      createdAt: string;
    }
    
    interface MeResponse {
      isSuccess: boolean;
      code: string;
      message: string;
      result: MemberInfo;
    }
    
    export async function getMe(): Promise<MemberInfo> {
      const response = await authApi.get("members/me").json<MeResponse>();
      return response.result;
    }
    ```
    
- 2.3 내 정보 조회를 헤더에 연결하기
    
    `src/components/layout/header.tsx`에서 요청 함수와 store, `useQuery`를 import해요.
    
    ```tsx
    import { useQuery } from "@tanstack/react-query";
    import { getMe } from "@/api/members/me";
    import { useAuthStore } from "@/stores/auth-store";
    ```
    
    `Header` 안에 내 정보 query를 추가해요. 토큰이 있을 때만 조회하고, 내 정보는 자주 바뀌지 않으므로 `staleTime`을 5분으로 설정해요.
    
    ```tsx
    const accessToken = useAuthStore((state) => state.accessToken);
    const meQuery = useQuery({
      queryKey: ["members", "me"],
      queryFn: getMe,
      enabled: Boolean(accessToken),
      staleTime: 5 * 60 * 1000,
      retry: false,
    });
    ```
    
    인증 실패로 토큰을 지운 뒤 같은 조회를 자동 재시도하지 않도록 `retry`를 꺼요.
    
    헤더의 로그인 버튼 영역을 바꿔요. 로그인 전에는 로그인 링크를, 조회 중에는 버튼 크기의 로딩 표시를, 토큰이 있는 상태에서는 기존 마이페이지 링크를 표시해요.
    
    ```tsx
    {!accessToken ? (
      <Link to="/login">로그인</Link>
    ) : meQuery.isLoading ? (
      <span className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
    ) : (
      <Link to="/my">마이페이지</Link>
    )}
    ```
    
    6주차의 조건부 조회처럼 `isLoading`으로 실제 첫 요청 중인지 확인해요. 토큰의 유효성은 내 정보 API에서 확인하며, `401`이면 토큰이 비워져 로그인 링크로 바뀌어요.
    
- 2.4 로그인 성공 후 내 정보 갱신하고 홈으로 이동하기
    
    **1. 로그인 페이지 접근 제한하기**
    
    로그인된 사용자가 로그인 주소를 직접 열어도 홈으로 이동하도록 연결해요. `beforeLoad`는 페이지를 표시하기 전에 실행돼요. 여기서 `redirect`를 던지면 지정한 주소로 이동해요.
    
    `src/routes/login.tsx`에 `beforeLoad`를 추가해요.
    
    ```tsx
    import { createFileRoute, redirect } from "@tanstack/react-router";
    import { LoginPage } from "@/pages/auth/login-page";
    import { useAuthStore } from "@/stores/auth-store";
    
    export const Route = createFileRoute("/login")({
      beforeLoad: () => {
        if (useAuthStore.getState().accessToken) {
          throw redirect({ to: "/" });
        }
      },
      component: LoginPage,
    });
    ```
    
    이 검사는 로그인 폼의 접근을 제어해요. 토큰의 유효성은 앞서 연결한 내 정보 API가 확인해요.
    
    **2. 로그인 성공 처리하기**
    
    `src/hooks/use-login-mutation.ts`를 아래처럼 작성해요.
    
    ```tsx
    import { useMutation, useQueryClient } from "@tanstack/react-query";
    import { useNavigate } from "@tanstack/react-router";
    import { login } from "../api/auth/login";
    import { useAuthStore } from "../stores/auth-store";
    
    export function useLoginMutation() {
      const queryClient = useQueryClient();
      const navigate = useNavigate();
      const setAccessToken = useAuthStore((state) => state.setAccessToken);
    
      return useMutation({
        mutationFn: login,
        onSuccess: (response) => {
          setAccessToken(response.result.accessToken);
          alert("로그인에 성공했어요.");
          queryClient.invalidateQueries({ queryKey: ["members", "me"] });
          navigate({ to: "/" });
        },
        onError: () => {
          alert("로그인에 실패했어요. 다시 시도해 주세요.");
        },
      });
    }
    ```
    
    토큰을 저장한 뒤 내 정보 캐시를 무효화하고 홈으로 이동해요.
    
    `src/pages/auth/login-page.tsx` 상단에 import와 이메일 검사 상수를 추가해요.
    
    ```tsx
    import { useLoginMutation } from "@/hooks/use-login-mutation";
    
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    ```
    
    아래 코드는 로그인 입력값을 `form.email`과 `form.password`로 관리한 예시예요. `LoginPage` 안에 제출 함수를 작성해요.
    
    ```tsx
    const loginMutation = useLoginMutation();
    const canSubmit = EMAIL_REGEX.test(form.email.trim()) && form.password.length > 0;
    
    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!canSubmit || loginMutation.isPending) return;
    
      loginMutation.mutate({
        email: form.email.trim(),
        password: form.password,
      });
    };
    ```
    
    로그인 폼에 `onSubmit={handleSubmit}`을 연결하고 제출 버튼을 바꿔요.
    
    ```tsx
    <button type="submit" disabled={!canSubmit || loginMutation.isPending}>
      {loginMutation.isPending ? "로그인 중" : "로그인"}
    </button>
    ```
    
    - 로그인하면 토큰이 `localStorage`에 저장되고 홈으로 이동하는지 확인해요.
    - 로그인된 상태에서 `/login` 주소를 직접 열면 홈으로 이동해야 해요.
    - 잘못된 비밀번호로 로그인하면 실패 안내가 보이고 다시 제출할 수 있어야 해요.
- 📚 같이 보면 좋은 자료
    - [API 문서](https://workbook.devnoco.com/docs) - 로그인과 내 정보 조회 명세를 확인할 수 있어요.
    - [TanStack Query - Query Invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation) - 캐시를 무효화할 때 다시 조회하는 조건을 확인할 수 있어요.
    - [Zustand - Persisting store data](https://zustand.docs.pmnd.rs/reference/integrations/persisting-store-data) - `persist`로 토큰을 저장하고 복원하는 방법을 확인할 수 있어요.

## 3. 캐시를 직접 바꾸는 방법과 비교하기

`invalidateQueries`로 다시 조회할 때 응답이 늦게 도착하면 어떻게 될까요? 사용자는 로딩 화면이나 이전 데이터를 보며 변경된 결과가 표시될 때까지 기다려야 해요.

변경한 상태를 바로 반영하고 싶거나, 서버 응답에 수정된 결과가 담겨 있다면 `setQueryData`로 캐시를 직접 갱신할 수 있어요.

- 3.1 setQueryData로 데이터 갱신하기
    
    `setQueryData`는 지정한 query key의 캐시 값을 직접 바꿔요. 서버에서 받은 응답뿐 아니라 요청에 보낸 값이나 기존 캐시를 바탕으로 만든 값도 사용할 수 있어요.
    
    내 정보 수정 API를 예로 들어볼게요. `PATCH /members/me`에 닉네임을 보내면, 성공 응답의 `result`에 이메일, 수정된 닉네임과 가입 시각이 담겨 있어요. 내 정보 조회와 같은 형태이므로 이 값으로 캐시를 바꿀 수 있어요.
    
    `src/api/members/update-me.ts`를 만들어요.
    
    ```tsx
    import { authApi } from "../auth-api";
    import type { MemberInfo } from "./me";
    
    export interface UpdateMeRequest {
      nickname: string;
    }
    
    interface UpdateMeResponse {
      isSuccess: boolean;
      code: string;
      message: string;
      result: MemberInfo;
    }
    
    export function updateMe(body: UpdateMeRequest) {
      return authApi.patch("members/me", { json: body }).json<UpdateMeResponse>();
    }
    ```
    
    `src/hooks/use-update-me-mutation.ts`를 만들어요.
    
    ```tsx
    import { useMutation, useQueryClient } from "@tanstack/react-query";
    import { updateMe } from "../api/members/update-me";
    import type { MemberInfo } from "../api/members/me";
    
    export function useUpdateMeMutation() {
      const queryClient = useQueryClient();
    
      return useMutation({
        mutationFn: updateMe,
        onSuccess: (response) => {
          queryClient.setQueryData<MemberInfo>(["members", "me"], response.result);
          alert("내 정보 수정에 성공했어요.");
        },
        onError: () => {
          alert("내 정보 수정에 실패했어요. 다시 시도해 주세요.");
        },
      });
    }
    ```
    
    2단원에서 내 정보를 조회한 query key와 같은 `["members", "me"]`에 `response.result`를 저장해요. 이 query를 사용하는 화면에는 수정된 정보가 바로 반영돼요. 이미 최신 정보를 받았으므로 다시 조회할 필요가 없어요.
    
    내 정보 수정 컴포넌트에서 `useUpdateMeMutation`을 import하고, 기존 제출 함수를 아래처럼 바꿔요. 예시의 `form.nickname`은 각자 구현한 입력값 관리 방식에 맞게 바꿔 주세요.
    
    ```tsx
    import { useUpdateMeMutation } from "@/hooks/use-update-me-mutation";
    ```
    
    ```tsx
    const updateMeMutation = useUpdateMeMutation();
    const nickname = form.nickname.trim();
    const canSubmit = nickname.length >= 2 && nickname.length <= 12;
    
    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!canSubmit || updateMeMutation.isPending) return;
    
      updateMeMutation.mutate({ nickname });
    };
    ```
    
    폼에 `onSubmit={handleSubmit}`을 연결하고 저장 버튼을 바꿔요.
    
    ```tsx
    <button type="submit" disabled={!canSubmit || updateMeMutation.isPending}>
      {updateMeMutation.isPending ? "저장 중" : "저장"}
    </button>
    ```
    
    닉네임을 수정한 뒤 내 정보 화면에 새 닉네임이 표시되는지 확인해요. Network 탭에서는 `PATCH /members/me` 이후 캐시 갱신을 위한 `GET /members/me`가 추가로 발생하지 않는지 확인해요.
    
    요청에 보낸 값으로도 갱신할 수 있어요. 예를 들어 닉네임 수정에 성공했다면, 기존 캐시의 이메일과 가입 시각은 유지하고 닉네임만 요청에 보낸 값으로 바꿀 수 있어요.
    
    서버가 값을 변환하거나 다른 정보도 함께 변경한다면 요청에 보낸 값만으로는 최신 상태를 알 수 없어요. 이때는 응답 데이터를 사용하거나 `invalidateQueries`로 다시 조회해요.
    
    [닉네임 수정과 캐시 갱신](%E1%84%92%E1%85%AA%E1%84%86%E1%85%A7%E1%86%AB_%E1%84%80%E1%85%B5%E1%84%85%E1%85%A9%E1%86%A8_2026-10-11_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_10.42.24.mov)
    
    닉네임 수정과 캐시 갱신
    
- 📚 같이 보면 좋은 자료
    - [TanStack Query - Updates from Mutation Responses](https://tanstack.com/query/latest/docs/framework/react/guides/updates-from-mutation-responses) - 응답으로 캐시를 직접 갱신하는 방법을 확인할 수 있어요.

# 🎯 핵심 키워드

---

<aside>
💡

아래 키워드를 직접 조사하고 자신의 말로 정리해 보세요. 정의만 옮기지 말고, 워크북에서 작성한 예시나 실제 사용 상황을 함께 기록하면 좋아요.

</aside>

- 클라이언트 상태와 서버 상태
    - **입력값, 로그인 토큰과 회원 정보는 각각 어디에서 관리하는 것이 적절할까요? 각 상태의 원본이 어디에 있는지도 함께 생각해 보세요.**
        - **입력값(Form State)**: 폼 입력 필드의 텍스트나 체크박스 상태 등은 브라우저 렌더링에만 직접 관여하는 순수 클라이언트 상태입니다. 원본이 브라우저 메모리(컴포넌트 로컬 state)에 위치하므로 `useState`로 관리하는 것이 적절합니다.
        - **로그인 토큰(Auth Token)**: 인증 인가에 필요한 JWT 토큰은 새로고침이나 페이지 이동 후에도 유지되어야 하므로 클라이언트 측 영속 스토리지(`localStorage`)와 결합된 전역 상태(`Zustand` + `persist`)에서 관리하는 것이 적절합니다.
        - **회원 정보(Member Info)**: 이메일, 닉네임, 가입일 등은 실제 데이터베이스에 영속화되어 있고 서버가 관리하는 전형적인 '서버 상태(Server State)'입니다. 따라서 클라이언트가 원본을 소유하지 않고, `TanStack Query` 캐시(`useQuery`, queryKey: `["members", "me"]`)를 통해 서버의 최신 상태를 동기화받아 관리하는 것이 적절합니다.
    - **같은 회원 정보를 전역 store와 query 캐시에 각각 저장하면 어떤 문제가 생길 수 있을까요?**
        - **상태 동기화 불일치(Single Source of Truth 위반)**: 마이페이지에서 닉네임을 변경했을 때 TanStack Query 캐시만 업데이트되거나 서버에만 반영되고 Zustand store에는 반영되지 않으면, 헤더에는 이전 닉네임이 보이고 마이페이지에는 새 닉네임이 보이는 등 화면 간 데이터 정합성이 깨지게 됩니다. 또한 두 곳 모두 업데이트 로직을 중복 구현해야 하므로 유지보수 비용과 버그 발생 가능성이 급격히 증가합니다.

- 캐시 일관성
    - **서버에서 데이터를 수정했는데 다른 화면에는 이전 값이 보이는 이유는 무엇인가요?**
        - 브라우저의 TanStack Query 캐시 메모리에 이전 응답 데이터가 `staleTime` 동안 '여전히 유효한 데이터'로 보관되어 있기 때문입니다. 서버 측 DB는 이미 수정되었더라도, 클라이언트가 서버에 재요청하지 않았거나 캐시를 갱신하지 않으면 캐시에 저장된 옛날 스냅샷 데이터를 그대로 화면에 렌더링하게 됩니다.
    - **변경한 데이터를 다시 조회하는 방식과 캐시를 직접 수정하는 방식은 각각 어떤 상황에 적절할까요?**
        - **`invalidateQueries` (재조회 방식)**:
            - 서버 응답에 변경된 전체 데이터가 포함되어 있지 않거나, 수정 작업으로 인해 다른 연관 데이터(예: 전체 목록 카운트, 정렬 순서, 연쇄 계산 값 등)까지 함께 변경되는 경우에 적절합니다. 네트워크 요청이 1회 더 발생하지만 서버와의 완벽한 데이터 정합성을 가장 안전하게 보장할 수 있습니다.
        - **`setQueryData` (직접 수정 방식)**:
            - `PATCH /members/me`처럼 서버의 수정 응답에 변경된 결과 데이터 객체가 온전히 반환되는 경우, 또는 사용자의 액션 즉시 변경 결과를 화면에 즉각 반영하고 싶을 때(낙관적 업데이트 등) 적절합니다. 불필요한 추가 네트워크 조회 요청(`GET`)을 없앨 수 있어 빠른 반응성과 트래픽 절감 효과를 얻을 수 있습니다.

# 📢 학습 후기

---

<aside>
💡

이번 주차에서는 TanStack Query의 `useMutation`을 활용해 비동기 생성·수정·삭제 요청의 라이프사이클(진행 중, 성공, 실패)을 선언적으로 다루는 방법과, JWT 인증 토큰을 Zustand의 `persist` 미들웨어로 관리하고 Ky의 `extend` 훅(`beforeRequest`, `afterResponse`)을 통해 인증 헤더를 자동으로 주입하는 패턴을 학습했습니다.

특히 서버 상태를 수정했을 때 화면에 최신 상태를 반영하는 두 가지 접근법인 `invalidateQueries`(캐시 무효화 후 자동 재요청)와 `setQueryData`(뮤테이션 응답값으로 캐시 즉시 치환)의 동작 원리를 비교 실습하면서, 캐시 일관성을 언제 어떻게 유지해야 하는지 깊이 있게 이해할 수 있었습니다. 또한 TanStack Router의 Pathless Layout Route(`_authenticated.tsx`)를 활용해 인증되지 않은 사용자의 접근을 라우팅 레벨에서 원천 차단하는 Route Group 아키텍처를 직접 구성해보며 실무적인 프론트엔드 인가 흐름을 체계화할 수 있었습니다.

</aside>

# 🔥 미션

---

<aside>
📝

필수 미션을 진행하며 작성한 **핵심 코드와 최종 확인 결과만** 아래 **미션 기록**의 **필수 미션** 토글에 기록해 주세요. 모든 명령과 중간 과정을 빠짐없이 적을 필요는 없어요.

선택 미션을 진행했다면 결과를 **선택 미션** 토글에 기록해 주세요.

</aside>

## 필수 미션

- 로그인 전용 폴더 만들기
    
    `Route Group` 문법으로 마이페이지와 내 정보 수정처럼 로그인 후에만 접근할 수 있는 페이지를 같은 폴더로 묶어요. 공통 `Layout Route`를 만들고 `<Outlet />`으로 하위 페이지를 렌더링해요.
    
    참고: https://tanstack.com/router/latest/docs/routing/file-naming-conventions
    
- 남은 API 연결하기
    
    이번이 마지막 API 연동 실습인 만큼, 남은 API에 필요한 데이터 흐름과 클라이언트 로직은 직접 고민하고 구현해 보세요. 요청과 응답에 어떤 데이터가 필요한지, 화면에 어떻게 연결하고 변경 결과를 반영할지 판단해 보세요.
    
    #### 마이페이지
    
    - `GET /favorites`
    
    #### 영화 상세
    
    - `GET /favorites/{movieId}`
    - `POST /favorites`
    - `DELETE /favorites/{movieId}`
    - `GET /members/{memberId}/ratings`
    - `POST /ratings`
    - `PATCH /ratings/{ratingId}`
    - `DELETE /ratings/{ratingId}`

## 선택 미션

- `invalidateQueries`와 `setQueryData`를 각각 적용하고, 추가 요청 여부와 화면 갱신 방식을 비교해 보세요. 어떤 상황에 각 방식을 선택할지 정리해 보세요.
- `mutationOptions`를 이용해 로그인, 회원가입, 즐겨찾기 등의 mutation을 리팩터링해 보세요.

# 💪 미션 기록

---

<aside>
🍀

미션 기록은 아래 토글 안에 작성하거나, 별도 페이지를 만들어 작성해도 좋아요.

</aside>

- 필수 미션
    ### 1. 📸 결과 화면

    > **① 회원가입 및 로그인 (`useMutation` 연동 및 JWT 토큰 저장)**
    > 
    > ![1.png](1.png)
    > *회원가입 후 로그인 성공 시 `localStorage`에 `umcine-auth-store` 이름으로 `accessToken`이 저장되고 홈으로 이동합니다.*

    > **② 헤더 내 정보 동적 반영 (`getMe` Query 연동)**
    > 
    > ![2.png](2.png)
    > *로그인 전에는 "로그인" 링크가 보이고, 로그인 후에는 쿼리를 통해 사용자 닉네임과 "로그아웃" 버튼이 헤더에 즉시 렌더링됩니다.*

    > **③ Route Group 로그인 가드 (`_authenticated` 레이아웃 라우트)**
    > 
    > ![3.png](3.png)
    > *토큰이 없는 비로그인 상태에서 `/my` 또는 `/my/edit`에 직접 접근하면 `_authenticated.tsx`의 `beforeLoad` 가드가 동작하여 경고창과 함께 `/login`으로 자동 리다이렉트됩니다.*

    > **④ 영화 상세 페이지 즐겨찾기(Favorites) 조회 및 토글**
    > 
    > ![4.png](4.png)
    > *영화 상세 페이지에서 `GET /favorites/{movieId}`로 즐겨찾기 여부를 확인하고, 버튼 클릭 시 `POST/DELETE /favorites`가 호출되어 캐시 갱신과 함께 아이콘/버튼 상태가 실시간 변경됩니다.*

    > **⑤ 마이페이지 즐겨찾기 목록 연동 (`GET /favorites`)**
    > 
    > ![5.png](5.png)
    > *마이페이지에서 사용자의 프로필 정보와 함께 `GET /favorites`로 조회된 내가 찜한 영화 목록(ID 배지)이 함께 렌더링됩니다.*

    > **⑥ 내 정보 수정 및 캐시 즉시 갱신 (`PATCH /members/me` + `setQueryData`)**
    > 
    > ![6.png](6.png)
    > *닉네임 수정 시 불필요한 추가 `GET` 요청 없이 서버 응답값으로 TanStack Query 캐시(`["members", "me"]`)를 즉시 갱신하여 마이페이지와 헤더에 새로운 닉네임이 즉각 반영됩니다.*

    ---

    ### 2. 💻 주요 코드

    **① 회원가입 & 로그인 Mutation 훅**
    - `src/hooks/use-signup-mutation.ts`
    ```tsx
    import { useMutation } from "@tanstack/react-query";
    import { useNavigate } from "@tanstack/react-router";
    import { signup } from "../api/members/signup";

    export function useSignupMutation() {
      const navigate = useNavigate();

      return useMutation({
        mutationFn: signup,
        onSuccess: (response) => {
          alert(response.message || "회원가입이 완료되었습니다!");
          navigate({ to: "/login" });
        },
        onError: () => {
          alert("회원가입에 실패했어요. 다시 시도해 주세요.");
        },
      });
    }
    ```
    - `src/hooks/use-login-mutation.ts`
    ```tsx
    import { useMutation, useQueryClient } from "@tanstack/react-query";
    import { useNavigate } from "@tanstack/react-router";
    import { login } from "../api/auth/login";
    import { useAuthStore } from "../stores/auth-store";

    export function useLoginMutation() {
      const queryClient = useQueryClient();
      const navigate = useNavigate();
      const setAccessToken = useAuthStore((state) => state.setAccessToken);

      return useMutation({
        mutationFn: login,
        onSuccess: (response) => {
          setAccessToken(response.result.accessToken);
          alert("로그인에 성공했어요.");
          queryClient.invalidateQueries({ queryKey: ["members", "me"] });
          navigate({ to: "/" });
        },
        onError: () => {
          alert("로그인에 실패했어요. 다시 시도해 주세요.");
        },
      });
    }
    ```

    **② Zustand 토큰 저장소 및 Ky 인증 확장 인스턴스**
    - `src/stores/auth-store.ts`
    ```tsx
    import { create } from "zustand";
    import { createJSONStorage, persist } from "zustand/middleware";

    interface AuthStore {
      accessToken: string | null;
      setAccessToken: (accessToken: string | null) => void;
      logout: () => void;
    }

    export const useAuthStore = create<AuthStore>()(
      persist(
        (set) => ({
          accessToken: null,
          setAccessToken: (accessToken) => set({ accessToken }),
          logout: () => set({ accessToken: null }),
        }),
        {
          name: "umcine-auth-store",
          storage: createJSONStorage(() => localStorage),
          partialize: (state) => ({ accessToken: state.accessToken }),
        },
      ),
    );
    ```
    - `src/api/auth-api.ts`
    ```tsx
    import { useAuthStore } from "../stores/auth-store";
    import { apiClient } from "./api-client";

    export const authApi = apiClient.extend({
      hooks: {
        beforeRequest: [
          ({ request }) => {
            const accessToken = useAuthStore.getState().accessToken;
            if (accessToken) {
              request.headers.set("Authorization", `Bearer ${accessToken}`);
            }
          },
        ],
        afterResponse: [
          ({ response }) => {
            if (response.status === 401) {
              useAuthStore.getState().setAccessToken(null);
            }
          },
        ],
      },
    });
    ```

    **③ Route Group 로그인 전용 폴더 및 Layout Route 가드**
    - `src/routes/_authenticated.tsx`
    ```tsx
    import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
    import { useAuthStore } from "../stores/auth-store";

    export const Route = createFileRoute("/_authenticated")({
      beforeLoad: () => {
        if (!useAuthStore.getState().accessToken) {
          alert("로그인이 필요한 페이지입니다.");
          throw redirect({ to: "/login" });
        }
      },
      component: AuthenticatedLayout,
    });

    function AuthenticatedLayout() {
      return <Outlet />;
    }
    ```
    - `src/routes/_authenticated/my/index.tsx`
    ```tsx
    import { createFileRoute } from "@tanstack/react-router";
    import { MyPage } from "../../../pages/my/my-page";

    export const Route = createFileRoute("/_authenticated/my/")({
      component: MyPage,
    });
    ```
    - `src/routes/_authenticated/my/edit.tsx`
    ```tsx
    import { createFileRoute } from "@tanstack/react-router";
    import { MyEditPage } from "../../../pages/my/my-edit-page";

    export const Route = createFileRoute("/_authenticated/my/edit")({
      component: MyEditPage,
    });
    ```

    **④ 영화 상세 페이지 즐겨찾기 & 평점 연동**
    - `src/pages/movies/movie-detail-page.tsx` (핵심 로직 발췌)
    ```tsx
    // 즐겨찾기 상태 조회 Query
    const favoriteStatusQuery = useQuery({
      queryKey: ["favorites", "status", movieId],
      queryFn: () => getFavoriteStatus(movieId),
      enabled: Boolean(accessToken) && isValidMovieId,
    });

    const isFavorite = favoriteStatusQuery.data?.isFavorite ?? false;

    // 즐겨찾기 토글 Mutation
    const toggleFavoriteMutation = useMutation({
      mutationFn: async () => {
        if (!accessToken) {
          alert("로그인이 필요한 기능입니다.");
          return;
        }
        if (isFavorite) {
          await deleteFavorite(movieId);
        } else {
          await addFavorite(movieId);
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["favorites", "status", movieId] });
        queryClient.invalidateQueries({ queryKey: ["favorites"] });
      },
      onError: () => {
        alert("즐겨찾기 상태 변경에 실패했습니다.");
      },
    });
    ```

    **⑤ 내 정보 수정 캐시 즉시 갱신 (`setQueryData`)**
    - `src/hooks/use-update-me-mutation.ts`
    ```tsx
    import { useMutation, useQueryClient } from "@tanstack/react-query";
    import { updateMe } from "../api/members/update-me";
    import type { MemberInfo } from "../api/members/me";

    export function useUpdateMeMutation() {
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn: updateMe,
        onSuccess: (response) => {
          queryClient.setQueryData<MemberInfo>(["members", "me"], response.result);
          alert("내 정보 수정에 성공했어요.");
        },
        onError: () => {
          alert("내 정보 수정에 실패했어요. 다시 시도해 주세요.");
        },
      });
    }
    ```
- 선택 미션

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

---

## 🎁 ⭐️ 지식in 채널에서 **상점 받아가세요!** ⭐️🎁

---

<aside>
💡

워크북을 진행하다 궁금한 점이 생겼다면 너디너리 디스코드 서버의 `지식in 채널`을 활용해보세요!

</aside>

💬 질문 작성 → **상점 1점**

🙋 다른 챌린저의 질문에 답변 → **상점 1점**

> 워크북 수행하면서 궁금한 점도 해결하고, 다른 챌린저와 지식도 나누면서 상점까지 챙겨가세요! <u>주차별 최대 2점까지 상점을 획득할 수 있습니다.</u>
> 

![image.png](image.png)

## 📝 기술 블로그 주제 추천

---

<aside>
🌟

이번 주차에서 배운 내용을 자신의 말로 정리하며 복습해 보세요. 워크북에 나온 내용에 그치지 않고, 궁금한 부분을 직접 조사하거나 AI와 꼬리 질문을 이어가면 이해를 넓히는 데 도움이 돼요.

</aside>

아래 주제 중 하나를 선택하여 작성해도 좋아요.

- invalidateQueries와 setQueryData의 캐시 갱신 방식과 선택 기준
- 기술 블로그 제출 링크: 링크를 입력해 주세요

# ⚡ 트러블 슈팅

---

<aside>
💡

실습 중 문제가 발생하면 **이슈 → 원인 → 해결 → 배운 점** 순서로 기록해 주세요. 오류 메시지를 지우거나 요약하지 말고 원문을 함께 남기면 원인을 찾는 데 도움이 돼요.

</aside>

- ⚡ 이슈 작성 예시
    
    **`이슈`**
    
    👉 로그인 전인데 헤더에 로딩 표시가 계속 보였어요.
    
    **`원인`**
    
    👉 `enabled: false`로 조회를 껐지만 `isPending`으로 로딩을 표시했어요. 캐시가 없으면 요청하지 않는 상태에서도 `isPending`은 참이에요.
    
    **`해결`**
    
    👉 토큰이 없으면 로그인 링크를 표시하고, 실제 첫 요청 중인지는 `isLoading`으로 확인했어요. 로그인 전과 요청 중, 조회 성공 후의 표시를 각각 확인했어요.
    
    **`배운 점`**
    
    👉 데이터가 아직 없는 상태와 실제 요청 중인 상태를 구분해야 해요.
    
    **`참고 레퍼런스`**
    
    - [TanStack Query - Disabling Queries](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries) - 비활성 query의 상태와 로딩 표시를 확인할 수 있어요.
- ⚡ 이슈 No.1
    
    **`이슈`**
    
    👉 TanStack Router에서 로그인 전용 Route Group(`_authenticated.tsx`, `_authenticated/my/`)을 추가하고 `npm run build`를 실행했을 때 아래와 같은 TypeScript 컴파일 에러가 발생함
    ```bash
    src/routes/_authenticated.tsx(4,38): error TS2345: Argument of type '"/_authenticated"' is not assignable to parameter of type 'keyof FileRoutesByPath | undefined'.
    ```
    
    **`원인`**
    
    👉 `package.json`의 빌드 명령어가 `tsc -b && vite build` 순서로 되어 있어, 신규 라우트 파일을 생성한 뒤 TanStack Router 플러그인이 `routeTree.gen.ts`를 자동 생성하기 전에 `tsc`가 먼저 기존의 오래된 `routeTree.gen.ts`를 검사하여 새로 정의한 라우트 경로 타입을 인식하지 못함
    
    **`해결`**
    
    👉 `npx vite build` 또는 `npm run dev`를 1회 실행하여 TanStack Router Vite 플러그인이 최신 라우트 구조를 기반으로 `src/routeTree.gen.ts`를 먼저 자동 생성하도록 한 뒤, `npm run build`를 재수행하여 0 에러로 빌드 성공함
    
    **`배운 점`**
    
    👉 TanStack Router의 파일 기반 라우팅은 자동 생성되는 `routeTree.gen.ts`에 강하게 결합되어 있으므로, 새로운 라우트 경로나 Layout Route Group을 추가했을 때는 타입스크립트 검사 전에 routeTree가 먼저 생성·갱신되어야 한다는 점을 알게 됨
    
    **`참고 레퍼런스`**
    
    - [TanStack Router - Route Trees and Code Generation](https://tanstack.com/router/latest/docs/framework/react/guide/route-trees)

- ⚡ 이슈 No.2
    
    **`이슈`**
    
    👉 내 정보 수정 페이지에서 닉네임을 변경하고 저장을 완료했으나, 마이페이지와 상단 헤더에 여전히 이전 닉네임이 그대로 표시되는 현상 발생
    
    **`원인`**
    
    👉 `useUpdateMeMutation`에서 수정 요청 성공 후 alert만 띄우고 캐시를 갱신하지 않았음. 상단 헤더의 `["members", "me"]` 쿼리는 `staleTime`이 5분으로 설정되어 있어, 캐시가 만료되지 않아 기존 스냅샷 데이터를 그대로 화면에 렌더링하고 있었음
    
    **`해결`**
    
    👉 `useUpdateMeMutation`의 `onSuccess` 콜백에 `queryClient.setQueryData<MemberInfo>(["members", "me"], response.result)`를 추가하여, `PATCH /members/me`의 성공 응답 데이터로 캐시를 즉시 치환함. 불필요한 추가 `GET` 요청 없이 헤더와 마이페이지 모두 실시간으로 새 닉네임이 반영됨
    
    **`배운 점`**
    
    👉 서버 상태를 수정한 후 화면 간 캐시 일관성을 유지하기 위해선 반드시 `invalidateQueries`로 재조회하거나, 서버 응답 데이터가 온전할 경우 `setQueryData`로 캐시를 즉각 동기화해 주어야 함을 배움
    
    **`참고 레퍼런스`**
    
    - [TanStack Query - Updates from Mutation Responses](https://tanstack.com/query/latest/docs/framework/react/guides/updates-from-mutation-responses)

# 🔬 선택 심화 학습

---

즐겨찾기를 해제할 때 서버의 성공 응답을 기다리지 않고 아이콘을 바로 바꿀 수 있어요. 

이렇게 요청이 성공할 것으로 예상하고, 응답이 오기 전에 변경 결과를 화면에 먼저 보여 주는 방식을 **낙관적 업데이트**라고 해요. 

낙관적 업데이트를 구현하는 방법으로 React의 `useOptimistic`을 사용하는 방법과 TanStack Query를 사용하는 방법을 각각 살펴보고, 각 방법에서 요청이 실패했을 때 화면을 어떻게 되돌리는지도 알아봐요.

[8주차 심화 학습 - 서버 응답 전에 화면을 바꾸는 낙관적 업데이트](https://app.notion.com/p/8-c51d62e145e382eab38e0181ed2d78d8?pvs=21)

---

# 🤔 참고 자료

---

학습하다가 모르는 개념이 나오거나 예제가 예상대로 동작하지 않을 때 아래 자료를 참고해 보세요. 처음부터 끝까지 읽을 필요는 없어요. **궁금한 내용을 검색해 사전처럼 찾아보는 것**으로 충분해요.

- [TanStack Query - Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations) - useMutation의 상태와 콜백을 확인할 수 있어요.
- [TanStack Query - Invalidations from Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations) - 수정 이후 query를 무효화하는 흐름을 확인할 수 있어요.
- [Ky 공식 문서](https://github.com/sindresorhus/ky) - 기존 회원가입 함수의 JSON 요청과 오류 처리를 확인할 수 있어요.

---

Copyright © 2026 GwangSoo Lim(임광수) All rights reserved.