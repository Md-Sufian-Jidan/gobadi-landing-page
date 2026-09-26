"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, Users, Stethoscope, PawPrint, Bell, LayoutDashboard, Settings, FolderOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { queryKeys } from "@/lib/queryKeys";
import { globalSearch } from "@/services/search.service";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SearchFarmer, SearchDoctor, SearchAnimal, SearchNotification } from "@/types/search.type";

interface GlobalSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QUICK_ACTIONS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Animal List", href: "/dashboard/animal-list", icon: PawPrint },
  { label: "Push Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const CATEGORY_COLORS: Record<string, string> = {
  farmers: "bg-[#E8F5E9] text-[#2E7D32]",
  doctors: "bg-[#E3F2FD] text-[#1565C0]",
  animals: "bg-[#FFF3E0] text-[#E65100]",
  notifications: "bg-[#F3E5F5] text-[#6A1B9A]",
};

function ResultSection<T>({
  title,
  icon: Icon,
  color,
  items,
  renderItem,
  viewAllHref,
  onNavigate,
}: {
  title: string;
  icon: React.ElementType;
  color: string;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  viewAllHref: string;
  onNavigate: (href: string) => void;
}) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between px-2 py-1">
        <div className="flex items-center gap-2">
          <div className={cn("p-1 rounded-md", color)}>
            <Icon className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-semibold text-[#737373] uppercase tracking-wider">
            {title}
          </span>
        </div>
        <button
          onClick={() => onNavigate(viewAllHref)}
          className="text-[11px] font-medium text-[#C1652F] hover:text-[#A84E24] cursor-pointer"
        >
          View all
        </button>
      </div>
      {items.map((item, idx) => (
        <div key={idx}>{renderItem(item)}</div>
      ))}
    </div>
  );
}

