# Bolo (बोलो / बोला)

**A Duolingo-style spoken language learning web app for Indian languages, powered exclusively by Sarvam AI.**

The killer feature of Bolo is real **spoken conversation practice**:
1. **Learn a lesson** (Words, Pattern, Ears, Muhavara, Bolo)
2. **Speak out loud** to the AI Indic tutor
3. **Get honest, physical feedback** in English derived from Saaras STT (verbatim + transliteration) and judged by `sarvam-105b`
4. **Earn XP, level up in leagues, and keep your daily streak alive**

---

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript Strict Mode
- **Styling**: Tailwind CSS + shadcn/ui chunky mobile-first design tokens
- **Typography**: Real Indic fonts (`Noto Sans Devanagari` via `next/font`)
- **Database**: Prisma ORM with SQLite for development, PostgreSQL-ready schema
- **State**: Zustand for client-side lesson session, streak & hearts management
- **Audio Capture**: Browser AudioWorklet / MediaRecorder (REST WebM Opus & Realtime 16 kHz PCM)
- **AI Backend**: **Sarvam AI**
  - STT: `saaras:v4` (`verbatim`, `translit`, `transcribe`)
  - Realtime STT: `saaras:v3-realtime`
  - TTS: `bulbul:v4-flash` (and `bulbul:v3` fallback for Malayalam/Odia)
  - Dialogue: `sarvam-105b-conversations`
  - Judge: `sarvam-105b` with strict JSON Schema output

---

## Setup & Running

### 1. Prerequisites
- Node.js ≥ 20 (v22 installed)
- `pnpm` (`npm install -g pnpm`)

### 2. Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your Sarvam AI API subscription key:
```env
SARVAM_API_KEY=your_key_here
DATABASE_URL="file:./dev.db"
```

> **Security Guard**: `SARVAM_API_KEY` is read strictly server-side. The build system includes a verification script (`scripts/assert-no-secret-leak.js`) that fails the build if the key string appears in any client bundle or static asset.

### 3. Install Dependencies
```bash
pnpm install
```

### 4. Database Setup
```bash
pnpm db:push
```

### 5. Content Validation
```bash
pnpm content:validate
pnpm content:stats
```

### 6. Start Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
