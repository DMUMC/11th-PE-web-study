import { useSession } from '../stores/session-store';

interface Member {
  memberId: number;
  email: string;
  nickname: string;
}
export interface Profile extends Member {
  introduction: string;
}
interface Envelope<T> {
  isSuccess: boolean;
  message: string;
  result: T;
}

export class AccountError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = useSession.getState().token;
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`/api${path}`, { ...init, credentials: 'omit', headers });
  } catch (error) {
    if (init.signal?.aborted) throw error;
    throw new AccountError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.', 0);
  }

  if (response.status === 401 && path !== '/auth/login' && token && useSession.getState().token === token) {
    useSession.getState().setToken(null);
  }
  const data = await response.json().catch(() => null) as Envelope<T> | null;
  if (!response.ok || !data?.isSuccess) {
    throw new AccountError(data?.message || '요청을 처리하지 못했습니다. 다시 시도해 주세요.', response.status);
  }
  return data.result;
}

export const account = {
  me: (signal: AbortSignal) => apiRequest<Profile>('/members/me', { signal }),
  login: (body: { email: string; password: string }) =>
    apiRequest<{ accessToken: string }>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  update: (body: Omit<Profile, 'memberId'>) =>
    apiRequest<Profile>('/members/me', { method: 'PATCH', body: JSON.stringify(body) }),
  signup: (body: { email: string; nickname: string; password: string }) =>
    apiRequest<Member>('/members', { method: 'POST', body: JSON.stringify(body) }),
  check: (field: 'email' | 'nickname', value: string) =>
    apiRequest<{ available: boolean }>(`/members/${field}/${encodeURIComponent(value.trim())}`),
};
