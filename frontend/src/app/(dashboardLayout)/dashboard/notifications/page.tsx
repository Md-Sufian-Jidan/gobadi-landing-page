"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import DataTableHeader from "@/components/shared/DataTableHeader"
import NotificationsTable from "@/components/module/dashboard/notifications/NotificationsTable"
import AddNotificationModal from "@/components/module/dashboard/notifications/AddNotificationModal"
import { Button } from "@/components/ui/button"
import addnewplus from "@/assets/addnewplus.svg"
import Image from "next/image"
import { useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/queryKeys"

export default function NotificationsPage() {
  const [searchValue, setSearchValue] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const queryClient = useQueryClient()

  const handleAdd = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications() })
  }, [queryClient])

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="bg-[#FCFCFC] border border-[#EAE5DD] shadow-xs rounded-[20px] sm:rounded-[28px] p-4 sm:p-7 flex flex-col gap-5 sm:gap-6"
      >
        {/* Page Header */}
        <DataTableHeader
          title="Total Notifications"
          totalCount={totalCount}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          filterOptions={[
            { label: "All", value: "all" },
            { label: "System", value: "system" },
            { label: "Order", value: "order" },
            { label: "Payment", value: "payment" },
            { label: "Delivery", value: "delivery" },
            { label: "Booking", value: "booking" },
            { label: "Promotion", value: "promotion" },
          ]}
          actions={
            <Button
              variant="secondary"
              id="add-new-admin-btn"
              onClick={() => setIsModalOpen(true)}
              className="h-10 px-5 py-2.5 rounded-lg bg-gradient-to-b from-[#E5E5E5] to-[#E2E2E2] border border-[#D4D4D4] text-sm font-medium text-primary hover:shadow-md hover:from-[#E2E2E2] hover:to-[#E5E5E5] transition-all cursor-pointer flex items-center gap-2"
            >
              <Image
                src={addnewplus}
                alt="Add new admin icon"
                width={16}
                height={16}
                className="w-4 h-4"
              />
              <span>Add New Notification</span>
            </Button>
          }
        />

        {/* Notifications Table */}
        <NotificationsTable
          searchValue={searchValue}
          selectedFilter={selectedFilter}
          hideHeaderControls
          onDataChange={setTotalCount}
        />
      </motion.section>

      {/* Add Notification Modal */}
      <AddNotificationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAdd={handleAdd}
      />
    </>
  )
}
