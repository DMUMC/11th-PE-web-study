import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "../src/routeTree.gen";
import { getMoviesWithFetch } from "../src/api/movies/get-movies-with-fetch";
import { getMovies } from "../src/api/movies/get-movies";
import { searchMovies } from "../src/api/movies/search-movies";
import { getMovieDetail } from "../src/api/movies/get-movie-detail";
import { useMovieRequest } from "../src/hooks/use-movie-request";
import { useBookmarkStore } from "../src/stores/bookmark-store";

const movie = {
  id: 550, title: "파이트 클럽", original_title: "Fight Club", overview: "영화 줄거리",
  release_date: "1999-10-15", poster_path: null, backdrop_path: null,
  vote_average: 8.4, vote_count: 100, genre_ids: [18],
};
const list = { page: 1, results: [movie], total_pages: 2, total_results: 21 };
const detail = { ...movie, genres: [{ id: 18, name: "드라마" }], runtime: 139, tagline: "영화 태그라인" };
const fetchMock = vi.fn<typeof fetch>();
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { "Content-Type": "application/json" },
});

async function openPage(path: string) {
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: [path] }) });
  await router.load();
  render(<RouterProvider router={router} />);
  return router;
}

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  // jsdom에는 스크롤 API가 없으므로 라우터의 화면 이동만 대체합니다.
  vi.stubGlobal("scrollTo", vi.fn());
  useBookmarkStore.setState({ bookmarkedMovieIds: [] });
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("API 요청 계약", () => {
  it("순수 fetch에서 인증, query, JSON과 HTTP 실패를 처리한다", async () => {
    fetchMock.mockResolvedValueOnce(json(list));
    expect(await getMoviesWithFetch(2)).toEqual(list);
    const [url, options] = fetchMock.mock.calls[0];
    expect(String(url)).toContain("/3/movie/popular?language=ko-KR&page=2");
    expect(options?.headers).toEqual({ Authorization: "Bearer test-token" });
    fetchMock.mockResolvedValueOnce(json({}, 401));
    await expect(getMoviesWithFetch()).rejects.toThrow("401");
    fetchMock.mockRejectedValueOnce(new TypeError("Network failed"));
    await expect(getMoviesWithFetch()).rejects.toThrow("Network failed");
  });

  it("ky가 목록·검색·상세 endpoint와 query를 구성한다", async () => {
    fetchMock.mockImplementation(async () => json(list));
    await getMovies({ page: 2 });
    await searchMovies({ query: "  한글 & title  " });
    await getMovieDetail(550);
    const requests = fetchMock.mock.calls.map(([request]) => request as Request);
    expect(new URL(requests[0].url).pathname).toBe("/3/movie/popular");
    expect(new URL(requests[0].url).searchParams.get("page")).toBe("2");
    expect(requests[0].headers.get("Authorization")).toBe("Bearer test-token");
    const search = new URL(requests[1].url);
    expect(search.pathname).toBe("/3/search/movie");
    expect(search.searchParams.get("query")).toBe("한글 & title");
    expect(search.searchParams.get("include_adult")).toBe("false");
    expect(search.searchParams.get("language")).toBe("ko-KR");
    expect(new URL(requests[2].url).pathname).toBe("/3/movie/550");
  });
});

