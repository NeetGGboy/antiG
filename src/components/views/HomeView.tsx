import { useState } from "react";
import { useCineLogStore } from "@/store/useCineLogStore";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Edit3, Trash2, AlertTriangle } from "lucide-react";
import { StarRating } from "@/components/StarRating";

export function HomeView() {
  const { myLogs, sortOrder, setSortOrder, setModalOpen, setEditingLogId, deleteLog } = useCineLogStore();
  const [deletingLogId, setDeletingLogId] = useState<string | null>(null);

  const sortedLogs = [...myLogs].sort((a, b) => {
    if (sortOrder === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return b.score - a.score;
    }
  });

  return (
    <div className="p-4 md:p-8 w-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-serif text-zinc-100 tracking-wide">My Logs</h2>
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <span>Sort by:</span>
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "date" | "score")}
            className="bg-transparent border-b border-zinc-700 text-zinc-100 focus:outline-none focus:border-[var(--color-gold)] cursor-pointer pb-1 transition-colors"
          >
            <option value="date" className="bg-zinc-900">Date</option>
            <option value="score" className="bg-zinc-900">Score</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {sortedLogs.map((log, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              key={log.id}
              className="group relative flex gap-4 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-900/80 hover:border-zinc-700/50 transition-all cursor-pointer overflow-hidden"
            >
              {/* Subtle film strip edge effect */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjgiIGZpbGw9IiMxODE4MWIiLz48cmVjdCB4PSIxIiB5PSIxIiB3aWR0aD0iMiIgaGVpZ2h0PSIyIiBmaWxsPSIjMDkwOTA5IiBvcGFjaXR5PSIwLjUiLz48L3N2Zz4=')] opacity-20 group-hover:opacity-40 transition-opacity"></div>
              
              <div className="flex-1 pl-2 relative group/buttons">
                
                {/* Floating Action Buttons */}
                <div className="absolute right-0 top-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingLogId(log.id);
                      setModalOpen(true);
                    }}
                    className="text-zinc-400 hover:text-[var(--color-gold)] p-1.5 bg-zinc-800/80 hover:bg-zinc-700/80 rounded-lg backdrop-blur-sm transition-colors"
                    aria-label="Edit Log"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingLogId(log.id);
                    }}
                    className="text-zinc-400 hover:text-red-400 p-1.5 bg-zinc-800/80 hover:bg-zinc-700/80 rounded-lg backdrop-blur-sm transition-colors"
                    aria-label="Delete Log"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex justify-between items-start mb-2 pr-8">
                  <h3 className="text-lg font-medium text-zinc-100 group-hover:text-[var(--color-gold)] transition-colors">
                    {log.title}
                  </h3>
                  <div className="flex text-[var(--color-gold)]">
                    <StarRating score={log.score} />
                  </div>
                </div>
                
                <div className="flex items-center text-xs text-zinc-500 mb-3 font-mono">
                  <Calendar className="w-3 h-3 mr-1" />
                  {log.date}
                </div>
                
                <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                  {log.memo}
                </p>
              </div>
              
              {log.posterUrl && (
                <div className="hidden sm:block w-20 h-28 shrink-0 overflow-hidden rounded-md shadow-lg border border-zinc-800">
                  <img src={log.posterUrl} alt={log.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {sortedLogs.length === 0 && (
          <div className="text-center py-20 text-zinc-500">
            <p>No logs yet.</p>
            <p className="text-sm mt-2">Click "Add Log" to record your first movie.</p>
          </div>
        )}
      </div>
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingLogId && (
          <motion.div 
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setDeletingLogId(null)}
            />

            {/* Modal Box */}
            <motion.div
              className="relative w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="flex items-center gap-3 text-[var(--color-velvet-red)] mb-4">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-lg font-medium text-white">Delete Log?</h3>
              </div>
              <p className="text-sm text-zinc-400 mb-6 font-medium">
                Are you sure you want to delete this log? This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeletingLogId(null)}
                  className="flex-1 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-xl py-2.5 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    deleteLog(deletingLogId);
                    setDeletingLogId(null);
                  }}
                  className="flex-1 bg-[var(--color-velvet-red)] hover:bg-[var(--color-velvet-red-light)] text-white rounded-xl py-2.5 font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
