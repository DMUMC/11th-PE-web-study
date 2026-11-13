import type { UseQueryResult } from '@tanstack/react-query';
import { errorMessage } from '../api/tmdb';
export function queryState<T>(q: UseQueryResult<T, Error>) {
 if (q.isPending) return { status: 'loading' as const };
 if (q.isError) return { status: 'error' as const, message: errorMessage(q.error) };
 return { status: 'success' as const, data: q.data };
}
