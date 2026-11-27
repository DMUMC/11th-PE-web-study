import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe } from "../api/members/update-me";
import { useAuthStore } from "../stores/auth-store";
import { meKey } from "./use-me-query";

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();
  const sessionId = useAuthStore((state) => state.sessionId);
  const queryKey = meKey(sessionId);
  return useMutation({
    mutationFn: updateMe,
    onSuccess: async (member) => {
      await queryClient.cancelQueries({ queryKey });
      if (useAuthStore.getState().sessionId === sessionId) queryClient.setQueryData(queryKey, member);
    },
  });
}
