import { Home, Users, User } from "lucide-react";
import clsx from "clsx";

type Tab = "home" | "social" | "profile";

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const navItems: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "home", label: "My Logs", icon: Home },
    { id: "social", label: "Social", icon: Users },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 z-50 w-full bg-zinc-950/90 backdrop-blur-lg border-t border-zinc-900 pb-[env(safe-area-inset-bottom)]">
        <ul className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id} className="flex-1">
                <button
                  onClick={() => onTabChange(item.id)}
                  className={clsx(
                    "w-full flex flex-col items-center justify-center gap-1 transition-colors duration-200",
                    isActive ? "text-[var(--color-gold)]" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-medium tracking-wider">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Desktop Side Navigation */}
      <nav className="hidden md:flex flex-col w-64 border-r border-zinc-900 bg-zinc-950/50 min-h-[calc(100vh-4rem)] p-4">
        <ul className="space-y-4 pt-8 border-t border-zinc-900/50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={clsx(
                    "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300",
                    isActive
                      ? "bg-zinc-900/80 text-[var(--color-gold)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_0_20px_rgba(212,175,55,0.05)]"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="font-medium tracking-wide">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
