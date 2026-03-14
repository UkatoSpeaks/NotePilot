"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Layers, 
  MessageSquareQuote, 
  Settings, 
  UploadCloud, 
  BookOpen,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/generate-notes", label: "Generate Notes", icon: FileText },
  { href: "/dashboard/flashcards", label: "Flashcards", icon: Layers },
  { href: "/dashboard/question-generator", label: "Question Gen", icon: MessageSquareQuote },
  { href: "/dashboard/upload-pdf", label: "Upload PDF", icon: UploadCloud },
  { href: "/dashboard/revision", label: "Revision Mode", icon: BookOpen },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-card border-r border-border flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <Sparkles className="w-6 h-6" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          NotePilot
        </span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-secondary hover:text-primary hover:bg-muted"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                isActive ? "text-primary" : "text-secondary group-hover:text-primary"
              )} />
              <span className="font-medium">{link.label}</span>
              
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-2xl p-4 border border-primary/10">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Pro Plan</p>
          <p className="text-sm text-secondary mb-3">Get unlimited AI notes and flashcards.</p>
          <button className="w-full py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-md shadow-primary/10">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}
