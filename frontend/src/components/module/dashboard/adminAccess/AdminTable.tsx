"use client"

import Image from "next/image"
import ResuableTable, { TableColumn } from "@/components/shared/ResuableTable"
import { MoreVertical, Eye, Edit, Trash2, ShieldCheck, ShieldOff } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getAdmins, toggleAdminStatus } from "@/services/admin.service"
import type { Admin } from "@/types/admin.type"
import { useEffect, useMemo, useState } from "react"
import AdminDetailModal from "./AdminDetailModal"
import EditAdminModal from "./EditAdminModal"
import DeleteAdminDialog from "./DeleteAdminDialog"

export interface AdminTableProps {
    searchValue?: string
    selectedFilter?: string
    hideHeaderControls?: boolean
    onDataChange?: (count: number) => void
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/queryKeys"

export default function AdminTable({
    searchValue = "",
    selectedFilter = "all",
    hideHeaderControls = false,
    onDataChange,
}: AdminTableProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([])
    const queryClient = useQueryClient()

    const { data: result, isLoading: loading } = useQuery({
        queryKey: queryKeys.admins(currentPage),
        queryFn: () => getAdmins(currentPage, 10),
    })

    const admins: Admin[] = result?.status && result.data ? result.data : []
    const totalPages = result?.status && result.meta ? result.meta.totalPage : 1
    const totalCount = result?.status && result.meta ? result.meta.total : 0

    useEffect(() => {
        if (totalCount !== undefined) {
            onDataChange?.(totalCount)
        }
    }, [totalCount, onDataChange])

    const [detailModalOpen, setDetailModalOpen] = useState(false)
    const [adminToView, setAdminToView] = useState<number | null>(null)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [adminToEdit, setAdminToEdit] = useState<number | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [adminToDelete, setAdminToDelete] = useState<{ id: number; name: string } | null>(null)

    const toggleMutation = useMutation({
        mutationFn: (id: string) => toggleAdminStatus(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.admins() })
        }
    })

    const handleToggleStatus = (id: string) => {
        toggleMutation.mutate(id)
    }

    const filteredData = useMemo(() => {
        return admins.filter((a) => {
            if (selectedFilter !== "all") {
                const filterLower = selectedFilter.toLowerCase()
                if (a.status.toLowerCase() !== filterLower) return false
            }

            if (!searchValue.trim()) return true
            const q = searchValue.toLowerCase()
            return (
                (a.name || "").toLowerCase().includes(q) ||
                a.email.toLowerCase().includes(q) ||
                a.role.toLowerCase().includes(q) ||
                a.designation.toLowerCase().includes(q)
            )
        })
    }, [admins, searchValue, selectedFilter])

    const columns: TableColumn<Admin>[] = [
        {
            key: "id",
            header: "Office ID",
            cell: (item) => (
                <span className="font-bold text-[#1A1A1A] text-sm">#{item.id}</span>
            ),
        },
        {
            key: "name",
            header: "Name",
            cell: (item) => (
                <div className="flex items-center gap-3 min-w-[180px]">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-[#F0EDE8] flex-shrink-0 ring-1 ring-[#EAE5DD]">
                        {item.avatar ? (
                            <Image
                                src={item.avatar}
                                alt={item.name || "Admin"}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm font-bold text-[#525252]">
                                {(item.name || "A")[0]}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="font-semibold text-[#1A1A1A] text-sm whitespace-nowrap">
                            {(item.name || "").toUpperCase()}
                        </span>
                        <span className="text-[#737373] text-xs">{item.email}</span>
                    </div>
                </div>
            ),
        },
        {
            key: "role",
            header: "Role",
            align: "center",
            cell: (item) => <span className="text-primary text-sm font-semibold uppercase">{item.role === "super_admin" ? "SUPER ADMIN" : "ADMIN"}</span>
        },
        {
            key: "designation",
            header: "Designation",
            align: "center",
            cell: (item) => (
                <span className="text-primary text-sm font-semibold capitalize">{item.designation}</span>
            ),
        },
        {
            key: "status",
            header: "Status",
            align: "center",
            cell: (item) => <span className="text-primary text-sm font-semibold capitalize">{item.status === "active" ? "Active" : "Inactive"}</span>
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
                    <DropdownMenuContent
                        align="end"
                        className="w-44 bg-white border border-[#EAE5DD] shadow-lg rounded-xl p-1 z-30"
                    >
                        <DropdownMenuItem
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#1A1A1A] hover:bg-[#F7F4EE] rounded-lg cursor-pointer"
                            onClick={() => {
                                setAdminToView(item.id)
                                setDetailModalOpen(true)
                            }}
                        >
                            <Eye className="w-3.5 h-3.5 text-[#525252]" />
                            <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#1A1A1A] hover:bg-[#F7F4EE] rounded-lg cursor-pointer"
                            onClick={() => {
                                setAdminToEdit(item.id)
                                setEditModalOpen(true)
                            }}
                        >
                            <Edit className="w-3.5 h-3.5 text-[#525252]" />
                            <span>Edit Admin</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleToggleStatus(String(item.id))}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#1A1A1A] hover:bg-[#F7F4EE] rounded-lg cursor-pointer"
                        >
                            {item.status === "active" ? (
                                <>
                                    <ShieldOff className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Deactivate</span>
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Activate</span>
                                </>
                            )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            variant="destructive"
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer"
                            onClick={() => {
                                setAdminToDelete({ id: item.id, name: item.name || "Unknown" })
                                setDeleteDialogOpen(true)
                            }}
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Admin</span>
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
            <ResuableTable<Admin>
                title={hideHeaderControls ? undefined : "Admin List"}
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
            <AdminDetailModal
                open={detailModalOpen}
                onOpenChange={setDetailModalOpen}
                adminId={adminToView}
            />
            <EditAdminModal
                open={editModalOpen}
                onOpenChange={setEditModalOpen}
                adminId={adminToEdit}
                onUpdate={() => queryClient.invalidateQueries({ queryKey: queryKeys.admins() })}
            />
            <DeleteAdminDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                adminId={adminToDelete?.id ?? null}
                adminName={adminToDelete?.name ?? ""}
                onDelete={() => queryClient.invalidateQueries({ queryKey: queryKeys.admins() })}
            />
        </>
    )
}
