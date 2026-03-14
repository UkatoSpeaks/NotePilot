"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ArrowRight, Sparkles, BookCheck, Clock, Rocket } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2,
      });

      gsap.to(".hero-glow", {
        opacity: 0.6,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative w-full overflow-hidden">
      {/* Background Ambient Glows — contained inside this section */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[140px] hero-glow opacity-30 -translate-x-1/3 -translate-y-1/4" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[140px] hero-glow opacity-20 translate-x-1/3 translate-y-1/4" />

      {/* ── Content Container ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-40 pb-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 text-secondary text-sm font-semibold mb-8"
        >
          <Sparkles size={16} />
          <span>Next-Gen Study OS for Grades 8-12</span>
        </motion.div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] mb-6"
        >
          Study Smarter, <br />
          <span className="gradient-text">Not Harder.</span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-base md:text-lg lg:text-xl text-foreground/50 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          NotePilot converts your textbooks and PDFs into structured notes,
          flashcards, and mock quizzes instantly. Built specifically for
          students to ace their exams.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Link
            href="/dashboard"
            className="group px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-base md:text-lg flex items-center gap-3 transition-all hover:shadow-[0_0_40px_rgba(124,58,237,0.5)] hover:scale-105"
          >
            Start Generating Free
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
          <button className="px-8 py-4 glass-effect text-foreground rounded-full font-bold text-base md:text-lg hover:bg-white/10 transition-colors">
            See How it Works
          </button>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="grid grid-cols-3 max-w-xl mx-auto gap-6 pt-10 border-t border-border"
        >
          <div className="flex flex-col items-center gap-1.5">
            <BookCheck className="text-secondary" size={22} />
            <span className="text-xl md:text-2xl font-bold">100%</span>
            <span className="text-foreground/40 text-xs md:text-sm">
              Exam Focused
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Clock className="text-accent" size={22} />
            <span className="text-xl md:text-2xl font-bold">5 Secs</span>
            <span className="text-foreground/40 text-xs md:text-sm">
              Note Generation
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Sparkles className="text-primary" size={22} />
            <span className="text-xl md:text-2xl font-bold">24/7</span>
            <span className="text-foreground/40 text-xs md:text-sm">
              AI Tutor
            </span>
          </div>
        </motion.div>
      </div>

      {/* ── Hero Visual Preview ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="w-full aspect-video glass-effect rounded-2xl p-3 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
          <div className="w-full h-full bg-[#0a0a12] rounded-xl border border-border flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <Rocket size={48} className="text-primary animate-pulse" />
                <div className="h-1.5 w-40 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="h-full w-1/2 bg-primary rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
