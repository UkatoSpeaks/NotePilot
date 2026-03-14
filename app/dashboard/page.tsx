"use client";

import React from "react";
import { 
  FileText, 
  Layers, 
  MessageSquareQuote, 
  UploadCloud, 
  BookOpen,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const dashboardTools = [
  {
    title: "Generate Notes",
    description: "Create comprehensive smart notes for any topic in seconds.",
    icon: FileText,
    color: "bg-blue-500",
    link: "/dashboard/generate-notes",
    delay: 0.1
  },
  {
    title: "Flashcards",
    description: "Turn your topics into interactive cards for better memorization.",
    icon: Layers,
    color: "bg-purple-500",
    link: "/dashboard/flashcards",
    delay: 0.2
  },
  {
    title: "Question Generator",
    description: "Generate board-specific practice questions and answer keys.",
    icon: MessageSquareQuote,
    color: "bg-amber-500",
    link: "/dashboard/question-generator",
    delay: 0.3
  },
  {
    title: "Upload PDF",
    description: "Upload your textbook PDF and let AI extract key information.",
    icon: UploadCloud,
    color: "bg-emerald-500",
    link: "/dashboard/upload-pdf",
    delay: 0.4
  },
  {
    title: "Revision Mode",
    description: "Get a quick summary of everything you've studied recently.",
    icon: BookOpen,
    color: "bg-rose-500",
    link: "/dashboard/revision",
    delay: 0.5
  }
];

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Welcome back, John! 👋</h1>
          <p className="text-secondary font-medium">Ready to ace your class 10 studies today?</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border p-3 px-4 rounded-2xl flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-secondary font-bold uppercase tracking-wider">Study Streak</p>
              <p className="text-sm font-bold">12 Days 🔥</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Action */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary to-purple-600 p-8 md:p-12 text-white shadow-2xl shadow-primary/20">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-3 h-3" /> New Feature
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">Master your subjects with AI-driven notes.</h2>
          <p className="text-white/80 text-lg mb-8">Try our new CBSE 2026 pattern question generator with detailed marking schemes.</p>
          <Link href="/dashboard/generate-notes">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-2xl px-8 font-bold text-lg">
              Start Learning
            </Button>
          </Link>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full hidden md:flex items-center justify-center">
            <motion.div 
               animate={{ y: [0, -20, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="w-64 h-80 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl flex flex-col p-6"
            >
                <div className="w-full h-4 bg-white/20 rounded-full mb-4" />
                <div className="w-3/4 h-4 bg-white/20 rounded-full mb-4" />
                <div className="w-full h-32 bg-white/10 rounded-2xl mb-4" />
                <div className="w-1/2 h-4 bg-white/20 rounded-full" />
            </motion.div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold">Study Tools</h3>
          <Button variant="ghost" className="text-primary font-bold">View All</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardTools.map((tool) => (
            <Link key={tool.title} href={tool.link}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: tool.delay }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group p-6 rounded-[2rem] bg-white border border-border hover:shadow-2xl hover:shadow-primary/5 transition-all h-full flex flex-col"
              >
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg",
                  tool.color
                )}>
                  <tool.icon className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold mb-3">{tool.title}</h4>
                <p className="text-secondary text-sm leading-relaxed mb-6 flex-1">{tool.description}</p>
                <div className="flex items-center text-primary font-bold text-sm gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Open Tool <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold">Recent Activity</h3>
        </div>
        <div className="space-y-4">
          <ActivityItem 
            title="Physics: Laws of Motion" 
            type="Notes Generated" 
            time="2 hours ago" 
            icon={<FileText className="w-5 h-5 text-blue-500" />}
          />
          <ActivityItem 
            title="History: Rise of Nationalism" 
            type="Flashcard Practice" 
            time="Yesterday" 
            icon={<Layers className="w-5 h-5 text-purple-500" />}
          />
        </div>
      </section>
    </div>
  );
}

function ActivityItem({ title, type, time, icon }: { title: string, type: string, time: string, icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between p-5 rounded-3xl bg-white border border-border hover:border-primary/20 transition-colors shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="font-bold">{title}</p>
          <p className="text-xs text-secondary font-medium uppercase tracking-wider">{type}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-secondary text-xs font-medium">
        <Clock className="w-3 h-3" /> {time}
      </div>
    </div>
  );
}
