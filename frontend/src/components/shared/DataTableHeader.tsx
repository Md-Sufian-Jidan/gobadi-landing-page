"use client"

import * as React from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Kbd } from "@/components/ui/kbd"
import Image from "next/image"
import filtericon from "@/assets/filter-icon.svg"
import filterarrowicon from "@/assets/filter-arrow-icon.svg"
import magnifyingglassicon from "@/assets/magnifyingglass.svg"

export interface FilterOption {
    label: string
    value: string
}

export interface DataTableHeaderProps {
    title?: string
    totalCount?: number
    searchValue?: string
    searchPlaceholder?: string
    onSearchChange?: (value: string) => void
    selectedFilter?: string
    filterOptions?: FilterOption[]
    onFilterChange?: (filter: string) => void
    shortcutHint?: string
    actions?: React.ReactNode
}

const DEFAULT_FILTER_OPTIONS: FilterOption[] = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
]

export default function DataTableHeader({
    title = "Items",
    totalCount,
    searchValue = "",
    searchPlaceholder = "Search...",
    onSearchChange,
    selectedFilter = "all",
    filterOptions = DEFAULT_FILTER_OPTIONS,
    onFilterChange,
    shortcutHint = "⌘ K",
    actions,
}: DataTableHeaderProps) {
    const currentLabel = filterOptions.find((opt) => opt.value === selectedFilter)?.label || "All"

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#7B7B7B4D]">
            {/* Title & Count */}
            <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold text-primary">
                    {title}
                </h1>
                {totalCount !== undefined && (
                    <span className="text-sm font-medium text-primary">
                        ( {totalCount.toLocaleString()} )
                    </span>
                )}
            </div>

            {/* Controls Container */}
            <div className={`flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end ${actions ? 'md:flex-row flex-wrap' : 'flex-row'}`}>
                {/* Search Bar */}
                {onSearchChange && (
                    <div className="relative flex items-center w-full sm:w-64 md:w-72">
                        <Image
                            src={magnifyingglassicon}
                            alt="magnifyingglassicon"
                            width={16}
                            height={16}
                            className="absolute left-3.5 w-4 h-4 pointer-events-none z-10 opacity-70"
                        />
                        <Input
                            type="text"
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="h-9 w-full pl-9 pr-14 text-xs sm:text-sm bg-[#F8F8F8] border border-[#E4E4E4] rounded-[10px] text-[#1A1A1A] placeholder:text-[#737373] focus-visible:ring-0 focus-visible:border-[#CCCCCC] focus-visible:bg-white transition-all shadow-none"
                        />
                        {shortcutHint && (
                            <Kbd className="absolute right-2 z-10 h-6 px-2 py-0.5 text-[11px] font-medium text-[#525252] bg-gradient-to-b from-[#FFFFFF] to-[#EAEAEA] border border-[#D4D4D4] rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
                                {shortcutHint}
                            </Kbd>
                        )}
                    </div>
                )}

                {/* Filter Dropdown */}
                {onFilterChange && filterOptions.length > 0 && (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center justify-between gap-2.5 h-9 min-w-[130px] px-3 py-1 bg-white border border-[#ECECEC] rounded-[10px] text-sm font-medium text-[#1A1A1A] transition-colors outline-none cursor-pointer shrink-0">
                            <div className="flex items-center gap-2 min-w-0">
                                <Image src={filtericon} alt="Filter icon" width={16} height={16} className="w-4 h-4 shrink-0" />
                                <span className="whitespace-nowrap">{currentLabel}</span>
                            </div>
                            <Image src={filterarrowicon} alt="Filter arrow icon" width={20} height={20} className="w-5 h-5 shrink-0" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="min-w-[160px] max-h-64 overflow-y-auto bg-white border border-[#EAE5DD] shadow-md rounded-lg p-1 z-30"
                        >
                            {filterOptions.map((opt) => (
                                <DropdownMenuItem
                                    key={opt.value}
                                    onClick={() => onFilterChange(opt.value)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-[10px] cursor-pointer transition-colors whitespace-nowrap ${opt.value === selectedFilter
                                        ? "bg-[#F7F4EE] text-[#1A1A1A] font-semibold"
                                        : "text-[#525252] hover:bg-[#F7F4EE] hover:text-[#1A1A1A]"
                                        }`}
                                >
                                    {opt.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}

                {/* Custom Actions Slot (e.g. Add Button, Export Button) */}
                {actions}
            </div>
        </div>
    )
}