describe("목록·검색·상세 직접 접근", () => {
  it("로딩 후 목록을 표시하고 페이지 이동과 북마크가 작동한다", async () => {
    let resolve!: (value: Response) => void;
    fetchMock.mockImplementationOnce(() => new Promise((done) => { resolve = done; }));
    await openPage("/");
    expect(await screen.findByText("영화 목록을 불러오는 중이에요.")).toBeTruthy();
    await waitFor(() => expect(resolve).toBeTypeOf("function"));
    resolve(json(list));
    expect(await screen.findByRole("heading", { name: movie.title })).toBeTruthy();
    expect(screen.getByText("이미지 없음")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "파이트 클럽 북마크" }));
    expect(useBookmarkStore.getState().bookmarkedMovieIds).toEqual([550]);
    fetchMock.mockResolvedValueOnce(json({ ...list, page: 2 }));
    fireEvent.click(screen.getByRole("button", { name: "다음 페이지" }));
    await screen.findByLabelText("2페이지");
    expect((fetchMock.mock.calls.at(-1)?.[0] as Request).url).toContain("page=2");
    expect(screen.getByRole("button", { name: "다음 페이지" }).hasAttribute("disabled")).toBe(true);
  });

  it("빈 검색어는 API를 호출하지 않는다", async () => {
    await openPage("/search?query=%20%20");
    expect(await screen.findByText("검색어를 입력해 영화를 찾아보세요.")).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("검색 URL로 직접 접근하면 API 결과와 전체 개수를 표시한다", async () => {
    fetchMock.mockResolvedValueOnce(json(list));
    await openPage("/search?query=Fight");
    expect(await screen.findByRole("heading", { name: movie.title })).toBeTruthy();
    expect(screen.getByText("영화 21편")).toBeTruthy();
  });

  it.each(["/", "/search?query=empty"])("빈 결과 상태: %s", async (path) => {
    fetchMock.mockResolvedValueOnce(json({ ...list, results: [], total_results: 0 }));
    await openPage(path);
    expect(await screen.findByText(path === "/" ? "조건에 맞는 영화가 없어요." : "검색 결과가 없어요.")).toBeTruthy();
  });

  it.each(["/", "/search?query=error", "/movies/550"])("HTTP 오류 상태: %s", async (path) => {
    fetchMock.mockImplementation(async () => json({ status_message: "Invalid API key" }, 401));
    await openPage(path);
    const message = path === "/" ? "영화 목록을 불러오지 못했어요." : path.startsWith("/search") ? "검색 결과를 불러오지 못했어요." : "영화 정보를 불러오지 못했어요.";
    expect(await screen.findByText(message)).toBeTruthy();
  });

  it.each(["abc", "0", "-1", "1.5"])("잘못된 ID %s는 요청하지 않는다", async (id) => {
    await openPage(`/movies/${id}`);
    expect(await screen.findByText("올바르지 않은 영화 번호예요.")).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("존재하지 않는 영화의 404를 구분한다", async () => {
    fetchMock.mockResolvedValueOnce(json({}, 404));
    await openPage("/movies/999999999");
    expect(await screen.findByText("영화를 찾을 수 없어요.")).toBeTruthy();
  });

  it.each([139, null])("상세 응답의 정보와 누락 이미지를 표시한다: runtime=%s", async (runtime) => {
    fetchMock.mockResolvedValueOnce(json({ ...detail, runtime }));
    await openPage("/movies/550");
    expect(await screen.findByRole("heading", { name: movie.title })).toBeTruthy();
    expect(screen.getByText("Fight Club")).toBeTruthy();
    expect(screen.getByText(runtime === null ? /상영 시간 정보가 없어요/ : /2시간 19분/)).toBeTruthy();
    expect(screen.getAllByText("이미지 없음")).toHaveLength(2);
    expect(screen.getByText("This product uses the TMDB API but is not endorsed or certified by TMDB.")).toBeTruthy();
  });
});

it("이전 요청의 늦은 응답이 현재 요청의 결과를 덮어쓰지 않는다", async () => {
  let completeOld!: (value: string) => void;
  let oldSignal!: AbortSignal;
  const oldRequest = (signal: AbortSignal) => {
    oldSignal = signal;
    return new Promise<string>((resolve) => { completeOld = resolve; });
  };
  const newRequest = async () => "새 검색 결과";
  const { result, rerender } = renderHook(({ request }) => useMovieRequest(request), { initialProps: { request: oldRequest } });
  rerender({ request: newRequest });
  await waitFor(() => expect(result.current).toEqual({ status: "success", data: "새 검색 결과" }));
  expect(oldSignal.aborted).toBe(true);
  await act(async () => completeOld("이전 검색 결과"));
  expect(result.current).toEqual({ status: "success", data: "새 검색 결과" });
});
