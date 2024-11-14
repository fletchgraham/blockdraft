import { getBlocks, getBlocksForDraft } from "@/lib/blocks";
import { getDrafts } from "@/lib/drafts";
import { getUserFromCookies } from "@/lib/getUser";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUserFromCookies();
  const drafts = await getDrafts(user.userId);

  // Use Promise.all to ensure all blocks are fetched before continuing
  await Promise.all(
    drafts.map(async (draft) => {
      draft.blocks = await getBlocksForDraft(draft._id.toString());
    })
  );

  return NextResponse.json(drafts);
}
