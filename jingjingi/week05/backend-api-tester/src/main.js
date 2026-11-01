import "./style.css";

const defaultApiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

const apiTests = [
  {
    id: "nickname",
    title: "닉네임 중복 확인",
    description: "이미 사용 중인 닉네임인지 확인합니다.",
    label: "닉네임",
    defaultValue: "수현",
    inputType: "text",
    path: (value) => `/members/nickname/${encodeURIComponent(value)}`,
  },
  {
    id: "email",
    title: "이메일 중복 확인",
    description: "회원가입 전에 이메일 사용 가능 여부를 확인합니다.",
    label: "이메일",
    defaultValue: "noco@umc.com",
    inputType: "email",
    path: (value) => `/members/email/${encodeURIComponent(value)}`,
  },
  {
    id: "ratings",
    title: "회원별 평점 조회",
    description: "회원이 남긴 영화 평점을 최신 ID 순서로 조회합니다.",
    label: "회원 ID",
    defaultValue: "1",
    inputType: "number",
    path: (value) => `/members/${encodeURIComponent(value)}/ratings`,
  },
];

document.querySelector("#app").innerHTML = `
  <header class="topbar">
    <div class="brand"><span class="brand-mark">U</span> UMC Movie API Tester</div>
    <span class="environment">LOCAL · Spring Boot</span>
  </header>

  <main class="container">
    <section class="hero">
      <div>
        <p class="eyebrow">WEEK 05 · CORS INTEGRATION</p>
        <h1>백엔드 API 검증 화면</h1>
        <p class="hero-copy">Postman과 별도로 실제 브라우저에서 세 API를 호출하고 응답 JSON을 확인합니다.</p>
      </div>
      <button id="run-all-button" class="run-all-button" type="button">전체 API 실행</button>
    </section>

    <section class="server-panel" aria-label="서버 설정">
      <div>
        <span class="server-label">API SERVER</span>
        <strong id="server-address"></strong>
      </div>
      <span class="server-hint">프론트 http://localhost:5174 → 백엔드 http://localhost:8080</span>
    </section>

    <section class="api-grid">
      ${apiTests.map(createApiCard).join("")}
    </section>

    <section class="capture-guide">
      <h2>스크린샷 확인 항목</h2>
      <ul>
        <li>브라우저 주소창에 <code>http://localhost:5174</code>가 보이게 촬영</li>
        <li>각 카드의 전체 요청 URL, 상태 코드와 JSON 응답 포함</li>
        <li>Network 패널에서 요청을 선택해 <code>200 OK</code>와 CORS 응답 헤더 확인</li>
      </ul>
    </section>
  </main>
`;

document.querySelector("#server-address").textContent = defaultApiBaseUrl;

for (const test of apiTests) {
  const form = document.querySelector(`#${test.id}-form`);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    void runApiTest(test);
  });
}

document.querySelector("#run-all-button").addEventListener("click", async () => {
  const button = document.querySelector("#run-all-button");
  button.disabled = true;
  button.textContent = "전체 실행 중...";

  await Promise.all(apiTests.map((test) => runApiTest(test)));

  button.disabled = false;
  button.textContent = "전체 API 다시 실행";
});

function createApiCard(test) {
  const initialPath = test.path(test.defaultValue);

  return `
    <article class="api-card" id="${test.id}-card">
      <div class="card-heading">
        <span class="method">GET</span>
        <span class="status status-idle" id="${test.id}-status">실행 전</span>
      </div>
      <h2>${test.title}</h2>
      <p class="description">${test.description}</p>
      <code class="request-url" id="${test.id}-url">${defaultApiBaseUrl}${initialPath}</code>

      <form id="${test.id}-form">
        <label for="${test.id}-input">${test.label}</label>
        <div class="input-row">
          <input
            id="${test.id}-input"
            type="${test.inputType}"
            value="${test.defaultValue}"
            ${test.inputType === "number" ? 'min="1"' : ""}
            required
          />
          <button type="submit">요청 보내기</button>
        </div>
      </form>

      <div class="response-heading">
        <span>RESPONSE JSON</span>
        <time id="${test.id}-time"></time>
      </div>
      <pre id="${test.id}-response">API 호출 결과가 여기에 표시됩니다.</pre>
    </article>
  `;
}

async function runApiTest(test) {
  const input = document.querySelector(`#${test.id}-input`);
  const formButton = document.querySelector(`#${test.id}-form button`);
  const status = document.querySelector(`#${test.id}-status`);
  const requestUrl = document.querySelector(`#${test.id}-url`);
  const responseOutput = document.querySelector(`#${test.id}-response`);
  const responseTime = document.querySelector(`#${test.id}-time`);
  const value = input.value.trim();

  if (!value) {
    input.focus();
    return;
  }

  const url = `${defaultApiBaseUrl}${test.path(value)}`;
  requestUrl.textContent = url;
  status.className = "status status-loading";
  status.textContent = "요청 중";
  responseOutput.textContent = "서버의 응답을 기다리고 있습니다.";
  responseTime.textContent = "";
  formButton.disabled = true;

  const startedAt = performance.now();

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    const elapsed = Math.round(performance.now() - startedAt);
    const body = await readResponseBody(response);

    status.className = response.ok
      ? "status status-success"
      : "status status-error";
    status.textContent = `${response.status} ${response.statusText}`;
    responseTime.textContent = `${elapsed}ms`;
    responseOutput.textContent = JSON.stringify(body, null, 2);
  } catch (error) {
    status.className = "status status-error";
    status.textContent = "연결 실패";
    responseOutput.textContent = JSON.stringify(
      {
        message: "백엔드 서버에 연결하지 못했습니다.",
        check: [
          "Spring Boot 서버가 8080 포트에서 실행 중인지 확인하세요.",
          "백엔드 CORS에 http://localhost:5174가 허용됐는지 확인하세요.",
        ],
        detail: error instanceof Error ? error.message : String(error),
      },
      null,
      2,
    );
  } finally {
    formButton.disabled = false;
  }
}

async function readResponseBody(response) {
  const text = await response.text();

  if (!text) {
    return { status: response.status, message: "응답 본문이 없습니다." };
  }

  try {
    return JSON.parse(text);
  } catch {
    return { status: response.status, message: text };
  }
}
