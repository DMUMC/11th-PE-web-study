import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "../src/routeTree.gen";
import { useAuthStore } from "../src/stores/auth-store";

const fetchMock = vi.fn<typeof fetch>();
const alertMock = vi.fn();
const json = (body: unknown, status = 200) => Response.json(body, { status });
const ok = (result: unknown, status = 200) => json({ isSuccess: true, result }, status);
const member = { email: "week08@example.com", nickname: "영화친구", createdAt: "2026-11-15T10:00:00" };
const token = `header.${btoa('{"sub":"7"}')}.signature`;
let queryClient: QueryClient;

async function openPage(path: string) {
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: [path] }) });
  await router.load();
  render(<QueryClientProvider client={queryClient}><RouterProvider router={router} /></QueryClientProvider>);
  return router;
}

function fillSignup() {
  fireEvent.change(screen.getByLabelText("이메일", { exact: true }), { target: { value: "week+07@example.com" } });
  fireEvent.change(screen.getByLabelText("닉네임", { exact: true }), { target: { value: " 영화친구 " } });
  fireEvent.change(screen.getByLabelText("비밀번호", { exact: true }), { target: { value: "Week07!pass" } });
  fireEvent.change(screen.getByLabelText("비밀번호 확인", { exact: true }), { target: { value: "Week07!pass" } });
}

function checkDuplicate(label: string) {
  fireEvent.click(screen.getByRole("button", { name: `${label} 중복 확인` }));
}

beforeEach(() => {
  fetchMock.mockReset();
  alertMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  vi.stubGlobal("alert", alertMock);
  vi.stubGlobal("scrollTo", vi.fn());
  queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity } } });
  useAuthStore.getState().setAccessToken(null);
});

afterEach(() => {
  cleanup();
  queryClient.clear();
  useAuthStore.getState().setAccessToken(null);
  vi.unstubAllGlobals();
});

it("중복 검사 성공 후에만 가입 요청을 보내고 로그인 화면으로 이동한다", async () => {
  let postedBody: unknown;
  fetchMock.mockResolvedValueOnce(json({ available: true }));
  fetchMock.mockResolvedValueOnce(json({ available: true }));
  fetchMock.mockImplementationOnce(async (input) => {
    postedBody = await (input as Request).json();
    return json({ isSuccess: true, message: "회원가입에 성공했습니다." }, 201);
  });
  await openPage("/signup");
  fillSignup();
  const submit = screen.getByRole<HTMLButtonElement>("button", { name: "가입하기" });
  expect(submit.disabled).toBe(true);
  checkDuplicate("이메일");
  await waitFor(() => expect(alertMock).toHaveBeenCalledWith("사용할 수 있는 이메일이에요."));
  expect(submit.disabled).toBe(true);
  checkDuplicate("닉네임");
  await waitFor(() => expect(submit.disabled).toBe(false));
  fireEvent.click(submit);
  await screen.findByRole("heading", { name: "로그인" });
  expect(alertMock).toHaveBeenCalledWith("회원가입에 성공했습니다.");

  const requests = fetchMock.mock.calls.map(([request]) => request as Request);
  expect(new URL(requests[0].url).pathname).toBe("/members/email/week%2B07%40example.com");
  expect(new URL(requests[1].url).pathname).toBe(`/members/nickname/${encodeURIComponent("영화친구")}`);
  expect(requests[2].method).toBe("POST");
  expect(new URL(requests[2].url).pathname).toBe("/members");
  expect(postedBody).toEqual({
    email: "week+07@example.com", nickname: "영화친구", password: "Week07!pass",
  });
});

it("확인 중인 입력을 잠그고, 확인한 값을 수정하거나 중복이면 가입을 막는다", async () => {
  let resolveEmail!: (response: Response) => void;
  fetchMock.mockImplementationOnce(() => new Promise((resolve) => { resolveEmail = resolve; }));
  fetchMock.mockResolvedValueOnce(json({ available: true }));
  fetchMock.mockResolvedValueOnce(json({ available: false }));
  await openPage("/signup");
  fillSignup();
  const email = screen.getByLabelText<HTMLInputElement>("이메일", { exact: true });
  const submit = screen.getByRole<HTMLButtonElement>("button", { name: "가입하기" });
  checkDuplicate("이메일");
  expect(email.disabled).toBe(true);
  await waitFor(() => expect(resolveEmail).toBeTypeOf("function"));
  resolveEmail(json({ available: true }));
  await waitFor(() => expect(email.disabled).toBe(false));
  checkDuplicate("닉네임");
  await waitFor(() => expect(submit.disabled).toBe(false));
  fireEvent.change(email, { target: { value: "another@example.com" } });
  expect(submit.disabled).toBe(true);
  checkDuplicate("이메일");
  await waitFor(() => expect(alertMock).toHaveBeenCalledWith("이미 사용 중인 이메일이에요."));
  expect(submit.disabled).toBe(true);
  expect(fetchMock).toHaveBeenCalledTimes(3);
});

