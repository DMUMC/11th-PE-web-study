import { mutationOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { getMe, login, signup, updateMe } from "../api/member-api";
import { useAuthStore } from "../stores/auth-store";

const meKey = (sessionId: number) => ["members", "me", sessionId] as const;
const signupOptions = mutationOptions({ mutationKey: ["members", "signup"], mutationFn: signup });
const loginOptions = mutationOptions({ mutationKey: ["auth", "login"], mutationFn: login });

export function useMe() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const sessionId = useAuthStore((state) => state.sessionId);

  return useQuery({
    queryKey: meKey(sessionId),
    queryFn: ({ signal }) => getMe(signal),
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useSignupMutation() {
  const navigate = useNavigate();

  return useMutation({
    ...signupOptions,
    onSuccess: () => navigate({ to: "/login", search: { registered: true } }),
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    ...loginOptions,
    onSuccess: ({ result }) => {
      useAuthStore.getState().setAccessToken(result.accessToken);
      const { sessionId } = useAuthStore.getState();
      void queryClient.invalidateQueries({ queryKey: meKey(sessionId) });
      void navigate({ to: "/" });
    },
  });
}

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();
  const sessionId = useAuthStore((state) => state.sessionId);

  return useMutation({
    mutationFn: updateMe,
    onSuccess: async ({ result }) => {
      const queryKey = meKey(sessionId);
      await queryClient.cancelQueries({ queryKey });
      if (useAuthStore.getState().sessionId === sessionId) {
        queryClient.setQueryData(queryKey, result);
      }
    },
  });
}
