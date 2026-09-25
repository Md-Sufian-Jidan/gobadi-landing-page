"use client";

import { motion } from "framer-motion";
import SidebarContent from "./SidebarContent";

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onItemClick?: () => void;
}

export default function Sidebar(props: SidebarProps) {
  return (
    <motion.aside
      animate={{ width: props.collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="hidden lg:flex bg-white border border-[#EAE5DD] shadow-xs rounded-[24px] flex-col h-[calc(100vh-2rem)] sticky top-4 overflow-hidden z-20 shrink-0"
    >
      <SidebarContent {...props} />
    </motion.aside>
  );
};