it("유효하지 않은 입력을 안내하고, 가입 실패 시 입력값을 유지한다", async () => {
  fetchMock.mockResolvedValueOnce(json({ available: true }));
  fetchMock.mockResolvedValueOnce(json({ available: true }));
  fetchMock.mockResolvedValueOnce(json({ message: "충돌" }, 409));
  await openPage("/signup");
  const email = screen.getByLabelText<HTMLInputElement>("이메일", { exact: true });
  fireEvent.change(email, { target: { value: "invalid" } });
  expect(screen.getByText("올바른 이메일 형식으로 입력해 주세요.")).toBeTruthy();
  expect(screen.getByRole<HTMLButtonElement>("button", { name: "이메일 중복 확인" }).disabled).toBe(true);
  fillSignup();
  checkDuplicate("이메일");
  checkDuplicate("닉네임");
  const submit = screen.getByRole<HTMLButtonElement>("button", { name: "가입하기" });
  await waitFor(() => expect(submit.disabled).toBe(false));
  fireEvent.click(submit);
  await waitFor(() => expect(alertMock).toHaveBeenCalledWith("회원가입에 실패했어요. 다시 시도해 주세요."));
  expect(email.value).toBe("week+07@example.com");
  expect(submit.disabled).toBe(false);
});

function submitLogin() {
  fireEvent.change(screen.getByLabelText("이메일"), { target: { value: member.email } });
  fireEvent.change(screen.getByLabelText("비밀번호"), { target: { value: "Week08!pass" } });
  fireEvent.click(screen.getByRole("button", { name: "로그인", exact: true }));
}

