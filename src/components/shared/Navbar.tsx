"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Menu, X } from "lucide-react";
import gobadiLogo from "@/assets/gobadiLogo.png";
import { Button } from "../ui/button";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const navLinks = [
    {
      title: "Home",
      href: "/",
      active: true,
    },
    {
      title: "About Us",
      href: "#about",
    },
    {
      title: "Our Vision",
      href: "#our-vision",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="mx-auto max-w-[1440px] px-4">
        <div className="flex h-20 items-center justify-between">

          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden">
              <Image
                src={gobadiLogo}
                alt="Gobadi logo"
                width={50}
                height={50}
                className="object-contain"
              />
            </div>
            <span className="font-bengali text-2xl font-bold text-black sm:text-3xl">
              গবাদি
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            <nav aria-label="Main navigation" className="flex items-center gap-2">
              {navLinks.map((item) => {
                const isActive = activeLink === item.href;

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => setActiveLink(item.href)}
                    className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${isActive
                      ? "bg-[#FFF5EE] text-[#D0622D] border border-[#FDE1D3]"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </nav>

            {/* CTA Button */}
            <Link
              href="#contact"
              className="hover:cursor-pointer hover:scale-1.1"
            >
              <Button variant="navBtn" className="p-5">
                <Zap />
                Contact Us
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
            aria-label="Toggle Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Animated Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-gray-100 bg-white md:hidden"
          >
            <nav aria-label="Mobile navigation" className="flex flex-col gap-2 p-4">
              {navLinks.map((item) => {
                const isActive = activeLink === item.href;

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => {
                      setActiveLink(item.href);
                      setOpen(false);
                    }}
                    className={`rounded-xl px-4 py-3 text-base font-medium transition-colors ${isActive
                      ? "bg-[#FFF5EE] text-[#D0622D] font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {item.title}
                  </Link>
                );
              })}

              <Link href="#contact">
                <Button variant="navBtn" className="p-5 w-full hover:cursor-pointer hover:scale-1.1">
                  <Zap />
                  Contact Us
                </Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}