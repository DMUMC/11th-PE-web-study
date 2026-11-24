/** @type {string} */
const API = "http://localhost:8080";

/** @typedef {"A" | "B" | "none" | "fake"} TokenSlot */

/** 실행 기록에 표시할 토큰 이름. @type {Record<TokenSlot, string>} */
const TOKEN_LABELS = { A: "토큰 A", B: "토큰 B", none: "토큰 없음", fake: "위조 토큰" };

/** 로그인으로 받은 토큰 A, B를 보관한다. @type {{ A: string | null, B: string | null }} */
const tokens = { A: null, B: null };

/**
 * @param {string} id
 * @returns {HTMLInputElement}
 */
const $ = (id) => /** @type {HTMLInputElement} */ (document.getElementById(id));

/** @returns {TokenSlot} */
function selectedSlot() {
  const checked = /** @type {HTMLInputElement} */ (
    document.querySelector('input[name="token"]:checked')
  );
  return /** @type {TokenSlot} */ (checked.value);
}

/** @returns {string | null} 선택한 슬롯의 토큰 (없음이면 null) */
function currentToken() {
  /** @type {TokenSlot} */
  const slot = selectedSlot();
  if (slot === "none") return null;
  if (slot === "fake") return "abc.def.ghi";
  return tokens[slot];
}

/** @returns {void} */
function renderTokens() {
  /** @type {(t: string | null) => string} */
  const short = (t) => (t ? `${t.slice(0, 20)}...` : "(없음)");
  $("token-out").textContent = `A: ${short(tokens.A)}\nB: ${short(tokens.B)}\n선택: ${selectedSlot()}`;
}

/**
 * 호출 한 건을 '전체 실행 기록'에 한 줄로 추가한다.
 * @param {string} method
 * @param {string} path
 * @param {boolean} auth
 * @param {number} status
 * @param {any} data
 * @returns {void}
 */
function appendLog(method, path, auth, status, data) {
  /** @type {string} */
  const tokenLabel = auth ? TOKEN_LABELS[selectedSlot()] : "공개";
  /** @type {string} */
  const code = data?.code ?? (Array.isArray(data) ? `[${data.length}건]` : JSON.stringify(data));
  /** @type {HTMLLIElement} */
  const li = document.createElement("li");
  li.className = status < 400 ? "ok" : "fail";
  li.textContent = `${method} ${decodeURIComponent(path)} (${tokenLabel}) → ${status} ${code}${data?.message ? ` · ${data.message}` : ""}`;
  $("log-list").appendChild(li);
}

/**
 * 요청을 보내고 상태 코드와 응답 본문을 outId 영역에 출력한다.
 * @param {string} outId
 * @param {string} method
 * @param {string} path
 * @param {Record<string, unknown>} [body]
 * @param {boolean} [auth] true면 선택한 토큰을 Authorization 헤더로 보낸다
 * @returns {Promise<any>} 응답 본문
 */
