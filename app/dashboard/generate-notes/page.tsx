"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  School, 
  Target,
  FileText,
  RefreshCw,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { NoteViewer } from "@/components/ui/note-viewer";

const MOCK_NOTES = {
  title: "Cell Division & Genetics",
  subject: "Biology",
  sections: [
    {
      title: "Introduction to Mitosis",
      content: [
        "Mitosis is the process of cell division that results in two genetically identical daughter cells.",
        "It consists of four main phases: Prophase, Metaphase, Anaphase, and Telophase.",
        "Essential for growth, repair, and asexual reproduction in multicellular organisms."
      ]
    },
    {
      title: "Key Phases of Mitosis",
      content: [
        "Prophase: Chromosomes condense, nuclear envelope breaks down.",
        "Metaphase: Chromosomes align at the metaphase plate (cell equator).",
        "Anaphase: Sister chromatids separate and move to opposite poles.",
        "Telophase: Nuclear envelopes reform, chromosomes decondense."
      ]
    },
    {
      title: "Genetic Variation in Meiosis",
      content: [
        "Unlike mitosis, meiosis results in four genetically diverse haploid cells.",
        "Crossing over occurs during Prophase I, swapping genetic material between homologous chromosomes.",
        "Independent assortment further increases genetic diversity among offspring."
      ]
    }
  ]
};

export default function GenerateNotesPage() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [formData, setFormData] = useState({
    class: "",
    subject: "",
    topic: "",
    board: ""
  });

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation time
    setTimeout(() => {
      setIsGenerating(false);
      setShowResult(true);
    }, 2500);
  };

  const reset = () => {
    setShowResult(false);
    setFormData({ class: "", subject: "", topic: "", board: "" });
    setStep(1);
  };

  if (showResult) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Your Generated Notes</h1>
            <Button variant="outline" onClick={reset} className="rounded-2xl gap-2 font-bold">
                <RefreshCw className="w-4 h-4" /> Start New
            </Button>
        </header>
        <NoteViewer {...MOCK_NOTES} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Generate Smart Notes</h1>
        <p className="text-secondary max-w-sm mx-auto font-medium">Everything you need to master your subject, extracted in seconds.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-border shadow-2xl shadow-primary/5 p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Form Side */}
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-secondary">
                <School className="w-4 h-4" /> Select Class
              </label>
              <div className="grid grid-cols-5 gap-3">
                {["8", "9", "10", "11", "12"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setFormData({...formData, class: c})}
                    className={cn(
                      "py-3 rounded-2xl border-2 font-bold transition-all",
                      formData.class === c 
                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                        : "border-muted hover:border-primary/30"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
               <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-secondary">
                <BookOpen className="w-4 h-4" /> Subject & Board
              </label>
              <div className="grid grid-cols-2 gap-4">
                <select 
                   value={formData.subject}
                   onChange={(e) => setFormData({...formData, subject: e.target.value})}
                   className="bg-muted border-none rounded-2xl p-4 font-bold outline-none ring-primary/20 focus:ring-4 transition-all"
                >
                    <option value="">Subject</option>
                    <option value="Physics">Physics</option>
                    <option value="Biology">Biology</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Math">Math</option>
                    <option value="History">History</option>
                </select>
                <select 
                    value={formData.board}
                    onChange={(e) => setFormData({...formData, board: e.target.value})}
                    className="bg-muted border-none rounded-2xl p-4 font-bold outline-none ring-primary/20 focus:ring-4 transition-all"
                >
                    <option value="">Board</option>
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="State">State Board</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
               <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-secondary">
                <Target className="w-4 h-4" /> Topic or Chapter
              </label>
              <input 
                type="text" 
                placeholder="e.g. Newton's Laws of Motion"
                value={formData.topic}
                onChange={(e) => setFormData({...formData, topic: e.target.value})}
                className="w-full bg-muted border-none rounded-2xl p-4 font-bold outline-none ring-primary/20 focus:ring-4 transition-all"
              />
            </div>

            <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !formData.topic}
                size="lg" 
                className="w-full rounded-2xl py-8 text-xl font-bold gap-3 shadow-xl shadow-primary/20"
            >
              {isGenerating ? (
                <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Generating your notes...
                </>
              ) : (
                <>
                    <Sparkles className="w-6 h-6 fill-current" />
                    Generate AI Notes
                </>
              )}
            </Button>
          </div>

          {/* Visual Side */}
          <div className="hidden md:flex flex-col items-center justify-center bg-muted/50 rounded-4xl p-8 border border-dashed border-border relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-50">
                 <Sparkles className="w-20 h-20 text-primary blur-3xl" />
             </div>
             
             <AnimatePresence mode="wait">
               {isGenerating ? (
                 <motion.div 
                    key="generating"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="flex flex-col items-center text-center"
                 >
                    <div className="relative mb-8">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="w-32 h-32 rounded-full border-4 border-primary/20 border-t-primary"
                        />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <FileText className="w-10 h-10 text-primary" />
                        </div>
                    </div>
                    <p className="font-bold text-xl mb-2">Analyzing Topic...</p>
                    <p className="text-sm text-secondary px-8">Our AI is researching important points from {formData.board || "your"} curriculum.</p>
                 </motion.div>
               ) : (
                 <motion.div 
                    key="idle"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col items-center text-center"
                 >
                    <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-8">
                        <ArrowRight className="w-10 h-10 text-primary" />
                    </div>
                    <p className="font-bold text-xl mb-2">Ready to Start?</p>
                    <p className="text-sm text-secondary px-8">Fill in your details and let's create the best study material for you.</p>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
