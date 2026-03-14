"use client";

import React, { useState } from "react";
import { 
  User, 
  Bell, 
  Shield, 
  Smartphone, 
  LogOut, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight,
  Brain,
  Palette,
  Eye,
  Settings,
  Mail,
  Lock,
  Globe,
  Loader2,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type SettingsTab = "profile" | "preferences" | "notifications" | "security";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  // States for various settings
  const [profile, setProfile] = useState({
    name: "Anurag",
    email: "anurag@example.com",
    class: "12",
    school: "Central High School",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anurag"
  });

  const [aiPrefs, setAiPrefs] = useState({
    conciseness: 75,
    autoFlashcards: true,
    smartSummaries: true,
    outputLanguage: "English"
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    studyReminders: true,
    weeklyReports: false,
    newFeatures: true
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    }, 1500);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
    { id: "preferences", label: "Study & AI", icon: <Brain className="w-5 h-5" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5" /> },
    { id: "security", label: "Security", icon: <Shield className="w-5 h-5" /> },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                Control <span className="text-indigo-600">Center</span>
            </h1>
            <p className="text-lg text-gray-500 font-bold max-w-lg">Tailor NotePilot to match your unique learning style and personal preferences.</p>
        </div>
        
        <div className="flex items-center gap-4">
            <AnimatePresence mode="wait">
                {showSaved && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-2 text-green-600 font-black text-sm pr-4"
                    >
                        <CheckCircle2 className="w-5 h-5" /> All Changes Saved
                    </motion.div>
                )}
            </AnimatePresence>
            <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-indigo-600 hover:bg-black text-white rounded-2xl px-10 h-14 font-black shadow-2xl shadow-indigo-600/20 transition-all flex items-center gap-2"
            >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Settings className="w-5 h-5" />}
                {isSaving ? "Syncing..." : "Save Preferences"}
            </Button>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Tab Sidebar */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 h-fit">
          <div className="bg-white p-4 rounded-4xl border border-gray-100 shadow-2xl shadow-indigo-900/5 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={cn(
                  "w-full flex items-center gap-4 p-5 rounded-2xl text-lg font-black transition-all group",
                  activeTab === tab.id 
                    ? "bg-indigo-50 text-indigo-600" 
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                  activeTab === tab.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-gray-100 text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                )}>
                  {tab.icon}
                </div>
                {tab.label}
                {activeTab === tab.id && <motion.div layoutId="activeTab" className="ml-auto w-2 h-2 rounded-full bg-indigo-600" />}
              </button>
            ))}
          </div>

          <div className="mt-8 p-8 rounded-4xl bg-linear-to-br from-indigo-600 to-indigo-800 text-white shadow-2xl shadow-indigo-900/10 relative overflow-hidden group">
            <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                   <Sparkles className="w-6 h-6 text-indigo-300" />
                </div>
                <h4 className="text-xl font-black mb-3 text-white">Pro Tip</h4>
                <p className="text-indigo-100 font-bold text-sm leading-relaxed">Personalizing your 'Study & AI' settings can increase information retention by up to 30% through targeted content style.</p>
            </div>
            <Sparkles className="absolute -bottom-10 -right-10 w-40 h-40 text-white/5 group-hover:scale-110 transition-transform duration-700" />
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8">
            <div className="bg-white p-10 md:p-14 rounded-5xl border border-gray-100 shadow-2xl shadow-indigo-900/5 min-h-[600px]">
                <AnimatePresence mode="wait">
                    {activeTab === "profile" && (
                        <motion.div 
                            key="profile"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-10"
                        >
                            <div className="flex flex-col sm:flex-row items-center gap-10">
                                <div className="relative group">
                                    <div className="w-40 h-40 rounded-[48px] overflow-hidden bg-indigo-50 border-4 border-white shadow-2xl relative">
                                        <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                    <button className="absolute -bottom-4 -right-4 w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl border-4 border-white hover:scale-110 transition-transform">
                                        <Palette className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="space-y-2 text-center sm:text-left">
                                    <h3 className="text-3xl font-black text-gray-900">{profile.name}</h3>
                                    <p className="text-indigo-600 font-black uppercase tracking-widest text-xs">Standard Student Account</p>
                                    <p className="text-gray-400 font-bold">{profile.email}</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 pt-6">
                                <InputField label="Full Name" value={profile.name} onChange={(v) => setProfile({...profile, name: v})} icon={<User className="w-5 h-5" />} />
                                <InputField label="Email Address" value={profile.email} onChange={(v) => setProfile({...profile, email: v})} icon={<Mail className="w-5 h-5" />} />
                                <InputField label="Grade / Class" value={profile.class} onChange={(v) => setProfile({...profile, class: v})} icon={<BookOpen className="w-5 h-5" />} />
                                <InputField label="School / College" value={profile.school} onChange={(v) => setProfile({...profile, school: v})} icon={<Globe className="w-5 h-5" />} />
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "preferences" && (
                        <motion.div 
                            key="preferences"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-12"
                        >
                            <div className="space-y-8">
                                <h3 className="text-2xl font-black text-gray-900 pb-2 border-b-2 border-dashed border-gray-100">AI Intelligence Settings</h3>
                                
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="font-black text-gray-900">Summary Conciseness</p>
                                            <p className="text-sm font-bold text-gray-400">Control how detailed the AI notes should be.</p>
                                        </div>
                                        <span className="text-xl font-black text-indigo-600">{aiPrefs.conciseness}%</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="20" max="100" 
                                        value={aiPrefs.conciseness}
                                        onChange={(e) => setAiPrefs({...aiPrefs, conciseness: parseInt(e.target.value)})}
                                        className="w-full h-3 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                    <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <span>Concise</span>
                                        <span>Balanced</span>
                                        <span>Detailed</span>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <ToggleItem 
                                        title="Auto-Generate Flashcards" 
                                        desc="Automatically create flashcards whenever you upload a PDF or generate notes." 
                                        enabled={aiPrefs.autoFlashcards}
                                        onToggle={() => setAiPrefs({...aiPrefs, autoFlashcards: !aiPrefs.autoFlashcards})}
                                    />
                                    <ToggleItem 
                                        title="Smart Concept Mapping" 
                                        desc="Identify relationships between different topics automatically." 
                                        enabled={aiPrefs.smartSummaries}
                                        onToggle={() => setAiPrefs({...aiPrefs, smartSummaries: !aiPrefs.smartSummaries})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-8">
                                <h3 className="text-2xl font-black text-gray-900 pb-2 border-b-2 border-dashed border-gray-100">Language Preferences</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {["English", "Hindi", "French", "Spanish"].map((lang) => (
                                        <button 
                                            key={lang}
                                            onClick={() => setAiPrefs({...aiPrefs, outputLanguage: lang})}
                                            className={cn(
                                                "p-6 rounded-3xl border-4 font-black transition-all",
                                                aiPrefs.outputLanguage === lang ? "bg-indigo-50 border-indigo-600 text-indigo-600 shadow-xl shadow-indigo-100" : "bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100"
                                            )}
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "notifications" && (
                        <motion.div 
                            key="notifications"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="p-10 rounded-[40px] bg-indigo-50 border border-indigo-100 flex gap-8 items-center mb-10">
                                <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl">
                                    <Bell className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xl font-black text-gray-900">Push Notifications</h4>
                                    <p className="text-gray-500 font-bold">Stay updated with study reminders and feature updates.</p>
                                </div>
                                <Button className="bg-white text-indigo-600 hover:bg-indigo-100 rounded-2xl h-14 px-8 font-black border border-indigo-100 shadow-none">Enable</Button>
                            </div>

                            <ToggleItem 
                                title="Daily Study Reminders" 
                                desc="Get notified when it's time for your spaced-repetition session." 
                                enabled={notificationPrefs.studyReminders}
                                onToggle={() => setNotificationPrefs({...notificationPrefs, studyReminders: !notificationPrefs.studyReminders})}
                            />
                            <ToggleItem 
                                title="Weekly Progress Reports" 
                                desc="Receive a detailed breakdown of your learning activity via email." 
                                enabled={notificationPrefs.weeklyReports}
                                onToggle={() => setNotificationPrefs({...notificationPrefs, weeklyReports: !notificationPrefs.weeklyReports})}
                            />
                            <ToggleItem 
                                title="New Feature Alerts" 
                                desc="Be the first to know about new AI capabilities and tools." 
                                enabled={notificationPrefs.newFeatures}
                                onToggle={() => setNotificationPrefs({...notificationPrefs, newFeatures: !notificationPrefs.newFeatures})}
                            />
                        </motion.div>
                    )}

                    {activeTab === "security" && (
                        <motion.div 
                            key="security"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-10"
                        >
                            <div className="space-y-8">
                                <h3 className="text-2xl font-black text-gray-900">Security Safeguards</h3>
                                
                                <div className="space-y-4">
                                    <button className="w-full flex items-center justify-between p-8 rounded-4xl bg-gray-50 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all group">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-indigo-600 shadow-sm transition-colors">
                                                <Lock className="w-6 h-6" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-black text-gray-900">Change Password</p>
                                                <p className="text-sm font-bold text-gray-400">Update your account access credentials.</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-6 h-6 text-gray-300" />
                                    </button>

                                    <button className="w-full flex items-center justify-between p-8 rounded-4xl bg-gray-50 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all group">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-indigo-600 shadow-sm transition-colors">
                                                <Shield className="w-6 h-6" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-black text-gray-900">Two-Factor Authentication</p>
                                                <p className="text-sm font-bold text-gray-400">Add an extra layer of protection to your account.</p>
                                            </div>
                                        </div>
                                        <span className="px-5 py-2 rounded-full bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-widest">Highly Recommended</span>
                                    </button>
                                </div>
                            </div>

                            <div className="pt-10 border-t-2 border-dashed border-gray-100">
                                <h4 className="text-xl font-black text-red-600 mb-6 flex items-center gap-3">
                                    <LogOut className="w-6 h-6" /> Danger Zone
                                </h4>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button variant="outline" className="flex-1 rounded-2xl py-8 text-lg font-black text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700">Delete Account Permanently</Button>
                                    <Button variant="outline" className="flex-1 rounded-2xl py-8 text-lg font-black text-gray-400 hover:bg-gray-100">Deactivate Temporarily</Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, icon }: { label: string, value: string, onChange: (v: string) => void, icon?: React.ReactNode }) {
    return (
        <div className="space-y-4 group">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">{label}</label>
            <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                    {icon}
                </div>
                <input 
                    type="text" 
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600/20 focus:bg-white rounded-2xl py-5 pl-14 pr-4 font-bold text-gray-800 outline-none transition-all shadow-sm"
                />
            </div>
        </div>
    );
}

function ToggleItem({ title, desc, enabled, onToggle }: { title: string, desc: string, enabled: boolean, onToggle: () => void }) {
    return (
        <div className="flex items-center justify-between gap-6 p-2">
            <div className="space-y-1 pr-6 flex-1">
                <p className="font-black text-gray-900">{title}</p>
                <p className="text-sm font-bold text-gray-400 leading-relaxed">{desc}</p>
            </div>
            <button 
                onClick={onToggle}
                className={cn(
                    "w-20 h-10 rounded-full relative transition-all duration-300 p-1 shrink-0",
                    enabled ? "bg-indigo-600 shadow-lg shadow-indigo-200" : "bg-gray-200"
                )}
            >
                <motion.div 
                    animate={{ x: enabled ? 40 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="w-8 h-8 rounded-full bg-white shadow-md"
                />
            </button>
        </div>
    );
}
