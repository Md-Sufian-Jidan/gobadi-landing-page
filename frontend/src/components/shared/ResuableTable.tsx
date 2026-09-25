"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table"
import tablearrowright from "@/assets/tablearrowright.svg"
import tablearrowleft from "@/assets/tablearrowleft.svg"
import Image from "next/image"
import { Button } from "../ui/button"

export interface TableColumn<T> {
    key: string
    header: React.ReactNode
    cell?: (item: T, index: number) => React.ReactNode
    align?: "left" | "center" | "right"
    headerClassName?: string
    className?: string
}

export interface FilterOption {
    label: string
    value: string
}

export interface ResuableTableProps<T> {
    title?: string
    totalCount?: number | string

    data: T[]
    columns: TableColumn<T>[]
    getRowKey?: (item: T, index: number) => string | number

    selectable?: boolean
    selectedIds?: (string | number)[]
    onSelectionChange?: (selectedIds: (string | number)[]) => void

    searchPlaceholder?: string
    searchValue?: string
    onSearchChange?: (value: string) => void
    filterOptions?: FilterOption[]
    selectedFilter?: string
    onFilterChange?: (filterValue: string) => void

    headerAction?: React.ReactNode

    currentPage?: number
    totalPages?: number
    onPageChange?: (page: number) => void

    isLoading?: boolean
    emptyText?: string
    className?: string
}

