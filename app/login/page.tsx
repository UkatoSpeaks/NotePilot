"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Zap, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  Sparkles,
  Github,
  Chrome
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { loginWithGoogle, user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to login. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      setError("Google Sign-In failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans',sans-serif] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-50 rounded-full blur-3xl opacity-50 -z-10 animate-pulse" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-linear-to-tr from-[#2D6A4F] to-[#40916c] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-green-900/20 overflow-hidden">
               <img src="/logo.png" alt="NotePilot Logo" className="w-9 h-9 object-contain" />
            </div>
            <span className="text-2xl font-black tracking-tight text-[#2D6A4F]">NotePilot</span>
          </Link>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">Welcome Back</h1>
          <p className="text-gray-500 font-bold">Pick up right where you left off.</p>
        </div>

        <div className="bg-white p-10 rounded-5xl border border-gray-100 shadow-2xl shadow-indigo-900/5 space-y-8 relative overflow-hidden">
          {/* Form */}
          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anurag@example.com"
                  required
                  className="w-full h-16 bg-gray-50 border-2 border-transparent focus:border-indigo-600/20 focus:bg-white rounded-2xl pl-14 pr-4 font-bold text-gray-900 outline-none transition-all placeholder:text-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-16 bg-gray-50 border-2 border-transparent focus:border-indigo-600/20 focus:bg-white rounded-2xl pl-14 pr-4 font-bold text-gray-900 outline-none transition-all placeholder:text-gray-300"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-red-500 text-sm font-bold text-center bg-red-50 p-3 rounded-xl border border-red-100"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full h-16 bg-indigo-600 hover:bg-black text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5" /></>}
            </Button>
          </form>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <span className="relative z-10 bg-white px-4 text-xs font-black text-gray-400 uppercase tracking-widest">Or continue with</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="flex items-center justify-center gap-3 h-16 bg-gray-50 hover:bg-white border-2 border-transparent hover:border-gray-100 rounded-2xl font-black text-gray-900 transition-all group"
            >
              <Chrome className="w-6 h-6 text-orange-500 transition-transform group-hover:scale-110" />
              Google
            </button>
            <button 
              className="flex items-center justify-center gap-3 h-16 bg-gray-50 hover:bg-white border-2 border-transparent hover:border-gray-100 rounded-2xl font-black text-gray-400 grayscale transition-all cursor-not-allowed"
            >
              <Github className="w-6 h-6" />
              Github
            </button>
          </div>
        </div>

        <p className="text-center mt-10 text-gray-400 font-bold">
          Don't have an account?{" "}
          <Link href="/signup" className="text-indigo-600 hover:underline">
            Create for Free
          </Link>
        </p>

        <div className="mt-16 flex items-center justify-center gap-8 opacity-40">
           <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Encrypted</span>
           </div>
           <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">AI Verified</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
