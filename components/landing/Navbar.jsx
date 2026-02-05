"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  TrendingUp,
  ChevronRight,
  Shield,
  Activity,
  LifeBuoy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Protocol", href: "#features" },
    { name: "Live Indexes", href: "#indices" },
    { name: "Verification", href: "#how-it-works" },
    { name: "Contact", href: "#footer" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ease-in-out border-b",
        isScrolled
          ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-slate-200/50 dark:border-white/10 py-3"
          : "bg-white dark:bg-slate-950 border-transparent py-5"
      )}
    >
      <div className="w-full max-w-7xl px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-lg transition-transform group-hover:scale-105">
            <Shield className="h-5 w-5 fill-current" />
            <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20"></div>
          </div>
          <span className="font-bold tracking-tight text-lg text-slate-900 dark:text-white">
            Invest<span className="text-slate-500 dark:text-slate-400">Pro</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-white/5 rounded-full transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth & Utilities */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 mr-2">
            <button className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              <Activity className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              <LifeBuoy className="h-5 w-5" />
            </button>
          </div>

          <Link
            href="/login"
            className="hidden sm:block text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors px-4"
          >
            Login
          </Link>
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/25 rounded-full px-6 transition-all hover:scale-105"
          >
            <Link href="/register">Sign Up</Link>
          </Button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={cn(
          "md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-white/10 transition-all duration-300 ease-in-out overflow-hidden shadow-2xl",
          isMenuOpen ? "max-h-screen py-6" : "max-h-0"
        )}
      >
        <div className="px-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center justify-between p-4 text-base font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name} <ChevronRight size={18} className="text-slate-400" />
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-3">
            <Link
              href="/login"
              className="flex items-center justify-center h-12 text-base font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/5 rounded-2xl"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-2xl text-base font-bold shadow-lg shadow-blue-500/25"
            >
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
