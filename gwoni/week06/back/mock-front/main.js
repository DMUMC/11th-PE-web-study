const API = "http://localhost:8080";

const $ = (id) => document.getElementById(id);

async function call(outId, path, body) {
  const options = body
    ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
    : {};
  try {
    const res = await fetch(API + path, options);
    const data = await res.json();
    $(outId).textContent = `${res.status}\n${JSON.stringify(data, null, 2)}`;
  } catch (e) {
    // CORS 에러는 여기로 들어옴
    $(outId).textContent = `에러: ${e.message}`;
  }
}

$("reg-btn").onclick = () =>
  call("reg-out", "/members/register", {
    email: $("reg-email").value,
    password: $("reg-password").value,
    nickname: $("reg-nickname").value,
  });

$("login-btn").onclick = () =>
  call("login-out", "/members/login", {
    email: $("login-email").value,
    password: $("login-password").value,
  });

$("nickname-btn").onclick = () =>
  call("nickname-out", `/members/nickname/${encodeURIComponent($("nickname").value)}`);

$("email-btn").onclick = () =>
  call("email-out", `/members/email/${encodeURIComponent($("email").value)}`);

$("ratings-btn").onclick = () =>
  call("ratings-out", `/members/${encodeURIComponent($("member-id").value)}/ratings`);
