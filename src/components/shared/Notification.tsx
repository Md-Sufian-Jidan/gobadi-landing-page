"use client"

import * as React from "react"
import {
  CheckCheck,
  Loader2,
  Inbox,
} from "lucide-react"
import notificationbell from "@/assets/notificationbell.svg"
import notification1 from "@/assets/notification-1.svg"
import notification2 from "@/assets/notification-2.svg"
import notification3 from "@/assets/notification-3.svg"
import notification4 from "@/assets/notification-4.svg"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  useUserNotifications,
  useUnreadNotificationCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "@/hooks/useNotifications"
import type { Notification } from "@/types/notification.type"
import Image, { StaticImageData } from "next/image"

// ─── Avatar color palettes for unique, vibrant avatars ────────────────────────
const AVATAR_GRADIENTS = [
  "from-[#FF8008] to-[#FFC837]", // Warm orange-gold
  "from-[#4776E6] to-[#8E54E9]", // Indigo purple
  "from-[#00B4DB] to-[#0083B0]", // Ocean cyan
  "from-[#F857A6] to-[#FF5858]", // Coral pink
  "from-[#11998E] to-[#38EF7D]", // Emerald green
  "from-[#654EA3] to-[#EAAFC8]", // Velvet plum
  "from-[#EC008C] to-[#FC6767]", // Neon sunset
  "from-[#3A1C71] via-[#D76D77] to-[#FFAF7B]", // Dusk
]

// ─── Type configuration for corner badge icons ────────────────────────────────
interface TypeBadgeConfig {
  icon: StaticImageData
  badgeBg: string
}

const DEFAULT_CONFIG: TypeBadgeConfig = {
  icon: notification1,
  badgeBg: "bg-[#8B5CF6]",
}

const TYPE_CONFIG: Record<string, TypeBadgeConfig> = {
  message: {
    icon: notification1,
    badgeBg: "bg-[#8B5CF6]", // Purple (Chat/Comment)
  },
  ai_ready: {
    icon: notification2,
    badgeBg: "bg-[#A16207]", // Gold/Olive (3D/AI Object)
  },
  referral: {
    icon: notification3,
    badgeBg: "bg-[#22C55E]", // Green (Plus/Invite)
  },
  booking: {
    icon: notification4,
    badgeBg: "bg-[#EF4444]", // Coral/Heart
  },
  promotion: {
    icon: notification1,
    badgeBg: "bg-[#EF4444]", // Coral/Heart
  },
  order: {
    icon: notification2,
    badgeBg: "bg-[#3B82F6]", // Blue (Package)
  },
  payment: {
    icon: notification3,
    badgeBg: "bg-[#10B981]", // Emerald (Check/Payment)
  },
  delivery: {
    icon: notification4,
    badgeBg: "bg-[#F97316]", // Orange (Delivery)
  },
  reminder: {
    icon: notification1,
    badgeBg: "bg-[#06B6D4]", // Cyan
  },
  prescription_ready: {
    icon: notification2,
    badgeBg: "bg-[#EC4899]", // Pink
  },
  system: {
    icon: notification3,
    badgeBg: "bg-[#6B7280]", // Gray
  },
}

// ─── Notification Avatar with bottom-right type badge ─────────────────────────
function NotificationAvatar({
  notification,
  index,
}: {
  notification: Notification
  index: number
}) {
  const config = TYPE_CONFIG[notification.type] || DEFAULT_CONFIG

  // Select deterministic gradient based on notification id
  const gradient = AVATAR_GRADIENTS[(notification.id + index) % AVATAR_GRADIENTS.length]

  // Get initial letters for avatar
  const rawName =
    notification.user?.name ||
    notification.title ||
    "Notification"
  const initials = rawName
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("") || "N"

  return (
    <div className="relative shrink-0">
      {/* Main Circular Avatar */}
      <div
        className={`w-11 h-11 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-xs tracking-wider shadow-sm ring-1 ring-black/5 select-none`}
      >
        <span>{initials}</span>
      </div>

      {/* Bottom-Right Small Type Badge */}
      <div
        className={`absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full ${config.badgeBg} ring-2 ring-white flex items-center justify-center shadow-xs overflow-hidden`}
        title={notification.type}
      >
        <Image
          src={config.icon}
          alt="Badge icon"
          width={10}
          height={10}
          className="w-2.5 h-2.5 object-contain"
        />
      </div>
    </div>
  )
}

function formatTimeAgo(dateStr: string): string {
  if (!dateStr) return "Just now"
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  if (isNaN(diffMs)) return "1h ago"

  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffMin < 1) return "Just now"
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`
  if (diffDay < 7) return `${diffDay}d ago`
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`
}

