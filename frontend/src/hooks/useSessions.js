import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sessionsApi } from "../api/sessions";
import { useQueryClient } from "@tanstack/react-query";

export function useCreateSession() {
  const queryClient = useQueryClient();
  const result = useMutation({
    mutationKey: ["create-session"],
    // mutationFn receives whatever we pass to mutate()
    mutationFn: (data) => sessionsApi.createSession(data),
    onSuccess() {
      toast.success("Session created successfully!");
      queryClient.invalidateQueries({ queryKey: ["active-sessions"] });
    },
    onError(error) {
      toast.error(
        error?.response?.data?.message || "Failed to create a session!"
      );
    },
  });

  return result;
}

export function useActiveSessions() {
  const result = useQuery({
    queryKey: ["active-sessions"],
    queryFn: sessionsApi.getActiveSessions,
  });

  return result;
}

export function useRecentSessions() {
  const result = useQuery({
    queryKey: ["recent-sessions"],
    queryFn: sessionsApi.getRecentSessions,
  });

  return result;
}

export function useGetSessionById(sessionId) {
  const result = useQuery({
    queryKey: ["get-session-by-id", sessionId],
    queryFn: () => sessionsApi.getSessionById(sessionId),
    enabled: Boolean(sessionId),
    refetchInterval: 5000,
    refetchIntervalInBackground: false, // stop when user tabs away
  });

  return result;
}

export function useJoinSession() {
  const queryClient = useQueryClient();
  const result = useMutation({
    mutationKey: ["join-session"],
    // mutationFn receives whatever we pass to mutate()
    mutationFn: (sessionId) => sessionsApi.joinSession(sessionId),
    onSuccess() {
      toast.success("Joined session successfully!");
      queryClient.invalidateQueries({ queryKey: ["active-sessions"] });
    },
    onError(error) {
      toast.error(error?.response?.data?.message || "Failed to join session!");
    },
  });

  return result;
}

export function useEndSession() {
  const queryClient = useQueryClient();
  const result = useMutation({
    mutationKey: ["end-session"],
    // mutationFn receives whatever we pass to mutate()
    mutationFn: (sessionId) => sessionsApi.endSession(sessionId),
    onSuccess() {
      toast.success("Session ended successfully!");
      queryClient.invalidateQueries({ queryKey: ["recent-sessions"] });
    },
    onError(error) {
      toast.error(error?.response?.data?.message || "Failed to end session!");
    },
  });

  return result;
}
