// ─── Types ────────────────────────────────────────────────────────────────────

export interface DishRecord {
  id: string;
  name: string;
  category: string;
  count: number;
}

export interface UserProfile {
  sessionCount: number;
  lastSeen: string | null;
  moodHistory: Record<string, number>;     // mood label → count
  spiceLevels: number[];                   // raw 1-5 values per pick
  dietaryPref: Record<string, number>;     // "Veg only" | "Non-Veg" | "Both work" → count
  budgetChoices: Record<string, number>;   // label → count
  restrictions: string[];                  // noted allergy/dislike strings
  recommendedDishes: DishRecord[];         // dishes SAVOR has recommended
  categoryInterests: Record<string, number>; // category → total recommendations
}

// ─── Defaults & storage key ───────────────────────────────────────────────────

const STORAGE_KEY = "savor_user_profile";
const PROFILE_UPDATE_EVENT = "savor-profile-update";

export const DEFAULT_PROFILE: UserProfile = {
  sessionCount: 0,
  lastSeen: null,
  moodHistory: {},
  spiceLevels: [],
  dietaryPref: {},
  budgetChoices: {},
  restrictions: [],
  recommendedDishes: [],
  categoryInterests: {},
};

// ─── I/O ─────────────────────────────────────────────────────────────────────

export function loadProfile(): UserProfile {
  if (typeof window === "undefined") return { ...DEFAULT_PROFILE };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new CustomEvent(PROFILE_UPDATE_EVENT));
}

export function clearProfile(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(PROFILE_UPDATE_EVENT));
}

export function onProfileUpdate(cb: () => void): () => void {
  window.addEventListener(PROFILE_UPDATE_EVENT, cb);
  return () => window.removeEventListener(PROFILE_UPDATE_EVENT, cb);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stripEmoji(text: string): string {
  // remove leading emoji + spaces (works without unicode property escapes)
  return text.replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\s]+/u, "").trim();
}

// ─── Mutation helpers (all return a new object, never mutate) ─────────────────

export function recordSession(p: UserProfile): UserProfile {
  return { ...p, sessionCount: p.sessionCount + 1, lastSeen: new Date().toISOString() };
}

export function recordMood(p: UserProfile, mood: string): UserProfile {
  const key = stripEmoji(mood) || mood.trim();
  return { ...p, moodHistory: { ...p.moodHistory, [key]: (p.moodHistory[key] ?? 0) + 1 } };
}

export function recordSpice(p: UserProfile, spiceText: string): UserProfile {
  const m = spiceText.match(/^(\d)/);
  const level = m ? parseInt(m[1]) : 0;
  if (level < 1 || level > 5) return p;
  return { ...p, spiceLevels: [...p.spiceLevels, level] };
}

export function recordDietary(p: UserProfile, choice: string): UserProfile {
  const key = stripEmoji(choice) || choice.trim();
  return { ...p, dietaryPref: { ...p.dietaryPref, [key]: (p.dietaryPref[key] ?? 0) + 1 } };
}

export function recordBudget(p: UserProfile, budget: string): UserProfile {
  const key = stripEmoji(budget) || budget.trim();
  return { ...p, budgetChoices: { ...p.budgetChoices, [key]: (p.budgetChoices[key] ?? 0) + 1 } };
}

export function recordRestriction(p: UserProfile, noted: string): UserProfile {
  if (p.restrictions.includes(noted)) return p;
  return { ...p, restrictions: [...p.restrictions, noted] };
}

export function recordRecommendations(
  p: UserProfile,
  dishes: Array<{ id: string; name: string; category: string }>
): UserProfile {
  const dishMap = p.recommendedDishes.map((d) => ({ ...d }));
  const catMap = { ...p.categoryInterests };
  for (const dish of dishes) {
    const existing = dishMap.find((d) => d.id === dish.id);
    if (existing) {
      existing.count += 1;
    } else {
      dishMap.push({ ...dish, count: 1 });
    }
    catMap[dish.category] = (catMap[dish.category] ?? 0) + 1;
  }
  return { ...p, recommendedDishes: dishMap, categoryInterests: catMap };
}

// ─── Derived stats ────────────────────────────────────────────────────────────

export function getAvgSpice(p: UserProfile): number {
  if (!p.spiceLevels.length) return 0;
  return +(p.spiceLevels.reduce((a, b) => a + b, 0) / p.spiceLevels.length).toFixed(1);
}

export function getTopDishes(p: UserProfile, n = 5): DishRecord[] {
  return [...p.recommendedDishes].sort((a, b) => b.count - a.count).slice(0, n);
}

export function getDominantDietary(p: UserProfile): string {
  const entries = Object.entries(p.dietaryPref);
  if (!entries.length) return "—";
  return entries.sort((a, b) => b[1] - a[1])[0][0];
}

export function getDominantBudget(p: UserProfile): string {
  const entries = Object.entries(p.budgetChoices);
  if (!entries.length) return "—";
  return entries.sort((a, b) => b[1] - a[1])[0][0];
}

export function getDinerTitle(sessionCount: number): string {
  if (sessionCount === 0) return "New Explorer";
  if (sessionCount <= 3) return "Chowman Regular";
  if (sessionCount <= 9) return "Chowman Enthusiast";
  return "Chowman Devotee";
}
