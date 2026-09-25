"use client";

import React, { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Header from "@/components/module/dashboard/Header";
import Sidebar from "@/components/module/dashboard/Sidebar";
import SidebarContent from "@/components/module/dashboard/SidebarContent";
import OfflineIndicator from "@/components/shared/OfflineIndicator";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className=" bg-[#F7F4EE] text-[#1A1A1A] p-3 flex gap-4 font-sans">
      <OfflineIndicator />

      {/* Desktop Sticky Sidebar Navigation */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      {/* Mobile Drawer Navigation (shadcn Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] p-0 bg-white border-r border-[#EAE5DD]">
          <SidebarContent onItemClick={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col gap-3.5 min-w-0">
        <Header onOpenMobileMenu={() => setMobileOpen(true)} />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}