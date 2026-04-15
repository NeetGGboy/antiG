"use client";

import { useState } from "react";
import { useCineLogStore } from "@/store/useCineLogStore";
import { motion, AnimatePresence } from "framer-motion";
import { Users, UserPlus, Clock } from "lucide-react";
import { StarRating } from "@/components/StarRating";

export function SocialView() {
  const { user, friendLogs, addFriend } = useCineLogStore();
  const [friendIdInput, setFriendIdInput] = useState("");

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (friendIdInput.trim()) {
      addFriend(friendIdInput.trim());
      setFriendIdInput("");
    }
  };

  // Sort logs by date descending
  const sortedLogs = [...friendLogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="p-4 md:p-8 w-full max-w-2xl mx-auto">
      <div className="flex flex-col gap-6 mb-10">
        <h2 className="text-2xl font-serif text-zinc-100 tracking-wide flex items-center gap-2">
          <Users className="w-6 h-6 text-zinc-500" />
          Friends' Timeline
        </h2>
        
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-sm">
            <span className="text-zinc-500">My ID: </span>
            <span className="font-mono text-[var(--color-gold-light)] bg-zinc-950 px-2 py-1 rounded border border-zinc-800">{user.id}</span>
          </div>
          
          <form onSubmit={handleAddFriend} className="flex gap-2 relative">
            <input 
              type="text" 
              placeholder="Friend ID" 
              value={friendIdInput}
              onChange={(e) => setFriendIdInput(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 rounded-lg px-3 py-1.5 text-sm w-full outline-none focus:border-[var(--color-velvet-red)] transition-colors"
            />
            <button 
              type="submit" 
              disabled={!friendIdInput.trim()}
              className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-100 p-1.5 rounded-lg transition-colors border border-zinc-700"
            >
              <UserPlus className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      <div className="relative border-l-2 border-zinc-900 pl-6 ml-4 space-y-12">
        <AnimatePresence>
          {sortedLogs.map((log, i) => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <div className="absolute -left-[35px] top-2 rotate-45 w-4 h-4 border-2 border-zinc-900 bg-zinc-950" />
              
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs text-[var(--color-gold)] bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800/50">
                  @{log.userId}
                </span>
                <span className="text-xs text-zinc-500 flex items-center flex-1">
                  <Clock className="w-3 h-3 mr-1" />
                  {log.date}
                </span>
              </div>
              
              <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-xl p-4 group">
                <div className="flex gap-4">
                  {log.posterUrl && (
                    <div className="w-16 h-24 shrink-0 overflow-hidden rounded shadow-lg border border-zinc-800 hidden sm:block">
                      <img src={log.posterUrl} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base font-medium text-zinc-200">{log.title}</h3>
                      <div className="flex text-[var(--color-gold)] scale-75 origin-right">
                        <StarRating score={log.score} />
                      </div>
                    </div>
                    <p className="text-sm text-zinc-400 italic font-serif leading-relaxed">
                      "{log.memo}"
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {sortedLogs.length === 0 && (
          <div className="text-zinc-500 text-sm mt-8">
            No friend activity yet. Add a friend ID to see their logs.
          </div>
        )}
      </div>
    </div>
  );
}
