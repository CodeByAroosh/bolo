"use client";

import Link from "next/link";
import { ArrowLeft, Mic, Volume2, BookOpen, Lightbulb, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";

const words = [
  { mr: "नमस्कार", roman: "Namaskaar", en: "Hello / Greetings", example: "नमस्कार! मी रोहन आहे." },
  { mr: "धन्यवाद", roman: "Dhanyavaad", en: "Thank you", example: "खूप धन्यवाद." },
  { mr: "माफ करा", roman: "Maaf karaa", en: "Sorry / Excuse me", example: "माफ करा, मला मराठी येत नाही." },
  { mr: "माझे नाव", roman: "Maaze naav", en: "My name", example: "माझे नाव सारा आहे." },
  { mr: "आहे", roman: "Aahe", en: "Is / Am / Are (present)", example: "मी ठीक आहे." },
  { mr: "ठीक आहे", roman: "Theek aahe", en: "I'm fine / OK", example: "मी ठीक आहे, तुम्ही?" },
];

const patterns = [
  {
    title: "Introducing yourself",
    structure: "माझे नाव ___ आहे.",
    meaning: "My name is ___.",
    speakAs: "माझे नाव अनन्या आहे.",
    examples: [
      { mr: "माझे नाव अनन्या आहे.", en: "My name is Ananya." },
      { mr: "माझे नाव राज आहे.", en: "My name is Raj." },
    ],
  },
  {
    title: "Asking 'how are you?'",
    structure: "तुम्ही कसे आहात?",
    meaning: "How are you? (formal)",
    speakAs: "तुम्ही कसे आहात?",
    examples: [
      { mr: "मी ठीक आहे.", en: "I am fine." },
      { mr: "मी छान आहे, धन्यवाद.", en: "I am great, thank you." },
    ],
  },
];

async function playTTS(text: string): Promise<void> {
  const res = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `TTS error ${res.status}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  // Use AudioContext for reliable cross-browser WAV decoding
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AudioCtx();
  const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(ctx.destination);
  await new Promise<void>((resolve) => {
    source.onended = () => { ctx.close(); resolve(); };
    source.start(0);
  });
}

function SpeakButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  async function handle() {
    setState("loading");
    try {
      await playTTS(text);
      setState("idle");
    } catch (e) {
      console.error(e);
      setState("error");
      setTimeout(() => setState("idle"), 2000);
    }
  }

  return (
    <button
      onClick={handle}
      disabled={state === "loading"}
      title={state === "error" ? "Playback failed — try again" : "Hear pronunciation"}
      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-50 ${
        state === "error"
          ? "bg-red-50 hover:bg-red-100"
          : "bg-indigo-50 hover:bg-indigo-100"
      }`}
    >
      {state === "loading" && <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />}
      {state === "error"  && <AlertCircle className="w-4 h-4 text-red-500" />}
      {state === "idle"   && <Volume2 className="w-4 h-4 text-indigo-500" />}
    </button>
  );
}

export default function LessonPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/learn" className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div className="flex-1">
            <h1 className="font-black text-slate-900">नमस्कार!</h1>
            <p className="text-xs text-slate-400">Unit 1 · Greetings &amp; Introductions</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            A1 · Explorer
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Vocabulary */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <h2 className="font-black text-slate-900 text-lg">Vocabulary · शब्द</h2>
            <span className="text-xs text-slate-400 ml-auto">{words.length} words</span>
          </div>
          <div className="grid gap-3">
            {words.map((w, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-2xl font-black text-slate-900 indic-text">{w.mr}</p>
                    <p className="text-sm font-semibold text-slate-500 mt-0.5">{w.roman}</p>
                    <p className="text-sm text-slate-600 mt-1">{w.en}</p>
                  </div>
                  <SpeakButton text={w.mr} />
                </div>
                <p className="mt-3 text-xs text-slate-400 bg-slate-50 rounded-xl px-3 py-2 indic-text">
                  <span className="font-semibold text-slate-500">e.g.</span> {w.example}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Patterns */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h2 className="font-black text-slate-900 text-lg">Patterns · वाक्यरचना</h2>
          </div>
          <div className="grid gap-4">
            {patterns.map((p, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">{p.title}</p>
                <div className="bg-amber-50 rounded-xl px-4 py-3 mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xl font-black text-slate-900 indic-text">{p.structure}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{p.meaning}</p>
                  </div>
                  <SpeakButton text={p.speakAs} />
                </div>
                <div className="space-y-2">
                  {p.examples.map((ex, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm">
                      <span className="text-amber-400 font-bold">→</span>
                      <div className="flex-1">
                        <span className="font-semibold text-slate-800 indic-text">{ex.mr}</span>
                        <span className="text-slate-400 ml-2">({ex.en})</span>
                      </div>
                      <SpeakButton text={ex.mr} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cultural Note */}
        <section className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-5">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">🌿 Cultural Note</p>
          <p className="font-bold text-slate-800 indic-text text-lg">नमस्कार म्हणजे आदर.</p>
          <p className="text-sm text-slate-600 mt-1">
            &quot;Namaskaar&quot; conveys respect. Use it with elders and in formal settings.
            With friends, &quot;हाय&quot; or &quot;हेल्लो&quot; are natural in modern Marathi.
          </p>
        </section>

        {/* CTA → Voice Practice */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white text-center">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Mic className="w-7 h-7 text-white" />
          </div>
          <h3 className="font-black text-xl mb-1">Ready to speak?</h3>
          <p className="text-emerald-100 text-sm mb-4">
            Sarvam AI listens and won&apos;t let you skip until you say it right.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/bolo/t1u1"
              className="bg-white text-emerald-700 font-black px-6 py-3 rounded-xl hover:bg-emerald-50 transition-colors"
            >
              Start Voice Practice →
            </Link>
            <Link
              href="/learn"
              className="bg-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/30 transition-colors"
            >
              Back to Units
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
