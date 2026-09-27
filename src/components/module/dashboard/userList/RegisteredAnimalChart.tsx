"use client";

import { useEffect, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
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
import { getRegisteredAnimals } from "@/services/dashboard.service";
import type { Period } from "@/types/api.type";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import filtericon from "@/assets/filter-icon.svg";
import filterarrowicon from "@/assets/filter-arrow-icon.svg";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { mapPeriod, periodLabel } from "@/lib/period";

const chartConfig = {
    count: {
        label: "Registered Animals",
        color: "#C15C2B",
    },
} satisfies ChartConfig;

interface Props {
    period: Period;
}

export default function RegisteredAnimalChart({ period }: Props) {
    const [filter, setFilter] = useState(periodLabel(period));
    const requestPeriod = mapPeriod(filter);

    useEffect(() => {
        setFilter(periodLabel(period));
    }, [period]);

    const { data: result, isLoading: loading } = useQuery({
        queryKey: queryKeys.registeredAnimals(requestPeriod),
        queryFn: () => getRegisteredAnimals(requestPeriod),
    });

    const chartData = result?.status && result.data ? result.data.chartData : [];
    const summary = result?.status && result.data ? result.data.summary : { total: 0, changePercent: 0, isPositive: true };
    const isDataEmpty = !loading && summary.total === 0 && chartData.every((item) => item.count === 0);

    const maxVal = chartData.length > 0 ? Math.max(...chartData.map((d) => d.count)) : 0;
    const yMax = maxVal > 400 ? Math.ceil(maxVal / 100) * 100 : 400;
    const yTicks = [0, yMax * 0.25, yMax * 0.5, yMax * 0.75, yMax].map(Math.round);

    return (
        <div className="w-full h-80 rounded-[24px] border border-[#EAE5DD] bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between relative overflow-hidden font-sans">
            {/* Header Section */}
            <div className="flex items-start justify-between">
                <h3 className="text-base sm:text-lg font-bold leading-tight text-[#1A1A1A] font-display">
                    Registered
                    <br />
                    Animal
                </h3>

                {/* Dropdown Filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:py-2 rounded-[10px] border border-[#E5E0D8] text-xs font-semibold text-[#525252] hover:text-[#1A1A1A] transition-colors cursor-pointer outline-none shrink-0">
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
            <div className="mt-1 flex items-center gap-2">
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
            <div className="w-full h-52 mt-2 relative">
                {isDataEmpty && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/75 backdrop-blur-[1px] z-20 rounded-[16px]">
                        <span className="text-xs font-semibold text-[#8C857B] bg-[#F7F4EE] px-3.5 py-1.5 rounded-full border border-[#EAE5DD] shadow-xs">
                            No data available
                        </span>
                    </div>
                )}
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 12, right: 8, left: -22, bottom: 0 }}
                            barSize={7}
                        >
                            <CartesianGrid
                                vertical={false}
                                stroke="#F0ECE6"
                                strokeDasharray="0"
                            />

                            <YAxis
                                domain={[0, yMax]}
                                ticks={yTicks}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#A39E93", fontSize: 11, fontWeight: 500 }}
                            />

                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tickMargin={10}
                                tick={{ fill: "#A39E93", fontSize: 11, fontWeight: 500 }}
                            />

                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />

                            <Bar
                                dataKey="count"
                                fill="#C15C2B"
                                radius={[6, 6, 6, 6]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>
        </div>
    );
}
