import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { records } from '../api/movie-records';
import { useAuthStore } from '../stores/auth-store';
export function useFavorites() {
 const token = useAuthStore(s => s.accessToken);
 const client = useQueryClient();
 const queryKey = ['favorites', token];
 const query = useQuery({queryKey, queryFn: records.favorites, enabled: Boolean(token), retry:false});
 const mutation = useMutation({mutationFn: async (id:number) => {
  if (!token) throw new Error('로그인이 필요합니다.');
  const state = await records.favorite(id);
  return state.isFavorite ? records.remove(id) : records.add(id);
 }, onSuccess: () => client.invalidateQueries({queryKey:['favorites']})});
 return { ...query, bookmarkedIds: token ? (query.data ?? []).map(f => f.movieId) : [], toggleBookmark: (id:number) => { if (!mutation.isPending) mutation.mutate(id); }, mutation };
}
