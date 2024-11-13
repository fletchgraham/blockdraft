// app/api/lists/route.js
import { getDrafts } from "@/lib/drafts";
import { getUserFromCookies } from "@/lib/getUser";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUserFromCookies();
  const drafts = await getDrafts(user.userId);
  return NextResponse.json(drafts);
}
