# SAVOR.AI × Chowman
### AI-Powered Dining Intelligence Platform — MVP Prototype

> *"Think Chinese... Think Chowman"* — now with a brilliant AI companion that knows exactly what you're craving.

---

## 🚀 What This Is

A **Next.js 15 monorepo prototype** of SAVOR.AI — the AI dining companion described in the project synopsis — built specifically for **Chowman** restaurant, Kolkata.

**Features:**
- 🤖 **AI Chatbot** powered by **Google Gemini 2.0 Flash** — asks about your mood, budget, spice tolerance, and recommends perfect dishes
- 🍜 **Full Chowman Menu** with all categories (Soups, Starters, Chicken, Prawns, Fish, Pork, Lamb, Sea Food, Rice, Noodles, Thai, Desserts & more)
- 🔍 **Menu Explorer** with search, category filter, veg/non-veg filter, and spice level filter
- 🎨 **Orange × Black** brand theme matching Chowman's identity
- ⚡ **Next.js API Routes** as backend — clean monorepo, no separate server needed

---

## 📁 Project Structure

```
savor-ai/
├── app/
│   ├── api/
│   │   ├── chat/route.ts        # Gemini AI chatbot API
│   │   └── recommend/route.ts   # Menu search/filter API
│   ├── components/
│   │   ├── ChatBot.tsx          # AI conversation UI
│   │   ├── Header.tsx           # Navigation with tabs
│   │   └── MenuExplorer.tsx     # Full menu browser
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout with fonts
│   └── page.tsx                 # Main page
├── data/
│   └── menu.ts                  # Complete Chowman menu data
├── .env.example                 # Environment variables template
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## ⚙️ Setup & Run

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env.local
```

Open `.env.local` and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**Get a FREE Gemini API key:**
1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy and paste into `.env.local`

> The free tier is extremely generous — no credit card required.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Architecture Decisions

### Why Next.js Monorepo (No Separate Backend)?
For an **MVP prototype**, a Next.js monorepo with API routes is the ideal choice:
- ✅ Single codebase, single deployment
- ✅ Type-sharing between frontend and backend (same `data/menu.ts`)
- ✅ Zero infrastructure overhead
- ✅ Instant deployment on Vercel
- ✅ Easy to extract backend to NestJS/Fastify later as you scale

### Why Gemini 2.0 Flash?
- ✅ Free tier is very generous
- ✅ Fast response times (low latency for conversational UX)
- ✅ 1M token context window — fits entire menu + conversation history
- ✅ Strong instruction following for the SAVOR persona
- ✅ Easy to swap to Claude or GPT-4o by changing one API call

### Design: Orange × Black
- Mirrors Chowman's actual brand identity from the menu PDF
- High contrast for readability in restaurant lighting
- Orange conveys warmth, energy, appetite — perfect for food
- Bebas Neue display font for a bold, confident brand voice

---

## 🔌 API Routes

### `POST /api/chat`
The Gemini-powered AI chatbot endpoint.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "I'm feeling stressed and want comfort food" },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Response:**
```json
{
  "message": "For comfort, I'd go with **Manchow Soup (Chicken)** at ₹165..."
}
```

### `GET /api/recommend`
Menu search and filter endpoint.

**Query params:**
- `category` — filter by category (e.g. `Chicken`, `Soup`)
- `search` — text search
- `veg` — `true` or `false`

---

## 🗺️ Roadmap (From Project Synopsis)

### Phase 1 — MVP (This Prototype)
- [x] AI chatbot with mood-based recommendations
- [x] Full Chowman menu data
- [x] Menu explorer with filters
- [x] Orange × Black brand theme

### Phase 2 — Add to This Codebase
- [ ] User accounts + Taste Identity Graph (PostgreSQL + Prisma)
- [ ] Post-meal feedback loop (3-tap rating)
- [ ] QR code generation for tables
- [ ] Restaurant admin dashboard

### Phase 3 — Scale
- [ ] Vector embeddings (pgvector/Qdrant) for personalization
- [ ] Group ordering mode (WebSockets)
- [ ] Multi-restaurant support
- [ ] Razorpay payment integration

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)
```bash
npm i -g vercel
vercel
```
Set `GEMINI_API_KEY` in Vercel environment variables.

### Docker (Self-hosted)
```bash
docker build -t savor-ai .
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key savor-ai
```

---

## 📝 Notes

- All menu prices are in Indian Rupees (₹)
- Taxes and packaging charges are extra (as per Chowman's menu)
- Chowman uses added Monosodium Glutamate (MSG) — noted in footer
- Menu data sourced from the official Chowman e-menu (table-e-menu.pdf)

---

*SAVOR.AI × Chowman — Every meal. Perfectly chosen.*