async function call(outId, method, path, body, auth = false) {
  /** @type {Record<string, string>} */
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (auth) {
    /** @type {string | null} */
    const token = currentToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  try {
    /** @type {Response} */
    const res = await fetch(API + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    /** @type {any} */
    const data = await res.json();
    /** @type {string} */
    const tokenLabel = auth ? ` (${TOKEN_LABELS[selectedSlot()]})` : "";
    $(outId).textContent = `${method} ${decodeURIComponent(path)}${tokenLabel} → ${res.status}\n${JSON.stringify(data, null, 2)}`;
    appendLog(method, path, auth, res.status, data);
    return data;
  } catch (e) {
    $(outId).textContent = `에러: ${/** @type {Error} */ (e).message}`;
    return null;
  }
}

/**
 * 로그인 후 받은 토큰을 slot에 저장한다.
 * @param {"A" | "B"} slot
 * @returns {Promise<void>}
 */
async function login(slot) {
  /** @type {any} */
  const data = await call("login-out", "POST", "/auth/login", {
    email: $("login-email").value,
    password: $("login-password").value,
  });
  if (data?.isSuccess) {
    tokens[slot] = data.result.accessToken;
    renderTokens();
  }
}

document.querySelectorAll('input[name="token"]').forEach((el) => {
  el.addEventListener("change", renderTokens);
});

$("reg-btn").onclick = () =>
  call("reg-out", "POST", "/members", {
    email: $("reg-email").value,
    password: $("reg-password").value,
    nickname: $("reg-nickname").value,
  });

$("login-a-btn").onclick = () => login("A");
$("login-b-btn").onclick = () => login("B");

$("me-btn").onclick = () => call("me-out", "GET", "/members/me", undefined, true);

$("me-update-btn").onclick = () =>
  call("me-out", "PATCH", "/members/me", { nickname: $("me-nickname").value }, true);

$("rating-create-btn").onclick = async () => {
  /** @type {any} */
  const data = await call(
    "rating-create-out",
    "POST",
    "/ratings",
    {
      movieId: Number($("rating-movie-id").value),
      score: Number($("rating-score").value),
      comment: $("rating-comment").value,
    },
    true,
  );
  // 등록에 성공하면 수정·삭제 칸에 ratingId를 채운다.
  if (data?.isSuccess) $("rating-id").value = String(data.result.ratingId);
};

$("rating-update-btn").onclick = () =>
  call(
    "rating-edit-out",
    "PATCH",
    `/ratings/${encodeURIComponent($("rating-id").value)}`,
    { score: Number($("rating-new-score").value), comment: $("rating-new-comment").value },
    true,
  );

$("rating-delete-btn").onclick = () =>
  call("rating-edit-out", "DELETE", `/ratings/${encodeURIComponent($("rating-id").value)}`, undefined, true);

$("ratings-btn").onclick = () =>
  call("ratings-out", "GET", `/members/${encodeURIComponent($("member-id").value)}/ratings`);

$("nickname-btn").onclick = () =>
  call("dup-out", "GET", `/members/nickname/${encodeURIComponent($("nickname").value)}`);

$("email-btn").onclick = () =>
  call("dup-out", "GET", `/members/email/${encodeURIComponent($("email").value)}`);

/** @returns {number} 즐겨찾기 칸의 movieId */
const favMovieId = () => Number($("fav-movie-id").value);

$("fav-create-btn").onclick = () =>
  call("fav-out", "POST", "/favorites", { movieId: favMovieId() }, true);

$("fav-list-btn").onclick = () => call("fav-out", "GET", "/favorites", undefined, true);

$("fav-status-btn").onclick = () =>
  call("fav-out", "GET", `/favorites/${favMovieId()}`, undefined, true);

$("fav-delete-btn").onclick = () =>
  call("fav-out", "DELETE", `/favorites/${favMovieId()}`, undefined, true);

$("record-btn").onclick = () =>
  call(
    "record-out",
    "POST",
    "/movie-records",
    {
      movieId: Number($("record-movie-id").value),
      score: Number($("record-score").value),
      comment: $("record-comment").value,
      addToFavorites: $("record-fav").checked,
    },
    true,
  );

/**
 * 새 계정을 만들어 7·8주차 API를 성공 흐름대로 차례로 호출한다.
 * 결과는 각 섹션과 '전체 실행 기록'에 남고, 요약은 run-all-out에 출력한다.
 * @returns {Promise<void>}
 */
async function runAll() {
  /** @type {string} */
  const suffix = String(Date.now()).slice(-6);
  /** @type {string} */
  const email = `w8_${suffix}@umc.com`;
  /** @type {string} */
  const nickname = `w8_${suffix}`;
  /** @type {string} */
  const password = "Umc1234!";

  $("log-list").replaceChildren();
  /** @type {HTMLInputElement} */
  const slotA = /** @type {HTMLInputElement} */ (
    document.querySelector('input[name="token"][value="A"]')
  );
  slotA.checked = true;

  $("reg-email").value = email;
  $("reg-password").value = password;
  $("reg-nickname").value = nickname;
  $("login-email").value = email;
  $("login-password").value = password;
  $("nickname").value = nickname;
  $("email").value = email;

  /** @type {any} */
  const joined = await call("reg-out", "POST", "/members", { email, password, nickname });
  if (!joined?.isSuccess) {
    $("run-all-out").textContent = "회원가입 실패로 중단";
    return;
  }
  /** @type {number} */
  const memberId = joined.result.memberId;
  await login("A");
  await call("me-out", "GET", "/members/me", undefined, true);
  await call("me-out", "PATCH", "/members/me", { nickname: `${nickname}_수정` }, true);

  /** @type {any} */
  const rating = await call(
    "rating-create-out",
    "POST",
    "/ratings",
    { movieId: 550, score: 4, comment: "재밌어요" },
    true,
  );
  /** @type {number} */
  const ratingId = rating?.result?.ratingId;
  $("rating-id").value = String(ratingId);
  await call(
    "rating-edit-out",
    "PATCH",
    `/ratings/${ratingId}`,
    { score: 5, comment: "다시 봐도 좋아요" },
    true,
  );
  $("member-id").value = String(memberId);
  await call("ratings-out", "GET", `/members/${memberId}/ratings`);
  await call("rating-edit-out", "DELETE", `/ratings/${ratingId}`, undefined, true);

  await call("fav-out", "POST", "/favorites", { movieId: 550 }, true);
  await call("fav-out", "GET", "/favorites", undefined, true);
  await call("fav-out", "GET", "/favorites/550", undefined, true);
  await call("fav-out", "DELETE", "/favorites/550", undefined, true);
  await call(
    "record-out",
    "POST",
    "/movie-records",
    { movieId: 238, score: 5, comment: "다시 보고 싶은 영화", addToFavorites: true },
    true,
  );
  await call("fav-out", "GET", "/favorites", undefined, true);

  await call("dup-out", "GET", `/members/nickname/${encodeURIComponent(`${nickname}_수정`)}`);
  await call("dup-out", "GET", `/members/email/${encodeURIComponent(email)}`);

  /** @type {HTMLLIElement[]} */
  const rows = [...$("log-list").querySelectorAll("li")];
  /** @type {number} */
  const okCount = rows.filter((li) => li.classList.contains("ok")).length;
  $("run-all-out").textContent = `계정 ${email}\n성공 ${okCount} / 전체 ${rows.length}`;
}

$("run-all-btn").onclick = () => runAll();

renderTokens();

// ?autorun=1 로 열면 페이지가 뜨자마자 전체 실행 후 실행 기록으로 스크롤한다.
if (new URLSearchParams(location.search).has("autorun")) {
  runAll().then(() => $("log-section").scrollIntoView({ block: "end" }));
}
