"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import DataTableHeader from "@/components/shared/DataTableHeader"
import DoctorsTable from "@/components/module/dashboard/userList/doctors/DoctorsTable"

export default function DoctorsPage() {
    const [searchValue, setSearchValue] = useState("")
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
                title="Total Doctors"
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

            {/* Doctors Table */}
            <DoctorsTable
                searchValue={searchValue}
                selectedFilter={selectedFilter}
                hideHeaderControls={true}
                onDataChange={setTotalCount}
            />
        </motion.section>
    )
}