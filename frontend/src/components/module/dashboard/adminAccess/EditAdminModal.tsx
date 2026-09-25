"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { getAdmin, updateAdmin } from "@/services/admin.service"
import { toast } from "sonner"

type AdminRole = "admin" | "super_admin"
type AdminDesignation = "founder" | "co-founder" | "manager" | "developer" | "analyst" | "support"
type AdminStatus = "active" | "deactive"

const ROLE_OPTIONS: AdminRole[] = ["admin", "super_admin"]
const DESIGNATION_OPTIONS: AdminDesignation[] = ["founder", "co-founder", "manager", "developer", "analyst", "support"]
const STATUS_OPTIONS: AdminStatus[] = ["active", "deactive"]

function StyledSelect<T extends string>({
    value,
    onChange,
    options,
    label,
    error,
}: {
    value: T
    onChange: (val: T) => void
    options: readonly T[]
    label: string
    error?: string
}) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm sm:text-base font-semibold text-[#1A1A1A]">
                {label}*
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value as T)}
                    className={cn(
                        "w-full h-13 appearance-none rounded-md border border-[#E8E8E8] bg-white text-sm sm:text-base font-medium text-[#1A1A1A] outline-none focus:border-[#1A1A1A] shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all cursor-pointer px-4.5 pr-10",
                        error && "border-red-400"
                    )}
                >
                    {options.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#1A1A1A] pointer-events-none stroke-[2.5]" />
            </div>
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    )
}

function TextField({
    label,
    value,
    onChange,
    placeholder,
    error,
    type = "text",
}: {
    label: string
    value: string
    onChange: (val: string) => void
    placeholder?: string
    error?: string
    type?: string
}) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm sm:text-base font-semibold text-[#1A1A1A]">
                {label}
            </label>
            <Input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={cn(
                    "h-13 rounded-md border border-[#EEEEEE] bg-[#F7F7F8] text-sm sm:text-base font-normal text-[#1A1A1A] placeholder:text-[#A3A3A3] focus-visible:ring-0 focus-visible:border-[#1A1A1A] focus-visible:bg-white shadow-none px-4.5 transition-all",
                    error && "border-red-400"
                )}
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    )
}

interface EditAdminModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    adminId: number | null
    onUpdate: () => void
}

export default function EditAdminModal({
    open,
    onOpenChange,
    adminId,
    onUpdate,
}: EditAdminModalProps) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "admin" as AdminRole,
        designation: "founder" as AdminDesignation,
        status: "active" as AdminStatus,
    })
    const [errors, setErrors] = useState<Partial<Record<string, string>>>({})
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!open || !adminId) {
            setForm({ name: "", email: "", password: "", role: "admin", designation: "founder", status: "active" })
            setErrors({})
            return
        }

        async function fetchAdmin() {
            setLoading(true)
            const result = await getAdmin(String(adminId!))
            if (result.status && result.data) {
                const a = result.data
                setForm({
                    name: a.name || "",
                    email: a.email || "",
                    password: "",
                    role: a.role || "admin",
                    designation: a.designation || "founder",
                    status: a.status || "active",
                })
            }
            setLoading(false)
        }
        fetchAdmin()
    }, [open, adminId])

    const handleChange = <K extends keyof typeof form>(
        field: K,
        value: (typeof form)[K]
    ) => {
        setForm((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }))
        }
    }

    const validate = (): boolean => {
        const newErrors: Partial<Record<string, string>> = {}
        if (!form.name.trim()) newErrors.name = "Name is required."
        if (!form.email.trim()) newErrors.email = "Email is required."
        if (form.password && form.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters."
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validate() || !adminId) return

        setSubmitting(true)
        const payload: Record<string, string | undefined> = {
            name: form.name.trim(),
            email: form.email.trim(),
            role: form.role,
            designation: form.designation,
            status: form.status,
        }
        if (form.password) {
            payload.password = form.password
        }

        const result = await updateAdmin(String(adminId), payload)
        setSubmitting(false)

        if (result.status) {
            toast.success("Admin updated successfully")
            setErrors({})
            onOpenChange(false)
            onUpdate()
        } else {
            setErrors({ email: result.message || "Failed to update admin" })
        }
    }

    const handleCancel = () => {
        setErrors({})
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                className="max-w-[600px] w-[calc(100vw-2rem)] p-7 sm:p-9 rounded-[32px] bg-[#FAF8F5] border border-[#EEEEEE] shadow-[0_25px_60px_rgba(0,0,0,0.12)]"
            >
                {loading ? (
                    <div className="flex flex-col gap-6">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                                <div className="h-13 bg-gray-200 rounded-[16px] animate-pulse" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {/* Name */}
                        <TextField
                            label="Name"
                            value={form.name}
                            onChange={(val) => handleChange("name", val)}
                            placeholder="Enter admin name"
                            error={errors.name}
                        />

                        {/* Email */}
                        <TextField
                            label="Email"
                            value={form.email}
                            onChange={(val) => handleChange("email", val)}
                            placeholder="admin@example.com"
                            error={errors.email}
                        />

                        {/* Password */}
                        <TextField
                            label="Password (leave blank to keep current)"
                            value={form.password}
                            onChange={(val) => handleChange("password", val)}
                            placeholder="Min 6 characters"
                            type="password"
                            error={errors.password}
                        />

                        {/* Role + Designation */}
                        <div className="grid grid-cols-2 gap-4">
                            <StyledSelect
                                label="Role"
                                value={form.role}
                                onChange={(val) => handleChange("role", val)}
                                options={ROLE_OPTIONS}
                            />
                            <StyledSelect
                                label="Designation"
                                value={form.designation}
                                onChange={(val) => handleChange("designation", val)}
                                options={DESIGNATION_OPTIONS}
                            />
                        </div>

                        {/* Status */}
                        <StyledSelect
                            label="Status"
                            value={form.status}
                            onChange={(val) => handleChange("status", val)}
                            options={STATUS_OPTIONS}
                        />

                        {/* Footer Action Buttons */}
                        <div className="flex items-center gap-3.5 mt-2">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="h-12 px-7 rounded-[16px] bg-[#E3E3E3] border border-[#D0D0D0] text-sm sm:text-base font-semibold text-[#1A1A1A] hover:bg-[#D8D8D8] transition-colors cursor-pointer outline-none shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? "Updating..." : "Update Admin"}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={submitting}
                                className="h-12 px-8 rounded-[16px] bg-[#D9531E] text-sm sm:text-base font-semibold text-white hover:bg-[#C24614] transition-all cursor-pointer outline-none shadow-[0_4px_14px_rgba(217,83,30,0.28)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
