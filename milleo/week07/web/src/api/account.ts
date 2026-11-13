export interface Profile { memberId: number; email: string; nickname: string; introduction: string }
interface Envelope<T> { isSuccess: boolean; message: string; code: string; result: T }
export class AccountError extends Error { constructor(message: string, public status: number) { super(message); } }
const tokenKey = 'umcine-access-token';
function token() { return sessionStorage.getItem(tokenKey); }
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try { response = await fetch(`/api${path}`, { ...init, credentials: 'omit', headers: { 'Content-Type': 'application/json', ...(token() ? { Authorization: `Bearer ${token()}` } : {}), ...init.headers } }); }
  catch { throw new AccountError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.', 0); }
  const data = await response.json().catch(() => null) as Envelope<T> | null;
  if (!response.ok || !data?.isSuccess) throw new AccountError(data?.message || '요청을 처리하지 못했습니다. 다시 시도해 주세요.', response.status);
  return data.result;
}
async function write<T>(path: string, method: string, body?: unknown): Promise<T> {
  return request<T>(path, { method, ...(body ? { body: JSON.stringify(body) } : {}) });
}
export const account = {
  me: () => request<Profile>('/members/me'),
  login: async (email: string, password: string) => {
    const result = await write<{ accessToken: string }>('/auth/login', 'POST', { email: email.trim(), password });
    sessionStorage.setItem(tokenKey, result.accessToken);
    try { return await request<Profile>('/members/me'); }
    catch (error) { sessionStorage.removeItem(tokenKey); throw error; }
  },
  logout: async () => { sessionStorage.removeItem(tokenKey); },
  update: (profile: Omit<Profile, 'memberId'>) => write<Profile>('/members/me', 'PATCH', { email: profile.email, nickname: profile.nickname, introduction: profile.introduction }),
  signup: (body: { email: string; nickname: string; password: string }) => request<Profile>('/members', { method: 'POST', body: JSON.stringify(body) }),
  check: (field: 'email' | 'nickname', value: string) => request<{ available: boolean }>(`/members/${field}/${encodeURIComponent(value.trim())}`),
};
