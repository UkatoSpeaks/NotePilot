"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  HelpCircle,
  ChevronRight,
  CheckCircle2,
  X,
  Timer,
  RefreshCcw,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0); // 0: Start, 1: Quiz, 2: Finished
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const questions = [
    {
      q: "What is the SI unit of Force?",
      options: ["Joule", "Pascal", "Newton", "Watt"],
      correct: 2,
    },
    {
      q: "Which law describes the relationship between Force, Mass, and Acceleration?",
      options: ["First Law", "Second Law", "Third Law", "Law of Gravitation"],
      correct: 1,
    },
    {
      q: "The product of mass and velocity is called:",
      options: ["Power", "Force", "Momentum", "Energy"],
      correct: 2,
    },
  ];

  const handleOptionSelect = (idx: number) => {
    if (selectedOption !== null) return;

    setSelectedOption(idx);
    const correct = idx === questions[currentQuestion].correct;
    setIsCorrect(correct);
    if (correct) setScore(score + 1);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        setCurrentStep(2);
      }
    }, 1500);
  };

  const restart = () => {
    setCurrentStep(0);
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setScore(0);
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <AnimatePresence mode="wait">
        {currentStep === 0 && (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-8"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto shadow-2xl">
              <Trophy size={48} />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">
                Daily <span className="gradient-text">Challenge</span>
              </h1>
              <p className="text-white/50 text-lg">
                Test your knowledge on Laws of Motion. 3 questions, 10 seconds
                each.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="p-4 rounded-2xl glass-effect border border-white/5">
                <div className="text-xl font-bold">3</div>
                <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest">
                  Questions
                </div>
              </div>
              <div className="p-4 rounded-2xl glass-effect border border-white/5">
                <div className="text-xl font-bold">Medium</div>
                <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest">
                  Difficulty
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(1)}
              className="px-12 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(124,58,237,0.4)]"
            >
              Start Quiz
            </button>
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-primary text-sm font-bold">
                  {currentQuestion + 1}
                </div>
                <div className="text-sm font-medium text-white/50">
                  Question {currentQuestion + 1} of {questions.length}
                </div>
              </div>
              <div className="flex items-center gap-2 text-accent font-bold">
                <Timer size={18} />
                <span>08s</span>
              </div>
            </div>

            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${(currentQuestion / questions.length) * 100}%`,
                }}
                className="h-full bg-linear-to-r from-primary to-accent"
              />
            </div>

            <div className="space-y-8">
              <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                {questions[currentQuestion].q}
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {questions[currentQuestion].options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectOption =
                    idx === questions[currentQuestion].correct;
                  const showCorrect =
                    selectedOption !== null && isCorrectOption;
                  const showWrong = isSelected && !isCorrect;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={selectedOption !== null}
                      className={`p-6 rounded-2xl border text-left transition-all flex items-center justify-between group
                                    ${
                                      showCorrect
                                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-500"
                                        : showWrong
                                          ? "bg-red-500/10 border-red-500 text-red-500"
                                          : isSelected
                                            ? "border-primary bg-primary/10"
                                            : "bg-white/5 border-white/5 hover:border-white/20"
                                    }`}
                    >
                      <span className="font-bold">{option}</span>
                      {showCorrect && <CheckCircle2 size={20} />}
                      {showWrong && <X size={20} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-12 rounded-[40px] glass-effect border border-white/10 space-y-8"
          >
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-linear-to-tr from-primary to-accent rounded-full flex items-center justify-center text-white shadow-2xl relative z-10">
                <Trophy size={60} />
              </div>
              <div className="absolute inset-0 bg-primary blur-3xl opacity-30 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-4xl font-black italic">CONGRATS!</h2>
              <p className="text-white/50">
                You scored {score} out of {questions.length} correct.
              </p>
            </div>

            <div className="py-8 space-y-4">
              <div className="flex justify-between text-sm px-4">
                <span className="text-white/40">Knowledge Level</span>
                <span className="text-secondary font-bold">Expert</span>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(score / questions.length) * 100}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-linear-to-r from-primary via-secondary to-accent rounded-full"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={restart}
                className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCcw size={18} />
                Try Again
              </button>
              <Link
                href="/dashboard"
                className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:shadow-xl"
              >
                <ArrowLeft size={18} />
                Back to Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
