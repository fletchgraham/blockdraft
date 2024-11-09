import { notFound, redirect } from "next/navigation";
import { getUserFromCookies } from "../../../lib/getUser";
import { getDraft } from "../../../lib/drafts";
import BlockList from "../../../components/BlockList";
import { getBlocksForDraft } from "../../../lib/blocks";

export default async function DraftPage({ params }) {
  const user = await getUserFromCookies();
  if (!user) {
    return redirect("/");
  }

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

  if (draft.userId !== user.userId) {
    notFound();
  }

  return (
    <div>
      <h1>{draft.name}</h1>
      <BlockList blocks={await getBlocksForDraft(draft._id)} />
    </div>
  );
}
