"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import filtericon from "@/assets/filter-icon.svg"
import filterarrowicon from "@/assets/filter-arrow-icon.svg"
import userlocationarrowrighticon from "@/assets/userlocationchartarrowright.svg"
import userlocationarrowlefticon from "@/assets/userloacationarrowleft.svg"
import { getUserLocation } from "@/services/dashboard.service";
import type { Period } from "@/types/api.type";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

interface LocationData {
    location: string;
    count: number;
}

const chartConfig = {
    count: {
        label: "Users",
        color: "#C1652F",
    },
} satisfies ChartConfig;

interface Props {
    period: Period;
}

export default function UserLocationChart({ period }: Props) {
    const [roleTab, setRoleTab] = useState<"farmer" | "doctor">("farmer");
    const [filter, setFilter] = useState("District");
    const [activeLocation, setActiveLocation] = useState<string>("");
    const [page, setPage] = useState(1);

    const { data: result, isLoading: loading } = useQuery({
        queryKey: queryKeys.userLocation(period, roleTab, filter),
        queryFn: () => getUserLocation(period, roleTab, filter as "District" | "Upazila" | "Division"),
    });

    const chartData = result?.status && result.data ? result.data.chartData : [];
    const isDataEmpty = !loading && (chartData.length === 0 || chartData.every((item) => item.count === 0));

    useEffect(() => {
        if (chartData.length > 0) {
            const maxItem = chartData.reduce((max, item) =>
                item.count > max.count ? item : max
            );
            setActiveLocation(maxItem.location);
        }
        setPage(1);
    }, [period, roleTab, filter, chartData]);

    const ITEMS_PER_PAGE = 10;
    const totalPages = Math.max(1, Math.ceil(chartData.length / ITEMS_PER_PAGE));
    const paginatedData = chartData.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-[#EAE5DD] shadow-xs rounded-[24px] p-6 flex flex-col justify-between relative overflow-hidden h-80"
        >
            {/* Header Section */}
            <div className="flex items-center justify-between gap-4 mb-4">
                <h3 className="font-bold text-lg text-[#1A1A1A] font-display">
                    User&apos;s Location
                </h3>

                {/* Dropdown Filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-[10px] border border-[#E5E0D8] text-xs font-semibold text-[#525252] hover:text-[#1A1A1A] transition-colors cursor-pointer outline-none">
                        <Image src={filtericon} alt="Filter Icon" className="w-3.5 h-3.5" />
                        <span>{filter}</span>
                        <Image src={filterarrowicon} alt="Filter Icon" className="w-5 h-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36 bg-white border border-[#EAE5DD] shadow-lg rounded-[10px] py-1 z-20 text-xs">
                        {["District", "Upazila", "Division"].map((opt) => (
                            <DropdownMenuItem
                                key={opt}
                                onClick={() => setFilter(opt)}
                                className="w-full text-left px-3.5 py-1.5 hover:bg-[#F7F4EE] text-[#525252] hover:text-[#1A1A1A] font-medium cursor-pointer rounded-[10px] transition-colors"
                            >
                                {opt}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Role Switcher Pill Container */}
            <div className="bg-[#F4F1EA] p-1 rounded-2xl flex items-center mb-6">
                <button
                    onClick={() => setRoleTab("farmer")}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${roleTab === "farmer"
                        ? "bg-white text-[#1A1A1A] shadow-xs"
                        : "text-[#737373] hover:text-[#1A1A1A]"
                        }`}
                >
                    Farmer
                </button>
                <button
                    onClick={() => setRoleTab("doctor")}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${roleTab === "doctor"
                        ? "bg-white text-[#1A1A1A] shadow-xs"
                        : "text-[#737373] hover:text-[#1A1A1A]"
                        }`}
                >
                    Doctor
                </button>
            </div>

            {/* Recharts Chart Canvas using Shadcn UI Container */}
            <div className="relative w-full h-56">
                {isDataEmpty && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/75 backdrop-blur-[1px] z-20 rounded-[16px]">
                        <span className="text-xs font-semibold text-[#8C857B] bg-[#F7F4EE] px-3.5 py-1.5 rounded-full border border-[#EAE5DD] shadow-xs">
                            No data available
                        </span>
                    </div>
                )}
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={paginatedData}
                            margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#C1652F" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#C1652F" stopOpacity={0.0} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                strokeDasharray="0"
                                vertical={false}
                                stroke="#F0ECE6"
                            />

                            <XAxis
                                dataKey="location"
                                axisLine={false}
                                tickLine={false}
                                interval={0}
                                tick={({ x, y, payload }) => {
                                    const isSelected = payload.value === activeLocation;
                                    return (
                                        <g transform={`translate(${x},${y})`}>
                                            {isSelected ? (
                                                <rect
                                                    x={-35}
                                                    y={8}
                                                    width={70}
                                                    height={22}
                                                    rx={11}
                                                    fill="#C1652F"
                                                />
                                            ) : null}
                                            <text
                                                x={0}
                                                y={22}
                                                textAnchor="middle"
                                                fill={isSelected ? "#FFFFFF" : "#A39E93"}
                                                fontSize={10}
                                                fontWeight={isSelected ? "bold" : "normal"}
                                            >
                                                {payload.value}
                                            </text>
                                        </g>
                                    );
                                }}
                            />

                            <YAxis
                                domain={[0, "auto"]}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#A39E93", fontSize: 11 }}
                            />

                            <Tooltip content={<ChartTooltipContent indicator="line" />} />

                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke="#C1652F"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#colorCount)"
                                activeDot={{
                                    r: 5,
                                    fill: "#C1652F",
                                    stroke: "#FFFFFF",
                                    strokeWidth: 2,
                                }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between mt-8 pt-2">
                <span className="text-xs font-semibold text-[#525252]">
                    Page {page} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                        className="p-2 rounded-xl text-[#525252] hover:bg-[#F1F1F1] hover:text-[#1A1A1A] disabled:opacity-40 transition-colors cursor-pointer"
                    >
                        <Image src={userlocationarrowlefticon} alt="Arrow Left" className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                        disabled={page === totalPages}
                        className="p-2 rounded-xl bg-[#F1F1F1] text-[#1A1A1A] disabled:opacity-40 transition-colors cursor-pointer"
                    >
                        <Image src={userlocationarrowrighticon} alt="Arrow Right" className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
