"use client"

import ResuableTable, { TableColumn } from "@/components/shared/ResuableTable"
import { Avatar } from "@/components/ui/avatar"
import { MoreVertical, Eye, Stethoscope, Trash2 } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getAnimals } from "@/services/animal.service"
import type { AnimalListItem } from "@/services/animal.service"
import { useEffect, useState } from "react"
import AnimalProfileModal from "./AnimalProfileModal"
import AnimalViewDoctorModal from "./AnimalViewDoctorModal"
import DeleteAnimalDialog from "./DeleteAnimalDialog"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/queryKeys"

export interface AnimalListTableProps {
    searchValue?: string
    selectedFilter?: string
    hideHeaderControls?: boolean
    onDataChange?: (count: number) => void
}

export default function AnimalListTable({
    searchValue = "",
    selectedFilter = "all",
    hideHeaderControls = false,
    onDataChange,
}: AnimalListTableProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([])
    const queryClient = useQueryClient()

    const [profileModalOpen, setProfileModalOpen] = useState(false)
    const [animalToView, setAnimalToView] = useState<number | null>(null)
    const [doctorModalOpen, setDoctorModalOpen] = useState(false)
    const [animalToDoctor, setAnimalToDoctor] = useState<number | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [animalToDelete, setAnimalToDelete] = useState<{ id: number; name: string } | null>(null)

    const { data: result, isLoading: loading } = useQuery({
        queryKey: queryKeys.animals(currentPage, searchValue || undefined, selectedFilter),
        queryFn: () => getAnimals(currentPage, 10, searchValue || undefined, selectedFilter),
    })

    const animals = result?.status && result.data ? result.data : []
    const totalPages = result?.status && result.meta ? result.meta.totalPage : 1
    const totalCount = result?.status && result.meta ? result.meta.total : 0

    useEffect(() => {
        setCurrentPage(1)
    }, [searchValue, selectedFilter])

    useEffect(() => {
        onDataChange?.(totalCount)
    }, [totalCount, onDataChange])

    const filteredData = animals

    const columns: TableColumn<AnimalListItem>[] = [
        {
            key: "animalTag",
            header: "Animal Tag",
            cell: (item) => (
                <span className="font-bold text-[#1A1A1A]">{item.animalTag}</span>
            ),
        },
        {
            key: "animalName",
            header: "Animal Name",
            cell: (item) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        src={item.avatar ?? undefined}
                        alt={item.animalName}
                        fallback={item.animalName.charAt(0)}
                        size="md"
                    />
                    <div className="flex flex-col">
                        <span className="font-bold text-[#1A1A1A] text-sm leading-tight">
                            {item.animalName}
                        </span>
                        <span className="text-xs text-[#737373] font-normal leading-tight">
                            {item.category}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            key: "age",
            header: "Age",
            cell: (item) => (
                <span className="font-medium text-[#1A1A1A]">{item.age || "-"}</span>
            ),
        },
        {
            key: "breed",
            header: "Breed",
            cell: (item) => (
                <span className="font-medium text-[#1A1A1A]">{item.breed || "-"}</span>
            ),
        },
        {
            key: "gender",
            header: "Gender",
            cell: (item) => (
                <span className="font-medium text-[#1A1A1A]">{item.gender || "-"}</span>
            ),
        },
        {
            key: "liveWeight",
            header: "Live Wt",
            cell: (item) => (
                <span className="font-medium text-[#1A1A1A]">{item.liveWeight || "-"}</span>
            ),
        },
        {
            key: "price",
            header: "Price",
            cell: (item) => (
                <span className="font-medium text-[#1A1A1A]">{item.price || "-"}</span>
            ),
        },
        {
            key: "vaccinationDate",
            header: "Vaccination Date",
            cell: (item) => (
                <span className="font-medium text-[#1A1A1A]">{item.vaccinationDate || "-"}</span>
            ),
        },
        {
            key: "doctorVisit",
            header: "Doctor Visit",
            align: "center",
            cell: (item) => (
                <span className="font-medium text-[#1A1A1A]">{item.doctorVisit || "-"}</span>
            ),
        },
        {
            key: "owner",
            header: "Owner",
            cell: (item) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        src={item.owner.avatar ?? undefined}
                        alt={item.owner.name}
                        fallback={item.owner.name.charAt(0)}
                        size="md"
                    />
                    <div className="flex flex-col">
                        <span className="font-bold text-[#1A1A1A] text-sm leading-tight">
                            {item.owner.name || "-"}
                        </span>
                        <span className="text-xs text-[#737373] font-normal leading-tight">
                            {item.owner.tag || "-"}
                        </span>
                    </div>
                </div>
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
                    <DropdownMenuContent
                        align="end"
                        className="w-44 bg-white border border-[#EAE5DD] shadow-lg rounded-xl p-1 z-30"
                    >
                        <DropdownMenuItem
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#1A1A1A] hover:bg-[#F7F4EE] rounded-lg cursor-pointer"
                            onClick={() => {
                                setAnimalToView(item.id)
                                setProfileModalOpen(true)
                            }}
                        >
                            <Eye className="w-3.5 h-3.5 text-[#525252]" />
                            <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#1A1A1A] hover:bg-[#F7F4EE] rounded-lg cursor-pointer"
                            onClick={() => {
                                setAnimalToDoctor(item.id)
                                setDoctorModalOpen(true)
                            }}
                        >
                            <Stethoscope className="w-3.5 h-3.5 text-[#525252]" />
                            <span>View Doctor</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            variant="destructive"
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer"
                            onClick={() => {
                                setAnimalToDelete({ id: item.id, name: item.animalName })
                                setDeleteDialogOpen(true)
                            }}
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Animal</span>
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
            <ResuableTable<AnimalListItem>
                title={hideHeaderControls ? undefined : "Total Animals"}
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
            <AnimalProfileModal
                open={profileModalOpen}
                onOpenChange={setProfileModalOpen}
                animalId={animalToView}
            />
            <AnimalViewDoctorModal
                open={doctorModalOpen}
                onOpenChange={setDoctorModalOpen}
                animalId={animalToDoctor}
            />
            <DeleteAnimalDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                animalId={animalToDelete?.id ?? null}
                animalName={animalToDelete?.name ?? ""}
                onDelete={() => queryClient.invalidateQueries({ queryKey: queryKeys.animals() })}
            />
        </>
    )
}
