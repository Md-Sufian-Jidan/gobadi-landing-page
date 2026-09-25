"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";

import dashboardStatIcon1 from "@/assets/dashboard-download.svg";
import dashboardStatIcon2 from "@/assets/dashboard-user.svg";
import dashboardStatIcon3 from "@/assets/dashboard-farmer.svg";
import dashboardStatIcon4 from "@/assets/dashboard-doctor.svg";
import dashboardtringleicon from "@/assets/dashboardtriangle.svg";
import dashboardredtringleicon from "@/assets/dashboardredtraingle.svg";
import { getUserListStats } from "@/services/dashboard.service";
import type { Period } from "@/types/api.type";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

interface StatItem {
    id: string;
    title: string;
    value: number;
    change: string;
    isPositive: boolean;
    icon: StaticImageData;
}

interface Props {
    period: Period;
}

const fallbackStats: StatItem[] = [
    { id: "farmers", title: "Farmers", value: 0, change: "0%", isPositive: true, icon: dashboardStatIcon3 },
    { id: "doctors", title: "Doctors", value: 0, change: "0%", isPositive: true, icon: dashboardStatIcon4 },
    { id: "active_animals", title: "Active Animals", value: 0, change: "0%", isPositive: true, icon: dashboardStatIcon1 },
    { id: "referral_user", title: "Referral User", value: 0, change: "0%", isPositive: true, icon: dashboardStatIcon2 },
];

export default function UserListOverviewStats({ period }: Props) {
    const { data: result, isLoading: loading } = useQuery({
        queryKey: queryKeys.userListStats(period),
        queryFn: () => getUserListStats(period),
    });

    const d = result?.status && result.data ? result.data : null;

    const stats = d ? [
        { id: "farmers", title: "Farmers", value: d.totalFarmers.value, change: `${d.totalFarmers.changePercent}%`, isPositive: d.totalFarmers.isPositive, icon: dashboardStatIcon3 },
        { id: "doctors", title: "Doctors", value: d.totalDoctors.value, change: `${d.totalDoctors.changePercent}%`, isPositive: d.totalDoctors.isPositive, icon: dashboardStatIcon4 },
        { id: "active_animals", title: "Active Animals", value: d.activeAnimals.value, change: `${d.activeAnimals.changePercent}%`, isPositive: d.activeAnimals.isPositive, icon: dashboardStatIcon1 },
        { id: "referral_user", title: "Referral User", value: d.referralUsers.value, change: `${d.referralUsers.changePercent}%`, isPositive: d.referralUsers.isPositive, icon: dashboardStatIcon2 },
    ] : fallbackStats;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((stat, index) => {
                return (
                    <motion.div
                        key={stat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.08 }}
                        whileHover={{ y: -3 }}
                        className="bg-white border border-[#EAE5DD] shadow-xs rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group transition-all duration-200"
                    >
                        {/* Top row: Title and Icon */}
                        <div className="flex items-start justify-between">
                            <span className="text-[#1A1A1A] font-bold text-base sm:text-lg tracking-tight font-display">
                                {stat.title}
                            </span>
                            <div className="w-8 h-8 rounded-full bg-[#F9EFEA] flex items-center justify-center border border-[#F2DFD5] group-hover:scale-110 transition-transform duration-200 shrink-0">
                                <Image src={stat.icon} alt={stat.title} width={18} height={18} />
                            </div>
                        </div>

                        {/* Bottom row: Large value & Trend Badge */}
                        <div className="mt-3 sm:mt-4 flex items-center gap-2">
                            <span className="text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] tracking-tight font-display">
                                {loading ? "0" : stat.value}
                            </span>

                            <div
                                className={`inline-flex items-center gap-1 text-xs sm:text-sm font-bold ${stat.isPositive
                                    ? "text-[#16A34A]"
                                    : "text-[#DC2626]"
                                    }`}
                            >
                                {
                                    stat.isPositive ? (
                                        <>
                                            <Image src={dashboardtringleicon} alt="Trend Indicator" className={`w-2.5 h-2.5 ${stat.isPositive
                                                ? "fill-[#16A34A] stroke-none"
                                                : "fill-[#DC2626] stroke-none rotate-180"
                                                }`}
                                            />
                                            <span>{stat.change}</span>
                                        </>
                                    ) :
                                        (
                                            <>
                                                <Image src={dashboardredtringleicon} alt="Trend Indicator" className={`w-2.5 h-2.5 ${stat.isPositive
                                                    ? "fill-[#16A34A] stroke-none"
                                                    : "fill-[#DC2626] stroke-none rotate-180"
                                                    }`}
                                                />
                                                <span>{stat.change}</span>
                                            </>
                                        )
                                }
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};
