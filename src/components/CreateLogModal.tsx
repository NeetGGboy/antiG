"use client";

import { useState, useEffect } from "react";
import { useCineLogStore } from "@/store/useCineLogStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Film, Calendar, Type, ArrowLeft, Wand2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { StarRating } from "@/components/StarRating";

export function CreateLogModal() {
  const { isModalOpen, setModalOpen, addLog, updateLog, editingLogId, myLogs } = useCineLogStore();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [score, setScore] = useState(0);
  const [memo, setMemo] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [hoverScore, setHoverScore] = useState(0);

  const [step, setStep] = useState<"form" | "confirm">("form");
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isFetchingPoster, setIsFetchingPoster] = useState(false);
  
  const [nowPlaying, setNowPlaying] = useState<string[]>([]);
  const [isFetchingNowPlaying, setIsFetchingNowPlaying] = useState(false);

  // Pre-fill fields if editing
  useEffect(() => {
    if (isModalOpen) {
      if (editingLogId) {
        const logToEdit = myLogs.find(log => log.id === editingLogId);
        if (logToEdit) {
          setTitle(logToEdit.title);
          setDate(logToEdit.date);
          setScore(logToEdit.score);
          setMemo(logToEdit.memo);
          setPosterUrl(logToEdit.posterUrl || "");
        }
      } else {
        // Reset if creating new
        setTitle("");
        setDate(format(new Date(), "yyyy-MM-dd"));
        setScore(0);
        setMemo("");
        setPosterUrl("");
      }
      setStep("form");
      setHoverScore(0);
      setIsAnimatingOut(false);

      // Fetch now playing if empty
      if (nowPlaying.length === 0) {
        setIsFetchingNowPlaying(true);
        fetch('/api/now-playing')
          .then(res => res.json())
          .then(data => {
            if (data.titles) setNowPlaying(data.titles);
          })
          .catch(() => {})
          .finally(() => setIsFetchingNowPlaying(false));
      }
    }
  }, [isModalOpen, editingLogId, myLogs]);

  const handleAutoFetchPoster = async () => {
    if (!title) return;
    setIsFetchingPoster(true);
    try {
      const res = await fetch(`/api/poster?q=${encodeURIComponent(title)}`);
      const data = await res.json();
      if (data.url) {
        setPosterUrl(data.url);
      } else {
        alert("Sorry, poster not found. You can manually paste an image URL instead.");
      }
    } catch (e) {
      alert("Failed to fetch poster automatically.");
    } finally {
      setIsFetchingPoster(false);
    }
  };

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || score === 0) return;
    setStep("confirm");
  };

  const handleConfirmAndSave = () => {
    setIsAnimatingOut(true);
    
    setTimeout(() => {
      const payload = {
        title,
        date,
        score,
        memo,
        posterUrl: posterUrl.trim() || undefined,
      };

      if (editingLogId) {
        updateLog(editingLogId, payload);
      } else {
        addLog(payload);
      }
      setModalOpen(false);
      
      setTimeout(() => {
        setStep("form");
        setIsAnimatingOut(false);
      }, 500);
    }, 1500); // Animation duration
  };

  if (!isModalOpen && !isAnimatingOut) return null;

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isAnimatingOut && setModalOpen(false)}
          />

          {/* Modal Box */}
          <motion.div
            className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col max-h-[90vh]"
            initial={{ y: 50, scale: 0.95, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex justify-between items-center p-4 border-b border-zinc-900 bg-zinc-900/40 shrink-0">
              <h2 className="text-lg font-medium text-zinc-100 flex items-center gap-2">
                {step === "confirm" ? (
                  <button onClick={() => setStep("form")} className="mr-1 text-zinc-400 hover:text-zinc-100 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                ) : (
                  <Film className="w-5 h-5 text-[var(--color-velvet-red-light)]" />
                )}
                {step === "confirm" ? "Review Log" : editingLogId ? "Edit Log" : "Add New Log"}
              </h2>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
                disabled={isAnimatingOut}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto">
              <AnimatePresence mode="wait">
                {step === "form" ? (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleReview} 
                    className="p-4 sm:p-6 space-y-6"
                  >
                    <div className="space-y-4">
                      {/* Title */}
                      <div className="relative">
                        <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input 
                          type="text" 
                          placeholder="Movie Title" 
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder:text-zinc-500 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[var(--color-velvet-red)] transition-colors"
                        />
                      </div>

                      {/* Now Playing Suggestions */}
                      {nowPlaying.length > 0 && step === "form" && (
                        <div className="mt-2">
                          <p className="text-xs text-zinc-500 mb-2">Currently in theaters:</p>
                          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto custom-scrollbar">
                            {nowPlaying.map((movieTitle) => (
                              <button
                                key={movieTitle}
                                type="button"
                                onClick={() => setTitle(movieTitle)}
                                className="text-xs bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-2.5 py-1.5 rounded-full transition-colors active:scale-95 text-left"
                              >
                                {movieTitle}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Date */}
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input 
                          type="date" 
                          required
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[var(--color-velvet-red)] transition-colors [color-scheme:dark]"
                        />
                      </div>

                      {/* Score */}
                      <div className="pt-2 pb-1">
                        <label className="block text-sm text-zinc-400 mb-2 font-medium">Your Score</label>
                        <StarRating 
                          score={score} 
                          hoverScore={hoverScore} 
                          interactive 
                          onScoreChange={setScore} 
                          onHoverChange={setHoverScore} 
                          className="w-8 h-8 cursor-pointer"
                        />
                      </div>

                      {/* Memo */}
                      <div>
                        <textarea 
                          placeholder="Write your private memo here..." 
                          value={memo}
                          onChange={(e) => setMemo(e.target.value)}
                          rows={4}
                          className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder:text-zinc-500 rounded-xl p-4 outline-none focus:border-[var(--color-velvet-red)] transition-colors resize-none"
                        />
                      </div>

                      {/* Poster URL */}
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-sm font-medium text-zinc-400">Poster Image</label>
                          <button
                            type="button"
                            onClick={handleAutoFetchPoster}
                            disabled={!title || isFetchingPoster}
                            className="text-xs flex items-center gap-1 text-[var(--color-gold)] hover:text-[var(--color-gold-light)] disabled:opacity-50 disabled:hover:text-[var(--color-gold)] transition-colors"
                          >
                            {isFetchingPoster ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                            Auto-fetch from title
                          </button>
                        </div>
                        <div className="relative">
                          <Film className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                          <input 
                            type="url" 
                            placeholder="Poster Image URL (Optional)" 
                            value={posterUrl}
                            onChange={(e) => setPosterUrl(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder:text-zinc-500 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[var(--color-velvet-red)] transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button 
                        type="submit"
                        disabled={!title || score === 0 || isAnimatingOut}
                        className="w-full bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white rounded-xl py-3.5 font-medium tracking-wide transition-all active:scale-[0.98]"
                      >
                        Review Log
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="confirm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 sm:p-6 space-y-6"
                  >
                    <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/80">
                      <h3 className="text-xl font-medium text-zinc-100 mb-2">{title}</h3>
                      <div className="flex text-[var(--color-gold)] mb-3">
                        <StarRating score={score} />
                      </div>
                      <div className="flex items-center text-sm text-zinc-500 mb-4 font-mono">
                        <Calendar className="w-3 h-3 mr-1" />
                        {date}
                      </div>
                      <p className="text-sm text-zinc-300 italic whitespace-pre-wrap border-l-2 border-zinc-800 pl-3 py-1">
                        "{memo || "No memo"}"
                      </p>
                      {posterUrl && (
                        <div className="mt-4 pt-4 border-t border-zinc-800/50">
                          <p className="text-xs text-zinc-500 mb-2">Poster Preview:</p>
                          <img src={posterUrl} alt="Poster preview" className="w-24 h-auto rounded shadow-lg border border-zinc-800" />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => setStep("form")}
                        className="flex-1 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-xl py-3.5 font-medium transition-colors"
                      >
                        Back to Edit
                      </button>
                      <button 
                        onClick={handleConfirmAndSave}
                        disabled={isAnimatingOut}
                        className="flex-[2] bg-[var(--color-velvet-red)] hover:bg-[var(--color-velvet-red-light)] text-white rounded-xl py-3.5 font-medium tracking-wide transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(139,0,0,0.3)] relative overflow-hidden"
                      >
                        <span className="relative z-10">Confirm & Save</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          
          {/* Projector/Curtain Animation Overlay */}
          <AnimatePresence>
            {isAnimatingOut && (
              <motion.div 
                className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none bg-black overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="absolute left-0 top-0 bottom-0 w-1/2 bg-[var(--color-velvet-red-dark)] border-r-4 border-[var(--color-gold)] shadow-2xl skew-x-2"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.div 
                  className="absolute right-0 top-0 bottom-0 w-1/2 bg-[var(--color-velvet-red-dark)] border-l-4 border-[var(--color-gold)] shadow-2xl -skew-x-2"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
                
                <motion.div 
                  className="absolute z-10 w-[60vh] h-[60vh] rounded-full bg-white/10 blur-[100px] mix-blend-screen"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                />

                <motion.div
                  className="absolute z-20 flex flex-col items-center justify-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: [0.5, 1.2, 1] }}
                  transition={{ delay: 0.6, duration: 0.5, times: [0, 0.6, 1] }}
                >
                  <Film className="w-16 h-16 text-[var(--color-gold)] mb-4 animate-pulse" />
                  <div className="text-2xl font-serif text-[var(--color-gold-light)] tracking-[0.2em] uppercase">
                    Cut! Print It.
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
