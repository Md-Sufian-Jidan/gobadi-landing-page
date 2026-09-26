"use client";

import React, { useEffect, useState } from "react";
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
import { getAiUsers, type AiUserData } from "@/services/dashboard.service";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

type Period = "last_7_days" | "last_30_days" | "this_year";

const fallbackData: AiUserData = {
  totalAiUsers: 0,
  changePercent: 0,
  isPositive: true,
  gaugePercentage: 0,
};

function mapPeriod(filter: string): Period {
  if (filter === "last 30 days") return "last_30_days";
  if (filter === "this year") return "this_year";
  return "last_7_days";
}

export default function AiUserChart({ period = "last 7 days" }: { period?: string }) {
  const [timeFilter, setTimeFilter] = useState(period);

  useEffect(() => {
    setTimeFilter(period);
  }, [period]);

  const { data: result, isLoading: loading } = useQuery({
    queryKey: queryKeys.aiUsers(mapPeriod(timeFilter)),
    queryFn: () => getAiUsers(mapPeriod(timeFilter)),
  });

  const data = result?.status && result.data ? result.data : fallbackData;
  const isDataEmpty = !loading && data.totalAiUsers === 0;

  useEffect(() => {
    setTimeFilter(period);
  }, [period]);

  // SVG Gauge Calculations
  const cx = 130;
  const cy = 130;
  const radius = 84;
  const innerRadius = 70;

  const startAngle = 140;
  const endAngle = 400;
  const totalSweep = endAngle - startAngle;

  const progressPct = data.gaugePercentage / 100;
  const currentAngle = startAngle + totalSweep * progressPct;

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    r: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (
    x: number,
    y: number,
    r: number,
    startDeg: number,
    endDeg: number
  ) => {
    const start = polarToCartesian(x, y, r, startDeg);
    const end = polarToCartesian(x, y, r, endDeg);
    const largeArcFlag = endDeg - startDeg <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y,
      "A", r, r, 0, largeArcFlag, 1, end.x, end.y,
    ].join(" ");
  };

  const backgroundTrackPath = describeArc(cx, cy, radius, startAngle, endAngle);
  const activeTrackPath = describeArc(cx, cy, radius, startAngle, currentAngle);
  const innerDottedPath = describeArc(cx, cy, innerRadius, startAngle + 5, endAngle - 5);
  const dotPos = polarToCartesian(cx, cy, radius, currentAngle);

  return (
    <div className="w-full h-full bg-white border border-[#EAE5DD] shadow-xs rounded-[24px] p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden font-sans">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-[#1A1A1A] font-display tracking-tight">
            AI User
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1A1A1A] font-display">
              {loading ? "0" : data.totalAiUsers.toLocaleString()}
            </span>
            <div className={`flex items-center gap-1 text-xs sm:text-sm font-bold ${data.isPositive ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
              {data.isPositive ? (
                <>
                  <Image src={dashboardtringleicon} alt="Trend Indicator" className="w-2.5 h-2.5 fill-[#16A34A] stroke-none" />
                  <span>{data.changePercent}%</span>
                </>
              ) : (
                <>
                  <Image src={dashboardredtringleicon} alt="Trend Indicator" className="w-2.5 h-2.5 fill-[#DC2626] stroke-none rotate-180" />
                  <span>{data.changePercent}%</span>
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

      <div className="relative w-full flex items-center justify-center my-2 sm:my-3">
        {isDataEmpty && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/75 backdrop-blur-[1px] z-20 rounded-[16px]">
            <span className="text-xs font-semibold text-[#8C857B] bg-[#F7F4EE] px-3.5 py-1.5 rounded-full border border-[#EAE5DD] shadow-xs">
              No data available
            </span>
          </div>
        )}
        <svg
          viewBox="0 0 260 220"
          className="w-48 h-40 sm:w-56 sm:h-44 max-w-full drop-shadow-xs"
        >
          <defs>
            <linearGradient id="aiGaugeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C15C2B" />
              <stop offset="50%" stopColor="#D97A48" />
              <stop offset="100%" stopColor="#E2A17E" />
            </linearGradient>
          </defs>

          <path
            d={backgroundTrackPath}
            fill="none"
            stroke="#F7F1EB"
            strokeWidth="22"
            strokeLinecap="round"
          />

          <path
            d={innerDottedPath}
            fill="none"
            stroke="#D9CBBF"
            strokeWidth="1.5"
            strokeDasharray="2, 5"
            strokeLinecap="round"
          />

          <path
            d={activeTrackPath}
            fill="none"
            stroke="url(#aiGaugeGradient)"
            strokeWidth="22"
            strokeLinecap="round"
          />

          <circle
            cx={dotPos.x}
            cy={dotPos.y}
            r="3.5"
            fill="#FFFFFF"
          />

          <text
            x={cx}
            y={cy - 10}
            textAnchor="middle"
            className="text-xs font-semibold fill-[#525252] font-sans"
          >
            Total AI User
          </text>
          <text
            x={cx}
            y={cy + 22}
            textAnchor="middle"
            className="text-3xl font-extrabold fill-[#C15C2B] font-display"
          >
            {loading ? "---" : data.totalAiUsers.toLocaleString()}
          </text>
        </svg>
      </div>
    </div>
  );
}
