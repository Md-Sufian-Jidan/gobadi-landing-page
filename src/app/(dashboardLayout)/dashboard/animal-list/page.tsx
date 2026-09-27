"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import AnimalListTable from "@/components/module/dashboard/animalList/AnimalListTable"
import DataTableHeader from "@/components/shared/DataTableHeader"

export default function AnimalListPage() {
    return (
        <Suspense fallback={null}>
            <AnimalListPageFromUrl />
        </Suspense>
    )
}

function AnimalListPageFromUrl() {
    const searchParams = useSearchParams()
    const search = searchParams.get("search") ?? ""

    return <AnimalListPageContent key={search} initialSearch={search} />
}

function AnimalListPageContent({ initialSearch }: { initialSearch: string }) {
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
            <DataTableHeader
                title="Total Animals"
                totalCount={totalCount}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
                filterOptions={[
                    { label: "All", value: "all" },
                    { label: "Albino Buffalo", value: "Albino Buffalo" },
                    { label: "Bangladeshi Cow", value: "Bangladeshi Cow" },
                    { label: "Golden Retriever", value: "Golden Retriever" },
                    { label: "Persian Cat", value: "Persian Cat" },
                    { label: "German Shepherd", value: "German Shepherd" },
                    { label: "Labrador Retriever", value: "Labrador Retriever" },
                    { label: "Beagle", value: "Beagle" },
                    { label: "Siamese Cat", value: "Siamese Cat" },
                    { label: "Poodle", value: "Poodle" },
                    { label: "Bengal Cat", value: "Bengal Cat" },
                    { label: "Rottweiler", value: "Rottweiler" },
                    { label: "Cocker Spaniel", value: "Cocker Spaniel" },
                ]}
            />
            <AnimalListTable
                searchValue={searchValue}
                selectedFilter={selectedFilter}
                hideHeaderControls={true}
                onDataChange={setTotalCount}
            />
        </motion.section>
    )
}
