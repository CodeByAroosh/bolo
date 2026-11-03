"use client";

import Link from "next/link";
import { ArrowLeft, Mic, Volume2, Loader2, CheckCircle2, XCircle, RotateCcw, Trophy } from "lucide-react";
import { useState, useRef } from "react";

const words = [
  { mr: "नमस्कार", roman: "Namaskaar", en: "Hello / Greetings" },
  { mr: "धन्यवाद", roman: "Dhanyavaad", en: "Thank you" },
  { mr: "माफ करा", roman: "Maaf karaa", en: "Sorry / Excuse me" },
  { mr: "माझे नाव", roman: "Maaze naav", en: "My name" },
  { mr: "आहे", roman: "Aahe", en: "Is / Am / Are" },
  { mr: "ठीक आहे", roman: "Theek aahe", en: "I'm fine / OK" },
];

type Stage = "idle" | "playing" | "recording" | "processing" | "correct" | "wrong";

/** Plays WAV from /api/tts using AudioContext — reliable on all browsers */
async function playTTS(text: string): Promise<void> {
  const res = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`TTS ${res.status}`);
  const buf = await res.arrayBuffer();
  const AudioCtx = window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AudioCtx();
  const decoded = await ctx.decodeAudioData(buf);
  const src = ctx.createBufferSource();
  src.buffer = decoded;
  src.connect(ctx.destination);
  await new Promise<void>((resolve) => { src.onended = () => { ctx.close(); resolve(); }; src.start(0); });
}

/** Simple phonetic similarity — strips diacritics variation, checks substring overlap */
function isCloseEnough(heard: string, target: string): boolean {
  const clean = (s: string) => s.trim().replace(/[।.,!?\s]/g, "").toLowerCase();
  const h = clean(heard);
  const t = clean(target);
  if (!h) return false;
  if (h === t) return true;
  if (h.includes(t) || t.includes(h)) return true;
  // Allow ≥ 60% character overlap for longer words
  const overlap = [...t].filter((c) => h.includes(c)).length;
  return overlap / t.length >= 0.6;
}

