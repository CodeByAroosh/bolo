import Link from "next/link";
import { Mic, Lock, Star, Flame, Gem, Heart } from "lucide-react";

const marathiUnit = {
  id: "t1u1",
  title: "नमस्कार!",
  titleRoman: "Namaskaar!",
  titleEn: "Greetings & Introductions",
  status: "available",
  tier: "A1 · Explorer",
};

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-black text-xl text-emerald-600">बो Bolo</Link>
          <div className="flex items-center gap-3 text-sm font-semibold">
            <span className="flex items-center gap-1 text-amber-500"><Flame className="w-4 h-4 fill-amber-500" /> 1</span>
            <span className="flex items-center gap-1 text-cyan-500"><Gem className="w-4 h-4 fill-cyan-400" /> 50</span>
            <span className="flex items-center gap-1 text-red-500"><Heart className="w-4 h-4 fill-red-400" /> 5</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Language Badge */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900">मराठी</h1>
            <p className="text-slate-500 text-sm font-medium">Marathi · Learning Path</p>
          </div>
          <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
            Sarvam AI Powered
          </span>
        </div>

        {/* Tier 0 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-indigo-200" />
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest px-2">pre-A1 · Akshar (Script)</span>
            <div className="h-px flex-1 bg-indigo-200" />
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4 opacity-70">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center">
              <Lock className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-700">देवनागरी आणि मुळाक्षरे</p>
              <p className="text-xs text-slate-400 mt-0.5">Script Bootcamp · Complete A1 first</p>
            </div>
            <span className="text-xs font-semibold text-slate-400 border border-slate-200 px-2 py-1 rounded-full">Locked</span>
          </div>
        </div>

        {/* Tier 1 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-emerald-200" />
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest px-2">A1 · Explorer</span>
            <div className="h-px flex-1 bg-emerald-200" />
          </div>

          {/* Active Unit */}
          <Link href="/learn/t1u1" className="block">
            <div className="bg-white rounded-2xl border-2 border-emerald-400 p-4 flex items-center gap-4 shadow-lg shadow-emerald-100 hover:shadow-emerald-200 transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full translate-x-8 -translate-y-8 pointer-events-none" />
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-400/30 flex-shrink-0 z-10">
                <span className="text-white font-black text-xl">1</span>
              </div>
              <div className="flex-1 z-10">
                <div className="flex items-center gap-2">
                  <p className="font-black text-slate-900 text-lg">नमस्कार!</p>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Start here</span>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">Greetings · Introductions · आहे</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-slate-400 flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /> 6 words</span>
                  <span className="text-xs text-slate-400">2 patterns</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1"><Mic className="w-3 h-3 text-emerald-500" /> 3 voice turns</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 z-10">
                <span className="text-emerald-600 text-lg font-black">›</span>
              </div>
            </div>
          </Link>

          {/* Locked units */}
          {[
            { title: "माझे कुटुंब", en: "Family & Possession" },
            { title: "जेवण आणि खरेदी", en: "Food & Numbers" },
            { title: "शहरात आणि पत्ता", en: "Directions in the City" },
            { title: "रोजचा दिवस", en: "Daily Routine & Time" },
          ].map((unit, i) => (
            <div key={i} className="mt-3 bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4 opacity-50">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Lock className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="font-bold text-slate-600">{unit.title}</p>
                <p className="text-xs text-slate-400">{unit.en} · Complete Unit 1 first</p>
              </div>
            </div>
          ))}
        </div>

        {/* API Status */}
        <div className="mt-6 p-4 bg-white rounded-2xl border border-slate-200">
          <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Sarvam AI Backend</p>
          <a href="/api/health/sarvam" target="_blank"
            className="text-sm text-emerald-600 font-semibold hover:underline flex items-center gap-1">
            ✓ Check live API status → /api/health/sarvam
          </a>
        </div>
      </main>
    </div>
  );
}
