"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Notification from "@/components/shared/Notification";
import GlobalSearchModal from "@/components/shared/GlobalSearchModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import magnifyingglassicon from "@/assets/magnifyingglass.svg"
import { getAdminProfile } from "@/services/adminAuth.service";
import type { AdminProfile } from "@/types/auth.type";

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export default function Header({ onOpenMobileMenu }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [admin, setAdmin] = useState<AdminProfile | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const result = await getAdminProfile();
      if (result.status && result.data) {
        setAdmin(result.data);
      }
    }
    fetchProfile();
  }, []);

  // Keyboard shortcut Cmd/Ctrl + K to open search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const displayName = admin?.name || "";
  const displayRole = admin?.role === "super_admin" ? "Super Admin" : "";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <header className="bg-white border border-[#EAE5DD] shadow-xs rounded-[20px] sm:rounded-[24px] px-3.5 sm:px-6 py-3 flex items-center justify-between gap-3 z-10 sticky top-3">
        {/* Mobile Menu Button + Search Input */}
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          {onOpenMobileMenu && (
            <Button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2.5 rounded-xl sm:rounded-2xl bg-[#F7F4EE] hover:bg-[#EFEAE4] text-[#1A1A1A] border border-[#E5E0D8] transition-colors cursor-pointer shrink-0"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-[#1A1A1A]" />
            </Button>
          )}

          <div
            className="relative flex items-center w-full md:w-64 cursor-pointer"
            onClick={() => setIsSearchOpen(true)}
          >
            <Image
              src={magnifyingglassicon}
              alt="magnifyingglassicon"
              width={18}
              height={18}
              className="absolute left-3.5 w-4 h-4 pointer-events-none z-10 opacity-70"
            />
            <Input
              type="text"
              placeholder={"Search..."}
              readOnly
              className="h-10 w-full pl-9 pr-14 text-xs sm:text-sm bg-[#F8F7F7] border border-[#E2E2E2] rounded-[12px] text-[#1A1A1A] placeholder:text-[#737373] focus-visible:ring-0 focus-visible:border-[#CCCCCC] focus-visible:bg-white transition-all shadow-none cursor-pointer"
            />
            <Kbd className="absolute right-2 z-10 h-6 px-2 py-0.5 text-[11px] font-medium text-[#525252] bg-gradient-to-b from-[#FFFFFF] to-[#EAEAEA] border border-[#D4D4D4] rounded-[6px] shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
              ⌘ K
            </Kbd>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Notifications Dropdown */}
          <Notification />

          <div className="hidden md:flex flex-col justify-end">
            <h6 className="font-semibold text-base text-primary">{displayName}</h6>
            <p className="text-[10px] text-[#121212]">{displayRole}</p>
          </div>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-3 cursor-pointer group">
            {admin?.avatar ? (
              <Image
                src={admin.avatar}
                alt={displayName}
                width={50}
                height={50}
                className="hidden md:block w-12 h-12 object-cover rounded-full"
              />
            ) : (
              <div className="hidden md:flex w-10 h-10 rounded-full bg-[#C15C2B] items-center justify-center text-white font-bold text-sm">
                {initials}
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger className="md:hidden block">
                {admin?.avatar ? (
                  <Image
                    src={admin.avatar}
                    alt={displayName}
                    width={30}
                    height={30}
                    className="block w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="flex w-10 h-10 rounded-full bg-[#C15C2B] items-center justify-center text-white font-bold text-sm">
                    {initials}
                  </div>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup className="p-2">
                  <DropdownMenuItem className="font-semibold text-base text-primary">{displayName}</DropdownMenuItem>
                  <DropdownMenuItem className="text-[10px] text-[#121212]">{displayRole}</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
};
