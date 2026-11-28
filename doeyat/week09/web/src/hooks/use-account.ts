import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { account } from '../api/account';
import { useAuthStore } from '../stores/auth-store';
export const meKey = ['members', 'me'];
export function useMe() {
 const token = useAuthStore(s => s.accessToken);
 const query = useQuery({ queryKey: meKey, queryFn: account.me, enabled: Boolean(token), staleTime: 300000, retry: false });
 return { ...query, data: token ? query.data : undefined };
}
export function useSignupMutation() { return useMutation({ mutationFn: account.signup }); }
export function useLoginMutation() {
 const client = useQueryClient();
 return useMutation({ mutationFn: ({email,password}: {email:string;password:string}) => account.login(email,password), onSuccess: () => client.invalidateQueries({queryKey: meKey}) });
}
export function useUpdateProfileMutation() {
 const client = useQueryClient();
 return useMutation({ mutationFn: account.update, onSuccess: profile => client.setQueryData(meKey, profile) });
}
