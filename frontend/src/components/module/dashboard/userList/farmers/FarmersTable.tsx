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
import { getFarmers } from "@/services/dashboard.service"
import type { Farmer } from "@/types/user.type"
import { useEffect, useState } from "react"
import FarmerProfileModal from "./FarmerProfileModal"
import DeleteFarmerDialog from "./DeleteFarmerDialog"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/queryKeys"

export interface FarmersTableProps {
    searchValue?: string
    selectedFilter?: string
    hideHeaderControls?: boolean
    onDataChange?: (count: number) => void
}

export default function FarmersTable({
    searchValue = "",
    selectedFilter = "all",
    hideHeaderControls = false,
    onDataChange,
}: FarmersTableProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([])
    const queryClient = useQueryClient()

    const [profileModalOpen, setProfileModalOpen] = useState(false)
    const [farmerToView, setFarmerToView] = useState<number | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [farmerToDelete, setFarmerToDelete] = useState<{ id: number; name: string } | null>(null)

    const { data: result, isLoading: loading } = useQuery({
        queryKey: queryKeys.farmers(currentPage, searchValue, selectedFilter),
        queryFn: () => getFarmers(currentPage, 10, searchValue, selectedFilter),
    })

    const farmers = result?.status && result.data ? result.data.users || [] : []
    const totalPages = result?.status && result.data ? result.data.pagination?.pages || 1 : 1
    const totalCount = result?.status && result.data ? result.data.pagination?.total || 0 : 0

    useEffect(() => {
        setCurrentPage(1)
    }, [searchValue, selectedFilter])

    useEffect(() => {
        onDataChange?.(totalCount)
    }, [totalCount, onDataChange])

    const filteredData = farmers

    const columns: TableColumn<Farmer>[] = [
        {
            key: "id",
            header: "Farmer ID",
            cell: (item) => (
                <span className="font-bold text-[#1A1A1A]">#{item.id}</span>
            ),
        },
        {
            key: "name",
            header: "Farmer Name",
            cell: (item) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        src={item.avatar || undefined}
                        alt={item.name || "Farmer"}
                        fallback={(item.name || "F")[0]}
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
                <span className="font-medium text-[#1A1A1A]">{item.phone || "-"}</span>
            ),
        },
        {
            key: "address",
            header: "Address",
            cell: (item) => (
                <span className="font-medium text-[#1A1A1A]">{item.address || "-"}</span>
            ),
        },
        {
            key: "noOfAnimal",
            header: "No of Animal",
            cell: (item) => (
                <span className="font-medium text-[#1A1A1A]">{item.noOfAnimal || "0"}</span>
            ),
        },
        {
            key: "addedTask",
            header: "Added Task",
            cell: (item) => (
                <span className="font-medium text-[#1A1A1A]">{item.addedTask || "-"}</span>
            ),
        },
        {
            key: "appointments",
            header: "Appointments",
            cell: (item) => (
                <span className="font-medium text-[#1A1A1A]">{item.appointments || "0"}</span>
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
                                setFarmerToView(item.id)
                                setProfileModalOpen(true)
                            }}
                        >
                            <Eye className="w-3.5 h-3.5 text-[#525252]" />
                            <span>View Farmer</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            variant="destructive"
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer"
                            onClick={() => {
                                setFarmerToDelete({ id: item.id, name: item.name || "Unknown" })
                                setDeleteDialogOpen(true)
                            }}
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Farmer</span>
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
            <ResuableTable<Farmer>
                title={hideHeaderControls ? undefined : "Total Farmers"}
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
            <FarmerProfileModal
                open={profileModalOpen}
                onOpenChange={setProfileModalOpen}
                farmerId={farmerToView}
            />
            <DeleteFarmerDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                farmerId={farmerToDelete?.id ?? null}
                farmerName={farmerToDelete?.name ?? ""}
                onDelete={() => queryClient.invalidateQueries({ queryKey: queryKeys.farmers() })}
            />
        </>
    )
}
