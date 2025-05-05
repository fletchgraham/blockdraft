import { NextResponse } from "next/server";
import { importBlock } from "@/lib/db/blocks";

const ALLOWED_KEYS = JSON.parse(process.env.ZAPIER_ALLOWED_KEYS || "{}");

export async function POST(req) {
  try {
    const { url, key } = await req.json();

    if (!key || !url) {
      return NextResponse.json(
        { error: "Missing key or url" },
        { status: 400 }
      );
    }

    const userId = ALLOWED_KEYS[key];
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { success, id } = await importBlock(userId, url);
    return NextResponse.json({ success, id });
  } catch (err) {
    console.error("Import API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
