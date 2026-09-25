export type NotificationType =
  | "order"
  | "booking"
  | "payment"
  | "delivery"
  | "reminder"
  | "ai_ready"
  | "prescription_ready"
  | "promotion"
  | "system"
  | "message"
  | "referral";

export interface Notification {
  id: number;
  title: string;
  body: string;
  type: NotificationType;
  isRead: boolean;
  userId: number;
  referenceType?: string | null;
  referenceId?: string | null;
  createdAt: string;
  updatedAt: string;
  sendDateAndTime: string;
  occurrence: string;
  sentTo: string;
  sent: string;
  tapped: string;
  user?: {
    id: number;
    name: string | null;
    email: string | null;
    phone: string | null;
  };
}

export interface NotificationListResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface CreateNotificationPayload {
  title: string;
  body: string;
  type?: NotificationType;
  userId: number;
  referenceType?: string;
  referenceId?: string;
}

export interface SendNotificationPayload {
  title: string;
  body: string;
  type?: NotificationType;
  userIds: number[];
  referenceType?: string;
  referenceId?: string;
}

export interface BroadcastNotificationPayload {
  title: string;
  body: string;
  type?: NotificationType;
  role?: "user" | "doctor" | "clinic" | "admin";
  occurrence?: string;
  time?: string;
}
