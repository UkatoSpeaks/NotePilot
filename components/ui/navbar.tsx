"use client";

import React from "react";
import { 
  Search, 
  Bell, 
  User,
  ChevronDown,
  Menu
} from "lucide-react";
import { Button } from "./button";

export function Navbar() {
  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between ml-64">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
          <input 
            type="text" 
            placeholder="Search your notes..." 
            className="w-full bg-muted border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="rounded-xl relative">
          <Bell className="w-5 h-5 text-secondary" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-card"></span>
        </Button>
        <div className="h-8 w-px bg-border mx-2"></div>
        <button className="flex items-center gap-2 hover:bg-muted p-1 px-2 rounded-xl transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            JD
          </div>
          <div className="text-left hidden md:block">
            <p className="text-sm font-semibold truncate max-w-[100px]">John Doe</p>
            <p className="text-[10px] text-secondary font-medium uppercase tracking-tight">Class 10-A</p>
          </div>
          <ChevronDown className="w-4 h-4 text-secondary" />
        </button>
      </div>
    </header>
  );
}
