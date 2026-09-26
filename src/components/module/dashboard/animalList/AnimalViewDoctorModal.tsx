"use client"

import { useEffect, useState } from "react"
import { Stethoscope, Calendar, User } from "lucide-react"
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { Avatar } from "@/components/ui/avatar"
import { getAnimalById } from "@/services/animal.service"
import type { AnimalListItem } from "@/services/animal.service"

interface AnimalViewDoctorModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    animalId: number | null
}

export default function AnimalViewDoctorModal({
    open,
    onOpenChange,
    animalId,
}: AnimalViewDoctorModalProps) {
    const [animal, setAnimal] = useState<AnimalListItem | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!open || !animalId) {
            setAnimal(null)
            setError(null)
            return
        }

        async function fetchAnimal() {
            setLoading(true)
            setError(null)
            const result = await getAnimalById(animalId!)
            if (result.status && result.data) {
                setAnimal(result.data)
            } else {
                setError(result.message || "Animal not found")
            }
            setLoading(false)
        }
        fetchAnimal()
    }, [open, animalId])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={true}
                className="max-w-[480px] w-[calc(100vw-2rem)] p-0 rounded-[28px] sm:rounded-[32px] bg-white border border-[#EAE5DD] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] overflow-hidden font-sans"
            >
                {/* Header */}
                <div className="relative bg-gradient-to-b from-[#F0F7FF] via-[#E4F0FF] to-[#D4E5FF] px-8 pt-8 pb-10 border-b border-[#C0D8FF]">
                    <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#60A5FA]" />
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white border-4 border-white shadow-[0_10px_25px_rgba(37,99,235,0.18)] ring-1 ring-[#BFDBFE] text-[#2563EB]">
                            <Stethoscope className="w-8 h-8 stroke-[2.25]" />
                        </div>
                        {loading ? (
                            <div className="h-6 w-40 bg-white/60 rounded-lg animate-pulse" />
                        ) : animal ? (
                            <h2 className="text-xl font-extrabold text-[#1A1A1A] font-display tracking-tight text-center">
                                Doctor Visit Info
                            </h2>
                        ) : null}
                    </div>
                </div>

                {/* Content */}
                <div className="relative px-6 sm:px-8 pt-6 pb-7">
                    {loading ? (
                        <div className="flex flex-col gap-3">
                            {[1, 2, 3].map((i) => (
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
                    ) : error ? (
                        <p className="text-sm font-medium text-[#737373] text-center py-4 bg-red-50 text-red-600 rounded-xl border border-red-200">{error}</p>
                    ) : animal ? (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3.5 p-4 bg-[#FAFAFA]/90 hover:bg-white hover:border-[#2563EB]/30 hover:shadow-[0_8px_20px_rgba(37,99,235,0.05)] transition-all duration-200 rounded-[20px] border border-[#EFECE6] group">
                                <div className="flex items-center justify-center w-10 h-10 rounded-[14px] bg-white border border-[#DCE8F8] shadow-2xs shrink-0 text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white group-hover:border-[#2563EB] transition-all duration-200">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] font-bold text-[#8C877E] uppercase tracking-wider">
                                        Vaccination Date
                                    </span>
                                    <span className="text-sm font-semibold text-[#1A1A1A]">
                                        {animal.vaccinationDate || "N/A"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3.5 p-4 bg-[#FAFAFA]/90 hover:bg-white hover:border-[#2563EB]/30 hover:shadow-[0_8px_20px_rgba(37,99,235,0.05)] transition-all duration-200 rounded-[20px] border border-[#EFECE6] group">
                                <div className="flex items-center justify-center w-10 h-10 rounded-[14px] bg-white border border-[#DCE8F8] shadow-2xs shrink-0 text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white group-hover:border-[#2563EB] transition-all duration-200">
                                    <Stethoscope className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] font-bold text-[#8C877E] uppercase tracking-wider">
                                        Doctor Visit
                                    </span>
                                    <span className="text-sm font-semibold text-[#1A1A1A]">
                                        {animal.doctorVisit || "N/A"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3.5 p-4 bg-[#FAFAFA]/90 hover:bg-white hover:border-[#2563EB]/30 hover:shadow-[0_8px_20px_rgba(37,99,235,0.05)] transition-all duration-200 rounded-[20px] border border-[#EFECE6] group">
                                <div className="flex items-center justify-center w-10 h-10 rounded-[14px] bg-white border border-[#DCE8F8] shadow-2xs shrink-0 text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white group-hover:border-[#2563EB] transition-all duration-200">
                                    <User className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] font-bold text-[#8C877E] uppercase tracking-wider">
                                        Animal
                                    </span>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <Avatar
                                            src={animal.avatar || undefined}
                                            alt={animal.animalName}
                                            fallback={animal.animalName.charAt(0)}
                                            size="sm"
                                            className="w-5 h-5 border border-[#DCE8F8]"
                                        />
                                        <span className="text-sm font-semibold text-[#1A1A1A] truncate">
                                            {animal.animalName} ({animal.animalTag})
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}

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
