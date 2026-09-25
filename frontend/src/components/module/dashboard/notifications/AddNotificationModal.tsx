"use client"

import { ChevronDown, Clock, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { createNotification } from "@/services/notification.service"
import type { NotificationType } from "@/types/notification.type"
import { useState } from "react"

const OCCURRENCE_OPTIONS = [
  { value: "Once", label: "Once" },
  { value: "Daily", label: "Daily" },
  { value: "Weekly", label: "Weekly" },
  { value: "Monthly", label: "Monthly" },
]

const TIME_OPTIONS = [
  { value: "Immediately", label: "Immediately" },
  { value: "Scheduled", label: "Scheduled" },
]

const ROLE_OPTIONS = [
  { value: "", label: "All Farmers" },
  { value: "user", label: "Farmers" },
  { value: "doctor", label: "Doctors" },
  { value: "clinic", label: "Clinics" },
]

const INITIAL_FORM = {
  title: "",
  description: "",
  type: "system" as NotificationType,
  role: "",
  occurrence: "Once",
  time: "Immediately",
}

export interface AddNotificationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: () => void
}

export default function AddNotificationModal({
  open,
  onOpenChange,
  onAdd,
}: AddNotificationModalProps) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof typeof INITIAL_FORM, string>>>({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (field: keyof typeof INITIAL_FORM, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validate = () => {
    const newErrors: Partial<Record<keyof typeof INITIAL_FORM, string>> = {}
    if (!form.title.trim()) newErrors.title = "Notification title is required."
    if (!form.description.trim()) newErrors.description = "Message description is required."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setSubmitting(true)
    const result = await createNotification({
      title: form.title.trim(),
      body: form.description.trim(),
      type: form.type,
      occurrence: form.occurrence,
      time: form.time,
      userId: 2
    });

    setSubmitting(false)

    if (result.status) {
      setForm(INITIAL_FORM)
      setErrors({})
      onOpenChange(false)
      onAdd()
    }
  }

  const handleCancel = () => {
    setForm(INITIAL_FORM)
    setErrors({})
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[580px] w-[calc(100vw-2rem)] p-7 sm:p-9 rounded-[32px] sm:rounded-[36px] bg-white border border-[#EAE5DD] shadow-[0_25px_60px_rgba(0,0,0,0.12)]"
      >
        <div className="flex flex-col gap-6">
          {/* Notification Title */}
          <div className="flex flex-col gap-2.5">
            <label className="text-sm sm:text-base font-bold text-[#1A1A1A]">
              Notification Title
            </label>
            <Input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter notification title..."
              className={cn(
                "h-13 sm:h-14 rounded-[16px] border border-[#EEEEEE] bg-[#FBFBFC] text-sm sm:text-base font-normal text-[#1A1A1A] placeholder:text-[#A3A3A3] focus-visible:ring-0 focus-visible:border-[#1A1A1A] focus-visible:bg-white shadow-none px-4.5 transition-all",
                errors.title && "border-red-400"
              )}
            />
            {errors.title && (
              <span className="text-xs text-red-500">{errors.title}</span>
            )}
          </div>

          {/* Occurrence + Time row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Occurrence */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm sm:text-base font-bold text-[#1A1A1A]">Occurrence</label>
              <div className="relative flex items-center h-13 sm:h-14 rounded-[16px] border border-[#EEEEEE] bg-[#FBFBFC] px-4 focus-within:border-[#1A1A1A] focus-within:bg-white transition-all cursor-pointer">
                <div className="flex items-center gap-2.5 pointer-events-none absolute left-4 z-10">
                  <svg className="w-5 h-5 text-[#525252] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="14" rx="3" />
                    <path d="M9 14l-2-2 2-2" />
                    <path d="M7 12h7a2 2 0 0 1 2 2v0" />
                  </svg>
                  <span className="text-sm sm:text-base font-normal text-[#1A1A1A]">
                    {OCCURRENCE_OPTIONS.find((opt) => opt.value === form.occurrence)?.label || "Once"}
                  </span>
                </div>
                <select
                  value={form.occurrence}
                  onChange={(e) => handleChange("occurrence", e.target.value)}
                  className="w-full h-full appearance-none bg-transparent text-transparent outline-none cursor-pointer z-20"
                >
                  {OCCURRENCE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="text-[#1A1A1A]">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#1A1A1A] pointer-events-none stroke-[2.25] z-10" />
              </div>
            </div>

            {/* Time */}
            <div className="flex flex-col gap-2.5">
              <label className="text-sm sm:text-base font-bold text-[#1A1A1A]">Time</label>
              <div className="relative flex items-center h-13 sm:h-14 rounded-[16px] border border-[#EEEEEE] bg-[#FBFBFC] px-4 focus-within:border-[#1A1A1A] focus-within:bg-white transition-all cursor-pointer">
                <div className="flex items-center gap-2.5 pointer-events-none absolute left-4 z-10">
                  <Clock className="w-5 h-5 text-[#525252] shrink-0 stroke-[1.8]" />
                  <span className="text-sm sm:text-base font-normal text-[#1A1A1A]">
                    {TIME_OPTIONS.find((opt) => opt.value === form.time)?.label || "Immediately"}
                  </span>
                </div>
                <select
                  value={form.time}
                  onChange={(e) => handleChange("time", e.target.value)}
                  className="w-full h-full appearance-none bg-transparent text-transparent outline-none cursor-pointer z-20"
                >
                  {TIME_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="text-[#1A1A1A]">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#1A1A1A] pointer-events-none stroke-[2.25] z-10" />
              </div>
            </div>
          </div>

          {/* Recipients */}
          <div className="flex flex-col gap-2.5">
            <label className="text-sm sm:text-base font-bold text-[#1A1A1A]">Recipients</label>
            <div className="relative flex items-center h-13 sm:h-14 rounded-[16px] border border-[#EEEEEE] bg-[#FBFBFC] px-3 focus-within:border-[#1A1A1A] focus-within:bg-white transition-all cursor-pointer">
              {/* Selected Pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E5E5E8] bg-white shadow-xs pointer-events-none absolute left-3 z-10">
                <User className="w-4 h-4 text-[#737373] stroke-[2]" />
                <span className="text-sm font-medium text-[#1A1A1A]">
                  {ROLE_OPTIONS.find((opt) => opt.value === form.role)?.label || "All Farmers"}
                </span>
              </div>
              <select
                value={form.role}
                onChange={(e) => handleChange("role", e.target.value)}
                className="w-full h-full appearance-none bg-transparent text-transparent outline-none cursor-pointer z-20"
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="text-[#1A1A1A]">
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#1A1A1A] pointer-events-none stroke-[2.25] z-10" />
            </div>
          </div>

          {/* Message Description */}
          <div className="flex flex-col gap-2.5">
            <label className="text-sm sm:text-base font-bold text-[#1A1A1A]">
              Message Description
            </label>
            <Textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter notification message..."
              rows={4}
              className={cn(
                "rounded-[18px] border border-[#EEEEEE] bg-[#FBFBFC] text-sm sm:text-base font-normal text-[#1A1A1A] placeholder:text-[#A3A3A3] resize-none focus-visible:ring-0 focus-visible:border-[#1A1A1A] focus-visible:bg-white shadow-none p-4.5 transition-all min-h-[140px]",
                errors.description && "border-red-400"
              )}
            />
            {errors.description && (
              <span className="text-xs text-red-500">{errors.description}</span>
            )}
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center gap-3.5 mt-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="h-13 px-8 rounded-[16px] bg-[#E3E3E3] border border-[#D0D0D0] text-sm sm:text-base font-semibold text-[#1A1A1A] hover:bg-[#D8D8D8] transition-colors cursor-pointer outline-none shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Adding..." : "Add Notification"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              className="h-13 px-9 rounded-[16px] bg-[#D9531E] text-sm sm:text-base font-semibold text-white hover:bg-[#C24614] transition-all cursor-pointer outline-none shadow-[0_4px_14px_rgba(217,83,30,0.28)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
