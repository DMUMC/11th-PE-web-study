import { useEffect, useState } from 'react';
import { errorMessage } from '../api/tmdb';

type RequestState<T> = { status: 'loading' } | { status: 'error'; message: string } | { status: 'success'; data: T };
export function useRequest<T>(load: (signal: AbortSignal) => Promise<T>) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ load: typeof load; attempt: number; state: RequestState<T> }>({ load, attempt: 0, state: { status: 'loading' } });
  useEffect(() => {
    const controller = new AbortController();
    async function run() {
      try {
        const data = await load(controller.signal);
        if (!controller.signal.aborted) setResult({ load, attempt, state: { status: 'success', data } });
      } catch (error) {
        if (!controller.signal.aborted) setResult({ load, attempt, state: { status: 'error', message: errorMessage(error) } });
      }
    }
    void run();
    return () => controller.abort();
  }, [load, attempt]);
  const state: RequestState<T> = result.load === load && result.attempt === attempt ? result.state : { status: 'loading' };
  return { state, retry: () => setAttempt(value => value + 1) };
}
