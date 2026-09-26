import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import {
  getNotificationsByUser,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  getNotifications,
} from "@/services/notification.service";

// ─── Unread count (runs on mount, refetches every 30s) ──────────────────────
export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: queryKeys.unreadNotificationCount(),
    queryFn: async () => {
      const result = await getUnreadCount();
      if (result.status && result.data) {
        return result.data.count;
      }
      return 0;
    },
    refetchInterval: 30_000,
  });
}

// ─── User notifications (only fetches when enabled) ─────────────────────────
export function useUserNotifications(open: boolean) {
  return useQuery({
    queryKey: queryKeys.notifications(),
    queryFn: async () => {
      const result = await getNotifications(1, 30);
      if (result.status && result.data) {
        return result.data;
      }
      return [];
    },
    enabled: open,
  });
}

// ─── Mark single notification as read ────────────────────────────────────────
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const result = await markAsRead(String(id));
      if (!result.status) {
        throw new Error(result.message || "Failed to mark as read");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadNotificationCount() });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications() });
    },
  });
}

// ─── Mark all notifications as read ──────────────────────────────────────────
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await markAllAsRead();
      if (!result.status) {
        throw new Error(result.message || "Failed to mark all as read");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadNotificationCount() });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications() });
    },
  });
}
