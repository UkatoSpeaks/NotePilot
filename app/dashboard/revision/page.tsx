"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Zap, 
  Rocket, 
  Brain, 
  Target, 
  CheckCircle2, 
  Flame,
  ArrowRight,
  RefreshCw,
  Trophy,
  Timer,
  Pause,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type RevisionState = "setup" | "active_review" | "completed";

import { useAuth } from "@/context/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function RevisionPage() {
  const { user } = useAuth();
  const [state, setState] = useState<RevisionState>("setup");
  const [notes, setNotes] = useState<any[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [cardsReviewed, setCardsReviewed] = useState(0);

  useEffect(() => {
    async function fetchNotes() {
      if (!user) return;
      try {
        const q = query(collection(db, "notes"), where("userId", "==", user.uid));
        const snap = await getDocs(q);
        const fetchedNotes = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotes(fetchedNotes);
        // Select all by default
        setSelectedTopics(fetchedNotes.map(n => n.id));
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    }
    fetchNotes();
  }, [user]);

  const activeCards = useMemo(() => {
    return notes
      .filter(n => selectedTopics.includes(n.id))
      .map(n => ({
        id: n.id,
        subject: n.subject,
        topic: n.topic,
        points: [
          n.content.definition,
          ...(n.content.keyConcepts || [])
        ]
      }));
  }, [notes, selectedTopics]);

  // Timer Effect
  useEffect(() => {
    let interval: any;
    if (state === "active_review" && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [state, isPaused, timeLeft]);

  const toggleTopic = (id: string) => {
    setSelectedTopics(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const startRevision = () => {
    if (selectedTopics.length === 0) return;
    setCardsReviewed(0);
    setCurrentCardIndex(0);
    setTimeLeft(60);
    setState("active_review");
  };

  const nextCard = () => {
    setCardsReviewed(prev => prev + 1);
    if (currentCardIndex < activeCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setState("completed");
  };

  const reset = () => {
    setState("setup");
    setSelectedTopics(notes.map(n => n.id));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <AnimatePresence mode="wait">
        {state === "setup" && (
          <motion.div 
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-12"
          >
            {/* Hero Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-[#F9A11B] text-[10px] font-black uppercase tracking-widest">
                  <Zap className="w-3 h-3 fill-current" /> High-Intensity Learning
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight">
                    Revision <span className="text-[#F9A11B]">Mode</span>
                </h1>
                <p className="text-xl text-gray-500 font-bold max-w-xl">
                    Blast through high-yield summaries of your recently learned topics. Perfect for pre-exam jitters or daily retention.
                </p>
              </div>
              
              <div className="flex items-center gap-6 bg-white p-6 rounded-4xl border border-gray-100 shadow-2xl shadow-orange-900/5">
                <div className="text-right">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Weekly Streak</p>
                  <p className="text-3xl font-black text-gray-900">4 Days</p>
                </div>
                <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                  <Flame className="w-8 h-8" />
                </div>
              </div>
            </header>

            <div className="grid lg:grid-cols-12 gap-10">
              {/* Setup Controls */}
              <div className="lg:col-span-8 space-y-10">
                <section className="bg-white p-10 rounded-5xl border border-gray-100 shadow-2xl shadow-green-900/5">
                   <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                     <Brain className="w-7 h-7 text-green-600" /> Choose Your Focus
                   </h3>
                   <div className="grid sm:grid-cols-2 gap-4">
                      {notes.length > 0 ? (
                        notes.map((item) => (
                          <div 
                            key={item.id}
                            onClick={() => toggleTopic(item.id)}
                            className={cn(
                              "p-6 rounded-3xl border-4 transition-all cursor-pointer flex items-center justify-between group",
                              selectedTopics.includes(item.id) 
                                ? "bg-green-50/50 border-green-500" 
                                : "bg-gray-50 border-transparent hover:bg-gray-100"
                            )}
                          >
                             <div className="flex items-center gap-4">
                                <div className={cn(
                                  "w-12 h-12 rounded-xl flex items-center justify-center text-white font-black",
                                  selectedTopics.includes(item.id) ? "bg-green-600" : "bg-gray-300"
                                )}>
                                   {item.subject[0]}
                                </div>
                                <div>
                                   <p className="font-black text-gray-900">{item.topic}</p>
                                   <p className="text-xs font-bold text-gray-400 uppercase">{item.subject}</p>
                                </div>
                             </div>
                             <div className={cn(
                               "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                               selectedTopics.includes(item.id) ? "border-green-600 bg-green-600 text-white" : "border-gray-200"
                             )}>
                                {selectedTopics.includes(item.id) && <CheckCircle2 className="w-4 h-4" />}
                             </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full p-20 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                          <p className="text-gray-400 font-bold italic">No notes created yet. Revision Mode requires at least one study note!</p>
                        </div>
                      )}
                   </div>
                </section>

                <div className="grid md:grid-cols-2 gap-8">
                  <RevisionTypeCard 
                      title="Lightning Review" 
                      desc="60 seconds per topic. No distractions." 
                      icon={<Clock className="w-6 h-6" />}
                      active={true}
                  />
                  <RevisionTypeCard 
                      title="Concept Mapping" 
                      desc="Visualize links between topics." 
                      icon={<Target className="w-6 h-6" />}
                      active={false}
                  />
                </div>
              </div>

              {/* Action Sidebar */}
              <div className="lg:col-span-4 space-y-8">
                <div className="bg-[#2D6A4F] p-10 rounded-5xl text-white shadow-2xl shadow-green-900/20 relative overflow-hidden">
                   <div className="relative z-10 space-y-8">
                      <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                         <Rocket className="w-8 h-8 text-[#F9A11B]" />
                      </div>
                      <div className="space-y-4">
                         <h4 className="text-3xl font-black leading-tight">Ready for a Power Session?</h4>
                         <p className="text-white/60 font-bold">You have {selectedTopics.length} topics ready for review. This session will take about {selectedTopics.length * 2} minutes.</p>
                      </div>
                      <Button 
                        onClick={startRevision}
                        disabled={selectedTopics.length === 0}
                        className="w-full bg-[#F9A11B] hover:bg-white hover:text-[#2D6A4F] text-white rounded-2xl py-8 text-xl font-black shadow-2xl shadow-orange-500/20 transition-all border-none flex items-center justify-center gap-3"
                      >
                         Initiate Blast Off
                         <ArrowRight className="w-6 h-6" />
                      </Button>
                   </div>
                   <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
                </div>

                <div className="p-8 rounded-4xl bg-white border border-gray-100 flex gap-6 items-center">
                   <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 italic font-black text-2xl">i</div>
                   <div>
                      <p className="font-black text-gray-900">Expert Tip</p>
                      <p className="text-sm font-bold text-gray-400 leading-relaxed">Early morning revisions lead to 25% better long-term retention according to neural studies.</p>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {state === "active_review" && (
          <motion.div 
            key="active"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="max-w-4xl mx-auto space-y-10"
          >
             {/* Progress Info */}
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                   <div className="relative w-20 h-20">
                      <svg className="w-full h-full transform -rotate-90">
                         <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                         <circle 
                           cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="8" fill="transparent" 
                           strokeDasharray={220}
                           strokeDashoffset={220 - (220 * (cardsReviewed + 1)) / activeCards.length}
                           className="text-[#F9A11B] transition-all duration-500" 
                           strokeLinecap="round"
                         />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-black text-gray-900">
                         {cardsReviewed + 1}/{activeCards.length}
                      </div>
                   </div>
                   <div>
                      <h2 className="text-2xl font-black text-gray-900">Current Topic</h2>
                      <p className="text-orange-500 font-black uppercase tracking-widest">{activeCards[currentCardIndex].subject}</p>
                   </div>
                </div>

                <div className="flex items-center gap-4">
                   <div className="bg-gray-50 px-6 py-3 rounded-2xl flex items-center gap-3 border border-gray-100">
                      <Timer className={cn("w-5 h-5", timeLeft < 10 ? "text-red-500 animate-pulse" : "text-gray-400")} />
                      <span className={cn("text-2xl font-black font-mono", timeLeft < 10 ? "text-red-500" : "text-gray-900")}>
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                      </span>
                   </div>
                   <Button 
                     variant="ghost" 
                     size="icon" 
                     onClick={() => setIsPaused(!isPaused)}
                     className="w-14 h-14 rounded-2xl bg-gray-50 hover:bg-gray-100"
                   >
                      {isPaused ? <Play className="w-6 h-6 fill-current text-green-600" /> : <Pause className="w-6 h-6 fill-current text-gray-400" />}
                   </Button>
                </div>
             </div>

             {/* Review Content Card */}
             <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentCardIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-white p-12 md:p-20 rounded-[64px] shadow-[0_50px_100px_-20px_rgba(45,106,79,0.1)] border border-gray-100 relative z-10"
                  >
                    <div className="space-y-12">
                       <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                         {activeCards[currentCardIndex].topic}
                       </h3>
                       <div className="space-y-8">
                          {activeCards[currentCardIndex].points.map((point, i) => (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 + i * 0.1 }}
                              key={i} 
                              className="flex gap-6 group"
                            >
                               <div className="mt-1.5 w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 text-orange-600">
                                  <CheckCircle2 className="w-5 h-5" />
                               </div>
                               <p className="text-xl md:text-2xl text-gray-600 font-bold leading-relaxed">{point}</p>
                            </motion.div>
                          ))}
                       </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                {/* Decorative Stack Effect */}
                <div className="absolute top-8 left-8 -right-8 -bottom-8 bg-gray-50 rounded-[64px] -z-10 border border-gray-100/50" />
                <div className="absolute top-16 left-16 -right-16 -bottom-16 bg-gray-100/30 rounded-[64px] -z-20" />
             </div>

             <div className="flex justify-between items-center gap-6">
                <Button 
                  onClick={reset}
                  variant="ghost" 
                  className="rounded-2xl px-10 h-16 font-black text-gray-400 hover:text-red-500"
                >
                   Quit Session
                </Button>
                <Button 
                  onClick={nextCard}
                  className="bg-[#2D6A4F] hover:bg-black text-white rounded-2xl px-12 h-20 text-2xl font-black shadow-2xl shadow-green-900/20 gap-4 flex-1 max-w-sm"
                >
                   {currentCardIndex === activeCards.length - 1 ? "Finish Revision" : "Next Topic"}
                   <ArrowRight className="w-8 h-8" />
                </Button>
             </div>
          </motion.div>
        )}

        {state === "completed" && (
          <motion.div 
            key="completed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-20 bg-white rounded-[64px] border border-gray-100 shadow-2xl shadow-green-900/5 p-12"
          >
             <div className="relative mb-12">
                <div className="w-40 h-40 bg-orange-100 rounded-[48px] flex items-center justify-center text-orange-600">
                   <Trophy className="w-20 h-20" />
                </div>
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.3 }}
                  className="absolute -bottom-4 -right-4 w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center border-4 border-white text-white"
                >
                   <CheckCircle2 className="w-8 h-8" />
                </motion.div>
             </div>
             
             <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">Mission Accomplished!</h2>
             <p className="text-xl text-gray-500 font-bold mb-12">You just reviewed {activeCards.length} high-yield topics in record time. Your brain is officially on fire.</p>
             
             <div className="grid grid-cols-2 gap-6 w-full mb-12">
                <div className="bg-gray-50 p-8 rounded-4xl border border-gray-100">
                   <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Points Earned</p>
                   <p className="text-4xl font-black text-green-600">+1200</p>
                </div>
                <div className="bg-gray-50 p-8 rounded-4xl border border-gray-100">
                   <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Confidence Level</p>
                   <p className="text-4xl font-black text-orange-500">92%</p>
                </div>
             </div>

             <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Button 
                  onClick={reset}
                  className="flex-1 bg-[#2D6A4F] hover:bg-black text-white rounded-2xl py-8 text-xl font-black shadow-2xl shadow-green-900/20 gap-3"
                >
                   Done for Now
                </Button>
                <Button 
                  onClick={startRevision}
                  variant="outline"
                  className="flex-1 rounded-2xl py-8 text-xl font-black border-2 gap-3"
                >
                   <RefreshCw className="w-6 h-6" />
                   Repeat Session
                </Button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RevisionTypeCard({ title, desc, icon, active }: { title: string, desc: string, icon: React.ReactNode, active: boolean }) {
    return (
        <div className={cn(
            "p-8 rounded-4xl border-2 transition-all group relative overflow-hidden",
            active ? "bg-white border-[#2D6A4F] shadow-xl" : "bg-gray-50/50 border-transparent opacity-60 grayscale"
        )}>
            <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:rotate-6 transition-transform",
                active ? "bg-[#2D6A4F] text-white" : "bg-gray-200 text-gray-400"
            )}>
                {icon}
            </div>
            <h4 className="text-xl font-black text-gray-900 mb-2">{title}</h4>
            <p className="text-sm font-bold text-gray-400 leading-relaxed mb-6">{desc}</p>
            {active ? (
                <div className="inline-flex items-center gap-2 text-[#2D6A4F] font-black text-sm uppercase tracking-widest">
                    Selected <CheckCircle2 className="w-4 h-4" />
                </div>
            ) : (
                <span className="text-xs font-black text-gray-300 uppercase tracking-[0.2em]">Coming Soon</span>
            )}
        </div>
    );
}

function StatItem({ label, value, color }: { label: string, value: string, color: string }) {
    return (
        <div className="bg-white p-8 rounded-4xl border border-gray-100 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{label}</p>
            <p className={cn("text-4xl font-black", color)}>{value}</p>
        </div>
    );
}
