"use client";

import React from "react";
import { Copy, Download, Share2, Sparkles, Bookmark, Check, Share, ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "./button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { NoteStructure } from "@/lib/firestore";

interface NoteViewerProps {
  title: string;
  subject: string;
  content: NoteStructure;
}

export function NoteViewer({ title, subject, content }: NoteViewerProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [viewMode, setViewMode] = useState<"notes" | "flashcards">("notes");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const flashcards = content.flashcards || [];

  const handleCopy = async () => {
    const text = `
${title} (${subject})
--------------------------
DEFINITION:
${content.definition}

KEY CONCEPTS:
${content.keyConcepts.map(c => `- ${c}`).join('\n')}

EXAMPLES:
${content.examples.map(e => `- ${e}`).join('\n')}

EXAM QUESTIONS:
${content.examQuestions.map((q: any, i: number) => {
  const qText = typeof q === 'string' ? q : q.question;
  const aText = typeof q === 'string' ? '' : `\nAnswer: ${q.answer}`;
  return `Q${i+1}: ${qText}${aText}`;
}).join('\n\n')}
    `.trim();

    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `NotePilot: ${title}`,
          text: `Check out these smart notes on ${title}!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share failed", err);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
        setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
        setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }, 150);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] border border-border overflow-hidden shadow-2xl shadow-primary/5 print:shadow-none print:border-none print:rounded-none"
    >
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; padding: 0 !important; }
          .print-container { padding: 0 !important; margin: 0 !important; }
        }
        .perspective-1000 {
           perspective: 1000px;
        }
        .transform-style-3d {
           transform-style: preserve-3d;
        }
        .backface-hidden {
           backface-visibility: hidden;
        }
        .rotate-y-180 {
           transform: rotateY(180deg);
        }
      `}</style>
      
      <div className="p-8 md:p-12 border-b border-dashed border-border flex flex-col md:flex-row md:items-center justify-between gap-6 bg-linear-to-br from-white to-muted/30 no-print">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">{subject}</span>
            <div className="flex items-center gap-1 text-secondary text-[10px] uppercase font-bold tracking-widest">
              <Sparkles className="w-3 h-3" /> AI Generated
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleCopy}
            className={cn("rounded-2xl transition-all", isCopied && "bg-green-50 border-green-200 text-green-600")}
          >
            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={cn("rounded-2xl transition-all", isBookmarked && "bg-amber-50 border-amber-200 text-amber-600")}
          >
            <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
          </Button>
          <Button variant="outline" size="icon" onClick={handleShare} className="rounded-2xl">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button onClick={handlePrint} className="rounded-2xl gap-3 font-bold px-6">
            <Download className="w-4 h-4" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Print Header */}
      <div className="hidden print:block p-12 border-b-2 border-gray-900 mb-10">
          <div className="flex justify-between items-end">
              <div>
                  <p className="text-secondary font-black uppercase tracking-widest text-xs mb-2">Study Guide / {subject}</p>
                  <h1 className="text-5xl font-black text-gray-900">{title}</h1>
              </div>
              <div className="text-right">
                  <p className="text-4xl font-black text-primary">NotePilot</p>
                  <p className="text-xs font-bold text-secondary">Generated by AI Smart Notes</p>
              </div>
          </div>
      </div>

      {/* Tabs / Mode Selector */}
      <div className="no-print border-b border-border flex p-1 bg-muted/20 mx-12 mt-8 rounded-2xl">
          <button 
            onClick={() => setViewMode("notes")}
            className={cn(
                "flex-1 py-3 rounded-xl font-bold text-sm transition-all",
                viewMode === "notes" ? "bg-white shadow-sm text-primary" : "text-secondary hover:text-primary"
            )}
          >
              Study Notes
          </button>
          <button 
            onClick={() => setViewMode("flashcards")}
            className={cn(
                "flex-1 py-3 rounded-xl font-bold text-sm transition-all",
                viewMode === "flashcards" ? "bg-white shadow-sm text-primary" : "text-secondary hover:text-primary"
            )}
          >
              Revision Flashcards
          </button>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "notes" ? (
          <motion.div 
            key="notes-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-8 md:p-12 space-y-12 max-w-4xl mx-auto"
          >
            {/* Definition Section */}
            <section>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-primary">
                <div className="w-2 h-8 bg-primary rounded-full" />
                Core Definition
              </h3>
              <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
                <p className="text-secondary leading-relaxed font-bold text-lg italic">
                  "{content.definition}"
                </p>
              </div>
            </section>

            {/* Key Concepts */}
            <section>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-primary">
                <div className="w-2 h-8 bg-primary rounded-full" />
                Key Concepts
              </h3>
              <ul className="space-y-4">
                {content.keyConcepts.map((item, i) => (
                  <li key={i} className="flex gap-4 group">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary group-hover:bg-primary transition-colors" />
                    </div>
                    <p className="text-secondary leading-relaxed font-medium">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Examples */}
            <section>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-orange-500">
                <div className="w-2 h-8 bg-orange-500 rounded-full" />
                Real-world Examples
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {content.examples.map((item, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-orange-50 border border-orange-100 font-bold text-orange-800 text-sm">
                    • {item}
                  </div>
                ))}
              </div>
            </section>

            {/* Formulas */}
            {content.formulas && content.formulas.length > 0 && (
              <section>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-secondary">
                  <div className="w-2 h-8 bg-secondary rounded-full" />
                  Important Formulas
                </h3>
                <div className="flex flex-wrap gap-4">
                  {content.formulas.map((item, i) => (
                    <div key={i} className="px-6 py-4 bg-gray-900 text-white rounded-2xl font-mono text-lg shadow-xl">
                      {item}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Exam Questions */}
            <section>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-red-500">
                <div className="w-2 h-8 bg-red-500 rounded-full" />
                Exam Practice Questions
              </h3>
              <div className="space-y-6">
                {content.examQuestions.map((item, i) => (
                  <QuestionItem key={i} index={i} item={item} />
                ))}
              </div>
            </section>

            {/* Bottom Promo */}
            {flashcards.length > 0 && (
                <div className="p-8 bg-muted/50 border-t border-border mt-12 no-print rounded-3xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl bg-white p-6 border border-primary/10">
                        <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-bold">Summary Flashcards are ready!</p>
                            <p className="text-sm text-secondary">We've created {flashcards.length} revision cards based on these notes.</p>
                        </div>
                        </div>
                        <Button 
                            onClick={() => setViewMode("flashcards")}
                            className="rounded-2xl font-bold px-8 py-6 h-auto bg-primary hover:bg-black transition-all"
                        >
                            Review Cards Now
                        </Button>
                    </div>
                </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="flashcards-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-8 md:p-12 flex flex-col items-center justify-center min-h-[500px]"
          >
            {flashcards.length > 0 ? (
                <div className="w-full max-w-md space-y-12">
                     <div className="flex justify-between items-center px-4">
                        <p className="text-secondary font-black uppercase tracking-widest text-xs">Card {currentCardIndex + 1} of {flashcards.length}</p>
                        <div className="flex gap-1">
                             {flashcards.map((_, i) => (
                                <div key={i} className={cn("w-2 h-2 rounded-full", i === currentCardIndex ? "bg-primary" : "bg-muted")} />
                             ))}
                        </div>
                     </div>

                     {/* Flashcard Component */}
                     <div className="perspective-1000 w-full h-80 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                        <motion.div 
                            className="w-full h-full relative transition-all duration-500 transform-style-3d shadow-xl rounded-[40px]"
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        >
                            {/* Front */}
                            <div className="absolute inset-0 backface-hidden bg-white border-2 border-primary/10 rounded-[40px] p-10 flex flex-col items-center justify-center text-center">
                                <p className="text-secondary/40 font-black text-[10px] uppercase tracking-[0.2em] mb-6">Question</p>
                                <h4 className="text-2xl font-black text-gray-900 leading-tight">
                                    {flashcards[currentCardIndex].question}
                                </h4>
                                <p className="mt-8 text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                    Click to reveal <Check className="w-3 h-3" />
                                </p>
                            </div>

                            {/* Back */}
                            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-primary rounded-[40px] p-10 flex flex-col items-center justify-center text-center">
                                <p className="text-white/40 font-black text-[10px] uppercase tracking-[0.2em] mb-6">Answer</p>
                                <h4 className="text-2xl font-black text-white leading-tight">
                                    {flashcards[currentCardIndex].answer}
                                </h4>
                                <p className="mt-8 text-white/60 font-medium text-xs">Click to flip back</p>
                            </div>
                        </motion.div>
                     </div>

                     <div className="flex items-center justify-center gap-6 no-print">
                        <Button 
                            variant="outline" 
                            onClick={prevCard}
                            className="w-16 h-16 rounded-full border-2 border-primary/20 hover:bg-primary/5 transition-all text-primary"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                        <Button 
                            onClick={nextCard}
                            className="w-16 h-16 rounded-full bg-primary hover:bg-black shadow-xl shadow-primary/20 text-white transition-all transform hover:scale-110 active:scale-95"
                        >
                            <ArrowRight className="w-6 h-6" />
                        </Button>
                     </div>
                </div>
            ) : (
                <div className="text-center space-y-6">
                    <p className="font-bold text-secondary">No flashcards found for these notes.</p>
                    <Button onClick={() => setViewMode("notes")} variant="outline" className="rounded-2xl">Go back to Notes</Button>
                </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function QuestionItem({ index, item }: { index: number, item: any }) {
    const [showAnswer, setShowAnswer] = useState(false);
    const q = typeof item === 'string' ? item : item.question;
    const a = typeof item === 'string' ? null : item.answer;

    return (
        <div className="flex flex-col gap-3 group">
            <div className="p-5 rounded-2xl bg-red-50/50 border border-red-100/50 font-bold text-red-900 flex items-start gap-4 transition-all group-hover:bg-red-50 group-hover:border-red-200">
                <span className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-xs shrink-0 font-black text-red-600 shadow-sm">Q{index + 1}</span>
                <div className="flex-1 space-y-4">
                    <p className="text-lg leading-relaxed">{q}</p>
                    
                    {a && (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowAnswer(!showAnswer);
                            }}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                showAnswer 
                                    ? "bg-gray-900 text-white shadow-lg" 
                                    : "bg-white text-red-600 border-2 border-red-100 hover:border-red-200 shadow-sm"
                            )}
                        >
                            {showAnswer ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            {showAnswer ? "Hide Answer" : "Show Model Answer"}
                        </button>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {showAnswer && a && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        className="overflow-hidden"
                    >
                        <div className="ml-12 p-6 rounded-2xl bg-orange-50 border-2 border-orange-100 shadow-xl shadow-orange-900/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                <Sparkles className="w-12 h-12 text-orange-500" />
                            </div>
                            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-orange-500 block mb-3">Crystal Clear Explanation</span>
                            <p className="text-orange-900 font-bold leading-relaxed text-sm">
                                {a}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