export default function ResuableTable<T>({
    title,
    totalCount,
    data,
    columns,
    getRowKey = (_, index) => index,
    selectable = true,
    selectedIds: externalSelectedIds,
    onSelectionChange,
    searchPlaceholder = "Search...",
    searchValue: externalSearchValue,
    onSearchChange,
    filterOptions = [
        { label: "All", value: "all" },
        { label: "Active", value: "active" },
        { label: "Pending", value: "pending" },
    ],
    selectedFilter: externalSelectedFilter,
    onFilterChange,
    headerAction,
    currentPage = 1,
    totalPages = 40,
    onPageChange,
    isLoading = false,
    emptyText = "No records found.",
    className,
}: ResuableTableProps<T>) {
    // Internal selection state
    const [internalSelectedIds, setInternalSelectedIds] = React.useState<(string | number)[]>([])
    const selectedIds = externalSelectedIds !== undefined ? externalSelectedIds : internalSelectedIds

    const handleSelectAll = (checked: boolean) => {
        let newSelected: (string | number)[] = []
        if (checked) {
            newSelected = data.map((item, index) => getRowKey(item, index))
        }
        if (onSelectionChange) {
            onSelectionChange(newSelected)
        } else {
            setInternalSelectedIds(newSelected)
        }
    }

    const handleSelectRow = (key: string | number, checked: boolean) => {
        let newSelected: (string | number)[] = []
        if (checked) {
            newSelected = [...selectedIds, key]
        } else {
            newSelected = selectedIds.filter((id) => id !== key)
        }
        if (onSelectionChange) {
            onSelectionChange(newSelected)
        } else {
            setInternalSelectedIds(newSelected)
        }
    }

    const isAllSelected = data.length > 0 && selectedIds.length === data.length
    const searchInputRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault()
                searchInputRef.current?.focus()
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    return (
        <div className={cn("w-full", className)}>
            {/* Main Table Card Box */}
            <div className="border border-[#5B5B5B33] rounded-[16px] sm:rounded-[20px] overflow-hidden bg-white shadow-xs">
                <div className="overflow-x-auto">
                    <Table className="w-full border-collapse">
                        {/* Table Header */}
                        <TableHeader className="bg-white">
                            <TableRow className="border-b border-[#5B5B5B33] hover:bg-transparent">
                                {/* Select All Checkbox Column */}
                                {selectable && (
                                    <TableHead className="w-12 px-3 sm:px-4 py-3.5 text-center border-r border-[#5B5B5B33]">
                                        <div className="flex items-center justify-center">
                                            <Checkbox
                                                checked={isAllSelected}
                                                onCheckedChange={handleSelectAll}
                                                aria-label="Select all rows"
                                            />
                                        </div>
                                    </TableHead>
                                )}

                                {/* Column Headers */}
                                {columns.map((col, idx) => (
                                    <TableHead
                                        key={col.key}
                                        className={cn(
                                            "px-4 py-3.5 text-xs sm:text-sm font-semibold text-[#1A1A1A] whitespace-nowrap border-r border-[#5B5B5B33] last:border-r-0",
                                            col.align === "center" && "text-center",
                                            col.align === "right" && "text-right",
                                            col.align === "left" && "text-left",
                                            col.headerClassName
                                        )}
                                    >
                                        {col.header}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length + (selectable ? 1 : 0)}
                                        className="h-48 text-center py-12 text-muted-foreground"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Loader2 className="w-6 h-6 animate-spin text-[#1A1A1A]" />
                                            <span className="text-sm font-medium">Loading data...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length + (selectable ? 1 : 0)}
                                        className="h-40 text-center py-10 text-[#737373] text-sm"
                                    >
                                        {emptyText}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((item, index) => {
                                    const key = getRowKey(item, index)
                                    const isSelected = selectedIds.includes(key)

                                    return (
                                        <TableRow
                                            key={key}
                                            className={cn(
                                                "border-b border-[#5B5B5B33] last:border-b-0 hover:bg-[#FAF9F6]/80 transition-colors",
                                                index % 2 === 0 ? "bg-[#FBFAFC]" : "bg-white",
                                                isSelected && "bg-[#F7F4EE]/80"
                                            )}
                                        >
                                            {/* Checkbox Cell */}
                                            {selectable && (
                                                <TableCell className="w-12 px-3 sm:px-4 py-3 text-center border-r border-[#5B5B5B33]">
                                                    <div className="flex items-center justify-center">
                                                        <Checkbox
                                                            checked={isSelected}
                                                            onCheckedChange={(checked) => handleSelectRow(key, checked)}
                                                            aria-label={`Select row ${index + 1}`}
                                                        />
                                                    </div>
                                                </TableCell>
                                            )}

                                            {/* Data Cells */}
                                            {columns.map((col) => {
                                                const cellValue = (item as Record<string, unknown>)[col.key]
                                                return (
                                                    <TableCell
                                                        key={col.key}
                                                        className={cn(
                                                            "px-4 py-3 text-xs sm:text-sm text-[#1A1A1A] whitespace-nowrap border-r border-[#5B5B5B33] last:border-r-0 align-middle",
                                                            col.align === "center" && "text-center",
                                                            col.align === "right" && "text-right",
                                                            col.align === "left" && "text-left",
                                                            col.className
                                                        )}
                                                    >
                                                        {col.cell
                                                            ? col.cell(item, index)
                                                            : (cellValue as React.ReactNode)}
                                                    </TableCell>
                                                )
                                            })}
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Table Footer / Pagination */}
                <div className="border-t border-[#5B5B5B33] px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
                    {/* Left Info: Page X of Y */}
                    <div className="text-xs sm:text-sm font-semibold text-[#2563EB]">
                        Page {currentPage} of {totalPages}
                    </div>

                    {/* Right Pagination Segmented Control */}
                    <div className="flex items-center border border-[#DEDEDE] rounded-md overflow-hidden bg-white">
                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={currentPage <= 1}
                            onClick={() => onPageChange?.(currentPage - 1)}
                            className="h-9 w-10 rounded-none border-r border-[#E5E0D8] text-[#525252] hover:bg-transparent hover:text-[#1A1A1A] disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
                            aria-label="Previous page"
                        >
                            <Image src={tablearrowleft} alt="Previous Page" className="w-4 h-4" />
                        </Button>

                        {/* Current Active Page Display */}
                        <div className="min-w-[56px] h-9 px-3 flex items-center justify-center font-bold text-sm text-[#2563EB] bg-white select-none">
                            {currentPage < 10 ? `0${currentPage}` : currentPage}
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            disabled={currentPage >= totalPages}
                            onClick={() => onPageChange?.(currentPage + 1)}
                            className="h-9 w-10 rounded-none border-l border-[#DEDEDE] text-[#525252] hover:bg-transparent hover:text-[#1A1A1A] disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
                            aria-label="Next page"
                        >
                            <Image src={tablearrowright} alt="Next Page" className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}