"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowUpRight, 
  Star, 
  Linkedin, 
  Twitter, 
  Youtube, 
  ChevronRight, 
  Clock,
  BookOpen,
  FileText,
  Brain,
  CheckCircle2,
  XCircle,
  Zap,
  Layout,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuth } from "@/context/AuthContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
  const { user, loading } = useAuth();
  const heroVisualRef = useRef(null);
  const headlineRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Hero Entrance Animations
    const tl = gsap.timeline();
    tl.from(headlineRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    })
    .from(".hero-cta", {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2
    }, "-=0.5")
    .from(heroVisualRef.current, {
      scale: 0.9,
      opacity: 0,
      duration: 1,
      ease: "power2.out"
    }, "-=0.8");

    // AI Typing Animation Simulation
    gsap.to(".ai-line", {
      width: "100%",
      duration: 0.5,
      stagger: 0.3,
      repeat: -1,
      repeatDelay: 2
    });

    // Floating animation for background blobs
    gsap.to(".floating-blob", {
      y: 30,
      x: 20,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 1
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1A1A1A] font-sans">
      {/* 1. Enhanced Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-[32px] px-8 h-20 flex items-center justify-between shadow-[0_8px_32px_0_rgba(45,106,79,0.08)]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-linear-to-tr from-[#2D6A4F] to-[#40916c] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-900/20 transform group-hover:rotate-15 transition-all duration-500">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-[#2D6A4F] leading-none">NotePilot</span>
              <span className="text-[10px] font-black text-[#F9A11B] uppercase tracking-[0.2em] leading-none mt-1">AI Study Tool</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {['Features', 'How it Works', 'Pricing'].map((item) => (
              <Link 
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                className="text-sm font-bold text-gray-600 hover:text-[#2D6A4F] relative group/link transition-colors"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F9A11B] transition-all duration-300 group-hover/link:w-full" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {!loading && user ? (
              <Link href="/dashboard">
                <Button className="bg-[#2D6A4F] hover:bg-[#1b4332] text-white rounded-full px-8 font-black h-12 shadow-lg shadow-green-900/20 transition-all hover:scale-105 active:scale-95">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-sm font-bold text-gray-600 hover:text-[#2D6A4F] hover:bg-white/50 rounded-full px-6">
                    Login
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className="bg-[#2D6A4F] hover:bg-[#1b4332] text-white rounded-full px-8 font-black h-12 shadow-lg shadow-green-900/20 transition-all hover:scale-105 active:scale-95">
                    Try for Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 1. Hero Section */}
      <motion.section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-[#F9A11B] rounded-full text-sm font-black mb-6">
              <Star className="w-4 h-4 fill-current" />
              TOP RATED STUDY TOOL
            </div>
            <h1 ref={headlineRef} className="text-5xl md:text-7xl font-black leading-[1.1] mb-8">
              Generate <span className="custom-underline">Smart Study Notes</span> in Seconds with AI
            </h1>
            <p className="text-xl text-gray-600 font-medium leading-relaxed mb-10 max-w-lg">
              Turn any topic into structured notes, flashcards, and exam questions instantly. Study smarter, not harder.
            </p>
            <div className="flex flex-wrap gap-4 hero-cta">
              {!loading && user ? (
                <>
                  <Link href="/dashboard">
                    <Button className="bg-[#F9A11B] hover:bg-[#e69110] text-white rounded-full px-8 py-7 text-lg font-black shadow-xl shadow-orange-500/20 cursor-pointer">
                      Go to Dashboard
                      <ArrowUpRight className="ml-2 w-6 h-6" />
                    </Button>
                  </Link>
                  <Link href="/dashboard/generate-notes">
                    <Button variant="outline" className="border-2 border-[#2D6A4F] text-[#2D6A4F] hover:bg-[#2D6A4F] hover:text-white rounded-full px-8 py-7 text-lg font-black transition-all cursor-pointer">
                      Quick Study
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard/generate-notes">
                    <Button className="bg-[#F9A11B] hover:bg-[#e69110] text-white rounded-full px-8 py-7 text-lg font-black shadow-xl shadow-orange-500/20 cursor-pointer">
                      Generate Notes
                      <ArrowUpRight className="ml-2 w-6 h-6" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button variant="outline" className="border-2 border-[#2D6A4F] text-[#2D6A4F] hover:bg-[#2D6A4F] hover:text-white rounded-full px-8 py-7 text-lg font-black transition-all cursor-pointer">
                      Learn More
                    </Button>
                  </Link>
                </>
              )}
            </div>
            
            <div className="mt-12 flex items-center gap-4 hero-cta opacity-80">
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <motion.div 
                    key={i} 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 + (i * 0.1) }}
                    className="w-10 h-10 rounded-full border-4 border-white bg-gray-200 overflow-hidden relative shadow-sm"
                  >
                    <div className={`absolute inset-0 bg-blue-${i*100+200}`} />
                  </motion.div>
                ))}
              </div>
              <p className="text-sm font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Joined by 10,000+ Students
              </p>
            </div>
          </div>

          <div ref={heroVisualRef} className="relative">
            {/* Extremely Premium Mock AI Visual */}
            <div className="bg-[#2D6A4F] rounded-[48px] p-10 shadow-[0_20px_50px_rgba(45,106,79,0.3)] relative z-10 overflow-hidden border border-white/10 group hover:shadow-[0_20px_60px_rgba(45,106,79,0.5)] transition-all duration-700">
               {/* Header of the mock UI */}
               <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    <span className="text-[10px] font-black text-[#F9A11B] tracking-[0.2em] uppercase">NotePilot AI Engine v2.0</span>
                  </div>
               </div>
               
               <div className="space-y-6">
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
                    <div className="flex items-center gap-4 mb-4">
                       <div className="p-2 bg-orange-400/20 rounded-lg">
                          <Brain className="w-5 h-5 text-orange-400" />
                       </div>
                       <div className="flex flex-col">
                         <span className="text-[10px] font-black text-white/40 uppercase tracking-tighter">Current Topic</span>
                         <span className="text-white font-black text-lg">Newton's Laws of Motion</span>
                       </div>
                    </div>
                    
                    {/* Animated scanning line */}
                    <div className="h-px bg-linear-to-r from-transparent via-orange-400 to-transparent w-full relative">
                        <div className="absolute inset-0 bg-orange-400 blur-sm opacity-50" />
                    </div>
                  </div>

                  <div className="space-y-4">
                     {[
                        { label: "Concept", width: "w-3/4", color: "bg-orange-400" },
                        { label: "Formula", width: "w-1/2", color: "bg-orange-500 shadow-[0_0_15px_rgba(249,161,27,0.4)]" },
                        { label: "Example", width: "w-2/3", color: "bg-orange-300" }
                     ].map((line, idx) => (
                        <div key={idx} className="flex items-center gap-4 group/line">
                           <div className={`w-2 h-2 rounded-full ${line.color}`} />
                           <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                              <div className={`ai-line h-full ${line.color} rounded-full transition-all duration-500`} style={{ width: '0%' }} />
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/10">
                    <div className="flex items-center justify-between">
                       <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-lg bg-orange-400/20 flex items-center justify-center">
                             <Zap className="w-4 h-4 text-orange-400 fill-current" />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-white/50 uppercase">Analysis</p>
                             <p className="text-xs font-black text-white">Exam High Priority</p>
                          </div>
                       </div>
                       <Button className="h-8 rounded-full bg-white text-[#2D6A4F] text-[10px] font-black hover:bg-orange-400 hover:text-white transition-all uppercase tracking-widest">
                          View Details
                       </Button>
                    </div>
                  </div>
               </div>

               {/* Ambient Glows */}
               <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-400 rounded-full blur-[120px] opacity-20" />
               <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white rounded-full blur-[100px] opacity-10" />
            </div>
            
            {/* Background elements */}
            <div className="absolute -top-10 -right-10 w-full h-full border-2 border-dashed border-[#F9A11B]/20 rounded-full animate-spin-slow" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#F9A11B] rounded-full blur-[80px] opacity-20 z-0" />
            <div className="absolute top-1/4 -right-1/4 w-48 h-48 bg-[#2D6A4F]/10 rounded-full blur-3xl floating-blob" />
            <div className="absolute -bottom-1/4 -left-1/4 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl floating-blob" />
          </div>
        </div>
      </motion.section>

      {/* 2. Problem Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-white px-6"
      >
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-[#2D6A4F]">Studying Shouldn't Be This Hard</h2>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto italic">
            "I spent 4 hours today just making notes and didn't even start studying." - Every Student Ever.
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {[
            { icon: <Clock className="w-8 h-8" />, title: "Wasted Hours", desc: "Making notes takes 70% of your study time." },
            { icon: <Brain className="w-8 h-8" />, title: "Revision Stress", desc: "Panic before exams is real when notes are messy." },
            { icon: <BookOpen className="w-8 h-8" />, title: "Textbook Overload", desc: "Drowning in 500-page books? We extract the core." },
            { icon: <Layout className="w-8 h-8" />, title: "Disorganized Mess", desc: "Loose papers and lost files are a thing of the past." }
          ].map((item, idx) => (
            <ProblemCard 
              key={idx}
              icon={item.icon}
              title={item.title}
              desc={item.desc}
              index={idx}
            />
          ))}
        </div>
      </motion.section>

      {/* 3. Solution Section */}
      <motion.section 
        id="features" 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-24 px-6 bg-[#FDFCF8] overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
             <motion.div 
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
               className="lg:w-1/2"
             >
                <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">
                  Your AI <br/> <span className="text-[#F9A11B]">Study Assistant</span>
                </h2>
                <div className="space-y-6">
                  {["Generate Notes instantly", "one-click flashcards", "AI Question Generator", "Smart PDF Converter", "Revision Summaries"].map((text, i) => (
                    <FeatureRow key={i} icon={<CheckCircle2 className="text-green-500" />} text={text} index={i} />
                  ))}
                </div>
                <Button className="mt-12 bg-[#2D6A4F] text-white rounded-full px-10 py-7 text-lg font-black hover:scale-105 active:scale-95 transition-transform">
                  Start Learning Now
                </Button>
             </motion.div>
             <div className="lg:w-1/2 grid grid-cols-2 gap-6 relative">
                <div className="space-y-6">
                   <ServiceCard icon={<FileText />} title="AI Notes" desc="Structured & clean" color="bg-orange-100" index={0} />
                   <ServiceCard icon={<Brain />} title="Flashcards" desc="Active recall" color="bg-green-100" index={1} />
                </div>
                <div className="space-y-6 pt-12">
                   <ServiceCard icon={<MessageSquare />} title="Q&A" desc="Exam practice" color="bg-blue-100" index={2} />
                   <ServiceCard icon={<Zap />} title="Revision" desc="Lightning fast" color="bg-purple-100" index={3} />
                </div>
                <div className="absolute -z-10 bg-[#F9A11B]/10 w-[140%] h-[140%] -top-[20%] -left-[20%] rounded-full blur-3xl floating-blob" />
             </div>
          </div>
        </div>
      </motion.section>

      {/* 4. How It Works Section */}
      <motion.section 
        id="how-it-works" 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-[#2D6A4F] text-white px-6"
      >
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-6">How It Works</h2>
          <p className="text-white/60 text-lg font-bold">From confused to exam-ready in 3 easy steps.</p>
        </div>
        
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-12 left-0 w-full h-1 border-t-4 border-dashed border-white/10 z-0" />
          
          <StepCard number="1" title="Enter Topic" desc="Type in any subject or upload your school PDF." index={0} />
          <StepCard number="2" title="AI MAGIC" desc="Our engine generates structured headings and key points." index={1} />
          <StepCard number="3" title="Study & Ace" desc="Review flashcards and test yourself with AI questions." index={2} />
        </div>
      </motion.section>

      {/* 6. Example Output Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-24 px-6 max-w-7xl mx-auto"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4">See the <span className="text-[#F9A11B]">Result</span> Yourself</h2>
          <p className="text-gray-600 font-bold">Actual output for the topic: "Photosynthesis"</p>
        </div>
        <div className="bg-white border-2 border-gray-100 rounded-[40px] p-8 md:p-12 shadow-xl max-w-4xl mx-auto">
           <div className="space-y-8">
              <div>
                <h3 className="text-[#2D6A4F] text-2xl font-black mb-2 flex items-center gap-2">
                  <div className="w-2 h-8 bg-[#F9A11B] rounded-full" />
                  Definition
                </h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water.
                </p>
              </div>

              <div>
                <h3 className="text-[#2D6A4F] text-2xl font-black mb-2 flex items-center gap-2">
                  <div className="w-2 h-8 bg-[#F9A11B] rounded-full" />
                  Key Points
                </h3>
                <ul className="grid md:grid-cols-2 gap-4">
                  <li className="flex items-start gap-2 bg-[#FDFCF8] p-4 rounded-2xl border border-gray-50">
                    <span className="text-[#F9A11B] font-black">•</span>
                    <p className="text-sm font-bold text-gray-600">Occurs mainly in the chloroplasts of leaves.</p>
                  </li>
                  <li className="flex items-start gap-2 bg-[#FDFCF8] p-4 rounded-2xl border border-gray-50">
                    <span className="text-[#F9A11B] font-black">•</span>
                    <p className="text-sm font-bold text-gray-600">Requires light energy, CO2, and H2O.</p>
                  </li>
                </ul>
              </div>

              <div className="bg-[#2D6A4F] text-white p-8 rounded-3xl relative overflow-hidden group">
                 <h4 className="text-orange-400 font-black mb-4 uppercase tracking-widest text-xs">Important Formula</h4>
                 <p className="text-2xl md:text-3xl font-mono leading-relaxed group-hover:scale-105 transition-transform">
                    6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂
                 </p>
                 <SparkleIcon className="absolute top-4 right-4 w-12 h-12 text-white/10" />
              </div>

              <div>
                <h3 className="text-[#2D6A4F] text-2xl font-black mb-4">Practice Questions</h3>
                <div className="space-y-4">
                   {[
                      "Define photosynthesis in your own words.",
                      "Where exactly in the plant cell does photosynthesis occur?",
                      "Write the balanced chemical equation for the process."
                   ].map((q, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group cursor-default">
                         <p className="font-bold text-gray-600">{i+1}. {q}</p>
                         <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#F9A11B] group-hover:translate-x-1 transition-all" />
                      </div>
                   ))}
                </div>
              </div>
           </div>
        </div>
      </motion.section>

      {/* 9. Pricing Section */}
      <motion.section 
        id="pricing" 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-[#FDFCF8] px-6"
      >
        <div className="max-w-7xl mx-auto text-center mb-16">
           <h2 className="text-5xl font-black mb-4 text-[#2D6A4F]">Simple Pricing</h2>
           <p className="text-gray-600 font-bold text-lg">Created with a student's budget in mind.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
           {/* Free Plan */}
           <div className="bg-white p-10 rounded-[40px] border-2 border-gray-100 hover:border-[#2D6A4F]/20 transition-all flex flex-col items-center text-center">
              <h3 className="text-2xl font-black mb-2">Free Plan</h3>
              <p className="text-gray-600 font-bold mb-6">Explore the basics</p>
              <div className="text-4xl font-black mb-8">₹0 <span className="text-lg text-gray-600">/ forever</span></div>
              <div className="space-y-4 mb-10 w-full text-left">
                 <PricingItem text="5 AI Notes per day" />
                 <PricingItem text="3 Flashcard sets" />
                 <PricingItem text="Community Access" />
                 <PricingItem text="PDF Upload" disabled />
                 <PricingItem text="Exam Question Gen" disabled />
              </div>
              <Button variant="outline" className="w-full py-7 rounded-full border-2 font-black">Get Started</Button>
           </div>

           {/* Pro Plan */}
           <div className="bg-[#2D6A4F] text-white p-10 rounded-[40px] shadow-2xl shadow-green-900/40 relative overflow-hidden flex flex-col items-center text-center transform md:scale-105">
              <div className="absolute top-10 right-[-35px] rotate-45 bg-[#F9A11B] text-white px-10 py-1 text-xs font-black uppercase tracking-widest">Best Value</div>
              <h3 className="text-2xl font-black mb-2">Pro Plan</h3>
              <p className="text-white/60 font-bold mb-6">Unlimited everything</p>
              <div className="text-4xl font-black mb-8">₹199 <span className="text-lg text-white/50">/ month</span></div>
              <div className="space-y-4 mb-10 w-full text-left">
                 <PricingItem text="Unlimited AI Notes" active />
                 <PricingItem text="Unlimited Flashcards" active />
                 <PricingItem text="PDF to Notes Converter" active />
                 <PricingItem text="Exam Question Generator" active />
                 <PricingItem text="Priority Support" active />
              </div>
              <Button className="w-full py-7 rounded-full bg-[#F9A11B] hover:bg-[#e69110] text-white font-black shadow-lg shadow-orange-500/20">Go Pro Now</Button>
           </div>
        </div>
      </motion.section>

      {/* 10. Final CTA Section */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-24 px-6 text-center"
      >
        <div className="max-w-4xl mx-auto bg-[#F9A11B] p-12 md:p-20 rounded-[60px] relative overflow-hidden">
           <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Start Studying <br/> Smarter Today</h2>
              <p className="text-white/90 text-xl font-bold mb-10">Don't wait. Your next exam success starts here.</p>
              <Button className="bg-[#2D6A4F] hover:bg-[#1b4332] text-white rounded-full px-12 py-8 text-xl font-black shadow-2xl">
                Generate Your First AI Notes
              </Button>
           </div>
           
           <SparkleIcon className="absolute -top-10 -left-10 w-40 h-40 text-white/20" />
           <SparkleIcon className="absolute -bottom-10 -right-10 w-40 h-40 text-white/20" />
        </div>
      </motion.section>

      {/* 11. Footer */}
      <footer className="bg-white py-20 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-[#F9A11B] rounded-xl flex items-center justify-center text-white">
                  <Zap className="w-6 h-6 fill-current" />
                </div>
                <span className="text-2xl font-black tracking-tight text-[#2D6A4F]">NotePilot</span>
              </Link>
              <p className="text-gray-600 font-bold max-w-sm leading-relaxed mb-8">
                The world's fastest AI study tool for students. Turn confusion into clarity in seconds.
              </p>
              <div className="flex gap-4">
                <SocialLink icon={<Linkedin />} />
                <SocialLink icon={<Twitter />} />
                <SocialLink icon={<Youtube />} />
              </div>
            </div>
            
            <div>
              <h4 className="font-black text-lg mb-6 uppercase tracking-widest text-[#2D6A4F]">Product</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="font-bold text-gray-600 hover:text-[#F9A11B]">Features</Link></li>
                <li><Link href="#" className="font-bold text-gray-600 hover:text-[#F9A11B]">Pricing</Link></li>
                <li><Link href="#" className="font-bold text-gray-600 hover:text-[#F9A11B]">Demo</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-lg mb-6 uppercase tracking-widest text-[#2D6A4F]">Company</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="font-bold text-gray-600 hover:text-[#F9A11B]">About Us</Link></li>
                <li><Link href="#" className="font-bold text-gray-600 hover:text-[#F9A11B]">Contact</Link></li>
                <li><Link href="#" className="font-bold text-gray-600 hover:text-[#F9A11B]">Support</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-100 flex flex-col md:row justify-between items-center gap-4">
            <p className="text-sm font-bold text-gray-600">© 2026 NotePilot. All rights reserved.</p>
            <div className="flex gap-8">
              <Link href="#" className="text-sm font-bold text-gray-600 hover:text-[#F9A11B]">Terms</Link>
              <Link href="#" className="text-sm font-bold text-gray-600 hover:text-[#F9A11B]">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProblemCard({ icon, title, desc, index }: { icon: React.ReactNode, title: string, desc: string, index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="p-8 bg-[#FDFCF8] rounded-[32px] border-2 border-transparent hover:border-[#F9A11B]/40 hover:shadow-2xl hover:shadow-orange-500/10 transition-all group cursor-pointer"
    >
      <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#2D6A4F] mb-6 group-hover:bg-[#F9A11B] group-hover:text-white group-hover:rotate-10 transition-all duration-500">
        {icon}
      </div>
      <h3 className="text-xl font-black mb-4 group-hover:text-[#F9A11B] transition-colors">{title}</h3>
      <p className="text-gray-600 font-bold text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function ServiceCard({ icon, title, desc, color, index }: { icon: React.ReactNode, title: string, desc: string, color: string, index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.05, rotate: 2 }}
      className={`p-10 ${color} rounded-[40px] shadow-xl shadow-black/5 flex flex-col justify-between aspect-square cursor-pointer group`}
    >
      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#2D6A4F] shadow-sm group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-black mb-1 group-hover:text-[#F9A11B] transition-colors">{title}</h3>
        <p className="font-bold text-gray-600 text-sm">{desc}</p>
      </div>
    </motion.div>
  );
}

function FeatureRow({ icon, text, index }: { icon: React.ReactNode, text: string, index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="flex items-center gap-4 group cursor-default"
    >
      <div className="scale-125 group-hover:scale-150 transition-transform duration-300">{icon}</div>
      <p className="text-xl font-black text-gray-600 group-hover:text-[#2D6A4F] transition-colors">{text}</p>
    </motion.div>
  );
}

function StepCard({ number, title, desc, index }: { number: string, title: string, desc: string, index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
      className="relative z-10 flex flex-col items-center text-center group"
    >
      <div className="w-16 h-16 rounded-full bg-[#F9A11B] border-4 border-white flex items-center justify-center text-2xl font-black mb-6 shadow-xl group-hover:scale-110 transition-all duration-300">
        {number}
      </div>
      <h3 className="text-2xl font-black mb-4">{title}</h3>
      <p className="text-white/70 font-bold leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function PricingItem({ text, active = false, disabled = false }: { text: string, active?: boolean, disabled?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${disabled ? "opacity-30" : "opacity-100"}`}>
      {disabled ? (
        <XCircle className="w-5 h-5 text-gray-400" />
      ) : (
        <CheckCircle2 className={`w-5 h-5 ${active ? "text-orange-400" : "text-green-500"}`} />
      )}
      <span className={`font-bold ${active ? "text-white" : "text-gray-600"}`}>{text}</span>
    </div>
  );
}

function SocialLink({ icon }: { icon: React.ReactElement }) {
  return (
    <Link href="#" className="w-10 h-10 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center hover:bg-[#F9A11B] transition-colors">
      {React.cloneElement(icon, { size: 18 } as any)}
    </Link>
  );
}

function SparkleIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
        </svg>
    );
}


