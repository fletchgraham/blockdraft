import { redirect } from "next/navigation";
import { getUserFromCookies } from "@/lib/getUser";
import { getBlocksForDraft } from "@/lib/blocks";
import { summarizeBlocks } from "@/actions/blocks/summarizeBlocks";
import GeneratedArticle from "@/components/GeneratedArticle";

export default async function GeneratedPage({ params }) {
  const user = await getUserFromCookies();
  if (!user) {
    redirect("/");
  }

  const draftId = params.draftId;

  await summarizeBlocks(draftId);

  const blocks = await getBlocksForDraft(draftId);

  // scrub blocks of user id
  blocks.forEach((block) => {
    delete block.userId;
  });

  // convert blocks to simple objects
  blocks.forEach((block) => {
    block._id = block._id.toString();
    if (block.draftId) {
      block.draftId = block.draftId.toString();
    }
  });

  return <GeneratedArticle startingBlocks={blocks} />;
}
