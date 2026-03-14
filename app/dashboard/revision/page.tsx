"use client";

import React from "react";
import { BookOpen, Calendar, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RevisionPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header>
        <h1 className="text-3xl font-bold mb-2">Revision Mode</h1>
        <p className="text-secondary font-medium">Quickly review everything you've learned this week.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <RevisionCard 
            title="Weekly Summary" 
            desc="A condensed view of all 12 chapters studied this week." 
            icon={<Calendar className="w-5 h-5" />}
        />
        <RevisionCard 
            title="Last Minute Prep" 
            desc="High-yield points and common exam questions." 
            icon={<Clock className="w-5 h-5" />}
        />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-border p-8">
        <h3 className="text-xl font-bold mb-6">Continue Reviving</h3>
        <div className="space-y-4">
            {[
                { subject: "Physics", topic: "Optics & Lens", progress: 65 },
                { subject: "History", topic: "The Industrial Revolution", progress: 40 },
                { subject: "Biology", topic: "Plant Reproduction", progress: 90 },
            ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl hover:bg-muted transition-colors group cursor-pointer border border-transparent hover:border-border">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {item.subject[0]}
                        </div>
                        <div>
                            <p className="font-bold">{item.topic}</p>
                            <p className="text-xs text-secondary font-bold uppercase tracking-widest">{item.subject}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden hidden md:block">
                            <div className="h-full bg-primary" style={{ width: `${item.progress}%` }} />
                        </div>
                        <ChevronRight className="w-5 h-5 text-secondary group-hover:text-primary transition-colors" />
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function RevisionCard({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
    return (
        <div className="p-8 rounded-[2.5rem] bg-white border border-border hover:shadow-xl hover:shadow-primary/5 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-6 text-primary">
                {icon}
            </div>
            <h4 className="text-lg font-bold mb-2">{title}</h4>
            <p className="text-sm text-secondary mb-6 leading-relaxed">{desc}</p>
            <Button variant="outline" className="rounded-xl w-full">Start Revision</Button>
        </div>
    );
}
