"use client"

import { useState } from "react"
import { AlertTriangle, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { deleteDoctorById } from "@/services/dashboard.service"

interface DeleteDoctorDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    doctorId: number | null
    doctorName: string
    onDelete: () => void
}

export default function DeleteDoctorDialog({
    open,
    onOpenChange,
    doctorId,
    doctorName,
    onDelete,
}: DeleteDoctorDialogProps) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (!doctorId) return

        setLoading(true)
        const result = await deleteDoctorById(doctorId)
        setLoading(false)

        if (result.status) {
            toast.success("Doctor deleted successfully")
            onOpenChange(false)
            onDelete()
        } else {
            toast.error(result.message || "Failed to delete doctor")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                className="max-w-[440px] w-[calc(100vw-2rem)] p-0 rounded-[28px] sm:rounded-[32px] bg-white border border-[#EAE5DD] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] overflow-hidden font-sans"
            >
                <div className="relative bg-gradient-to-b from-[#FEF2F2] via-[#FFF5F5] to-white px-8 pt-8 pb-5 flex flex-col items-center border-b border-[#FEE2E2]/60">
                    <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-red-500 via-rose-500 to-amber-500" />
                    {/* Warning Icon */}
                    <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-red-200/80 shadow-[0_10px_25px_rgba(239,68,68,0.15)] mb-4">
                        <AlertTriangle className="w-8 h-8 text-[#DC2626] stroke-[2.25]" />
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-extrabold text-[#1A1A1A] font-display tracking-tight text-center">
                        Delete Doctor
                    </h2>
                </div>

                <div className="flex flex-col items-center px-8 pt-5 pb-8">
                    {/* Description */}
                    <p className="text-sm text-[#525252] text-center leading-relaxed mb-7 max-w-[340px]">
                        Are you sure you want to delete{" "}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-red-50 text-red-700 font-bold border border-red-200/70 text-xs sm:text-sm">
                            {doctorName}
                        </span>
                        ?
                        <br />
                        <span className="block text-xs text-[#8C877E] mt-2 font-medium">
                            This action is permanent and cannot be undone.
                        </span>
                    </p>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 w-full">
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                            className="flex-1 h-12 px-6 rounded-[16px] bg-[#F7F4EE] border border-[#EAE5DD] text-sm font-semibold text-[#525252] hover:bg-[#EFECE6] hover:text-[#1A1A1A] transition-all cursor-pointer outline-none shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={loading}
                            className="flex-1 h-12 px-6 rounded-[16px] bg-gradient-to-r from-[#DC2626] to-[#EF4444] hover:from-[#B91C1C] hover:to-[#DC2626] text-sm font-semibold text-white shadow-[0_4px_16px_rgba(220,38,38,0.30)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.40)] active:scale-[0.98] transition-all cursor-pointer outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Trash2 className="w-4 h-4" />
                            )}
                            Delete
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
