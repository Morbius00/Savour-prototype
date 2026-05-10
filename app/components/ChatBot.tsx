"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Send, RotateCcw, ChefHat, Zap, ChevronDown, ChevronUp, MessageCircle, ShieldAlert, Plus, Minus, ShoppingCart, Receipt, X, CheckCircle } from "lucide-react";
import { CATEGORY_IMAGES, CATEGORY_NUTRITION, INGREDIENTS_MAP } from "@/data/menu";
import {
  loadProfile, saveProfile, recordSession, recordMood, recordSpice,
  recordDietary, recordBudget, recordRestriction, recordRecommendations,
} from "@/lib/profileStore";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Recommendation {
  id: string;
  name: string;
  price: number;
  category: string;
  isVeg: boolean;
  spiceLevel?: number;
  matchScore: number;
  shortReason: string;
  whyBestFit: string;
  pairWith?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  recommendations?: Recommendation[];
  options?: string[];
  intro?: string;
  followUp?: string;
  noted?: string;
}

interface CartItem {
  rec: Recommendation;
  qty: number;
}

interface BillData {
  orderNo: string;
  tableNo: number;
  items: CartItem[];
  timestamp: Date;
}

// ─── Image category lookup (fuzzy, array-based with per-item hash) ───────────

function hashId(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function getImageForCategory(category: string, itemId?: string): string | null {
  if (!category) return null;
  let images = CATEGORY_IMAGES[category];
  if (!images) {
    const lower = category.toLowerCase();
    const key = Object.keys(CATEGORY_IMAGES).find(
      (k) =>
        k.toLowerCase() === lower ||
        lower.includes(k.toLowerCase()) ||
        k.toLowerCase().includes(lower)
    );
    images = key ? CATEGORY_IMAGES[key] ?? [] : [];
  }
  if (!images || images.length === 0) return null;
  const idx = itemId ? hashId(itemId) % images.length : 0;
  return images[idx];
}

// ─── Parse AI response ────────────────────────────────────────────────────────

function parseAssistantResponse(raw: string): {
  text: string;
  recommendations: Recommendation[] | null;
  options: string[];
  intro: string;
  followUp: string;
  noted: string;
} {
  let text = raw;
  let recommendations: Recommendation[] | null = null;
  let options: string[] = [];
  let intro = "";
  let followUp = "";
  let noted = "";

  // Strip [RECS_START]...[RECS_END] block (may be present with or without closing tag if truncated)
  const recsMatch = text.match(/\[RECS_START\]([\s\S]*?)\[RECS_END\]/);
  if (recsMatch) {
    try {
      const parsed = JSON.parse(recsMatch[1].trim());
      recommendations = Array.isArray(parsed.items) ? parsed.items : null;
      intro = parsed.intro ?? "";
      followUp = parsed.followUp ?? "";
    } catch {
      // malformed JSON — ignore
    }
    text = text.replace(recsMatch[0], "").trim();
  } else {
    // Truncated response: [RECS_START] present but no [RECS_END] — remove the raw block
    const partialMatch = text.match(/\[RECS_START\][\s\S]*$/);
    if (partialMatch) {
      text = text.replace(partialMatch[0], "").trim();
    }
  }

  // Parse ALL [OPTS] blocks and merge into a single options list
  const allOptsMatches = [...text.matchAll(/\[OPTS\]([\s\S]*?)\[\/OPTS\]/g)];
  if (allOptsMatches.length > 0) {
    for (const m of allOptsMatches) {
      const chunk = m[1]
        .split("||")
        .map((o: string) => o.trim())
        .filter(Boolean);
      options = [...options, ...chunk];
      text = text.replace(m[0], "").trim();
    }
  }

  const noteMatch = text.match(/\[NOTE\]([\s\S]*?)\[\/NOTE\]/);
  if (noteMatch) {
    noted = noteMatch[1].trim();
    text = text.replace(noteMatch[0], "").trim();
  }

  return { text, recommendations, options, intro, followUp, noted };
}

// ─── Welcome message ──────────────────────────────────────────────────────────

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hey there! 👋 I'm **SAVOR**, your personal AI dining companion at **Chowman**.\n\nI'm here to find you the *perfect* dish. So tell me — what's your mood today?",
  timestamp: new Date(),
  options: [
    "😌 Stressed & need comfort",
    "🎉 Celebratory & adventurous",
    "🥗 Healthy & light",
    "🔥 Spicy & bold",
    "💕 Date night vibes",
    "🎲 Surprise me!",
  ],
};

