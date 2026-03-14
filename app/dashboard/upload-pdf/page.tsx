"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  UploadCloud, 
  FileText, 
  X, 
  CheckCircle2, 
  Loader2,
  Sparkles,
  Zap,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

export default function UploadPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDragging && pulseRef.current) {
      gsap.to(pulseRef.current, {
        scale: 1.1,
        opacity: 0.8,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    } else if (pulseRef.current) {
      gsap.to(pulseRef.current, {
        scale: 1,
        opacity: 0.5,
        duration: 0.3
      });
    }
  }, [isDragging]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          // In a real app, we'd redirect to the generated notes
        }, 1000);
      }
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Upload Study Material</h1>
        <p className="text-secondary font-medium">Upload your textbooks, notes, or sample papers in PDF format. We'll extract everything you need to study effectively.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            <div 
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "relative h-[400px] border-4 border-dashed rounded-[3rem] flex flex-col items-center justify-center transition-all overflow-hidden",
                isDragging ? "bg-primary/5 border-primary" : "bg-white border-muted hover:border-primary/30"
              )}
            >
              {isDragging && (
                <div 
                  ref={pulseRef}
                  className="absolute w-64 h-64 bg-primary/10 rounded-full -z-10"
                />
              )}

              <AnimatePresence mode="wait">
                {!file ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center text-center p-8"
                  >
                    <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-8 text-primary shadow-xl shadow-primary/5">
                      <UploadCloud className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Drag & Drop PDF</h3>
                    <p className="text-secondary mb-8 max-w-xs">Supported format: PDF. Max size: 50MB.</p>
                    <label className="cursor-pointer">
                      <Button variant="outline" className="rounded-2xl px-8 h-12 pointer-events-none">
                        Browse Files
                      </Button>
                      <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                    </label>
                  </motion.div>
                ) : isUploading ? (
                  <motion.div 
                    key="uploading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center w-full max-w-xs p-8"
                  >
                    <div className="relative w-32 h-32 mb-8">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="58"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-muted"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r="58"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={364.4}
                                strokeDashoffset={364.4 - (364.4 * uploadProgress) / 100}
                                className="text-primary transition-all duration-300"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-xl font-black">
                            {uploadProgress}%
                        </div>
                    </div>
                    <p className="font-bold text-xl mb-2">Processing PDF...</p>
                    <p className="text-sm text-secondary">Our AI is reading your content.</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="selected"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center p-8"
                  >
                    <div className="relative">
                        <div className="w-28 h-32 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary border-2 border-primary/20">
                           <FileText className="w-12 h-12" />
                        </div>
                        <button 
                           onClick={() => setFile(null)}
                           className="absolute -top-3 -right-3 w-8 h-8 bg-white border border-border rounded-full flex items-center justify-center shadow-lg hover:bg-muted transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <h3 className="text-xl font-bold mb-1 truncate max-w-[250px]">{file.name}</h3>
                    <p className="text-sm text-secondary mb-8">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <Button onClick={handleUpload} className="rounded-2xl px-12 h-14 text-lg font-bold gap-2 shadow-xl shadow-primary/20">
                      Generate Notes from PDF <ArrowRight className="w-5 h-5" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
        </div>

        <div className="space-y-6">
            <FeatureItem 
                icon={<Zap className="w-5 h-5" />} 
                title="Lightning Fast" 
                desc="Generate comprehensive study guides in under 30 seconds."
                color="bg-amber-100 text-amber-600"
            />
            <FeatureItem 
                icon={<Sparkles className="w-5 h-5" />} 
                title="AI Optimized" 
                desc="Our AI focuses on keywords and patterns likely to appear in board exams."
                color="bg-primary/10 text-primary"
            />
            <FeatureItem 
                icon={<ShieldCheck className="w-5 h-5" />} 
                title="Safe & Secure" 
                desc="Your documents are encrypted and only accessible by you."
                color="bg-emerald-100 text-emerald-600"
            />
            
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary to-purple-600 text-white shadow-xl shadow-primary/20 mt-10">
                <h4 className="font-bold mb-2">Pro Tip 💡</h4>
                <p className="text-sm text-white/80 leading-relaxed">For the best results, upload PDFs that contain text rather than just images of handwritten notes.</p>
            </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, desc, color }: { icon: React.ReactNode, title: string, desc: string, color: string }) {
    return (
        <div className="p-6 rounded-3xl bg-white border border-border flex gap-4">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0", color)}>
                {icon}
            </div>
            <div>
                <p className="font-bold text-sm block mb-1">{title}</p>
                <p className="text-xs text-secondary leading-relaxed font-medium">{desc}</p>
            </div>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}

const ArrowRight = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);
