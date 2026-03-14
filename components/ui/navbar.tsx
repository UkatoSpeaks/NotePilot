"use client";

import React from "react";
import { 
  Search, 
  Bell, 
  ChevronDown,
  Sparkles
} from "lucide-react";
import { Button } from "./button";

export function Navbar() {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40 px-10 flex items-center justify-between ml-72">
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
           <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">5 Notes Left Today</span>
        </div>

        <Button variant="ghost" size="icon" className="rounded-2xl relative w-12 h-12 hover:bg-gray-50 transition-colors">
          <Bell className="w-6 h-6 text-gray-500" />
          <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
        </Button>

        <div className="h-8 w-px bg-gray-100 mx-2"></div>

        <button className="flex items-center gap-3 p-1 pr-3 rounded-2xl hover:bg-gray-50 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-[#2D6A4F] to-[#40916c] flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:rotate-6 transition-transform">
            AS
          </div>
          <div className="text-left hidden md:block">
            <p className="text-sm font-black text-gray-800">Anurag S.</p>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Student</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#2D6A4F] transition-colors" />
        </button>
      </div>
    </header>
  );
}
