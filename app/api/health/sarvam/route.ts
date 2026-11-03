import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const key = process.env.SARVAM_API_KEY;

  if (!key) {
    return NextResponse.json(
      { status: "error", message: "SARVAM_API_KEY not set" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch("https://api.sarvam.ai/v2/models", {
      headers: {
        "api-subscription-key": key,
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { status: "error", message: `Sarvam API error ${res.status}: ${text}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const models: string[] = (data?.data ?? []).map(
      (m: { id?: string }) => m.id ?? String(m)
    );

    return NextResponse.json({
      status: "ok",
      keyPresent: true,
      modelCount: models.length,
      models,
      checkedAt: new Date().toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { status: "error", message },
      { status: 502 }
    );
  }
}
