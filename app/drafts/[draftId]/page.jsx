import { notFound, redirect } from "next/navigation";

import { getUserFromCookies } from "@/lib/getUser";
import { getDraft, getBlocksForDraft } from "@/lib/db";
import { summarizeBlocks } from "@/actions/blocks/summarizeBlocks";
import GeneratedArticle from "@/components/GeneratedArticle";

export default async function DraftPage({ params }) {
  const user = await getUserFromCookies();
  if (!user) {
    return redirect("/");
  }

  const { draftId } = await params;
  await summarizeBlocks(draftId);

  const blocks = await getBlocksForDraft(draftId);
  let draft;

  try {
    const awaitedParams = await params;
    const draftId = awaitedParams.draftId;
    draft = await getDraft(draftId);
  } catch (e) {
    console.error(e);
    notFound();
  }

  if (!draft) {
    notFound();
  }

  return (
    <>
      <h1 className="text-3xl">{draft.name}</h1>
      <GeneratedArticle blocks={blocks} />
    </>
  );
}
