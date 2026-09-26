"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import OverviewStats from "@/components/module/dashboard/OverviewStats";
import UserGrowthChart from "@/components/module/dashboard/UserGrowthChart";
import UsersOSChart from "@/components/module/dashboard/UsersOSChart";
import UserRetentionChart from "@/components/module/dashboard/UserRetentionChart";
import AiUserChart from "@/components/module/dashboard/AiUserChart";
import DoctorsAppointmentChart from "@/components/module/dashboard/DoctorsAppointmentChart";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import filtericon from "@/assets/filter-icon.svg"
import filterarrowicon from "@/assets/filter-arrow-icon.svg"
import Image from "next/image";

export default function DashboardPage() {
    const [globalFilter, setGlobalFilter] = useState("last 7 days");

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="bg-[#FCFCFC] border border-[#EAE5DD] shadow-xs rounded-[20px] sm:rounded-[28px] p-4 sm:p-5 flex flex-col gap-4"
        >
            {/* Top Header of Overview */}
            <div className="flex items-center justify-between border-b border-[#F5F2EC] pb-3">
                <h1 className="text-sm font-semibold text-primary font-display">
                    Overview
                </h1>

                {/* Time Filter Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-[10px] border border-[#ECECEC] text-xs font-semibold text-[#525252] hover:text-[#1A1A1A] transition-colors cursor-pointer outline-none shrink-0 whitespace-nowrap">
                        <Image src={filtericon} alt="Filter Icon" className="w-3.5 h-3.5 shrink-0" />
                        <span className="whitespace-nowrap">{globalFilter}</span>
                        <Image src={filterarrowicon} alt="Filter Icon" className="w-5 h-5 shrink-0" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36 bg-white border border-[#EAE5DD] shadow-lg rounded-[10px] py-1 z-20 text-xs">
                        {["last 7 days", "last 30 days", "this year"].map((opt) => (
                            <DropdownMenuItem
                                key={opt}
                                onClick={() => setGlobalFilter(opt)}
                                className="w-full text-left px-3.5 py-1.5 hover:bg-[#F7F4EE] text-[#525252] hover:text-[#1A1A1A] font-medium cursor-pointer rounded-[10px] transition-colors"
                            >
                                {opt}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Overview 4 Stat Cards */}
            <OverviewStats period={globalFilter} />

            {/* Middle Row: User Growth & User's OS Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                <div className="lg:col-span-6 flex flex-col">
                    <UserGrowthChart period={globalFilter} />
                </div>
                <div className="lg:col-span-6 flex flex-col">
                    <UsersOSChart period={globalFilter} />
                </div>
            </div>

            {/* Bottom Row: AI User, Doctor's Appointment, and User Retention Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                <div className="lg:col-span-4 xl:col-span-4 flex flex-col">
                    <AiUserChart period={globalFilter} />
                </div>
                <div className="lg:col-span-4 xl:col-span-4 flex flex-col">
                    <DoctorsAppointmentChart period={globalFilter} />
                </div>
                <div className="lg:col-span-4 xl:col-span-4 flex flex-col">
                    <UserRetentionChart period={globalFilter} />
                </div>
            </div>
        </motion.div>
    );
}
