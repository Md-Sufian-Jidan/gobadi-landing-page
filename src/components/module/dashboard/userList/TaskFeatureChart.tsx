"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Customized,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import dashboardtringleicon from "@/assets/dashboardtriangle.svg";
import dashboardredtringleicon from "@/assets/dashboardredtraingle.svg";
import { getTaskFeatureUsers } from "@/services/dashboard.service";
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
  value: {
    label: "Users",
    color: "#C15C2B",
  },
} satisfies ChartConfig;

// Custom X-Axis Tick for bolding the highlighted month
const CustomXAxisTick = (props: any) => {
  const { x, y, payload, highlightedMonth } = props;
  const isHighlighted = payload?.value === highlightedMonth;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={12}
        textAnchor="middle"
        fill={isHighlighted ? "#1A1A1A" : "#A39E93"}
        fontSize={11}
        fontWeight={isHighlighted ? 800 : 500}
      >
        {payload?.value}
      </text>
    </g>
  );
};

// Custom Dot to render the highlighted ring
const CustomDot = (props: any) => {
  const { cx, cy, payload, highlightedMonth } = props;
  if (payload?.month === highlightedMonth) {
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={8}
          fill="#C15C2B"
        />
        <circle
          cx={cx}
          cy={cy}
          r={4}
          fill="#FFFFFF"
        />
      </g>
    );
  }
  return null;
};

interface Props {
  period: Period;
}

export default function TaskFeatureChart({ period }: Props) {
  const [timeFilter, setTimeFilter] = useState(periodLabel(period));
  const requestPeriod = mapPeriod(timeFilter);

  useEffect(() => {
    setTimeFilter(periodLabel(period));
  }, [period]);

  const { data: result, isLoading: loading } = useQuery({
    queryKey: queryKeys.taskFeatureUsers(requestPeriod),
    queryFn: () => getTaskFeatureUsers(requestPeriod),
  });

  const chartData = result?.status && result.data ? result.data.chartData : [];
  const summary = result?.status && result.data ? result.data.summary : { total: 0, changePercent: 0, isPositive: true };
  const isDataEmpty = !loading && (summary.total === 0 && chartData.every((item) => item.value === 0));

  // Find the month/day with the highest value to highlight, fallback to middle item
  const highlightedMonth = chartData.length > 0
    ? (() => {
        const maxItem = chartData.reduce((max, item) => (item.value > max.value ? item : max), chartData[0]);
        if (maxItem && maxItem.value > 0) return maxItem.month;
        return chartData[Math.floor(chartData.length / 2)]?.month || "";
      })()
    : "";

  const maxVal = chartData.length > 0 ? Math.max(...chartData.map((d) => d.value)) : 0;
  const yDomainMax = maxVal > 0 ? maxVal * 1.3 : 100;

  // Custom Highlight Column Band component
  const HighlightBand = (props: any) => {
    const { formattedGraphicalItems, height } = props;
    const series = formattedGraphicalItems?.[0];
    const points = series?.props?.points || [];
    const targetPoint = points.find((p: any) => p.payload?.month === highlightedMonth);

    if (!targetPoint || typeof targetPoint.x !== "number") return null;

    const bandWidth = 36;
    return (
      <rect
        x={targetPoint.x - bandWidth / 2}
        y={4}
        width={bandWidth}
        height={Math.max(0, (height || 200) - 28)}
        rx={8}
        fill="url(#highlightBandGradient)"
        pointerEvents="none"
      />
    );
  };

  return (
    <div className="w-full h-80 bg-white border border-[#EAE5DD] shadow-xs rounded-[24px] p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <h3 className="text-base sm:text-lg font-bold leading-tight text-[#1A1A1A] font-display">
          Task Feature User
        </h3>

        {/* Dropdown Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:py-2 rounded-[10px] border border-[#E5E0D8] text-xs font-semibold text-[#525252] hover:text-[#1A1A1A] transition-colors cursor-pointer outline-none shrink-0">
            <Image src={filtericon} alt="Filter Icon" className="w-3.5 h-3.5" />
            <span>{timeFilter}</span>
            <Image src={filterarrowicon} alt="Filter Icon" className="w-5 h-5" />
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
      <div className="w-full h-52 relative mt-2">
        {isDataEmpty && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/75 backdrop-blur-[1px] z-20 rounded-[16px]">
            <span className="text-xs font-semibold text-[#8C857B] bg-[#F7F4EE] px-3.5 py-1.5 rounded-full border border-[#EAE5DD] shadow-xs">
              No data available
            </span>
          </div>
        )}

        <ChartContainer config={chartConfig} className="w-full h-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 15, right: 12, left: 12, bottom: 0 }}
            >
              <defs>
                <linearGradient id="taskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C15C2B" stopOpacity={0.16} />
                  <stop offset="65%" stopColor="#C15C2B" stopOpacity={0.03} />
                  <stop offset="100%" stopColor="#C15C2B" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="highlightBandGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C15C2B" stopOpacity={0.14} />
                  <stop offset="65%" stopColor="#C15C2B" stopOpacity={0.06} />
                  <stop offset="100%" stopColor="#C15C2B" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <YAxis hide domain={[0, yDomainMax]} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={<CustomXAxisTick highlightedMonth={highlightedMonth} />}
              />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />

              {highlightedMonth && <Customized component={HighlightBand} />}

              <Area
                type="natural"
                dataKey="value"
                stroke="#C15C2B"
                strokeWidth={2.5}
                fill="url(#taskGradient)"
                dot={<CustomDot highlightedMonth={highlightedMonth} />}
                activeDot={{ r: 5, fill: "#C15C2B" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
