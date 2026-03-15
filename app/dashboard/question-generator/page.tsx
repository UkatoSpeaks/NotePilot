"use client";

import React, { useState, useEffect } from "react";
import { 
  MessageSquareQuote, 
  Sparkles, 
  Plus, 
  Brain, 
  Trophy, 
  Clock, 
  ChevronLeft, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen,
  HelpCircle,
  Eye,
  EyeOff,
  RotateCcw,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type GenerationStep = "setup" | "generating" | "active";


import { useAuth } from "@/context/AuthContext";
import { saveQuestions, getUserUsage } from "@/lib/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function QuestionGeneratorPage() {
  const { user } = useAuth();
  const [step, setStep] = useState<GenerationStep>("setup");
  const [notes, setNotes] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState("Balanced");
  const [qType, setQType] = useState<string[]>(["Subjective"]);
  const [showAnswers, setShowAnswers] = useState<number[]>([]);
  const [usage, setUsage] = useState<any>(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        // Fetch Notes for topics
        const notesQ = query(collection(db, "notes"), where("userId", "==", user.uid));
        const notesSnap = await getDocs(notesQ);
        setNotes(notesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Fetch Total Questions Sets
        const qSetsQ = query(collection(db, "questions"), where("userId", "==", user.uid));
        const qSetsSnap = await getDocs(qSetsQ);
        setTotalQuestions(qSetsSnap.size);

        // Usage info
        getUserUsage(user.uid)
          .then(setUsage)
          .catch(e => console.warn("QuestionGenerator: Error fetching usage", e));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [user]);

  const handleGenerate = async () => {
    if (!selectedTopic || !user) return;
    setStep("generating");

    const topicData = notes.find(n => n.id === selectedTopic);
    const targetTopic = topicData?.topic || "Custom Topic";
    const targetSubject = topicData?.subject || "General";
    
    try {
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          topic: targetTopic,
          subject: targetSubject,
          difficulty: difficulty
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate questions");
      }

      const result = await response.json();
      if (result.success) {
        setGeneratedQuestions(result.questions);
        setStep("active");
        setTotalQuestions(prev => prev + 1);
      } else {
        throw new Error(result.error || "Unknown error occurred");
      }
    } catch (error: any) {
      console.error("Error generating questions:", error);
      alert(error.message || "Something went wrong while generating questions.");
      setStep("setup");
    }
  };

  const toggleAnswer = (id: number) => {
    setShowAnswers(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const reset = () => {
    setStep("setup");
    setSelectedTopic(null);
    setShowAnswers([]);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <AnimatePresence mode="wait">
        {step === "setup" && (
          <motion.div 
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-12"
          >
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-widest">
                  <Brain className="w-3 h-3 fill-current" /> Custom Practice Lab
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight">
                    Question <span className="text-amber-500">Generator</span>
                </h1>
                <p className="text-xl text-gray-500 font-bold max-w-xl">
                    Generate exam-standard questions based on your curriculum. Practice with AI-crafted model answers.
                </p>
              </div>
              
              <div className="flex items-center gap-6 bg-white p-6 rounded-4xl border border-gray-100 shadow-2xl shadow-amber-900/5">
                <div className="text-right">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Sets Created</p>
                  <p className="text-3xl font-black text-gray-900">{totalQuestions} Practice Sets</p>
                </div>
                <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                  <Trophy className="w-8 h-8" />
                </div>
              </div>
            </header>

            <div className="grid lg:grid-cols-12 gap-10">
              {/* Setup Main */}
              <div className="lg:col-span-8 space-y-12">
                <section className="space-y-6">
                  <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center text-sm">1</span>
                    Select a Topic
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {notes.length > 0 ? (
                      notes.map((note) => (
                        <button 
                          key={note.id}
                          onClick={() => setSelectedTopic(note.id)}
                          className={cn(
                            "p-6 rounded-3xl border-4 text-left transition-all relative group overflow-hidden",
                            selectedTopic === note.id 
                              ? "bg-amber-50/50 border-amber-500 shadow-xl shadow-amber-100" 
                              : "bg-white border-gray-100 hover:border-amber-200"
                          )}
                        >
                           <p className="text-xs font-black text-amber-600 uppercase tracking-widest mb-1">{note.subject}</p>
                           <h4 className="text-xl font-black text-gray-900">{note.topic}</h4>
                           {selectedTopic === note.id && <CheckCircle2 className="absolute top-4 right-4 w-6 h-6 text-amber-500" />}
                        </button>
                      ))
                    ) : (
                      <div className="col-span-full p-20 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold italic">No notes found. Create a note first to generate practice questions!</p>
                      </div>
                    )}
                  </div>
                </section>

                <section className="space-y-6">
                  <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center text-sm">2</span>
                    Difficulty & Style
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8 bg-white p-10 rounded-5xl border border-gray-100 shadow-2xl shadow-gray-400/5">
                     <div className="space-y-4">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Challenge Level</label>
                        <div className="flex gap-2">
                           {["Easy", "Balanced", "Expert"].map((lvl) => (
                             <button 
                                key={lvl}
                                onClick={() => setDifficulty(lvl)}
                                className={cn(
                                  "flex-1 py-4 rounded-2xl font-black transition-all",
                                  difficulty === lvl ? "bg-gray-900 text-white shadow-xl" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                                )}
                             >
                               {lvl}
                             </button>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Question Type</label>
                        <div className="flex gap-2">
                           {["Subjective", "Numerical", "Theory"].map((type) => (
                             <button 
                                key={type}
                                onClick={() => setQType([type])}
                                className={cn(
                                  "flex-1 py-4 rounded-2xl font-black transition-all",
                                  qType.includes(type) ? "bg-amber-500 text-white shadow-xl" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                                )}
                             >
                               {type}
                             </button>
                           ))}
                        </div>
                     </div>
                  </div>
                </section>
              </div>

              {/* Action Sidebar */}
              <div className="lg:col-span-4 space-y-8">
                 <div className="bg-[#1A1A1A] p-10 rounded-5xl text-white shadow-2xl shadow-gray-900/20 relative overflow-hidden group">
                   <div className="relative z-10 space-y-10">
                      <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                         <Sparkles className="w-8 h-8 text-amber-400" />
                      </div>
                      <div className="space-y-4">
                         <h4 className="text-3xl font-black leading-tight">Elite Board Prep</h4>
                         <p className="text-gray-500 font-bold leading-relaxed">Our AI analyzes past board papers to generate the most probable questions for your session.</p>
                      </div>
                      <Button 
                        onClick={handleGenerate}
                        disabled={!selectedTopic}
                        className="w-full bg-amber-500 hover:bg-white hover:text-gray-900 text-white rounded-2xl py-8 text-xl font-black shadow-2xl shadow-amber-500/20 transition-all border-none gap-3"
                      >
                         Launch Generator
                         <ArrowRight className="w-6 h-6" />
                      </Button>
                   </div>
                   <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-700" />
                 </div>

                 <div className="p-8 rounded-4xl bg-amber-50/50 border border-amber-100 flex gap-6 items-start">
                    <ShieldCheck className="w-8 h-8 text-amber-600 shrink-0" />
                    <div>
                        <p className="font-black text-gray-900">Board Compliant</p>
                        <p className="text-sm font-bold text-gray-400 leading-relaxed">Questions follow CBSE, ICSE, and IGCSE blueprints for {new Date().getFullYear()} exams.</p>
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === "generating" && (
          <motion.div 
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white/80 backdrop-blur-2xl flex items-center justify-center p-6"
          >
            <div className="max-w-md w-full text-center space-y-10">
               <div className="relative w-40 h-40 mx-auto">
                   <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                     className="absolute inset-0 border-[6px] border-amber-100 rounded-[48px]"
                   />
                   <motion.div 
                     animate={{ rotate: -360 }}
                     transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                     className="absolute inset-4 border-[6px] border-amber-500 border-t-transparent rounded-[32px]"
                   />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-amber-600 animate-pulse" />
                   </div>
               </div>
               <div className="space-y-4">
                  <h2 className="text-4xl font-black text-gray-900 tracking-tight">AI is Drafting...</h2>
                  <div className="flex flex-col gap-2">
                     <p className="text-lg font-bold text-gray-400 animate-pulse">Analyzing NCERT Syllabus</p>
                     <p className="text-sm font-black text-amber-500 uppercase tracking-widest">Generating marks distribution</p>
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {step === "active" && (
          <motion.div 
            key="active"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-10"
          >
             <header className="flex items-center justify-between">
                <Button 
                  onClick={reset}
                  variant="ghost" 
                  className="rounded-xl px-4 py-2 font-black text-gray-400 hover:text-gray-900 gap-2"
                >
                   <ChevronLeft className="w-5 h-5" /> New Set
                </Button>
                <div className="flex items-center gap-6">
                   <div className="bg-gray-50 px-6 py-3 rounded-2xl flex items-center gap-3 border border-gray-100">
                      <Zap className="w-5 h-5 text-amber-600" />
                      <span className="text-lg font-black text-gray-900">Study Mode</span>
                   </div>
                   <Button 
                     onClick={handleGenerate}
                     variant="outline" 
                     className="rounded-2xl h-12 px-6 font-black border-2 gap-2"
                   >
                     <RotateCcw className="w-4 h-4" /> Regenerate
                   </Button>
                </div>
             </header>

             <div className="grid lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                  {generatedQuestions.map((q, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white p-10 rounded-5xl border border-gray-100 shadow-2xl shadow-gray-900/5 group"
                    >
                       <div className="flex items-start justify-between gap-6 mb-8">
                          <div className="space-y-2">
                             <div className="flex gap-2">
                                <span className="px-3 py-1 bg-gray-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest leading-none flex items-center">{q.type}</span>
                                <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest leading-none flex items-center">{q.marks} Marks</span>
                             </div>
                             <h3 className="text-2xl font-black text-gray-900 leading-snug">
                                {q.question}
                             </h3>
                          </div>
                          <span className="shrink-0 w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center font-black text-gray-400 group-hover:bg-amber-500 group-hover:text-white transition-all">
                             Q{idx + 1}
                          </span>
                       </div>

                       <div className="pt-8 border-t border-dashed border-gray-100 space-y-6">
                          <Button 
                            variant="ghost" 
                            onClick={() => toggleAnswer(idx)}
                            className={cn(
                              "w-full h-14 rounded-2xl font-black flex items-center justify-between px-6 transition-all",
                              showAnswers.includes(idx) ? "bg-amber-50 text-amber-600" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                            )}
                          >
                             <div className="flex items-center gap-2">
                               {showAnswers.includes(idx) ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                               {showAnswers.includes(idx) ? "Hide Model Answer" : "Reveal Model Answer"}
                             </div>
                             <CheckCircle2 className={cn("w-5 h-5 transition-opacity", showAnswers.includes(idx) ? "opacity-100" : "opacity-0")} />
                          </Button>

                          <AnimatePresence>
                            {showAnswers.includes(idx) && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                 <div className="bg-amber-50/30 p-8 rounded-3xl border border-amber-100/50">
                                    <p className="font-black text-amber-700 uppercase tracking-widest text-[10px] mb-4">Official Model Answer</p>
                                    <div className="text-lg text-amber-900/80 font-bold leading-relaxed space-y-4">
                                       {q.options && (
                                         <div className="grid grid-cols-2 gap-3 mb-4">
                                            {q.options.map((opt: string, i: number) => (
                                              <div key={i} className={cn(
                                                "p-4 rounded-xl border-2 font-black transition-all",
                                                opt.startsWith(q.answer) || opt === q.answer
                                                  ? "bg-green-50 border-green-500 text-green-700"
                                                  : "bg-white border-gray-100 text-gray-400"
                                              )}>
                                                {opt}
                                              </div>
                                            ))}
                                         </div>
                                       )}
                                       <p>{q.answer}</p>
                                    </div>
                                 </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                       </div>
                    </motion.div>
                  ))}
                </div>

                <div className="lg:col-span-4 space-y-8">
                   <div className="p-8 rounded-5xl bg-white border border-gray-100 space-y-8 sticky top-28 shadow-2xl shadow-gray-400/5">
                      <div className="space-y-2">
                         <h4 className="text-2xl font-black text-gray-900 tracking-tight">Practice Summary</h4>
                         <p className="text-sm font-bold text-gray-400">Track your progress for this session.</p>
                      </div>

                      <div className="space-y-4">
                         <ProgressStat label="Questions Ready" value="15" icon={<BookOpen className="w-5 h-5" />} color="text-blue-500" />
                         <ProgressStat label="Difficulty" value={difficulty} icon={<Clock className="w-5 h-5" />} color="text-amber-500" />
                         <ProgressStat label="Average Target" value="85%" icon={<Trophy className="w-5 h-5" />} color="text-green-500" />
                      </div>

                      <Button className="w-full bg-gray-900 hover:bg-black text-white rounded-2xl py-8 text-lg font-black shadow-xl transition-all">
                         Download as PDF
                      </Button>
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProgressStat({ label, value, icon, color }: { label: string, value: string, icon: React.ReactNode, color: string }) {
  return (
    <div className="flex items-center justify-between p-5 rounded-3xl bg-gray-50 border border-gray-100">
       <div className="flex items-center gap-4">
          <div className={cn("w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center", color)}>
            {icon}
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className="text-lg font-black text-gray-900 leading-none">{value}</p>
          </div>
       </div>
    </div>
  );
}
