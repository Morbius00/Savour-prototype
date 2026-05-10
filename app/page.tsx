"use client";

import { useState } from "react";
import ChatBot from "@/app/components/ChatBot";
import MenuExplorer from "@/app/components/MenuExplorer";
import Header from "@/app/components/Header";
import UserProfile from "@/app/components/UserProfile";

type Tab = "chat" | "menu" | "profile";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("chat");

  return (
    <div className="noise-overlay min-h-screen flex flex-col">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #FF6B00 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #FF6B00 0%, transparent 70%)" }}
        />
      </div>

      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 flex flex-col relative z-10">
        {/* All three tabs stay mounted — only visibility changes, so chat state is never lost */}
        <div className={activeTab === "chat" ? "flex flex-col flex-1" : "hidden"}>
          <ChatBot />
        </div>
        <div className={activeTab === "menu" ? "flex flex-col flex-1" : "hidden"}>
          <MenuExplorer />
        </div>
        <div className={activeTab === "profile" ? "flex flex-col flex-1" : "hidden"}>
          <UserProfile onGoToChat={() => setActiveTab("chat")} />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-brand-black-border py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-brand-gray">
          <span>
            <span className="text-brand-orange font-semibold">SAVOR.AI</span>
            {" "}× Chowman
          </span>
          <span>Taxes & packaging charges extra. Contains MSG.</span>
          <a
            href="https://www.chowman.net"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-orange hover:text-brand-orange-light transition-colors"
          >
            www.chowman.net
          </a>
        </div>
      </footer>
    </div>
  );
}
