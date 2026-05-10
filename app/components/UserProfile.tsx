"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  User, Flame, Wallet, ChefHat, ShieldAlert, Trophy,
  Trash2, MessageSquare, TrendingUp, Star, UtensilsCrossed,
} from "lucide-react";
import {
  loadProfile, clearProfile, onProfileUpdate,
  getAvgSpice, getTopDishes, getDominantDietary, getDominantBudget, getDinerTitle,
  type UserProfile as UserProfileData,
  DEFAULT_PROFILE,
} from "@/lib/profileStore";

// ApexCharts must be loaded client-side only (uses browser APIs)
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CHART_BASE = {
  chart: {
    background: "transparent",
    foreColor: "#888888",
    toolbar: { show: false },
    animations: { enabled: true, easing: "easeinout" as const, speed: 500 },
  },
  tooltip: { theme: "dark" as const },
  grid: { borderColor: "#1E1E1E", strokeDashArray: 4 },
};

function formatDate(iso: string | null): string {
  if (!iso) return "Never";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function dietaryIcon(pref: string): string {
  if (/veg only/i.test(pref)) return "🥦";
  if (/non.?veg/i.test(pref)) return "🍖";
  return "🤷";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon, label, value, sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 bg-brand-black-card border border-brand-black-border rounded-2xl p-4">
      <div className="flex items-center gap-2 text-brand-gray text-xs uppercase tracking-wider">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {sub && <div className="text-xs text-brand-gray truncate">{sub}</div>}
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-brand-black-card border border-brand-black-border rounded-2xl p-5 flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      {children}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyProfile({ onGoToChat }: { onGoToChat: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #FF6B00 0%, #CC5500 100%)" }}
      >
        <ChefHat className="w-12 h-12 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Your Flavor Profile Awaits</h2>
        <p className="text-brand-gray text-sm max-w-xs">
          Start chatting with SAVOR to build your personal taste profile — moods, spice levels,
          budget patterns and more.
        </p>
      </div>
      <button
        onClick={onGoToChat}
        className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90"
        style={{ background: "linear-gradient(135deg, #FF6B00, #CC5500)" }}
      >
        <MessageSquare className="w-4 h-4" />
        Start a Chat
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function UserProfile({ onGoToChat }: { onGoToChat: () => void }) {
  const [profile, setProfile] = useState<UserProfileData>(DEFAULT_PROFILE);
  const [mounted, setMounted] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const refresh = useCallback(() => setProfile(loadProfile()), []);

  useEffect(() => {
    setMounted(true);
    refresh();
    return onProfileUpdate(refresh);
  }, [refresh]);

  if (!mounted) return null; // avoid hydration mismatch

  const isEmpty = profile.sessionCount === 0;
  if (isEmpty) return <EmptyProfile onGoToChat={onGoToChat} />;

  // ── Derived data ────────────────────────────────────────────────────────────
  const avgSpice = getAvgSpice(profile);
  const topDishes = getTopDishes(profile, 6);
  const dietPref = getDominantDietary(profile);
  const budgetPref = getDominantBudget(profile);
  const dinerTitle = getDinerTitle(profile.sessionCount);
  const totalDishes = profile.recommendedDishes.length;

  // ── Chart datasets ──────────────────────────────────────────────────────────

  // Mood distribution (horizontal bar)
  const moodEntries = Object.entries(profile.moodHistory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Budget donut
  const budgetEntries = Object.entries(profile.budgetChoices);

  // Category interests (horizontal bar, top 7)
  const catEntries = Object.entries(profile.categoryInterests)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7);

  // Spice history line (last 15 picks)
  const spiceHistory = profile.spiceLevels.slice(-15);

  // Dietary donut
  const dietEntries = Object.entries(profile.dietaryPref);

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-6 space-y-6">
      {/* ── Header ── */}
      <div className="bg-brand-black-card border border-brand-black-border rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #FF6B00 0%, #CC5500 100%)" }}
          >
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-green-500 border-2 border-brand-black-card" />
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <span className="text-xl font-bold text-white">Chowman Fan</span>
            <span className="text-xs px-2.5 py-1 rounded-full border border-brand-orange/40 bg-brand-orange/10 text-brand-orange font-medium">
              {dinerTitle}
            </span>
          </div>
          <div className="text-sm text-brand-gray mb-3">
            Last active: <span className="text-brand-gray-light">{formatDate(profile.lastSeen)}</span>
            &nbsp;·&nbsp;
            <span className="text-brand-gray-light">{profile.sessionCount} session{profile.sessionCount !== 1 ? "s" : ""}</span>
          </div>
          {/* Taste tags */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            {avgSpice > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400">
                🌶️ Spice {avgSpice}/5
              </span>
            )}
            {dietPref !== "—" && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                {dietaryIcon(dietPref)} {dietPref}
              </span>
            )}
            {budgetPref !== "—" && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
                💰 {budgetPref}
              </span>
            )}
            {totalDishes > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400">
                🍜 {totalDishes} dish{totalDishes !== 1 ? "es" : ""} explored
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<Star className="w-3.5 h-3.5 text-brand-orange" />}
          label="Sessions"
          value={String(profile.sessionCount)}
          sub="Total chats with SAVOR"
        />
        <StatCard
          icon={<Flame className="w-3.5 h-3.5 text-red-400" />}
          label="Avg Spice"
          value={avgSpice > 0 ? `${avgSpice} / 5` : "—"}
          sub={avgSpice >= 4 ? "You love it hot!" : avgSpice >= 2.5 ? "Moderate heat" : avgSpice > 0 ? "Mild preference" : "Not recorded yet"}
        />
        <StatCard
          icon={<Wallet className="w-3.5 h-3.5 text-blue-400" />}
          label="Budget Pref"
          value={budgetPref !== "—" ? budgetPref.replace("Budget's no problem!", "No limit") : "—"}
          sub="Most frequent choice"
        />
        <StatCard
          icon={<UtensilsCrossed className="w-3.5 h-3.5 text-purple-400" />}
          label="Dishes"
          value={String(totalDishes)}
          sub="Unique recommendations"
        />
      </div>

      {/* ── Charts row 1: Mood + Budget ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Mood chart */}
        <SectionCard title="🎭 Mood Patterns">
          {moodEntries.length === 0 ? (
            <p className="text-brand-gray text-sm text-center py-4">No mood data yet</p>
          ) : (
            <Chart
              type="bar"
              height={200}
              options={{
                ...CHART_BASE,
                colors: ["#FF6B00"],
                plotOptions: {
                  bar: { horizontal: true, borderRadius: 4, barHeight: "60%" },
                },
                xaxis: {
                  categories: moodEntries.map(([k]) => k.length > 20 ? k.slice(0, 18) + "…" : k),
                  labels: { style: { colors: "#888888", fontSize: "11px" } },
                },
                yaxis: { labels: { style: { colors: "#BBBBBB", fontSize: "11px" }, maxWidth: 140 } },
                dataLabels: { enabled: false },
                legend: { show: false },
              }}
              series={[{ name: "Times", data: moodEntries.map(([, v]) => v) }]}
            />
          )}
        </SectionCard>

        {/* Budget chart */}
        <SectionCard title="💰 Budget Distribution">
          {budgetEntries.length === 0 ? (
            <p className="text-brand-gray text-sm text-center py-4">No budget data yet</p>
          ) : (
            <Chart
              type="donut"
              height={200}
              options={{
                ...CHART_BASE,
                colors: ["#FF6B00", "#FF8C33", "#CC5500", "#FF4500"],
                labels: budgetEntries.map(([k]) => k.replace("Budget's no problem!", "No limit")),
                legend: {
                  position: "bottom" as const,
                  labels: { colors: "#BBBBBB" },
                  fontSize: "11px",
                },
                plotOptions: {
                  pie: { donut: { size: "65%", labels: { show: true, total: { show: true, label: "Picks", color: "#888" } } } },
                },
                dataLabels: { enabled: false },
                stroke: { show: false },
              }}
              series={budgetEntries.map(([, v]) => v)}
            />
          )}
        </SectionCard>
      </div>

      {/* ── Charts row 2: Category + Spice history ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Category interests */}
        <SectionCard title="🍜 Category Interests">
          {catEntries.length === 0 ? (
            <p className="text-brand-gray text-sm text-center py-4">No data yet</p>
          ) : (
            <Chart
              type="bar"
              height={220}
              options={{
                ...CHART_BASE,
                plotOptions: {
                  bar: { horizontal: true, borderRadius: 4, barHeight: "55%",
                    distributed: true },
                },
                colors: ["#FF6B00", "#FF8C33", "#CC5500", "#FF4500", "#FF7020", "#FF9A55", "#E05000"],
                xaxis: {
                  categories: catEntries.map(([k]) => k),
                  labels: { style: { colors: "#888888", fontSize: "11px" } },
                },
                yaxis: { labels: { style: { colors: "#BBBBBB", fontSize: "11px" }, maxWidth: 90 } },
                dataLabels: { enabled: true, style: { colors: ["#fff"], fontSize: "10px" } },
                legend: { show: false },
              }}
              series={[{ name: "Recommendations", data: catEntries.map(([, v]) => v) }]}
            />
          )}
        </SectionCard>

        {/* Spice history line chart */}
        <SectionCard title="🌶️ Spice Level Over Time">
          {spiceHistory.length < 2 ? (
            <p className="text-brand-gray text-sm text-center py-4">
              {spiceHistory.length === 0 ? "No spice data yet" : "Need more data points"}
            </p>
          ) : (
            <Chart
              type="area"
              height={220}
              options={{
                ...CHART_BASE,
                colors: ["#FF6B00"],
                fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05, stops: [0, 100] } },
                stroke: { curve: "smooth" as const, width: 2.5 },
                xaxis: {
                  categories: spiceHistory.map((_, i) => `#${i + 1}`),
                  labels: { style: { colors: "#888888", fontSize: "10px" } },
                },
                yaxis: {
                  min: 1, max: 5, tickAmount: 4,
                  labels: {
                    style: { colors: "#888888", fontSize: "11px" },
                    formatter: (v: number) => ["", "Mild", "Low", "Med", "Hot", "🔥"][Math.round(v)] ?? String(v),
                  },
                },
                dataLabels: { enabled: false },
                markers: { size: 4, colors: ["#FF6B00"], strokeWidth: 0 },
                tooltip: {
                  y: {
                    formatter: (v: number) =>
                      ["", "Very Mild", "Mild", "Medium", "Hot", "Extra Fiery"][v] ?? String(v),
                  },
                },
              }}
              series={[{ name: "Spice", data: spiceHistory }]}
            />
          )}
        </SectionCard>
      </div>

      {/* ── Charts row 3: Spice radial + Dietary donut ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Spice gauge (radial bar) */}
        <SectionCard title="🔥 Your Spice Fingerprint">
          {avgSpice === 0 ? (
            <p className="text-brand-gray text-sm text-center py-4">No spice data yet</p>
          ) : (
            <Chart
              type="radialBar"
              height={240}
              options={{
                ...CHART_BASE,
                colors: avgSpice >= 4 ? ["#ef4444"] : avgSpice >= 3 ? ["#FF6B00"] : ["#22c55e"],
                plotOptions: {
                  radialBar: {
                    hollow: { size: "55%" },
                    dataLabels: {
                      name: { color: "#888888", fontSize: "12px", offsetY: -10 },
                      value: {
                        color: "#ffffff",
                        fontSize: "28px",
                        fontWeight: "bold",
                        formatter: () => `${avgSpice}/5`,
                      },
                    },
                    track: { background: "#1E1E1E", strokeWidth: "100%" },
                  },
                },
                labels: [avgSpice >= 4 ? "Spice Lover!" : avgSpice >= 3 ? "Moderate Heat" : "Mild Side"],
                stroke: { lineCap: "round" as const },
              }}
              series={[Math.round((avgSpice / 5) * 100)]}
            />
          )}
        </SectionCard>

        {/* Dietary preference donut */}
        <SectionCard title="🥢 Dietary Preference">
          {dietEntries.length === 0 ? (
            <p className="text-brand-gray text-sm text-center py-4">No preference recorded yet</p>
          ) : (
            <Chart
              type="pie"
              height={240}
              options={{
                ...CHART_BASE,
                colors: ["#22c55e", "#ef4444", "#FF6B00"],
                labels: dietEntries.map(([k]) => k),
                legend: {
                  position: "bottom" as const,
                  labels: { colors: "#BBBBBB" },
                  fontSize: "12px",
                },
                dataLabels: {
                  enabled: true,
                  style: { colors: ["#fff"], fontSize: "11px" },
                  formatter: (val: number) => `${Math.round(val)}%`,
                },
                stroke: { show: false },
              }}
              series={dietEntries.map(([, v]) => v)}
            />
          )}
        </SectionCard>
      </div>

      {/* ── Top Dishes ── */}
      {topDishes.length > 0 && (
        <SectionCard title="🏆 Your Most Explored Dishes">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {topDishes.map((dish, i) => (
              <div
                key={dish.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-brand-black-border bg-brand-black"
              >
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                  style={
                    i === 0
                      ? { background: "linear-gradient(135deg,#FF6B00,#CC5500)", color: "#fff" }
                      : { background: "#1E1E1E", color: "#888888" }
                  }
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{dish.name}</p>
                  <p className="text-xs text-brand-gray truncate">{dish.category}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Trophy className="w-3 h-3 text-brand-orange" />
                  <span className="text-xs text-brand-orange font-semibold">{dish.count}×</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* ── Restrictions ── */}
      {profile.restrictions.length > 0 && (
        <SectionCard title="🚫 Dietary Restrictions & Dislikes">
          <div className="flex flex-col gap-2">
            {profile.restrictions.map((r, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl border border-red-500/20 bg-red-500/5"
              >
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-300 leading-relaxed">{r}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* ── Clear data ── */}
      <div className="flex justify-center pb-4">
        {confirmClear ? (
          <div className="flex items-center gap-3 p-3 rounded-xl border border-red-500/30 bg-red-500/10">
            <p className="text-sm text-red-300">Clear all profile data?</p>
            <button
              onClick={() => { clearProfile(); setConfirmClear(false); }}
              className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors"
            >
              Yes, clear it
            </button>
            <button
              onClick={() => setConfirmClear(false)}
              className="px-3 py-1.5 rounded-lg border border-brand-black-border text-brand-gray text-xs hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmClear(true)}
            className="flex items-center gap-2 text-xs text-brand-gray hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear profile data
          </button>
        )}
      </div>
    </div>
  );
}
