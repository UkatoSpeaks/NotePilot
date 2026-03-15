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
  Loader2,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { NoteViewer } from "@/components/ui/note-viewer";
import { useAuth } from "@/context/AuthContext";
import { saveNote, getNote } from "@/lib/firestore";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

const MOCK_NOTES = {
  definition: "Mitosis is a fundamental process for life on Earth, where a single cell divides into two genetically identical daughter cells, maintaining the chromosome number of the original cell.",
  keyConcepts: [
    "Four phases of mitosis (Prophase, Metaphase, Anaphase, Telophase)",
    "Cytokinesis (splitting of the cytoplasm)",
    "Role in growth, tissue repair, and asexual reproduction"
  ],
  examples: [
    "Skin cells dividing to heal a wound",
    "Root tip growth in plants",
    "Single-layer tissue replacement in the digestive tract"
  ],
  examQuestions: [
    "Distinguish between Cytokinesis and Mitosis.",
    "Explain the significance of the Metaphase plate.",
    "What would happen if sister chromatids fail to separate during Anaphase?"
  ]
};

export default function GenerateNotesPage() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [formData, setFormData] = useState({
    class: "",
    subject: "",
    topic: "",
    board: "",
    questionType: "Short Answer"
  });

  const [generatedNote, setGeneratedNote] = useState<any>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const noteId = searchParams.get("noteId");

  useEffect(() => {
    async function checkUrl() {
      if (noteId && !generatedNote) {
        setIsGenerating(true);
        try {
          const note = await getNote(noteId);
          if (note) {
            setGeneratedNote(note.content);
            setFormData({
               class: note.class || "",
               subject: note.subject || "",
               topic: note.topic || "",
               board: note.board || "",
               questionType: "Short Answer"
            });
            setShowResult(true);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsGenerating(false);
        }
      }
    }
    checkUrl();
  }, [noteId]);

  const handleGenerate = async () => {
    if (!user) return;
    setIsGenerating(true);
    
    try {
      const response = await fetch("/api/generate-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          subject: formData.subject,
          topic: formData.topic,
          class: formData.class,
          board: formData.board,
          questionType: formData.questionType
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate notes");
      }

      const result = await response.json();
      if (result.success) {
        setGeneratedNote(result.content);
        setShowResult(true);
        router.push(`?noteId=${result.noteId}`, { scroll: false });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error generating note:", error);
      alert("Something went wrong while generating your notes.");
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setShowResult(false);
    setFormData({ class: "", subject: "", topic: "", board: "", questionType: "Short Answer" });
    setStep(1);
    router.push("/dashboard/generate-notes");
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
        <NoteViewer 
          title={formData.topic} 
          subject={formData.subject} 
          content={generatedNote} 
        />
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

            <div className="space-y-4">
               <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-secondary">
                <HelpCircle className="w-4 h-4" /> Question Type
              </label>
              <div className="flex gap-2">
                {["MCQ", "Short Answer", "Long Answer"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFormData({...formData, questionType: type})}
                    className={cn(
                      "flex-1 py-3 rounded-2xl border-2 font-bold text-xs transition-all",
                      formData.questionType === type 
                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                        : "border-muted hover:border-primary/30 text-secondary"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
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

