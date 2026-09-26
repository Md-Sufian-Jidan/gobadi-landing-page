"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceArea,
  DotProps,
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
import { getUserOS, type UserOSData } from "@/services/dashboard.service";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

type Period = "last_7_days" | "last_30_days" | "this_year";

const fallbackData: UserOSData = {
  android: [
    { date: "01", value: 0 },
    { date: "02", value: 0 },
    { date: "03", value: 0 },
    { date: "04", value: 0 },
    { date: "05", value: 0 },
    { date: "06", value: 0 },
    { date: "07", value: 0 },
  ],
  ios: [
    { date: "01", value: 0 },
    { date: "02", value: 0 },
    { date: "03", value: 0 },
    { date: "04", value: 0 },
    { date: "05", value: 0 },
    { date: "06", value: 0 },
    { date: "07", value: 0 },
  ],
};

const chartConfig = {
  value: {
    label: "Users",
    color: "#C1652F",
  },
} satisfies ChartConfig;

const CustomXAxisTick = (props: any) => {
  const { x, y, payload } = props;
  const isHighlight = payload.value === "08";

  if (isHighlight) {
    return (
      <g transform={`translate(${x - 12}, ${y + 4})`}>
        <rect width="24" height="18" rx="9" fill="#C1652F" />
        <text
          x="12"
          y="12"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="10"
          fontWeight="bold"
        >
          {payload.value}
        </text>
      </g>
    );
  }

  return (
    <text
      x={x}
      y={y + 16}
      textAnchor="middle"
      fill="#A3A3A3"
      fontSize="10"
      fontWeight="500"
    >
      {payload.value}
    </text>
  );
};

const CustomDot = (props: DotProps & { payload?: { date: string } }) => {
  const { cx, cy, payload } = props;

  if (payload?.date === "08" && cx !== undefined && cy !== undefined) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill="#C1652F"
        stroke="#FFFFFF"
        strokeWidth={2}
      />
    );
  }

  return null;
};

function mapPeriod(filter: string): Period {
  if (filter === "last 30 days") return "last_30_days";
  if (filter === "this year") return "this_year";
  return "last_7_days";
}

export default function UsersOSChart({ period = "last month" }: { period?: string }) {
  const [selectedOS, setSelectedOS] = useState<"android" | "ios">("android");
  const [timeFilter, setTimeFilter] = useState(period);

  useEffect(() => {
    setTimeFilter(period);
  }, [period]);

  const { data: result, isLoading: loading } = useQuery({
    queryKey: queryKeys.userOS(mapPeriod(timeFilter)),
    queryFn: () => getUserOS(mapPeriod(timeFilter)),
  });

  const data = result?.status && result.data ? result.data : fallbackData;
  const activeData = selectedOS === "android" ? data.android : data.ios;
  const isDataEmpty = !loading && (activeData.length === 0 || activeData.every((item) => item.value === 0));

  return (
    <div className="w-full h-full bg-white border border-[#EAE5DD] shadow-xs rounded-[24px] p-5 flex flex-col justify-between relative overflow-hidden font-sans">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-bold text-lg text-[#1A1A1A] font-display tracking-tight">
          User's OS
        </h3>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-[10px] border border-[#ECECEC] text-xs font-semibold text-[#121212] hover:text-[#1A1A1A] transition-colors cursor-pointer outline-none shrink-0 whitespace-nowrap">
            <Image src={filtericon} alt="Filter Icon" className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">{timeFilter}</span>
            <Image src={filterarrowicon} alt="Filter Icon" className="w-5 h-5 shrink-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36 bg-white border border-[#ECECEC] shadow-lg rounded-[10px] py-1 z-20 text-xs">
            {["last month", "last 6 months", "last year"].map((opt) => (
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

      <div className="mt-4 bg-[#F1F1F1] p-1 rounded-[10px] flex items-center gap-1 border border-[#ECECEC]">
        <button
          onClick={() => setSelectedOS("android")}
          className={`flex-1 py-1.5 text-xs rounded-[10px] transition-all duration-200 cursor-pointer ${selectedOS === "android"
            ? "bg-white text-[#121212] shadow-xs"
            : "text-[#121212] hover:text-[#1A1A1A]"
            }`}
        >
          Android
        </button>
        <button
          onClick={() => setSelectedOS("ios")}
          className={`flex-1 py-1.5 text-xs rounded-[10px] transition-all duration-200 cursor-pointer ${selectedOS === "ios"
            ? "bg-white text-[#121212] shadow-xs"
            : "text-[#121212] hover:text-[#1A1A1A]"
            }`}
        >
          iOS
        </button>
      </div>

      <div className="w-full h-[180px] mt-3 relative">
        {isDataEmpty && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/75 backdrop-blur-[1px] z-20 rounded-[16px]">
            <span className="text-xs font-semibold text-[#8C857B] bg-[#F7F4EE] px-3.5 py-1.5 rounded-full border border-[#EAE5DD] shadow-xs">
              No data available
            </span>
          </div>
        )}
        <ChartContainer config={chartConfig} className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={activeData}
              margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
            >
              <CartesianGrid
                vertical={false}
                stroke="#F2EFEA"
                strokeWidth={1}
              />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={<CustomXAxisTick />}
                padding={{ left: 10, right: 10 }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                domain={[0, "auto"]}
                tick={{ fill: "#A3A3A3", fontSize: 10, fontWeight: 500 }}
              />

              <ChartTooltip
                cursor={{ stroke: "rgba(0, 0, 0, 0.05)" }}
                content={<ChartTooltipContent hideLabel />}
              />

              <ReferenceArea
                x1="07"
                x2="08"
                fill="#FBE9DF"
                fillOpacity={0.6}
              />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#C1652F"
                strokeWidth={2.5}
                dot={<CustomDot />}
                activeDot={{
                  r: 6,
                  fill: "#C1652F",
                  stroke: "#FFFFFF",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
