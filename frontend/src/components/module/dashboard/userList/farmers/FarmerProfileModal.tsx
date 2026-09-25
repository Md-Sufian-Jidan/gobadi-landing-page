"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Mail, Phone, Calendar, UserCheck } from "lucide-react"
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { Avatar } from "@/components/ui/avatar"
import { getFarmerById } from "@/services/dashboard.service"
import type { Farmer } from "@/types/user.type"

interface FarmerProfileModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    farmerId: number | null
}

export default function FarmerProfileModal({
    open,
    onOpenChange,
    farmerId,
}: FarmerProfileModalProps) {
    const [farmer, setFarmer] = useState<Farmer | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!open || !farmerId) {
            setFarmer(null)
            setError(null)
            return
        }

        async function fetchFarmer() {
            setLoading(true)
            setError(null)
            const result = await getFarmerById(farmerId!)
            if (result.status && result.data) {
                setFarmer(result.data)
            } else {
                setError(result.message || "Farmer not found")
            }
            setLoading(false)
        }
        fetchFarmer()
    }, [open, farmerId])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={true}
                className="max-w-[520px] w-[calc(100vw-2rem)] p-0 rounded-[28px] sm:rounded-[32px] bg-white border border-[#EAE5DD] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] overflow-hidden font-sans"
            >
                {/* Header Banner */}
                <div className="relative bg-gradient-to-b from-[#FFFBF5] via-[#FAF3E8] to-[#F2E8D8] px-8 pt-8 pb-14 border-b border-[#EAE5DD]/80">
                    <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#C1652F] via-[#D97736] to-[#E5A880]" />
                    <div className="flex flex-col items-center gap-4">
                        {loading ? (
                            <div className="w-22 h-22 rounded-full bg-[#E5E0D8] animate-pulse" />
                        ) : (
                            <Avatar
                                src={farmer?.avatar || undefined}
                                alt={farmer?.name || "Farmer"}
                                fallback={(farmer?.name || "F")[0]}
                                size="lg"
                                className="w-22 h-22 text-2xl font-bold border-4 border-white shadow-[0_10px_30px_rgba(193,101,47,0.18)] ring-1 ring-[#EAE5DD]"
                            />
                        )}
                    </div>
                </div>

                {/* Profile Info - overlapping banner */}
                <div className="relative px-6 sm:px-8 -mt-10 pb-7">
                    <div className="flex flex-col items-center gap-2 mb-6 text-center">
                        {loading ? (
                            <>
                                <div className="h-6 w-40 bg-[#EAE5DD] rounded-lg animate-pulse" />
                                <div className="h-4 w-28 bg-[#EAE5DD] rounded-full animate-pulse mt-1" />
                            </>
                        ) : error ? (
                            <p className="text-sm font-medium text-[#737373] bg-red-50 text-red-600 px-4 py-2 rounded-xl border border-red-200">{error}</p>
                        ) : farmer ? (
                            <>
                                <div className="flex flex-wrap items-center justify-center gap-2">
                                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1A1A] font-display tracking-tight">
                                        {farmer.name || "Unknown"}
                                    </h2>
                                    {farmer.verified ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] shadow-2xs">
                                            <CheckCircle2 className="w-3 h-3 text-[#15803D]" />
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">
                                            <UserCheck className="w-3 h-3 text-[#64748B]" />
                                            Unverified
                                        </span>
                                    )}
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FAFAFA] text-[#737373] border border-[#EFECE6]">
                                    Farmer ID: <span className="font-extrabold text-[#1A1A1A]">#{farmer.id}</span>
                                </span>
                            </>
                        ) : null}
                    </div>

                    {/* Details Grid */}
                    {!loading && !error && farmer && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex items-center gap-3.5 p-4 bg-[#FAFAFA]/90 hover:bg-white hover:border-[#C1652F]/30 hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)] transition-all duration-200 rounded-[20px] border border-[#EFECE6] group">
                                <div className="flex items-center justify-center w-10 h-10 rounded-[14px] bg-white border border-[#EAE5DD] shadow-2xs shrink-0 text-[#C1652F] group-hover:bg-[#C1652F] group-hover:text-white group-hover:border-[#C1652F] transition-all duration-200">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] font-bold text-[#8C877E] uppercase tracking-wider">
                                        Email
                                    </span>
                                    <span className="text-sm font-semibold text-[#1A1A1A] truncate" title={farmer.email || "N/A"}>
                                        {farmer.email || "N/A"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3.5 p-4 bg-[#FAFAFA]/90 hover:bg-white hover:border-[#C1652F]/30 hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)] transition-all duration-200 rounded-[20px] border border-[#EFECE6] group">
                                <div className="flex items-center justify-center w-10 h-10 rounded-[14px] bg-white border border-[#EAE5DD] shadow-2xs shrink-0 text-[#C1652F] group-hover:bg-[#C1652F] group-hover:text-white group-hover:border-[#C1652F] transition-all duration-200">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] font-bold text-[#8C877E] uppercase tracking-wider">
                                        Phone
                                    </span>
                                    <span className="text-sm font-semibold text-[#1A1A1A] truncate">
                                        {farmer.phone || "N/A"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3.5 p-4 bg-[#FAFAFA]/90 hover:bg-white hover:border-[#C1652F]/30 hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)] transition-all duration-200 rounded-[20px] border border-[#EFECE6] group">
                                <div className="flex items-center justify-center w-10 h-10 rounded-[14px] bg-white border border-[#EAE5DD] shadow-2xs shrink-0 text-[#C1652F] group-hover:bg-[#C1652F] group-hover:text-white group-hover:border-[#C1652F] transition-all duration-200">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] font-bold text-[#8C877E] uppercase tracking-wider">
                                        Created At
                                    </span>
                                    <span className="text-sm font-semibold text-[#1A1A1A]">
                                        {farmer.createdAt
                                            ? new Date(farmer.createdAt).toLocaleDateString("en-US", {
                                                  year: "numeric",
                                                  month: "short",
                                                  day: "numeric",
                                              })
                                            : "N/A"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3.5 p-4 bg-[#FAFAFA]/90 hover:bg-white hover:border-[#C1652F]/30 hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)] transition-all duration-200 rounded-[20px] border border-[#EFECE6] group">
                                <div className="flex items-center justify-center w-10 h-10 rounded-[14px] bg-white border border-[#EAE5DD] shadow-2xs shrink-0 text-[#C1652F] group-hover:bg-[#C1652F] group-hover:text-white group-hover:border-[#C1652F] transition-all duration-200">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] font-bold text-[#8C877E] uppercase tracking-wider">
                                        Updated At
                                    </span>
                                    <span className="text-sm font-semibold text-[#1A1A1A]">
                                        {farmer.updatedAt
                                            ? new Date(farmer.updatedAt).toLocaleDateString("en-US", {
                                                  year: "numeric",
                                                  month: "short",
                                                  day: "numeric",
                                              })
                                            : "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Loading skeleton for grid */}
                    {loading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
