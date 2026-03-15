"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Flashcard } from "@/components/ui/flashcard";
import { 
  Plus, 
  Search, 
  Filter, 
  Sparkles, 
  ArrowRight,
  Brain,
  X,
  CheckCircle2,
  Trophy,
  History,
  Trash2,
  Clock,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const INITIAL_CARDS = [
  {
    id: 1,
    category: "Physics",
    front: "What is Newton's First Law of Motion?",
    back: "An object remains at rest or in uniform motion unless acted upon by an external force (Law of Inertia).",
    mastered: true
  },
  {
    id: 2,
    category: "Biology",
    front: "Which organelle is the powerhouse of the cell?",
    back: "The Mitochondria, responsible for producing ATP through cellular respiration.",
    mastered: false
  },
  {
    id: 3,
    category: "Chemistry",
    front: "What is an Ionic Bond?",
    back: "A chemical bond formed by the complete transfer of electrons from one atom to another.",
    mastered: true
  },
  {
    id: 4,
    category: "History",
    front: "When did the French Revolution begin?",
    back: "The French Revolution began in 1789 with the Storming of the Bastille.",
    mastered: false
  },
  {
    id: 5,
    category: "Math",
    front: "What is the Pythagorean Theorem?",
    back: "In a right-angled triangle, a² + b² = c², where c is the hypotenuse.",
    mastered: false
  },
];

import { useAuth } from "@/context/AuthContext";
import { saveFlashcards, getUserUsage } from "@/lib/firestore";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function FlashcardsPage() {
  const { user } = useAuth();
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [newCard, setNewCard] = useState({ front: "", back: "", category: "General" });

  useEffect(() => {
    async function fetchCards() {
      if (!user) return;
      try {
        const q = query(collection(db, "flashcards"), where("userId", "==", user.uid));
        const snap = await getDocs(q);
        const fetchedCards: any[] = [];
        snap.forEach(doc => {
           const data = doc.data();
           data.cards.forEach((c: any, idx: number) => {
              fetchedCards.push({
                id: doc.id + idx,
                category: data.topic || "AI",
                front: c.question,
                back: c.answer,
                mastered: false
              });
           });
        });
        setCards(fetchedCards.length > 0 ? fetchedCards : INITIAL_CARDS);
      } catch (error) {
        console.error("Error fetching cards:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCards();
  }, [user]);

  // 1. Filtering Logic
  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      const matchesFilter = filter === "All" || card.category === filter;
      const matchesSearch = card.front.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            card.back.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [cards, filter, searchQuery]);

  // 2. Stats Logic
  const stats = useMemo(() => {
    return {
      total: cards.length,
      mastered: cards.filter(c => c.mastered).length,
      due: cards.filter(c => !c.mastered).length,
      new: 2, // Symbolic
    };
  }, [cards]);

  // 3. Handlers
  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCard.front || !newCard.back || !user) return;
    
    const cardData = { question: newCard.front, answer: newCard.back };
    try {
      await saveFlashcards(user.uid, newCard.category, [cardData]);
      const card = {
          id: Date.now(),
          ...newCard,
          mastered: false
      };
      setCards([card, ...cards]);
      setNewCard({ front: "", back: "", category: "General" });
      setIsAddingNew(false);
    } catch (error) {
      console.error("Error saving card:", error);
    }
  };

  const toggleMastery = (id: string | number) => {
    setCards(cards.map(c => c.id === id ? { ...c, mastered: !c.mastered } : c));
  };

  const deleteCard = (id: string | number) => {
    setCards(cards.filter(c => c.id !== id));
  };

  const handleAIGenerate = async () => {
    if (!user) return;
    setIsGeneratingAI(true);
    
    // Simulate AI Generation and save
    setTimeout(async () => {
      const aiCards = [
        { question: "What is semantic analysis?", answer: "The process of drawing meaning from language by studying word relationships." },
        { question: "Define Machine Learning.", answer: "A subset of AI that enables systems to learn and improve from experience." }
      ];

      try {
        await saveFlashcards(user.uid, "AI", aiCards);
        const formattedCards = aiCards.map((c, idx) => ({
            id: Date.now() + idx,
            category: "AI",
            front: c.question,
            back: c.answer,
            mastered: false
        }));
        setCards([...formattedCards, ...cards]);
        setIsGeneratingAI(false);
        setFilter("AI");
      } catch (error) {
        console.error("Error saving AI cards:", error);
        setIsGeneratingAI(false);
      }
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-[10px] font-black uppercase tracking-widest">
            <Brain className="w-3 h-3" /> Active Recall Mode
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            My <span className="text-purple-600">Flashcards</span>
          </h1>
          <p className="text-lg text-gray-500 font-bold max-w-lg">Master complex topics faster with our AI-optimized spaced repetition system.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleAIGenerate}
            disabled={isGeneratingAI}
            variant="outline" 
            className="rounded-2xl border-2 border-purple-100 hover:border-purple-200 hover:bg-purple-50 text-purple-600 px-6 h-14 font-black transition-all gap-2"
          >
            {isGeneratingAI ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-[#F9A11B]" />}
            {isGeneratingAI ? "AI Thinking..." : "AI Generate Cards"}
          </Button>
          <Button 
            onClick={() => setIsAddingNew(true)}
            className="bg-[#2D6A4F] hover:bg-[#1b4332] text-white rounded-2xl px-8 h-14 font-black shadow-xl shadow-green-900/20 transition-all gap-2"
          >
            <Plus className="w-6 h-6" /> Create New Card
          </Button>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatItem icon={<Brain className="w-5 h-5" />} label="Total Cards" value={stats.total} color="bg-indigo-50 text-indigo-600" />
        <StatItem icon={<Trophy className="w-5 h-5" />} label="Mastered" value={stats.mastered} color="bg-green-50 text-green-600" />
        <StatItem icon={<History className="w-5 h-5" />} label="Due Today" value={stats.due} color="bg-orange-50 text-orange-600" />
        <StatItem icon={<ArrowRight className="w-5 h-5" />} label="New Arrivals" value={stats.new} color="bg-purple-50 text-purple-600" />
      </div>

      {/* Control Bar */}
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-2xl shadow-green-900/5 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 no-scrollbar">
          {["All", "Physics", "Biology", "Chemistry", "History", "Math", "AI"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-6 py-3 rounded-2xl text-sm font-black transition-all whitespace-nowrap border-2",
                filter === cat 
                  ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-200" 
                  : "bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search your knowledge..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-gray-800 placeholder:text-gray-400 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
            />
          </div>
          <Button variant="ghost" size="icon" className="w-14 h-14 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-400 shrink-0">
            <Filter className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence mode="popLayout">
          {filteredCards.map((card, idx) => (
            <motion.div
              layout
              key={card.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative group h-full"
            >
               {/* Action Buttons Overlay */}
               <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => { e.stopPropagation(); toggleMastery(card.id); }}
                    className={cn("w-10 h-10 rounded-xl", card.mastered ? "bg-green-100 text-green-600" : "bg-white/80 backdrop-blur-md text-gray-400 hover:text-green-500")}
                  >
                     <CheckCircle2 className="w-5 h-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => { e.stopPropagation(); deleteCard(card.id); }}
                    className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-md text-gray-400 hover:text-red-500"
                  >
                     <Trash2 className="w-5 h-5" />
                  </Button>
               </div>

               <Flashcard front={card.front} back={card.back} category={card.category} />
               
               {card.mastered && (
                 <div className="absolute -top-2 -left-2 z-10 bg-green-500 text-white p-2 rounded-xl shadow-lg border-4 border-white">
                    <Trophy className="w-4 h-4" />
                 </div>
               )}
            </motion.div>
          ))}
          
          {/* Add New Placeholder Link if Empty */}
          {filteredCards.length === 0 && (
            <div className="col-span-full py-20 bg-gray-50/50 rounded-[48px] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
                <Search className="w-16 h-16 text-gray-200 mb-6" />
                <h3 className="text-2xl font-black text-gray-400 mb-2">No matching cards found</h3>
                <p className="text-gray-400 font-bold mb-8">Try adjusting your filters or create a new card.</p>
                <Button onClick={() => setFilter("All")} variant="outline" className="rounded-2xl font-black border-2">Clear Filters</Button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* New Card Modal Simulation */}
      <AnimatePresence>
        {isAddingNew && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-10">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsAddingNew(false)}
                    className="absolute inset-0 bg-black/40 backdrop-blur-md"
                />
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-xl bg-white rounded-[48px] p-10 md:p-14 shadow-2xl overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-purple-600 to-indigo-600" />
                    <button onClick={() => setIsAddingNew(false)} className="absolute top-10 right-10 p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-red-500 transition-colors">
                        <X className="w-6 h-6" />
                    </button>

                    <div className="mb-10">
                        <h3 className="text-3xl font-black text-gray-900 mb-2">Create New Card</h3>
                        <p className="text-gray-400 font-bold">Manual creation is great for custom definitions.</p>
                    </div>

                    <form onSubmit={handleAddCard} className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Category</label>
                            <select 
                                value={newCard.category}
                                onChange={(e) => setNewCard({...newCard, category: e.target.value})}
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-purple-600/20 focus:bg-white rounded-2xl p-5 font-black outline-none transition-all"
                            >
                                <option>Physics</option>
                                <option>Biology</option>
                                <option>Chemistry</option>
                                <option>Math</option>
                                <option>History</option>
                                <option>General</option>
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Question (Front)</label>
                            <textarea 
                                placeholder="What is the concept you want to learn?"
                                value={newCard.front}
                                onChange={(e) => setNewCard({...newCard, front: e.target.value})}
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-purple-600/20 focus:bg-white rounded-2xl p-5 font-bold outline-none transition-all h-28 resize-none"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Answer (Back)</label>
                            <textarea 
                                placeholder="Explain the concept in simple terms..."
                                value={newCard.back}
                                onChange={(e) => setNewCard({...newCard, back: e.target.value})}
                                className="w-full bg-linear-to-br from-purple-50 to-indigo-50 border-2 border-transparent focus:border-purple-600/20 focus:bg-white rounded-2xl p-5 font-bold outline-none transition-all h-28 resize-none"
                            />
                        </div>

                        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-2xl py-8 text-xl font-black shadow-2xl shadow-purple-500/20 gap-3">
                            <CheckCircle2 className="w-6 h-6" />
                            Save Flashcard
                        </Button>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* Spaced Repetition Banner */}
      <section className="bg-linear-to-br from-[#1b4332] to-[#2D6A4F] rounded-[48px] p-10 md:p-16 text-white relative overflow-hidden group">
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest mb-6">
                  <Clock className="w-3 h-3 text-orange-400" /> New: Review Schedule
               </div>
               <h2 className="text-4xl md:text-5xl font-black mb-6 leading-[1.1]">Ready for your daily <br/> review session?</h2>
               <p className="text-white/70 text-lg font-bold mb-10 leading-relaxed">Boost your retention by 80% with our algorithm-timed revision sessions. Only taking 5 minutes a day!</p>
               <Button className="bg-[#F9A11B] hover:bg-white hover:text-purple-600 text-white border-none rounded-2xl px-12 py-8 font-black text-xl shadow-2xl shadow-orange-500/20 transition-all flex items-center gap-4">
                  Start Daily Practice
                  <Trophy className="w-6 h-6" />
               </Button>
            </div>
            <div className="relative">
                <div className="w-48 h-48 bg-white/10 rounded-[40px] flex items-center justify-center backdrop-blur-3xl shadow-2xl rotate-6 group-hover:rotate-0 transition-transform duration-700">
                   <Brain className="w-24 h-24 text-white opacity-40" />
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#F9A11B] rounded-2xl flex items-center justify-center text-white font-black shadow-lg">12</div>
            </div>
         </div>
         {/* Decorative blobs */}
         <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-400/20 rounded-full blur-[120px] pointer-events-none" />
         <div className="absolute -top-24 -left-24 w-64 h-64 bg-green-400/20 rounded-full blur-[100px] pointer-events-none" />
      </section>
    </div>
  );
}

function StatItem({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number, color: string }) {
  return (
    <div className="bg-white border border-gray-100 p-8 rounded-[40px] flex items-center justify-between transition-all hover:shadow-2xl hover:shadow-green-900/5 group shadow-sm">
      <div className="space-y-1">
        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-4xl font-black text-gray-900 tracking-tight">{value}</p>
      </div>
      <div className={cn("w-20 h-20 rounded-[32px] flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform", color)}>
        {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<any>, { className: "w-10 h-10" })}
      </div>
    </div>
  );
}
