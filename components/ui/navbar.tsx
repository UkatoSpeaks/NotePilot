"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Bell, 
  ChevronDown,
  Sparkles,
  LogOut,
  User as UserIcon,
  Settings
} from "lucide-react";
import { Button } from "./button";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { getUserUsage } from "@/lib/firestore";

export function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [usage, setUsage] = useState<any>(null);

  useEffect(() => {
    if (user) {
      getUserUsage(user.uid).then(setUsage);
    }
  }, [user]);

  // Get initials from display name
  const name = user?.displayName || user?.email || "User";
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const creditsLeft = 5 - (usage?.notesToday || 0);

  return (
    <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40 px-10 flex items-center justify-between">
      <div className="flex items-center gap-6 flex-1">
        <div className="relative max-w-xl w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#2D6A4F] transition-colors" />
          <input 
            type="text" 
            placeholder="Search your notes, flashcards, or topics..." 
            className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-[#2D6A4F]/10 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full border border-orange-100">
           <Sparkles className="w-4 h-4 text-orange-500" />
           <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{creditsLeft > 0 ? `${creditsLeft} AI Credits Left` : "Limit Reached"}</span>
        </div>

        <Button variant="ghost" size="icon" className="rounded-2xl relative w-12 h-12 hover:bg-gray-50 transition-colors">
          <Bell className="w-6 h-6 text-gray-500" />
          <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
        </Button>

        <div className="h-8 w-px bg-gray-100 mx-2"></div>

        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-3 p-1 pr-3 rounded-2xl hover:bg-gray-50 transition-all group"
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt={name} className="w-10 h-10 rounded-xl shadow-lg group-hover:rotate-6 transition-transform object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-[#2D6A4F] to-[#40916c] flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:rotate-6 transition-transform">
                {initials}
              </div>
            )}
            <div className="text-left hidden md:block">
              <p className="text-sm font-black text-gray-800 line-clamp-1 max-w-[120px]">{name}</p>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Student</p>
            </div>
            <ChevronDown className={cn("w-4 h-4 text-gray-400 group-hover:text-[#2D6A4F] transition-all", isMenuOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-4 w-56 bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden py-2"
              >
                <div className="px-4 py-3 border-b border-gray-50 mb-2">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Signed in as</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
                </div>
                
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                  <UserIcon className="w-4 h-4" /> Profile Details
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                  <Settings className="w-4 h-4" /> Account Settings
                </button>
                
                <div className="h-px bg-gray-50 my-2 mx-4" />
                
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