const QUICK_PICKS = [
  "I need comfort food 🍜",
  "Something spicy! 🌶️",
  "Light & healthy",
  "Date night vibes 🥂",
  "I'm super hungry",
  "Surprise me!",
];

// ─── Chat persistence ─────────────────────────────────────────────────────────

const CHAT_KEY = "savor_chat_messages";

function saveChat(messages: Message[]): void {
  try {
    localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
  } catch {
    // storage quota exceeded — ignore
  }
}

function loadChat(): Message[] | null {
  try {
    const raw = localStorage.getItem(CHAT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Message[];
    // Revive timestamp strings → Date objects
    return parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return null;
  }
}

function clearChat(): void {
  try {
    localStorage.removeItem(CHAT_KEY);
  } catch {
    // ignore
  }
}

// ─── Match ring SVG ───────────────────────────────────────────────────────────

function MatchRing({ score }: { score: number }) {
  const color =
    score >= 90 ? "#22c55e" : score >= 75 ? "#FF6B00" : "#eab308";
  const radius = 16;
  const circ = 2 * Math.PI * radius;
  const dash = (score / 100) * circ;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 44, height: 44 }}
    >
      <svg
        width={44}
        height={44}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: "rotate(-90deg)",
        }}
      >
        <circle
          cx={22}
          cy={22}
          r={radius}
          fill="none"
          stroke="#1E1E1E"
          strokeWidth={3.5}
        />
        <circle
          cx={22}
          cy={22}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={3.5}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="text-[10px] font-bold" style={{ color }}>
        {score}%
      </span>
    </div>
  );
}

// ─── Food card ────────────────────────────────────────────────────────────────

