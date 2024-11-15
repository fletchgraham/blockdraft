import { redirect } from "next/navigation";
import { getUserFromCookies } from "@/lib/getUser";
import { getBlocksForDraft } from "@/lib/blocks";
import GenerateProgress from "@/components/GenerateProgress";

export default async function GeneratedPage({ params }) {
  const user = await getUserFromCookies();
  if (!user) {
    redirect("/");
  }

  const draftId = await params.draftId;
  const blocks = await getBlocksForDraft(params.draftId);

  // get blocks with url prop
  const blocksWithUrl = blocks.filter((block) => block.url);
  const blocksWithUrlandSummary = blocksWithUrl.map(
    async (block) => block.summary
  );

  return (
    <div>
      <GenerateProgress initialComplete={0} initialTotal={blocks.length} />
      <h1>Generated Page for {draftId}</h1>
      <p>{`URL Blocks Summarized: ${blocksWithUrlandSummary.length} / ${blocksWithUrl.length}`}</p>
      <ul>
        {blocks.map((block) => (
          <li key={block._id.toString()}>{block.title || block.content}</li>
        ))}
      </ul>
    </div>
  );
}
