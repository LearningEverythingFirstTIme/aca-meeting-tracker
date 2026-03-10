"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, DollarSign, BookOpen, LogOut, Heart, ClipboardList, Sun, Moon, Leaf } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useTheme } from "@/components/theme-provider";
import { useEffect, useState } from "react";

export const Navigation = () => {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const navItems = [
    { href: "/", label: "Meetings", icon: Home },
    { href: "/inventory", label: "Inventory", icon: ClipboardList },
    { href: "/treasury", label: "Treasury", icon: DollarSign },
    { href: "/literature", label: "Literature", icon: BookOpen },
  ];

  // Grass sway effect on mouse move
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const getSwayStyle = (index: number) => {
    const offset = index * 50;
    const distanceFromMouse = Math.abs(mousePosition.x - offset);
    const swayAmount = Math.max(0, 1 - distanceFromMouse / 500) * 5;
    return {
      transform: `rotate(${swayAmount}deg)`,
    };
  };

  return (
    <div className="forest-nav sticky top-0 z-50">
      {/* Decorative grass blades that sway */}
      <div className="absolute bottom-0 left-0 right-0 h-1 overflow-visible pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 w-1 bg-gradient-to-t from-[var(--forest-mid)] to-[var(--leaf-sage)] rounded-t-full opacity-30"
            style={{
              left: `${i * 5}%`,
              height: `${20 + Math.random() * 30}px`,
              transformOrigin: "bottom center",
            }}
            animate={{
              rotate: typeof window !== "undefined" ? [0, (mousePosition.x - window.innerWidth / 2) / 100, 0] : 0,
            }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        ))}
      </div>

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
              <span className="forest-title text-xl text-[var(--forest-deep)] hidden lg:block">
                Forest Sanctuary
              </span>
            </Link>

            {navItems.map((item, index) => {
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
                    style={getSwayStyle(index)}
                  >
                    <item.icon size={18} strokeWidth={2.5} />
                    <span className="hidden lg:inline">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
          
          {/* Right: Theme, Help, Logout */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full bg-[var(--earth-cream)] border-2 border-[var(--earth-sand)] flex items-center justify-center text-[var(--forest-mid)] hover:bg-[var(--leaf-dew)] transition-colors"
            >
              {resolvedTheme === "dark" ? (
                <Moon size={18} />
              ) : (
                <Sun size={18} />
              )}
            </motion.button>

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
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full bg-[var(--earth-cream)] flex items-center justify-center text-[var(--forest-mid)]"
            >
              {resolvedTheme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
            </motion.button>

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