it("로그인 실패를 알리고 성공하면 토큰 저장, 홈 이동, 인증 조회를 실행한다", async () => {
  fetchMock.mockImplementation(async (input) => {
    const req = input as Request;
    const path = new URL(req.url).pathname;
    if (path === "/auth/login") return ok({ nickname: member.nickname, accessToken: token });
    if (path === "/members/me") {
      expect(req.headers.get("Authorization")).toBe(`Bearer ${token}`);
      return ok(member);
    }
    return json({ results: [], total_pages: 0, total_results: 0, page: 1 });
  });
  fetchMock.mockResolvedValueOnce(json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." }, 401));
  const router = await openPage("/login");
  submitLogin();
  await screen.findByRole("alert");
  expect(useAuthStore.getState().accessToken).toBeNull();
  submitLogin();
  await screen.findByRole("link", { name: "마이페이지" });
  expect(router.state.location.pathname).toBe("/");
  expect(JSON.parse(localStorage.getItem("umcine-auth-store")!).state.accessToken).toBe(token);
});

it.each(["/mypage", "/mypage/edit"])("로그인 전에는 %s 에서 로그인으로 이동한다", async (path) => {
  const router = await openPage(path);
  await screen.findByRole("heading", { name: "로그인" });
  expect(router.state.location.pathname).toBe("/login");
  expect(fetchMock).not.toHaveBeenCalled();
});

it("로그인한 사용자가 로그인 URL을 열면 홈으로 이동한다", async () => {
  useAuthStore.getState().setAccessToken(token);
  fetchMock.mockImplementation(async (input) =>
    new URL((input as Request).url).pathname === "/members/me"
      ? ok(member)
      : json({ results: [], total_pages: 0, total_results: 0, page: 1 }));
  const router = await openPage("/login");
  await screen.findByRole("link", { name: "마이페이지" });
  expect(router.state.location.pathname).toBe("/");
});

it("내 정보가 401이면 토큰을 지우고 로그인 페이지로 이동한다", async () => {
  useAuthStore.getState().setAccessToken(token);
  fetchMock.mockResolvedValueOnce(json({}, 401));
  await openPage("/mypage/edit");
  await screen.findByRole("heading", { name: "로그인" });
  expect(useAuthStore.getState().accessToken).toBeNull();
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

it("수정 응답으로 내 정보 캐시를 갱신하고 추가 GET 없이 새 닉네임을 표시한다", async () => {
  useAuthStore.getState().setAccessToken(token);
  fetchMock.mockImplementation(async (input) => {
    const req = input as Request;
    if (new URL(req.url).pathname === "/favorites") return ok([]);
    expect(req.headers.get("Authorization")).toBe(`Bearer ${token}`);
    if (req.method === "PATCH") {
      expect(await req.json()).toEqual({ nickname: "새닉네임" });
      return ok({ ...member, nickname: "새닉네임" });
    }
    return ok(member);
  });
  await openPage("/mypage/edit");
  const nickname = await screen.findByLabelText("닉네임");
  fireEvent.change(nickname, { target: { value: " 새닉네임 " } });
  fireEvent.click(screen.getByRole("button", { name: "저장하기" }));
  await screen.findByText("새닉네임");
  await screen.findByText("즐겨찾기한 영화가 없어요.");
  const calls = fetchMock.mock.calls.map(([input]) => input as Request);
  expect(calls.filter((req) => req.method === "GET" && new URL(req.url).pathname === "/members/me")).toHaveLength(1);
});

it("영화 상세에서 즐겨찾기와 평점의 조회·등록·수정·삭제를 연결한다", async () => {
  useAuthStore.getState().setAccessToken(token);
  const movie = { id: 550, title: "파이트 클럽", genres: [], runtime: null, poster_path: null, backdrop_path: null };
  const rating = { ratingId: 12, movieId: 550, score: 4, comment: "좋아요", createdAt: "", updatedAt: "" };
  fetchMock.mockImplementation(async (input) => {
    const req = input as Request;
    const path = new URL(req.url).pathname;
    if (path === "/3/movie/550") return json(movie);
    if (path === "/members/me") return ok(member);
    if (path === "/members/7/ratings") return json([]);
    expect(req.headers.get("Authorization")).toBe(`Bearer ${token}`);
    if (path === "/favorites/550" && req.method === "GET") return ok({ isFavorite: false });
    if (path === "/favorites" && req.method === "POST") {
      expect(await req.json()).toEqual({ movieId: 550 });
      return ok({ favoriteId: 3, movieId: 550 }, 201);
    }
    if (path === "/favorites/550" && req.method === "DELETE") return ok(null);
    if (path === "/ratings" && req.method === "POST") {
      expect(await req.json()).toEqual({ movieId: 550, score: 4, comment: "좋아요" });
      return ok(rating, 201);
    }
    if (path === "/ratings/12" && req.method === "PATCH") {
      expect(await req.json()).toEqual({ score: 5, comment: "좋아요" });
      return ok({ ...rating, score: 5 });
    }
    if (path === "/ratings/12" && req.method === "DELETE") return ok(null);
    throw new Error(`Unexpected request: ${req.method} ${path}`);
  });
  await openPage("/movies/550");
  const bookmark = await screen.findByRole<HTMLButtonElement>("button", { name: "파이트 클럽 북마크" });
  await waitFor(() => expect(bookmark.disabled).toBe(false));
  fireEvent.click(bookmark);
  await waitFor(() => expect(bookmark.getAttribute("aria-pressed")).toBe("true"));
  fireEvent.click(bookmark);
  await waitFor(() => expect(bookmark.getAttribute("aria-pressed")).toBe("false"));
  fireEvent.click(await screen.findByRole("radio", { name: "4점" }));
  fireEvent.change(screen.getByLabelText("후기 (선택)"), { target: { value: "좋아요" } });
  fireEvent.click(screen.getByRole("button", { name: "평점 등록" }));
  await screen.findByText("등록한 평점: 4점");
  fireEvent.click(screen.getByRole("radio", { name: "5점" }));
  fireEvent.click(screen.getByRole("button", { name: "평점 수정" }));
  await screen.findByText("등록한 평점: 5점");
  fireEvent.click(screen.getByRole("button", { name: "평점 삭제" }));
  await screen.findByText("평점을 삭제했어요.");
});

it("마이페이지에서 서버의 즐겨찾기 목록을 영화 상세 링크로 표시한다", async () => {
  useAuthStore.getState().setAccessToken(token);
  fetchMock.mockImplementation(async (input) => {
    const req = input as Request;
    const path = new URL(req.url).pathname;
    if (path === "/members/me") return ok(member);
    if (path === "/favorites") {
      expect(req.headers.get("Authorization")).toBe(`Bearer ${token}`);
      return ok([{ favoriteId: 3, movieId: 550, createdAt: member.createdAt }]);
    }
    if (path === "/3/movie/550") return json({ title: "파이트 클럽" });
    throw new Error(`Unexpected request: ${req.method} ${path}`);
  });
  await openPage("/mypage");
  expect((await screen.findByRole("link", { name: "파이트 클럽" })).getAttribute("href")).toBe("/movies/550");
});
