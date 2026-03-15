"use client";

import React from "react";
import { Copy, Download, Share2, Sparkles, Bookmark } from "lucide-react";
import { Button } from "./button";
import { motion } from "framer-motion";

import { NoteStructure } from "@/lib/firestore";

interface NoteViewerProps {
  title: string;
  subject: string;
  content: NoteStructure;
}

export function NoteViewer({ title, subject, content }: NoteViewerProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] border border-border overflow-hidden shadow-2xl shadow-primary/5"
    >
      <div className="p-8 md:p-12 border-b border-dashed border-border flex flex-col md:flex-row md:items-center justify-between gap-6 bg-linear-to-br from-white to-muted/30">
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
          <Button variant="outline" size="icon" className="rounded-2xl">
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-2xl">
            <Bookmark className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-2xl">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button className="rounded-2xl gap-3 font-bold px-6">
            <Download className="w-4 h-4" /> Export PDF
          </Button>
        </div>
      </div>

      <div className="p-8 md:p-12 space-y-12 max-w-4xl mx-auto">
        {/* Definition Section */}
        <motion.section 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-primary">
            <div className="w-2 h-8 bg-primary rounded-full" />
            Core Definition
          </h3>
          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
            <p className="text-secondary leading-relaxed font-bold text-lg italic">
              "{content.definition}"
            </p>
          </div>
        </motion.section>

        {/* Key Concepts */}
        <motion.section 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
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
        </motion.section>

        {/* Examples */}
        <motion.section 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
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
        </motion.section>

        {/* Formulas */}
        {content.formulas && content.formulas.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
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
          </motion.section>
        )}

        {/* Exam Questions */}
        <motion.section 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-red-500">
            <div className="w-2 h-8 bg-red-500 rounded-full" />
            Exam Practice Questions
          </h3>
          <div className="space-y-3">
            {content.examQuestions.map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-red-50 font-bold text-red-700 flex items-center gap-3">
                 <span className="w-6 h-6 rounded-lg bg-red-100 flex items-center justify-center text-[10px] shrink-0">Q{i+1}</span>
                 {item}
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      <div className="p-8 bg-muted/50 border-t border-border mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-3xl bg-white p-6 border border-primary/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold">Summary Flashcards are ready!</p>
              <p className="text-sm text-secondary">We also created 12 flashcards based on these notes.</p>
            </div>
          </div>
          <Button className="rounded-2xl font-bold">Review Cards</Button>
        </div>
      </div>
    </motion.div>
  );
}

