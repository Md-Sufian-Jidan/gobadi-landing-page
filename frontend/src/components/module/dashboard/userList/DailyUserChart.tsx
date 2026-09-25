"use client";

import { useEffect, useState } from "react";
import {
    Bar,
    BarChart,
    Cell,
    ReferenceLine,
    XAxis,
    YAxis,
} from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import dashboardtringleicon from "@/assets/dashboardtriangle.svg";
import dashboardredtringleicon from "@/assets/dashboardredtraingle.svg";
import { getDailyUsers } from "@/services/dashboard.service";
import type { Period } from "@/types/api.type";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import filtericon from "@/assets/filter-icon.svg"
import filterarrowicon from "@/assets/filter-arrow-icon.svg"

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

const chartConfig = {
    users: {
        label: "Users",
        color: "#C15C2B",
    },
} satisfies ChartConfig;

interface Props {
    period: Period;
}

export default function DailyUserChart({ period }: Props) {
    const [filter, setFilter] = useState("last 7 days");

    const { data: result, isLoading: loading } = useQuery({
        queryKey: queryKeys.dailyUsers(filter),
        queryFn: () => getDailyUsers(filter as Period),
    });

    const chartData = result?.status && result.data ? result.data.chartData : [];
    const summary = result?.status && result.data ? result.data.summary : { total: 0, changePercent: 0, isPositive: true };
    const isDataEmpty = !loading && (summary.total === 0 || chartData.length === 0 || chartData.every((item) => item.users === 0));

    const maxVal = chartData.length > 0 ? Math.max(...chartData.map((d) => d.users)) : 0;
    const referenceLine = Math.round(maxVal * 0.6);

    return (
        <div className="w-full h-80 rounded-[24px] border border-[#EAE5DD] bg-white p-3 shadow-xs flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#1A1A1A] font-display">Daily User</h3>

                {/* Dropdown Filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1.5 sm:gap-2 px-3  py-2 rounded-[10px] border border-[#E5E0D8] text-xs font-semibold text-[#525252] hover:text-[#1A1A1A] transition-colors cursor-pointer outline-none">
                        <Image src={filtericon} alt="Filter Icon" className="w-3.5 h-3.5" />
                        <span>{filter}</span>
                        <Image src={filterarrowicon} alt="Filter Icon" className="w-5 h-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36 bg-white border border-[#EAE5DD] shadow-lg rounded-[10px] py-1 z-20 text-xs">
                        {["last 7 days", "last 30 days", "this year"].map((opt) => (
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

            {/* Metrics Row */}
            <div className="mt-2 flex items-center gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1A1A1A] font-display">
                    {loading ? "0" : summary.total}
                </span>
                <div className={`flex items-center gap-1 text-xs sm:text-sm font-bold ${summary.isPositive ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
                    {summary.isPositive ? (
                        <>
                            <Image src={dashboardtringleicon} alt="Trend Indicator" className="w-2.5 h-2.5 fill-[#16A34A] stroke-none" />
                            <span>{summary.changePercent}%</span>
                        </>
                    ) : (
                        <>
                            <Image src={dashboardredtringleicon} alt="Trend Indicator" className="w-2.5 h-2.5 fill-[#DC2626] stroke-none rotate-180" />
                            <span>{summary.changePercent}%</span>
                        </>
                    )}
                </div>
            </div>

            {/* Chart Section */}
            <div className="w-full mt-4 h-56 relative">
                {isDataEmpty && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/75 backdrop-blur-[1px] z-20 rounded-[16px]">
                        <span className="text-xs font-semibold text-[#8C857B] bg-[#F7F4EE] px-3.5 py-1.5 rounded-full border border-[#EAE5DD] shadow-xs">
                            No data available
                        </span>
                    </div>
                )}
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
                        barCategoryGap="20%"
                    >
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={12}
                            className="text-xs font-medium fill-[#A39E93]"
                        />
                        <YAxis hide domain={[0, maxVal * 1.15]} />

                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />

                        <ReferenceLine
                            y={referenceLine}
                            stroke="#8C7063"
                            strokeDasharray="3 3"
                            strokeWidth={1.5}
                            label={({ viewBox }) => {
                                const { x, y } = viewBox;
                                return (
                                    <g transform={`translate(${x + 4}, ${y - 12})`}>
                                        <rect
                                            width={68}
                                            height={22}
                                            rx={6}
                                            fill="#3B2319"
                                        />
                                        <text
                                            x={34}
                                            y={14}
                                            textAnchor="middle"
                                            fill="#FFFFFF"
                                            fontSize={10}
                                            fontWeight={600}
                                        >
                                            {referenceLine} users
                                        </text>
                                    </g>
                                );
                            }}
                        />

                        <Bar dataKey="users" radius={[12, 12, 12, 12]}>
                            {chartData.map((entry, index) => {
                                const isMax = entry.users === maxVal;
                                return (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={isMax ? "#C15C2B" : "#F7EFEA"}
                                    />
                                );
                            })}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </div>
        </div>
    );
}
