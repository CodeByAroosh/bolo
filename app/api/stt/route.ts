import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const key = process.env.SARVAM_API_KEY;
  if (!key) return NextResponse.json({ error: "No API key" }, { status: 500 });

  const formData = await req.formData();
  const file = formData.get("file") as Blob | null;
  if (!file) return NextResponse.json({ error: "No audio file" }, { status: 400 });

  const sarvamForm = new FormData();
  sarvamForm.append("file", file, "recording.webm");
  sarvamForm.append("model", "saaras:v4");
  sarvamForm.append("language_code", "mr-IN");
  sarvamForm.append("with_timestamps", "false");

  const res = await fetch("https://api.sarvam.ai/speech-to-text", {
    method: "POST",
    headers: {
      "api-subscription-key": key,
    },
    body: sarvamForm,
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json({ transcript: data.transcript ?? "" });
}
