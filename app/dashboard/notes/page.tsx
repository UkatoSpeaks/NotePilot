"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  Upload,
  Zap,
  Download,
  Copy,
  Plus,
} from "lucide-react";

export default function NotesPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [revisionMode, setRevisionMode] = useState(false);

  // Mock generated data based on AI_RULES.md
  const mockNotes = {
    title: "Laws of Motion",
    intro:
      "Sir Isaac Newton's laws are the foundation of classical mechanics, describing how objects move when forces act upon them.",
    concepts: [
      "First Law (Inertia): An object remains at rest or in motion unless acted upon.",
      "Second Law (Force): Force equals mass times acceleration (F = ma).",
      "Third Law (Action-Reaction): For every action, there is an equal and opposite reaction.",
    ],
    formulas: ["F = m * a", "p = m * v (Momentum)", "v = u + at"],
    questions: [
      "What is Inertia?",
      "State Newton's Second Law of Motion.",
      "Give an example of the Third Law in daily life.",
      "Calculate the force required to move a 5kg block at 2m/s².",
      "Why do we lean forward when a bus stops suddenly?",
    ],
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowResult(true);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {!showResult ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Generate <span className="gradient-text">Study Notes</span>
            </h1>
            <p className="text-white/50">
              Enter your chapter details or upload a PDF to get started.
            </p>
          </div>

          <div className="p-8 rounded-3xl glass-effect border border-white/5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">
                  Class / Grade
                </label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-all">
                  <option>Class 10</option>
                  <option>Class 11</option>
                  <option>Class 12</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. Physics"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">
                Chapter Name / Topic
              </label>
              <input
                type="text"
                placeholder="e.g. Laws of Motion"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition-all"
              />
            </div>

            <div className="p-12 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-all cursor-pointer group bg-white/2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Upload size={32} />
              </div>
              <div className="text-center">
                <p className="font-bold">Upload PDF or Textbook Image</p>
                <p className="text-sm text-white/40 mt-1">
                  Maximum file size 10MB
                </p>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Content...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Notes
                </>
              )}
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Result Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <button
              onClick={() => setShowResult(false)}
              className="text-white/50 hover:text-white flex items-center gap-2 text-sm"
            >
              <ArrowRight size={16} className="rotate-180" />
              Back to Input
            </button>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 p-1.5 glass-effect rounded-full border border-white/10">
                <button
                  onClick={() => setRevisionMode(false)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${!revisionMode ? "bg-primary text-white shadow-lg" : "text-white/40"}`}
                >
                  Standard
                </button>
                <button
                  onClick={() => setRevisionMode(true)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${revisionMode ? "bg-accent text-white shadow-lg" : "text-white/40"}`}
                >
                  <Zap size={12} />
                  Revision
                </button>
              </div>
              <button className="p-2.5 glass-effect rounded-xl text-white/70 hover:text-white border border-white/10">
                <Download size={18} />
              </button>
              <button className="p-2.5 glass-effect rounded-xl text-white/70 hover:text-white border border-white/10">
                <Copy size={18} />
              </button>
            </div>
          </div>

          {/* Notes Content */}
          <div
            className={`p-8 md:p-12 rounded-[32px] glass-effect border border-white/10 relative overflow-hidden transition-all duration-500 ${revisionMode ? "border-accent/30 shadow-[0_0_50px_rgba(244,114,182,0.1)]" : ""}`}
          >
            {revisionMode && (
              <div className="absolute top-0 right-0 p-8 text-accent/10">
                <Zap size={200} />
              </div>
            )}

            <div className="relative z-10 space-y-10">
              <header>
                <h1 className="text-4xl font-black mb-4">
                  {mockNotes.title}
                  {revisionMode && (
                    <span className="ml-4 text-accent text-base font-bold bg-accent/10 px-3 py-1 rounded-full uppercase tracking-widest">
                      Revision Mode
                    </span>
                  )}
                </h1>
                <p
                  className={`text-white/70 text-lg leading-relaxed ${revisionMode ? "italic border-l-4 border-accent pl-6" : ""}`}
                >
                  {mockNotes.intro}
                </p>
              </header>

              <section>
                <h2
                  className={`text-xl font-bold mb-6 flex items-center gap-2 ${revisionMode ? "text-accent" : "text-primary"}`}
                >
                  <BookOpen size={20} />
                  {revisionMode ? "Quick Memory Points" : "Key Concepts"}
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {mockNotes.concepts.map((concept, i) => (
                    <motion.div
                      key={i}
                      layout
                      className={`p-5 rounded-2xl border transition-all ${revisionMode ? "bg-accent/5 border-accent/10" : "bg-white/5 border-white/10"}`}
                    >
                      <span className="font-medium">{concept}</span>
                    </motion.div>
                  ))}
                </div>
              </section>

              <section>
                <h2
                  className={`text-xl font-bold mb-6 flex items-center gap-2 ${revisionMode ? "text-accent" : "text-secondary"}`}
                >
                  <Sparkles size={20} />
                  Important Formulas
                </h2>
                <div className="flex flex-wrap gap-4">
                  {mockNotes.formulas.map((formula, i) => (
                    <div
                      key={i}
                      className="px-6 py-4 bg-black/40 border border-white/5 rounded-2xl font-mono text-lg text-secondary"
                    >
                      {formula}
                    </div>
                  ))}
                </div>
              </section>

              {!revisionMode && (
                <section className="pt-8 border-t border-white/10">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
                    <Plus size={20} />
                    Exam Oriented Questions
                  </h2>
                  <div className="space-y-4">
                    {mockNotes.questions.map((q, i) => (
                      <div
                        key={i}
                        className="flex gap-4 items-start bg-white/5 p-4 rounded-xl border border-white/5"
                      >
                        <span className="w-6 h-6 bg-primary/20 text-primary rounded-lg flex items-center justify-center text-xs font-bold shrink-0">
                          {i + 1}
                        </span>
                        <p className="text-white/80">{q}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
