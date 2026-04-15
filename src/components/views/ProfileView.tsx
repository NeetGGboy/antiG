"use client";

import { useCineLogStore } from "@/store/useCineLogStore";
import { User, CalendarDays, Calendar as CalendarIcon, Film, Trophy } from "lucide-react";
import { isThisMonth, isThisYear, parseISO } from "date-fns";

export function ProfileView() {
  const { user, myLogs } = useCineLogStore();

  const thisMonthCount = myLogs.filter(log => isThisMonth(parseISO(log.date))).length;
  const thisYearCount = myLogs.filter(log => isThisYear(parseISO(log.date))).length;

  const top5Logs = [...myLogs]
    .filter(log => isThisYear(parseISO(log.date)))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <div className="p-4 md:p-8 w-full max-w-4xl mx-auto space-y-12">
      
      {/* Profile Header & Stats Widget */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="col-span-1 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-velvet-red)]/10 blur-3xl rounded-full" />
          <div className="w-20 h-20 bg-zinc-900 border border-zinc-700/50 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,0,0,0.5)] z-10">
            <User className="w-10 h-10 text-[var(--color-gold)]" />
          </div>
          <h2 className="text-sm text-zinc-500 mb-1 z-10">My User ID</h2>
          <p className="font-mono text-zinc-100 z-10 break-all">{user.id}</p>
        </div>

        <div className="col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <CalendarDays className="w-5 h-5 text-[var(--color-velvet-red-light)]" />
              <h3 className="text-sm font-medium">This Month</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-serif text-zinc-50">{thisMonthCount}</span>
              <span className="text-zinc-500">movies</span>
            </div>
          </div>
          
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <CalendarIcon className="w-5 h-5 text-[var(--color-gold)]" />
              <h3 className="text-sm font-medium">This Year</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-serif text-zinc-50">{thisYearCount}</span>
              <span className="text-zinc-500">movies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top 5 of the Year */}
      <div>
        <h2 className="text-2xl font-serif text-zinc-100 tracking-wide flex items-center gap-2 mb-6">
          <Trophy className="w-6 h-6 text-[var(--color-gold)]" />
          Best of the Year (Top 5)
        </h2>
        
        {top5Logs.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {top5Logs.map((log, index) => (
              <div key={log.id} className="group relative rounded-xl overflow-hidden aspect-[2/3] bg-zinc-900 border border-zinc-800">
                {log.posterUrl ? (
                  <img src={log.posterUrl} alt={log.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                    <Film className="w-8 h-8 text-zinc-600" />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-80" />
                
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="text-[var(--color-gold)] text-xs font-bold mb-1 tracking-wider">#{index + 1}</div>
                  <h3 className="text-zinc-100 font-medium text-sm leading-tight line-clamp-2">{log.title}</h3>
                </div>
              </div>
            ))}
            
            {/* Fill empty spots if less than 5 */}
            {Array.from({ length: 5 - top5Logs.length }).map((_, i) => (
              <div key={`empty-${i}`} className="rounded-xl overflow-hidden aspect-[2/3] bg-zinc-900/30 border border-zinc-800/50 border-dashed flex items-center justify-center opacity-50">
                <span className="font-serif text-zinc-700 text-2xl">?</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-zinc-500 border border-zinc-800/50 rounded-2xl bg-zinc-900/20">
            <Trophy className="w-8 h-8 mx-auto mb-3 text-zinc-700" />
            <p>No movies logged this year yet.</p>
          </div>
        )}
      </div>

    </div>
  );
}
