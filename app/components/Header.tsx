"use client";

import Image from "next/image";
import { MessageSquare, UtensilsCrossed, User } from "lucide-react";

type Tab = "chat" | "menu" | "profile";

interface HeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="relative z-20 border-b border-brand-black-border bg-brand-black/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-1 shrink-0">
          <div className="w-16 h-16 rounded-xl bg-transparent overflow-hidden shrink-0 flex items-center justify-center">
            <Image
              src="/Logo.png"
              alt="SAVOR.AI"
              width={57}
              height={57}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span
                className="font-display text-2xl leading-none tracking-wide"
                style={{ color: "#FF6B00" }}
              >
                SAVOR
              </span>
              <span className="text-xs text-brand-gray font-body tracking-widest uppercase">.AI</span>
            </div>
            <div className="text-[10px] text-brand-gray tracking-widest uppercase">
              × Chowman
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center bg-brand-black-card border border-brand-black-border rounded-xl p-1 gap-1">
          <button
            onClick={() => onTabChange("chat")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "chat"
                ? "text-white"
                : "text-brand-gray hover:text-brand-gray-light"
            }`}
            style={
              activeTab === "chat"
                ? { background: "linear-gradient(135deg, #FF6B00, #CC5500)" }
                : {}
            }
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">AI Companion</span>
          </button>
          <button
            onClick={() => onTabChange("menu")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "menu"
                ? "text-white"
                : "text-brand-gray hover:text-brand-gray-light"
            }`}
            style={
              activeTab === "menu"
                ? { background: "linear-gradient(135deg, #FF6B00, #CC5500)" }
                : {}
            }
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span className="hidden sm:inline">Full Menu</span>
          </button>
          <button
            onClick={() => onTabChange("profile")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "profile"
                ? "text-white"
                : "text-brand-gray hover:text-brand-gray-light"
            }`}
            style={
              activeTab === "profile"
                ? { background: "linear-gradient(135deg, #FF6B00, #CC5500)" }
                : {}
            }
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">My Profile</span>
          </button>
        </nav>

        {/* Tagline */}
        <div className="hidden md:block text-right shrink-0">
          <div className="text-xs text-brand-gray-light font-medium">Think Chinese...</div>
          <div className="text-xs text-brand-orange font-semibold">Think Chowman</div>
        </div>
      </div>
    </header>
  );
}