function FoodCard({
  rec,
  onAsk,
  cartQty,
  onQtyChange,
}: {
  rec: Recommendation;
  onAsk: (q: string) => void;
  cartQty: number;
  onQtyChange: (rec: Recommendation, delta: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const ingredients = INGREDIENTS_MAP[rec.id] ?? [];
  const imgSrc = !imgErr ? getImageForCategory(rec.category, rec.id) : null;
  const spiceFlames = Array.from({ length: 5 }, (_, i) => i < (rec.spiceLevel ?? 0));

  const emoji =
    rec.category === "Chicken"
      ? "🍗"
      : rec.category === "Prawns" || rec.category === "Sea Food"
      ? "🦐"
      : rec.category === "Fish"
      ? "🐟"
      : rec.category === "Pork"
      ? "🥩"
      : rec.category === "Lamb"
      ? "🍖"
      : rec.category === "Dessert"
      ? "🍮"
      : rec.category === "Beverages"
      ? "🥤"
      : rec.isVeg
      ? "🥦"
      : "🍜";

  return (
    <div className="rounded-2xl overflow-hidden border border-brand-black-border bg-brand-black-card flex flex-col transition-all hover:border-brand-orange/30">
      {/* Image area */}
      <div className="relative h-36 bg-brand-black-border overflow-hidden shrink-0">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={rec.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 400px"
            onError={() => setImgErr(true)}
            unoptimized
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-5xl"
            style={{
              background:
                "linear-gradient(135deg,#1E1E1E 0%,#111111 100%)",
            }}
          >
            {emoji}
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Veg / Non-veg dot */}
        <div className="absolute top-2 left-2">
          <div
            className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center bg-black/70 ${
              rec.isVeg ? "border-green-500" : "border-red-500"
            }`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                rec.isVeg ? "bg-green-500" : "bg-red-500"
              }`}
            />
          </div>
        </div>

        {/* Match score ring */}
        <div className="absolute top-1.5 right-2">
          <MatchRing score={rec.matchScore} />
        </div>
      </div>

      {/* Card body */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        {/* Name + price */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-white font-semibold text-sm leading-tight flex-1">
            {rec.name}
          </h3>
          <span className="text-brand-orange font-bold text-sm shrink-0">
            ₹{rec.price}
          </span>
        </div>

        {/* Spice flames */}
        <div className="flex items-center gap-0.5">
          {spiceFlames.map((lit, i) => (
            <span
              key={i}
              className={`text-xs ${lit ? "opacity-100" : "opacity-20"}`}
            >
              🌶️
            </span>
          ))}
          <span className="ml-1 text-[10px] text-brand-gray">
            {rec.spiceLevel}/5
          </span>
        </div>

        {/* Nutrition info */}
        {(() => {
          const n = CATEGORY_NUTRITION[rec.category];
          return n ? (
            <div className="flex items-center gap-2 text-[10px] text-brand-gray bg-brand-black/50 rounded-lg px-2 py-1.5 border border-brand-black-border">
              <span className="flex items-center gap-1">🔥 <span className="text-brand-gray-light font-medium">{n.calories}</span> kcal</span>
              <span className="text-brand-black-border">|</span>
              <span className="flex items-center gap-1">🫧 <span className="text-brand-gray-light font-medium">{n.fatG}g</span> fat</span>
              <span className="ml-auto text-[9px] text-brand-gray/60 italic">est. per serving</span>
            </div>
          ) : null;
        })()}
        <p className="text-xs text-brand-gray-light leading-relaxed">
          {rec.shortReason}
        </p>

        {/* Add to order stepper */}
        <div className="mt-auto pt-2">
          {cartQty === 0 ? (
            <button
              onClick={() => onQtyChange(rec, 1)}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-brand-orange/40 bg-brand-orange/10 text-brand-orange text-xs font-medium hover:bg-brand-orange/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add to order
            </button>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center rounded-xl border border-brand-black-border overflow-hidden bg-brand-black">
                <button
                  onClick={() => onQtyChange(rec, -1)}
                  className="px-2.5 py-1.5 text-brand-orange hover:bg-brand-orange/10 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-7 text-center text-sm font-bold text-white">{cartQty}</span>
                <button
                  onClick={() => onQtyChange(rec, 1)}
                  className="px-2.5 py-1.5 text-brand-orange hover:bg-brand-orange/10 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-sm font-bold text-brand-orange">₹{rec.price * cartQty}</span>
            </div>
          )}
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-xs text-brand-orange hover:text-brand-orange-light transition-colors pt-1"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              Hide details
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              Ingredients & details
            </>
          )}
        </button>

        {/* Expanded section */}
        {expanded && (
          <div className="border-t border-brand-black-border pt-2 flex flex-col gap-2">
            <p className="text-xs text-brand-gray-light leading-relaxed">
              {rec.whyBestFit}
            </p>

            {ingredients.length > 0 ? (
              <div>
                <p className="text-[11px] font-semibold text-white mb-1.5">
                  Key Ingredients
                </p>
                <div className="flex flex-wrap gap-1">
                  {ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="text-[10px] px-2 py-0.5 rounded-full border border-brand-black-border text-brand-gray-light bg-brand-black"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-brand-gray italic">
                Ask me about the ingredients!
              </p>
            )}

            {rec.pairWith && (
              <p className="text-[11px] text-brand-gray">
                🍽️ Pairs well with:{" "}
                <span className="text-brand-gray-light">{rec.pairWith}</span>
              </p>
            )}

            <button
              onClick={() =>
                onAsk(`DISH_INFO: Tell me about ${rec.name} — its taste, texture, ingredients, and what makes it special.`)
              }
              className="flex items-center justify-center gap-1.5 text-xs text-brand-orange border border-brand-orange/30 rounded-xl py-2 hover:bg-brand-orange/10 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Ask about this dish
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Options chips ────────────────────────────────────────────────────────────

function OptionsChips({
  options,
  onSelect,
  disabled,
}: {
  options: string[];
  onSelect: (opt: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {options.map((opt) => (
        <button
          key={opt}
          disabled={disabled}
          onClick={() => onSelect(opt)}
          className="text-xs px-3 py-2 rounded-full border border-brand-orange/40 bg-brand-orange/10 text-brand-orange-light hover:bg-brand-orange/20 hover:border-brand-orange transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ─── Preference noted banner ──────────────────────────────────────────────────

function PreferenceNote({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
      <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
      <p className="text-xs text-emerald-300 leading-relaxed">{text}</p>
    </div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 message-in">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: "linear-gradient(135deg, #FF6B00, #CC5500)" }}
      >
        <ChefHat className="w-4 h-4 text-white" />
      </div>
      <div className="bg-brand-black-card border border-brand-black-border rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1.5 h-5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="typing-dot w-2 h-2 rounded-full bg-brand-orange block"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({
  message,
  showOptions,
  onOptionSelect,
  onAskFood,
  cart,
  onQtyChange,
}: {
  message: Message;
  showOptions: boolean;
  onOptionSelect: (opt: string) => void;
  onAskFood: (q: string) => void;
  cart: Record<string, CartItem>;
  onQtyChange: (rec: Recommendation, delta: number) => void;
}) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end message-in">
        <div
          className="max-w-[75%] px-4 py-3 rounded-2xl rounded-tr-sm text-sm text-white leading-relaxed"
          style={{ background: "linear-gradient(135deg, #FF6B00, #CC5500)" }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  const formatText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**"))
        return (
          <strong key={i} className="text-brand-orange font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      if (part.startsWith("*") && part.endsWith("*"))
        return (
          <em key={i} className="text-brand-gray-light italic">
            {part.slice(1, -1)}
          </em>
        );
      return part;
    });
  };

  const renderLines = (text: string) =>
    text.split("\n").map((line, i) => {
      const t = line.trim();
      if (t.startsWith("- ") || t.startsWith("• "))
        return (
          <li
            key={i}
            className="ml-4 text-sm leading-relaxed text-brand-gray-light mb-1 list-none flex items-start gap-2"
          >
            <span className="text-brand-orange mt-1 shrink-0">▸</span>
            <span>{formatText(t.slice(2))}</span>
          </li>
        );
      if (t === "") return <div key={i} className="h-2" />;
      return (
        <p key={i} className="text-sm leading-relaxed mb-1">
          {formatText(line)}
        </p>
      );
    });

  const hasRecs =
    message.recommendations && message.recommendations.length > 0;

  return (
    <div className="flex flex-col gap-2 message-in">
      {/* Bot avatar + text bubble */}
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: "linear-gradient(135deg, #FF6B00, #CC5500)" }}
        >
          <ChefHat className="w-4 h-4 text-white" />
        </div>
        <div className="max-w-[80%] bg-brand-black-card border border-brand-black-border rounded-2xl rounded-tl-sm px-4 py-3">
          {hasRecs ? (
            <p className="text-sm leading-relaxed text-brand-gray-light">
              {message.intro || "Here are your top picks! 🍽️"}
            </p>
          ) : (
            <ul className="space-y-0">{renderLines(message.content)}</ul>
          )}
        </div>
      </div>

      {/* Preference noted banner */}
      {message.noted && (
        <div className="ml-11 max-w-[80%]">
          <PreferenceNote text={message.noted} />
        </div>
      )}

      {/* Food cards grid */}
      {hasRecs && (
        <div className="ml-11 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {message.recommendations!.map((rec) => (
            <FoodCard
              key={rec.id}
              rec={rec}
              onAsk={onAskFood}
              cartQty={cart[rec.id]?.qty ?? 0}
              onQtyChange={onQtyChange}
            />
          ))}
        </div>
      )}

      {/* Follow-up text after cards */}
      {hasRecs && message.followUp && (
        <div className="ml-11">
          <div className="inline-block bg-brand-black-card border border-brand-black-border rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-brand-gray-light max-w-[80%]">
            {message.followUp}
          </div>
        </div>
      )}

      {/* Clickable option chips — only on latest bot message */}
      {showOptions && message.options && message.options.length > 0 && (
        <div className="ml-11">
          <OptionsChips
            options={message.options}
            onSelect={onOptionSelect}
            disabled={false}
          />
        </div>
      )}
    </div>
  );
}
// ─── Cart bar ───────────────────────────────────────────────────────────────────

function CartBar({
  cart,
  onPlaceOrder,
  onClear,
}: {
  cart: Record<string, CartItem>;
  onPlaceOrder: () => void;
  onClear: () => void;
}) {
  const items = Object.values(cart).filter((i) => i.qty > 0);
  if (items.length === 0) return null;
  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.rec.price * i.qty, 0);

  return (
    <div className="flex items-center justify-between gap-3 mb-3 px-4 py-3 rounded-2xl border border-brand-orange/50 bg-brand-orange/10 animate-fade-in">
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, #FF6B00, #CC5500)" }}
        >
          <ShoppingCart className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-xs text-brand-gray">
            {totalQty} item{totalQty !== 1 ? "s" : ""} in order
          </p>
          <p className="text-base font-bold text-white leading-tight">₹{subtotal}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onClear}
          className="text-xs text-brand-gray hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-500/10"
        >
          Clear
        </button>
        <button
          onClick={onPlaceOrder}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 shrink-0"
          style={{ background: "linear-gradient(135deg, #FF6B00, #CC5500)" }}
        >
          <Receipt className="w-3.5 h-3.5" />
          Place Order
        </button>
      </div>
    </div>
  );
}

// ─── Bill modal ─────────────────────────────────────────────────────────────────

const BAR_WIDTHS = [2,1,3,1,2,1,1,3,2,1,2,3,1,2,1,3,1,2,1,1,2,3,1,2,3,1,1,2,1,3,2,1,2];

function BillModal({ data, onClose }: { data: BillData; onClose: () => void }) {
  const subtotal = data.items.reduce((s, i) => s + i.rec.price * i.qty, 0);
  const cgst = Math.round(subtotal * 0.09);
  const sgst = Math.round(subtotal * 0.09);
  const total = subtotal + cgst + sgst;
  const dateStr = data.timestamp.toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
  const timeStr = data.timestamp.toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit",
  });

  const handlePrint = () => {
    const receiptEl = document.getElementById("savor-receipt");
    if (!receiptEl) return;
    const printWindow = window.open("", "_blank", "width=420,height=800");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Bill - ${data.orderNo}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { background: #fff; display: flex; justify-content: center; }
            .receipt { width: 340px; font-family: 'Courier New', Courier, monospace; background: #FFFDF5; padding-bottom: 16px; }
          </style>
        </head>
        <body>
          <div class="receipt">${receiptEl.innerHTML}</div>
          <script>window.onload = function(){ window.print(); window.close(); }<\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.88)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-sm mb-0">
        {/* Receipt paper */}
        <div
          id="savor-receipt"
          className="bg-[#FFFDF5] rounded-t-2xl overflow-hidden shadow-2xl"
          style={{ fontFamily: "'Courier New', Courier, monospace" }}
        >
          {/* Orange top strip */}
          <div className="h-2" style={{ background: "linear-gradient(90deg, #FF6B00, #CC5500, #FF6B00)" }} />

          {/* Header */}
          <div className="text-center px-6 pt-5 pb-4 border-b border-dashed border-gray-300">
            <p
              className="text-3xl font-black tracking-[0.2em] text-gray-900"
              style={{ fontFamily: "Georgia, serif" }}
            >
              CHOWMAN
            </p>
            <p className="text-[11px] text-gray-500 mt-1 tracking-wide">Think Chinese... Think Chowman</p>
            <p className="text-[10px] text-gray-400 mt-0.5">www.chowman.net · @chowman_kolkata</p>
            <p className="text-[10px] text-gray-400">Kolkata, India</p>
          </div>

          {/* Order meta */}
          <div className="px-6 py-3 flex justify-between items-start border-b border-dashed border-gray-300">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Order No.</p>
              <p className="text-sm font-bold text-gray-900 mt-0.5">{data.orderNo}</p>
              <p className="text-[11px] text-gray-500 mt-1">Dine-in</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Table No.</p>
              <p className="text-2xl font-black text-gray-900 mt-0.5">{data.tableNo}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Date &amp; Time</p>
              <p className="text-[11px] font-medium text-gray-800 mt-0.5">{dateStr}</p>
              <p className="text-[11px] text-gray-600">{timeStr}</p>
            </div>
          </div>

          {/* Items header row */}
          <div className="px-6 pt-3 pb-1">
            <div
              className="grid text-[10px] font-bold text-gray-400 uppercase tracking-wider"
              style={{ gridTemplateColumns: "1fr 36px 64px" }}
            >
              <span>Description</span>
              <span className="text-center">Qty</span>
              <span className="text-right">Amount</span>
            </div>
          </div>

          {/* Items list */}
          <div className="px-6 pb-4 space-y-3 border-b border-dashed border-gray-300">
            {data.items.map(({ rec, qty }) => (
              <div
                key={rec.id}
                className="grid items-start"
                style={{ gridTemplateColumns: "1fr 36px 64px" }}
              >
                <div>
                  <p className="text-[12px] font-semibold text-gray-900 leading-tight">{rec.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {rec.isVeg ? "🟢 Veg" : "🔴 Non-Veg"} · ₹{rec.price} each
                  </p>
                </div>
                <span className="text-[12px] text-gray-700 text-center pt-0.5">{qty}</span>
                <span className="text-[12px] font-bold text-gray-900 text-right pt-0.5">₹{rec.price * qty}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="px-6 py-3 space-y-1.5">
            <div className="flex justify-between text-[12px] text-gray-600">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-[11px] text-gray-500">
              <span>CGST @ 9%</span>
              <span>₹{cgst}</span>
            </div>
            <div className="flex justify-between text-[11px] text-gray-500">
              <span>SGST @ 9%</span>
              <span>₹{sgst}</span>
            </div>
          </div>

          {/* Grand total */}
          <div className="mx-6 border-t-2 border-b-2 border-gray-800 py-2.5 flex justify-between items-center">
            <span
              className="text-[15px] font-black text-gray-900 tracking-widest"
              style={{ fontFamily: "Georgia, serif" }}
            >
              TOTAL
            </span>
            <span className="text-[15px] font-black text-gray-900">₹{total}</span>
          </div>

          {/* Fine print */}
          <p className="text-center text-[9px] text-gray-400 px-6 pt-3 leading-relaxed">
            All prices inclusive of GST · Contains MSG · Packaging charges may apply
          </p>

          {/* Thank you */}
          <div className="text-center px-6 pt-4 pb-2">
            <p
              className="text-sm font-bold text-gray-800 mt-1"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Thank You for Dining with Us!
            </p>
            <p className="text-[10px] text-gray-500 mt-0.5">We hope to see you again soon</p>
          </div>

          {/* Simulated barcode */}
          <div className="flex justify-center items-end gap-px pb-1 pt-3">
            {BAR_WIDTHS.map((w, i) => (
              <div
                key={i}
                className="bg-gray-900"
                style={{ width: w, height: i % 5 === 0 ? 32 : 22, opacity: i % 7 === 0 ? 0.25 : 1 }}
              />
            ))}
          </div>
          <p className="text-center text-[9px] tracking-[0.3em] text-gray-400 pb-4">{data.orderNo}</p>

          {/* Torn bottom edge */}
          <div
            className="h-3 bg-[#FFFDF5]"
            style={{
              clipPath:
                "polygon(0 0,3% 100%,6% 0,9% 100%,12% 0,15% 100%,18% 0,21% 100%,24% 0,27% 100%,30% 0,33% 100%,36% 0,39% 100%,42% 0,45% 100%,48% 0,51% 100%,54% 0,57% 100%,60% 0,63% 100%,66% 0,69% 100%,72% 0,75% 100%,78% 0,81% 100%,84% 0,87% 100%,90% 0,93% 100%,96% 0,100% 100%,100% 0)",
            }}
          />
        </div>

        {/* Action bar — always visible, outside the receipt */}
        <div className="flex items-center gap-2 bg-brand-black-card border border-t-0 border-brand-black-border rounded-b-2xl px-4 py-3">
          <div className="flex items-center gap-2 flex-1">
            <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
            <span className="text-xs font-semibold text-white">Order Placed! 🎉</span>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-brand-orange/40 bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20 transition-all font-medium shrink-0"
          >
            🖨️ Print
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-white/15 text-white/70 hover:bg-white/10 hover:text-white transition-all font-medium shrink-0"
          >
            <X className="w-3.5 h-3.5" /> Close
          </button>
        </div>
      </div>
    </div>
  );
}
// ─── Main ChatBot ─────────────────────────────────────────────────────────────

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [bill, setBill] = useState<BillData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // Tracks whether we've hydrated from localStorage yet
  const hydratedRef = useRef(false);

  // Load persisted chat on mount
  useEffect(() => {
    const saved = loadChat();
    if (saved && saved.length > 0) {
      setMessages(saved);
    }
    hydratedRef.current = true;
  }, []);

  // Persist chat whenever messages change (only after hydration)
  useEffect(() => {
    if (hydratedRef.current) {
      saveChat(messages);
    }
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // ─── Cart handlers ───────────────────────────────────────────────────
  const onQtyChange = useCallback((rec: Recommendation, delta: number) => {
    setCart((prev) => {
      const current = prev[rec.id]?.qty ?? 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [rec.id]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [rec.id]: { rec, qty: next } };
    });
  }, []);

  const handlePlaceOrder = useCallback(() => {
    const items = Object.values(cart).filter((i) => i.qty > 0);
    if (!items.length) return;
    const orderNo = `CHW-${Math.floor(1000 + Math.random() * 9000)}`;
    const tableNo = Math.floor(1 + Math.random() * 20);
    setBill({ orderNo, tableNo, items, timestamp: new Date() });
  }, [cart]);

  const handleCloseBill = useCallback(() => {
    setBill(null);
    setCart({});
  }, []);

  // ─── Profile tracking ────────────────────────────────────────────────────
  const trackUserMessage = useCallback((content: string, isFirst: boolean) => {
    let p = loadProfile();
    if (isFirst) p = recordSession(p);
    const t = content.trim();
    // Mood
    if (/stressed|celebratory|adventurous|healthy.*light|spicy.*bold|date night|surprise me|comfort food|something spicy/i.test(t)) {
      p = recordMood(p, t);
    }
    // Spice level chosen
    if (/^\d\s*[-–]\s*(very mild|mild|medium|hot|fiery)/i.test(t)) {
      p = recordSpice(p, t);
    }
    // Dietary preference
    if (/veg only|non.?veg|both work/i.test(t)) {
      p = recordDietary(p, t);
    }
    // Budget
    if (/under ₹|₹\d+\s*[–-]|₹\d+\+|budget.*no problem/i.test(t)) {
      p = recordBudget(p, t);
    }
    saveProfile(p);
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const isFirstUserMessage = messages.filter((m) => m.role === "user").length === 0;
      trackUserMessage(content, isFirstUserMessage);

      // Strip the DISH_INFO: prefix from the visible bubble (keep in API payload)
      const displayContent = content.trim().replace(/^DISH_INFO:\s*/i, "");

      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content: displayContent,
        timestamp: new Date(),
      };

      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setInput("");
      setIsLoading(true);

      try {
        // Send raw content (with DISH_INFO: prefix if present) to API so the system prompt recognises it
        const apiMessages = [
          ...messages,
          { role: "user" as const, content: content.trim() },
        ];
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: apiMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        const data = await res.json();

        if (data.error) {
          if (data.error.includes("API key")) setApiKeyMissing(true);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              role: "assistant",
              content: data.error.includes("API key")
                ? "⚠️ **API key not configured.** Please add your `GEMINI_API_KEY` to `.env.local` and restart the dev server."
                : "Sorry, I'm having trouble connecting right now. Please try again! 🙏",
              timestamp: new Date(),
            },
          ]);
        } else {
          const parsed = parseAssistantResponse(data.message as string);
          const botMsg: Message = {
            id: Date.now().toString(),
            role: "assistant",
            content: parsed.text,
            timestamp: new Date(),
            recommendations: parsed.recommendations ?? undefined,
            options:
              parsed.options.length > 0 ? parsed.options : undefined,
            intro: parsed.intro || undefined,
            followUp: parsed.followUp || undefined,
            noted: parsed.noted || undefined,
          };
          // Track recommendations + restrictions in profile
          if (parsed.recommendations?.length) {
            let p = loadProfile();
            p = recordRecommendations(p, parsed.recommendations.map((r) => ({ id: r.id, name: r.name, category: r.category })));
            saveProfile(p);
          }
          if (parsed.noted) {
            let p = loadProfile();
            p = recordRestriction(p, parsed.noted);
            saveProfile(p);
          }
          setMessages((prev) => [...prev, botMsg]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content:
              "Sorry, something went wrong. Please try again! 🙏",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    },
    [messages, isLoading, trackUserMessage]
  );

  const handleReset = () => {
    clearChat();
    setMessages([WELCOME_MESSAGE]);
    setInput("");
    setApiKeyMissing(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // Only the latest bot message shows its option chips
  const lastAssistantIdx = messages.reduceRight(
    (found, m, i) =>
      found === -1 && m.role === "assistant" ? i : found,
    -1
  );

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-3xl mx-auto w-full px-4 py-4">
      {/* API key warning */}
      {apiKeyMissing && (
        <div className="mb-4 p-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-sm">
          <span className="font-semibold">Setup required:</span> Add{" "}
          <code className="bg-black/30 px-1.5 py-0.5 rounded text-xs">
            GEMINI_API_KEY=your_key
          </code>{" "}
          to{" "}
          <code className="bg-black/30 px-1.5 py-0.5 rounded text-xs">
            .env.local
          </code>{" "}
          and restart. Get a free key at{" "}
          <a
            href="https://aistudio.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            aistudio.google.com
          </a>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-2 pr-1">
        {messages.map((msg, idx) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            showOptions={idx === lastAssistantIdx && !isLoading}
            onOptionSelect={(opt) => sendMessage(opt)}
            onAskFood={(q) => sendMessage(q)}
            cart={cart}
            onQtyChange={onQtyChange}
          />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Cart bar — appears when items are added */}
      <CartBar
        cart={cart}
        onPlaceOrder={handlePlaceOrder}
        onClear={() => setCart({})}
      />

      {/* Quick picks — only on first screen */}
      {messages.length <= 1 && !isLoading && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2 text-xs text-brand-gray">
            <Zap className="w-3 h-3 text-brand-orange" />
            Quick picks
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_PICKS.map((pick) => (
              <button
                key={pick}
                onClick={() => sendMessage(pick)}
                className="quick-pick text-xs px-3 py-1.5 rounded-full border border-brand-black-border bg-brand-black-card text-brand-gray-light transition-all"
              >
                {pick}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2 bg-brand-black-card border border-brand-black-border rounded-2xl p-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tell me your mood, budget, cravings..."
          rows={1}
          className="flex-1 bg-transparent text-sm text-white placeholder-brand-gray resize-none px-2 py-2 leading-relaxed max-h-32 focus:outline-none"
          style={{ minHeight: "40px" }}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = Math.min(el.scrollHeight, 128) + "px";
          }}
        />
        <div className="flex items-center gap-2 shrink-0 pb-1">
          <button
            onClick={handleReset}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-brand-gray hover:text-brand-orange hover:bg-brand-orange/10 transition-all"
            title="Start over"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={
              input.trim() && !isLoading
                ? { background: "linear-gradient(135deg, #FF6B00, #CC5500)" }
                : { background: "#1E1E1E" }
            }
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
      <p className="text-center text-xs text-brand-gray mt-2 opacity-60">
        Tap an option · or type below · Enter to send
      </p>

      {/* Bill receipt modal */}
      {bill && <BillModal data={bill} onClose={handleCloseBill} />}
    </div>
  );
}
