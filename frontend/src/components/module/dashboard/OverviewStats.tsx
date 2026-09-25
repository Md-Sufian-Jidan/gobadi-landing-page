"use client";


import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";

import dashboardStatIcon1 from "@/assets/dashboard-download.svg";
import dashboardStatIcon2 from "@/assets/dashboard-user.svg";
import dashboardStatIcon3 from "@/assets/dashboard-farmer.svg";
import dashboardStatIcon4 from "@/assets/dashboard-doctor.svg";
import dashboardtringleicon from "@/assets/dashboardtriangle.svg";
import dashboardredtringleicon from "@/assets/dashboardredtraingle.svg";
import { getDashboardStats } from "@/services/dashboard.service";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

type Period = "last_7_days" | "last_30_days" | "this_year";

interface StatItem {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: StaticImageData;
}

const fallbackStats: StatItem[] = [
  { id: "downloads", title: "Downloads", value: "0", change: "0%", isPositive: true, icon: dashboardStatIcon1 },
  { id: "total_user", title: "Total User", value: "0", change: "0%", isPositive: true, icon: dashboardStatIcon2 },
  { id: "farmers", title: "Farmers", value: "0", change: "0%", isPositive: true, icon: dashboardStatIcon3 },
  { id: "doctors", title: "Doctors", value: "0", change: "0%", isPositive: true, icon: dashboardStatIcon4 },
];

function mapPeriod(globalFilter: string): Period {
  if (globalFilter === "last 30 days") return "last_30_days";
  if (globalFilter === "this year") return "this_year";
  return "last_7_days";
}

export default function OverviewStats({ period = "last 7 days" }: { period?: string }) {
  const { data: result, isLoading: loading } = useQuery({
    queryKey: queryKeys.dashboardStats(mapPeriod(period)),
    queryFn: () => getDashboardStats(mapPeriod(period)),
  });

  const stats = result?.status && result.data ? [
    { id: "downloads", title: "Downloads", value: result.data.totalDownloads.toLocaleString(), change: `${result.data.userGrowth.changePercent}%`, isPositive: result.data.userGrowth.isPositive, icon: dashboardStatIcon1 },
    { id: "total_user", title: "Total User", value: result.data.totalUsers.toLocaleString(), change: `${result.data.userGrowth.changePercent}%`, isPositive: result.data.userGrowth.isPositive, icon: dashboardStatIcon2 },
    { id: "farmers", title: "Farmers", value: result.data.totalFarmers.toLocaleString(), change: `${result.data.userGrowth.changePercent}%`, isPositive: result.data.userGrowth.isPositive, icon: dashboardStatIcon3 },
    { id: "doctors", title: "Doctors", value: result.data.totalDoctors.toLocaleString(), change: `${result.data.userGrowth.changePercent}%`, isPositive: result.data.userGrowth.isPositive, icon: dashboardStatIcon4 },
  ] : fallbackStats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.08 }}
          whileHover={{ y: -3 }}
          className="bg-[#FCFCFC] border border-[#EAE5DD] shadow-xs rounded-[32px] py-4 px-6 flex flex-col justify-between relative overflow-hidden group transition-all duration-200 h-30"
        >
          <div className="flex items-start justify-between">
            <span className="text-[#1A1A1A] font-bold text-base sm:text-lg tracking-tight font-sans">
              {stat.title}
            </span>
            <div className="w-8 h-8 rounded-full bg-[#F9EFEA] flex items-center justify-center border border-[#F2DFD5] group-hover:scale-110 transition-transform duration-200 shrink-0">
              <Image src={stat.icon} alt={stat.title} width={18} height={18} />
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight font-display">
              {loading ? "0" : stat.value}
            </span>

            <div
              className={`inline-flex items-center gap-1 text-xs sm:text-sm font-bold ${stat.isPositive ? "text-[#16A34A]" : "text-[#DC2626]"}`}
            >
              {stat.isPositive ? (
                <>
                  <Image src={dashboardtringleicon} alt="Trend Indicator" className="w-2.5 h-2.5 fill-[#16A34A] stroke-none" />
                  <span>{stat.change}</span>
                </>
              ) : (
                <>
                  <Image src={dashboardredtringleicon} alt="Trend Indicator" className="w-2.5 h-2.5 fill-[#DC2626] stroke-none rotate-180" />
                  <span>{stat.change}</span>
                </>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
