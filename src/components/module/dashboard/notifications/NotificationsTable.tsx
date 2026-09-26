"use client"

import ResuableTable, { TableColumn } from "@/components/shared/ResuableTable"
import { MoreVertical, Eye, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getNotifications } from "@/services/notification.service"
import type { Notification, NotificationType } from "@/types/notification.type"
import { useEffect, useState } from "react"
import NotificationDetailModal from "./NotificationDetailModal"
import DeleteNotificationDialog from "./DeleteNotificationDialog"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/queryKeys"

export interface NotificationsTableProps {
  searchValue?: string
  selectedFilter?: string
  hideHeaderControls?: boolean
  onDataChange?: (count: number) => void
}

export default function NotificationsTable({
  searchValue = "",
  selectedFilter = "all",
  hideHeaderControls = false,
  onDataChange,
}: NotificationsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([])
  const [debouncedSearch, setDebouncedSearch] = useState(searchValue)
  const queryClient = useQueryClient();

  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [notificationToView, setNotificationToView] = useState<number | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [notificationToDelete, setNotificationToDelete] = useState<{ id: number; title: string } | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchValue), 300)
    return () => clearTimeout(timer)
  }, [searchValue])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, selectedFilter])

  const { data: result, isLoading: loading } = useQuery({
    queryKey: queryKeys.notifications(currentPage, debouncedSearch.trim() || undefined, selectedFilter),
    queryFn: () => getNotifications(currentPage, 10, debouncedSearch.trim() || undefined, selectedFilter),
  });

  const notifications = result?.status && result.data ? result.data : []
  const totalPages = result?.status && result.meta ? result.meta.totalPage : 1
  const totalCount = result?.status && result.meta ? result.meta.total : 0

  useEffect(() => {
    onDataChange?.(totalCount)
  }, [totalCount, onDataChange])

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`
    } catch {
      return dateStr
    }
  }

  const columns: TableColumn<Notification>[] = [
    {
      key: "id",
      header: "ID",
      cell: (item) => (
        <span className="font-bold text-[#1A1A1A]">#{item.id || "N/A"}</span>
      ),
    },
    {
      key: "notificationTitle",
      header: "Notification Title",
      cell: (item) => (
        <span className="font-semibold text-[#1A1A1A] text-sm">{item.title || "N/A"}</span>
      ),
    },
    {
      key: "body",
      header: "Description",
      cell: (item) => (
        <span className="text-[#525252] text-sm max-w-[180px] truncate block">
          {item.body || "N/A"}
        </span>
      ),
    },
    {
      key: "createDate",
      header: "Create Date",
      cell: (item) => (
        <span className="text-[#525252] text-sm max-w-[180px] truncate block">
          {formatDate(item.createdAt) || "N/A"}
        </span>
      ),
    },
    {
      key: "sendDateAndTime",
      header: "Send Date & Time",
      cell: (item) => (
        <span className="text-[#525252] text-sm max-w-[180px] truncate block">
          {item.sendDateAndTime || "N/A"}
        </span>
      ),
    },
    {
      key: "occurrence",
      header: "Occurrence",
      cell: (item) => (
        <span className="text-[#525252] text-sm max-w-[180px] truncate block">
          {item.occurrence || "Once"}
        </span>
      ),
    },
    {
      key: "sentTo",
      header: "Sent To",
      cell: (item) => (
        <span className="text-[#525252] text-sm max-w-[180px] truncate block">
          {item.sentTo || "N/A"}
        </span>
      ),
    },
    {
      key: "sent",
      header: "Sent",
      cell: (item) => (
        <span className="text-[#525252] text-sm max-w-[180px] truncate block">
          {item.sent || "N/A"}
        </span>
      ),
    },
    {
      key: "tapped",
      header: "Tapped",
      cell: (item) => (
        <span className="text-[#525252] text-sm max-w-[180px] truncate block">
          {item.tapped || "N/A"}
        </span>
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
                setNotificationToView(item.id)
                setDetailModalOpen(true)
              }}
            >
              <Eye className="w-3.5 h-3.5 text-[#525252]" />
              <span>View Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer"
              onClick={() => {
                setNotificationToDelete({ id: item.id, title: item.title || "Untitled" })
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
      <ResuableTable<Notification>
        title={hideHeaderControls ? undefined : "Total Notifications"}
        totalCount={hideHeaderControls ? undefined : totalCount}
        data={notifications}
        columns={columns}
        getRowKey={(item) => item.id}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      <NotificationDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        notificationId={notificationToView}
      />
      <DeleteNotificationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        notificationId={notificationToDelete?.id ?? null}
        notificationTitle={notificationToDelete?.title ?? ""}
        onDelete={() => queryClient.invalidateQueries({ queryKey: queryKeys.notifications() })}
      />
    </>
  )
}
