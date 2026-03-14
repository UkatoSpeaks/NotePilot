"use client";

import React from "react";
import { MessageSquareQuote, Sparkles, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QuestionGeneratorPage() {
  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Question Generator</h1>
        <p className="text-secondary max-w-sm mx-auto font-medium">Practice with board-specific questions (CBSE/ICSE) and model answers.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-border p-12 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-amber-100 rounded-4xl flex items-center justify-center mb-8 text-amber-600 shadow-xl shadow-amber-500/5">
            <MessageSquareQuote className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold mb-3">No Question Sets Yet</h3>
          <p className="text-secondary mb-10 max-w-xs">Select a topic to generate practice questions tailored to your exam board.</p>
          <Button className="rounded-2xl h-14 px-10 text-lg font-bold gap-2">
            <Plus className="w-5 h-5" /> Generate Question Set
          </Button>
      </div>
    </div>
  );
}
