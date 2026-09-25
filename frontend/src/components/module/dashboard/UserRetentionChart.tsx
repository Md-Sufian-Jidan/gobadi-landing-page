"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ReferenceLine,
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
import dashboardtringleicon from "@/assets/dashboardtriangle.svg";
import dashboardredtringleicon from "@/assets/dashboardredtraingle.svg";
import { getRetention, type RetentionData } from "@/services/dashboard.service";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

type Period = "last_7_days" | "last_30_days" | "this_year";

const fallbackData: RetentionData = {
  chartData: [
    { day: "Mon", value: 0 },
    { day: "Tue", value: 0 },
    { day: "Wed", value: 0 },
    { day: "Thu", value: 0 },
    { day: "Fri", value: 0 },
    { day: "Sat", value: 0 },
    { day: "Sun", value: 0 },
  ],
  summary: { total: 0, changePercent: 0, isPositive: true },
  targetLine: 0,
};

const chartConfig = {
  value: {
    label: "Users",
    color: "#C1652F",
  },
} satisfies ChartConfig;

const CustomReferenceLabel = (props: any) => {
  const { viewBox, value } = props;
  const { x, y, width } = viewBox;

  return (
    <g transform={`translate(${x + width / 2 - 28}, ${y - 12})`}>
      <rect
        width="56"
        height="18"
        rx="6"
        fill="#2A1B14"
      />
      <text
        x="28"
        y="13"
        fill="#FFFFFF"
        fontSize="9"
        fontWeight="600"
        textAnchor="middle"
      >
        {value} users
      </text>
    </g>
  );
};

function mapPeriod(filter: string): Period {
  if (filter === "last 30 days") return "last_30_days";
  if (filter === "this year") return "this_year";
  return "last_7_days";
}

export default function UserRetentionChart({ period = "last 7 days" }: { period?: string }) {
  const [timeFilter, setTimeFilter] = useState(period);

  useEffect(() => {
    setTimeFilter(period);
  }, [period]);

  const { data: result, isLoading: loading } = useQuery({
    queryKey: queryKeys.retention(mapPeriod(timeFilter)),
    queryFn: () => getRetention(mapPeriod(timeFilter)),
  });

  const data = result?.status && result.data ? result.data : fallbackData;
  const isDataEmpty = !loading && (data.summary.total === 0 || data.chartData.length === 0 || data.chartData.every(item => item.value === 0));

  return (
    <div className="w-full h-full bg-white border border-[#EAE5DD] shadow-xs rounded-[24px] p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden font-sans">
      <div className="flex items-start justify-between gap-2 mb-4">
        <div>
          <h3 className="font-bold text-base text-[#1A1A1A] font-display tracking-tight">
            User Retention
          </h3>
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
        </div>

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

      <div className="w-full h-[180px] mt-2 relative">
        {isDataEmpty && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/75 backdrop-blur-[1px] z-20 rounded-[16px]">
            <span className="text-xs font-semibold text-[#8C857B] bg-[#F7F4EE] px-3.5 py-1.5 rounded-full border border-[#EAE5DD] shadow-xs">
              No data available
            </span>
          </div>
        )}
        <ChartContainer config={chartConfig} className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.chartData}
              margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
              barCategoryGap="18%"
            >
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#A3A3A3", fontSize: 11, fontWeight: 500 }}
                dy={10}
              />
              <YAxis hide domain={[0, "auto"]} />

              <ChartTooltip
                cursor={{ fill: "rgba(0, 0, 0, 0.02)" }}
                content={<ChartTooltipContent hideLabel />}
              />

              {data.targetLine > 0 && (
                <ReferenceLine
                  y={data.targetLine}
                  stroke="#52392E"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                  label={<CustomReferenceLabel value={data.targetLine} />}
                />
              )}

              <Bar
                dataKey="value"
                radius={[12, 12, 12, 12]}
              >
                {data.chartData.map((entry, index) => {
                  const maxValue = Math.max(...data.chartData.map((d) => d.value));
                  const isHighlighted = entry.value === maxValue && maxValue > 0;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={isHighlighted ? "#C1652F" : "#FDF5F0"}
                      className="transition-colors duration-200 hover:opacity-80"
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
