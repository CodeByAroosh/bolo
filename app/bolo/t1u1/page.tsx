"use client";

import Link from "next/link";
import { ArrowLeft, Mic, Volume2, Loader2, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { useState, useRef } from "react";

const words = [
  { mr: "नमस्कार", roman: "Namaskaar", en: "Hello / Greetings" },
  { mr: "धन्यवाद", roman: "Dhanyavaad", en: "Thank you" },
  { mr: "माफ करा", roman: "Maaf karaa", en: "Sorry / Excuse me" },
  { mr: "माझे नाव", roman: "Maaze naav", en: "My name" },
  { mr: "आहे", roman: "Aahe", en: "Is / Am / Are" },
  { mr: "ठीक आहे", roman: "Theek aahe", en: "I'm fine / OK" },
];

type Stage = "idle" | "playing" | "recording" | "processing" | "result";

function normalize(s: string) {
  return s.trim().replace(/[।.,!?]/g, "").toLowerCase();
}

export default function BoloPage() {
  const [wordIdx, setWordIdx] = useState(0);
  const [stage, setStage] = useState<Stage>("idle");
  const [transcript, setTranscript] = useState("");
  const [done, setDone] = useState(false);
  const [scores, setScores] = useState<boolean[]>([]);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const word = words[wordIdx];
  const isLast = wordIdx === words.length - 1;

  async function hearWord() {
    setStage("playing");
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: word.mr }),
      });
      if (!res.ok) throw new Error("TTS failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      await new Promise<void>((resolve) => {
        audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
        audio.play();
      });
    } catch (e) {
      console.error(e);
    } finally {
      setStage("idle");
    }
  }

  async function startRecording() {
    setTranscript("");
    setStage("recording");
    chunksRef.current = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
        const heard = data.transcript ?? "";
        setTranscript(heard);
        const correct = normalize(heard).includes(normalize(word.mr)) ||
          normalize(word.mr).includes(normalize(heard)) ||
          normalize(heard) === normalize(word.mr);
        setScores((s) => [...s, correct]);
      } catch (e) {
        console.error(e);
        setTranscript("(could not transcribe)");
        setScores((s) => [...s, false]);
      }
      setStage("result");
    };
    mr.start();
  }

  function stopRecording() {
    mediaRef.current?.stop();
  }

  function next() {
    if (isLast) { setDone(true); return; }
    setWordIdx((i) => i + 1);
    setStage("idle");
    setTranscript("");
  }

  function restart() {
    setWordIdx(0);
    setStage("idle");
    setTranscript("");
    setScores([]);
    setDone(false);
  }

  if (done) {
    const correct = scores.filter(Boolean).length;
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-4">{correct === words.length ? "🎉" : "💪"}</div>
        <h1 className="text-3xl font-black text-white mb-2">
          {correct === words.length ? "Perfect!" : `${correct} / ${words.length} correct`}
        </h1>
        <p className="text-slate-400 mb-8 text-sm">
          {correct === words.length
            ? "You nailed every word! Sarvam AI heard you clearly."
            : "Keep practicing — Marathi takes a little time to click."}
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <button onClick={restart}
            className="flex items-center gap-2 bg-emerald-500 text-white font-black px-6 py-3 rounded-xl hover:bg-emerald-400 transition-colors">
            <RotateCcw className="w-4 h-4" /> Try again
          </button>
          <Link href="/learn/t1u1"
            className="flex items-center gap-2 bg-white/10 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to lesson
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 h-14">
        <Link href="/learn/t1u1" className="p-2 rounded-xl hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </Link>
        <div className="flex-1">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Voice Practice</p>
          <p className="text-sm text-slate-300 font-bold">Unit 1 · नमस्कार!</p>
        </div>
        {/* Progress dots */}
        <div className="flex gap-1">
          {words.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-colors ${
              i < wordIdx ? "bg-emerald-500" :
              i === wordIdx ? "bg-white" : "bg-slate-700"
            }`} />
          ))}
        </div>
      </header>

      {/* Main card */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-12">
        <p className="text-slate-500 text-sm font-semibold mb-8 uppercase tracking-wider">
          Word {wordIdx + 1} of {words.length}
        </p>

        {/* Word card */}
        <div className="bg-slate-800 rounded-3xl border border-slate-700 p-8 w-full max-w-sm text-center mb-8">
          <p className="text-5xl font-black text-white mb-2 indic-text">{word.mr}</p>
          <p className="text-lg text-slate-400 font-semibold">{word.roman}</p>
          <p className="text-sm text-slate-500 mt-1">{word.en}</p>
        </div>

        {/* Result */}
        {stage === "result" && transcript && (
          <div className={`w-full max-w-sm rounded-2xl border p-4 mb-6 text-center ${
            scores[scores.length - 1]
              ? "bg-emerald-950 border-emerald-700"
              : "bg-red-950 border-red-700"
          }`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              {scores[scores.length - 1]
                ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                : <XCircle className="w-5 h-5 text-red-400" />}
              <span className={`font-bold text-sm ${scores[scores.length - 1] ? "text-emerald-300" : "text-red-300"}`}>
                {scores[scores.length - 1] ? "Great pronunciation!" : "Not quite — try again"}
              </span>
            </div>
            <p className="text-slate-400 text-xs mb-1">Sarvam AI heard:</p>
            <p className="text-white font-bold text-lg indic-text">{transcript || "—"}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col items-center gap-4 w-full max-w-sm">
          {/* Hear it */}
          <button
            onClick={hearWord}
            disabled={stage !== "idle" && stage !== "result"}
            className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold py-3 rounded-2xl transition-colors"
          >
            {stage === "playing"
              ? <Loader2 className="w-5 h-5 animate-spin" />
              : <Volume2 className="w-5 h-5" />}
            Hear it
          </button>

          {/* Mic button */}
          {stage !== "recording" ? (
            <button
              onClick={startRecording}
              disabled={stage === "playing" || stage === "processing"}
              className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-black py-4 rounded-2xl transition-colors text-lg"
            >
              {stage === "processing"
                ? <><Loader2 className="w-6 h-6 animate-spin" /> Listening…</>
                : <><Mic className="w-6 h-6" /> Say it in Marathi</>}
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-400 text-white font-black py-4 rounded-2xl transition-colors text-lg animate-pulse"
            >
              <div className="w-3 h-3 bg-white rounded-full" />
              Recording… tap to stop
            </button>
          )}

          {/* Next */}
          {stage === "result" && (
            <button
              onClick={next}
              className="w-full flex items-center justify-center gap-2 bg-white text-slate-900 font-black py-3 rounded-2xl hover:bg-slate-100 transition-colors"
            >
              {isLast ? "See results →" : "Next word →"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
