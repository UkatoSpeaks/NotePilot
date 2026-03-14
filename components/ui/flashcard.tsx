"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, RotateCw } from "lucide-react";

interface FlashcardProps {
  front: string;
  back: string;
  category?: string;
}

export function Flashcard({ front, back, category }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
        className="relative w-full aspect-4/3 perspective-1000 cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 20 }}
        className="w-full h-full preserve-3d relative"
      >
        {/* Front Face */}
        <div className="absolute inset-0 backface-hidden bg-white border border-border rounded-[2.5rem] p-8 shadow-xl shadow-primary/5 flex flex-col justify-between group-hover:border-primary/20 transition-colors">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-muted text-secondary text-[10px] font-bold uppercase tracking-widest rounded-full">{category || "Concept"}</span>
            <RotateCw className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          
          <div className="flex-1 flex items-center justify-center text-center">
            <h3 className="text-xl md:text-2xl font-bold leading-tight">{front}</h3>
          </div>
          
          <div className="text-[10px] text-secondary font-bold uppercase tracking-widest text-center flex items-center justify-center gap-1">
             <Sparkles className="w-3 h-3 text-primary" /> Click to flip
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 backface-hidden bg-primary rounded-[2.5rem] p-8 shadow-xl shadow-primary/20 flex flex-col items-center justify-center text-center text-white rotate-y-180">
          <p className="text-lg md:text-xl font-medium leading-relaxed">
            {back}
          </p>
          <div className="absolute bottom-8 text-[10px] font-bold uppercase tracking-widest opacity-60">
             Tap to see question
          </div>
        </div>
      </motion.div>

      {/* CSS for Backface visibility and 3D - added to globals but inlined for safety */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
