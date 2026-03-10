"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, DollarSign, BookOpen, LogOut, Heart, ClipboardList, Leaf } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

export const Navigation = () => {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const navItems = [
    { href: "/", label: "Meetings", icon: Home },
    { href: "/inventory", label: "Inventory", icon: ClipboardList },
    { href: "/treasury", label: "Treasury", icon: DollarSign },
    { href: "/literature", label: "Literature", icon: BookOpen },
  ];

  return (
    <div className="forest-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop & Tablet Navigation */}
        <div className="hidden md:flex items-center justify-between py-4 gap-4">
          {/* Left: Logo & Main Nav Items */}
          <div className="flex items-center gap-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 mr-4">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--forest-mid)] to-[var(--leaf-moss)] flex items-center justify-center shadow-lg"
              >
                <Leaf className="w-5 h-5 text-white" />
              </motion.div>
            </Link>

            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                      isActive 
                        ? "bg-gradient-to-r from-[var(--forest-mid)] to-[var(--forest-light)] text-white shadow-lg shadow-[var(--forest-mid)]/30" 
                        : "text-[var(--forest-mid)] hover:bg-[var(--leaf-dew)]"
                    }`}
                  >
                    <item.icon size={18} strokeWidth={2.5} />
                    <span className="hidden lg:inline">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
          
          {/* Right: Help, Logout */}
          <div className="flex items-center gap-3">
            {/* Help Button */}
            <Link href="/help">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[var(--accent-rose)] to-[var(--accent-sunset)] text-[var(--forest-deep)] font-semibold text-sm shadow-md hover:shadow-lg transition-shadow"
              >
                <Heart size={18} fill="currentColor" />
                <span className="hidden lg:inline">24/7 Help</span>
              </motion.div>
            </Link>
            
            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => void logout()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border-2 border-[var(--earth-sand)] text-[var(--forest-mid)] font-semibold text-sm hover:bg-[var(--earth-sand)] transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden lg:inline">Logout</span>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center justify-between py-3">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--forest-mid)] to-[var(--leaf-moss)] flex items-center justify-center"
            >
              <Leaf className="w-5 h-5 text-white" />
            </motion.div>
          </Link>

          {/* Nav Items */}
          <div className="flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={`w-11 h-11 rounded-full flex items-center justify-center ${
                      isActive 
                        ? "bg-gradient-to-br from-[var(--forest-mid)] to-[var(--forest-light)] text-white shadow-md" 
                        : "bg-[var(--earth-cream)] text-[var(--forest-mid)]"
                    }`}
                  >
                    <item.icon size={20} strokeWidth={2.5} />
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            <Link href="/help">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-rose)] to-[var(--accent-sunset)] flex items-center justify-center"
              >
                <Heart size={18} fill="white" className="text-white" />
              </motion.div>
            </Link>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => void logout()}
              className="w-10 h-10 rounded-full bg-[var(--earth-cream)] flex items-center justify-center text-[var(--forest-mid)]"
            >
              <LogOut size={18} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
