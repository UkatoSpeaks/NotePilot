"use client";

import React from "react";
import { 
  FileText, 
  HelpCircle, 
  UploadCloud, 
  Zap,
  ArrowRight,
  TrendingUp,
  Sparkles,
  BookOpen,
  Plus,
  Trash2,
  Eye,
  Brain,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getRecentNotes, getUserUsage } from "@/lib/firestore";

const dashboardTools = [
  {
    title: "Generate Notes",
    description: "Create structured study notes from any topic instantly.",
    icon: FileText,
    color: "bg-orange-500",
    link: "/dashboard/generate-notes",
    delay: 0.1
  },
  {
    title: "Flashcards",
    description: "Turn your notes into quick revision cards using active recall.",
    icon: Brain,
    color: "bg-purple-500",
    link: "/dashboard/flashcards",
    delay: 0.2
  },
  {
    title: "Question Gen",
    description: "Generate exam-style questions with detailed marking schemes.",
    icon: HelpCircle,
    color: "text-white bg-red-500",
    link: "/dashboard/question-generator",
    delay: 0.3
  },
  {
    title: "Upload PDF",
    description: "Upload your textbook PDFs and get AI-powered summaries.",
    icon: UploadCloud,
    color: "bg-blue-500",
    link: "/dashboard/upload-pdf",
    delay: 0.4
  },
  {
    title: "Revision Mode",
    description: "Quick 5-minute revision notes for last-minute prep.",
    icon: Zap,
    color: "bg-amber-500",
    link: "/dashboard/revision",
    delay: 0.5
  }
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [recentNotes, setRecentNotes] = React.useState<any[]>([]);
  const [usage, setUsage] = React.useState<any>(null);
  const displayName = user?.displayName?.split(" ")[0] || "Friend";

  React.useEffect(() => {
    if (user) {
      getRecentNotes(user.uid)
        .then(setRecentNotes)
        .catch(err => console.error("Dashboard: Error fetching recent notes", err));
      
      getUserUsage(user.uid)
        .then(setUsage)
        .catch(err => console.error("Dashboard: Error fetching usage stats", err));
    }
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* 1. Welcome Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3 tracking-tight">
            👋 Welcome back, <span className="text-[#2D6A4F]">{displayName}!</span>
          </h1>
          <p className="text-lg text-gray-500 font-bold">What would you like to study today?</p>
        </div>

        <div className="flex items-center gap-4">
          <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Study Streak" value={`${usage?.studyStreak || 0} Days 🔥`} color="text-orange-600 bg-orange-100" />
          <StatCard icon={<BookOpen className="w-5 h-5" />} label="Notes Made Today" value={usage?.notesToday || 0} color="text-[#2D6A4F] bg-green-100" />
        </div>
      </header>

      {/* 2. Hero Action Card */}
      <div className="relative overflow-hidden rounded-[48px] bg-linear-to-br from-[#2D6A4F] to-[#1b4332] p-10 md:p-16 text-white shadow-2xl shadow-green-900/20">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest mb-8">
            <Sparkles className="w-3 h-3 text-orange-400" /> New: Exam Pattern Practice
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-[1.1]">Master any subject <br/> with AI Magic.</h2>
          <p className="text-white/70 text-lg font-bold mb-10 leading-relaxed">Try our new CBSE 2026 pattern question generator with detailed marking schemes and model answers.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard/generate-notes">
              <Button size="lg" className="bg-[#F9A11B] hover:bg-white hover:text-[#2D6A4F] text-white border-none rounded-2xl px-10 py-8 font-black text-lg shadow-xl shadow-orange-500/20 transition-all">
                Start Studying
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:flex items-center justify-center opacity-20 pointer-events-none">
           <Brain className="w-96 h-96 text-white" />
        </div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-orange-400 rounded-full blur-[120px] opacity-20" />
      </div>

      {/* 3. Main Feature Cards */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-gray-900">Study Tools</h3>
          <Link href="/dashboard/notes" className="text-sm font-black text-[#2D6A4F] hover:underline flex items-center gap-1">
            Browse All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {dashboardTools.map((tool) => (
            <Link key={tool.title} href={tool.link} className="h-full">
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group p-8 rounded-[40px] bg-white border border-gray-100 hover:shadow-2xl hover:shadow-green-900/5 transition-all h-full flex flex-col cursor-pointer ring-1 ring-gray-50"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-10 text-white shadow-xl ${tool.color} group-hover:rotate-6 transition-transform`}>
                  <tool.icon className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-black text-gray-900 mb-3">{tool.title}</h4>
                <p className="text-gray-500 text-sm font-bold leading-relaxed mb-8 flex-1">{tool.description}</p>
                <div className="flex items-center text-[#2D6A4F] font-black text-xs uppercase tracking-widest gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                  Open <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            </Link>
          ))}

          <Link href="/dashboard/generate-notes" className="h-full">
            <div className="p-8 rounded-[40px] border-2 border-dashed border-gray-200 hover:border-[#2D6A4F] hover:bg-[#2D6A4F]/5 transition-all h-full flex flex-col items-center justify-center text-center group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 group-hover:bg-[#2D6A4F] group-hover:text-white transition-all text-gray-400">
                <Plus className="w-8 h-8" />
              </div>
              <p className="font-black text-gray-500 group-hover:text-[#2D6A4F]">New Study Action</p>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. Recent Notes Section */}
      <section className="grid lg:grid-cols-2 gap-12">
        <div>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-gray-900">Recent Notes</h3>
            <Link href="/dashboard/notes">
              <Button variant="ghost" className="font-black text-[#2D6A4F]">View My Library</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {recentNotes.length > 0 ? (
              recentNotes.map((note) => (
                <NoteItem key={note.id} note={note} />
              ))
            ) : (
              <div className="p-10 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                <p className="text-gray-400 font-bold italic">No notes created yet. Start by generating your first study note!</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#2D6A4F]/5 rounded-[48px] p-10 flex flex-col justify-center items-center text-center border border-[#2D6A4F]/10">
           <div className="w-20 h-20 bg-white rounded-[24px] flex items-center justify-center shadow-xl mb-6">
              <Sparkles className="w-10 h-10 text-[#F9A11B]" />
           </div>
           <h3 className="text-2xl font-black text-[#2D6A4F] mb-4">You're on a roll!</h3>
           <p className="text-gray-500 font-bold max-w-sm mb-8">Ready to master a new topic today? Use your AI credits to get started.</p>
           <Link href="/dashboard/generate-notes">
            <Button className="bg-[#2D6A4F] text-white rounded-2xl px-8 py-6 font-black">Generate Now</Button>
           </Link>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) {
  return (
    <div className="bg-white border border-gray-100 p-4 px-6 rounded-3xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow cursor-default">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} shadow-inner`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{label}</p>
        <p className="text-lg font-black text-gray-900 leading-tight">{value}</p>
      </div>
    </div>
  );
}

function NoteItem({ note }: { note: any }) {
  const dateStr = note.createdAt?.toDate ? note.createdAt.toDate().toLocaleDateString() : 'Just now';

  return (
    <div className="flex items-center justify-between p-6 rounded-3xl bg-white border border-gray-100 hover:border-[#2D6A4F]/20 hover:shadow-xl hover:shadow-green-900/5 transition-all group">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-[#2D6A4F] group-hover:bg-[#2D6A4F] group-hover:text-white transition-colors duration-300">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <p className="text-lg font-black text-gray-800">{note.topic}</p>
          <div className="flex items-center gap-2 mt-1">
             <span className="text-[10px] font-black text-[#F9A11B] uppercase tracking-widest px-2 py-0.5 bg-orange-50 rounded-md">{note.subject}</span>
             <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> {dateStr}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl text-gray-400 hover:text-[#2D6A4F] hover:bg-green-50">
          <Eye className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
