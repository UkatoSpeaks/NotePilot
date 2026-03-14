"use client";

import React, { useState } from "react";
import { Flashcard } from "@/components/ui/flashcard";
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const MOCK_FLASHCARDS = [
  {
    category: "Physics",
    front: "What is Newton's First Law of Motion?",
    back: "An object remains at rest or in uniform motion unless acted upon by an external force (Law of Inertia)."
  },
  {
    category: "Biology",
    front: "Which organelle is the powerhouse of the cell?",
    back: "The Mitochondria, responsible for producing ATP through cellular respiration."
  },
  {
    category: "Chemistry",
    front: "What is an Ionic Bond?",
    back: "A chemical bond formed by the complete transfer of electrons from one atom to another."
  },
  {
    category: "History",
    front: "When did the French Revolution begin?",
    back: "The French Revolution began in 1789 with the Storming of the Bastille."
  },
  {
    category: "Math",
    front: "What is the Pythagorean Theorem?",
    back: "In a right-angled triangle, a² + b² = c², where c is the hypotenuse."
  },
  {
    category: "Biology",
    front: "What defines a Prokaryotic cell?",
    back: "A cell that lacks a nucleus and membrane-bound organelles, typically smaller than eukaryotic cells."
  }
];

export default function FlashcardsPage() {
  const [filter, setFilter] = useState("All");

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Flashcards</h1>
          <p className="text-secondary font-medium">Test your memory and master your subjects.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl gap-2 font-bold opacity-70">
            <Sparkles className="w-4 h-4" /> AI Generate
          </Button>
          <Button className="rounded-2xl gap-2 font-bold px-6 shadow-lg shadow-primary/20">
            <Plus className="w-5 h-5" /> Create New
          </Button>
        </div>
      </header>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-border">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          {["All", "Physics", "Biology", "Chemistry", "History", "Math"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap",
                filter === cat 
                  ? "bg-primary/10 text-primary" 
                  : "text-secondary hover:bg-muted"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
            <input 
              type="text" 
              placeholder="Search cards..." 
              className="w-full bg-muted border-none rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-2xl shrink-0">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard label="Total Cards" value="124" />
        <StatCard label="Mastered" value="86" color="text-success" />
        <StatCard label="Due Today" value="12" color="text-primary" />
        <StatCard label="New" value="5" color="text-amber-500" />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_FLASHCARDS.filter(c => filter === "All" || c.category === filter).map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Flashcard {...card} />
          </motion.div>
        ))}
      </div>

      {/* Empty State / Add More */}
      <div className="p-12 rounded-[3rem] bg-muted/50 border border-dashed border-border flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mb-6">
            <Plus className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Need more cards?</h3>
          <p className="text-secondary mb-8 max-w-xs">Upload your notes and we'll generate dozens of flashcards for you instantly.</p>
          <Button className="rounded-2xl gap-2 font-bold">
            Generate with AI <ArrowRight className="w-4 h-4" />
          </Button>
      </div>
    </div>
  );
}

function StatCard({ label, value, color = "text-foreground" }: { label: string, value: string, color?: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-border flex flex-col items-center text-center shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">{label}</p>
      <p className={cn("text-2xl font-black", color)}>{value}</p>
    </div>
  );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
