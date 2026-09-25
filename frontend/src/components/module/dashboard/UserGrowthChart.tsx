"use client";

import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import filtericon from "@/assets/filter-icon.svg"
import filterarrowicon from "@/assets/filter-arrow-icon.svg"
import Image from "next/image";
import dashboardtringleicon from "@/assets/dashboardtriangle.svg";
import dashboardredtringleicon from "@/assets/dashboardredtraingle.svg";
import { getUserGrowth, type UserGrowthData } from "@/services/dashboard.service";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

type Period = "last_7_days" | "last_30_days" | "this_year";

const fallbackData: UserGrowthData = {
  chartData: [
    { day: "Sat", value: 0 },
    { day: "Sun", value: 0 },
    { day: "Mon", value: 0 },
    { day: "Tue", value: 0 },
    { day: "Wed", value: 0 },
    { day: "Thu", value: 0 },
    { day: "Fri", value: 0 },
  ],
  summary: { total: 0, changePercent: 0, isPositive: true },
};

const chartConfig = {
  value: {
    label: "Users",
    color: "#C15C2B",
  },
} satisfies ChartConfig;

function mapPeriod(filter: string): Period {
  if (filter === "last 30 days") return "last_30_days";
  if (filter === "this year") return "this_year";
  return "last_7_days";
}

export default function UserGrowthChart({ period = "last 7 days" }: { period?: string }) {
  const [timeFilter, setTimeFilter] = useState(period);

  useEffect(() => {
    setTimeFilter(period);
  }, [period]);

  const { data: result, isLoading: loading } = useQuery({
    queryKey: queryKeys.userGrowth(mapPeriod(timeFilter)),
    queryFn: () => getUserGrowth(mapPeriod(timeFilter)),
  });

  const data = result?.status && result.data ? result.data : fallbackData;
  const isDataEmpty = !loading && (data.summary.total === 0 || data.chartData.length === 0 || data.chartData.every(item => item.value === 0));

  return (
    <div className="w-full h-full rounded-[24px] border border-[#EAE5DD] bg-[#FCFCFC] p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#1A1A1A] font-display">
          User Growth
        </h3>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-[10px] border border-[#ECECEC] text-xs font-semibold text-[#121212] hover:text-[#1A1A1A] transition-colors cursor-pointer outline-none shrink-0 whitespace-nowrap">
            <Image src={filtericon} alt="Filter Icon" className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">{timeFilter}</span>
            <Image src={filterarrowicon} alt="Filter Icon" className="w-5 h-5 shrink-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36 bg-white border border-[#ECECEC] shadow-lg rounded-[10px] py-1 z-20 text-xs">
            {["last 7 days", "last 30 days", "this year"].map((opt) => (
              <DropdownMenuItem
                key={opt}
                onClick={() => setTimeFilter(opt)}
                className="w-full text-left px-3 py-2 hover:bg-[#F7F4EE] text-[#525252] hover:text-[#1A1A1A] font-medium cursor-pointer rounded-[10px] transition-colors"
              >
                {opt}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1A1A1A] font-display">
          {loading ? "0" : data.summary.total.toLocaleString()}
        </span>
        <div className={`flex items-center gap-1 text-xs sm:text-sm font-bold ${data.summary.isPositive ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
          {data.summary.isPositive ? (
            <>
              <Image src={dashboardtringleicon} alt="Trend Indicator" className="w-2.5 h-2.5 fill-[#16A34A] stroke-none" />
              <span>{data.summary.changePercent}%</span>
            </>
          ) : (
            <>
              <Image src={dashboardredtringleicon} alt="Trend Indicator" className="w-2.5 h-2.5 fill-[#DC2626] stroke-none rotate-180" />
              <span>{data.summary.changePercent}%</span>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 w-full relative">
        {isDataEmpty && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/75 backdrop-blur-[1px] z-20 rounded-[16px]">
            <span className="text-xs font-semibold text-[#8C857B] bg-[#F7F4EE] px-3.5 py-1.5 rounded-full border border-[#EAE5DD] shadow-xs">
              No data available
            </span>
          </div>
        )}
        <ChartContainer config={chartConfig} className="h-[180px] w-full">
          <AreaChart
            data={data.chartData}
            margin={{ top: 10, right: 10, left: -24, bottom: 0 }}
          >
            <defs>
              <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C15C2B" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#C15C2B" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#F3F3F3" strokeDasharray="0" />

            <YAxis
              domain={[0, "auto"]}
              axisLine={false}
              tickLine={false}
              className="text-[11px] font-medium fill-[#A39E93]"
            />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tickMargin={12}
              className="text-[12px] font-medium fill-[#A39E93]"
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Area
              type="linear"
              dataKey="value"
              stroke="#C15C2B"
              strokeWidth={1.5}
              strokeDasharray="2 2"
              fill="url(#growthGradient)"
              activeDot={{ r: 4, fill: "#C15C2B" }}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
