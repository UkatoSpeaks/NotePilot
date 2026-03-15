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
  ShieldCheck,
  ArrowRight,
  Brain,
  Search,
  Eye,
  FileCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

type UploadStage = "idle" | "uploading" | "analyzing" | "success";

export default function UploadPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<UploadStage>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisStatus, setAnalysisStatus] = useState("Initializing AI Engine...");
  const [generatedNoteId, setGeneratedNoteId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const scannerLineRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analysisSteps = [
    "Reading PDF structure...",
    "Performing OCR on images...",
    "Extracting key definitions...",
    "Identifying hierarchy of concepts...",
    "Summarizing complex theories...",
    "Generating practice questions...",
    "Creating logic-mapped flashcards...",
    "Finalizing study guide..."
  ];

  useEffect(() => {
    if (stage === "analyzing" && scannerLineRef.current) {
      gsap.to(scannerLineRef.current, {
        top: "100%",
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      });

      let step = 0;
      const interval = setInterval(() => {
        if (step < analysisSteps.length) {
          setAnalysisStatus(analysisSteps[step]);
          step++;
        } else {
          // Stay on the last step or restart cycle until API finish
          step = 0; 
        }
      }, 2000);

      return () => {
        clearInterval(interval);
        gsap.killTweensOf(scannerLineRef.current);
      };
    }
  }, [stage]);

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

  const { user } = useAuth();

  const startProcess = async () => {
    if (!file || !user) return;
    
    setStage("uploading");
    setUploadProgress(10);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.uid);
      // Optional: you could add subject/class here if you have selectors for them
      
      setUploadProgress(50);
      
      // Move to analyzing stage
      setStage("analyzing");
      
      const response = await fetch("/api/upload-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process PDF");
      }

      const result = await response.json();
      
      if (result.success) {
        setGeneratedNoteId(result.noteId);
        setStage("success");
      } else {
        const errorMsg = result.details ? `${result.error}: ${result.details}` : (result.error || "Unknown error occurred");
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert(error instanceof Error ? error.message : "Something went wrong while processing your PDF. Please try again.");
      setStage("idle");
    }
  };

  const reset = () => {
    setFile(null);
    setStage("idle");
    setUploadProgress(0);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="text-center max-w-3xl mx-auto space-y-4">
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-[#F9A11B] text-[10px] font-black uppercase tracking-[0.2em]"
        >
          <Sparkles className="w-3 h-3" /> AI-Powered Extraction
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black text-[#2D6A4F] tracking-tight leading-tight">
            Turn your PDFs <br/> into <span className="text-[#F9A11B]">Instant Knowledge</span>
        </h1>
        <p className="text-lg text-gray-500 font-bold max-w-2xl mx-auto">
            Upload your textbooks, class notes, or complex research papers. Our AI extract key points, flashcards, and practice tests in seconds.
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "relative min-h-[500px] border-4 border-dashed rounded-[48px] flex flex-col items-center justify-center transition-all bg-white shadow-2xl shadow-green-900/5",
                isDragging ? "border-[#F9A11B] bg-orange-50/50 scale-[1.01]" : "border-gray-100 hover:border-[#2D6A4F]/30"
              )}
            >
              <AnimatePresence mode="wait">
                {stage === "idle" && !file && (
                  <motion.div 
                    key="idle"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center text-center p-12"
                  >
                    <div className="w-28 h-28 bg-[#2D6A4F]/10 rounded-[32px] flex items-center justify-center mb-10 text-[#2D6A4F] shadow-xl group cursor-pointer hover:scale-110 transition-transform">
                      <UploadCloud className="w-12 h-12" />
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 mb-4">Drop your study file here</h3>
                    <p className="text-gray-500 font-bold mb-10 max-w-sm">Supported: PDF (up to 50MB). For best results use text-based PDFs.</p>
                    
                    <div className="group">
                      <Button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-[#2D6A4F] hover:bg-[#1b4332] text-white rounded-2xl px-12 py-8 text-lg font-black shadow-xl shadow-green-900/20 transition-all"
                      >
                        Browse Computer
                        <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept=".pdf" 
                        className="hidden" 
                        onChange={handleFileChange} 
                      />
                    </div>
                  </motion.div>
                )}

                {stage === "idle" && file && (
                  <motion.div 
                    key="selected"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center p-12 w-full max-w-md"
                  >
                    <div className="relative mb-10">
                        <div className="w-32 h-40 bg-orange-50 rounded-[32px] flex items-center justify-center text-[#F9A11B] border-4 border-orange-100 shadow-2xl">
                           <FileText className="w-16 h-16" />
                        </div>
                        <button 
                           onClick={() => setFile(null)}
                           className="absolute -top-4 -right-4 w-10 h-10 bg-white border-2 border-gray-100 rounded-full flex items-center justify-center shadow-xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2 truncate w-full text-center">{file.name}</h3>
                    <p className="text-gray-400 font-bold mb-10">{(file.size / (1024 * 1024)).toFixed(2)} MB • PDF Document</p>
                    
                    <Button 
                      onClick={startProcess} 
                      className="w-full bg-[#F9A11B] border-none hover:bg-orange-600 text-white rounded-2xl py-8 text-xl font-black shadow-2xl shadow-orange-500/20 flex items-center justify-center gap-3 transition-all"
                    >
                      <Zap className="w-6 h-6 fill-current" />
                      Generate Magic Notes
                    </Button>
                  </motion.div>
                )}

                {stage === "uploading" && (
                  <motion.div 
                    key="uploading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center w-full max-w-sm p-12"
                  >
                    <div className="relative w-40 h-40 mb-10">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="80"
                                cy="80"
                                r="70"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                className="text-gray-100"
                            />
                            <circle
                                cx="80"
                                cy="80"
                                r="70"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                strokeDasharray={440}
                                strokeDashoffset={440 - (440 * uploadProgress) / 100}
                                className="text-[#2D6A4F] transition-all duration-300"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-black text-[#2D6A4F]">{uploadProgress}%</span>
                        </div>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Sending to AI Cloud</h3>
                    <p className="text-gray-400 font-bold">Securely encrypting your material...</p>
                  </motion.div>
                )}

                {stage === "analyzing" && (
                  <motion.div 
                    key="analyzing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center w-full max-w-lg p-12"
                  >
                    <div className="relative w-full max-w-[280px] aspect-3/4 bg-gray-50 rounded-[32px] border-4 border-gray-100 overflow-hidden mb-12 shadow-inner">
                        <div className="p-6 space-y-4">
                            <div className="h-4 bg-gray-200 rounded-full w-full opacity-50" />
                            <div className="h-4 bg-gray-200 rounded-full w-3/4 opacity-50" />
                            <div className="h-32 bg-gray-200 rounded-3xl w-full opacity-30" />
                            <div className="h-4 bg-gray-200 rounded-full w-full opacity-50" />
                            <div className="h-4 bg-gray-200 rounded-full w-1/2 opacity-50" />
                            <div className="h-4 bg-gray-200 rounded-full w-2/3 opacity-50" />
                        </div>
                        {/* Scanner Line */}
                        <div 
                          ref={scannerLineRef}
                          className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#F9A11B] to-transparent z-10 shadow-[0_0_15px_rgba(249,161,27,0.8)]"
                        />
                        <div className="absolute top-0 left-0 w-full h-full bg-[#F9A11B]/10 mix-blend-overlay opacity-20" />
                    </div>
                    
                    <div className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-3">
                            <Loader2 className="w-6 h-6 text-[#F9A11B] animate-spin" />
                            <h3 className="text-3xl font-black text-gray-900 tracking-tight italic">AI Brain Thinking...</h3>
                        </div>
                        <p className="text-lg font-black text-[#2D6A4F] tracking-widest h-6 flex items-center justify-center uppercase">
                           {analysisStatus}
                        </p>
                    </div>
                  </motion.div>
                )}

                {stage === "success" && (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center p-12 text-center max-w-md"
                  >
                    <div className="w-32 h-32 bg-green-100 rounded-[40px] flex items-center justify-center mb-10 text-green-600 shadow-2xl shadow-green-600/20">
                      <FileCheck className="w-16 h-16" />
                    </div>
                    <h3 className="text-4xl font-black text-gray-900 mb-4">Study Guide Ready!</h3>
                    <p className="text-gray-500 font-bold mb-10 leading-relaxed">We've extracted 12 key points, 8 flashcards, and 5 practice questions from your document.</p>
                    
                    <div className="grid grid-cols-2 gap-4 w-full mb-10">
                        <div className="p-5 bg-gray-50 rounded-3xl text-left border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Generated</p>
                            <p className="text-lg font-black text-[#2D6A4F]">Smart Notes</p>
                        </div>
                        <div className="p-5 bg-gray-50 rounded-3xl text-left border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Generated</p>
                            <p className="text-lg font-black text-[#F9A11B]">Flashcards</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 w-full">
                        <Link href={`/dashboard/notes?id=${generatedNoteId}`} className="w-full">
                            <Button className="w-full bg-[#2D6A4F] border-none hover:bg-black text-white rounded-2xl py-8 text-xl font-black shadow-2xl shadow-green-900/20 flex items-center justify-center gap-3">
                              View Results Now
                              <Eye className="w-6 h-6" />
                            </Button>
                        </Link>
                        <button 
                            onClick={reset}
                            className="text-gray-400 font-black hover:text-[#F9A11B] transition-colors"
                        >
                            Upload Another File
                        </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
            <FeatureBox 
                icon={<ShieldCheck className="w-6 h-6" />} 
                title="Privacy Guaranteed" 
                desc="Your PDFs are encrypted and auto-deleted from our cloud after 24 hours of inactivity."
                color="bg-emerald-50 text-emerald-600 border-emerald-100"
            />
            <FeatureBox 
                icon={<Brain className="w-6 h-6" />} 
                title="Deep Analysis" 
                desc="We don't just summarize; we identify semantic relationships between topics for better logic mappings."
                color="bg-purple-50 text-purple-600 border-purple-100"
            />
            <FeatureBox 
                icon={<Search className="w-6 h-6" />} 
                title="OCR Integration" 
                desc="Even if your PDF is a scan of a textbook, our AI OCR engine can read and analyze the text."
                color="bg-blue-50 text-blue-600 border-blue-100"
            />
            
            <div className="p-10 rounded-[48px] bg-linear-to-br from-[#2D6A4F] to-[#1b4332] text-white shadow-2xl shadow-green-900/10 relative overflow-hidden group">
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                        <Zap className="w-6 h-6 text-orange-400" />
                    </div>
                    <h4 className="text-xl font-black mb-3">Maximizing Results</h4>
                    <p className="text-white/70 font-bold text-sm leading-relaxed mb-6">Text-based PDFs yield 40% better accuracy for flashcard generation compared to handwritten scans.</p>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-400 w-3/4 rounded-full" />
                    </div>
                </div>
                <Sparkles className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 group-hover:rotate-12 transition-transform duration-700" />
            </div>
        </div>
      </div>
    </div>
  );
}

function FeatureBox({ icon, title, desc, color }: { icon: React.ReactNode, title: string, desc: string, color: string }) {
    return (
        <div className={cn("p-8 rounded-[40px] bg-white border-2 flex gap-6 group hover:translate-x-2 transition-all", color)}>
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform shrink-0">
                {icon}
            </div>
            <div>
                <p className="font-black text-gray-800 mb-2">{title}</p>
                <p className="text-sm font-bold text-gray-400 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}
