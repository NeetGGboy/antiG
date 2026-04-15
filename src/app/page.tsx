"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { HomeView } from "@/components/views/HomeView";
import { SocialView } from "@/components/views/SocialView";
import { ProfileView } from "@/components/views/ProfileView";
import { CreateLogModal } from "@/components/CreateLogModal";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"home" | "social" | "profile">("home");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <CreateLogModal />
      <div className="flex flex-1 overflow-hidden md:flex-row flex-col-reverse">
        {/* Navigation */}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 relative overflow-y-auto pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0 scroll-smooth bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-zinc-950 to-zinc-950">
          <div className="max-w-3xl mx-auto w-full min-h-full">
            {activeTab === "home" && <HomeView />}
            {activeTab === "social" && <SocialView />}
            {activeTab === "profile" && <ProfileView />}
          </div>
        </main>
      </div>
    </div>
  );
}
