"use client"

import { useEffect, useState } from "react"
import {
    Bell,
    Calendar,
    Send,
    MousePointerClick,
    User,
    Tag,
    Repeat,
    CheckCircle2,
    XCircle,
} from "lucide-react"
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { getNotificationById } from "@/services/notification.service"
import type { Notification, NotificationType } from "@/types/notification.type"

const TYPE_BADGE: Record<NotificationType, { label: string; className: string }> = {
    order: { label: "Order", className: "bg-blue-50 text-blue-700 border-blue-200" },
    booking: { label: "Booking", className: "bg-purple-50 text-purple-700 border-purple-200" },
    payment: { label: "Payment", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    delivery: { label: "Delivery", className: "bg-orange-50 text-orange-700 border-orange-200" },
    reminder: { label: "Reminder", className: "bg-amber-50 text-amber-700 border-amber-200" },
    ai_ready: { label: "AI Ready", className: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    prescription_ready: { label: "Rx Ready", className: "bg-pink-50 text-pink-700 border-pink-200" },
    promotion: { label: "Promo", className: "bg-rose-50 text-rose-700 border-rose-200" },
    system: { label: "System", className: "bg-stone-100 text-stone-700 border-stone-200" },
    message: { label: "Message", className: "bg-cyan-50 text-cyan-700 border-cyan-200" },
    referral: { label: "Referral", className: "bg-teal-50 text-teal-700 border-teal-200" },
}

interface NotificationDetailModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    notificationId: number | null
}

export default function NotificationDetailModal({
    open,
    onOpenChange,
    notificationId,
}: NotificationDetailModalProps) {
    const [notification, setNotification] = useState<Notification | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!open || !notificationId) {
            setNotification(null)
            setError(null)
            return
        }

        async function fetchNotification() {
            setLoading(true)
            setError(null)
            const result = await getNotificationById(String(notificationId!))
            if (result.status && result.data) {
                setNotification(result.data)
            } else {
                setError(result.message || "Notification not found")
            }
            setLoading(false)
        }
        fetchNotification()
    }, [open, notificationId])

    const formatDate = (dateStr: string) => {
        try {
            const d = new Date(dateStr)
            return d.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            })
        } catch {
            return dateStr || "N/A"
        }
    }

    const typeBadge = notification ? TYPE_BADGE[notification.type] : null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={true}
                className="max-w-[560px] w-[calc(100vw-2rem)] p-0 rounded-[28px] sm:rounded-[32px] bg-white border border-[#EAE5DD] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] overflow-hidden font-sans"
            >
                {/* Header Banner */}
                <div className="relative bg-gradient-to-b from-[#FFFBF7] via-[#FFF1E6] to-[#FDE4D0] px-8 pt-8 pb-14 border-b border-[#FAD0B0]">
                    <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#D9531E] via-[#F97316] to-[#FB923C]" />
                    <div className="flex flex-col items-center gap-4">
                        {loading ? (
                            <div className="w-22 h-22 rounded-full bg-[#E5E0D8] animate-pulse" />
                        ) : (
                            <div className="w-22 h-22 rounded-full bg-white border-4 border-white shadow-[0_10px_30px_rgba(217,83,30,0.18)] ring-1 ring-[#FAD0B0] flex items-center justify-center">
                                <Bell className="w-9 h-9 text-[#D9531E]" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Content - overlapping banner */}
                <div className="relative px-6 sm:px-8 -mt-10 pb-7">
                    {/* Title + Type */}
                    <div className="flex flex-col items-center gap-2 mb-6 text-center">
                        {loading ? (
                            <>
                                <div className="h-6 w-48 bg-[#EAE5DD] rounded-lg animate-pulse" />
                                <div className="h-4 w-16 bg-[#EAE5DD] rounded-full animate-pulse mt-1" />
                            </>
                        ) : error ? (
                            <p className="text-sm font-medium text-[#737373] bg-red-50 text-red-600 px-4 py-2 rounded-xl border border-red-200">{error}</p>
                        ) : notification ? (
                            <>
                                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1A1A] font-display tracking-tight text-center">
                                    {notification.title || "Untitled"}
                                </h2>
                                {typeBadge && (
                                    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold border shadow-2xs ${typeBadge.className}`}>
                                        {typeBadge.label}
                                    </span>
                                )}
                            </>
                        ) : null}
                    </div>

                    {/* Details Grid */}
                    {!loading && !error && notification && (
                        <div className="flex flex-col gap-3">
                            {/* Body */}
                            <div className="p-4.5 bg-[#FAFAFA]/90 hover:bg-white hover:border-[#FAD0B0] transition-all duration-200 rounded-[20px] border border-[#EFECE6] shadow-2xs">
                                <span className="text-[10px] font-bold text-[#8C877E] uppercase tracking-wider block mb-1">
                                    Description
                                </span>
                                <p className="text-sm font-semibold text-[#1A1A1A] leading-relaxed">
                                    {notification.body || "N/A"}
                                </p>
                            </div>

                            {/* Grid row 1 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex items-center gap-3.5 p-4 bg-[#FAFAFA]/90 hover:bg-white hover:border-[#D9531E]/30 hover:shadow-[0_8px_20px_rgba(217,83,30,0.05)] transition-all duration-200 rounded-[20px] border border-[#EFECE6] group">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-[14px] bg-white border border-[#EAE5DD] shadow-2xs shrink-0 text-[#D9531E] group-hover:bg-[#D9531E] group-hover:text-white group-hover:border-[#D9531E] transition-all duration-200">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[10px] font-bold text-[#8C877E] uppercase tracking-wider">
                                            Created At
                                        </span>
                                        <span className="text-sm font-semibold text-[#1A1A1A]">
                                            {formatDate(notification.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3.5 p-4 bg-[#FAFAFA]/90 hover:bg-white hover:border-[#D9531E]/30 hover:shadow-[0_8px_20px_rgba(217,83,30,0.05)] transition-all duration-200 rounded-[20px] border border-[#EFECE6] group">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-[14px] bg-white border border-[#EAE5DD] shadow-2xs shrink-0 text-[#D9531E] group-hover:bg-[#D9531E] group-hover:text-white group-hover:border-[#D9531E] transition-all duration-200">
                                        <Send className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[10px] font-bold text-[#8C877E] uppercase tracking-wider">
                                            Send Date & Time
                                        </span>
                                        <span className="text-sm font-semibold text-[#1A1A1A]">
                                            {notification.sendDateAndTime || "N/A"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3.5 p-4 bg-[#FAFAFA]/90 hover:bg-white hover:border-[#D9531E]/30 hover:shadow-[0_8px_20px_rgba(217,83,30,0.05)] transition-all duration-200 rounded-[20px] border border-[#EFECE6] group">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-[14px] bg-white border border-[#EAE5DD] shadow-2xs shrink-0 text-[#D9531E] group-hover:bg-[#D9531E] group-hover:text-white group-hover:border-[#D9531E] transition-all duration-200">
                                        <Send className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[10px] font-bold text-[#8C877E] uppercase tracking-wider">
                                            Sent Count
                                        </span>
                                        <span className="text-sm font-semibold text-[#1A1A1A]">
                                            {notification.sent || "N/A"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3.5 p-4 bg-[#FAFAFA]/90 hover:bg-white hover:border-[#D9531E]/30 hover:shadow-[0_8px_20px_rgba(217,83,30,0.05)] transition-all duration-200 rounded-[20px] border border-[#EFECE6] group">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-[14px] bg-white border border-[#EAE5DD] shadow-2xs shrink-0 text-[#D9531E] group-hover:bg-[#D9531E] group-hover:text-white group-hover:border-[#D9531E] transition-all duration-200">
                                        <MousePointerClick className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[10px] font-bold text-[#8C877E] uppercase tracking-wider">
                                            Tapped Count
                                        </span>
                                        <span className="text-sm font-semibold text-[#1A1A1A]">
                                            {notification.tapped || "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Grid row 2 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex items-center gap-3.5 p-4 bg-[#FAFAFA]/90 hover:bg-white hover:border-[#D9531E]/30 hover:shadow-[0_8px_20px_rgba(217,83,30,0.05)] transition-all duration-200 rounded-[20px] border border-[#EFECE6] group">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-[14px] bg-white border border-[#EAE5DD] shadow-2xs shrink-0 text-[#D9531E] group-hover:bg-[#D9531E] group-hover:text-white group-hover:border-[#D9531E] transition-all duration-200">
                                        <Tag className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[10px] font-bold text-[#8C877E] uppercase tracking-wider">
                                            Sent To
                                        </span>
                                        <span className="text-sm font-semibold text-[#1A1A1A]">
                                            {notification.sentTo || "All Users"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3.5 p-4 bg-[#FAFAFA]/90 hover:bg-white hover:border-[#D9531E]/30 hover:shadow-[0_8px_20px_rgba(217,83,30,0.05)] transition-all duration-200 rounded-[20px] border border-[#EFECE6] group">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-[14px] bg-white border border-[#EAE5DD] shadow-2xs shrink-0 text-[#D9531E] group-hover:bg-[#D9531E] group-hover:text-white group-hover:border-[#D9531E] transition-all duration-200">
                                        <Repeat className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[10px] font-bold text-[#8C877E] uppercase tracking-wider">
                                            Occurrence
                                        </span>
                                        <span className="text-sm font-semibold text-[#1A1A1A]">
                                            {notification.occurrence || "Once"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Read Status */}
                            <div className="flex items-center gap-3.5 p-4 bg-[#FAFAFA]/90 hover:bg-white hover:border-[#D9531E]/30 hover:shadow-[0_8px_20px_rgba(217,83,30,0.05)] transition-all duration-200 rounded-[20px] border border-[#EFECE6] group">
                                <div className="flex items-center justify-center w-10 h-10 rounded-[14px] bg-white border border-[#EAE5DD] shadow-2xs shrink-0">
                                    {notification.isRead ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-amber-600" />
                                    )}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] font-bold text-[#8C877E] uppercase tracking-wider">
                                        Status
                                    </span>
                                    <span className="text-sm font-semibold text-[#1A1A1A]">
                                        {notification.isRead ? "Read" : "Unread"}
                                    </span>
                                </div>
                            </div>

                            {/* Recipient */}
                            {notification.user && (
                                <div className="flex items-center gap-3.5 p-4 bg-[#FAFAFA]/90 hover:bg-white hover:border-[#D9531E]/30 hover:shadow-[0_8px_20px_rgba(217,83,30,0.05)] transition-all duration-200 rounded-[20px] border border-[#EFECE6] group">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-[14px] bg-white border border-[#EAE5DD] shadow-2xs shrink-0 text-[#D9531E] group-hover:bg-[#D9531E] group-hover:text-white group-hover:border-[#D9531E] transition-all duration-200">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[10px] font-bold text-[#8C877E] uppercase tracking-wider">
                                            Recipient User
                                        </span>
                                        <span className="text-sm font-semibold text-[#1A1A1A] truncate">
                                            {notification.user.name || "Unknown"} ({notification.user.email || "No email"})
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Loading skeleton for grid */}
                    {loading && (
                        <div className="flex flex-col gap-3">
                            <div className="h-16 bg-[#EAE5DD] rounded-[20px] animate-pulse" />
                            <div className="grid grid-cols-2 gap-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3.5 p-4 bg-[#FAFAFA] rounded-[20px] border border-[#EFECE6]"
                                    >
                                        <div className="w-10 h-10 rounded-[14px] bg-[#EAE5DD] animate-pulse shrink-0" />
                                        <div className="flex flex-col gap-1.5 flex-1">
                                            <div className="h-2.5 w-14 bg-[#EAE5DD] rounded animate-pulse" />
                                            <div className="h-3.5 w-24 bg-[#EAE5DD] rounded animate-pulse" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Close Button */}
                    <div className="flex justify-center mt-7">
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="h-11 px-9 rounded-[16px] bg-[#1A1A1A] hover:bg-[#333333] text-white text-sm font-bold shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)] active:scale-[0.98] transition-all cursor-pointer outline-none"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
