"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getNote, getAllNotes } from "@/lib/firestore";
import { NoteViewer } from "@/components/ui/note-viewer";
import { Loader2, FileText, ArrowLeft, Search, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

function NotesContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const noteId = searchParams.get("id");

  const [notes, setNotes] = useState<any[]>([]);
  const [currentNote, setCurrentNote] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        if (noteId) {
          const note = await getNote(noteId);
          setCurrentNote(note);
        } else {
          const allNotes = await getAllNotes(user.uid);
          setNotes(allNotes);
          setCurrentNote(null);
        }
      } catch (error) {
        console.error("NotesPage: Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, noteId]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#2D6A4F] animate-spin" />
      </div>
    );
  }

  if (noteId && currentNote) {
    return (
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/dashboard/notes")}
          className="gap-2 font-bold text-gray-400 hover:text-[#2D6A4F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Library
        </Button>
        <NoteViewer 
          title={currentNote.topic} 
          subject={currentNote.subject} 
          content={currentNote.content} 
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">My Library</h1>
          <p className="text-gray-500 font-bold">Manage all your AI-generated study material.</p>
        </div>
        <div className="flex items-center gap-4">
            <Link href="/dashboard/upload-pdf">
                <Button variant="outline" className="rounded-2xl gap-2 font-black border-2">
                    <Plus className="w-5 h-5" /> Upload PDF
                </Button>
            </Link>
            <Link href="/dashboard/generate-notes">
                <Button className="rounded-2xl gap-2 font-black bg-[#2D6A4F] hover:bg-[#1b4332] shadow-xl shadow-green-900/20">
                    <Plus className="w-5 h-5" /> New Note
                </Button>
            </Link>
        </div>
      </header>

      {notes.length === 0 ? (
        <div className="bg-white rounded-4xl border-4 border-dashed border-gray-100 p-12 text-center flex flex-col items-center">
           <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 text-gray-200">
              <FileText className="w-10 h-10" />
           </div>
           <h3 className="text-2xl font-black text-gray-900 mb-2">Your library is empty</h3>
           <p className="text-gray-400 font-bold mb-8 max-w-sm leading-relaxed text-base">You haven't generated any notes yet. Turn your textbooks into smart study guides in seconds.</p>
           <Link href="/dashboard/upload-pdf">
             <Button className="rounded-xl font-black bg-[#2D6A4F] hover:bg-black px-8 py-6 h-auto text-base transition-all shadow-2xl shadow-green-900/20">
                Get Started Now
             </Button>
           </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {notes.map(note => (
             <NoteCard key={note.id} note={note} />
           ))}
        </div>
      )}
    </div>
  );
}

function NoteCard({ note }: { note: any }) {
  const dateStr = note.createdAt?.toDate ? note.createdAt.toDate().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : 'Just now';
  
  return (
    <Link href={`?id=${note.id}`}>
      <motion.div 
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="p-8 rounded-3xl bg-white border border-gray-100 hover:border-[#2D6A4F]/30 transition-all cursor-pointer group hover:shadow-2xl hover:shadow-green-900/5 ring-1 ring-gray-50 h-full flex flex-col"
      >
        <div className="w-14 h-14 rounded-2xl bg-[#2D6A4F]/5 flex items-center justify-center text-[#2D6A4F] group-hover:bg-[#2D6A4F] group-hover:text-white transition-all mb-8 shadow-inner">
           <FileText className="w-7 h-7" />
        </div>
        <h4 className="text-xl font-black text-gray-900 mb-2 truncate w-full">{note.topic}</h4>
        <div className="flex items-center gap-3 mb-8 flex-wrap">
           <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest border border-orange-100">{note.subject}</span>
           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">{dateStr}</span>
        </div>
        <div className="mt-auto flex items-center text-[#2D6A4F] font-black text-[10px] uppercase tracking-widest gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
           Open Library <ArrowRight className="w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform" />
        </div>
      </motion.div>
    </Link>
  );
}

export default function NotesPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#2D6A4F] animate-spin" />
      </div>
    }>
      <NotesContent />
    </Suspense>
  );
}
