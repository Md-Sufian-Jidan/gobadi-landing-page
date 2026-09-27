"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import FarmersTable from "@/components/module/dashboard/userList/farmers/FarmersTable"
import DataTableHeader from "@/components/shared/DataTableHeader"

export default function FarmersPage() {
    return (
        <Suspense fallback={null}>
            <FarmersPageFromUrl />
        </Suspense>
    )
}

function FarmersPageFromUrl() {
    const searchParams = useSearchParams()
    const search = searchParams.get("search") ?? ""

    return <FarmersPageContent key={search} initialSearch={search} />
}

function FarmersPageContent({ initialSearch }: { initialSearch: string }) {
    const [searchValue, setSearchValue] = useState(initialSearch)
    const [selectedFilter, setSelectedFilter] = useState("all")
    const [totalCount, setTotalCount] = useState(0)

    return (
        <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="bg-[#FCFCFC] border border-[#EAE5DD] shadow-xs rounded-[20px] sm:rounded-[28px] p-4 sm:p-7 flex flex-col gap-5 sm:gap-6"
        >
            {/* Generic Data Table Header */}
            <DataTableHeader
                title="Total Farmers"
                totalCount={totalCount}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
                filterOptions={[
                    { label: "All", value: "all" },
                    { label: "Active", value: "active" },
                    { label: "Inactive", value: "inactive" },
                    { label: "Pending", value: "pending" },
                ]}
            />

            {/* Farmers Table */}
            <FarmersTable
                searchValue={searchValue}
                selectedFilter={selectedFilter}
                hideHeaderControls={true}
                onDataChange={setTotalCount}
            />
        </motion.section>
    )
}