export default function GlobalSearchModal({ open, onOpenChange }: GlobalSearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const debouncedQuery = useDebounce(searchQuery, 300);

  const { data: result, isLoading } = useQuery({
    queryKey: queryKeys.globalSearch(debouncedQuery),
    queryFn: () => globalSearch(debouncedQuery),
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 30_000,
  });

  const searchResults = result?.status ? result.data : null;

  const hasResults =
    searchResults &&
    (searchResults.farmers.length > 0 ||
      searchResults.doctors.length > 0 ||
      searchResults.animals.length > 0 ||
      searchResults.notifications.length > 0);

  const showQuickActions = debouncedQuery.trim().length < 2;

  // Build flat list for keyboard navigation
  const flatItems: Array<{ type: string; href: string }> = [];
  if (showQuickActions) {
    QUICK_ACTIONS.forEach((a) => flatItems.push({ type: "action", href: a.href }));
  } else if (hasResults) {
    searchResults.farmers.forEach((f) =>
      flatItems.push({ type: "farmer", href: `/dashboard/user-list/farmers?search=${encodeURIComponent(f.name)}` })
    );
    searchResults.doctors.forEach((d) =>
      flatItems.push({ type: "doctor", href: `/dashboard/user-list/doctors?search=${encodeURIComponent(d.name)}` })
    );
    searchResults.animals.forEach((a) =>
      flatItems.push({ type: "animal", href: `/dashboard/animal-list?search=${encodeURIComponent(a.name)}` })
    );
    searchResults.notifications.forEach((n) =>
      flatItems.push({ type: "notification", href: `/dashboard/notifications?search=${encodeURIComponent(n.title)}` })
    );
  }

  const navigate = useCallback(
    (href: string) => {
      router.push(href);
      onOpenChange(false);
      setSearchQuery("");
      setActiveIndex(-1);
    },
    [router, onOpenChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, flatItems.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, -1));
      } else if (e.key === "Enter" && activeIndex >= 0 && flatItems[activeIndex]) {
        e.preventDefault();
        navigate(flatItems[activeIndex].href);
      }
    },
    [activeIndex, flatItems, navigate]
  );

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setActiveIndex(-1);
    }
  }, [open]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-lg p-0 gap-0 top-[15%] translate-y-0"
      >
        <DialogTitle className="sr-only">Global Search</DialogTitle>

        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#EAE5DD]">
          <Search className="w-5 h-5 text-[#737373] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search farmers, doctors, animals..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-sm text-[#1A1A1A] placeholder-[#737373]"
          />
          <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded-md border border-[#D4D4D4] bg-gradient-to-b from-white to-[#EAEAEA] px-1.5 font-mono text-[11px] font-medium text-[#525252] shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[400px] overflow-y-auto">
          {/* Quick Actions */}
          {showQuickActions && (
            <div className="p-3 space-y-1">
              <p className="font-semibold text-[10px] text-[#737373] uppercase tracking-wider px-2 py-1">
                Quick Actions
              </p>
              {QUICK_ACTIONS.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.href}
                    onClick={() => navigate(action.href)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors cursor-pointer text-left",
                      activeIndex === idx
                        ? "bg-[#F7F4EE] text-[#1A1A1A]"
                        : "text-[#525252] hover:bg-[#F7F4EE] hover:text-[#1A1A1A]"
                    )}
                  >
                    <Icon className="w-4 h-4 text-[#737373]" />
                    <span className="font-medium">{action.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-[#C1652F]" />
              <span className="ml-2 text-sm text-[#737373]">Searching...</span>
            </div>
          )}

          {/* No Results */}
          {!showQuickActions && !isLoading && !hasResults && debouncedQuery.trim().length >= 2 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Search className="w-8 h-8 text-[#D4D4D4] mb-2" />
              <p className="text-sm font-medium text-[#525252]">No results found</p>
              <p className="text-xs text-[#737373] mt-1">
                Try searching for a name, email, or breed
              </p>
            </div>
          )}

          {/* Search Results */}
          {!showQuickActions && !isLoading && hasResults && (
            <div className="p-3 space-y-3">
              <ResultSection
                title="Farmers"
                icon={Users}
                color={CATEGORY_COLORS.farmers}
                items={searchResults.farmers}
                viewAllHref={`/dashboard/user-list/farmers?search=${encodeURIComponent(debouncedQuery)}`}
                onNavigate={navigate}
                renderItem={(farmer: SearchFarmer) => (
                  <button
                    onClick={() =>
                      navigate(`/dashboard/user-list/farmers?search=${encodeURIComponent(farmer.name)}`)
                    }
                    onMouseEnter={() => {
                      const idx =
                        flatItems.findIndex(
                          (f) => f.type === "farmer" && f.href.includes(`search=${encodeURIComponent(farmer.name)}`)
                        );
                      setActiveIndex(idx);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors cursor-pointer text-left"
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#C15C2B] flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {farmer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-[#1A1A1A] truncate">{farmer.name}</p>
                      <p className="text-xs text-[#737373] truncate">
                        {farmer.email || farmer.phone || "No contact"}
                      </p>
                    </div>
                    <span className="text-[10px] text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-md font-semibold shrink-0">
                      Farmer
                    </span>
                  </button>
                )}
              />

              <ResultSection
                title="Doctors"
                icon={Stethoscope}
                color={CATEGORY_COLORS.doctors}
                items={searchResults.doctors}
                viewAllHref={`/dashboard/user-list/doctors?search=${encodeURIComponent(debouncedQuery)}`}
                onNavigate={navigate}
                renderItem={(doctor: SearchDoctor) => (
                  <button
                    onClick={() =>
                      navigate(`/dashboard/user-list/doctors?search=${encodeURIComponent(doctor.name)}`)
                    }
                    onMouseEnter={() => {
                      const idx =
                        flatItems.findIndex(
                          (f) => f.type === "doctor" && f.href.includes(`search=${encodeURIComponent(doctor.name)}`)
                        );
                      setActiveIndex(idx);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors cursor-pointer text-left"
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#1565C0] flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {doctor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-[#1A1A1A] truncate">{doctor.name}</p>
                      <p className="text-xs text-[#737373] truncate">
                        {doctor.email || doctor.phone || "No contact"}
                      </p>
                    </div>
                    <span className="text-[10px] text-[#1565C0] bg-[#E3F2FD] px-2 py-0.5 rounded-md font-semibold shrink-0">
                      Doctor
                    </span>
                  </button>
                )}
              />

              <ResultSection
                title="Animals"
                icon={PawPrint}
                color={CATEGORY_COLORS.animals}
                items={searchResults.animals}
                viewAllHref={`/dashboard/animal-list?search=${encodeURIComponent(debouncedQuery)}`}
                onNavigate={navigate}
                renderItem={(animal: SearchAnimal) => (
                  <button
                    onClick={() =>
                      navigate(`/dashboard/animal-list?search=${encodeURIComponent(animal.name)}`)
                    }
                    onMouseEnter={() => {
                      const idx =
                        flatItems.findIndex(
                          (f) => f.type === "animal" && f.href.includes(`search=${encodeURIComponent(animal.name)}`)
                        );
                      setActiveIndex(idx);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors cursor-pointer text-left"
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#E65100] flex items-center justify-center text-white text-xs font-bold shrink-0">
                      <PawPrint className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-[#1A1A1A] truncate">{animal.name}</p>
                      <p className="text-xs text-[#737373] truncate">
                        {animal.breed}
                      </p>
                    </div>
                    <span className="text-[10px] text-[#E65100] bg-[#FFF3E0] px-2 py-0.5 rounded-md font-semibold shrink-0">
                      Animal
                    </span>
                  </button>
                )}
              />

              <ResultSection
                title="Notifications"
                icon={Bell}
                color={CATEGORY_COLORS.notifications}
                items={searchResults.notifications}
                viewAllHref={`/dashboard/notifications?search=${encodeURIComponent(debouncedQuery)}`}
                onNavigate={navigate}
                renderItem={(notification: SearchNotification) => (
                  <button
                    onClick={() =>
                      navigate(`/dashboard/notifications?search=${encodeURIComponent(notification.title)}`)
                    }
                    onMouseEnter={() => {
                      const idx =
                        flatItems.findIndex(
                          (f) =>
                            f.type === "notification" &&
                            f.href.includes(`search=${encodeURIComponent(notification.title)}`)
                        );
                      setActiveIndex(idx);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors cursor-pointer text-left"
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#6A1B9A] flex items-center justify-center text-white text-xs font-bold shrink-0">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-[#1A1A1A] truncate">{notification.title}</p>
                      <p className="text-xs text-[#737373] truncate">{notification.body}</p>
                    </div>
                    <span className="text-[10px] text-[#6A1B9A] bg-[#F3E5F5] px-2 py-0.5 rounded-md font-semibold shrink-0">
                      {notification.type}
                    </span>
                  </button>
                )}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#EAE5DD] bg-[#FAFAFA]">
          <div className="flex items-center gap-3 text-[11px] text-[#737373]">
            <span className="flex items-center gap-1">
              <kbd className="inline-flex h-5 items-center gap-0.5 rounded border border-[#D4D4D4] bg-white px-1 font-mono text-[10px] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                &uarr;&darr;
              </kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="inline-flex h-5 items-center gap-0.5 rounded border border-[#D4D4D4] bg-white px-1 font-mono text-[10px] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                &crarr;
              </kbd>
              select
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
