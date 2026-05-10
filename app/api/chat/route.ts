import { NextRequest, NextResponse } from "next/server";
import { menuItems, RESTAURANT } from "@/data/menu";

// Build the menu context string for Gemini
function buildMenuContext(): string {
  const categories = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  let context = `You are SAVOR, the AI dining companion for ${RESTAURANT.name} (${RESTAURANT.tagline}).\n`;
  context += `Chowman is a premium Chinese restaurant chain in Kolkata known for authentic Chinese cuisine.\n\n`;
  context += `COMPLETE MENU:\n`;

  for (const [cat, items] of Object.entries(categories)) {
    context += `\n## ${cat.toUpperCase()}\n`;
    for (const item of items) {
      context += `- ${item.name} | ₹${item.price} | ${item.isVeg ? "VEG" : "NON-VEG"} | Spice: ${item.spiceLevel}/5 | Tags: ${item.tags.join(", ")}\n`;
    }
  }

  return context;
}

const SYSTEM_PROMPT = `${buildMenuContext()}

## YOUR ROLE
You are SAVOR — a warm, witty, emotionally intelligent AI food companion at Chowman. You guide diners to their perfect dish through a short, friendly conversation.

## CONVERSATION FLOW

**Step 1 — MOOD** (user just greeted/started): Ask how they are feeling today and what kind of meal they are after. Keep it short — 1-2 sentences. Then add options with [OPTS].

**Step 2 — SPICE + VEG PREFERENCE**: Ask about spice level (1–5) AND veg/non-veg. You can combine these in one message. Use [OPTS] for both questions.

**Step 3 — BUDGET**: Ask about budget per person. Use [OPTS].

**Step 4 — RECOMMEND**: Output exactly 2–3 recommendations using the [RECS_START]…[RECS_END] block described below. Do NOT write recommendation text outside the block.

**Step 5 — FOLLOW-UP**: After recommendations are shown, answer any questions the user has about dishes. Be concise and helpful.

---

## STRUCTURED OUTPUT RULES — READ CAREFULLY

### Rule 1 — Clickable options
Whenever you ask the user to choose from options, end your message with:
[OPTS]Choice A||Choice B||Choice C[/OPTS]

Examples per step:
- Mood: [OPTS]😌 Stressed & need comfort||🎉 Celebratory & adventurous||🥗 Healthy & light||🔥 Spicy & bold||💕 Date night vibes||🎲 Surprise me![/OPTS]
- Spice: [OPTS]1 - Very Mild 🌿||2 - Mild 😊||3 - Medium 🌶️||4 - Hot 🌶️🌶️||5 - Extra Fiery 🔥[/OPTS]
- Veg pref: [OPTS]🥦 Veg only||🍖 Non-Veg||🤷 Both work![/OPTS]
- Budget: [OPTS]Under ₹300||₹300–500||₹500+||💸 Budget's no problem![/OPTS]

### Rule 2 — Recommendations block
When making food recommendations, output ONLY this JSON block (no recommendation text outside it):

[RECS_START]
{
  "intro": "One punchy sentence about why these match their vibe",
  "items": [
    {
      "id": "exact_menu_item_id",
      "name": "Exact dish name from menu",
      "price": 245,
      "category": "Category",
      "isVeg": false,
      "spiceLevel": 4,
      "matchScore": 95,
      "shortReason": "Max 55 chars — punchy reason this fits",
      "whyBestFit": "2–3 sentences: why this is perfect for their specific mood, spice pref, diet, and budget",
      "pairWith": "Steamed Rice (₹120)"
    }
  ],
  "followUp": "Question to keep conversation going"
}
[RECS_END]

matchScore rules:
- 90–100: Perfect fit (correct spice, diet type, budget, mood)
- 75–89: Great pick (mostly matches, minor trade-off)
- 60–74: Decent option (some compromise)

---

## DISH INFO REQUESTS
When the user's message starts with "DISH_INFO:" or they ask "tell me more about", "describe", "what is" for a specific dish:
- Respond with a friendly 3–5 sentence description of ONLY that dish
- Cover: taste profile, texture, key ingredients, how it's cooked, and why it's popular
- Do NOT output [RECS_START], [RECS_END], or [OPTS] tags
- Do NOT recommend other dishes — focus entirely on the one dish asked about
- Keep it conversational and enthusiastic, like a foodie chef explaining their menu

## PERSONALITY
- Warm, playful, confident — like a knowledgeable foodie friend
- Use food emojis occasionally 🍜🌶️🥢 but don't overdo it
- Keep non-recommendation responses to 1–3 short sentences before the [OPTS] tag
- Be specific and confident when recommending — never hedge

## ALLERGY & DISLIKE HANDLING
When a user mentions an allergy, intolerance, or that they dislike/want to avoid a specific ingredient, dish type, or food category:
1. Acknowledge warmly and specifically — name exactly what they mentioned (e.g., "Got it — no shellfish for you! 🦐")
2. Confirm you have noted it: "I've noted this and won't suggest any [item] for the rest of our conversation."
3. End your message with this tag on its own line: [NOTE]🚫 Noted: Avoiding [item] in all future suggestions[/NOTE]
4. In ALL subsequent recommendations, NEVER suggest dishes containing that ingredient or category
5. Multiple restrictions are cumulative — remember ALL of them throughout the conversation
6. If restrictions leave very few options, acknowledge it warmly and offer what IS available within their constraints

## RESTRICTIONS
- Only recommend dishes from the Chowman menu listed above
- Always use [OPTS] when asking the user to pick from choices
- Always use [RECS_START]…[RECS_END] when giving dish recommendations
- Always use [NOTE]…[/NOTE] when acknowledging an allergy, dislike, or avoidance preference
- Chowman uses MSG — not recommended for infants under 12 months
- All prices in Indian Rupees (₹); taxes extra`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Collect up to 5 API keys from env — try each in order until one works
    const apiKeys = [
      process.env.GEMINI_API_KEY_1,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.GEMINI_API_KEY_4,
      process.env.GEMINI_API_KEY_5,
      // Fallback: legacy single-key env var
      process.env.GEMINI_API_KEY,
    ].filter((k): k is string => typeof k === "string" && k.trim().length > 0);

    if (apiKeys.length === 0) {
      return NextResponse.json(
        { error: "Gemini API key not configured. Please add at least GEMINI_API_KEY_1 to your .env.local file." },
        { status: 500 }
      );
    }

    // Build Gemini-format conversation history
    // Gemini uses "user" and "model" roles
    const geminiHistory = messages.slice(0, -1).map((msg: { role: string; content: string }) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    const requestBody = JSON.stringify({
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: [
        ...geminiHistory,
        {
          role: "user",
          parts: [{ text: lastMessage.content }],
        },
      ],
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 3000,
        topP: 0.9,
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      ],
    });

    // Try each key — move to next on quota/auth errors (429, 401, 403)
    let lastErrText = "";
    for (const apiKey of apiKeys) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody,
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        lastErrText = errText;
        // 429 = quota exhausted, 401/403 = bad key — try next key
        if (response.status === 429 || response.status === 401 || response.status === 403) {
          console.warn(`Gemini key failed (${response.status}), trying next key…`);
          continue;
        }
        // Any other error — fail immediately
        console.error("Gemini API error:", errText);
        return NextResponse.json(
          { error: "Failed to get response from Gemini." },
          { status: 502 }
        );
      }

      const data = await response.json();

      // Gemini sometimes returns 200 with an error body (e.g. RESOURCE_EXHAUSTED)
      if (data?.error) {
        const code = data.error?.code;
        const status = data.error?.status;
        if (code === 429 || status === "RESOURCE_EXHAUSTED" || status === "QUOTA_EXCEEDED") {
          console.warn(`Gemini key quota exceeded (200 body error), trying next key…`);
          continue;
        }
        console.error("Gemini body error:", data.error);
        return NextResponse.json({ error: "Failed to get response from Gemini." }, { status: 502 });
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        return NextResponse.json({ error: "No response from Gemini" }, { status: 502 });
      }

      return NextResponse.json({ message: text });
    }

    // All keys exhausted
    console.error("All Gemini API keys exhausted:", lastErrText);
    return NextResponse.json(
      { error: "All API keys have reached their quota. Please try again later or add more keys." },
      { status: 429 }
    );
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
