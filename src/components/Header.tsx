import { Film, Plus } from "lucide-react";
import { useCineLogStore } from "@/store/useCineLogStore";

export function Header() {
  const setModalOpen = useCineLogStore((state) => state.setModalOpen);
  const setEditingLogId = useCineLogStore((state) => state.setEditingLogId);

  const handleAddClick = () => {
    setEditingLogId(null);
    setModalOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
          <Film className="h-6 w-6 text-[var(--color-velvet-red-light)] drop-shadow-[0_0_8px_rgba(178,34,34,0.6)]" />
          <h1 className="text-xl font-semibold tracking-wide text-zinc-100">
            Cine<span className="text-[var(--color-velvet-red-light)] font-light">Log</span>
          </h1>
        </div>
        
        <button 
          onClick={handleAddClick}
          className="flex items-center gap-1.5 bg-gradient-to-r from-[var(--color-velvet-red)] to-[var(--color-velvet-red-light)] text-zinc-50 px-4 py-2 rounded-full font-medium text-sm transition-all shadow-[0_0_15px_rgba(139,0,0,0.4)] hover:shadow-[0_0_25px_rgba(178,34,34,0.6)] active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Log</span>
        </button>
      </div>
    </header>
  );
}
