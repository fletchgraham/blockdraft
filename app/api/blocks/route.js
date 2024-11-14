import { getBlocks, getInboxBlocks } from "@/lib/blocks";
import { getUserFromCookies } from "@/lib/getUser";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUserFromCookies();
  const blocks = await getInboxBlocks(user.userId);
  return NextResponse.json(blocks);
}
