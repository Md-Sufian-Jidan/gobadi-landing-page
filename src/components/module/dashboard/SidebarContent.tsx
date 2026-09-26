"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronDown,
    ChevronRight,
    Settings,
} from "lucide-react";
import logoSquare from "@/assets/gobaadi-logo-square.svg";
import dashboardMenuIcon1 from "@/assets/dashboard-menu-icon-1.svg";
import dashboardMenuIcon2 from "@/assets/dashboard-menu-icon-2.svg";
import dashboardMenuIcon3 from "@/assets/dashboard-menu-icon-3.svg";
import dashboardMenuIcon4 from "@/assets/dashboard-menu-icon-4.svg";
import dashboardMenuIcon5 from "@/assets/dashboardanimallist.svg";
import dashboardsidebaricon from "@/assets/dashboardsidebaricon.svg";
import dashboardsettingsicon from "@/assets/dashboardsettingsicon.svg";
import dashboarddropdownicon from "@/assets/dashboarddropdownicon.svg";

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getAllUsers } from "@/services/user.service";
import { getFarmers, getDoctors } from "@/services/dashboard.service";

interface SidebarProps {
    collapsed?: boolean;
    onToggleCollapse?: () => void;
    onItemClick?: () => void;
}

export default function SidebarContent({ collapsed = false, onToggleCollapse, onItemClick }: SidebarProps) {
    const pathname = usePathname();
    const [userListOpen, setUserListOpen] = useState(false);

    const { data: usersData } = useQuery({
        queryKey: queryKeys.users(1),
        queryFn: () => getAllUsers(1, 1),
    });
    const totalUsers = usersData?.data?.pagination?.total || 0;

    const { data: farmersData } = useQuery({
        queryKey: queryKeys.farmers(1),
        queryFn: () => getFarmers(1, 1),
    });
    const totalFarmers = farmersData?.data?.pagination?.total || 0;

    const { data: doctorsData } = useQuery({
        queryKey: queryKeys.doctors(1),
        queryFn: () => getDoctors(1, 1),
    });
    const totalDoctors = doctorsData?.data?.pagination?.total || 0;

    const navItems = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: dashboardMenuIcon1,
            active: pathname === "/dashboard" || pathname === "/dashboard/",
        },
        {
            name: "User List",
            href: "/dashboard/user-list",
            icon: dashboardMenuIcon2,
            isDropdown: true,
            count: totalUsers.toLocaleString(),
            isOpen: userListOpen,
            onToggle: () => setUserListOpen(!userListOpen),
            active: pathname === "/dashboard/user-list",
            subItems: [
                {
                    name: "Farmers",
                    href: "/dashboard/user-list/farmers",
                    count: totalFarmers.toLocaleString(),
                    active: pathname === "/dashboard/user-list/farmers" || pathname.startsWith("/dashboard/user-list/farmers"),
                },
                {
                    name: "Doctors",
                    href: "/dashboard/user-list/doctors",
                    count: totalDoctors.toLocaleString(),
                    active: pathname === "/dashboard/user-list/doctors" || pathname.startsWith("/dashboard/user-list/doctors"),
                },
            ],
        },
        {
            name: "Animal List",
            href: "/dashboard/animal-list",
            icon: dashboardMenuIcon5,
            active: pathname === "/dashboard/animal-list",
        },
        {
            name: "Push Notifications",
            href: "/dashboard/notifications",
            icon: dashboardMenuIcon3,
            active: pathname === "/dashboard/notifications",
        },
        {
            name: "Admin Access",
            href: "/dashboard/admin-access",
            icon: dashboardMenuIcon4,
            active: pathname === "/dashboard/admin-access",
        },
    ];

    return (
        <div className="flex flex-col h-full select-none overflow-hidden bg-white">
            {/* Header with logo & toggle */}
            <div className="p-4 flex items-center justify-between border-b border-[#F5F2EC]">
                <Link
                    href="/"
                    onClick={onItemClick}
                    className="flex items-center gap-3 overflow-hidden"
                >
                    <div className="relative w-10 h-10 rounded-[10px] overflow-hidden flex-shrink-0 bg-[#FBE6DA] flex items-center justify-center border border-[#E8DCC4]">
                        <Image
                            src={logoSquare}
                            alt="Gobaadi Logo"
                            width={40}
                            height={40}
                            className="object-cover"
                        />
                    </div>
                </Link>

                {onToggleCollapse && (
                    <Button
                        variant="ghost"
                        onClick={onToggleCollapse}
                        className="hidden lg:block p-2 rounded-xl text-[#737373] hover:text-[#1A1A1A] hover:bg-transparent transition-colors focus:outline-none cursor-pointer"
                        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {collapsed ? (
                            <Image src={dashboardsidebaricon} alt="Dashboard menu icon" width={20} height={20} />
                        ) : (
                            <Image src={dashboardsidebaricon} alt="Dashboard menu icon" width={20} height={20} />
                        )}
                    </Button>
                )}
            </div>

            {/* Main Nav items */}
            <div className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
                {navItems.map((item, index) => {
                    if (item.isDropdown) {
                        const isItemActive = pathname === item.href;
                        return (
                            <div key={index} className="space-y-1">
                                <div
                                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all duration-200 ${isItemActive
                                        ? "bg-[#F1F1F1] text-[#1A1A1A]"
                                        : "text-[#525252] hover:bg-[#F1F1F1] hover:text-[#1A1A1A]"
                                        }`}
                                >
                                    <Link
                                        href={item.href}
                                        onClick={() => {
                                            if (onItemClick) onItemClick();
                                            if (!item.isOpen) item.onToggle();
                                        }}
                                        className="flex items-center gap-3 flex-1 min-w-0"
                                    >
                                        <div
                                            className={`p-2 rounded-xl transition-colors shrink-0 ${isItemActive
                                                ? "bg-white border border-[#E0D8CC] text-[#1A1A1A] shadow-xs"
                                                : "text-[#525252]"
                                                }`}
                                        >
                                            <Image
                                                src={item.icon}
                                                alt="Dashboard menu icon"
                                                width={18}
                                                height={18}
                                            />
                                        </div>
                                        {!collapsed && (
                                            <span className="font-bold text-sm text-[#1A1A1A] whitespace-nowrap truncate">
                                                {item.name}
                                            </span>
                                        )}
                                    </Link>

                                    {!collapsed && (
                                        <div className="flex items-center gap-2 shrink-0">
                                            {item.count && (
                                                <span className="text-xs font-semibold text-[#737373] bg-[#F1F1F1] border-2 border-[#ECECEC] px-2.5 py-1 rounded-xl">
                                                    {item.count}
                                                </span>
                                            )}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    item.onToggle();
                                                }}
                                                className="p-1 hover:bg-[#E5E0D8] rounded-lg transition-colors cursor-pointer"
                                                title={item.isOpen ? "Collapse submenu" : "Expand submenu"}
                                            >
                                                <motion.div
                                                    animate={{ rotate: item.isOpen ? 180 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <Image src={dashboarddropdownicon} alt="Dashboard dropdown icon" width={10} height={10} />
                                                </motion.div>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Submenu Tree structure */}
                                {!collapsed && (
                                    <AnimatePresence>
                                        {item.isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden relative pl-8 pr-1 py-1"
                                            >
                                                {/* Continuous Tree Connector Line */}
                                                <svg
                                                    className="absolute left-2.5 top-0 w-6 h-[72px] pointer-events-none"
                                                    viewBox="0 0 24 72"
                                                    fill="none"
                                                >
                                                    {/* Vertical trunk to bottom Doctors curve */}
                                                    <path
                                                        d="M 10 0 V 46 A 8 8 0 0 0 18 54 H 24"
                                                        stroke="#ECECEC"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        fill="none"
                                                    />
                                                    {/* Branch curve to Farmers */}
                                                    <path
                                                        d="M 10 10 A 8 8 0 0 0 18 18 H 24"
                                                        stroke="#ECECEC"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        fill="none"
                                                    />
                                                </svg>

                                                {item.subItems?.map((sub, sIdx) => {
                                                    const isSubActive = sub.active;

                                                    return (
                                                        <div key={sIdx} className="h-9 flex items-center">
                                                            <Link
                                                                href={sub.href}
                                                                onClick={onItemClick}
                                                                className={`w-full h-8 flex items-center justify-between px-2 rounded-lg text-xs transition-colors ${isSubActive
                                                                    ? "text-[#1A1A1A] font-bold"
                                                                    : "text-[#737373] font-medium hover:text-[#1A1A1A]"
                                                                    }`}
                                                            >
                                                                <span>{sub.name}</span>
                                                                <div className="flex items-center gap-1.5 shrink-0">
                                                                    {sub.count && (
                                                                        <span className="text-xs font-medium text-[#737373] bg-[#F1F1F1] border border-[#ECECEC] px-2 py-0.5 rounded-lg">
                                                                            {sub.count}
                                                                        </span>
                                                                    )}
                                                                    {isSubActive && (
                                                                        <ChevronRight className="w-3.5 h-3.5 text-[#1A1A1A]" strokeWidth={2.2} />
                                                                    )}
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    );
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                )}
                            </div>
                        );
                    }

                    const isActive = item.active;

                    return (
                        <Link
                            key={index}
                            href={item.href || "#"}
                            onClick={onItemClick}
                            className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 ${isActive
                                ? "bg-[#F1F1F1] text-[#1A1A1A] font-semibold"
                                : "text-[#525252] hover:bg-[#F1F1F1] hover:text-[#1A1A1A]"
                                }`}
                        >
                            <div
                                className={`p-2 rounded-xl transition-colors ${isActive
                                    ? "bg-white border border-[#E0D8CC] text-[#1A1A1A]"
                                    : "text-[#525252]"
                                    }`}
                            >
                                <Image
                                    src={item.icon}
                                    alt="Dashboard menu icon"
                                    width={18}
                                    height={18}
                                />
                            </div>
                            {!collapsed && (
                                <span className="font-semibold text-sm whitespace-nowrap text-[#1A1A1A]">
                                    {item.name}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Footer item: Settings */}
            <div className="p-3 border-t border-[#F5F2EC]">
                <Link
                    href="/dashboard/settings"
                    onClick={onItemClick}
                    className="flex items-center gap-3 p-2.5 rounded-xl text-[#525252] hover:bg-[#FAF8F5] hover:text-[#1A1A1A] transition-all duration-200"
                >
                    <div className="p-2 rounded-xl text-[#525252]">
                        {/* <Settings className="w-5 h-5 text-[#1A1A1A]" /> */}
                        <Image src={dashboardsettingsicon} alt="Dashboard settings icon" width={18} height={18} />
                    </div>
                    {!collapsed && (
                        <span className="font-semibold text-sm whitespace-nowrap text-[#1A1A1A]">
                            Settings
                        </span>
                    )}
                </Link>
            </div>
        </div>
    );
};