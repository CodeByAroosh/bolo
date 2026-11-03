import Link from "next/link";
import { Mic, Sparkles, Flame, Volume2, ShieldCheck, ArrowRight, Trophy } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-emerald-500/20">
              बो
            </div>
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Bolo
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/learn"
              className="px-5 py-2.5 rounded-full font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 transition-all text-sm flex items-center gap-1.5"
            >
              Start Learning <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 md:py-20 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Powered Exclusively by Sarvam AI
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 max-w-3xl leading-[1.15]">
          Speak Indian Languages <br />
          <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
            Out Loud & Fluent.
          </span>
        </h1>

        <p className="mt-5 text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed">
          The Duolingo-style app built around <strong>real spoken conversation</strong>. You speak Marathi, and an AI Indic tutor hears you, responds in Marathi, and coaches you in English on pronunciation & grammar.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/learn"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/30 transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Mic className="w-5 h-5" /> Start Marathi Lesson 1
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition-all"
          >
            How it Works
          </a>
        </div>

        {/* Live Audio Visualizer Teaser */}
        <div className="mt-12 w-full max-w-lg p-6 bg-white rounded-3xl border border-slate-200/80 shadow-2xl shadow-slate-200/50 flex flex-col items-center text-left">
          <div className="w-full flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">MARATHI A1</span>
              <span className="text-xs font-semibold text-slate-400">Unit 1: नमस्कार!</span>
            </div>
            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
              <Flame className="w-4 h-4 fill-amber-500" /> 3 Day Streak
            </div>
          </div>

          <div className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Tutor Asked (Saaras + Bulbul):</p>
            <p className="indic-text text-xl font-bold text-slate-900">नमस्कार! तुमचे नाव काय आहे?</p>
            <p className="roman-subtext mt-0.5">namaskaar! tumche naav kaay aahe? (Hello! What is your name?)</p>
          </div>

          <div className="w-full bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Spoken Feedback (Honest Sarvam Judge):
            </p>
            <p className="text-sm text-slate-700 font-medium">
              Native phrasing is perfect! Notice the pronunciation of <strong>नाव</strong> (naav) — soften the ending so it doesn't sound like English 'now'.
            </p>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div id="features" className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold mb-4">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl text-slate-900 mb-2">Honest Spoken Practice</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              No fake 94% scores. We analyze Saaras STT verbatim & translit transcripts against Marathi minimal pairs (ळ/ल, श/ष/स) to give actionable physical tongue tips.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold mb-4">
              <Volume2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl text-slate-900 mb-2">Bulbul Voice Synthesis</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Crystal-clear expressive native pronunciation powered by Sarvam Bulbul v4-flash with full local caching for lightning-fast playback.
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold mb-4">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl text-slate-900 mb-2">Streaks, XP & Hearts</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Duolingo-style gamification: 5 refillable hearts, gems, leagues, and spaced repetition (SM-2) review queue.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-8 text-center text-xs text-slate-400">
        Bolo • Spoken Indian Language Learning • Powered by Sarvam AI
      </footer>
    </div>
  );
}
