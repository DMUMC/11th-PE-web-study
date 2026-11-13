import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "../src/routeTree.gen";
import { useProfilePreviewStore } from "../src/stores/profile-preview-store";

const fetchMock = vi.fn<typeof fetch>();
const alertMock = vi.fn();
const json = (body: unknown, status = 200) => Response.json(body, { status });

async function openPage(path: string) {
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: [path] }) });
  await router.load();
  render(<RouterProvider router={router} />);
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
  useProfilePreviewStore.setState({ nickname: "영화친구" });
});

afterEach(() => {
  cleanup();
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

it("로그인 입력은 반영하되 API를 호출하지 않는다", async () => {
  await openPage("/login");
  const email = screen.getByLabelText<HTMLInputElement>("이메일", { exact: true });
  const password = screen.getByLabelText<HTMLInputElement>("비밀번호", { exact: true });
  fireEvent.change(email, { target: { value: "week07@example.com" } });
  fireEvent.change(password, { target: { value: "Week07!pass" } });
  expect(email.value).toBe("week07@example.com");
  expect(password.value).toBe("Week07!pass");
  fireEvent.click(screen.getByRole("button", { name: "로그인", exact: true }));
  expect(screen.getByRole("status").textContent).toBe("로그인 기능은 아직 연결되지 않았어요.");
  expect(fetchMock).not.toHaveBeenCalled();
});

it("내 정보 수정에서 저장한 닉네임을 조회 화면에 반영한다", async () => {
  await openPage("/mypage/edit");
  fireEvent.change(screen.getByLabelText("닉네임"), { target: { value: " 새닉네임 " } });
  fireEvent.click(screen.getByRole("button", { name: "저장하기" }));
  await screen.findByRole("heading", { name: "내 정보", exact: true });
  expect(screen.getByText("새닉네임")).toBeTruthy();
  expect(fetchMock).not.toHaveBeenCalled();
});
