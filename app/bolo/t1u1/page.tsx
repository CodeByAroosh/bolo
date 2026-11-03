import Link from "next/link";
import { Mic, ArrowLeft } from "lucide-react";

export default function BoloPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center mb-6">
        <Mic className="w-10 h-10 text-emerald-400" />
      </div>
      <h1 className="text-3xl font-black text-white mb-2">Bolo Voice Practice</h1>
      <p className="text-slate-400 mb-2">
        Unit 1 · नमस्कार!
      </p>
      <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xl px-5 py-3 text-sm font-medium mb-8 max-w-sm">
        🎙️ Voice engine coming soon — powered by Sarvam Saaras STT + Bulbul TTS
      </div>
      <Link
        href="/learn/t1u1"
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to lesson
      </Link>
    </div>
  );
}
