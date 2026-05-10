"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Search, Filter, Leaf, Flame, ChevronDown } from "lucide-react";
import { menuItems, CATEGORY_IMAGES, CATEGORY_NUTRITION, type MenuItem } from "@/data/menu";

function hashId(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function getMenuImage(category: string, id: string): string | null {
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
  return images[hashId(id) % images.length];
}

const CATEGORIES = [
  "All",
  "Soup",
  "Starter",
  "Vegetables",
  "Chicken",
  "Prawns",
  "Fish",
  "Pork",
  "Lamb",
  "Sea Food",
  "Rice",
  "Noodles",
  "Meifoon",
  "Thai",
  "Chop Suey",
  "Dessert",
  "Beverages",
];

function SpiceIndicator({ level }: { level?: number }) {
  if (!level) return null;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Flame
          key={i}
          className={`w-2.5 h-2.5 ${i <= level ? "text-brand-orange" : "text-brand-gray-dark"}`}
        />
      ))}
    </div>
  );
}

function MenuCard({ item }: { item: MenuItem }) {
  const [imgErr, setImgErr] = useState(false);
  const imgSrc = !imgErr ? getMenuImage(item.category, item.id) : null;

  const emoji =
    item.category === "Chicken" ? "🍗" :
    item.category === "Prawns" ? "🦐" :
    item.category === "Sea Food" ? "🦀" :
    item.category === "Fish" ? "🐟" :
    item.category === "Pork" ? "🥩" :
    item.category === "Lamb" ? "🍖" :
    item.category === "Dessert" ? "🍮" :
    item.category === "Beverages" ? "🥤" :
    item.category === "Soup" ? "🍲" :
    item.category === "Rice" ? "🍚" :
    item.category === "Noodles" || item.category === "Meifoon" ? "🍜" :
    item.isVeg ? "🥦" : "🍜";

  return (
    <div className="menu-card bg-brand-black-card border border-brand-black-border rounded-xl overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-32 bg-brand-black-border shrink-0 overflow-hidden">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImgErr(true)}
            unoptimized
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-4xl"
            style={{ background: "linear-gradient(135deg,#1E1E1E 0%,#111111 100%)" }}
          >
            {emoji}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        {/* Veg / non-veg badge */}
        <div className="absolute top-2 left-2">
          <div
            className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center bg-black/70 ${
              item.isVeg ? "border-green-500" : "border-red-500"
            }`}
          >
            <div className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? "bg-green-500" : "bg-red-500"}`} />
          </div>
        </div>
        {/* Price chip */}
        <div className="absolute bottom-2 right-2">
          <span
            className="text-sm font-bold text-white px-2 py-0.5 rounded-lg"
            style={{ background: "rgba(255,107,0,0.85)" }}
          >
            ₹{item.price}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-3 flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-white leading-snug">{item.name}</h3>

        <div className="flex items-center justify-between">
          <SpiceIndicator level={item.spiceLevel} />
          <span className="text-[10px] text-brand-gray bg-brand-black border border-brand-black-border rounded-md px-2 py-0.5">
            {item.category}
          </span>
        </div>

        {/* Nutrition */}
        {(() => {
          const n = CATEGORY_NUTRITION[item.category];
          return n ? (
            <div className="flex items-center gap-2 text-[10px] text-brand-gray bg-brand-black/50 rounded-lg px-2 py-1 border border-brand-black-border">
              <span>🔥 <span className="text-brand-gray-light font-medium">{n.calories}</span> kcal</span>
              <span className="opacity-30">|</span>
              <span>🫧 <span className="text-brand-gray-light font-medium">{n.fatG}g</span> fat</span>
            </div>
          ) : null;
        })()}

        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full text-brand-gray border border-brand-black-border capitalize"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MenuExplorer() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [vegFilter, setVegFilter] = useState<"all" | "veg" | "nonveg">("all");
  const [spiceFilter, setSpiceFilter] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);

  const filtered = useMemo(() => {
    let items = [...menuItems];

    if (selectedCategory !== "All") {
      items = items.filter((i) => i.category === selectedCategory);
    }
    if (vegFilter === "veg") items = items.filter((i) => i.isVeg);
    if (vegFilter === "nonveg") items = items.filter((i) => !i.isVeg);
    if (spiceFilter !== null) {
      items = items.filter((i) => (i.spiceLevel ?? 0) >= spiceFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.tags.some((t) => t.includes(q)) ||
          i.category.toLowerCase().includes(q)
      );
    }
    return items;
  }, [selectedCategory, vegFilter, spiceFilter, search]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = () => setCatDropdownOpen(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const vegCount = menuItems.filter((i) => i.isVeg).length;
  const nonVegCount = menuItems.filter((i) => !i.isVeg).length;

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-4 flex flex-col gap-4">
      {/* Stats bar */}
      <div className="flex items-center gap-4 text-xs text-brand-gray">
        <span>
          <span className="text-white font-semibold">{menuItems.length}</span> items total
        </span>
        <span className="flex items-center gap-1">
          <Leaf className="w-3 h-3 text-green-400" />
          <span className="text-green-400 font-semibold">{vegCount}</span> veg
        </span>
        <span className="flex items-center gap-1">
          <Flame className="w-3 h-3 text-red-400" />
          <span className="text-red-400 font-semibold">{nonVegCount}</span> non-veg
        </span>
        <span className="ml-auto">
          Showing <span className="text-brand-orange font-semibold">{filtered.length}</span>
        </span>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes, ingredients, moods..."
            className="w-full bg-brand-black-card border border-brand-black-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-brand-gray focus:border-brand-orange/50 transition-colors"
          />
        </div>

        {/* Category dropdown */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setCatDropdownOpen(!catDropdownOpen)}
            className="flex items-center gap-2 bg-brand-black-card border border-brand-black-border rounded-xl px-3 py-2.5 text-sm text-brand-gray-light hover:border-brand-orange/40 transition-colors"
          >
            <span className="hidden sm:inline">{selectedCategory}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {catDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-brand-black-card border border-brand-black-border rounded-xl overflow-hidden z-50 shadow-xl">
              <div className="max-h-64 overflow-y-auto py-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCatDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      selectedCategory === cat
                        ? "text-brand-orange bg-brand-orange/10"
                        : "text-brand-gray-light hover:bg-brand-black-hover hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-colors ${
            showFilters || vegFilter !== "all" || spiceFilter !== null
              ? "border-brand-orange text-brand-orange bg-brand-orange/10"
              : "border-brand-black-border text-brand-gray-light bg-brand-black-card hover:border-brand-orange/40"
          }`}
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filter</span>
        </button>
      </div>

      {/* Filter Drawer */}
      {showFilters && (
        <div className="bg-brand-black-card border border-brand-black-border rounded-xl p-4 animate-slide-up">
          <div className="flex flex-wrap gap-6">
            {/* Veg filter */}
            <div>
              <div className="text-xs text-brand-gray uppercase tracking-widest mb-2">Preference</div>
              <div className="flex items-center gap-2">
                {(["all", "veg", "nonveg"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setVegFilter(v)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      vegFilter === v
                        ? "border-brand-orange text-brand-orange bg-brand-orange/10"
                        : "border-brand-black-border text-brand-gray hover:border-brand-gray"
                    }`}
                  >
                    {v === "all" ? "All" : v === "veg" ? "🌿 Veg" : "🍖 Non-Veg"}
                  </button>
                ))}
              </div>
            </div>

            {/* Spice filter */}
            <div>
              <div className="text-xs text-brand-gray uppercase tracking-widest mb-2">Min Spice Level</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSpiceFilter(null)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    spiceFilter === null
                      ? "border-brand-orange text-brand-orange bg-brand-orange/10"
                      : "border-brand-black-border text-brand-gray hover:border-brand-gray"
                  }`}
                >
                  Any
                </button>
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSpiceFilter(lvl)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      spiceFilter === lvl
                        ? "border-brand-orange text-brand-orange bg-brand-orange/10"
                        : "border-brand-black-border text-brand-gray hover:border-brand-gray"
                    }`}
                  >
                    {"🌶️".repeat(lvl)}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setVegFilter("all");
                  setSpiceFilter(null);
                  setSearch("");
                  setSelectedCategory("All");
                }}
                className="text-xs text-brand-gray hover:text-brand-orange transition-colors underline underline-offset-2"
              >
                Reset all
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-brand-gray">
          <div className="text-4xl mb-3">🍽️</div>
          <div className="text-lg font-semibold text-brand-gray-light mb-1">No dishes found</div>
          <div className="text-sm">Try adjusting your filters or search terms</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto">
          {filtered.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
