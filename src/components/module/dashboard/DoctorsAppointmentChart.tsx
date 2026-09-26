"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
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
import { getAppointments, type AppointmentData } from "@/services/dashboard.service";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

type Period = "last_7_days" | "last_30_days" | "this_year";

const fallbackData: AppointmentData = {
  chartData: [
    { day: "Mon", bar1: 0, bar2: 0 },
    { day: "Tue", bar1: 0, bar2: 0 },
    { day: "Wed", bar1: 0, bar2: 0 },
    { day: "Thu", bar1: 0, bar2: 0 },
    { day: "Fri", bar1: 0, bar2: 0 },
    { day: "Sat", bar1: 0, bar2: 0 },
    { day: "Sun", bar1: 0, bar2: 0 },
  ],
};

const chartConfig = {
  bar1: {
    label: "Normal",
    color: "#EACFBF",
  },
  bar2: {
    label: "Urgent",
    color: "#C15C2B",
  },
} satisfies ChartConfig;

const CustomXAxisTick = (props: any) => {
  const { x, y, payload } = props;
  const isThu = payload.value === "Thu";

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={14}
        textAnchor="middle"
        fill={isThu ? "#1A1A1A" : "#A3A3A3"}
        fontSize={12}
        fontWeight={isThu ? 700 : 500}
      >
        {payload.value}
      </text>
      {isThu && (
        <circle
          cx={0}
          cy={28}
          r={4}
          fill="#C15C2B"
        />
      )}
    </g>
  );
};

function mapPeriod(filter: string): Period {
  if (filter === "last 30 days") return "last_30_days";
  if (filter === "this year") return "this_year";
  return "last_7_days";
}

export default function DoctorsAppointmentChart({ period = "last 7 days" }: { period?: string }) {
  const [selectedOS, setSelectedOS] = useState<"android" | "ios">("android");
  const [timeFilter, setTimeFilter] = useState(period);

  useEffect(() => {
    setTimeFilter(period);
  }, [period]);

  const { data: result, isLoading: loading } = useQuery({
    queryKey: queryKeys.appointments(mapPeriod(timeFilter)),
    queryFn: () => getAppointments(mapPeriod(timeFilter)),
  });

  const data = result?.status && result.data ? result.data : fallbackData;
  const isDataEmpty = !loading && (data.chartData.length === 0 || data.chartData.every(item => item.bar1 === 0 && item.bar2 === 0));

  return (
    <div className="w-full h-full bg-white border border-[#EAE5DD] shadow-xs rounded-[24px] p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden font-sans">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="font-bold text-base sm:text-lg text-[#1A1A1A] font-display tracking-tight">
          Doctor's Appointment
        </h3>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-[10px] border border-[#ECECEC] text-xs font-semibold text-[#525252] hover:text-[#1A1A1A] transition-colors cursor-pointer outline-none shrink-0 whitespace-nowrap">
            <Image src={filtericon} alt="Filter Icon" className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">{timeFilter}</span>
            <Image src={filterarrowicon} alt="Filter Icon" className="w-5 h-5 shrink-0" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36 bg-white border border-[#EAE5DD] shadow-lg rounded-[10px] py-1 z-20 text-xs">
            {["last 7 days", "last 30 days", "this year"].map((opt) => (
              <DropdownMenuItem
                key={opt}
                onClick={() => setTimeFilter(opt)}
                className="w-full text-left px-3.5 py-1.5 hover:bg-[#F7F4EE] text-[#525252] hover:text-[#1A1A1A] font-medium cursor-pointer rounded-[10px] transition-colors"
              >
                {opt}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="w-full mb-4 bg-[#F1F1F1] p-1 rounded-[10px] flex items-center gap-1 border border-[#ECECEC]">
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

      <div className="w-full h-[180px] relative">
        {isDataEmpty && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/75 backdrop-blur-[1px] z-20 rounded-[16px]">
            <span className="text-xs font-semibold text-[#8C857B] bg-[#F7F4EE] px-3.5 py-1.5 rounded-full border border-[#EAE5DD] shadow-xs">
              No data available
            </span>
          </div>
        )}
        <div
          className="absolute pointer-events-none rounded-2xl bg-[#FDF5F0] border border-[#F5E6DC]/60 z-0"
          style={{
            top: "0px",
            bottom: "30px",
            left: "48%",
            width: "14%",
          }}
        />

        <ChartContainer config={chartConfig} className="w-full h-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.chartData}
              margin={{ top: 10, right: 10, left: -22, bottom: 10 }}
              barGap={4}
              barCategoryGap="16%"
            >
              <CartesianGrid stroke="#F3F0EC" vertical={false} />
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
                tick={<CustomXAxisTick />}
              />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />

              <Bar
                dataKey="bar1"
                fill="#EACFBF"
                radius={[6, 6, 6, 6]}
              />

              <Bar
                dataKey="bar2"
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