// ─── Format Notification Content Body ─────────────────────────────────────────
function parseNotificationBody(notification: Notification) {
  const body = notification.body || ""

  // Split on first newline or double space if available
  const lines = body.split(/\n+/).map((s) => s.trim()).filter(Boolean)

  if (lines.length > 1) {
    return {
      mainAction: lines[0],
      secondaryText: lines.slice(1).join(" "),
    }
  }

  // If there's a referenceType / referenceId, we can show it as secondary context
  if (notification.referenceType && notification.referenceId) {
    return {
      mainAction: body,
      secondaryText: `Ref: ${notification.referenceType} #${notification.referenceId}`,
    }
  }

  return {
    mainAction: body,
    secondaryText: null,
  }
}

// ─── Main Notification Component ──────────────────────────────────────────────
export default function Notification() {
  const [filter, setFilter] = React.useState<"all" | "unread">("all")
  const [open, setOpen] = React.useState(false)

  const { data: unreadCount = 0 } = useUnreadNotificationCount()
  const { data: notifications = [], isLoading: loading } = useUserNotifications(open)
  const markAsReadMutation = useMarkNotificationAsRead()
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const filteredNotifications = React.useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((n: Notification) => !n.isRead)
    }
    return notifications
  }, [filter, notifications]);

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id)
  }

  const handleMarkAllRead = () => {
    markAllAsReadMutation.mutate()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id="notification-bell-btn"
        className="relative p-2 sm:p-2.5 rounded-xl sm:rounded-2xl text-[#1A1A1A] transition-colors cursor-pointer hover:bg-[#F7F4EE] outline-none"
        title="Notifications"
        aria-label="Open notifications"
      >
        <Image
          src={notificationbell}
          alt="Notifications"
          width={20}
          height={20}
          className="w-5 h-5 object-contain"
        />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-0.5 bg-[#D9531E] rounded-full ring-2 ring-white">
            <span className="text-[10px] font-bold text-white leading-none">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-[360px] sm:w-[390px] p-0 rounded-[20px] bg-white border border-[#EBEBEB] shadow-[0_12px_40px_rgba(0,0,0,0.1)] overflow-hidden z-50 font-sans"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#F2F2F2]">
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-bold text-[#111827] tracking-tight">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                title="Mark all as read"
                className="text-[11px] font-medium text-[#71717A] hover:text-[#D9531E] transition-colors flex items-center gap-0.5 ml-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-[#F4F4F5] p-0.5 rounded-full">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${filter === "all"
                ? "bg-white text-[#111827] shadow-xs"
                : "text-[#71717A] hover:text-[#111827]"
                }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${filter === "unread"
                ? "bg-white text-[#111827] shadow-xs"
                : "text-[#71717A] hover:text-[#111827]"
                }`}
            >
              Unread
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-[460px] overflow-y-auto divide-y divide-[#F3F4F6]">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-6 h-6 text-[#9CA3AF] animate-spin mb-2" />
              <p className="text-xs text-[#9CA3AF]">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="py-12 px-6 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-[#F4F4F5] flex items-center justify-center mb-2.5">
                <Inbox className="w-5 h-5 text-[#9CA3AF]" />
              </div>
              <p className="text-xs font-medium text-[#374151]">
                No {filter === "unread" ? "unread " : ""}notifications
              </p>
              <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                You&apos;re all caught up!
              </p>
            </div>
          ) : (
            filteredNotifications.map((item: Notification, index: number) => {
              const { mainAction, secondaryText } = parseNotificationBody(item)
              const titleText = item.user?.name || item.title || "Notification"

              return (
                <div
                  key={item.id}
                  onClick={() => !item.isRead && handleMarkAsRead(item.id)}
                  className={`group relative flex items-start gap-3 px-4 py-3.5 transition-colors cursor-pointer ${!item.isRead ? "bg-white hover:bg-[#FAFAFA]" : "bg-white hover:bg-[#FAFAFA]"
                    }`}
                >
                  {/* Left Avatar with Type Badge */}
                  <NotificationAvatar notification={item} index={index} />

                  {/* Middle Content */}
                  <div className="flex-1 min-w-0 pr-4">
                    {/* Row 1: Name / Title + Timestamp */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[13px] font-bold text-[#111827] leading-tight truncate">
                        {titleText}
                      </span>
                      <span className="text-[11px] font-normal text-[#9CA3AF]">
                        {formatTimeAgo(item.createdAt || item.sendDateAndTime)}
                      </span>
                    </div>

                    {/* Row 2: Subtitle / Event Description */}
                    {mainAction && (
                      <div className="text-[12.5px] text-[#4B5563] font-normal leading-snug mt-0.5">
                        {mainAction}
                      </div>
                    )}

                    {/* Row 3: Details / Prompt / Subtext snippet */}
                    {secondaryText && (
                      <div className="text-[11.5px] text-[#9CA3AF] font-normal leading-relaxed mt-0.5 line-clamp-2">
                        {secondaryText}
                      </div>
                    )}
                  </div>

                  {/* Right: Unread Green Indicator Dot */}
                  {!item.isRead && (
                    <span
                      className="absolute right-4 top-4.5 w-2 h-2 rounded-full bg-[#22C55E] shrink-0 shadow-[0_0_6px_rgba(34,197,94,0.4)]"
                      title="Unread"
                    />
                  )}
                </div>
              )
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