export default function BoloPage() {
  const [wordIdx, setWordIdx] = useState(0);
  const [stage, setStage] = useState<Stage>("idle");
  const [transcript, setTranscript] = useState("");
  const [ttsError, setTtsError] = useState("");
  const [done, setDone] = useState(false);
  const [attempts, setAttempts] = useState(0); // attempts on current word
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const word = words[wordIdx];
  const isLast = wordIdx === words.length - 1;

  async function hearWord() {
    setStage("playing");
    setTtsError("");
    try {
      await playTTS(word.mr);
    } catch (e) {
      setTtsError("Couldn't play audio — check console");
      console.error(e);
    } finally {
      setStage("idle");
    }
  }

  async function startRecording() {
    setTranscript("");
    setTtsError("");
    setStage("recording");
    setAttempts((a) => a + 1);
    chunksRef.current = [];

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setTtsError("Microphone access denied");
      setStage("idle");
      return;
    }

    const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
    mediaRef.current = mr;
    mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mr.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      setStage("processing");
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const form = new FormData();
      form.append("file", blob, "recording.webm");
      try {
        const res = await fetch("/api/stt", { method: "POST", body: form });
        const data = await res.json();
        const heard = (data.transcript ?? "").trim();
        setTranscript(heard);
        setStage(isCloseEnough(heard, word.mr) ? "correct" : "wrong");
      } catch {
        setTranscript("(transcription failed)");
        setStage("wrong");
      }
    };
    mr.start();
  }

  function stopRecording() {
    mediaRef.current?.stop();
  }

  function tryAgain() {
    setStage("idle");
    setTranscript("");
  }

  function next() {
    if (isLast) { setDone(true); return; }
    setWordIdx((i) => i + 1);
    setStage("idle");
    setTranscript("");
    setAttempts(0);
  }

  function restart() {
    setWordIdx(0);
    setStage("idle");
    setTranscript("");
    setAttempts(0);
    setDone(false);
  }

  /* ── Completion screen ── */
  if (done) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center mb-6">
          <Trophy className="w-10 h-10 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Unit 1 Complete! 🎉</h1>
        <p className="text-slate-400 mb-2 text-sm max-w-xs">
          You spoke all 6 Marathi words and Sarvam AI understood you. That&apos;s real progress.
        </p>
        <div className="flex gap-3 flex-wrap justify-center mt-8">
          <button onClick={restart}
            className="flex items-center gap-2 bg-white/10 text-white font-semibold px-5 py-3 rounded-xl hover:bg-white/20 transition-colors">
            <RotateCcw className="w-4 h-4" /> Practice again
          </button>
          <Link href="/learn"
            className="flex items-center gap-2 bg-emerald-500 text-white font-black px-6 py-3 rounded-xl hover:bg-emerald-400 transition-colors">
            Back to units →
          </Link>
        </div>
      </div>
    );
  }

  /* ── Practice screen ── */
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 h-14 flex-shrink-0">
        <Link href="/learn/t1u1" className="p-2 rounded-xl hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </Link>
        <div className="flex-1">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Bolo · Voice Practice</p>
          <p className="text-sm text-slate-300 font-bold">Unit 1 · नमस्कार!</p>
        </div>
        {/* Progress dots */}
        <div className="flex gap-1.5">
          {words.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all ${
              i < wordIdx  ? "bg-emerald-500 w-4" :
              i === wordIdx ? "bg-white w-4" : "bg-slate-700 w-2"
            }`} />
          ))}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-10">
        <p className="text-slate-500 text-xs font-bold mb-6 uppercase tracking-wider">
          Word {wordIdx + 1} of {words.length}
          {attempts > 0 && <span className="ml-3 text-slate-600">· attempt {attempts}</span>}
        </p>

        {/* Word card */}
        <div className="bg-slate-800 rounded-3xl border border-slate-700 p-8 w-full max-w-sm text-center mb-6">
          <p className="text-5xl font-black text-white mb-2 indic-text">{word.mr}</p>
          <p className="text-lg text-slate-400 font-semibold">{word.roman}</p>
          <p className="text-sm text-slate-500 mt-1">{word.en}</p>
        </div>

        {/* TTS error */}
        {ttsError && (
          <p className="text-red-400 text-xs mb-4 bg-red-950 border border-red-800 rounded-xl px-4 py-2">{ttsError}</p>
        )}

        {/* Result feedback */}
        {(stage === "correct" || stage === "wrong") && transcript && (
          <div className={`w-full max-w-sm rounded-2xl border p-4 mb-5 text-center ${
            stage === "correct"
              ? "bg-emerald-950 border-emerald-700"
              : "bg-red-950 border-red-800"
          }`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              {stage === "correct"
                ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                : <XCircle className="w-5 h-5 text-red-400" />}
              <span className={`font-bold text-sm ${stage === "correct" ? "text-emerald-300" : "text-red-300"}`}>
                {stage === "correct" ? "Sarvam AI understood you!" : "Not quite — say it again"}
              </span>
            </div>
            <p className="text-slate-400 text-xs mb-1">AI heard:</p>
            <p className="text-white font-bold text-xl indic-text">{transcript || "—"}</p>
            {stage === "wrong" && (
              <p className="text-slate-500 text-xs mt-2">
                Correct: <span className="text-slate-300 font-semibold indic-text">{word.mr}</span> · {word.roman}
              </p>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col items-center gap-3 w-full max-w-sm">

          {/* Hear it — always available except while recording/processing */}
          {stage !== "recording" && stage !== "processing" && (
            <button
              onClick={hearWord}
              disabled={stage === "playing"}
              className="w-full flex items-center justify-center gap-3 bg-indigo-700 hover:bg-indigo-600 disabled:opacity-40 text-white font-bold py-3 rounded-2xl transition-colors"
            >
              {stage === "playing"
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Playing…</>
                : <><Volume2 className="w-5 h-5" /> Hear it</>}
            </button>
          )}

          {/* Recording states */}
          {stage === "idle" && (
            <button
              onClick={startRecording}
              className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl transition-colors text-lg"
            >
              <Mic className="w-6 h-6" />
              {attempts === 0 ? "Say it in Marathi" : "Try again"}
            </button>
          )}

          {stage === "recording" && (
            <button
              onClick={stopRecording}
              className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-400 text-white font-black py-4 rounded-2xl transition-colors text-lg animate-pulse"
            >
              <div className="w-3 h-3 bg-white rounded-full" />
              Recording… tap to stop
            </button>
          )}

          {stage === "processing" && (
            <div className="w-full flex items-center justify-center gap-3 bg-slate-700 text-slate-300 font-bold py-4 rounded-2xl text-lg">
              <Loader2 className="w-6 h-6 animate-spin" /> Listening to you…
            </div>
          )}

          {/* Wrong: ONLY try again — no skip */}
          {stage === "wrong" && (
            <button
              onClick={tryAgain}
              className="w-full flex items-center justify-center gap-3 bg-amber-600 hover:bg-amber-500 text-white font-black py-4 rounded-2xl transition-colors text-lg"
            >
              <RotateCcw className="w-5 h-5" /> Say it again
            </button>
          )}

          {/* Correct: advance */}
          {stage === "correct" && (
            <button
              onClick={next}
              className="w-full flex items-center justify-center gap-2 bg-white text-slate-900 font-black py-3 rounded-2xl hover:bg-slate-100 transition-colors"
            >
              {isLast ? "Finish lesson →" : "Next word →"}
            </button>
          )}

        </div>
      </main>
    </div>
  );
}
