"use client"

import ResuableTable, { TableColumn } from "@/components/shared/ResuableTable"
import { Avatar } from "@/components/ui/avatar"
import { MoreVertical, Eye, Trash2, CheckCircle2 } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getDoctors } from "@/services/dashboard.service"
import type { Doctor } from "@/types/user.type"
import { useEffect, useState } from "react"
import DoctorProfileModal from "./DoctorProfileModal"
import DeleteDoctorDialog from "./DeleteDoctorDialog"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/queryKeys"

export interface DoctorTableProps {
    searchValue?: string
    selectedFilter?: string
    hideHeaderControls?: boolean
    onDataChange?: (count: number) => void
}

export default function DoctorsTable({
    searchValue = "",
    selectedFilter = "all",
    hideHeaderControls = false,
    onDataChange,
}: DoctorTableProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([])
    const queryClient = useQueryClient()

    const [profileModalOpen, setProfileModalOpen] = useState(false)
    const [doctorToView, setDoctorToView] = useState<number | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [doctorToDelete, setDoctorToDelete] = useState<{ id: number; name: string } | null>(null)

    const { data: result, isLoading: loading } = useQuery({
        queryKey: queryKeys.doctors(currentPage, searchValue, selectedFilter),
        queryFn: () => getDoctors(currentPage, 10, searchValue, selectedFilter),
    });

    const doctors = result?.status && result.data ? result.data.users || [] : []
    const totalPages = result?.status && result.data ? result.data.pagination?.pages || 1 : 1
    const totalCount = result?.status && result.data ? result.data.pagination?.total || 0 : 0

    useEffect(() => {
        setCurrentPage(1)
    }, [searchValue, selectedFilter])

    useEffect(() => {
        onDataChange?.(totalCount)
    }, [totalCount, onDataChange])

    const filteredData = doctors

    const columns: TableColumn<Doctor>[] = [
        {
            key: "id",
            header: "Doctor ID",
            cell: (item) => (
                <span className="font-bold text-[#1A1A1A]">#{item.id}</span>
            ),
        },
        {
            key: "name",
            header: "Doctor Name",
            cell: (item) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        src={item.avatar || undefined}
                        alt={item.name || "Doctor"}
                        fallback={(item.name || "D")[0]}
                        size="md"
                    />
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#1A1A1A] text-sm leading-tight">
                                {item.name || "Unknown"}
                            </span>
                            {item.verified && (
                                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]">
                                    <CheckCircle2 className="w-2.5 h-2.5" />
                                    Verified
                                </span>
                            )}
                        </div>
                        <span className="text-xs text-[#737373] font-normal leading-tight">
                            {item.email || "No email"}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            key: "phone",
            header: "Phone No.",
            cell: (item) => (
                <span className="font-medium text-[#1A1A1A]">{item.phone || "N/A"}</span>
            ),
        },
        {
            key: "address",
            header: "Address",
            cell: (item) => (
                <span className="font-medium text-[#1A1A1A]">{item.address || "N/A"}</span>
            ),
        },
        {
            key: "pendingAppointments",
            header: "Pending Appointments",
            cell: (item) => (
                <span className="font-medium text-[#1A1A1A]">{item.pendingAppointments || "N/A"}</span>
            ),
        },
        {
            key: "completedAppointments",
            header: "Completed Appointments",
            cell: (item) => (
                <span className="font-medium text-[#1A1A1A]">{item.completedAppointments || "N/A"}</span>
            ),
        },
        {
            key: "totalAppointments",
            header: "Total Appointments",
            cell: (item) => (
                <span className="font-medium text-[#1A1A1A]">{item.totalAppointments || "N/A"}</span>
            ),
        },
        {
            key: "action",
            header: "Action",
            align: "center",
            cell: (item) => (
                <DropdownMenu>
                    <DropdownMenuTrigger className="p-1 rounded-md text-[#525252] hover:text-[#1A1A1A] hover:bg-[#F7F4EE] transition-colors outline-none cursor-pointer">
                        <MoreVertical className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44 bg-white border border-[#EAE5DD] shadow-lg rounded-xl p-1 z-30">
                        <DropdownMenuItem
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#1A1A1A] hover:bg-[#F7F4EE] rounded-lg cursor-pointer"
                            onClick={() => {
                                setDoctorToView(item.id)
                                setProfileModalOpen(true)
                            }}
                        >
                            <Eye className="w-3.5 h-3.5 text-[#525252]" />
                            <span>View Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            variant="destructive"
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer"
                            onClick={() => {
                                setDoctorToDelete({ id: item.id, name: item.name || "Unknown" })
                                setDeleteDialogOpen(true)
                            }}
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ]

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <>
            <ResuableTable<Doctor>
                title={hideHeaderControls ? undefined : "Total Doctors"}
                totalCount={hideHeaderControls ? undefined : totalCount}
                data={filteredData}
                columns={columns}
                getRowKey={(item) => item.id}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
            <DoctorProfileModal
                open={profileModalOpen}
                onOpenChange={setProfileModalOpen}
                doctorId={doctorToView}
            />
            <DeleteDoctorDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                doctorId={doctorToDelete?.id ?? null}
                doctorName={doctorToDelete?.name ?? ""}
                onDelete={() => queryClient.invalidateQueries({ queryKey: queryKeys.doctors() })}
            />
        </>
    )
}
