"use client"

import { useEffect, useState } from "react"
import {
    Shield,
    Briefcase,
    CheckCircle2,
    XCircle,
    Calendar,
} from "lucide-react"
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { Avatar } from "@/components/ui/avatar"
import { getAdmin } from "@/services/admin.service"
import type { Admin } from "@/types/admin.type"

interface AdminDetailModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    adminId: number | null
}

export default function AdminDetailModal({
    open,
    onOpenChange,
    adminId,
}: AdminDetailModalProps) {
    const [admin, setAdmin] = useState<Admin | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!open || !adminId) {
            setAdmin(null)
            setError(null)
            return
        }

        async function fetchAdmin() {
            setLoading(true)
            setError(null)
            const result = await getAdmin(String(adminId!))
            if (result.status && result.data) {
                setAdmin(result.data)
            } else {
                setError(result.message || "Admin not found")
            }
            setLoading(false)
        }
        fetchAdmin()
    }, [open, adminId])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={true}
                className="max-w-[520px] w-[calc(100vw-2rem)] p-0 rounded-[28px] sm:rounded-[32px] bg-white border border-[#EAE5DD] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] overflow-hidden font-sans"
            >
                {/* Header Banner */}
                <div className="relative bg-gradient-to-b from-[#FAFAFA] via-[#F1F5F9] to-[#E2E8F0] px-8 pt-8 pb-14 border-b border-[#CBD5E1]">
                    <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#475569] via-[#64748B] to-[#94A3B8]" />
                    <div className="flex flex-col items-center gap-4">
                        {loading ? (
                            <div className="w-22 h-22 rounded-full bg-[#E5E0D8] animate-pulse" />
                        ) : (
                            <Avatar
                                src={admin?.avatar || undefined}
                                alt={admin?.name || "Admin"}
                                fallback={(admin?.name || "A")[0]}
                                size="lg"
                                className="w-22 h-22 text-2xl font-bold border-4 border-white shadow-[0_10px_30px_rgba(71,85,105,0.18)] ring-1 ring-[#CBD5E1]"
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
                        ) : admin ? (
                            <>
                                <div className="flex flex-wrap items-center justify-center gap-2">
                                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A1A1A] font-display tracking-tight uppercase">
                                        {admin.name || "Unknown"}
                                    </h2>
                                    {admin.role === "super_admin" ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FDF2E9] text-[#C15C2B] border border-[#FAD7C0] shadow-2xs">
                                            <Shield className="w-3.5 h-3.5 text-[#C15C2B]" />
                                            Super Admin
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                                            <Shield className="w-3.5 h-3.5 text-[#475569]" />
                                            Admin
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-[#737373]">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FAFAFA] text-[#737373] border border-[#EFECE6]">
                                        ID: <span className="font-extrabold text-[#1A1A1A]">#{admin.id}</span>
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FAFAFA] text-[#737373] border border-[#EFECE6]">
                                        {admin.email}
                                    </span>
                                </div>
                            </>
                        ) : null}
                    </div>

                    {/* Details Grid */}
                    {!loading && !error && admin && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex items-center gap-3.5 p-4 bg-[#FAFAFA]/90 hover:bg-white hover:border-[#C1652F]/30 hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)] transition-all duration-200 rounded-[20px] border border-[#EFECE6] group">
                                <div className="flex items-center justify-center w-10 h-10 rounded-[14px] bg-white border border-[#EAE5DD] shadow-2xs shrink-0 text-[#C1652F] group-hover:bg-[#C1652F] group-hover:text-white group-hover:border-[#C1652F] transition-all duration-200">
                                    <Shield className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] font-bold text-[#8C877E] uppercase tracking-wider">
                                        Role
                                    </span>
                                    <span className="text-sm font-semibold text-[#1A1A1A] uppercase">
                                        {admin.role === "super_admin" ? "Super Admin" : "Admin"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3.5 p-4 bg-[#FAFAFA]/90 hover:bg-white hover:border-[#C1652F]/30 hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)] transition-all duration-200 rounded-[20px] border border-[#EFECE6] group">
                                <div className="flex items-center justify-center w-10 h-10 rounded-[14px] bg-white border border-[#EAE5DD] shadow-2xs shrink-0 text-[#C1652F] group-hover:bg-[#C1652F] group-hover:text-white group-hover:border-[#C1652F] transition-all duration-200">
                                    <Briefcase className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] font-bold text-[#8C877E] uppercase tracking-wider">
                                        Designation
                                    </span>
                                    <span className="text-sm font-semibold text-[#1A1A1A] capitalize">
                                        {admin.designation || "N/A"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3.5 p-4 bg-[#FAFAFA]/90 hover:bg-white hover:border-[#C1652F]/30 hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)] transition-all duration-200 rounded-[20px] border border-[#EFECE6] group">
                                <div className="flex items-center justify-center w-10 h-10 rounded-[14px] bg-white border border-[#EAE5DD] shadow-2xs shrink-0">
                                    {admin.status === "active" ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-amber-600" />
                                    )}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] font-bold text-[#8C877E] uppercase tracking-wider">
                                        Status
                                    </span>
                                    <span className="text-sm font-semibold text-[#1A1A1A] capitalize">
                                        {admin.status === "active" ? "Active" : "Inactive"}
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
                                        {admin.createdAt
                                            ? new Date(admin.createdAt).toLocaleDateString("en-US", {
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
