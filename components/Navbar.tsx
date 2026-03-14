"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Rocket, BookOpen, Brain, Trophy } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features", icon: <Rocket size={16} /> },
    {
      name: "Study Notes",
      href: "/dashboard/notes",
      icon: <BookOpen size={16} />,
    },
    {
      name: "Flashcards",
      href: "/dashboard/flashcards",
      icon: <Brain size={16} />,
    },
    { name: "Quizzes", href: "/dashboard/quiz", icon: <Trophy size={16} /> },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 glass-effect shadow-lg shadow-black/10"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center relative">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.4)] group-hover:scale-110 transition-transform">
            <Rocket className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight gradient-text">
            NotePilot
          </span>
        </Link>

        {/* Desktop Nav — horizontally centered via absolute positioning */}
        <div className="hidden md:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-foreground/40 hover:text-foreground transition-colors flex items-center gap-1.5 text-sm font-medium whitespace-nowrap"
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </div>

        {/* Dashboard CTA */}
        <div className="hidden md:flex shrink-0">
          <Link
            href="/dashboard"
            className="px-5 py-2 bg-primary hover:bg-primary/80 text-primary-foreground rounded-full font-semibold text-sm transition-all hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:-translate-y-0.5"
          >
            Dashboard
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 glass-effect p-6 md:hidden flex flex-col gap-5"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-foreground/60 hover:text-foreground transition-colors flex items-center gap-3 text-lg font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <Link
              href="/dashboard"
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold text-center mt-2"
              onClick={() => setIsOpen(false)}
            >
              Get Started
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
