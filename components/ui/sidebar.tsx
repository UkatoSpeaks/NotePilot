"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Layers, 
  MessageSquare, 
  Settings, 
  UploadCloud, 
  Zap,
  BookOpen,
  Sparkles,
  HelpCircle,
  Search,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import gsap from "gsap";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, color: "text-blue-500", bgColor: "bg-blue-50" },
  { href: "/dashboard/generate-notes", label: "Generate Notes", icon: FileText, color: "text-orange-500", bgColor: "bg-orange-50" },
  { href: "/dashboard/flashcards", label: "Flashcards", icon: BrainIcon, color: "text-purple-500", bgColor: "bg-purple-50" },
  { href: "/dashboard/question-generator", label: "Question Gen", icon: HelpCircle, color: "text-red-500", bgColor: "bg-red-50" },
  { href: "/dashboard/upload-pdf", label: "Upload PDF", icon: UploadCloud, color: "text-emerald-500", bgColor: "bg-emerald-50" },
  { href: "/dashboard/revision", label: "Revision Mode", icon: Zap, color: "text-amber-500", bgColor: "bg-amber-50" },
  { href: "/dashboard/notes", label: "My Notes", icon: BookOpen, color: "text-indigo-500", bgColor: "bg-indigo-50" },
];

export function Sidebar() {
  const pathname = usePathname();
  const sidebarRef = useRef(null);

  useEffect(() => {
    gsap.from(sidebarRef.current, {
      x: -100,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });
  }, []);

  return (
    <aside 
      ref={sidebarRef}
      className="w-72 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
    >
      <div className="p-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-[#2D6A4F] rounded-2xl flex items-center justify-center text-white shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
            <Sparkles className="w-7 h-7 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-[#2D6A4F]">NotePilot</span>
            <span className="text-[10px] font-black text-[#F9A11B] uppercase tracking-[0.2em] leading-none mt-1">AI Study Tool</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto py-4">
        <p className="px-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Main Menu</p>
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group relative",
                isActive 
                  ? "bg-[#2D6A4F] text-white shadow-lg shadow-green-900/10" 
                  : "text-gray-500 hover:text-[#2D6A4F] hover:bg-gray-50"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-2 rounded-xl transition-colors duration-300",
                  isActive ? "bg-white/20" : link.bgColor,
                  !isActive && link.color
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm tracking-tight">{link.label}</span>
              </div>
              
              {isActive ? (
                <motion.div layoutId="active-nav">
                  <ChevronRight className="w-4 h-4 text-white/40" />
                </motion.div>
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto">
        <Link 
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all mb-4 text-gray-500 hover:text-[#2D6A4F] hover:bg-gray-50 font-bold text-sm",
            pathname === "/dashboard/settings" && "bg-gray-100 text-[#2D6A4F]"
          )}
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
        
        <div className="bg-linear-to-tr from-[#2D6A4F] to-[#1b4332] rounded-3xl p-6 text-white relative overflow-hidden group shadow-xl">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-orange-400 mb-2">Pro Access</p>
            <p className="text-sm font-bold leading-tight mb-4">Upgrade for Unlimited AI Magic</p>
            <button className="w-full py-3 bg-white text-[#2D6A4F] rounded-xl text-xs font-black shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
              Upgrade Now
            </button>
          </div>
          <Sparkles className="absolute -bottom-4 -right-4 w-20 h-20 text-white/10 group-hover:rotate-12 transition-transform duration-500" />
        </div>
      </div>
    </aside>
  );
}

function BrainIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.5 2C7.567 2 6 3.567 6 5.5C6 7.433 7.567 9 9.5 9C11.433 9 13 7.433 13 5.5C13 3.567 11.433 2 9.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14.5 9C16.433 9 18 10.567 18 12.5C18 14.433 16.433 16 14.5 16C12.567 16 11 14.433 11 12.5C11 10.567 12.567 9 14.5 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.5 2C20.433 2 22 3.567 22 5.5C22 7.433 20.433 9 18.5 9C16.567 9 15 7.433 15 5.5C15 3.567 16.567 2 18.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.5 9C7.433 9 9 10.567 9 12.5C9 14.433 7.433 16 5.5 16C3.567 16 2 14.433 2 12.5C2 10.567 3.567 9 5.5 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.5 16C11.433 16 13 17.567 13 19.5C13 21.433 11.433 23 9.5 23C7.567 23 6 21.433 6 19.5C6 17.567 7.567 16 9.5 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
