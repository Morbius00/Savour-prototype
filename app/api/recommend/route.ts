import { NextRequest, NextResponse } from "next/server";
import { menuItems, getMenuByCategory } from "@/data/menu";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const veg = searchParams.get("veg");

  let filtered = [...menuItems];

  if (category && category !== "all") {
    filtered = filtered.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (veg === "true") {
    filtered = filtered.filter((item) => item.isVeg);
  } else if (veg === "false") {
    filtered = filtered.filter((item) => !item.isVeg);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.includes(q))
    );
  }

  const byCategory = getMenuByCategory();
  const categories = Object.keys(byCategory);

  return NextResponse.json({
    items: filtered,
    categories,
    total: filtered.length,
  });
}
