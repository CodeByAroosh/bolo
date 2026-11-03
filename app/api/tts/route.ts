import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const key = process.env.SARVAM_API_KEY;
  if (!key) return NextResponse.json({ error: "No API key" }, { status: 500 });

  const { text } = await req.json();
  if (!text) return NextResponse.json({ error: "No text" }, { status: 400 });

  const res = await fetch("https://api.sarvam.ai/text-to-speech", {
    method: "POST",
    headers: {
      "api-subscription-key": key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: [text],
      target_language_code: "mr-IN",
      speaker: "meera",
      model: "bulbul:v4-flash",
      enable_preprocessing: true,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: res.status });
  }

  const data = await res.json();
  const audio = data.audios?.[0];
  if (!audio) return NextResponse.json({ error: "No audio returned" }, { status: 500 });

  const buf = Buffer.from(audio, "base64");
  return new NextResponse(buf, {
    headers: {
      "Content-Type": "audio/wav",
      "Content-Length": String(buf.length),
    },
  });
}
